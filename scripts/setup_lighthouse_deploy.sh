#!/usr/bin/env bash
# 在已配置 Nginx 本机预览的 Ubuntu 服务器上运行一次。
set -euo pipefail

[[ $EUID -eq 0 ]] || { echo '请使用 sudo bash 运行此脚本。'; exit 1; }
public_key_file=${1:-/home/ubuntu/lighthouse-deploy.pub}
test -f "$public_key_file"
ssh-keygen -l -f "$public_key_file" > /dev/null
public_key=$(cat "$public_key_file")
[[ "$public_key" =~ ^ssh-ed25519\ [A-Za-z0-9+/=]+(\ [^[:cntrl:]]*)?$ ]] || {
    echo '需要单行 ED25519 公钥。'; exit 1;
}
test -f /var/www/huiyi/index.html
test -f /etc/nginx/sites-available/huiyi
systemctl is-active --quiet nginx

deploy_user=huiyi-deploy
deploy_home=/home/huiyi-deploy
deploy_root=/var/www/huiyi-deploy
if ! id "$deploy_user" > /dev/null 2>&1; then
    useradd --create-home --shell /bin/bash "$deploy_user"
fi
[[ $(getent passwd "$deploy_user" | cut -d: -f6) == "$deploy_home" ]]
[[ $(id -u "$deploy_user") -ne 0 ]]
install -d -o "$deploy_user" -g "$deploy_user" -m 700 "$deploy_home/.ssh"
authorized_keys="$deploy_home/.ssh/authorized_keys"
touch "$authorized_keys"
authorized_line="restrict $public_key"
if ! grep -Fqx -- "$authorized_line" "$authorized_keys"; then
    printf '%s\n' "$authorized_line" >> "$authorized_keys"
fi
chown "$deploy_user:$deploy_user" "$authorized_keys"
chmod 600 "$authorized_keys"

install -d -o "$deploy_user" -g "$deploy_user" -m 755 "$deploy_root" "$deploy_root/releases"
install -d -o "$deploy_user" -g "$deploy_user" -m 700 "$deploy_root/uploads"
if [[ ! -L "$deploy_root/current" ]]; then
    [[ ! -e "$deploy_root/current" ]] || { echo 'current 已存在且不是符号链接。'; exit 1; }
    install -d -m 755 "$deploy_root/releases/initial"
    cp -R /var/www/huiyi/. "$deploy_root/releases/initial/"
    chown -R "$deploy_user:$deploy_user" "$deploy_root/releases/initial"
    chmod -R u=rwX,go=rX "$deploy_root/releases/initial"
    ln -s releases/initial "$deploy_root/current"
    chown -h "$deploy_user:$deploy_user" "$deploy_root/current"
fi

config=/etc/nginx/sites-available/huiyi
backup="/etc/nginx/huiyi-before-actions-$(date +%Y%m%d%H%M%S).conf"
cp -p "$config" "$backup"
python3 - <<'PY'
from pathlib import Path
file = Path('/etc/nginx/sites-available/huiyi')
text = file.read_text()
old = 'root /var/www/huiyi;'
new = 'root /var/www/huiyi-deploy/current;'
if old not in text and new not in text:
    raise SystemExit('Nginx 的网站目录与预期不符，请先确认现有配置。')
if 'listen 127.0.0.1:8081;' not in text:
    raise SystemExit('未找到用于内部检查的 8081 监听配置。')
file.write_text(text.replace(old, new))
PY
if ! nginx -t || ! systemctl reload nginx || ! curl --fail --silent --output /dev/null http://127.0.0.1:8081/; then
    cp -p "$backup" "$config"
    nginx -t && systemctl reload nginx
    echo '检查失败，已恢复原 Nginx 配置。'
    exit 1
fi

printf '\n服务器初始化完成。部署账号：%s（未授予 sudo 权限）\n' "$deploy_user"
printf '原网站备份保留在 /var/www/huiyi，当前仅修改文件目录，不改变访问端口。\n'
printf '\n请将下面一整行保存为 GitHub Secret：LIGHTHOUSE_KNOWN_HOSTS\n'
awk '{print "129.204.51.116 " $1 " " $2}' /etc/ssh/ssh_host_ed25519_key.pub
