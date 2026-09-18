#!/usr/bin/env bash
set -euo pipefail

: "${LIGHTHOUSE_HOST:?未设置服务器地址}"
: "${LIGHTHOUSE_USER:?未设置部署用户}"
: "${LIGHTHOUSE_SSH_KEY:?未设置部署私钥}"
: "${LIGHTHOUSE_KNOWN_HOSTS:?未设置服务器主机公钥}"
: "${RUNNER_TEMP:?需要 GitHub Actions 的 RUNNER_TEMP}"
: "${GITHUB_SHA:?需要提交 SHA}"
: "${GITHUB_RUN_ID:?需要工作流运行编号}"
: "${GITHUB_RUN_ATTEMPT:?需要工作流尝试编号}"

[[ "$LIGHTHOUSE_HOST" =~ ^[A-Za-z0-9][A-Za-z0-9.-]*$ ]]
[[ "$LIGHTHOUSE_USER" =~ ^[a-z_][a-z0-9_-]*$ ]]
release_id="${GITHUB_SHA}-${GITHUB_RUN_ID}-${GITHUB_RUN_ATTEMPT}"
[[ "$release_id" =~ ^[a-f0-9]{40}-[0-9]+-[0-9]+$ ]]
test -s "$RUNNER_TEMP/huiyi-site.tar.gz"

umask 077
ssh_dir=$(mktemp -d "$RUNNER_TEMP/huiyi-ssh.XXXXXX")
trap 'rm -rf -- "$ssh_dir"' EXIT
printf '%s\n' "$LIGHTHOUSE_SSH_KEY" > "$ssh_dir/key"
printf '%s\n' "$LIGHTHOUSE_KNOWN_HOSTS" > "$ssh_dir/known_hosts"
unset LIGHTHOUSE_SSH_KEY LIGHTHOUSE_KNOWN_HOSTS
ssh-keygen -y -f "$ssh_dir/key" > /dev/null
ssh-keygen -F "$LIGHTHOUSE_HOST" -f "$ssh_dir/known_hosts" > /dev/null

ssh_options=(-i "$ssh_dir/key" -o IdentitiesOnly=yes -o BatchMode=yes
    -o StrictHostKeyChecking=yes -o "UserKnownHostsFile=$ssh_dir/known_hosts"
    -o ConnectTimeout=20 -o ServerAliveInterval=15 -o ServerAliveCountMax=3)
target="${LIGHTHOUSE_USER}@${LIGHTHOUSE_HOST}"
remote_uploads=/var/www/huiyi-deploy/uploads

scp "${ssh_options[@]}" "$RUNNER_TEMP/huiyi-site.tar.gz" \
    "$target:$remote_uploads/$release_id.tar.gz"
scp "${ssh_options[@]}" scripts/lighthouse_activate.py \
    "$target:$remote_uploads/$release_id.py"
ssh "${ssh_options[@]}" "$target" \
    "python3 $remote_uploads/$release_id.py $release_id"
printf '腾讯云文件更新成功：%s\n' "$GITHUB_SHA" >> "$GITHUB_STEP_SUMMARY"
printf '自动部署仅更新网站文件，域名、HTTPS 和公网访问状态沿用服务器现有配置。\n' >> "$GITHUB_STEP_SUMMARY"
