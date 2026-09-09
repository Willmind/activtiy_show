"""Create high-quality WebP originals and responsive portfolio assets.

Requires Pillow with libwebp. Source files are never overwritten.
"""
from pathlib import Path
from PIL import Image, ImageOps, ImageCms
from io import BytesIO
import hashlib
import json
import math
import argparse

parser = argparse.ArgumentParser(description='Convert categorized originals to WebP and generate portfolio assets.')
parser.add_argument('source', nargs='?', type=Path, default=Path(__file__).resolve().parents[1])
parser.add_argument('--site-output', type=Path)
args = parser.parse_args()
ROOT = args.source.resolve()
SITE = args.site_output.resolve() if args.site_output else ROOT / 'website'
ARCHIVE = ROOT / 'webp_out'
PUBLIC = SITE / 'public' / 'images' / 'activities'
DATA = SITE / 'data'
GROUPS = {
    '七夕': ('qixi', 2),
    '搬迁23楼': ('new-office', 2),
    '端午': ('dragon-boat', 6),
    '中秋': ('mid-autumn', 5),
    '1024程序员节': ('programmer-day', 2),
    '圣诞': ('christmas', 2),
    '开工大吉': ('kickoff', 2),
    '春节放假前下午茶': ('new-year-tea', 2),
    '夏日雪糕': ('summer', 1),
    '清明': ('qingming', 1),
}
# Keep these source groups in the local WebP archive, outside the portfolio.
ARCHIVE_ONLY_GROUPS = {'搬迁23楼', '端午'}

def normalized(path):
    image = ImageOps.exif_transpose(Image.open(path))
    icc = image.info.get('icc_profile')
    if icc:
        try:
            image = ImageCms.profileToProfile(image, ImageCms.ImageCmsProfile(BytesIO(icc)), ImageCms.createProfile('sRGB'), outputMode='RGB')
        except (OSError, ValueError):
            image = image.convert('RGB')
    else:
        image = image.convert('RGBA' if 'A' in image.getbands() else 'RGB')
    return image

def save(image, path, quality):
    path.parent.mkdir(parents=True, exist_ok=True)
    image.save(path, 'WEBP', quality=quality, method=6, exact=True)
    with Image.open(path) as check:
        check.load()
        assert check.size == image.size and check.format == 'WEBP'

def pieces(image, max_height):
    count = math.ceil(image.height / max_height)
    height = math.ceil(image.height / count)
    return [(image.crop((0,y,image.width,min(image.height,y+height))),y) for y in range(0,image.height,height)]

def main():
    manifest = {}
    originals = []
    report = []
    for group, (slug, cover_index) in GROUPS.items():
        records = []
        files = sorted(p for p in (ROOT / group).iterdir() if p.suffix.lower() in {'.jpg','.jpeg','.png'})
        for i, path in enumerate(files, 1):
            originals.append((group, path))
            if group in ARCHIVE_ONLY_GROUPS:
                continue
            image = normalized(path)
            is_long = image.height / image.width > 2.4
            # These files are website derivatives. The archive below retains full resolution.
            web = image.copy()
            if is_long:
                width = min(web.width, 1400)
                web = web.resize((width, round(web.height * width / web.width)), Image.Resampling.LANCZOS)
            else:
                web.thumbnail((2000,2000), Image.Resampling.LANCZOS)
            web_parts = pieces(web, 4500) if is_long else [(web,0)]
            assets = []
            for part, (section,y) in enumerate(web_parts,1):
                suffix = f'-part{part:02d}' if len(web_parts)>1 else ''
                name = f'{i:02d}{suffix}.webp'
                target = PUBLIC / slug / name
                save(section,target,92 if is_long else 88)
                assets.append({'src':f'/images/activities/{slug}/{name}','width':section.width,'height':section.height})
            thumb=image.copy()
            if is_long:
                thumb=thumb.crop((0,0,thumb.width,min(thumb.height,round(thumb.width*1.2))))
            thumb=ImageOps.fit(thumb,(960,720),Image.Resampling.LANCZOS,centering=(0.5,0.45))
            thumb_name=f'{i:02d}-cover.webp'
            save(thumb,PUBLIC/slug/thumb_name,85)
            records.append({'id':f'{slug}-{i:02d}','originalName':path.name,'kind':'long' if is_long else 'image','thumb':f'/images/activities/{slug}/{thumb_name}','parts':assets})
        if group in ARCHIVE_ONLY_GROUPS:
            continue
        manifest[slug]={'group':group,'cover':records[cover_index-1]['thumb'],'images':records}
        print(f'Website assets ready: {group}',flush=True)
    DATA.mkdir(parents=True,exist_ok=True)
    (DATA/'images.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n')
    for group,path in originals:
        image=normalized(path)
        # WebP cannot exceed 16383 pixels on either axis. Split the only oversized
        # source into ordered contiguous pieces, retaining every original pixel.
        assert image.width <= 16383
        chunks=pieces(image,8192) if image.height>16383 else [(image,0)]
        output=[]
        for i,(section,y) in enumerate(chunks,1):
            suffix=f'-part{i:02d}' if len(chunks)>1 else ''
            target=ARCHIVE/group/f'{path.stem}{suffix}.webp'
            save(section,target,92 if image.height/image.width>2.4 else 90)
            output.append({'path':str(target.relative_to(ROOT)),'width':section.width,'height':section.height,'offsetY':y,'bytes':target.stat().st_size})
        report.append({'source':str(path.relative_to(ROOT)),'sourceSha256':hashlib.sha256(path.read_bytes()).hexdigest(),'originalBytes':path.stat().st_size,'originalWidth':image.width,'originalHeight':image.height,'outputs':output})
        print(f'Full-resolution WebP ready: {group}/{path.name}',flush=True)
    total_in=sum(x['originalBytes'] for x in report)
    total_out=sum(y['bytes'] for x in report for y in x['outputs'])
    total_web=sum(p.stat().st_size for p in PUBLIC.rglob('*.webp'))
    summary={'sourceImages':len(report),'webpFiles':sum(len(x['outputs']) for x in report),'originalBytes':total_in,'webpBytes':total_out,'reductionPercent':round((1-total_out/total_in)*100,2),'websiteAssetBytes':total_web,'images':report}
    (ARCHIVE/'转换报告.json').write_text(json.dumps(summary,ensure_ascii=False,indent=2)+'\n')
    (ARCHIVE/'使用说明.txt').write_text('高清 WebP 图片\n\n原始 PNG/JPG 文件保持不变。按原活动分类保存，保留原始像素尺寸并校正照片方向。照片采用 quality=90，长图采用 quality=92 的有损 WebP 编码（Pillow/libwebp，method=6），清晰度并不等同于像素无损。\n\n端午/202606111007548290.png 超出 WebP 单边 16383 像素上限，按从上到下分成 part01、part02、part03，保留完整内容及原宽度。\n\n网站另外使用适当缩小、分段的 WebP 版本，位于 website/public/images/activities。转换报告列出每张原图的哈希、尺寸、输出路径和体积。\n')
    print(json.dumps({k:v for k,v in summary.items() if k!='images'},ensure_ascii=False),flush=True)

if __name__=='__main__':main()
