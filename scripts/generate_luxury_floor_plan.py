import os, math
from PIL import Image, ImageDraw, ImageFont

W, H = 1400, 900
out_path = 'v2/public/images/luxury_villa_floor_plan.jpg'

def get_font(size, bold=False):
    paths = [
        '/System/Library/Fonts/Supplemental/Arial Bold.ttf' if bold else '/System/Library/Fonts/Supplemental/Arial.ttf',
        '/System/Library/Fonts/Helvetica.ttc',
        '/Library/Fonts/Arial.ttf'
    ]
    for p in paths:
        if os.path.exists(p):
            try:
                return ImageFont.truetype(p, size)
            except Exception:
                pass
    return ImageFont.load_default()

f_head = get_font(26, True)
f_sub = get_font(18, True)
f_card = get_font(15, True)
f_body = get_font(13, False)
f_small = get_font(11, False)
f_dim = get_font(12, True)
f_badge = get_font(12, True)
f_code = get_font(13, True)

# Base dark slate drafting background
im = Image.new('RGB', (W, H), (12, 17, 24))
draw = ImageDraw.Draw(im)

# Subtle drafting grid
for x in range(0, W, 30):
    draw.line([(x, 0), (x, H)], fill=(255, 255, 255, 6), width=1)
for y in range(0, H, 30):
    draw.line([(0, y), (W, y)], fill=(255, 255, 255, 6), width=1)

# Outer double luxury border
draw.rectangle([16, 16, W-16, H-16], outline=(200, 160, 40, 120), width=1)
draw.rectangle([20, 20, W-20, H-20], outline=(255, 255, 255, 25), width=1)

# TOP HEADER BAR
draw.rounded_rectangle([28, 26, W-28, 80], radius=8, fill=(16, 23, 33), outline=(255, 255, 255, 25), width=1)
draw.text((44, 34), 'NEXORA ARCHITECTURAL STUDIO // RESIDENTIAL FLOOR PLAN SPECIFICATION', font=f_code, fill=(111, 228, 93))
draw.text((44, 52), 'SOVEREIGN VILLA COLLECTION • GROUND & MEZZANINE LEVEL LAYOUT', font=f_head, fill=(255, 255, 255))

badge_txt = '4 BEDROOMS • 5,420 SQ.FT BUA • PRIVATE POOL'
draw.rounded_rectangle([W-360, 36, W-44, 70], radius=6, fill=(18, 48, 36), outline=(111, 228, 93), width=1)
draw.text((W-345, 46), badge_txt, font=f_badge, fill=(111, 228, 93))

# LEFT PLAN DRAWING AREA: x0=35, y0=95, x1=1020, y1=875
# Draw boundary lawn/landscape
draw.rounded_rectangle([40, 100, 1010, 865], radius=12, fill=(14, 24, 20), outline=(255, 255, 255, 15), width=1)

# NORTH COMPASS
cx, cy = 90, 150
draw.ellipse([cx-25, cy-25, cx+25, cy+25], outline=(200, 170, 40), width=1)
draw.polygon([(cx, cy-22), (cx-6, cy+15), (cx, cy+8)], fill=(255, 215, 0))
draw.polygon([(cx, cy-22), (cx+6, cy+15), (cx, cy+8)], fill=(120, 95, 20))
draw.text((cx-5, cy-38), 'N', font=f_badge, fill=(255, 215, 0))

# ----------------- 1. INFINITY LAP POOL (Top Right) -----------------
px0, py0, px1, py1 = 660, 120, 980, 260
# Pool Deck (Teakwood)
draw.rectangle([px0-20, py0-10, px1+15, py1+15], fill=(38, 28, 20), outline=(80, 60, 40), width=1)
# Pool Basin (Turquoise water)
draw.rectangle([px0, py0, px1, py1], fill=(16, 115, 140), outline=(0, 240, 255), width=2)
# Water ripple lines
for ry in range(py0+20, py1, 25):
    draw.line([(px0+15, ry), (px1-15, ry)], fill=(0, 240, 255, 80), width=1)
