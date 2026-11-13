import os, math
from PIL import Image, ImageDraw, ImageFont, ImageFilter

W, H = 1200, 800
out_dir = 'v2/public/images'
os.makedirs(out_dir, exist_ok=True)

villa_img = Image.open(f'{out_dir}/villa_completion.jpg').resize((W, H)).convert('RGBA')
soc_img = Image.open(f'{out_dir}/society_construction_clean.jpg').resize((W, H)).convert('RGBA')

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
f_card = get_font(16, True)
f_body = get_font(14, False)
f_small = get_font(12, False)
f_badge = get_font(12, True)
f_code = get_font(13, True)


def create_base(bg, tint, blur=18, dim=0.76):
    im = Image.new('RGBA', (W, H), tint)
    if bg:
        blurred = bg.copy().filter(ImageFilter.GaussianBlur(blur))
        overlay = Image.new('RGBA', (W, H), tint)
        im.paste(Image.blend(blurred, overlay, dim), (0, 0))
    draw = ImageDraw.Draw(im)
    for x in range(0, W, 40):
        draw.line([(x, 0), (x, H)], fill=(255, 255, 255, 8), width=1)
    for y in range(0, H, 40):
        draw.line([(0, y), (W, y)], fill=(255, 255, 255, 8), width=1)
    draw.rectangle([14, 14, W-14, H-14], outline=(255, 255, 255, 30), width=1)
    return im

def make_header(draw, title, step_num, step_name, badge_txt, badge_col):
    draw.rounded_rectangle([20, 16, W-20, 76], radius=8, fill=(15, 22, 32, 240), outline=(255, 255, 255, 30), width=1)
    draw.text((36, 26), f'NEXORA ARCHITECTURAL STUDIO // STEP 0{step_num}: {step_name.upper()}', font=f_badge, fill=(111, 228, 93, 255))
    draw.text((36, 46), title, font=f_head, fill=(255, 255, 255, 255))
    
    bw = len(badge_txt) * 8 + 24
    bx = W - 36 - bw
    draw.rounded_rectangle([bx, 26, bx + bw, 66], radius=6, fill=badge_col)
    draw.text((bx + 12, 38), badge_txt, font=f_badge, fill=(255, 255, 255, 255))

# ==================== CARD 1: SOLAR & MASTERPLAN ====================
im1 = soc_img.copy()
# Subtle dark blueprint overlay
overlay1 = Image.new('RGBA', (W, H), (12, 28, 48, 140))
im1 = Image.alpha_composite(im1, overlay1)
d1 = ImageDraw.Draw(im1)
make_header(d1, 'Master Enclave Blueprint & Solar Micro-Climate Analysis', 1, 'Site Feasibility & Layout', 'SOLAR OPTIMIZED • 100% N-S', (255, 160, 20, 255))

# Blueprint grid
for x in range(0, W, 50):
    d1.line([(x, 80), (x, H)], fill=(0, 220, 255, 25), width=1)
for y in range(80, H, 50):
    d1.line([(0, y), (W, y)], fill=(0, 220, 255, 25), width=1)

# Large Golden Sun Arc across the top
d1.arc([100, 110, W-100, 680], 190, 350, fill=(255, 215, 0, 220), width=4)
# Sun icons at intervals
for angle_deg in [210, 270, 330]:
    rad = math.radians(angle_deg)
    cx = W/2 + 480 * math.cos(rad)
    cy = 400 + 280 * math.sin(rad)
    d1.ellipse([cx-18, cy-18, cx+18, cy+18], fill=(255, 220, 40, 240), outline=(255, 255, 255, 255), width=2)
    # sun rays
    for ray in range(8):
        ra = ray * math.pi / 4
        d1.line([(cx + 22*math.cos(ra), cy + 22*math.sin(ra)), (cx + 30*math.cos(ra), cy + 30*math.sin(ra))], fill=(255, 220, 40, 220), width=2)

d1.text((160, 240), '🌅 Morning Sun (75° Azimuth)', font=f_badge, fill=(255, 230, 100, 255))
d1.text((520, 140), '☀️ Midday Peak Insolation (100% N-S Orientation)', font=f_badge, fill=(255, 230, 100, 255))
d1.text((860, 240), '🌇 Sunset Golden Hour (285°)', font=f_badge, fill=(255, 230, 100, 255))

