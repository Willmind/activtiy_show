"""Export the root static build as portable HTML with no server or CDN dependency."""
import argparse
from html import escape
from html.parser import HTMLParser
import json
import posixpath
from pathlib import Path
import shutil
import tempfile
from urllib.parse import unquote, urlsplit
import zipfile

ROOT = Path(__file__).resolve().parents[1]
BUILD = ROOT / 'dist/client'
VOID = {'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr'}


class PortableHTML(HTMLParser):
    def __init__(self, page, activity):
        super().__init__(convert_charrefs=False)
        self.page = page
        self.activity = activity
        self.output = []
        self.resources = set()
        self.skip_script = False

    def relative(self, url):
        if not url.startswith('/'):
            return url
        parsed = urlsplit(url)
        target = unquote(parsed.path).lstrip('/')
        if not target:
            target = 'index.html'
        elif (BUILD / f'{target}.html').is_file():
            target += '.html'
        if not (BUILD / target).is_file():
            raise ValueError(f'未找到资源 {url}，请先执行未设置 NEXT_PUBLIC_BASE_PATH 的 npm run build。')
        self.resources.add(target)
        result = posixpath.relpath(target, posixpath.dirname(self.page) or '.')
        return result + (f'#{parsed.fragment}' if parsed.fragment else '')

    def handle_starttag(self, tag, attrs):
        if tag == 'script':
            self.skip_script = True
            return
        if self.skip_script:
            return
        values = dict(attrs)
        if tag == 'link' and values.get('rel') in {'modulepreload', 'preload', 'prefetch'}:
            return
        rendered = []
        for key, value in attrs:
            if key.startswith('data-rsc-'):
                continue
            if value is not None:
                if key in {'src', 'href'}:
                    value = self.relative(value)
                elif key in {'srcset', 'imagesrcset'}:
                    candidates = []
                    for candidate in value.split(','):
                        url, descriptor = candidate.strip().rsplit(' ', 1)
                        candidates.append(f'{self.relative(url)} {descriptor}')
                    value = ', '.join(candidates)
            rendered.append(key if value is None else f'{key}="{escape(value, quote=True)}"')
        self.output.append(f'<{tag}{(" " + " ".join(rendered)) if rendered else ""}>')

    def handle_startendtag(self, tag, attrs):
        self.handle_starttag(tag, attrs)
        if tag not in VOID:
            self.handle_endtag(tag)

    def handle_endtag(self, tag):
        if tag == 'script':
            self.skip_script = False
            return
        if self.skip_script:
            return
        prefix = posixpath.relpath('.', posixpath.dirname(self.page) or '.')
        if tag == 'head':
            self.output.append(f'<link rel="stylesheet" href="{prefix}/offline.css">')
        if tag == 'body':
            if self.activity:
                images = [{
                    'kind': image['kind'],
                    'parts': [{**part, 'src': self.relative(part['src'])} for part in image['parts']],
                } for image in self.activity['images']]
                payload = json.dumps(images, ensure_ascii=False).replace('<', '\\u003c')
                self.output.append(f'<script type="application/json" id="offline-activity-data">{payload}</script>')
            self.output.append(f'<script src="{prefix}/offline.js" defer></script>')
        self.output.append(f'</{tag}>')

    def handle_data(self, data):
        if not self.skip_script:
            self.output.append(data)

    def handle_entityref(self, name):
        if not self.skip_script:
            self.output.append(f'&{name};')

    def handle_charref(self, name):
        if not self.skip_script:
            self.output.append(f'&#{name};')

    def handle_decl(self, decl):
        self.output.append(f'<!{decl}>')


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('output', type=Path, help='ZIP file to create; an unpacked folder is created beside it.')
    args = parser.parse_args()
    manifest = json.loads((ROOT / 'data/images.json').read_text())
    assert (BUILD / 'index.html').is_file(), '请先执行 npm run build。'
    pages = ['index.html', '404.html'] + [f'activities/{slug}.html' for slug in manifest]
    with tempfile.TemporaryDirectory(prefix='portfolio-html-') as directory:
        staging = Path(directory)
        resources = set()
        for page in pages:
            converter = PortableHTML(page, manifest.get(Path(page).stem))
            converter.feed((BUILD / page).read_text())
            target = staging / page
            target.parent.mkdir(parents=True, exist_ok=True)
            target.write_text(''.join(converter.output))
            resources.update(converter.resources)
        for resource in resources - set(pages):
            destination = staging / resource
            destination.parent.mkdir(parents=True, exist_ok=True)
            shutil.copyfile(BUILD / resource, destination)
        for name in ['offline.js', 'offline.css']:
            shutil.copyfile(ROOT / 'scripts' / name, staging / name)
        (staging / '使用说明.txt').write_text(
            '曾慧仪 · 行政活动作品集（离线 HTML）\n\n'
            '1. 完整解压 ZIP，保留所有文件和文件夹。\n'
            '2. 在电脑上双击 index.html，使用 Chrome、Edge 或 Safari 打开。\n'
            '3. 活动分类、详情、图片放大切换和简历 PDF 均可离线使用。\n'
            '4. 不要只发送 index.html；分享时请发送完整 ZIP。\n\n'
            '图片及简历都在本地文件夹中，无需 GitHub、联网、安装 Node.js 或启动服务器。\n'
            '手机的压缩包预览器可能不执行网页脚本，建议在电脑浏览器中使用离线包。\n'
            '端午和 23 楼活动未包含在本作品集中。\n'
        )
        args.output.parent.mkdir(parents=True, exist_ok=True)
        with zipfile.ZipFile(args.output, 'w', zipfile.ZIP_DEFLATED) as archive:
            for path in sorted(staging.rglob('*')):
                if path.is_file():
                    archive.write(path, path.relative_to(staging).as_posix())
        shutil.copytree(staging, args.output.with_suffix(''), dirs_exist_ok=True)
    with zipfile.ZipFile(args.output) as archive:
        assert archive.testzip() is None
    print(f'{args.output.resolve()} ({args.output.stat().st_size:,} bytes)')
    print(f'入口：{args.output.with_suffix("").resolve() / "index.html"}')


if __name__ == '__main__':
    main()