draw.text((px0+60, py0+55), 'PRIVATE INFINITY LAP POOL (36\' x 14\')', font=f_card, fill=(255, 255, 255))
draw.text((px0+110, py0+80), 'Depth: 4\'0" - 6\'0" • Water Volume: 52,000 L', font=f_small, fill=(180, 240, 255))
# Sun loungers on deck
for li in range(3):
    lx = px0 - 15
    ly = py0 + 15 + li * 45
    draw.rectangle([lx-30, ly, lx, ly+30], fill=(220, 225, 230), outline=(100, 100, 100), width=1)
    draw.rectangle([lx-30, ly, lx-22, ly+30], fill=(180, 190, 200)) # pillow

# ----------------- 2. COVERED ALFRESCO PATIO & BBQ -----------------
ax0, ay0, ax1, ay1 = 360, 120, 630, 260
draw.rectangle([ax0, ay0, ax1, ay1], fill=(22, 28, 36), outline=(255, 255, 255, 30), width=1)
draw.text((ax0+40, ay0+30), 'ALFRESCO OUTDOOR DINING & BBQ', font=f_card, fill=(255, 215, 0))
# Dining table + 6 chairs
draw.rectangle([ax0+80, ay0+65, ax0+200, ay0+115], fill=(60, 48, 38), outline=(200, 160, 80), width=1)
draw.text((ax0+95, ay0+85), '8-SEATER TABLE', font=f_small, fill=(255, 255, 255))
for cx in [ax0+95, ax0+140, ax0+185]:
    draw.rectangle([cx-10, ay0+52, cx+10, ay0+62], fill=(180, 180, 180)) # top chairs
    draw.rectangle([cx-10, ay0+118, cx+10, ay0+128], fill=(180, 180, 180)) # bot chairs

# ----------------- 3. ZEN GARDEN & WATER FEATURE (Top Left) -----------------
zx0, zy0, zx1, zy1 = 60, 120, 330, 260
draw.rectangle([zx0, zy0, zx1, zy1], fill=(16, 28, 22), outline=(111, 228, 93, 80), width=1)
draw.text((zx0+40, zy0+40), 'ZEN COURTYARD & FOUNTAIN', font=f_card, fill=(111, 228, 93))
draw.text((zx0+40, zy0+70), 'Reflecting Pool • Stepping Stones', font=f_small, fill=(160, 220, 180))
# stepping stones
for st in range(5):
    sx = zx0 + 40 + st * 45
    sy = zy0 + 105
    draw.rounded_rectangle([sx, sy, sx+32, sy+20], radius=4, fill=(180, 190, 180))

# ----------------- 4. GRAND LIVING LOUNGE & FOYER (Middle Left) -----------------
lx0, ly0, lx1, ly1 = 60, 290, 480, 560
draw.rectangle([lx0, ly0, lx1, ly1], fill=(20, 26, 36), outline=(255, 255, 255, 120), width=3)
# Sliding glass wall top
draw.line([(lx0, ly0), (lx1, ly0)], fill=(0, 240, 255), width=3)
draw.text((lx0+80, ly0+25), 'DOUBLE-HEIGHT LIVING LOUNGE (32\' x 20\')', font=f_card, fill=(255, 255, 255))
draw.text((lx0+80, ly0+50), 'Clear Ceiling Height: 22\'0" • Italian Marble Floor', font=f_small, fill=(200, 215, 230))
# Modular Sectional L-Sofa
draw.rectangle([lx0+40, ly0+80, lx0+280, ly0+130], fill=(80, 90, 105), outline=(180, 190, 205), width=1)
draw.rectangle([lx0+40, ly0+130, lx0+100, ly0+220], fill=(80, 90, 105), outline=(180, 190, 205), width=1)
# Coffee table
draw.rounded_rectangle([lx0+125, ly0+150, lx0+230, ly0+200], radius=6, fill=(45, 38, 30), outline=(200, 160, 80), width=1)
draw.text((lx0+140, ly0+170), 'COFFEE TABLE', font=get_font(10, True), fill=(255, 255, 255))
# Fireplace / Media console
draw.rectangle([lx0+360, ly0+100, lx0+385, ly0+220], fill=(220, 120, 40), outline=(255, 200, 100), width=1)
draw.text((lx0+320, ly0+230), 'FLOATING FIREPLACE', font=get_font(9, True), fill=(255, 160, 80))