# Wind breeze arrows (Cyan curves)
for wy in [460, 520, 580]:
    d1.line([(60, wy), (400, wy-30), (750, wy-10), (1100, wy-40)], fill=(0, 240, 255, 120), width=3)
d1.text((80, 430), '💨 Prevailing Cross-Ventilation Breeze Corridor', font=f_badge, fill=(0, 240, 255, 230))

# Floating Architectural KPI Chips
kpis1 = [
    ('1.75 FSI', 'Max Density Permitted', (111, 228, 93)),
    ('46.2%', 'Park & Green Open Space', (0, 240, 200)),
    ('38.4%', 'Ground Footprint Coverage', (255, 210, 40)),
    ('24 Villas', 'Master Enclave Planned', (255, 130, 70))
]
for i, (v, l, c) in enumerate(kpis1):
    kx = 40 + i * 280
    d1.rounded_rectangle([kx, H-95, kx+260, H-25], radius=8, fill=(15, 25, 38, 230), outline=(c[0], c[1], c[2], 120), width=1)
    d1.text((kx+16, H-85), v, font=f_sub, fill=c)
    d1.text((kx+16, H-55), l, font=f_small, fill=(200, 220, 230, 220))

im1.convert('RGB').save(f'{out_dir}/master_plan_01_feasibility.jpg', quality=95)
print('Card 1 generated: Solar & Masterplan')

# ==================== CARD 2: VILLA CUTAWAY & SANCTIONS ====================
im2 = villa_img.copy()
d2 = ImageDraw.Draw(im2)
make_header(d2, 'Architectural Zoning Envelope & Municipal Clearances', 2, 'Sanctions & Clearances', '4/4 SANCTIONS APPROVED', (10, 140, 70, 255))

# Dimension lines overlay
d2.line([(240, 180), (960, 180)], fill=(0, 240, 255, 220), width=2)
d2.line([(240, 170), (240, 190)], fill=(0, 240, 255, 220), width=2)
d2.line([(960, 170), (960, 190)], fill=(0, 240, 255, 220), width=2)
d2.rectangle([520, 166, 680, 194], fill=(15, 25, 35, 220), outline=(0, 240, 255, 180), width=1)
d2.text((534, 172), 'VILLA WIDTH: 24.5 m', font=f_badge, fill=(0, 240, 255, 255))

# Height envelope vertical line
d2.line([(180, 210), (180, 560)], fill=(255, 210, 40, 220), width=2)
d2.line([(170, 210), (190, 210)], fill=(255, 210, 40, 220), width=2)
d2.line([(170, 560), (190, 560)], fill=(255, 210, 40, 220), width=2)
d2.text((60, 360), 'HEIGHT: 9.5 m\n(2-STORY ENVELOPE)', font=f_badge, fill=(255, 210, 40, 255))

# Setback labels
d2.rounded_rectangle([300, 620, 500, 670], radius=6, fill=(15, 35, 25, 220), outline=(111, 228, 93, 200), width=1)
d2.text((315, 636), '↔ FRONT SETBACK: 6.00 m', font=f_badge, fill=(111, 228, 93, 255))

d2.rounded_rectangle([720, 620, 940, 670], radius=6, fill=(15, 30, 45, 220), outline=(0, 240, 200, 200), width=1)
d2.text((735, 636), '🏊 POOL SETBACK: 3.50 m', font=f_badge, fill=(0, 240, 200, 255))

# 4 Official Sanction Stamps (Bottom bar)
sanctions = [
    ('🏛️ DTCP TOWN PLANNING', 'Sanction #DTCP-2026', 'APPROVED', (111, 228, 93)),
    ('🚒 FIRE & LIFE SAFETY', 'NOC Clearance #FS-302', 'CLEARED', (111, 228, 93)),
    ('💧 WATER & SEWERAGE', '120 KLD Freshwater', 'SANCTIONED', (0, 240, 200)),
    ('⚡ STATE POWER GRID', '350 kVA Dedicated Feed', 'PASSED', (255, 210, 40))
]
for i, (auth, num, st, c) in enumerate(sanctions):
    sx = 30 + i * 285
    d2.rounded_rectangle([sx, H-105, sx+270, H-25], radius=8, fill=(18, 26, 38, 230), outline=(c[0], c[1], c[2], 120), width=1)
    d2.text((sx+14, H-95), auth, font=f_card, fill=(255, 255, 255, 255))
    d2.text((sx+14, H-70), num, font=f_small, fill=(180, 200, 215, 220))
    d2.rounded_rectangle([sx+180, H-50, sx+256, H-30], radius=4, fill=(c[0], c[1], c[2], 40), outline=c, width=1)
    d2.text((sx+188, H-47), st, font=get_font(10, True), fill=c)

