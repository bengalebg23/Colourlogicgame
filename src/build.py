"""Rebuild ../index.html from app_template.html + model.js + board.jpg and bump version.json.

Usage: python3 src/build.py "what changed"
"""
import base64, pathlib
here = pathlib.Path(__file__).parent
t = (here / 'app_template.html').read_text()
m = '\n'.join(l for l in (here / 'model.js').read_text().splitlines() if not l.startswith('if (typeof module'))
img = 'data:image/jpeg;base64,' + base64.b64encode((here / 'board.jpg').read_bytes()).decode()
import json, sys, datetime
vf = here.parent / 'version.json'
cur = json.loads(vf.read_text()) if vf.exists() else {'version': 0}
ver = cur['version'] + 1
notes = ' '.join(sys.argv[1:]) or cur.get('notes', '')
built = datetime.datetime.now(datetime.timezone.utc).strftime('%d %b %Y %H:%M')
out = t.replace('__MODEL__', m).replace('__IMG__', img).replace('__VERSION__', str(ver)).replace('__BUILT__', built)
(here.parent / 'index.html').write_text(out)
vf.write_text(json.dumps({'version': ver, 'built': built, 'notes': notes}, indent=2) + '\n')
print(f'index.html rebuilt as version {ver} ({built})')
