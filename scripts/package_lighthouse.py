"""Validate a root-path static build and package it for the Lighthouse server."""
import argparse
import json
from pathlib import Path
import tarfile


def package(output):
    project = Path(__file__).resolve().parents[1]
    build = project / 'dist/client'
    slugs = json.loads((project / 'data/images.json').read_text())
    required = ['index.html', 'resume/zeng-huiyi-resume.pdf']
    required += [f'activities/{slug}/index.html' for slug in slugs]
    for name in required:
        file = build / name
        if not file.is_file() or file.stat().st_size == 0:
            raise ValueError(f'缺少构建文件：{name}')
    for file in build.rglob('*.html'):
        if '/activtiy_show/' in file.read_text():
            raise ValueError('构建包含 GitHub Pages 子路径，请使用空 NEXT_PUBLIC_BASE_PATH 重建。')
    if not (build / 'resume/zeng-huiyi-resume.pdf').read_bytes().startswith(b'%PDF-'):
        raise ValueError('简历不是有效的 PDF 文件。')
    files = []
    for file in sorted(build.rglob('*')):
        name = file.relative_to(build).as_posix()
        if file.is_symlink():
            raise ValueError(f'不允许打包符号链接：{name}')
        if name == '.assetsignore' or file.relative_to(build).parts[0] == '.vite':
            continue
        if file.is_file():
            if any(part.startswith('.') and part != '.nojekyll' for part in file.relative_to(build).parts):
                raise ValueError(f'不允许打包隐藏文件：{name}')
            files.append(file)
    output.parent.mkdir(parents=True, exist_ok=True)
    with tarfile.open(output, 'w:gz') as archive:
        for file in files:
            info = archive.gettarinfo(str(file), arcname=file.relative_to(build).as_posix())
            info.uid = info.gid = 0
            info.uname = info.gname = ''
            info.mode = 0o644
            with file.open('rb') as stream:
                archive.addfile(info, stream)
    print(f'已打包 {len(slugs)} 个活动、{len(files)} 个文件：{output.stat().st_size:,} 字节')


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('output', type=Path)
    package(parser.parse_args().output)