im2.convert('RGB').save(f'{out_dir}/master_plan_02_sanctions.jpg', quality=95)
print('Card 2 generated: Villa Cutaway & Sanctions')

# ==================== CARD 3: RERA & ESCROW FLOW ====================
im3 = create_base(villa_img, (14, 26, 20, 255))
d3 = ImageDraw.Draw(im3)
make_header(d3, 'RERA Statutory Framework & 70% Bank Escrow Ring-Fence', 3, 'RERA & Financial Governance', 'STATUTORY COMPLIANCE • SAFEGUARDED', (220, 160, 20, 255))

# Big Gold RERA Shield Emblem Left
d3.rounded_rectangle([40, 110, 360, 710], radius=12, fill=(20, 36, 28, 230), outline=(220, 170, 40, 150), width=2)
# Shield Shape
d3.polygon([(200, 140), (280, 180), (280, 280), (200, 340), (120, 280), (120, 180)], fill=(220, 160, 20, 40), outline=(255, 210, 40, 255))
d3.text((156, 220), 'RERA', font=get_font(32, True), fill=(255, 215, 0, 255))
d3.text((144, 265), 'VERIFIED', font=f_badge, fill=(111, 228, 93, 255))

d3.text((60, 370), 'CERTIFICATE NO:', font=f_badge, fill=(255, 210, 40, 255))
d3.text((60, 395), 'RERA-PRJ-2026-0941', font=f_sub, fill=(255, 255, 255, 255))
d3.text((60, 440), 'CARPET AREA AUDIT:', font=f_badge, fill=(111, 228, 93, 255))
d3.text((60, 465), '100% Certified CAD match', font=f_body, fill=(220, 240, 230, 220))
d3.text((60, 510), 'TITLE DEED AUDIT:', font=f_badge, fill=(0, 240, 200, 255))
d3.text((60, 535), '30-Year Encumbrance Free', font=f_body, fill=(220, 240, 230, 220))
d3.text((60, 580), 'QUARTERLY FILING:', font=f_badge, fill=(255, 140, 70, 255))
d3.text((60, 605), 'Auto Q-CPR Compliance Sync', font=f_body, fill=(220, 240, 230, 220))

# Right: Financial Flow Diagram
d3.rounded_rectangle([390, 110, W-40, 710], radius=12, fill=(16, 28, 24, 230), outline=(255, 255, 255, 30), width=1)
d3.text((420, 135), 'HOW BUYER INVESTMENTS ARE SECURED THROUGH ESCROW', font=f_code, fill=(111, 228, 93, 255))

# Flow Step 1: Buyer Deposit
d3.rounded_rectangle([420, 180, 580, 380], radius=10, fill=(25, 45, 38, 220), outline=(111, 228, 93, 180), width=2)
d3.text((440, 210), '💰 BUYER\nTOKEN\nDEPOSIT', font=f_sub, fill=(111, 228, 93, 255))
d3.text((440, 310), '100% Inflow to\nProject Escrow', font=f_small, fill=(200, 230, 215, 220))

# Arrow
d3.polygon([(600, 280), (630, 280), (630, 270), (650, 285), (630, 300), (630, 290), (600, 290)], fill=(255, 255, 255, 200))

# Flow Step 2: Bank Escrow Vault Cube
d3.rounded_rectangle([670, 180, 920, 380], radius=10, fill=(20, 55, 40, 240), outline=(255, 215, 0, 220), width=3)
d3.text((695, 205), '🏛️ ESCROW BANK VAULT', font=f_card, fill=(255, 215, 0, 255))
d3.text((695, 245), '70% LOCKED', font=get_font(28, True), fill=(111, 228, 93, 255))
d3.text((695, 290), 'Ring-fenced strictly for\nraw materials & civil labor.\nCannot be diverted.', font=f_body, fill=(220, 245, 230, 240))

