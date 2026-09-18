"""Extract, atomically activate and health-check a static release without sudo."""
import argparse
import json
import os
from pathlib import Path, PurePosixPath
import re
import shutil
import tarfile
from urllib.request import Request, urlopen

RELEASE_ID = re.compile(r'[a-f0-9]{40}-[0-9]+-[0-9]+')
REQUIRED = ('index.html', 'activities/qixi/index.html', 'resume/zeng-huiyi-resume.pdf')


def unpack(archive_path, destination):
    with tarfile.open(archive_path, 'r:gz') as archive:
        members = archive.getmembers()
        if len(members) > 20000 or sum(member.size for member in members) > 256 * 1024 * 1024:
            raise ValueError('发布包超过大小限制。')
        names = set()
        for member in members:
            path = PurePosixPath(member.name)
            if (not member.isfile() or path.is_absolute() or '..' in path.parts
                    or not path.parts or member.name in names):
                raise ValueError(f'发布包包含不安全的路径或文件类型：{member.name}')
            names.add(member.name)
        for name in REQUIRED:
            if name not in names:
                raise ValueError(f'发布包缺少必需文件：{name}')
        for member in members:
            target = destination / member.name
            target.parent.mkdir(parents=True, exist_ok=True, mode=0o755)
            with archive.extractfile(member) as source, target.open('xb') as output:
                shutil.copyfileobj(source, output)
            target.chmod(0o644)
    for name in REQUIRED:
        if (destination / name).stat().st_size == 0:
            raise ValueError(f'发布包包含空文件：{name}')
    if not (destination / REQUIRED[-1]).read_bytes().startswith(b'%PDF-'):
        raise ValueError('发布包中的简历不是 PDF。')
    # The deploy account may use umask 077; Nginx still needs directory traversal.
    destination.chmod(0o755)
    for directory in destination.rglob('*'):
        if directory.is_dir():
            directory.chmod(0o755)


def switch(root, target):
    temporary = root / '.current.next'
    temporary.unlink(missing_ok=True)
    temporary.symlink_to(target)
    os.replace(temporary, root / 'current')


def check_health(base_url, release_id):
    with urlopen(Request(base_url + '/_deployment.json', headers={'Cache-Control': 'no-cache'}), timeout=10) as response:
        if response.status != 200 or json.load(response).get('release') != release_id:
            raise RuntimeError('Nginx 尚未提供本次发布版本。')
    for path in ('/', '/activities/qixi/', '/resume/zeng-huiyi-resume.pdf'):
        with urlopen(Request(base_url + path, method='HEAD'), timeout=10) as response:
            if response.status != 200:
                raise RuntimeError(f'发布后检查失败：{path}')


def activate(root, release_id, health_check):
    if not RELEASE_ID.fullmatch(release_id):
        raise ValueError('无效的发布编号。')
    root = root.resolve()
    current = root / 'current'
    if not current.is_symlink() or not current.is_dir():
        raise ValueError('请先执行服务器初始化脚本，建立 current 符号链接。')
    previous = os.readlink(current)
    previous_path = current.resolve()
    if previous_path.parent != root / 'releases':
        raise ValueError('当前版本不在专用发布目录内。')
    release = root / 'releases' / release_id
    archive = root / 'uploads' / f'{release_id}.tar.gz'
    if release.exists():
        raise ValueError('发布编号已存在；请重新运行工作流生成新的尝试编号。')
    release.mkdir(mode=0o755)
    switched = False
    try:
        unpack(archive, release)
        marker = release / '_deployment.json'
        marker.write_text(json.dumps({'release': release_id, 'commit': release_id.split('-')[0]}) + '\n')
        marker.chmod(0o644)
        switch(root, f'releases/{release_id}')
        switched = True
        health_check(release_id)
    except Exception:
        if switched:
            switch(root, previous)
            print('检查失败，已恢复上一版。', flush=True)
        shutil.rmtree(release)
        raise
    archive.unlink(missing_ok=True)
    (root / 'uploads' / f'{release_id}.py').unlink(missing_ok=True)
    # Only remove version directories created by this deployer; retain the
    # current version and its predecessor even if their timestamps differ.
    older = sorted((path for path in (root / 'releases').iterdir()
                    if RELEASE_ID.fullmatch(path.name) and path.is_dir() and not path.is_symlink()),
                   key=lambda path: path.stat().st_mtime, reverse=True)
    for path in older[5:]:
        if path not in (release, previous_path):
            shutil.rmtree(path)
    print(f'发布成功，已验证首页、详情、简历和版本编号：{release_id}')


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('release_id')
    args = parser.parse_args()
    activate(Path('/var/www/huiyi-deploy'), args.release_id,
             lambda release: check_health('http://127.0.0.1:8081', release))
