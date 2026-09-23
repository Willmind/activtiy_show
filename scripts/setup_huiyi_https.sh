#!/usr/bin/env bash
# Run interactively as root after ICP approval, DNS setup and opening TCP 80/443.
# Keeps the existing 127.0.0.1:8081 deployment health check unchanged.
set -Eeuo pipefail
export PATH=/usr/sbin:/usr/bin:/sbin:/bin
[[ $EUID -eq 0 ]] || { echo '请使用 sudo bash 执行此脚本。'; exit 1; }
[[ -t 0 ]] || { echo '请在腾讯云终端交互执行，证书申请需要填写邮箱和阅读条款。'; exit 1; }

domain=huiyi.willmindgg.cn
site=/etc/nginx/sites-available/huiyi-public
enabled=/etc/nginx/sites-enabled/huiyi-public
webroot=/var/lib/huiyi-acme
certdir=/etc/letsencrypt/live/huiyi.willmindgg.cn
marker='# Managed by setup_huiyi_https.sh'

nginx -t
curl --fail --silent --show-error --max-time 10 http://127.0.0.1:8081/ -o /dev/null
test -r /var/www/huiyi-deploy/current/index.html
grep -q '粤ICP备2026144544号-1' /var/www/huiyi-deploy/current/index.html || {
  echo '服务器页面还未更新备案号，请先等待 GitHub 自动部署完成。'; exit 1;
}
if [[ -e "$site" ]] && ! grep -Fxq "$marker" "$site"; then
  echo "发现其他配置：$site，请先人工核对，未覆盖。"; exit 1
fi
if [[ -e "$enabled" || -L "$enabled" ]]; then
  [[ -L "$enabled" && $(readlink "$enabled") == "$site" ]] || {
    echo '现有 huiyi-public 启用方式不同，请先核对。'; exit 1;
  }
fi

backup=$(mktemp -d /root/huiyi-https-backup.XXXXXX)
chmod 700 "$backup"
cp -a /etc/nginx "$backup/nginx"
echo "Nginx 配置备份：$backup/nginx"
work=$(mktemp -d)
trap 'rm -rf "$work"' EXIT

# Each update validates before reload; failure restores only this new site.
install_site() {
  local had_site=0 had_link=0
  if [[ -e "$site" ]]; then
    cp -a "$site" "$work/previous.conf"
    had_site=1
  fi
  if [[ -L "$enabled" ]]; then had_link=1; fi
  install -m 644 "$1" "$site"
  ln -sfn "$site" "$enabled"
  if nginx -t && systemctl reload nginx; then return 0; fi
  if (( had_site )); then cp -a "$work/previous.conf" "$site"; else rm -f "$site"; fi
  if (( ! had_link )); then rm -f "$enabled"; fi
  nginx -t && systemctl reload nginx
  echo '配置未能加载，已恢复本次修改前的站点配置。'
  return 1
}

apt-get update
apt-get install -y certbot
install -d -m 755 "$webroot/.well-known/acme-challenge"
if command -v ufw >/dev/null && LC_ALL=C ufw status | grep -q '^Status: active'; then
  ufw allow 80/tcp
  ufw allow 443/tcp
fi

# Until a certificate is issued, only expose the ACME challenge endpoint.
# On repeat execution, retain the existing HTTPS service.
if [[ ! -e "$site" ]]; then
  cat > "$work/bootstrap.conf" <<'NGINX'
# Managed by setup_huiyi_https.sh
server {
    listen 80;
    server_name huiyi.willmindgg.cn;
    server_tokens off;
    location ^~ /.well-known/acme-challenge/ {
        root /var/lib/huiyi-acme;
        default_type text/plain;
        try_files $uri =404;
    }
    location / { return 503; }
}
NGINX
  install_site "$work/bootstrap.conf"
fi

echo '接下来申请免费 HTTPS 证书：按提示输入邮箱、阅读并选择是否同意服务条款。'
certbot certonly --webroot --webroot-path "$webroot" \
  --cert-name "$domain" -d "$domain" --keep-until-expiring
test -r "$certdir/fullchain.pem"
test -r "$certdir/privkey.pem"

cat > "$work/https.conf" <<'NGINX'
# Managed by setup_huiyi_https.sh
server {
    listen 80;
    server_name huiyi.willmindgg.cn;
    server_tokens off;
    location ^~ /.well-known/acme-challenge/ {
        root /var/lib/huiyi-acme;
        default_type text/plain;
        try_files $uri =404;
    }
    location / { return 301 https://huiyi.willmindgg.cn$request_uri; }
}
server {
    listen 443 ssl;
    server_name huiyi.willmindgg.cn;
    root /var/www/huiyi-deploy/current;
    index index.html;
    autoindex off;
    server_tokens off;
    ssl_certificate /etc/letsencrypt/live/huiyi.willmindgg.cn/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/huiyi.willmindgg.cn/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    add_header X-Content-Type-Options nosniff always;
    add_header Referrer-Policy strict-origin-when-cross-origin always;
    location / { try_files $uri $uri.html $uri/ =404; }
    location ~ /\. { deny all; }
}
NGINX
install_site "$work/https.conf"

install -d -m 755 /etc/letsencrypt/renewal-hooks/deploy
cat > "$work/reload-nginx" <<'HOOK'
#!/bin/sh
set -e
/usr/sbin/nginx -t
/usr/bin/systemctl reload nginx
HOOK
install -m 755 "$work/reload-nginx" /etc/letsencrypt/renewal-hooks/deploy/huiyi-nginx
systemctl enable --now certbot.timer
systemctl is-active --quiet certbot.timer

for path in / /activities/qixi/ /resume/zeng-huiyi-resume.pdf; do
  curl --fail --silent --show-error --max-time 15 \
    --resolve "$domain:443:127.0.0.1" "https://$domain$path" -o /dev/null
done
curl --fail --silent --show-error --max-time 10 http://127.0.0.1:8081/ -o /dev/null
echo "HTTPS 本机检查通过：https://$domain"
echo '自动续期计时器已开启，正在测试续期流程……'
certbot renew --cert-name "$domain" --dry-run
echo '全部配置完成。请再从手机流量和 Wi-Fi 打开正式网址检查。'