# Arrow Down
d3.polygon([(785, 400), (785, 430), (775, 430), (790, 450), (805, 430), (795, 430), (795, 400)], fill=(111, 228, 93, 255))

# Flow Step 3: Certified Drawdowns
d3.rounded_rectangle([420, 470, W-70, 680], radius=10, fill=(20, 38, 30, 220), outline=(111, 228, 93, 140), width=1)
d3.text((445, 495), 'STAGE-GATED CONSTRUCTION MILESTONE RELEASES', font=f_card, fill=(255, 255, 255, 255))
milestones_esc = [
    ('Foundation Cast (15%)', 'Civil Engineer Sign-off', 'PASSED'),
    ('Plinth & Slabs (35%)', 'Drone Inspection Log', 'PASSED'),
    ('Superstructure (20%)', 'Architect Structural Audit', 'IN PROGRESS')
]
for mi, (m_t, m_sub, m_s) in enumerate(milestones_esc):
    my = 540 + mi * 42
    d3.text((445, my), f'✓  {m_t}', font=f_body, fill=(111, 228, 93, 255))
    d3.text((700, my), m_sub, font=f_small, fill=(180, 210, 195, 200))
    d3.text((950, my), m_s, font=f_badge, fill=(255, 210, 40, 255))

im3.convert('RGB').save(f'{out_dir}/master_plan_03_rera.jpg', quality=95)
print('Card 3 generated: RERA & Escrow Flow')

# ==================== CARD 4: EXPLODED AXONOMETRIC ====================
im4 = create_base(villa_img, (18, 20, 26, 255))
d4 = ImageDraw.Draw(im4)
make_header(d4, 'Exploded 3D Architectural Assembly & Material Engineering', 4, 'Materials & Engineering', 'ENGINEERING AXONOMETRIC', (255, 120, 40, 255))

# 4 Floating Horizontal Isometric Layers
layers = [
    ('LAYER 04: ROOFTOP SUSTAINABILITY DECK', 'Photovoltaic Solar Panels (145 kWp) • Rain Catchment • Sky Terrace Lounge', (255, 210, 40)),
    ('LAYER 03: UPPER BEDROOM SUITES', 'Master Bedroom Pavilion • Cantilevered Glass Balcony • Teak Privacy Louvers', (255, 140, 60)),
    ('LAYER 02: GROUND LIVING & OUTDOOR PATIO', 'Double-Height Living Room • Italian Marble Slab • Panoramic Sliding Glass Walls', (0, 240, 200)),
    ('LAYER 01: REINFORCED CONCRETE SUBSTRUCTURE', 'Engineered Raft Foundation • Fe550D Steel Cage • Waterproof Pool Pit Basin', (111, 228, 93))
]
for idx, (ltitle, ldesc, lcolor) in enumerate(layers):
    ly = 110 + idx * 145
    # Isometric plate simulation
    d4.polygon([(120, ly+30), (900, ly+30), (1050, ly+100), (270, ly+100)], fill=(25, 32, 44, 220), outline=lcolor, width=2)
    # Connector line to card
    d4.line([(60, ly+65), (180, ly+65)], fill=lcolor, width=2)
    d4.ellipse([54, ly+59, 66, ly+71], fill=lcolor)
    d4.text((290, ly+45), ltitle, font=f_card, fill=(255, 255, 255, 255))
    d4.text((290, ly+70), ldesc, font=f_body, fill=lcolor)

# Bottom Material Badges
mats = ['Fe550D Rebar Steel', 'M40 Ready-Mix Concrete', 'Schüco Low-E Glazing', 'Teakwood Slats', 'Italian Statuario Marble']
for m_i, m_name in enumerate(mats):
    mx = 30 + m_i * 230
    d4.rounded_rectangle([mx, H-75, mx+215, H-25], radius=6, fill=(25, 35, 48, 230), outline=(255, 255, 255, 40), width=1)
    d4.text((mx+14, H-55), f'🧱 {m_name}', font=f_badge, fill=(240, 245, 250, 255))

im4.convert('RGB').save(f'{out_dir}/master_plan_04_procurement.jpg', quality=95)
print('Card 4 generated: Exploded Axonometric')