# ----------------- 5. FORMAL DINING PAVILION (Middle Center) -----------------
dx0, dy0, dx1, dy1 = 510, 290, 730, 560
draw.rectangle([dx0, dy0, dx1, dy1], fill=(20, 26, 36), outline=(255, 255, 255, 120), width=3)
draw.line([(dx0, dy0), (dx1, dy0)], fill=(0, 240, 255), width=3) # glass wall
draw.text((dx0+25, dy0+25), 'DINING PAVILION (18\' x 14\')', font=f_card, fill=(255, 255, 255))
# 10-seater dining table
draw.rectangle([dx0+40, dy0+80, dx0+180, dy0+190], fill=(50, 40, 30), outline=(200, 160, 80), width=2)
draw.text((dx0+60, dy0+130), '10-SEATER DINING', font=f_small, fill=(255, 255, 255))
for cy in [dy0+95, dy0+125, dy0+155, dy0+180]:
    draw.rectangle([dx0+20, cy-8, dx0+32, cy+8], fill=(160, 160, 160))
    draw.rectangle([dx0+188, cy-8, dx0+200, cy+8], fill=(160, 160, 160))

# ----------------- 6. CHEF\'S KITCHEN & SCULLERY (Middle Right) -----------------
kx0, ky0, kx1, ky1 = 760, 290, 990, 560
draw.rectangle([kx0, ky0, kx1, ky1], fill=(20, 26, 36), outline=(255, 255, 255, 120), width=3)
draw.text((kx0+25, ky0+25), 'CHEF\'S SHOW KITCHEN', font=f_card, fill=(255, 255, 255))
draw.text((kx0+25, ky0+48), '16\'6" x 14\'0" • Miele Suite', font=f_small, fill=(200, 215, 230))
# Kitchen island with barstools
draw.rectangle([kx0+30, ky0+90, kx0+150, ky0+190], fill=(230, 230, 235), outline=(150, 150, 160), width=2)
draw.text((kx0+45, ky0+135), 'MARBLE ISLAND', font=f_small, fill=(40, 40, 40))
# Cooktop on back counter
draw.rectangle([kx0+175, ky0+80, kx0+215, ky0+230], fill=(70, 70, 80), outline=(200, 200, 200), width=1)
draw.ellipse([kx0+185, ky0+100, kx0+205, ky0+120], outline=(255, 100, 50), width=2)
draw.ellipse([kx0+185, ky0+140, kx0+205, ky0+160], outline=(255, 100, 50), width=2)
draw.ellipse([kx0+185, ky0+180, kx0+205, ky0+200], outline=(255, 100, 50), width=2)

