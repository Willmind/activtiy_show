"""Package the validated static export for EdgeOne Pages direct upload."""
from pathlib import Path
import argparse
import json
import zipfile

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('output', type=Path)
args = parser.parse_args()
root = Path(__file__).resolve().parents[1]
build = root / 'dist/client'
assert (build / 'index.html').is_file(), 'Run npm run build first.'
images = json.loads((root / 'data/images.json').read_text())
rewrites = []
for slug in images:
    destination = f'/activities/{slug}.html'
    assert (build / destination.lstrip('/')).is_file(), destination
    for source in (f'/activities/{slug}', f'/activities/{slug}/'):
        rewrites.append({'source': source, 'destination': destination})
files = sorted(path for path in build.rglob('*') if path.is_file())
assert len(files) + 1 <= 20000
assert all(path.stat().st_size < 25 * 1024 * 1024 for path in files)
args.output.parent.mkdir(parents=True, exist_ok=True)
with zipfile.ZipFile(args.output, 'w', zipfile.ZIP_DEFLATED) as archive:
    for path in files:
        relative = path.relative_to(build).as_posix()
        assert 'dragon-boat' not in relative and 'new-office' not in relative
        archive.write(path, relative)
    archive.writestr('edgeone.json', json.dumps({'rewrites': rewrites}, indent=2) + '\n')
with zipfile.ZipFile(args.output) as archive:
    assert archive.testzip() is None
    assert 'index.html' in archive.namelist()
    config = json.loads(archive.read('edgeone.json'))
    assert all(rule['destination'].lstrip('/') in archive.namelist() for rule in config['rewrites'])
print(f'{args.output.resolve()} ({args.output.stat().st_size:,} bytes, {len(files) + 1} files)')
