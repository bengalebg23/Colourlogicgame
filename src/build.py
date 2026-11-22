"""Rebuild ../index.html from app_template.html + model.js + board.jpg."""
import base64, pathlib
here = pathlib.Path(__file__).parent
t = (here / 'app_template.html').read_text()
m = '\n'.join(l for l in (here / 'model.js').read_text().splitlines() if not l.startswith('if (typeof module'))
img = 'data:image/jpeg;base64,' + base64.b64encode((here / 'board.jpg').read_bytes()).decode()
(here.parent / 'index.html').write_text(t.replace('__MODEL__', m).replace('__IMG__', img))
print('index.html rebuilt')
