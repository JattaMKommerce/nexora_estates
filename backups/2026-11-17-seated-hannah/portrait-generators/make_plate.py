"""
Hannah's reception scene: her portrait (hannah-portrait.png) placed in a 16:9 plate with the
studio backdrop extended, a soft-focus plant, shelf light and a reception counter.
Run: python3 make_plate.py   (needs Pillow). Then run make_rig.py if OX/OY/DESK changed.
"""
import random, math
import os, sys
HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, '..', '..', 'public', 'nexora', 'hannah')

from PIL import Image, ImageDraw, ImageFilter, ImageChops
W, H = 1920, 1080
OX, OY = 448, 96            # where the 1024 portrait sits in the plate
DESK = 960                  # plate y of the counter's top edge
src = Image.open(os.path.join(HERE, 'hannah-portrait.png')).convert('RGB')
sp = src.load()

def avg(x0, x1, y):
    y = max(0, min(1023, y)); r = g = b = 0; n = 0
    for x in range(x0, x1):
        p = sp[x, y]; r += p[0]; g += p[1]; b += p[2]; n += 1
    return (r / n, g / n, b / n)

plate = Image.new('RGB', (W, H))
pp = plate.load()
wall = (205, 194, 179)       # warm wall tone the sides drift towards
for y in range(H):
    r = 0 if y < OY + 80 else min(890, y - OY)   # rows below the shoulders reuse row 890 (hidden by the desk)
    L = avg(2, 12, r); R = avg(1011, 1021, r)
    for x in range(W):
        if OX <= x < OX + 1024 and y >= OY + 80:
            continue
        if x < OX:
            base = L; t = (OX - x) / OX
        elif x >= OX + 1024:
            base = R; t = (x - OX - 1024) / (W - OX - 1024)
        else:
            base = (L[0] * (1 - (x - OX) / 1024) + R[0] * (x - OX) / 1024,
                    L[1] * (1 - (x - OX) / 1024) + R[1] * (x - OX) / 1024,
                    L[2] * (1 - (x - OX) / 1024) + R[2] * (x - OX) / 1024); t = 0
        t = t * t * (3 - 2 * t)
        k = 0.55 * t
        pp[x, y] = tuple(int(base[i] * (1 - k) + wall[i] * k) for i in range(3))
ext = plate.copy()
plate.paste(src.crop((0, 0, 1024, min(1024, H - OY))), (OX, OY))
fm = Image.new('L', (W, H), 255); fd = ImageDraw.Draw(fm)
for i in range(70):
    fd.line([(OX, OY + i), (OX + 1023, OY + i)], fill=int(255 * (i / 70) ** 1.5))
fd.rectangle([0, 0, W, OY - 1], fill=0)
fd.rectangle([0, OY, OX - 1, H], fill=0); fd.rectangle([OX + 1024, OY, W, H], fill=0)
plate = Image.composite(plate, ext, fm)

# ---- soft-focus decor, kept well away from the portrait ----
def layer():
    return Image.new('RGBA', (W, H), (0, 0, 0, 0))

# wall panel seams and a warm wash on the right
deco = layer(); d = ImageDraw.Draw(deco)
deco = deco.filter(ImageFilter.GaussianBlur(10))
plate.paste(deco, (0, 0), deco)

glow = layer(); d = ImageDraw.Draw(glow)
d.ellipse([1500, 300, 2300, 820], fill=(255, 214, 160, 120))
glow = glow.filter(ImageFilter.GaussianBlur(120))
plate.paste(glow, (0, 0), glow)

# LED shelf with a vase on the right
shelf = layer(); d = ImageDraw.Draw(shelf)
d.rectangle([1560, 548, W, 566], fill=(120, 96, 70, 255))
d.rectangle([1560, 566, W, 572], fill=(255, 226, 170, 255))
d.ellipse([1700, 440, 1770, 552], fill=(196, 150, 92, 235))
d.rectangle([1722, 412, 1748, 470], fill=(196, 150, 92, 235))
d.ellipse([1810, 470, 1880, 552], fill=(232, 222, 204, 230))
shelf = shelf.filter(ImageFilter.GaussianBlur(7))
plate.paste(shelf, (0, 0), shelf)
strip = layer(); d = ImageDraw.Draw(strip)
d.rectangle([1560, 562, W, 600], fill=(255, 220, 160, 170))
strip = strip.filter(ImageFilter.GaussianBlur(26))
plate.paste(strip, (0, 0), strip)

