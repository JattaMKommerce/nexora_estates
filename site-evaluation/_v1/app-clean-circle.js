/*
 * Site Evaluation (Nexora): a maps-app style tool for home buyers.
 *
 *  1. The city opens on a realistic satellite map.
 *  2. Tap the land where the building will come up (or search): the camera flies down and the plot is
 *     drawn as an open site, about one acre, with 1 km and 3 km rings.
 *  3. Everything a buyer checks is found around it (health, education, commute, daily needs,
 *     lifestyle and safety) and the nearest of each gets its REAL ROAD distance and drive time.
 *  4. Tap any place: a blue route is drawn along the roads, by car or on foot, like a maps app.
 *
 * Free and open, no API keys:
 *   map         MapLibre GL, Esri World Imagery satellite, OpenFreeMap labels and 3D buildings
 *   places      a city data pack (data/<city>.json, tools/make_city_pack.py) when the plot is in a
 *               packed city; otherwise OpenStreetMap live (Overpass, then Photon as a backup)
 *   roads       OSRM routing on routing.openstreetmap.de (car and foot)
 * Distances and times are estimates for a model; the score is an indication, not a valuation.
 */
(function () {
  'use strict';

  var CITY = { lat: 12.9716, lng: 77.5946, zoom: 10.6 };              // Bengaluru
  var SAMPLE = { lat: 12.9698, lng: 77.7500, name: 'Whitefield, Bengaluru' };
  var ROUTER = 'https://routing.openstreetmap.de';
  var OVERPASS = ['https://overpass-api.de/api/interpreter', 'https://overpass.private.coffee/api/interpreter'];
  var PHOTON = 'https://photon.komoot.io';
  var PLOT_SIDE = 64;                                                // metres: about one acre

  /* What a buyer checks, grouped the way they think ------------------------------------------------
   * range: how far we look (m)   good: a road distance that counts as close (m)   w: share of score  */
  var THEMES = [
    { id: 'health', name: 'Health' },
    { id: 'edu', name: 'Education' },
    { id: 'commute', name: 'Commute' },
    { id: 'daily', name: 'Daily needs' },
    { id: 'life', name: 'Lifestyle & safety' }
  ];
  var CATS = [
    { id: 'hospital', theme: 'health', name: 'Hospital', many: 'Hospitals', i: '🏥', c: '#d93025', range: 6000, good: 3000, w: 12, photon: ['amenity:hospital', 'healthcare:hospital'], osm: ['nwr["amenity"="hospital"]', 'nwr["healthcare"="hospital"]'] },
    { id: 'clinic', theme: 'health', name: 'Clinic', many: 'Clinics', i: '🩺', c: '#e8710a', range: 3000, good: 1500, w: 4, photon: ['amenity:clinic', 'amenity:doctors'], osm: ['nwr["amenity"~"^(clinic|doctors)$"]'] },
    { id: 'pharmacy', theme: 'health', name: 'Pharmacy', many: 'Pharmacies', i: '💊', c: '#e52592', range: 2000, good: 1000, w: 4, photon: ['amenity:pharmacy', 'shop:chemist'], osm: ['nwr["amenity"="pharmacy"]', 'nwr["shop"="chemist"]'] },
    { id: 'school', theme: 'edu', name: 'School', many: 'Schools', i: '🏫', c: '#1a73e8', range: 3000, good: 2000, w: 10, photon: ['amenity:school', 'amenity:kindergarten'], osm: ['nwr["amenity"~"^(school|kindergarten)$"]'] },
    { id: 'college', theme: 'edu', name: 'College', many: 'Colleges', i: '🎓', c: '#7627bb', range: 6000, good: 5000, w: 5, photon: ['amenity:college', 'amenity:university'], osm: ['nwr["amenity"~"^(college|university)$"]'] },
    { id: 'metro', theme: 'commute', name: 'Metro station', many: 'Metro stations', i: '🚇', c: '#12a4af', range: 10000, good: 2000, w: 12, photon: ['railway:station', 'public_transport:station'], osm: [] },
    { id: 'railway', theme: 'commute', name: 'Railway station', many: 'Railway stations', i: '🚆', c: '#795548', range: 15000, good: 6000, w: 4, photon: ['railway:station', 'railway:halt'], osm: [] },
    { id: 'bus', theme: 'commute', name: 'Bus stop', many: 'Bus stops', i: '🚌', c: '#188038', range: 1500, good: 600, w: 8, photon: ['amenity:bus_station', 'highway:bus_stop'], osm: ['nwr["amenity"="bus_station"]', 'node["highway"="bus_stop"]'] },
    { id: 'auto', theme: 'commute', name: 'Auto stand', many: 'Auto & taxi stands', i: '🛺', c: '#f9ab00', range: 2000, good: 1000, w: 3, photon: ['amenity:taxi'], osm: ['nwr["amenity"="taxi"]'] },
    { id: 'road', theme: 'commute', name: 'Main road', many: 'Main roads', i: '🛣️', c: '#5f6368', range: 2500, good: 700, w: 8, photon: ['highway:trunk', 'highway:primary', 'highway:secondary'], osm: [] },
    { id: 'airport', theme: 'commute', name: 'Airport', many: 'Airports', i: '✈️', c: '#455a64', range: 60000, good: 25000, w: 3, photon: ['aeroway:aerodrome'], osm: ['nwr["aeroway"="aerodrome"]["iata"]'] },
    { id: 'grocery', theme: 'daily', name: 'Grocery', many: 'Groceries & supermarkets', i: '🛒', c: '#e37400', range: 2000, good: 800, w: 7, photon: ['shop:supermarket', 'shop:convenience', 'shop:greengrocer'], osm: ['nwr["shop"~"^(supermarket|convenience|greengrocer|grocery)$"]'] },
    { id: 'atm', theme: 'daily', name: 'Bank / ATM', many: 'Banks & ATMs', i: '🏧', c: '#3949ab', range: 2000, good: 800, w: 4, photon: ['amenity:atm', 'amenity:bank'], osm: ['nwr["amenity"~"^(bank|atm)$"]'] },
    { id: 'fuel', theme: 'daily', name: 'Petrol pump', many: 'Petrol pumps', i: '⛽', c: '#c5221f', range: 5000, good: 2500, w: 3, photon: ['amenity:fuel'], osm: ['nwr["amenity"="fuel"]'] },
    { id: 'restaurant', theme: 'daily', name: 'Restaurant', many: 'Restaurants & cafés', i: '🍽️', c: '#ff7043', range: 2000, good: 1000, w: 3, photon: ['amenity:restaurant', 'amenity:cafe', 'amenity:fast_food'], osm: ['nwr["amenity"~"^(restaurant|cafe|fast_food)$"]'] },
    { id: 'park', theme: 'life', name: 'Park', many: 'Parks', i: '🌳', c: '#137333', range: 3000, good: 1000, w: 4, photon: ['leisure:park'], osm: ['nwr["leisure"="park"]'] },
    { id: 'mall', theme: 'life', name: 'Mall', many: 'Malls', i: '🛍️', c: '#b80672', range: 8000, good: 4000, w: 3, photon: ['shop:mall', 'shop:department_store'], osm: ['nwr["shop"~"^(mall|department_store)$"]'] },
    { id: 'worship', theme: 'life', name: 'Place of worship', many: 'Temples, churches & mosques', i: '🛕', c: '#9334e6', range: 2000, good: 1000, w: 2, photon: ['amenity:place_of_worship'], osm: ['nwr["amenity"="place_of_worship"]'] },
    { id: 'police', theme: 'life', name: 'Police station', many: 'Police stations', i: '🚓', c: '#174ea6', range: 5000, good: 2500, w: 3, photon: ['amenity:police'], osm: ['nwr["amenity"="police"]'] }
  ];
  var CAT = {};
  CATS.forEach(function (c) { CAT[c.id] = c; });
  var W_TOTAL = CATS.reduce(function (n, c) { return n + c.w; }, 0);

  var $ = function (id) { return document.getElementById(id); };
  var body = $('body');
  var mobile = function () { return window.matchMedia('(max-width: 820px)').matches; };

  var site = null;            // { lat, lng, name }
  var data = null;            // { items: { cat: [place] }, failed: {}, source }
  var view = 'welcome';       // welcome | loading | site | around | list | place
  var listFrom = 'site';      // where a category list was opened from
  var listCat = null;
  var cur = null;             // the place on the card
  var mode = 'car';
  var pins = [];
  var routeSeq = 0;

  /* Helpers ------------------------------------------------------------------------------------- */

  function dist(a, b) {
    var R = 6371000, r = Math.PI / 180, dLat = (b.lat - a.lat) * r, dLng = (b.lng - a.lng) * r;
    var x = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(a.lat * r) * Math.cos(b.lat * r) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
    return 2 * R * Math.asin(Math.sqrt(x));
  }
  function km(m) { return m == null ? '–' : m < 950 ? Math.round(m / 10) * 10 + ' m' : (m / 1000).toFixed(m < 9950 ? 1 : 0) + ' km'; }
  function mins(s) { if (s == null) return '–'; var m = Math.max(1, Math.round(s / 60)); return m < 60 ? m + ' min' : Math.floor(m / 60) + ' h ' + (m % 60 ? (m % 60) + ' min' : ''); }
  function esc(t) { return String(t == null ? '' : t).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function offsetLL(c, dx, dy) { return [c.lng + dx / (111320 * Math.cos(c.lat * Math.PI / 180)), c.lat + dy / 110540]; }
  function circle(c, m) { var p = []; for (var i = 0; i <= 96; i++) { var a = i / 96 * Math.PI * 2; p.push(offsetLL(c, m * Math.cos(a), m * Math.sin(a))); } return p; }
  function toast(t, ms) {
    var el = $('toast'); el.textContent = t; el.classList.add('is-on');
    clearTimeout(toast.t); toast.t = setTimeout(function () { el.classList.remove('is-on'); }, ms || 3200);
  }
  function fetchT(url, opts, ms) {
    opts = opts || {};
    var ctrl = window.AbortController ? new AbortController() : null, t = ctrl && setTimeout(function () { ctrl.abort(); }, ms || 20000);
    if (ctrl) opts.signal = ctrl.signal;
    return fetch(url, opts).finally(function () { if (t) clearTimeout(t); });
  }
  // how close is "close": green within the category's good distance, amber within 2.5×, red beyond
  function rating(cat, m) { if (m == null) return 'n'; var g = CAT[cat].good; return m <= g ? 'g' : m <= g * 2.5 ? 'a' : 'r'; }
  // road distance of a place: the routed one when we have it, else straight line × 1.35
  function roadM(p) { return p.road ? p.road.d : p.m * 1.35; }
  function driveS(p) { return p.road ? p.road.t : (p.m * 1.35) / 1000 / 24 * 3600; }
  function walkS(p) { return roadM(p) / 1000 / 4.6 * 3600; }

  /* Map ------------------------------------------------------------------------------------------- */

  var map = new maplibregl.Map({
    container: 'map', center: [CITY.lng, CITY.lat], zoom: CITY.zoom, pitch: 0, maxPitch: 85, attributionControl: false,
    style: {
      version: 8,
      sky: { 'sky-color': '#8fbfee', 'horizon-color': '#e4eef8', 'fog-color': '#eef3f8', 'sky-horizon-blend': 0.55, 'horizon-fog-blend': 0.6, 'fog-ground-blend': 0.88 },
      glyphs: 'https://tiles.openfreemap.org/fonts/{fontstack}/{range}.pbf',
      sources: {
        sat: { type: 'raster', tileSize: 256, maxzoom: 19, tiles: ['https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'], attribution: 'Imagery © Esri, Maxar, Earthstar Geographics' },
        osm: { type: 'vector', url: 'https://tiles.openfreemap.org/planet', attribution: '© OpenStreetMap contributors · OpenFreeMap · Routes: OSRM' }
      },
      layers: [
        { id: 'sat', type: 'raster', source: 'sat', paint: { 'raster-contrast': 0.06 } },
        { id: 'buildings', type: 'fill-extrusion', source: 'osm', 'source-layer': 'building', minzoom: 14, layout: { visibility: 'none' },
          paint: { 'fill-extrusion-color': '#f3efe6', 'fill-extrusion-height': ['coalesce', ['get', 'render_height'], 8], 'fill-extrusion-base': ['coalesce', ['get', 'render_min_height'], 0], 'fill-extrusion-opacity': 0.4 } },
        { id: 'road-names', type: 'symbol', source: 'osm', 'source-layer': 'transportation_name', minzoom: 13,
          layout: { 'symbol-placement': 'line', 'text-field': ['coalesce', ['get', 'name:en'], ['get', 'name']], 'text-font': ['Noto Sans Regular'], 'text-size': 12 },
          paint: { 'text-color': '#fff', 'text-halo-color': 'rgba(0,0,0,.8)', 'text-halo-width': 1.5 } },
        { id: 'places', type: 'symbol', source: 'osm', 'source-layer': 'place', maxzoom: 15.5,
          layout: { 'text-field': ['coalesce', ['get', 'name:en'], ['get', 'name']], 'text-font': ['Noto Sans Bold'], 'text-size': ['interpolate', ['linear'], ['zoom'], 9, 11, 14, 15] },
          paint: { 'text-color': '#fff', 'text-halo-color': 'rgba(0,0,0,.85)', 'text-halo-width': 1.8 } }
      ]
    }
  });
  map.addControl(new maplibregl.AttributionControl({ compact: true }), 'bottom-right');
  map.addControl(new maplibregl.NavigationControl({ visualizePitch: true, showZoom: !('ontouchstart' in window) }), 'bottom-right');
  map.addControl(new maplibregl.ScaleControl({ unit: 'metric' }), 'bottom-left');

  var EMPTY = { type: 'FeatureCollection', features: [] };
  map.on('load', function () {
    map.addSource('rings', { type: 'geojson', data: EMPTY });
    map.addLayer({ id: 'rings', type: 'line', source: 'rings', paint: { 'line-color': '#ffffff', 'line-width': 1.5, 'line-opacity': 0.75, 'line-dasharray': [3, 3] } });
    map.addLayer({ id: 'ring-labels', type: 'symbol', source: 'rings', layout: { 'symbol-placement': 'line', 'text-field': ['get', 'label'], 'text-font': ['Noto Sans Bold'], 'text-size': 12, 'symbol-spacing': 400 },
      paint: { 'text-color': '#fff', 'text-halo-color': 'rgba(0,0,0,.85)', 'text-halo-width': 1.6 } });
    map.addSource('route', { type: 'geojson', data: EMPTY });
    map.addLayer({ id: 'route-casing', type: 'line', source: 'route', layout: { 'line-cap': 'round', 'line-join': 'round' }, paint: { 'line-color': '#0b57d0', 'line-width': 10 } });
    map.addLayer({ id: 'route', type: 'line', source: 'route', layout: { 'line-cap': 'round', 'line-join': 'round' }, paint: { 'line-color': '#4285f4', 'line-width': 6.5 } });
    map.addSource('spokes', { type: 'geojson', data: EMPTY });
    map.addLayer({ id: 'spokes', type: 'line', source: 'spokes', layout: { 'line-cap': 'round' }, paint: { 'line-color': ['get', 'c'], 'line-width': 2.5, 'line-opacity': 0.9, 'line-dasharray': [2, 1.5] } }, 'route-casing');
    map.addSource('plot', { type: 'geojson', data: EMPTY });
    map.addLayer({ id: 'plot-fill', type: 'fill', source: 'plot', paint: { 'fill-color': '#ffd200', 'fill-opacity': 0 } });
    map.addLayer({ id: 'plot-line', type: 'line', source: 'plot', paint: { 'line-color': '#ffd200', 'line-width': 3.5, 'line-opacity': 0 } });
    // deep link: ?lat=…&lng=…&name=…
    var qs = new URLSearchParams(location.search);
    var la = parseFloat(qs.get('lat')), lo = parseFloat(qs.get('lng'));
    if (isFinite(la) && isFinite(lo)) chooseSite(la, lo, qs.get('name'));
  });

  /* The site: a round mark where the residential building will come up ----------------------------- */

  var SITE_R = 45;   // metres
  var siteDot = null, label = null;
  function drawPlot() {
    var c = site;
    map.getSource('plot').setData({ type: 'Feature', geometry: { type: 'Polygon', coordinates: [circle(c, SITE_R)] } });
    map.getSource('rings').setData({ type: 'FeatureCollection', features: [1000, 3000].map(function (m) {
      return { type: 'Feature', properties: { label: km(m) }, geometry: { type: 'LineString', coordinates: circle(c, m) } };
    }) });
    map.setPaintProperty('plot-fill', 'fill-opacity', 0);
    map.setPaintProperty('plot-line', 'line-opacity', 0);
    var t0 = performance.now();
    (function grow(now) {
      var k = Math.min(1, (now - t0) / 800);
      map.setPaintProperty('plot-fill', 'fill-opacity', 0.32 * k);
      map.setPaintProperty('plot-line', 'line-opacity', k);
      if (k < 1) requestAnimationFrame(grow);
    })(t0);
    if (!siteDot) {
      var d = document.createElement('div');
      d.className = 'site-dot';
      siteDot = new maplibregl.Marker({ element: d });
      var el = document.createElement('div');
      el.className = 'site-label';
      el.innerHTML = 'PROPOSED RESIDENTIAL SITE<small>Site evaluation</small>';
      label = new maplibregl.Marker({ element: el, anchor: 'bottom', offset: [0, -26] });
    }
    siteDot.setLngLat([c.lng, c.lat]).addTo(map);
    label.setLngLat([c.lng, c.lat]).addTo(map);
    siteDot.getElement().style.zIndex = '21';
    label.getElement().style.zIndex = '20';
  }

  // the four sides (used by "What's on each side")
  function brg(a, b) {
    var r = Math.PI / 180, y = Math.sin((b.lng - a.lng) * r) * Math.cos(b.lat * r);
    var x = Math.cos(a.lat * r) * Math.sin(b.lat * r) - Math.sin(a.lat * r) * Math.cos(b.lat * r) * Math.cos((b.lng - a.lng) * r);
    return (Math.atan2(y, x) / r + 360) % 360;
  }
  var SIDES = [{ id: 'N', name: 'North', b: 0 }, { id: 'E', name: 'East', b: 90 }, { id: 'S', name: 'South', b: 180 }, { id: 'W', name: 'West', b: 270 }];
  function sideOf(b) { return SIDES[Math.round(b / 90) % 4]; }
  var curSide = 'N';

  // back to the site: straight down, like a maps app
  function goSite(duration) {
    if (!site) return;
    map.flyTo({ center: [site.lng, site.lat], zoom: 17.4, pitch: 0, bearing: 0, duration: duration || 1300, essential: true, padding: framePad() });
  }

  function chooseSite(lat, lng, name) {
    site = { lat: lat, lng: lng, name: name || null };
    data = null; listCat = null; cur = null;
    clearRoute();
    clearPins();
    setChip(null);
    closeMenu();
    $('t-site').hidden = false;
    // down from the city onto the site
    map.flyTo({ center: [lng, lat], zoom: 17.4, pitch: 0, bearing: 0, duration: 2600, essential: true, padding: framePad(), curve: 1.5 });
    map.once('moveend', function () { if (site && site.lat === lat) drawPlot(); });
    if (!name) placeName(lat, lng);
    evaluate();
  }

  function placeName(lat, lng) {
    var s = site;
    fetchT(PHOTON + '/reverse?lat=' + lat + '&lon=' + lng + '&limit=1&lang=en', {}, 8000).then(function (r) { return r.json(); }).then(function (d) {
      var p = d.features && d.features[0] && d.features[0].properties;
      if (!p || s !== site) return;
      var parts = [p.street || p.name, p.district || p.locality, p.city].filter(Boolean).filter(function (x, i, a) { return a.indexOf(x) === i; });
      site.name = parts.slice(0, 3).join(', ');
      if (view === 'site' || view === 'around') render();
    }).catch(function () { /* the coordinates stay */ });
  }

  // a tap on the map: the first one chooses the site; after that it asks before moving it
  var movePop = null;
  map.on('click', function (e) {
    var tgt = e.originalEvent && e.originalEvent.target;
    if (tgt && tgt.closest && tgt.closest('.pin, .maplibregl-popup')) return;
    $('suggest').hidden = true;
    if (!site) { chooseSite(e.lngLat.lat, e.lngLat.lng); return; }
    if (movePop) movePop.remove();
    var b = document.createElement('button');
    b.className = 'btn btn--yellow btn--sm';
    b.textContent = 'Build here instead';
    b.addEventListener('click', function () { movePop.remove(); chooseSite(e.lngLat.lat, e.lngLat.lng); });
    movePop = new maplibregl.Popup({ closeButton: false, offset: 8 }).setLngLat(e.lngLat).setDOMContent(b).addTo(map);
  });

  /* Getting the places -------------------------------------------------------------------------------- */

  function classify(t) {
    var a = t.amenity, s = t.shop;
    if (t.highway && /^(motorway|trunk|primary|secondary)$/.test(t.highway)) return 'road';
    if (t.railway === 'station' || t.railway === 'halt' || t.station === 'subway' || t.station === 'light_rail') {
      var txt = ((t.name || '') + (t['name:en'] || '') + (t.network || '') + (t.operator || '')).toLowerCase();
      return (t.station === 'subway' || t.station === 'light_rail' || t.subway === 'yes' || t.light_rail === 'yes' || txt.indexOf('metro') >= 0) ? 'metro' : 'railway';
    }
    if (a === 'hospital' || t.healthcare === 'hospital') return 'hospital';
    if (a === 'clinic' || a === 'doctors') return 'clinic';
    if (a === 'pharmacy' || s === 'chemist') return 'pharmacy';
    if (a === 'school' || a === 'kindergarten') return 'school';
    if (a === 'college' || a === 'university') return 'college';
    if (a === 'bus_station' || t.highway === 'bus_stop') return 'bus';
    if (a === 'taxi') return 'auto';
    if (t.aeroway === 'aerodrome') return 'airport';
    if (/^(supermarket|convenience|greengrocer|grocery)$/.test(s || '')) return 'grocery';
    if (a === 'bank' || a === 'atm') return 'atm';
    if (a === 'fuel') return 'fuel';
    if (/^(restaurant|cafe|fast_food)$/.test(a || '')) return 'restaurant';
    if (t.leisure === 'park') return 'park';
    if (s === 'mall' || s === 'department_store') return 'mall';
    if (a === 'place_of_worship') return 'worship';
    if (a === 'police') return 'police';
    return null;
  }
  function nameOf(t, cat) {
    var n = t['name:en'] || t.name;
    if (n) return n;
    if (cat === 'road') return t.ref ? 'Road ' + t.ref : 'Main road';
    if (cat === 'atm') return t.amenity === 'atm' ? 'ATM' : 'Bank';
    if (cat === 'worship') return { hindu: 'Temple', christian: 'Church', muslim: 'Mosque' }[t.religion] || 'Place of worship';
    return CAT[cat].name;
  }
  function blank() { var o = {}; CATS.forEach(function (c) { o[c.id] = []; }); return o; }
  function keep(items, at) {
    Object.keys(items).forEach(function (k) {
      items[k] = items[k].map(function (p) { if (p.m == null) p.m = dist(at, p); return p; })
        .filter(function (p) { return p.m <= CAT[k].range + 60; }).sort(function (a, b) { return a.m - b.m; });
    });
    return items;
  }

  var packIndex = null, packs = {};
  function pack(at) {
    packIndex = packIndex || fetchT('data/index.json', {}, 8000).then(function (r) { return r.ok ? r.json() : []; }).catch(function () { return []; });
    return packIndex.then(function (list) {
      var hit = list.filter(function (c) { return at.lat >= c.bbox[0] && at.lat <= c.bbox[2] && at.lng >= c.bbox[1] && at.lng <= c.bbox[3]; })[0];
      if (!hit) return null;
      packs[hit.file] = packs[hit.file] || fetchT('data/' + hit.file, {}, 30000).then(function (r) { if (!r.ok) throw new Error('pack'); return r.json(); });
      return packs[hit.file];
    }).catch(function () { return null; });
  }
  function fromPack(p, at) {
    var items = blank(), failed = {};
    CATS.forEach(function (c) {
      if (c.id === 'road') return;
      var rows = p.cats[c.id];
      if (!rows) { failed[c.id] = true; return; }
      var dLat = c.range / 110540, dLng = c.range / (111320 * Math.cos(at.lat * Math.PI / 180));
      items[c.id] = rows.filter(function (r) { return Math.abs(r[0] - at.lat) <= dLat && Math.abs(r[1] - at.lng) <= dLng; })
        .map(function (r) { return { name: r[2] || CAT[c.id].name, lat: r[0], lng: r[1] }; });
    });
    if (p.roads && p.roads.length) {
      var best = {};
      p.roads.forEach(function (r) {
        r.c.forEach(function (pt) {
          var q = { lat: pt[1], lng: pt[0] }, m = dist(at, q);
          if (m <= CAT.road.range && (!best[r.n] || m < best[r.n].m)) best[r.n] = { name: r.n, lat: q.lat, lng: q.lng, m: m };
        });
      });
      items.road = Object.keys(best).map(function (k) { return best[k]; });
    } else failed.road = true;
    return { items: keep(items, at), failed: failed, source: 'OpenStreetMap city pack (' + p.generated + ')' };
  }

  function overpass(url, at) {
    var A = at.lat + ',' + at.lng, parts = [];
    CATS.forEach(function (c) { c.osm.forEach(function (f) { parts.push(f + '(around:' + c.range + ',' + A + ');'); }); });
    parts.push('nwr["railway"~"^(station|halt)$"](around:' + CAT.railway.range + ',' + A + ');');
    parts.push('nwr["station"~"^(subway|light_rail)$"](around:' + CAT.metro.range + ',' + A + ');');
    var q = '[out:json][timeout:40];(' + parts.join('') + ')->.p;.p out center tags 2500;' +
      'way["highway"~"^(motorway|trunk|primary|secondary)$"](around:' + CAT.road.range + ',' + A + ');out tags geom 400;';
    return fetchT(url, { method: 'POST', body: 'data=' + encodeURIComponent(q), headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }, 25000)
      .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
      .then(function (d) {
        var items = blank(), best = {};
        (d.elements || []).forEach(function (e) {
          var t = e.tags || {}, cat = classify(t);
          if (!cat) return;
          if (cat === 'road') {
            (e.geometry || []).forEach(function (g) {
              var q2 = { lat: g.lat, lng: g.lon }, m = dist(at, q2), nm = nameOf(t, 'road');
              if (!best[nm] || m < best[nm].m) best[nm] = { name: nm, lat: q2.lat, lng: q2.lng, m: m };
            });
            return;
          }
          var lat = e.lat != null ? e.lat : e.center && e.center.lat, lng = e.lon != null ? e.lon : e.center && e.center.lon;
          if (lat != null) items[cat].push({ name: nameOf(t, cat), lat: lat, lng: lng });
        });
        items.road = Object.keys(best).map(function (k) { return best[k]; });
        return { items: keep(items, at), failed: {}, source: 'OpenStreetMap (live)' };
      });
  }

  // the backup: one category at a time, politely; a category that doesn't load says so
  // (at most ~30 s in all: a buyer shouldn't wait longer; what's missing can be retried)
  function photon(at, only) {
    var items = blank(), failed = {}, stop = false, chain = Promise.resolve(), t0 = Date.now();
    CATS.filter(function (c) { return !only || only[c.id]; }).forEach(function (c) {
      chain = chain.then(function () {
        if (stop || Date.now() - t0 > 30000) { failed[c.id] = true; return; }
        var url = PHOTON + '/reverse?lat=' + at.lat + '&lon=' + at.lng + '&radius=' + (Math.min(c.range, 20000) / 1000) + '&limit=20&lang=en' +
          c.photon.map(function (t) { return '&osm_tag=' + encodeURIComponent(t); }).join('');
        return fetchT(url, {}, 8000).then(function (r) { if (r.status === 429) { stop = true; throw 0; } if (!r.ok) throw 0; return r.json(); })
          .then(function (d) {
            (d.features || []).forEach(function (f) {
              var p = f.properties, t = {}; t[p.osm_key] = p.osm_value; if (p.name) t.name = p.name;
              var cat = c.id === 'metro' || c.id === 'railway' ? classify(Object.assign({ railway: 'station' }, t)) : c.id;
              if (cat !== c.id) return;
              items[c.id].push({ name: nameOf(t, c.id), lat: f.geometry.coordinates[1], lng: f.geometry.coordinates[0] });
            });
          }).catch(function () { failed[c.id] = true; })
          .then(function () { return new Promise(function (ok) { setTimeout(ok, 300); }); });
      });
    });
    return chain.then(function () { return { items: keep(items, at), failed: failed, source: 'OpenStreetMap (live, backup)' }; });
  }

  function places(at) {
    var key = 'se2:' + at.lat.toFixed(4) + ',' + at.lng.toFixed(4);
    try { var hit = JSON.parse(sessionStorage.getItem(key) || 'null'); if (hit) return Promise.resolve(hit); } catch (e) { /* no storage */ }
    return pack(at).then(function (p) {
      if (p) {
        var r = fromPack(p, at);
        var miss = Object.keys(r.failed);
        if (!miss.length) return r;
        // categories the pack doesn't have yet come live
        return photon(at, r.failed).then(function (x) { miss.forEach(function (k) { r.items[k] = x.items[k]; if (!x.failed[k]) delete r.failed[k]; }); return r; });
      }
      // the full live answer if the main server is quick enough, else the backup straight away
      return overpass(OVERPASS[0], at).catch(function () { return photon(at); });
    }).then(function (r) {
      try { if (!Object.keys(r.failed).length) sessionStorage.setItem(key, JSON.stringify(r)); } catch (e) { /* full */ }
      return r;
    });
  }

  /* Real road distances: one request for the nearest few of every category ------------------------------ */

  function roadTable(at, list) {
    if (!list.length) return Promise.resolve();
    var coords = [at.lng.toFixed(5) + ',' + at.lat.toFixed(5)].concat(list.map(function (p) { return p.lng.toFixed(5) + ',' + p.lat.toFixed(5); }));
    return fetchT(ROUTER + '/routed-car/table/v1/driving/' + coords.join(';') + '?sources=0&annotations=distance,duration', {}, 15000)
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (d) {
        if (!d || d.code !== 'Ok') return;
        list.forEach(function (p, i) {
          var m = d.distances[0][i + 1], s = d.durations[0][i + 1];
          if (m != null && s != null) p.road = { d: m, t: s };
        });
      }).catch(function () { /* straight-line estimates stay */ });
  }
  function nearestByRoad(items) {
    var pick = [];
    CATS.forEach(function (c) { (items[c.id] || []).slice(0, c.id === 'airport' ? 1 : 3).forEach(function (p) { if (!p.road) pick.push(p); }); });
    return roadTable(site, pick.slice(0, 90)).then(function () {
      CATS.forEach(function (c) {
        var l = items[c.id] || [];
        var top = l.slice(0, 3).sort(function (a, b) { return roadM(a) - roadM(b); });
        items[c.id] = top.concat(l.slice(3));
      });
    });
  }

  /* Evaluate ------------------------------------------------------------------------------------------ */

  var evalSeq = 0;
  function evaluate() {
    var seq = ++evalSeq, at = { lat: site.lat, lng: site.lng };
    view = 'loading';
    render();
    sheetTo(mobile() ? 'peek' : null);
    places(at).then(function (r) {
      if (seq !== evalSeq) return;
      data = r;
      return nearestByRoad(r.items);
    }).then(function () {
      if (seq !== evalSeq || !data) return;
      view = 'site';
      render();
    }).catch(function () {
      if (seq !== evalSeq) return;
      view = 'site';
      data = { items: blank(), failed: CATS.reduce(function (o, c) { o[c.id] = true; return o; }, {}), source: '' };
      render();
      toast('The free map services are busy. Try again in a minute.');
    });
  }

  function score() {
    var s = 0;
    CATS.forEach(function (c) {
      var p = data.items[c.id][0];
      if (!p) return;
      var m = roadM(p), f = m <= c.good ? 1 : m <= c.good * 2 ? 0.7 : m <= c.good * 4 ? 0.4 : 0.12;
      s += c.w * f;
    });
    return Math.round(s / W_TOTAL * 100);
  }

  /* Pins ------------------------------------------------------------------------------------------------ */

  function clearPins() { pins.forEach(function (m) { m.remove(); }); pins = []; }
  function addPin(p, c, small, tag) {
    var el = document.createElement('div');
    el.className = 'pin' + (small ? ' pin--small' : '');
    el.style.setProperty('--c', c.c);
    el.textContent = small ? '' : c.i;
    el.title = p.name;
    el.addEventListener('click', function (ev) { ev.stopPropagation(); openPlace(p, c.id); });
    var node = el;
    if (tag) {
      node = document.createElement('div');
      node.style.cssText = 'display:grid;justify-items:center;gap:3px';
      var t = document.createElement('span');
      t.className = 'spoke-tag';
      t.style.setProperty('--c', c.c);
      t.textContent = c.name + ' · ' + km(roadM(p));
      node.appendChild(el);
      node.appendChild(t);
    }
    var mk = new maplibregl.Marker({ element: node, anchor: tag ? 'top' : 'center', offset: tag ? [0, -16] : [0, 0] }).setLngLat([p.lng, p.lat]).addTo(map);
    mk._el = el;
    mk._place = p;
    pins.push(mk);
  }
  // overview: the nearest of each category; a list: all of that category
  function showPins() {
    clearPins();
    if (!data) return;
    if (listCat) {
      (data.items[listCat] || []).slice(0, 60).forEach(function (p, i) { addPin(p, CAT[listCat], listCat === 'bus' && i > 9); });
    } else {
      CATS.forEach(function (c) { var p = data.items[c.id][0]; if (p) addPin(p, c); });
    }
    markSelected();
  }
  function markSelected() { pins.forEach(function (m) { (m._el || m.getElement()).classList.toggle('is-sel', !!cur && m._place === cur.p); }); }

  /* Routes ---------------------------------------------------------------------------------------------- */

  var badge = null;
  function clearRoute() {
    routeSeq++;
    if (map.getSource('route')) map.getSource('route').setData(EMPTY);
    if (badge) { badge.remove(); badge = null; }
  }
  function drawRoute(p) {
    var seq = ++routeSeq, prof = mode === 'car' ? 'routed-car' : 'routed-foot';
    var url = ROUTER + '/' + prof + '/route/v1/driving/' + site.lng.toFixed(6) + ',' + site.lat.toFixed(6) + ';' + p.lng.toFixed(6) + ',' + p.lat.toFixed(6) + '?overview=full&geometries=geojson';
    map.setPaintProperty('route', 'line-dasharray', mode === 'car' ? null : [0.1, 1.8]);
    map.setPaintProperty('route-casing', 'line-opacity', mode === 'car' ? 1 : 0);
    return fetchT(url, {}, 15000).then(function (r) { return r.ok ? r.json() : null; }).then(function (d) {
      if (seq !== routeSeq) return null;
      var rt = d && d.code === 'Ok' && d.routes[0];
      if (!rt) throw new Error('no route');
      map.getSource('route').setData({ type: 'Feature', geometry: rt.geometry });
      var co = rt.geometry.coordinates, mid = co[Math.floor(co.length / 2)];
      if (badge) badge.remove();
      var el = document.createElement('div');
      el.className = 'route-badge';
      el.innerHTML = (mode === 'car' ? '🚗 ' : '🚶 ') + esc(mins(rt.duration)) + ' <small>' + esc(km(rt.distance)) + '</small>';
      badge = new maplibregl.Marker({ element: el }).setLngLat(mid).addTo(map);
      var b = new maplibregl.LngLatBounds(co[0], co[0]);
      co.forEach(function (c) { b.extend(c); });
      map.fitBounds(b, { padding: framePad(60), pitch: 0, bearing: 0, maxZoom: 16.5, duration: 1300 });
      return { d: rt.distance, t: rt.duration };
    }).catch(function () {
      if (seq !== routeSeq) return null;
      // no route from the service: a straight dashed line, honestly labelled
      map.getSource('route').setData({ type: 'Feature', geometry: { type: 'LineString', coordinates: [[site.lng, site.lat], [p.lng, p.lat]] } });
      toast('Road route unavailable right now: showing the straight-line direction.');
      return null;
    });
  }

  /* Views --------------------------------------------------------------------------------------------- */

  function render() {
    if (view === 'welcome') body.innerHTML = welcomeHTML();
    else if (view === 'loading') body.innerHTML = siteHead() + '<div class="sep"></div>' + Array(7).join('<div class="skel"><i></i><span></span></div>');
    else if (view === 'site') body.innerHTML = siteHead() + siteHTML();
    else if (view === 'around') body.innerHTML = aroundHTML();
    else if (view === 'list') body.innerHTML = listHTML();
    else if (view === 'place') body.innerHTML = placeHTML();
    body.scrollTop = 0;
    wire();
  }

  function welcomeHTML() {
    return '<div class="welcome"><div class="welcome__art" aria-hidden="true"></div>' +
      '<h1>Where will your home stand?</h1>' +
      '<p>See the land from the sky, and everything around it that matters before you buy: hospitals, schools, metro, bus, shops, with real road distances.</p>' +
      '<ol class="steps"><li><b>1</b>Tap the land on the map where the building will come up, or search an address.</li>' +
      '<li><b>2</b>The site is marked and everything nearby is found in one go.</li>' +
      '<li><b>3</b>Tap any place to see the route and travel time, like a maps app.</li></ol>' +
      '<button class="btn btn--fill" data-act="sample" type="button">Try a sample site in Whitefield</button></div>';
  }

  function siteHead() {
    return '<div class="site"><div class="site__top"><div class="site__text"><span class="site__badge"><i></i>Proposed residential site</span>' +
      '<h1>' + esc(site.name || 'Selected site') + '</h1>' +
      '<div class="site__meta">' + site.lat.toFixed(5) + ', ' + site.lng.toFixed(5) + '</div></div>' +
      '<div class="kebab"><button class="icon-x" data-act="menu" type="button" aria-label="More options" aria-haspopup="true" aria-expanded="false">⋮</button>' +
      '<div class="menu" id="menu" hidden role="menu">' +
        '<button role="menuitem" data-act="around" type="button" ' + (data ? '' : 'disabled') + '>📍 Nearby places &amp; distances</button>' +
        '<button role="menuitem" data-act="sides" type="button" ' + (data ? '' : 'disabled') + '>🧭 What’s on each side</button>' +
        '<button role="menuitem" data-act="street" type="button">🚶 Street View of the site</button>' +
        '<button role="menuitem" data-act="max" type="button">⤢ Maximise the map</button>' +
        '<a role="menuitem" target="_blank" rel="noopener" href="https://www.google.com/maps/search/?api=1&query=' + site.lat + ',' + site.lng + '">🗺️ Open in Google Maps</a>' +
        '<button role="menuitem" data-act="share" type="button">🔗 Share this site</button>' +
        '<button role="menuitem" data-act="close" type="button">✕ Choose another site</button>' +
      '</div></div></div></div>';
  }

  function verdictOf(s) { return s >= 80 ? 'Excellent location' : s >= 65 ? 'Very good location' : s >= 50 ? 'Good location' : s >= 35 ? 'Average location' : 'Developing area'; }

  // the clean card: the site, its score, Street View; the distances live behind ⋮
  function siteHTML() {
    var s = score(), color = s >= 65 ? '#188038' : s >= 45 ? '#e37400' : '#d93025';
    var n = CATS.reduce(function (t, c) { return t + (data.items[c.id] || []).length; }, 0);
    return '<button class="sv-card" data-act="street" type="button"><span class="sv-card__img" aria-hidden="true"><span class="sv-card__man">🚶</span></span>' +
      '<span class="sv-card__text"><b>Street View</b><small>See the site and its surroundings at street level</small></span><span class="sv-card__go">›</span></button>' +
      '<div class="score"><div class="ring"><svg viewBox="0 0 74 74"><circle cx="37" cy="37" r="32" class="ring__bg"/><circle cx="37" cy="37" r="32" class="ring__fg" id="ring" style="stroke:' + color + '"/></svg><b>' + s + '</b></div>' +
      '<div><h2>' + verdictOf(s) + '</h2><p>Livability score from ' + n + ' places around this site.</p></div></div>' +
      '<div class="hint-row"><button class="btn" data-act="around" type="button">Nearby places &amp; distances</button></div>' +
      '<p class="hint">Tap a chip at the top (Hospitals, Schools, Metro…) to see those places on the map, then tap one for the route.</p>';
  }

  function aroundHTML() {
    var it = data.items, h = '<div class="head"><button class="back" data-act="back" type="button" aria-label="Back">←</button><h2>Nearby places</h2></div>';
    h += '<div class="theme"><h3>What’s on each side</h3><div class="sides">' +
      SIDES.map(function (sd) { return '<button type="button" data-side="' + sd.id + '" class="' + (sd.id === curSide ? 'is-on' : '') + '">' + sd.name + '</button>'; }).join('') +
      '</div><div class="side-list">' + sideHTML(curSide) + '</div></div>';
    THEMES.forEach(function (th) {
      h += '<div class="sep"></div><div class="theme"><h3>' + th.name + '</h3>';
      CATS.filter(function (c) { return c.theme === th.id; }).forEach(function (c) {
        var p = it[c.id][0], failed = data.failed[c.id];
        if (!p) {
          h += '<div class="row row--none"><span class="row__i" style="--c:' + c.c + '">' + c.i + '</span><span class="row__main"><span class="row__title">' + c.name + '</span>' +
            '<span class="row__sub">' + (failed ? 'Couldn’t load right now' : 'None mapped within ' + km(c.range)) + '</span></span>' +
            (failed ? '<button class="btn btn--sm" data-act="retry" type="button">Retry</button>' : '<span class="row__dist"><small><span class="dot dot--n"></span>far</small></span>') + '</div>';
          return;
        }
        var m = roadM(p), r = rating(c.id, m);
        h += '<button class="row" type="button" data-cat="' + c.id + '" data-first="1"><span class="row__i" style="--c:' + c.c + '">' + c.i + '</span>' +
          '<span class="row__main"><span class="row__title">' + c.name + (it[c.id].length > 1 ? ' <small>· ' + it[c.id].length + ' nearby</small>' : '') + '</span>' +
          '<span class="row__sub">' + esc(p.name) + '</span></span>' +
          '<span class="row__dist"><b><span class="dot dot--' + r + '"></span>' + km(m) + '</b><small>' + (p.road ? '' : '≈ ') + mins(driveS(p)) + ' drive</small></span></button>';
      });
      h += '</div>';
    });
    h += '<div class="note">Places: ' + esc(data.source) + ', © OpenStreetMap contributors; some places may not be mapped. Road distances and drive times: OSRM routing on open map data (≈ marks a straight-line estimate). Green = close, amber = reachable, red = far. This is an indication to help a buyer, not a valuation.</div>';
    return h;
  }

  // the nearest place of each kind that lies on one side of the site (N = from north-west to north-east …)
  function sideHTML(id) {
    var sd = SIDES.filter(function (x) { return x.id === id; })[0], out = [];
    CATS.forEach(function (c) {
      var p = (data.items[c.id] || []).filter(function (q) { return sideOf(brg(site, q)).id === id; })[0];
      if (p) out.push({ c: c, p: p });
    });
    out.sort(function (a, b) { return roadM(a.p) - roadM(b.p); });
    if (!out.length) return '<div class="empty">Nothing mapped to the ' + sd.name.toLowerCase() + ' within range.</div>';
    return out.slice(0, 8).map(function (o) {
      var m = roadM(o.p);
      return '<button class="row" type="button" data-side-cat="' + o.c.id + '" data-side-name="' + esc(o.p.name) + '"><span class="row__i" style="--c:' + o.c.c + '">' + o.c.i + '</span>' +
        '<span class="row__main"><span class="row__title">' + esc(o.p.name) + '</span><span class="row__sub">' + o.c.name + ' to the ' + sd.name.toLowerCase() + '</span></span>' +
        '<span class="row__dist"><b><span class="dot dot--' + rating(o.c.id, m) + '"></span>' + km(m) + '</b><small>' + (o.p.road ? '' : '≈ ') + mins(driveS(o.p)) + ' drive</small></span></button>';
    }).join('');
  }

  function listHTML() {
    var c = CAT[listCat], l = data.items[listCat] || [];
    var h = '<div class="head"><button class="back" data-act="back" type="button" aria-label="Back">←</button><h2>' + c.i + ' ' + c.many + ' near your site</h2></div>';
    if (!l.length) return h + '<div class="pad" style="color:#5f6368">' + (data.failed[listCat] ? 'Couldn’t load ' + c.many.toLowerCase() + ' right now.' : 'No ' + c.many.toLowerCase() + ' mapped within ' + km(c.range) + '.') + '</div>';
    l.slice(0, 40).forEach(function (p, i) {
      var m = roadM(p);
      h += '<button class="row" type="button" data-cat="' + c.id + '" data-idx="' + i + '"><span class="row__i" style="--c:' + c.c + '">' + c.i + '</span>' +
        '<span class="row__main"><span class="row__title">' + esc(p.name) + '</span><span class="row__sub">' + (p.road ? '' : '≈ ') + mins(driveS(p)) + ' drive · ≈ ' + mins(walkS(p)) + ' walk</span></span>' +
        '<span class="row__dist"><b><span class="dot dot--' + rating(c.id, m) + '"></span>' + km(m) + '</b><small>' + (p.road ? 'by road' : 'approx.') + '</small></span></button>';
    });
    return h;
  }

  function placeHTML() {
    var c = CAT[cur.cat], p = cur.p, car = cur.car || p.road, walk = cur.foot;
    var carT = car ? mins(car.t) : '≈ ' + mins(driveS(p)), carD = car ? km(car.d) : km(roadM(p));
    var walkT = walk ? mins(walk.t) : '≈ ' + mins(walkS(p)), walkD = walk ? km(walk.d) : km(roadM(p));
    var sel = mode === 'car' ? { t: carT, d: carD } : { t: walkT, d: walkD };
    return '<div class="head"><button class="back" data-act="back" type="button" aria-label="Back">←</button><h2>' + c.i + ' ' + c.name + '</h2></div>' +
      '<div class="place"><div class="place__kind">' + c.name + ' · from your site</div><h2>' + esc(p.name) + '</h2>' +
      '<div class="route-sum"><b>' + sel.t + '</b><span>(' + sel.d + ')</span></div>' +
      '<div class="via">' + (mode === 'car' ? 'By car, along the roads' : 'On foot, along the roads') + (cur.loading ? ' · finding the route…' : '') + '</div>' +
      '<div class="modes"><button class="mode' + (mode === 'car' ? ' is-on' : '') + '" data-mode="car" type="button"><b>🚗 ' + carT + '</b><small>' + carD + '</small></button>' +
      '<button class="mode' + (mode === 'foot' ? ' is-on' : '') + '" data-mode="foot" type="button"><b>🚶 ' + walkT + '</b><small>' + walkD + '</small></button></div>' +
      '<button class="btn" data-act="street" type="button">🚶 Street View here</button>' +
      '<a class="btn btn--fill" target="_blank" rel="noopener" href="https://www.google.com/maps/dir/?api=1&origin=' + site.lat + ',' + site.lng + '&destination=' + p.lat + ',' + p.lng + '&travelmode=' + (mode === 'car' ? 'driving' : 'walking') + '">Directions in Google Maps</a>' +
      '<p class="via">Straight-line distance: ' + km(p.m) + '. Travel times are estimates for normal traffic.</p></div>';
  }

  function wire() {
    [].forEach.call(body.querySelectorAll('[data-act]'), function (b) {
      b.addEventListener('click', function () {
        var a = b.dataset.act;
        if (a === 'sample') { $('q').value = ''; chooseSite(SAMPLE.lat, SAMPLE.lng, SAMPLE.name); }
        if (a === 'close') reset();
        if (a === 'back') goBack();
        if (a === 'retry') { try { sessionStorage.removeItem('se2:' + site.lat.toFixed(4) + ',' + site.lng.toFixed(4)); } catch (e) { /* fine */ } evaluate(); }
        if (a === 'share') share();
        if (a === 'menu') toggleMenu(b);
        if (a === 'around' || a === 'sides') { closeMenu(); view = 'around'; render(); showPins(); sheetTo('half'); if (a === 'sides') { var sl = body.querySelector('.sides'); if (sl) sl.scrollIntoView({ block: 'start' }); } }
        if (a === 'street') { closeMenu(); var at = cur ? cur.p : site; streetView(at.lat, at.lng, cur ? cur.p.name : (site.name || 'Proposed site')); }
        if (a === 'max') { closeMenu(); maximise(true); }
      });
    });
    [].forEach.call(body.querySelectorAll('.row[data-cat]'), function (b) {
      b.addEventListener('click', function () {
        var cat = b.dataset.cat;
        if (b.dataset.first) { openList(cat); return; }
        openPlace(data.items[cat][+b.dataset.idx], cat);
      });
    });
    [].forEach.call(body.querySelectorAll('[data-side]'), function (b) {
      b.addEventListener('click', function () {
        curSide = b.dataset.side;
        [].forEach.call(body.querySelectorAll('[data-side]'), function (x) { x.classList.toggle('is-on', x === b); });
        body.querySelector('.side-list').innerHTML = sideHTML(curSide);
        wireSide();
      });
    });
    wireSide();
    [].forEach.call(body.querySelectorAll('[data-mode]'), function (b) {
      b.addEventListener('click', function () { if (mode !== b.dataset.mode) { mode = b.dataset.mode; routeCur(); } });
    });
    var ring = $('ring');
    if (ring) requestAnimationFrame(function () { ring.style.strokeDashoffset = String(201 * (1 - score() / 100)); });
  }

  /* ⋮ menu ---------------------------------------------------------------------------------------------- */
  function toggleMenu(btn) {
    var m = $('menu');
    if (!m) return;
    m.hidden = !m.hidden;
    btn.setAttribute('aria-expanded', m.hidden ? 'false' : 'true');
  }
  function closeMenu() { var m = $('menu'); if (m) m.hidden = true; }
  document.addEventListener('click', function (e) { if (!e.target.closest('.kebab')) closeMenu(); });

  /* Street View: Google Street View inside the page (free Maps Embed key in config.js), else in Google Maps */
  function streetView(lat, lng, title) {
    var key = (window.SE_CONFIG && window.SE_CONFIG.googleMapsKey) || '';
    if (!key) {
      window.open('https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=' + lat + ',' + lng, '_blank', 'noopener');
      toast('Street View opened in Google Maps. Add the free key to see it inside this page.', 4500);
      return;
    }
    $('sv-title').textContent = title;
    $('sv-frame').src = 'https://www.google.com/maps/embed/v1/streetview?key=' + encodeURIComponent(key) + '&location=' + lat + ',' + lng + '&heading=0&pitch=0&fov=90&language=en';
    $('sv').hidden = false;
    document.body.classList.add('is-sv');
  }
  $('sv-close').addEventListener('click', function () { $('sv').hidden = true; $('sv-frame').src = 'about:blank'; document.body.classList.remove('is-sv'); });

  /* Maximise: the map (and the site) fill the screen; the details come back with one tap */
  function maximise(on) {
    document.body.classList.toggle('is-max', on);
    $('t-max').setAttribute('aria-pressed', on ? 'true' : 'false');
    setTimeout(function () { map.resize(); if (site) goSite(900); }, 50);
  }
  $('t-max').addEventListener('click', function () { maximise(!document.body.classList.contains('is-max')); });

  function wireSide() {
    [].forEach.call(body.querySelectorAll('[data-side-cat]'), function (b) {
      b.addEventListener('click', function () {
        var cat = b.dataset.sideCat, p = (data.items[cat] || []).filter(function (q) { return q.name === b.dataset.sideName; })[0];
        if (p) openPlace(p, cat);
      });
    });
  }

  function openList(cat) {
    if (view === 'site' || view === 'around') listFrom = view;
    listCat = cat; cur = null; view = 'list';
    clearRoute(); setChip(cat); render(); showPins();
    // real road distances for the closest ones of this category
    var l = data.items[cat].slice(0, 25).filter(function (p) { return !p.road; });
    roadTable(site, l).then(function () {
      if (listCat !== cat) return;
      data.items[cat] = data.items[cat].slice(0, 25).sort(function (a, b) { return roadM(a) - roadM(b); }).concat(data.items[cat].slice(25));
      if (view === 'list') render();
    });
    var b = new maplibregl.LngLatBounds([site.lng, site.lat], [site.lng, site.lat]);
    data.items[cat].slice(0, 10).forEach(function (p) { b.extend([p.lng, p.lat]); });
    sheetTo('half');
    map.fitBounds(b, { padding: framePad(70), maxZoom: 16, duration: 1200 });
  }

  function openPlace(p, cat) {
    if (!p) return;
    if (view === 'site' || view === 'around') listFrom = view;
    cur = { p: p, cat: cat, from: view === 'list' ? 'list' : listFrom };
    view = 'place';
    sheetTo('peek');
    routeCur();
    markSelected();
  }
  function routeCur() {
    var c = cur;
    c.loading = true;
    render();
    drawRoute(c.p).then(function (r) {
      if (cur !== c) return;
      c.loading = false;
      if (r) c[mode] = r;
      render();
    });
  }

  function goBack() {
    clearRoute();
    if (view === 'place' && cur && cur.from === 'list') { cur = null; view = 'list'; render(); markSelected(); return; }
    var to = view === 'around' ? 'site' : (cur ? cur.from : listFrom) || 'site';
    cur = null; listCat = null; setChip(null);
    view = to === 'around' ? 'around' : 'site';
    render();
    if (view === 'around') showPins(); else clearPins();
    sheetTo('half');
    goSite(1300);
  }

  function reset() {
    site = null; data = null; cur = null; listCat = null;
    clearRoute(); clearPins(); setChip(null);
    if (label) label.remove();
    if (siteDot) siteDot.remove();
    closeMenu();
    ['plot', 'rings', 'spokes'].forEach(function (s) { if (map.getSource(s)) map.getSource(s).setData(EMPTY); });
    $('t-site').hidden = true;
    view = 'welcome'; render();
    map.flyTo({ center: [CITY.lng, CITY.lat], zoom: CITY.zoom, pitch: 0, bearing: 0, duration: 1800 });
    sheetTo('half');
  }

  function share() {
    var url = location.origin + location.pathname + '?lat=' + site.lat.toFixed(6) + '&lng=' + site.lng.toFixed(6) + (site.name ? '&name=' + encodeURIComponent(site.name) : '');
    if (navigator.share) navigator.share({ title: 'Site evaluation', url: url }).catch(function () { /* cancelled */ });
    else if (navigator.clipboard) navigator.clipboard.writeText(url).then(function () { toast('Link copied'); });
  }

  /* Chips --------------------------------------------------------------------------------------------- */

  var chipBox = $('chips');
  CATS.forEach(function (c) {
    var b = document.createElement('button');
    b.className = 'chip'; b.type = 'button'; b.dataset.cat = c.id;
    b.innerHTML = '<span class="chip__i">' + c.i + '</span>' + esc(c.many.split(' & ')[0].split(',')[0]);
    b.addEventListener('click', function () {
      if (!site) { toast('First tap the land where you plan to build.'); return; }
      if (!data) { toast('Still looking around the site…'); return; }
      if (listCat === c.id && view !== 'place') goBack(); else openList(c.id);
    });
    chipBox.appendChild(b);
  });
  function setChip(id) {
    [].forEach.call(chipBox.children, function (b) { b.classList.toggle('is-on', b.dataset.cat === id); });
    var on = id && chipBox.querySelector('[data-cat="' + id + '"]');
    if (on && on.scrollIntoView) on.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' });
  }

  /* Search --------------------------------------------------------------------------------------------- */

  var sT = null, sSeq = 0, sItems = [], sIdx = -1;
  $('q').addEventListener('input', function () {
    clearTimeout(sT);
    var q = this.value.trim();
    if (q.length < 3) { $('suggest').hidden = true; return; }
    sT = setTimeout(function () { search(q); }, 280);
  });
  $('q').addEventListener('keydown', function (e) {
    var list = $('suggest');
    if (list.hidden || !sItems.length) return;
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      sIdx = (sIdx + (e.key === 'ArrowDown' ? 1 : -1) + sItems.length) % sItems.length;
      [].forEach.call(list.children, function (li, i) { li.classList.toggle('is-active', i === sIdx); });
    } else if (e.key === 'Enter') { e.preventDefault(); pick(sItems[Math.max(0, sIdx)]); }
    else if (e.key === 'Escape') list.hidden = true;
  });
  function search(q) {
    var seq = ++sSeq, c = map.getCenter();
    fetchT(PHOTON + '/api/?q=' + encodeURIComponent(q) + '&lat=' + c.lat + '&lon=' + c.lng + '&limit=6&lang=en', {}, 8000).then(function (r) { return r.json(); }).then(function (d) {
      if (seq !== sSeq) return;
      sItems = (d.features || []).map(function (f) {
        var p = f.properties, sub = [p.street, p.district || p.locality, p.city, p.state].filter(Boolean).filter(function (x, i, a) { return a.indexOf(x) === i && x !== p.name; }).join(', ');
        return { name: p.name || p.street || p.city || 'Place', sub: sub, lat: f.geometry.coordinates[1], lng: f.geometry.coordinates[0] };
      });
      var list = $('suggest');
      list.innerHTML = ''; sIdx = -1;
      sItems.forEach(function (it) {
        var li = document.createElement('li');
        li.setAttribute('role', 'option');
        li.innerHTML = '<div>' + esc(it.name) + (it.sub ? '<small>' + esc(it.sub) + '</small>' : '') + '</div>';
        li.addEventListener('click', function () { pick(it); });
        list.appendChild(li);
      });
      list.hidden = !sItems.length;
    }).catch(function () { $('suggest').hidden = true; });
  }
  function pick(it) {
    if (!it) return;
    $('suggest').hidden = true;
    $('q').value = it.name;
    $('q').blur();
    chooseSite(it.lat, it.lng, it.name + (it.sub ? ', ' + it.sub.split(',').slice(-2).join(',').trim() : ''));
  }
  document.addEventListener('click', function (e) { if (!e.target.closest('.searchbar')) $('suggest').hidden = true; });

  $('locate').addEventListener('click', function () {
    if (!navigator.geolocation) { toast('This browser can’t share its location.'); return; }
    toast('Finding your location…');
    navigator.geolocation.getCurrentPosition(function (p) { chooseSite(p.coords.latitude, p.coords.longitude, 'Your location'); },
      function () { toast('Location not allowed. Search or tap the map instead.'); }, { enableHighAccuracy: true, timeout: 10000 });
  });

  /* Map buttons ------------------------------------------------------------------------------------------ */

  $('t-3d').addEventListener('click', function () {
    var on = this.getAttribute('aria-pressed') !== 'true';
    this.setAttribute('aria-pressed', on ? 'true' : 'false');
    map.setLayoutProperty('buildings', 'visibility', on ? 'visible' : 'none');
    map.easeTo({ pitch: on ? 55 : 0, duration: 900 });
  });
  $('t-site').addEventListener('click', function () { if (site) goSite(1300); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && (view === 'place' || view === 'list')) goBack(); });

  /* The sheet: side panel on computers, bottom sheet on phones -------------------------------------------- */

  var sheet = $('sheet');
  var SNAP = { peek: function () { return 168; }, half: function () { return Math.round(window.innerHeight * 0.5); }, full: function () { return Math.round(window.innerHeight * 0.9); } };
  var sheetState = 'half';
  function setSheetH(h) { document.documentElement.style.setProperty('--sheet-h', h + 'px'); }
  function sheetTo(state) {
    if (!state || !mobile()) return;
    sheetState = state;
    setSheetH(SNAP[state]());
  }
  // keep the site visible above the sheet / beside the panel
  function framePad(extra, stand) {
    extra = extra == null ? 40 : extra;
    if (mobile()) return { top: stand ? 170 : 130, bottom: (stand ? SNAP.peek() : SNAP[sheetState]()) + 20, left: 30, right: 30 };
    if (document.body.classList.contains('is-max')) return { top: 110, bottom: extra, left: 80, right: 80 };
    return { top: stand ? 200 : 110, bottom: extra, left: 408 + extra, right: 80 };
  }
  (function drag() {
    var grip = $('grip'), y0 = 0, h0 = 0, moved = false;
    function start(e) {
      if (!mobile()) return;
      y0 = e.clientY;
      h0 = SNAP[sheetState]();
      moved = false;
      sheet.classList.add('is-dragging');
      window.addEventListener('pointermove', move);
      window.addEventListener('pointerup', end);
    }
    function move(e) {
      var dy = y0 - e.clientY;
      if (Math.abs(dy) > 4) moved = true;
      setSheetH(Math.max(120, Math.min(window.innerHeight * 0.92, h0 + dy)));
    }
    function end(e) {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', end);
      sheet.classList.remove('is-dragging');
      if (!moved) { sheetTo(sheetState === 'peek' ? 'half' : sheetState === 'half' ? 'full' : 'half'); return; }
      var h = h0 + (y0 - e.clientY), opts = ['peek', 'half', 'full'];
      var best = opts.reduce(function (a, b) { return Math.abs(SNAP[b]() - h) < Math.abs(SNAP[a]() - h) ? b : a; });
      sheetTo(best);
    }
    grip.addEventListener('pointerdown', start);
  })();
  window.addEventListener('resize', function () { if (mobile()) sheetTo(sheetState); });

  render();
  sheetTo('half');
})();