# ==================== CARD 5: ECO-LIVING CYCLE ====================
im5 = villa_img.copy()
d5 = ImageDraw.Draw(im5)
make_header(d5, 'Eco-Home Sustainable Living & Net-Zero Resource Cycle', 5, 'Environmental Architecture', 'IGBC PLATINUM • NET-ZERO WATER', (0, 180, 120, 255))

# Solar Rays Downwards
for ray_x in [600, 680, 760, 840]:
    d5.line([(ray_x, 90), (ray_x - 40, 230)], fill=(255, 220, 40, 200), width=3)
d5.rounded_rectangle([580, 100, 860, 135], radius=6, fill=(30, 25, 10, 220), outline=(255, 215, 0, 200), width=1)
d5.text((595, 110), '☀️ 145 kWp Rooftop Solar Harvesting', font=f_badge, fill=(255, 220, 40, 255))

# Yellow Power Line from Solar to EV Carport
d5.line([(700, 240), (700, 480), (320, 480)], fill=(255, 215, 0, 240), width=3)
d5.rounded_rectangle([220, 460, 400, 500], radius=6, fill=(35, 30, 10, 230), outline=(255, 215, 0, 200), width=1)
d5.text((230, 472), '⚡ 11kW EV Smart Carport', font=f_badge, fill=(255, 215, 0, 255))

# Rainwater Cycle Blue Lines
d5.line([(920, 240), (920, 640), (840, 640)], fill=(0, 220, 255, 240), width=3)
d5.rounded_rectangle([720, 620, 960, 660], radius=6, fill=(10, 30, 45, 230), outline=(0, 220, 255, 200), width=1)
d5.text((730, 632), '🌧️ 100 kL Rain Recharge Wells', font=f_badge, fill=(0, 220, 255, 255))

# Natural Breeze Flow
d5.line([(80, 340), (280, 340), (520, 360)], fill=(111, 228, 93, 200), width=3)
d5.rounded_rectangle([80, 310, 340, 350], radius=6, fill=(15, 40, 25, 230), outline=(111, 228, 93, 200), width=1)
d5.text((95, 322), '🍃 Passive Cross-Ventilation Airflow', font=f_badge, fill=(111, 228, 93, 255))

# Eco Pillars Bottom
eco_pils = [
    ('210,000 kWh/yr', 'Clean Solar Electricity Generated', (255, 215, 0)),
    ('100% Zero-Runoff', '8 Subsurface Aquifer Wells', (0, 220, 255)),
    ('-34% Carbon', 'Embodied Green Materials', (111, 228, 93)),
    ('-2.4°C Cooling', 'Natural Micro-Climate Breezeways', (160, 200, 255))
]
for i, (v, l, c) in enumerate(eco_pils):
    ex = 30 + i * 285
    d5.rounded_rectangle([ex, H-95, ex+270, H-25], radius=8, fill=(15, 25, 35, 240), outline=(c[0], c[1], c[2], 120), width=1)
    d5.text((ex+14, H-85), v, font=f_sub, fill=c)
    d5.text((ex+14, H-55), l, font=f_small, fill=(210, 230, 240, 220))

im5.convert('RGB').save(f'{out_dir}/master_plan_05_environment.jpg', quality=95)
print('Card 5 generated: Eco-Living Cycle')

# ==================== CARD 6: HOLOGRAPHIC 3D TWIN ====================
im6 = villa_img.copy()
# Futuristic dark holographic tint
d6 = ImageDraw.Draw(im6)
make_header(d6, 'Holographic 3D Digital Twin & Real-Time BIM Engine', 6, 'Digital Twin Pipeline', '60 FPS WEBGL NATIVE', (130, 90, 255, 255))

# Laser Radiating Cone from bottom
d6.polygon([(W/2 - 200, H-50), (W/2 + 200, H-50), (960, 220), (240, 220)], fill=(0, 240, 255, 25))
# Laser grid lines
for lx in range(240, 960, 45):
    d6.line([(W/2, H-50), (lx, 220)], fill=(0, 240, 255, 60), width=1)
for hy in range(220, H-50, 60):
    d6.line([(240 + (hy-220)*0.5, hy), (960 - (hy-220)*0.5, hy)], fill=(0, 240, 255, 50), width=1)