# ----------------- 7. JUNIOR GUEST SUITE 01 (Bottom Left) -----------------
gx0, gy0, gx1, gy1 = 60, 590, 360, 840
draw.rectangle([gx0, gy0, gx1, gy1], fill=(20, 26, 36), outline=(255, 255, 255, 120), width=3)
draw.text((gx0+25, gy0+20), 'GUEST BEDROOM SUITE', font=f_card, fill=(255, 255, 255))
draw.text((gx0+25, gy0+42), '18\'0" x 15\'0" • Ensuite Bath', font=f_small, fill=(200, 215, 230))
# Queen Bed
draw.rectangle([gx0+40, gy0+80, gx0+160, gy0+200], fill=(70, 80, 100), outline=(180, 190, 210), width=1)
draw.rectangle([gx0+50, gy0+85, gx0+95, gy0+115], fill=(220, 225, 230)) # pillow 1
draw.rectangle([gx0+105, gy0+85, gx0+150, gy0+115], fill=(220, 225, 230)) # pillow 2
draw.text((gx0+65, gy0+145), 'QUEEN BED', font=f_small, fill=(255, 255, 255))
# Ensuite bath box
draw.rectangle([gx0+185, gy0+80, gx0+285, gy0+190], fill=(25, 35, 45), outline=(0, 240, 200), width=1)
draw.text((gx0+200, gy0+110), 'ENSUITE\nBATHROOM', font=f_small, fill=(0, 240, 200))

# ----------------- 8. MASTER PRESIDENTIAL SUITE (Bottom Center) -----------------
mx0, my0, mx1, my1 = 390, 590, 770, 840
draw.rectangle([mx0, my0, mx1, my1], fill=(22, 28, 38), outline=(255, 215, 0, 180), width=3)
draw.text((mx0+25, my0+20), 'MASTER SUITE & DRESSING GALLERY', font=f_card, fill=(255, 215, 0))
draw.text((mx0+25, my0+42), '24\'0" x 18\'0" • Walk-in Dressing • 5-Fixture Bath', font=f_small, fill=(220, 235, 245))
# King Bed
draw.rectangle([mx0+40, my0+80, mx0+180, gy0+210], fill=(85, 95, 115), outline=(255, 215, 0), width=1)
draw.rectangle([mx0+50, my0+85, mx0+105, my0+120], fill=(240, 240, 245)) # pillow 1
draw.rectangle([mx0+115, my0+85, mx0+170, my0+120], fill=(240, 240, 245)) # pillow 2
draw.text((mx0+75, my0+155), 'KING BED', font=f_card, fill=(255, 255, 255))
# Dressing & 5-fixture Master Bath
draw.rectangle([mx0+205, my0+80, mx0+360, my0+210], fill=(28, 38, 48), outline=(0, 240, 255), width=2)
draw.text((mx0+220, my0+95), '5-FIXTURE ENSUITE', font=f_badge, fill=(0, 240, 255))
# freestanding tub
draw.ellipse([mx0+225, my0+125, mx0+285, my0+165], fill=(240, 245, 250), outline=(100, 150, 180), width=1)
draw.text((mx0+238, my0+140), 'TUB', font=get_font(10, True), fill=(20, 40, 60))
# double vanity
draw.rectangle([mx0+300, my0+120, mx0+345, my0+195], fill=(60, 70, 80), outline=(200, 200, 200), width=1)
draw.ellipse([mx0+310, my0+130, mx0+335, my0+150], fill=(255, 255, 255))
draw.ellipse([mx0+310, my0+165, mx0+335, my0+185], fill=(255, 255, 255))

# ----------------- 9. COVERED CARPORT & EV CHARGER (Bottom Right) -----------------
cx0, cy0, cx1, cy1 = 800, 590, 990, 840
draw.rectangle([cx0, cy0, cx1, cy1], fill=(20, 24, 30), outline=(255, 255, 255, 120), width=3)
draw.text((cx0+15, cy0+20), 'COVERED CARPORT (2-CAR)', font=f_card, fill=(255, 255, 255))
draw.text((cx0+15, cy0+42), '22\'0" x 20\'0" • 11kW EV Fast Charger', font=f_small, fill=(255, 215, 0))
# Car 1 silhouette (white luxury sedan)
draw.rounded_rectangle([cx0+20, cy0+80, cx0+85, cy0+200], radius=8, fill=(240, 245, 250), outline=(180, 180, 180), width=1)
draw.rectangle([cx0+30, cy0+115, cx0+75, cy0+165], fill=(40, 50, 60)) # windshield & roof
draw.text((cx0+35, cy0+135), 'CAR 1', font=get_font(9, True), fill=(255, 255, 255))
# Car 2 silhouette (dark SUV)
draw.rounded_rectangle([cx0+105, cy0+80, cx0+170, cy0+200], radius=8, fill=(50, 60, 70), outline=(100, 110, 120), width=1)
draw.rectangle([cx0+115, cy0+115, cx0+160, cy0+165], fill=(20, 25, 30))
draw.text((cx0+120, cy0+135), 'CAR 2', font=get_font(9, True), fill=(255, 255, 255))

