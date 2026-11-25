"""
Builds a city data pack for Site Evaluation: everything a home buyer checks around a plot
(hospitals, clinics, pharmacies, schools, colleges, metro, railway, bus, autos, airport, groceries,
ATMs, petrol pumps, restaurants, parks, malls, places of worship, police, main roads), from
OpenStreetMap (Overpass API).

With a pack, evaluating any plot in that city is instant and works when the free map servers are
busy. It asks politely, one category at a time, saves each category as soon as it arrives, and
resumes where it stopped if run again (a busy server can make it take a long time):

    python3 site-evaluation/tools/make_city_pack.py bengaluru 12.78 77.40 13.20 77.85

Writes site-evaluation/data/<city>.json and adds the city to data/index.json.
Data © OpenStreetMap contributors (ODbL).
"""
import json, os, sys, time, urllib.parse, urllib.request

SERVERS = ['https://overpass-api.de/api/interpreter', 'https://overpass.private.coffee/api/interpreter']
UA = 'NexoraSiteEvaluation/0.1 (city data pack builder)'
HERE = os.path.dirname(os.path.abspath(__file__))
DATA = os.path.join(HERE, '..', 'data')

# category id -> Overpass filters. 'rail' is split into metro and railway afterwards.
QUERIES = {
    'hospital':   ['nwr["amenity"="hospital"]', 'nwr["healthcare"="hospital"]'],
    'clinic':     ['nwr["amenity"~"^(clinic|doctors)$"]'],
    'pharmacy':   ['nwr["amenity"="pharmacy"]', 'nwr["shop"="chemist"]'],
    'school':     ['nwr["amenity"~"^(school|kindergarten)$"]'],
    'college':    ['nwr["amenity"~"^(college|university)$"]'],
    'rail':       ['nwr["railway"~"^(station|halt)$"]', 'nwr["station"~"^(subway|light_rail)$"]'],
    'bus':        ['nwr["amenity"="bus_station"]', 'node["highway"="bus_stop"]'],
    'auto':       ['nwr["amenity"="taxi"]'],
    'airport':    ['nwr["aeroway"="aerodrome"]["iata"]'],
    'grocery':    ['nwr["shop"~"^(supermarket|convenience|greengrocer|grocery)$"]'],
    'atm':        ['nwr["amenity"~"^(bank|atm)$"]'],
    'fuel':       ['nwr["amenity"="fuel"]'],
    'restaurant': ['nwr["amenity"~"^(restaurant|cafe|fast_food)$"]'],
    'park':       ['nwr["leisure"="park"]'],
    'mall':       ['nwr["shop"~"^(mall|department_store)$"]'],
    'worship':    ['nwr["amenity"="place_of_worship"]'],
    'police':     ['nwr["amenity"="police"]'],
    # locality names, for the instant place search
    'places':     ['nwr["place"~"^(city|town|suburb|neighbourhood|quarter|locality|village|hamlet)$"]["name"]'],
}
ROADS = 'way["highway"~"^(motorway|trunk|primary|secondary)$"]'


def overpass(q, label):
    body = urllib.parse.urlencode({'data': q}).encode()
    wait = 30
    for attempt in range(12):
        for url in SERVERS:
            try:
                req = urllib.request.Request(url, data=body, headers={'User-Agent': UA})
                with urllib.request.urlopen(req, timeout=300) as r:
                    return json.loads(r.read().decode('utf-8'))
            except Exception as e:  # busy, timeout, rate limit: wait and try again later
                print(f'    {label}: {url.split("/")[2]} busy ({e}); waiting {wait}s…', flush=True)
                time.sleep(wait)
        wait = min(wait * 2, 300)
    return None


def name(t, cat):
    n = t.get('name:en') or t.get('name')
    if n:
        return n
    return {'bus': 'Bus stop', 'auto': 'Auto / taxi stand', 'atm': 'ATM' if t.get('amenity') == 'atm' else 'Bank',
            'fuel': 'Petrol pump', 'pharmacy': 'Pharmacy', 'grocery': 'Store', 'worship': 'Place of worship'}.get(cat, '')