# Floating Interactive HUD Buttons
huds = [
    (140, 240, '🔄 ROTATE 360°', 'Full Orbit Camera Control', (0, 240, 255)),
    (140, 360, '☀️ SUNLIGHT SLIDER', '9 AM to 6 PM Daylight Sim', (255, 215, 0)),
    (140, 480, '📐 MEASURE TOOL', 'Laser Dimension Check', (111, 228, 93)),
    (880, 240, '🚶 INTERIOR WALKTHROUGH', 'First-Person Room Tour', (255, 140, 60)),
    (880, 360, '🛋️ FINISH CUSTOMIZER', 'Live Marble & Wood Swap', (200, 100, 255)),
    (880, 480, '📱 ZERO-INSTALL WEBGL', 'Instant Browser Streaming', (0, 240, 200))
]
for (hx, hy, htitle, hsub, hcolor) in huds:
    d6.rounded_rectangle([hx, hy, hx+230, hy+70], radius=8, fill=(15, 22, 35, 240), outline=hcolor, width=1)
    d6.text((hx+14, hy+14), htitle, font=f_badge, fill=hcolor)
    d6.text((hx+14, hy+38), hsub, font=f_small, fill=(220, 230, 240, 220))

# Bottom Tablet Frame Representation
d6.rounded_rectangle([W/2 - 320, H-90, W/2 + 320, H-15], radius=14, fill=(12, 18, 28, 250), outline=(0, 240, 255, 180), width=2)
d6.text((W/2 - 200, H-60), '⚡ BIM MESH CONVERTED TO INTERACTIVE 60 FPS DIGITAL TWIN', font=f_code, fill=(0, 240, 255, 255))

im6.convert('RGB').save(f'{out_dir}/master_plan_06_bim_twin.jpg', quality=95)
print('Card 6 generated: Holographic 3D Twin')

# ==================== CARD 7: INTERIOR MOODBOARD ====================
im7 = villa_img.copy()
d7 = ImageDraw.Draw(im7)
make_header(d7, 'Interactive Villa Finishes & Interior Design Moodboard', 7, 'Customizer Studio', 'REAL-TIME SPEC SELECTION', (210, 100, 40, 255))

# 4 Floating Material Swatch Cards
swatches = [
    ('🏛️ ITALIAN STATUARIO', 'Living Room & Foyer Flooring', 'Polished White Marble with Gold Vein', (240, 240, 245)),
    ('🪵 SMOKED FRENCH OAK', 'Bedroom & Staircase Flooring', 'Brushed Matte Herringbone Wood', (180, 140, 90)),
    ('🪟 ANODIZED BRONZE', 'Façade Louvers & Framing', 'Champagne Metallic Architectural Trim', (210, 175, 120)),
    ('🏊 BISAZZA GLASS MOSAIC', 'Private Infinity Pool Basin', 'Iridescent Turquoise Water Tile', (40, 200, 210))
]
for s_i, (s_name, s_loc, s_spec, s_accent) in enumerate(swatches):
    sy = 110 + s_i * 135
    # Card
    d7.rounded_rectangle([40, sy, 460, sy+115], radius=10, fill=(22, 20, 22, 240), outline=s_accent, width=2)
    # Color chip box
    d7.rounded_rectangle([56, sy+20, 116, sy+95], radius=6, fill=s_accent)
    d7.text((130, sy+22), s_name, font=f_card, fill=(255, 255, 255, 255))
    d7.text((130, sy+50), s_loc, font=f_small, fill=(255, 215, 0, 255))
    d7.text((130, sy+72), s_spec, font=f_small, fill=(200, 190, 190, 220))

# Right Side Palette Rings & Dynamic Price Estimator
d7.rounded_rectangle([W-380, 110, W-40, 710], radius=12, fill=(20, 18, 20, 240), outline=(255, 255, 255, 30), width=1)
d7.text((W-355, 140), 'DYNAMIC FINISH CALCULATOR', font=f_code, fill=(255, 180, 60, 255))