# out-of-focus plant on the left: many small leaves on arching stems, heavily defocused
random.seed(11)
plant = layer(); d = ImageDraw.Draw(plant)
for stem in range(16):
    bx = random.uniform(120, 240); by = 930
    ang = random.uniform(-2.35, -0.95); ln = random.uniform(330, 560)
    curl = random.uniform(-0.0016, 0.0016)
    for j in range(16):
        f = (j + 1) / 16
        a = ang + curl * ln * f * 3
        cx = bx + math.cos(a) * ln * f; cy = by + math.sin(a) * ln * f
        side = 1 if j % 2 else -1
        la = a + side * random.uniform(0.6, 1.1)
        L = random.uniform(26, 44) * (1.1 - 0.5 * f); Wd = L * 0.36
        g = random.randint(62, 96)
        col = (int(g * 0.62), g, int(g * 0.5), 225)
        pts = []
        for k in range(14):
            t = k / 13; w = Wd * math.sin(math.pi * t)
            px = cx + math.cos(la) * L * t; py = cy + math.sin(la) * L * t
            pts.append((px - math.sin(la) * w, py + math.cos(la) * w))
        for k in range(13, -1, -1):
            t = k / 13; w = Wd * math.sin(math.pi * t)
            px = cx + math.cos(la) * L * t; py = cy + math.sin(la) * L * t
            pts.append((px + math.sin(la) * w, py - math.cos(la) * w))
        d.polygon(pts, fill=col)
plant = plant.filter(ImageFilter.GaussianBlur(9))
r, g_, b, a = plant.split(); a = a.point(lambda v: int(v * 0.8)); plant = Image.merge('RGBA', (r, g_, b, a))
plate.paste(plant, (0, 0), plant)

# ---- reception counter ----
desk = layer(); d = ImageDraw.Draw(desk)
# soft contact shadow on her sweater just above the counter
for i in range(26):
    a = int(80 * (i / 26) ** 2)
    d.line([(0, DESK - 26 + i), (W, DESK - 26 + i)], fill=(60, 45, 35, a))
desk = desk.filter(ImageFilter.GaussianBlur(4))
plate.paste(desk, (0, 0), desk)
desk = layer(); d = ImageDraw.Draw(desk)
for y in range(DESK, DESK + 26):          # counter top, seen slightly from above
    f = (y - DESK) / 26
    c = (int(236 - 10 * f), int(226 - 12 * f), int(210 - 14 * f), 255)
    d.line([(0, y), (W, y)], fill=c)
d.line([(0, DESK), (W, DESK)], fill=(250, 245, 236, 255))
d.line([(0, DESK + 1), (W, DESK + 1)], fill=(246, 240, 230, 255))
for y in range(DESK + 26, H):             # front panel
    f = (y - DESK - 26) / (H - DESK - 26)
    c = (int(222 - 22 * f), int(212 - 24 * f), int(196 - 26 * f), 255)
    d.line([(0, y), (W, y)], fill=c)
d.line([(0, DESK + 26), (W, DESK + 26)], fill=(176, 160, 140, 255))
d.rectangle([0, DESK + 27, W, DESK + 30], fill=(160, 144, 124, 120))
d.rectangle([0, DESK + 62, W, DESK + 63], fill=(240, 196, 30, 200))   # Nexora yellow inlay
plate.paste(desk, (0, 0), desk)
# side falloff so the counter reads as lit from the front
fall = layer(); d = ImageDraw.Draw(fall)
for x in range(0, W, 4):
    t = abs(x - W / 2) / (W / 2); a = int(70 * t ** 2)
    d.rectangle([x, DESK, x + 3, H], fill=(70, 55, 40, a))
plate.paste(fall, (0, 0), fall)
# subtle sheen across the counter front
sheen = layer(); d = ImageDraw.Draw(sheen)
d.ellipse([500, DESK + 20, 1420, DESK + 260], fill=(255, 255, 255, 60))
sheen = sheen.filter(ImageFilter.GaussianBlur(60))
plate.paste(sheen, (0, 0), sheen)

# light grain on the synthetic areas only, to match the photo
noise = Image.effect_noise((W, H), 5).convert('RGB')
noisy = ImageChops.add(plate, noise, 1.0, -128)
m = Image.new('L', (W, H), 255); ImageDraw.Draw(m).rectangle([OX, OY, OX + 1023, DESK - 27], fill=0)
plate = Image.composite(noisy, plate, m)
plate.save(os.path.join(OUT, 'hannah-plate.jpg'), quality=88, optimize=True, progressive=True)
# the round picture beside her messages
src.crop((282, 150, 742, 610)).resize((192, 192), Image.LANCZOS).save(os.path.join(OUT, 'hannah-avatar.jpg'), quality=88)
print('wrote hannah-plate.jpg and hannah-avatar.jpg')
