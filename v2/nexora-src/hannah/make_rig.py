"""
Hannah's face rig (hannah-face.json): her MediaPipe landmarks moved into plate pixels, the canonical
face-mesh triangles with the mouth and eye openings cut out, and pinned points around the head.
Run: python3 make_rig.py   (no extra packages). The scene comes from layout.py.
"""
import json, math
import os, sys
HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, '..', '..', 'public', 'nexora', 'hannah')

from layout import W, H, LANDMARKS, REFERENCE
# expression sizes in hannah-face.js were tuned on her portrait; 'scale' tells it how big her face
# is here compared with that portrait (face width, cheek to cheek)
def face_width(Q): return math.hypot(Q[454][0] - Q[234][0], Q[454][1] - Q[234][1])
d = json.load(open(os.path.join(HERE, LANDMARKS)))
assert (d['W'], d['H']) == (W, H), 'landmarks were found on a different image size'
P = [[round(p[0], 1), round(p[1], 1)] for p in d['pts']]
S = face_width(P) / face_width(json.load(open(os.path.join(HERE, REFERENCE)))['pts'])
F = []
for l in open(os.path.join(HERE, 'canonical_face_model.obj')):
    if l.startswith('f '):
        F.append([int(x.split('/')[0]) - 1 for x in l.split()[1:]])
inner = set([78,191,80,81,82,13,312,311,310,415,308,95,88,178,87,14,317,402,318,324])
eyeR = set([33,246,161,160,159,158,157,173,133,7,163,144,145,153,154,155])
eyeL = set([362,398,384,385,386,387,388,466,263,382,381,380,374,373,390,249])
tris = [f for f in F if not (set(f) <= inner or set(f) <= eyeR or set(f) <= eyeL)]
mouthTris = [f for f in F if set(f) <= inner]
eyeTrisR = [f for f in F if set(f) <= eyeR]
eyeTrisL = [f for f in F if set(f) <= eyeL]
# canonical winding varies; the renderer doesn't cull, so keep as is
OVAL = [10,338,297,332,284,251,389,356,454,323,361,288,397,365,379,378,400,377,152,148,176,149,150,136,172,58,132,93,234,127,162,21,54,103,67,109]
cx = sum(P[i][0] for i in OVAL) / len(OVAL); cy = sum(P[i][1] for i in OVAL) / len(OVAL)
oval = [P[i] for i in OVAL]

def inside(pt, poly):
    x, y = pt; c = False; n = len(poly)
    for i in range(n):
        x1, y1 = poly[i]; x2, y2 = poly[(i + 1) % n]
        if (y1 > y) != (y2 > y) and x < (x2 - x1) * (y - y1) / (y2 - y1) + x1: c = not c
    return c

def grow(poly, cx, cy, fn):
    out = []
    for (x, y) in poly:
        dx, dy = x - cx, y - cy; L = math.hypot(dx, dy); k = fn(x, y, dx / L, dy / L)
        out.append([x + dx / L * k, y + dy / L * k])
    return out

chinY = P[152][1]
# ring 1 close to the face, ring 2 further out; much further below the jaw so the neck can absorb jaw motion
ring1 = grow(oval, cx, cy, lambda x, y, ux, uy: (26 + 70 * max(0, uy) ** 2) * S)
ring2 = grow(oval, cx, cy, lambda x, y, ux, uy: (90 + 90 * max(0, uy) ** 2) * S)
big = grow(oval, cx, cy, lambda x, y, ux, uy: 120 * S)
pins = [p for p in ring1 + ring2]
# a grid of fixed points over the rest of the photo (the room, her body, the desk)
step = 52
y = 0.0
while y <= H:
    x = 0.0
    while x <= W:
        if not inside((x, y), big):
            pins.append([x, y])
        x += step
    y += step
pins = [[round(a, 1), round(b, 1)] for a, b in pins]

# Bowyer-Watson Delaunay on oval + pins
pts = oval + pins
idx = OVAL + [478 + i for i in range(len(pins))]
def circum(a, b, c):
    ax, ay = a; bx, by = b; cx_, cy_ = c
    dd = 2 * (ax * (by - cy_) + bx * (cy_ - ay) + cx_ * (ay - by))
    if abs(dd) < 1e-9: return (0, 0, 1e18)
    ux = ((ax*ax+ay*ay)*(by-cy_) + (bx*bx+by*by)*(cy_-ay) + (cx_*cx_+cy_*cy_)*(ay-by)) / dd
    uy = ((ax*ax+ay*ay)*(cx_-bx) + (bx*bx+by*by)*(ax-cx_) + (cx_*cx_+cy_*cy_)*(bx-ax)) / dd
    return (ux, uy, (ax-ux)**2 + (ay-uy)**2)
M = 1e5
allp = pts + [[-M, -M], [M * 2, -M], [0, M * 2]]
n = len(pts)
T = [(n, n + 1, n + 2)]
cc = {T[0]: circum(*[allp[i] for i in T[0]])}
for i in range(n):
    p = allp[i]; bad = [t for t in T if (p[0]-cc[t][0])**2 + (p[1]-cc[t][1])**2 < cc[t][2]]
    edges = {}
    for t in bad:
        for e in ((t[0], t[1]), (t[1], t[2]), (t[2], t[0])):
            k = tuple(sorted(e)); edges[k] = edges.get(k, 0) + 1
    T = [t for t in T if t not in bad]
    for (a, b), cnt in edges.items():
        if cnt == 1:
            t = (a, b, i); T.append(t); cc[t] = circum(*[allp[j] for j in t])
skirt = []
for t in T:
    if max(t) >= n: continue
    c = [sum(allp[j][0] for j in t) / 3, sum(allp[j][1] for j in t) / 3]
    if inside(c, oval): continue
    skirt.append([idx[j] for j in t])
# check every oval edge is covered by a skirt triangle
es = set()
for t in skirt:
    for e in ((t[0], t[1]), (t[1], t[2]), (t[2], t[0])): es.add(tuple(sorted(e)))
missing = [(OVAL[i], OVAL[(i + 1) % len(OVAL)]) for i in range(len(OVAL)) if tuple(sorted((OVAL[i], OVAL[(i + 1) % len(OVAL)]))) not in es]
print('face tris', len(tris), 'pins', len(pins), 'skirt', len(skirt), 'missing oval edges', missing)
out = {
  'note': 'Hannah face rig: MediaPipe Face Landmarker points of hannah-plate.jpg (plate pixels), canonical face-mesh triangles with eye and mouth openings removed, and pinned skirt points. Generated offline; do not edit by hand.',
  'plate': [W, H], 'scale': round(S, 4),
  'points': P, 'tris': tris, 'mouthTris': mouthTris, 'eyeTrisR': eyeTrisR, 'eyeTrisL': eyeTrisL, 'pins': pins, 'skirt': skirt
}
json.dump(out, open(os.path.join(OUT, 'hannah-face.json'), 'w'), separators=(',', ':'))