palettes = [
    ('Italian Statuario Marble', '+$18,500', True),
    ('French Smoked Oak Parquet', '+$12,400', True),
    ('KNX Scene Lighting Automation', '+$8,600', True),
    ('Heated Pool & Swim Jets', '+$14,200', False),
    ('Miele Kitchen Suite', '+$16,500', True)
]
for pi, (pname, pprice, pchecked) in enumerate(palettes):
    py = 200 + pi * 75
    d7.line([(W-355, py-10), (W-65, py-10)], fill=(255, 255, 255, 20), width=1)
    chk = '☑' if pchecked else '☐'
    col = (111, 228, 93) if pchecked else (140, 140, 140)
    d7.text((W-355, py), f'{chk} {pname}', font=f_body, fill=(255, 255, 255, 240))
    d7.text((W-150, py), pprice, font=f_card, fill=col)

# Total Box
d7.rounded_rectangle([W-355, 590, W-65, 680], radius=8, fill=(35, 25, 15, 240), outline=(255, 160, 30, 200), width=2)
d7.text((W-335, 605), 'SELECTED UPGRADES TOTAL', font=f_small, fill=(255, 200, 100, 240))
d7.text((W-335, 630), '+$56,000  ($390/mo)', font=f_sub, fill=(255, 215, 0, 255))

im7.convert('RGB').save(f'{out_dir}/master_plan_07_customizer.jpg', quality=95)
print('Card 7 generated: Interior Moodboard')

# ==================== CARD 8: AMENITIES & COMMUNITY MAP ====================
im8 = soc_img.copy()
d8 = ImageDraw.Draw(im8)
make_header(d8, 'Gated Community Enclave Map & Family Lifestyle Amenities', 8, 'Community Masterplan', 'VIBRANT ENCLAVE LIVING', (111, 228, 93, 255))

# Floating Landmark Pins with connector lines
amenities = [
    (600, 260, '🏊 RESORT POOL & DECK', 'Heated Lap Pool & Cabanas', (0, 240, 255)),
    (600, 380, '🏛️ COMMUNITY CLUBHOUSE', 'Wellness Spa, Lounge & Gym', (255, 215, 0)),
    (860, 520, '🎾 MULTISPORT & PLAYGROUND', 'Tennis, Basketball & Turf', (111, 228, 93)),
    (140, 540, '⛲ ORNAMENTAL FOUNTAIN POND', 'Reflecting Lake & Gardens', (0, 200, 255)),
    (540, 640, '🛡️ 24/7 GUARDED GATEHOUSE', 'RFID Access & Security Desk', (255, 120, 50)),
    (140, 260, '🌳 1.2 KM JOGGING BOULEVARD', 'Tree-Lined Perimeter Walkway', (120, 220, 100))
]
for (px, py, atitle, asub, acol) in amenities:
    d8.ellipse([px-10, py-10, px+10, py+10], fill=acol, outline=(255, 255, 255, 255), width=2)
    d8.rounded_rectangle([px+18, py-22, px+310, py+32], radius=6, fill=(15, 25, 38, 240), outline=acol, width=1)
    d8.text((px+28, py-14), atitle, font=f_badge, fill=acol)
    d8.text((px+28, py+6), asub, font=f_small, fill=(220, 230, 240, 220))

# Bottom Bar: Enclave Overview
d8.rounded_rectangle([40, H-80, W-40, H-20], radius=8, fill=(15, 25, 35, 240), outline=(255, 255, 255, 30), width=1)
d8.text((60, H-58), '🏡 24 EXCLUSIVE VILLAS  •  100% PRIVATE SECURITY PERIMETER  •  ZERO VEHICULAR INTERFERENCE IN PARKS', font=f_code, fill=(111, 228, 93, 255))

im8.convert('RGB').save(f'{out_dir}/master_plan_08_crm_sales.jpg', quality=95)
print('Card 8 generated: Community Amenities Map')

# ==================== CARD 9: DREAM HOME HANDOVER ====================
im9 = villa_img.copy()
d9 = ImageDraw.Draw(im9)
make_header(d9, 'Dream Home Handover & Keyless Smart Living Experience', 9, 'Homeowner Handover', 'MILESTONE COMPLETION • 100%', (255, 215, 0, 255))

# Floating Smartphone App UI on Left
d9.rounded_rectangle([50, 110, 430, 710], radius=24, fill=(14, 18, 28, 250), outline=(255, 215, 0, 180), width=3)
d9.ellipse([225, 125, 255, 135], fill=(30, 40, 50, 255)) # phone camera

