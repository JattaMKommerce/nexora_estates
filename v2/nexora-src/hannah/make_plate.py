"""
Hannah's plate: the seated reception photo (layout.SOURCE), saved for the web, plus the round
head-and-shoulders picture shown beside her messages.
Run: python3 make_plate.py   (needs Pillow). Then python3 make_rig.py.
"""
import os, json
from PIL import Image
from layout import SOURCE, LANDMARKS, W, H

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, '..', '..', 'public', 'nexora', 'hannah')

photo = Image.open(os.path.join(HERE, SOURCE)).convert('RGB')
assert photo.size == (W, H), 'layout.py W, H must match the photo: %r' % (photo.size,)
photo.save(os.path.join(OUT, 'hannah-plate.jpg'), quality=92, optimize=True, progressive=True)

# avatar: a square around her head and shoulders, centred on her face
P = json.load(open(os.path.join(HERE, LANDMARKS)))['pts']
cx = (P[234][0] + P[454][0]) / 2
cy = (P[10][1] + P[152][1]) / 2
face = abs(P[454][0] - P[234][0])
half = face * 1.15
box = (round(cx - half), round(cy - half * 0.95), round(cx + half), round(cy + half * 1.05))
photo.crop(box).resize((192, 192), Image.LANCZOS).save(os.path.join(OUT, 'hannah-avatar.jpg'), quality=90)
print('plate', photo.size, 'avatar box', box)