def is_metro(t):
    return (t.get('station') in ('subway', 'light_rail') or t.get('subway') == 'yes' or t.get('light_rail') == 'yes'
            or 'metro' in (t.get('name', '') + t.get('name:en', '') + t.get('network', '') + t.get('operator', '')).lower())


def main():
    if len(sys.argv) != 6:
        raise SystemExit(__doc__)
    city, s, w, n, e = sys.argv[1], *map(float, sys.argv[2:])
    bbox = f'{s},{w},{n},{e}'
    part_dir = os.path.join(DATA, '.parts', city)
    os.makedirs(part_dir, exist_ok=True)

    def part(cat):
        return os.path.join(part_dir, cat + '.json')

    for cat, filters in QUERIES.items():
        if os.path.exists(part(cat)):
            print(f'{cat}: already saved', flush=True)
            continue
        print(f'{cat}…', flush=True)
        d = overpass('[out:json][timeout:240];(' + ''.join(f'{f}({bbox});' for f in filters) + ');out center tags;', cat)
        if d is None:
            print(f'  {cat}: server too busy, skipped for now (run again later to add it)', flush=True)
            continue
        rows = []
        for el in d.get('elements', []):
            t = el.get('tags', {})
            lat = el.get('lat', el.get('center', {}).get('lat'))
            lng = el.get('lon', el.get('center', {}).get('lon'))
            if lat is None:
                continue
            row = [round(lat, 5), round(lng, 5), name(t, cat)]
            if cat == 'rail':
                row.append('metro' if is_metro(t) else 'railway')
            rows.append(row)
        json.dump(rows, open(part(cat), 'w'), separators=(',', ':'), ensure_ascii=False)
        print(f'  {len(rows)} places saved', flush=True)
        time.sleep(8)  # be gentle with the shared server

    if not os.path.exists(part('roads')):
        print('main roads…', flush=True)
        d = overpass(f'[out:json][timeout:240];{ROADS}({bbox});out tags geom;', 'roads')
        if d is not None:
            roads = []
            for el in d.get('elements', []):
                t = el.get('tags', {})
                g = el.get('geometry') or []
                if len(g) < 2:
                    continue
                rname = t.get('name:en') or t.get('name') or (('Road ' + t['ref']) if t.get('ref') else 'Main road')
                roads.append({'n': rname, 'k': t.get('highway'), 'c': [[round(p['lon'], 5), round(p['lat'], 5)] for p in g]})
            json.dump(roads, open(part('roads'), 'w'), separators=(',', ':'), ensure_ascii=False)
            print(f'  {len(roads)} road stretches saved', flush=True)

    # assemble whatever is saved so far (the page marks missing categories as not in the pack)
    pack = {'city': city, 'bbox': [s, w, n, e], 'generated': time.strftime('%Y-%m-%d'), 'source': 'OpenStreetMap (Overpass), ODbL', 'cats': {}, 'roads': []}
    for cat in QUERIES:
        if not os.path.exists(part(cat)):
            continue
        rows = json.load(open(part(cat)))
        if cat == 'rail':
            pack['cats']['metro'] = [r[:3] for r in rows if r[3] == 'metro']
            pack['cats']['railway'] = [r[:3] for r in rows if r[3] == 'railway']
        else:
            pack['cats'][cat] = rows
    if os.path.exists(part('roads')):
        pack['roads'] = json.load(open(part('roads')))
    missing = [c for c in QUERIES if not os.path.exists(part(c))] + ([] if os.path.exists(part('roads')) else ['roads'])
    pack['missing'] = missing
    with open(os.path.join(DATA, f'{city}.json'), 'w') as f:
        json.dump(pack, f, separators=(',', ':'), ensure_ascii=False)
    idx_path = os.path.join(DATA, 'index.json')
    idx = json.load(open(idx_path)) if os.path.exists(idx_path) else []
    idx = [c for c in idx if c['city'] != city] + [{'city': city, 'bbox': [s, w, n, e], 'file': f'{city}.json', 'generated': pack['generated']}]
    json.dump(idx, open(idx_path, 'w'), indent=1)
    size = os.path.getsize(os.path.join(DATA, f'{city}.json')) / 1e6
    print(f'Done: data/{city}.json ({size:.1f} MB)' + (f'; still missing: {", ".join(missing)} (run again later)' if missing else ''))


if __name__ == '__main__':
    main()