d9.text((80, 160), 'NEXORA SMART LIVING APP', font=f_code, fill=(111, 228, 93, 255))
d9.text((80, 195), 'WELCOME HOME!', font=get_font(26, True), fill=(255, 255, 255, 255))
d9.text((80, 235), 'RESIDENCE: VILLA #V-104\nOWNER: MR. & MRS. SHARMA', font=f_body, fill=(200, 220, 230, 220))

# Big Smart Key Button
d9.rounded_rectangle([80, 310, 400, 410], radius=16, fill=(20, 60, 40, 240), outline=(111, 228, 93, 220), width=2)
d9.text((120, 335), '🔓 UNLOCK MAIN PIVOT DOOR', font=f_card, fill=(111, 228, 93, 255))
d9.text((120, 365), 'Encrypted Digital Key • Valid', font=f_small, fill=(200, 240, 220, 200))

# Status tiles
d9.rounded_rectangle([80, 440, 230, 530], radius=10, fill=(20, 28, 40, 220), outline=(255, 255, 255, 20), width=1)
d9.text((95, 455), 'CLIMATE', font=f_small, fill=(160, 180, 200, 200))
d9.text((95, 480), '22.5°C', font=f_sub, fill=(0, 240, 255, 255))

d9.rounded_rectangle([250, 440, 400, 530], radius=10, fill=(20, 28, 40, 220), outline=(255, 255, 255, 20), width=1)
d9.text((265, 455), 'POOL TEMP', font=f_small, fill=(160, 180, 200, 200))
d9.text((265, 480), '28.0°C', font=f_sub, fill=(255, 215, 0, 255))

d9.rounded_rectangle([80, 550, 400, 640], radius=10, fill=(20, 28, 40, 220), outline=(255, 255, 255, 20), width=1)
d9.text((95, 565), 'DIGITAL HANDOVER VAULT', font=f_badge, fill=(255, 215, 0, 255))
d9.text((95, 595), '✓ 10-Yr Structural Warranty  •  ✓ MEP Schematics  •  ✓ Smart Manuals', font=f_small, fill=(210, 225, 235, 220))

# Right Side Celebration & Handover Checklist
d9.rounded_rectangle([470, 110, W-40, 710], radius=16, fill=(16, 24, 34, 230), outline=(255, 255, 255, 30), width=1)
d9.text((500, 140), 'FINAL HANDOVER CERTIFICATION DOSSIER', font=f_code, fill=(255, 215, 0, 255))

checks = [
    ('Architect & Civil Engineering Final Sign-Off', 'Completed with zero snag-list items', (111, 228, 93)),
    ('Municipal Occupancy Certificate (OC) Issued', 'DTCP Final Living Permission #OC-2027', (111, 228, 93)),
    ('Private Pool Water Quality & Filtration Balanced', 'Crystal clear circulation active', (0, 240, 255)),
    ('Solar Net-Metering Grid Synchronization', '145 kWp connected to local utility grid', (255, 215, 0)),
    ('Smart Home IoT & RFID Access Credentials Transferred', 'Physical & encrypted keys handed over to family', (255, 140, 70))
]
for ci, (c_main, c_sub, c_col) in enumerate(checks):
    cy = 200 + ci * 85
    d9.ellipse([505, cy+8, 525, cy+28], fill=c_col)
    d9.text((511, cy+10), '✓', font=f_badge, fill=(0, 0, 0, 255))
    d9.text((545, cy+5), c_main, font=f_card, fill=(255, 255, 255, 255))
    d9.text((545, cy+32), c_sub, font=f_body, fill=c_col)

# Celebration banner bottom
d9.rounded_rectangle([500, 630, W-70, 690], radius=8, fill=(35, 50, 30, 240), outline=(111, 228, 93, 200), width=2)
d9.text((520, 648), '🎉 CONGRATULATIONS! WELCOME TO YOUR NEW FOREVER HOME', font=f_card, fill=(111, 228, 93, 255))

im9.convert('RGB').save(f'{out_dir}/master_plan_09_handover.jpg', quality=95)
print('Card 9 generated: Dream Home Handover')
print('All 9 Diagram Masterpieces Generated Successfully!')