# ----------------- RIGHT COLUMN: SPECIFICATION TABLE (x=1030 to 1370) -----------------
tx0, ty0, tx1, ty1 = 1030, 95, 1370, 875
draw.rounded_rectangle([tx0, ty0, tx1, ty1], radius=12, fill=(16, 24, 34), outline=(200, 160, 40, 150), width=1)

draw.text((tx0+24, ty0+24), 'AREA & SPECIFICATION SCHEDULE', font=f_sub, fill=(255, 215, 0))
draw.text((tx0+24, ty0+50), 'VERIFIED BY CIVIL AUDITOR & ARCHITECT', font=f_code, fill=(111, 228, 93))

specs = [
    ('Total Built-Up Area (BUA)', '5,420 SQ.FT', (255, 255, 255)),
    ('RERA Carpet Area', '4,180 SQ.FT', (111, 228, 93)),
    ('Outdoor Decks & Pool', '1,240 SQ.FT', (0, 240, 255)),
    ('Private Land Parcel Size', '6,850 SQ.FT', (255, 210, 40)),
    ('Living Lounge & Foyer', '32\'0" x 20\'0"', (220, 230, 240)),
    ('Dining Pavilion', '18\'0" x 14\'0"', (220, 230, 240)),
    ('Chef\'s Island Kitchen', '16\'6" x 14\'0"', (220, 230, 240)),
    ('Master Presidential Suite', '24\'0" x 18\'0"', (255, 215, 0)),
    ('Walk-in Dressing Gallery', '14\'0" x 10\'0"', (220, 230, 240)),
    ('5-Fixture Master Ensuite', '16\'0" x 10\'0"', (0, 240, 255)),
    ('Junior Suite 02', '18\'0" x 15\'0"', (220, 230, 240)),
    ('Guest Suite 03', '16\'0" x 13\'0"', (220, 230, 240)),
    ('Infinity Pool Basin', '36\'0" x 14\'0"', (0, 240, 255)),
    ('Covered 2-Car Carport', '22\'0" x 20\'0"', (255, 210, 40))
]
for si, (label, val, col) in enumerate(specs):
    sy = ty0 + 85 + si * 38
    draw.line([(tx0+20, sy-5), (tx1-20, sy-5)], fill=(255, 255, 255, 12), width=1)
    draw.text((tx0+24, sy), label, font=f_body, fill=(200, 210, 220))
    draw.text((tx1-150, sy), val, font=f_card, fill=col)

# Official Stamp at bottom of right column
draw.rounded_rectangle([tx0+20, ty1-135, tx1-20, ty1-20], radius=8, fill=(20, 32, 28), outline=(111, 228, 93), width=2)
draw.text((tx0+36, ty1-120), '🏛️ MUNICIPAL SANCTION APPROVED', font=f_card, fill=(111, 228, 93))
draw.text((tx0+36, ty1-95), 'Sanction Plan #DTCP-2026-8821 • 100% RERA Certified', font=f_small, fill=(220, 240, 230))
draw.text((tx0+36, ty1-75), 'Nexora Architectural Studio • Powered by Jatta M Kommerce', font=get_font(10, True), fill=(255, 215, 0))

im.save(out_path, quality=95)
print('Luxury Villa Floor Plan generated successfully at', out_path)
