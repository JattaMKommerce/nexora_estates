/*
 * Site Evaluation: a plot seen from the sky, and everything around it, in one click.
 *
 * Map:    MapLibre GL (open source) with Esri World Imagery satellite photos, 3D building shapes and
 *         road names from OpenFreeMap (OpenStreetMap data). No API keys.
 * Places: OpenStreetMap, from the Overpass API (one query for every category plus the main roads'
 *         shapes). Free servers go down now and then, so a second Overpass server is tried, and then
 *         Photon (komoot), which answers category by category.
 * Search: Photon, biased to the area on screen.
 *
 * Distances are straight-line ("as the crow flies"); travel times are estimates for city traffic.
 * The score is an indication from the data available, not a valuation.
 */
(function () {
  'use strict';

  var SAMPLE = { lat: 12.9698, lng: 77.7500, name: 'Sample plot · Whitefield, Bengaluru' };
  var OVERPASS = ['https://overpass-api.de/api/interpreter', 'https://overpass.private.coffee/api/interpreter'];
  var PHOTON = 'https://photon.komoot.io';

  // What we look for. weight = share of the 100-point score; good = distance (m) that counts as close
  var CATS = [
    { id: 'school', name: 'Schools', icon: '🏫', c: '#60a5fa', weight: 14, good: 1000, photon: ['amenity:school', 'amenity:kindergarten'] },
    { id: 'college', name: 'Colleges', icon: '🎓', c: '#a78bfa', weight: 8, good: 2500, photon: ['amenity:college', 'amenity:university'] },
    { id: 'hospital', name: 'Hospitals', icon: '🏥', c: '#f87171', weight: 15, good: 2000, photon: ['amenity:hospital', 'amenity:clinic', 'healthcare:hospital'] },
    { id: 'metro', name: 'Metro & rail', icon: '🚇', c: '#22d3ee', weight: 15, good: 1500, wide: true, photon: ['railway:station', 'railway:halt', 'public_transport:station', 'railway:subway_entrance'] },
    { id: 'bus', name: 'Bus', icon: '🚌', c: '#34d399', weight: 10, good: 500, photon: ['amenity:bus_station', 'highway:bus_stop'] },
    { id: 'auto', name: 'Auto & taxi', icon: '🛺', c: '#fbbf24', weight: 5, good: 1000, photon: ['amenity:taxi'] },
    { id: 'mall', name: 'Malls & shopping', icon: '🛍️', c: '#f472b6', weight: 10, good: 2500, photon: ['shop:mall', 'shop:supermarket', 'shop:department_store'] },
    { id: 'park', name: 'Parks', icon: '🌳', c: '#4ade80', weight: 5, good: 1000, photon: ['leisure:park'] },
    { id: 'bank', name: 'Banks & ATMs', icon: '🏦', c: '#94a3b8', weight: 3, good: 1000, photon: ['amenity:bank', 'amenity:atm'] },
    { id: 'road', name: 'Main roads', icon: '🛣️', c: '#ffd200', weight: 15, good: 500, wide: true, photon: ['highway:trunk', 'highway:primary', 'highway:secondary', 'highway:motorway'] }
  ];
  var CAT = {};
  CATS.forEach(function (c) { CAT[c.id] = c; });

  var $ = function (id) { return document.getElementById(id); };
  var site = { lat: SAMPLE.lat, lng: SAMPLE.lng, name: SAMPLE.name };
  var radius = 3000;
  var result = null;          // { items: { cat: [place] }, roads: [line], source }
  var markers = [];
  var active = null;          // category shown alone
  var spinning = false;

  /* Map --------------------------------------------------------------------------------------- */

  var map = new maplibregl.Map({
    container: 'map',
    center: [site.lng, site.lat],
    zoom: 14.2,
    pitch: 55,
    bearing: -18,
    maxPitch: 75,
    attributionControl: false,
    style: {
      version: 8,
      glyphs: 'https://tiles.openfreemap.org/fonts/{fontstack}/{range}.pbf',
      sources: {
        sat: {
          type: 'raster', tileSize: 256, maxzoom: 19,
          tiles: ['https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'],
          attribution: 'Imagery © Esri, Maxar, Earthstar Geographics'
        },
        osm: { type: 'vector', url: 'https://tiles.openfreemap.org/planet', attribution: '© OpenStreetMap contributors · OpenFreeMap' }
      },
      layers: [
        { id: 'sat', type: 'raster', source: 'sat', paint: { 'raster-saturation': 0.1, 'raster-contrast': 0.08 } },
        { id: 'buildings', type: 'fill-extrusion', source: 'osm', 'source-layer': 'building', minzoom: 14,
          paint: {
            'fill-extrusion-color': '#f5f1e6',
            'fill-extrusion-height': ['coalesce', ['get', 'render_height'], 8],
            'fill-extrusion-base': ['coalesce', ['get', 'render_min_height'], 0],
            'fill-extrusion-opacity': 0.32
          } },
        { id: 'road-names', type: 'symbol', source: 'osm', 'source-layer': 'transportation_name', minzoom: 13,
          layout: { 'symbol-placement': 'line', 'text-field': ['coalesce', ['get', 'name:en'], ['get', 'name']], 'text-font': ['Noto Sans Regular'], 'text-size': 12 },
          paint: { 'text-color': '#ffffff', 'text-halo-color': 'rgba(0,0,0,0.75)', 'text-halo-width': 1.6 } },
        { id: 'places', type: 'symbol', source: 'osm', 'source-layer': 'place', maxzoom: 15,
          layout: { 'text-field': ['coalesce', ['get', 'name:en'], ['get', 'name']], 'text-font': ['Noto Sans Bold'], 'text-size': ['interpolate', ['linear'], ['zoom'], 10, 12, 14, 15] },
          paint: { 'text-color': '#fff7d1', 'text-halo-color': 'rgba(0,0,0,0.8)', 'text-halo-width': 1.8 } }
      ]
    }
  });
  map.addControl(new maplibregl.AttributionControl({ compact: true }), 'bottom-right');
  map.addControl(new maplibregl.NavigationControl({ visualizePitch: true }), 'bottom-right');
  map.addControl(new maplibregl.ScaleControl({ unit: 'metric' }), 'bottom-left');

  var siteEl = document.createElement('div');
  siteEl.className = 'pin-site';
  var siteMarker = new maplibregl.Marker({ element: siteEl, draggable: true }).setLngLat([site.lng, site.lat]).addTo(map);
  siteEl.style.zIndex = '20'; // the plot always stays above the other pins
  siteMarker.on('dragend', function () {
    var p = siteMarker.getLngLat();
    setSite(p.lat, p.lng, null);
  });

  map.on('load', function () {
    map.addSource('ring', { type: 'geojson', data: ring(site, radius) });
    map.addLayer({ id: 'ring-fill', type: 'fill', source: 'ring', paint: { 'fill-color': '#ffd200', 'fill-opacity': 0.06 } }, 'buildings');
    map.addLayer({ id: 'ring-line', type: 'line', source: 'ring', paint: { 'line-color': '#ffd200', 'line-width': 2, 'line-dasharray': [2, 2] } });
    map.addSource('roads', { type: 'geojson', data: { type: 'FeatureCollection', features: [] } });
    map.addLayer({ id: 'roads-glow', type: 'line', source: 'roads', layout: { 'line-cap': 'round', 'line-join': 'round' }, paint: { 'line-color': '#ffd200', 'line-width': 9, 'line-opacity': 0.25, 'line-blur': 4 } }, 'road-names');
    map.addLayer({ id: 'roads-line', type: 'line', source: 'roads', layout: { 'line-cap': 'round', 'line-join': 'round' }, paint: { 'line-color': '#ffd200', 'line-width': 3 } }, 'road-names');
    showCoords();
    reverseName(site.lat, site.lng);
  });

  map.on('click', function (e) {
    if (e.originalEvent && e.originalEvent.target && e.originalEvent.target.closest && e.originalEvent.target.closest('.pin')) return;
    setSite(e.lngLat.lat, e.lngLat.lng, null);
  });

  /* Geometry ---------------------------------------------------------------------------------- */

  function dist(a, b) {
    var R = 6371000, r = Math.PI / 180;
    var dLat = (b.lat - a.lat) * r, dLng = (b.lng - a.lng) * r;
    var x = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(a.lat * r) * Math.cos(b.lat * r) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
    return 2 * R * Math.asin(Math.sqrt(x));
  }
  function ring(c, m) {
    var pts = [], n = 96;
    for (var i = 0; i <= n; i++) {
      var a = (i / n) * Math.PI * 2;
      pts.push([c.lng + (m / (111320 * Math.cos(c.lat * Math.PI / 180))) * Math.cos(a), c.lat + (m / 110540) * Math.sin(a)]);
    }
    return { type: 'Feature', geometry: { type: 'Polygon', coordinates: [pts] } };
  }
  function km(m) { return m < 950 ? Math.round(m / 10) * 10 + ' m' : (m / 1000).toFixed(m < 9950 ? 1 : 0) + ' km'; }
  // rough city travel times: walking for short distances, otherwise driving (roads wind ~1.35×)
  function travel(m) {
    if (m <= 1200) return Math.max(1, Math.round(m * 1.25 / 75)) + ' min walk';
    return Math.max(2, Math.round((m * 1.35 / 1000) / 22 * 60)) + ' min drive';
  }
  function esc(t) { return String(t).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }

  /* The plot ---------------------------------------------------------------------------------- */

  function showCoords() { $('site-coords').textContent = site.lat.toFixed(5) + ', ' + site.lng.toFixed(5); }

  function setSite(lat, lng, name, fly) {
    site = { lat: lat, lng: lng, name: name || 'Selected plot' };
    siteMarker.setLngLat([lng, lat]);
    $('site-name').textContent = site.name;
    showCoords();
    if (map.getSource('ring')) map.getSource('ring').setData(ring(site, radius));
    clearResults();
    if (!name) reverseName(lat, lng);
    if (fly) map.flyTo({ center: [lng, lat], zoom: 15, pitch: 55, duration: 2200, essential: true });
    $('status').textContent = '';
  }

  var revSeq = 0;
  function reverseName(lat, lng) {
    var seq = ++revSeq;
    fetch(PHOTON + '/reverse?lat=' + lat + '&lon=' + lng + '&limit=1').then(function (r) { return r.json(); }).then(function (d) {
      if (seq !== revSeq) return;
      var p = d.features && d.features[0] && d.features[0].properties;
      if (!p) return;
      var parts = [p.name, p.street, p.district || p.locality, p.city].filter(Boolean);
      var uniq = parts.filter(function (x, i) { return parts.indexOf(x) === i; }).slice(0, 3);
      if (uniq.length && site.name === 'Selected plot') { site.name = 'Near ' + uniq.join(', '); $('site-name').textContent = site.name; }
    }).catch(function () { /* the coordinates stay */ });
  }

  /* Search -------------------------------------------------------------------------------------- */

  var sTimer = null, sSeq = 0, sItems = [], sIdx = -1;
  $('q').addEventListener('input', function () {
    clearTimeout(sTimer);
    var q = this.value.trim();
    if (q.length < 3) { $('suggest').hidden = true; return; }
    sTimer = setTimeout(function () { searchPlaces(q); }, 280);
  });
  $('q').addEventListener('keydown', function (e) {
    var list = $('suggest');
    if (list.hidden) return;
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      sIdx = (sIdx + (e.key === 'ArrowDown' ? 1 : -1) + sItems.length) % sItems.length;
      [].forEach.call(list.children, function (li, i) { li.classList.toggle('is-active', i === sIdx); });
    } else if (e.key === 'Enter') {
      e.preventDefault();
      pick(sItems[Math.max(0, sIdx)]);
    } else if (e.key === 'Escape') list.hidden = true;
  });
  document.addEventListener('click', function (e) { if (!e.target.closest('.search')) $('suggest').hidden = true; });

  function searchPlaces(q) {
    var seq = ++sSeq, c = map.getCenter();
    fetch(PHOTON + '/api/?q=' + encodeURIComponent(q) + '&lat=' + c.lat + '&lon=' + c.lng + '&limit=6&lang=en')
      .then(function (r) { return r.json(); }).then(function (d) {
        if (seq !== sSeq) return;
        sItems = (d.features || []).map(function (f) {
          var p = f.properties;
          var sub = [p.street, p.district || p.locality, p.city, p.state, p.country].filter(Boolean).filter(function (x, i, a) { return a.indexOf(x) === i && x !== p.name; }).join(', ');
          return { name: p.name || p.street || p.city || 'Place', sub: sub, lat: f.geometry.coordinates[1], lng: f.geometry.coordinates[0], extent: p.extent };
        });
        var list = $('suggest');
        list.innerHTML = '';
        sIdx = -1;
        sItems.forEach(function (it) {
          var li = document.createElement('li');
          li.setAttribute('role', 'option');
          li.innerHTML = esc(it.name) + (it.sub ? '<small>' + esc(it.sub) + '</small>' : '');
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
    setSite(it.lat, it.lng, it.name + (it.sub ? ' · ' + it.sub.split(',').slice(0, 2).join(',') : ''), true);
  }

  $('locate').addEventListener('click', function () {
    if (!navigator.geolocation) { $('status').textContent = 'Your browser can’t share its location.'; return; }
    $('status').textContent = 'Finding your location…';
    navigator.geolocation.getCurrentPosition(function (p) {
      setSite(p.coords.latitude, p.coords.longitude, 'Your location', true);
    }, function () { $('status').textContent = 'Location not allowed. Search or tap the map instead.'; }, { enableHighAccuracy: true, timeout: 10000 });
  });

  [].forEach.call(document.querySelectorAll('.radius button'), function (b) {
    b.addEventListener('click', function () {
      [].forEach.call(document.querySelectorAll('.radius button'), function (x) { x.classList.toggle('is-on', x === b); });
      radius = +b.dataset.r;
      if (map.getSource('ring')) map.getSource('ring').setData(ring(site, radius));
      if (result) evaluate();
    });
  });

  /* Getting the places ------------------------------------------------------------------------ */

  function classify(t) {
    var a = t.amenity, s = t.shop;
    if (t.highway && /^(motorway|trunk|primary|secondary)$/.test(t.highway)) return 'road';
    if (a === 'school' || a === 'kindergarten') return 'school';
    if (a === 'college' || a === 'university') return 'college';
    if (a === 'hospital' || a === 'clinic' || t.healthcare === 'hospital') return 'hospital';
    if (t.railway === 'station' || t.railway === 'halt' || t.station === 'subway' || t.railway === 'subway_entrance' || (t.public_transport === 'station' && (t.train === 'yes' || t.subway === 'yes'))) return 'metro';
    if (a === 'bus_station' || t.highway === 'bus_stop') return 'bus';
    if (a === 'taxi') return 'auto';
    if (s === 'mall' || s === 'supermarket' || s === 'department_store') return 'mall';
    if (t.leisure === 'park') return 'park';
    if (a === 'bank' || a === 'atm') return 'bank';
    return null;
  }
  function label(t, cat) {
    var n = t['name:en'] || t.name;
    if (n) return n;
    if (cat === 'bus') return 'Bus stop';
    if (cat === 'auto') return 'Auto / taxi stand';
    if (cat === 'bank') return t.amenity === 'atm' ? 'ATM' : 'Bank';
    if (cat === 'road') return t.ref ? 'Road ' + t.ref : 'Main road';
    return CAT[cat].name.replace(/s$/, '');
  }

  function fetchTimeout(url, opts, ms) {
    var ctrl = window.AbortController ? new AbortController() : null;
    var t = ctrl && setTimeout(function () { ctrl.abort(); }, ms);
    if (ctrl) opts.signal = ctrl.signal;
    return fetch(url, opts).finally(function () { if (t) clearTimeout(t); });
  }

  function viaOverpass(url) {
    var R = radius, R2 = Math.max(radius, 5000), at = site.lat + ',' + site.lng;
    var q = '[out:json][timeout:25];(' +
      'nwr["amenity"~"^(school|kindergarten|college|university|hospital|clinic|bus_station|taxi|bank)$"](around:' + R + ',' + at + ');' +
      'nwr["healthcare"="hospital"](around:' + R + ',' + at + ');' +
      'nwr["railway"~"^(station|halt)$"](around:' + R2 + ',' + at + ');' +
      'nwr["station"="subway"](around:' + R2 + ',' + at + ');' +
      'node["highway"="bus_stop"](around:' + Math.min(R, 2000) + ',' + at + ');' +
      'nwr["shop"~"^(mall|supermarket|department_store)$"](around:' + R + ',' + at + ');' +
      'nwr["leisure"="park"](around:' + R + ',' + at + ');' +
      'node["amenity"="atm"](around:' + Math.min(R, 1500) + ',' + at + ');' +
      ')->.p;.p out center tags 900;' +
      'way["highway"~"^(motorway|trunk|primary|secondary)$"](around:' + Math.min(R, 2500) + ',' + at + ');out tags geom 400;';
    return fetchTimeout(url, { method: 'POST', body: 'data=' + encodeURIComponent(q), headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }, 45000)
      .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
      .then(function (d) {
        var items = {}, roads = [];
        CATS.forEach(function (c) { items[c.id] = []; });
        (d.elements || []).forEach(function (e) {
          var t = e.tags || {};
          var cat = classify(t);
          if (!cat) return;
          if (cat === 'road') {
            if (!e.geometry) return;
            var pts = e.geometry.map(function (g) { return { lat: g.lat, lng: g.lon }; });
            var near = pts.reduce(function (b, p) { var m = dist(site, p); return m < b.m ? { m: m, p: p } : b; }, { m: Infinity, p: null });
            roads.push({ name: label(t, 'road'), kind: t.highway, coords: pts.map(function (p) { return [p.lng, p.lat]; }), m: near.m, lat: near.p.lat, lng: near.p.lng });
            return;
          }
          var lat = e.lat != null ? e.lat : e.center && e.center.lat, lng = e.lon != null ? e.lon : e.center && e.center.lon;
          if (lat == null) return;
          items[cat].push({ name: label(t, cat), lat: lat, lng: lng, tags: t });
        });
        // one entry per named road (its nearest stretch), nearest first
        var byName = {};
        roads.forEach(function (r) { if (!byName[r.name] || r.m < byName[r.name].m) byName[r.name] = r; });
        items.road = Object.keys(byName).map(function (k) { return { name: k, lat: byName[k].lat, lng: byName[k].lng, kind: byName[k].kind, m: byName[k].m }; });
        return { items: items, roads: roads, failed: {}, source: 'OpenStreetMap (Overpass)' };
      });
  }

  // the backup service is shared and free: one category at a time with a short pause, and if it
  // asks us to slow down we stop and say which categories are missing (never a false "0")
  function viaPhoton(only) {
    var items = {}, failed = {}, capped = {}, limited = false;
    var list = CATS.filter(function (c) { return !only || only.indexOf(c.id) >= 0; });
    var chain = Promise.resolve();
    list.forEach(function (c, i) {
      chain = chain.then(function () {
        if (limited) { failed[c.id] = true; items[c.id] = []; return; }
        var r = c.id === 'metro' ? Math.max(radius, 5000) : radius;
        var url = PHOTON + '/reverse?lat=' + site.lat + '&lon=' + site.lng + '&radius=' + (r / 1000) + '&limit=' + (c.id === 'bus' ? 40 : 25) + '&lang=en' +
          c.photon.map(function (t) { return '&osm_tag=' + encodeURIComponent(t); }).join('');
        $('status').textContent = 'Looking for ' + c.name.toLowerCase() + '… (' + (i + 1) + ' of ' + list.length + ')';
        return fetchTimeout(url, {}, 15000).then(function (res) {
          if (res.status === 429) { limited = true; throw new Error('slow down'); }
          if (!res.ok) throw new Error('HTTP ' + res.status);
          return res.json();
        }).then(function (d) {
          if ((d.features || []).length >= (c.id === 'bus' ? 40 : 25)) capped[c.id] = true;
          items[c.id] = (d.features || []).map(function (f) {
            var p = f.properties, tag = {};
            tag[p.osm_key] = p.osm_value;
            return { name: p.name || label(tag, c.id), lat: f.geometry.coordinates[1], lng: f.geometry.coordinates[0], tags: tag };
          });
        }).catch(function () { items[c.id] = []; failed[c.id] = true; })
          .then(function () { return new Promise(function (ok) { setTimeout(ok, 350); }); });
      });
    });
    return chain.then(function () { return { items: items, roads: [], failed: failed, capped: capped, source: 'OpenStreetMap (Photon)' }; });
  }

  /* City data packs (data/<city>.json, made by tools/make_city_pack.py): instant and always there */
  var packIndex = null, packs = {};
  function packFor(lat, lng) {
    var idx = packIndex || (packIndex = fetch('data/index.json').then(function (r) { return r.ok ? r.json() : []; }).catch(function () { return []; }));
    return idx.then(function (list) {
      var hit = list.filter(function (c) { return lat >= c.bbox[0] && lat <= c.bbox[2] && lng >= c.bbox[1] && lng <= c.bbox[3]; })[0];
      if (!hit) return null;
      if (!packs[hit.file]) packs[hit.file] = fetch('data/' + hit.file).then(function (r) { if (!r.ok) throw new Error('pack'); return r.json(); });
      return packs[hit.file];
    });
  }
  function viaPack(pack) {
    var items = {}, roads = [];
    var reach = function (id) { return id === 'metro' ? Math.max(radius, 5000) : id === 'bus' ? Math.min(radius, 2000) : radius; };
    CATS.forEach(function (c) {
      if (c.id === 'road') return;
      var lim = reach(c.id), rows = pack.cats[c.id] || [];
      // quick box filter, then the exact distance
      var dLat = lim / 110540, dLng = lim / (111320 * Math.cos(site.lat * Math.PI / 180));
      items[c.id] = rows.filter(function (r) { return Math.abs(r[0] - site.lat) <= dLat && Math.abs(r[1] - site.lng) <= dLng; })
        .map(function (r) { var tag = {}; return { name: r[2] || label(tag, c.id), lat: r[0], lng: r[1], m: dist(site, { lat: r[0], lng: r[1] }) }; })
        .filter(function (p) { return p.m <= lim; });
    });
    var lim = Math.min(radius, 2500), best = {};
    pack.roads.forEach(function (r) {
      var near = null;
      r.c.forEach(function (pt) { var m = dist(site, { lat: pt[1], lng: pt[0] }); if (!near || m < near.m) near = { m: m, lat: pt[1], lng: pt[0] }; });
      if (!near || near.m > lim) return;
      roads.push({ name: r.n, kind: r.k, coords: r.c, m: near.m });
      if (!best[r.n] || near.m < best[r.n].m) best[r.n] = { name: r.n, lat: near.lat, lng: near.lng, kind: r.k, m: near.m };
    });
    items.road = Object.keys(best).map(function (k) { return best[k]; });
    return { items: items, roads: roads, failed: {}, source: 'OpenStreetMap city pack for ' + pack.city.charAt(0).toUpperCase() + pack.city.slice(1) + ' (' + pack.generated + ')' };
  }

  function cacheKey() { return 'se:' + site.lat.toFixed(4) + ',' + site.lng.toFixed(4) + ':' + radius; }
  function getPlaces() {
    try {
      var hit = JSON.parse(sessionStorage.getItem(cacheKey()) || 'null');
      if (hit && hit.items && !Object.keys(hit.failed || {}).length) return Promise.resolve(hit);
    } catch (e) { /* no storage: ask again */ }
    return fetchPlaces().then(function (r) {
      try { sessionStorage.setItem(cacheKey(), JSON.stringify(r)); } catch (e) { /* full or private: fine */ }
      return r;
    });
  }
  function fetchPlaces() {
    return packFor(site.lat, site.lng).catch(function () { return null; }).then(function (pack) {
      if (pack) return viaPack(pack);
      return live();
    });
  }
  function live() {
    return viaOverpass(OVERPASS[0])
      .catch(function () { $('status').textContent = 'The first map server is busy, trying another…'; return viaOverpass(OVERPASS[1]); })
      .catch(function () { $('status').textContent = 'Using the backup map service…'; return viaPhoton(); });
  }

  /* Evaluate ------------------------------------------------------------------------------------ */

  $('go').addEventListener('click', evaluate);

  function evaluate() {
    var go = $('go');
    go.disabled = true;
    go.classList.add('is-busy');
    $('go-text').textContent = 'Looking around the site…';
    $('status').textContent = '';
    stopSpin();
    map.flyTo({ center: [site.lng, site.lat], zoom: radius > 3000 ? 12.6 : radius > 2000 ? 13.2 : radius > 1000 ? 13.7 : 14.6, pitch: 58, bearing: map.getBearing() - 25, duration: 2600, essential: true });
    var at = { lat: site.lat, lng: site.lng };
    getPlaces().then(function (r) {
      if (at.lat !== site.lat || at.lng !== site.lng) return; // the plot moved meanwhile
      Object.keys(r.items).forEach(function (k) {
        r.items[k].forEach(function (p) { if (p.m == null) p.m = dist(site, p); });
        r.items[k] = r.items[k].filter(function (p) { return p.m <= (k === 'metro' ? Math.max(radius, 5000) : radius) + 50; })
          .sort(function (a, b) { return a.m - b.m; });
      });
      result = r;
      render();
      $('status').textContent = '';
    }).catch(function () {
      $('status').textContent = 'The map services didn’t answer. Please check your internet and try again in a minute.';
    }).finally(function () {
      go.disabled = false;
      go.classList.remove('is-busy');
      $('go-text').textContent = 'Evaluate again';
    });
  }

  function clearResults() {
    result = null;
    active = null;
    markers.forEach(function (m) { m.remove(); });
    markers = [];
    if (map.getSource('roads')) map.getSource('roads').setData({ type: 'FeatureCollection', features: [] });
    $('results').hidden = true;
    $('go-text').textContent = 'Evaluate this site';
  }

  function score(items) {
    var total = 0;
    CATS.forEach(function (c) {
      var n = items[c.id] && items[c.id][0];
      if (!n) return;
      var f = n.m <= c.good ? 1 : n.m <= c.good * 2 ? 0.7 : n.m <= c.good * 3.5 ? 0.4 : 0.15;
      total += c.weight * f;
    });
    return Math.round(total);
  }

  function render() {
    markers.forEach(function (m) { m.remove(); });
    markers = [];
    var items = result.items;
    // highlighted main roads
    map.getSource('roads').setData({ type: 'FeatureCollection', features: result.roads.map(function (r) {
      return { type: 'Feature', properties: { name: r.name }, geometry: { type: 'LineString', coordinates: r.coords } };
    }) });
    // markers (bus stops and ATMs are many: smaller pins)
    CATS.forEach(function (c) {
      (items[c.id] || []).slice(0, c.id === 'bus' ? 60 : 40).forEach(function (p, i) {
        var el = document.createElement('div');
        el.className = 'pin' + ((c.id === 'bus' || c.id === 'bank') && i > 4 ? ' is-small' : '');
        el.style.setProperty('--c', c.c);
        el.innerHTML = '<span>' + c.icon + '</span>';
        el.dataset.cat = c.id;
        var pop = new maplibregl.Popup({ offset: 18, closeButton: true }).setHTML(
          '<div class="pop"><strong>' + esc(p.name) + '</strong><small>' + esc(c.name.replace(/s$/, '')) + ' · ' + km(p.m) + ' · ≈ ' + travel(p.m) + '</small>' +
          '<a href="https://www.google.com/maps/dir/?api=1&origin=' + site.lat + ',' + site.lng + '&destination=' + p.lat + ',' + p.lng + '" target="_blank" rel="noopener">Directions ↗</a></div>');
        markers.push(new maplibregl.Marker({ element: el, anchor: 'bottom' }).setLngLat([p.lng, p.lat]).setPopup(pop).addTo(map));
      });
    });

    // score and summary
    var s = score(items);
    $('score').textContent = s;
    $('score-arc').style.strokeDashoffset = String(314.16 * (1 - s / 100));
    $('score-label').textContent = s >= 75 ? 'Excellent connectivity' : s >= 55 ? 'Good connectivity' : s >= 35 ? 'Fair connectivity' : 'Developing area';
    var bits = [];
    var n = function (id) { return (items[id] || []).length; };
    var near = function (id) { return items[id] && items[id][0]; };
    if (n('school')) bits.push(n('school') + ' school' + (n('school') > 1 ? 's' : ''));
    if (n('hospital')) bits.push(n('hospital') + ' hospital' + (n('hospital') > 1 ? 's' : '') + '/clinics');
    if (n('mall')) bits.push(n('mall') + ' shopping place' + (n('mall') > 1 ? 's' : ''));
    var lines = [];
    if (bits.length) lines.push(bits.join(', ') + ' within ' + km(radius) + '.');
    if (near('metro')) lines.push('Nearest station: ' + near('metro').name + ', ' + km(near('metro').m) + '.');
    if (near('road')) lines.push(near('road').name + ' is ' + km(near('road').m) + ' away.');
    var missing = Object.keys(result.failed || {}).length;
    $('summary').textContent = (lines.join(' ') || 'Few places are mapped around this plot yet.') + (missing ? ' (' + missing + ' categor' + (missing > 1 ? 'ies' : 'y') + ' still loading: the score will change.)' : '');

    // category cards
    var box = $('cats');
    box.innerHTML = '';
    CATS.forEach(function (c) {
      var list = items[c.id] || [];
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'cat' + (c.wide ? ' cat--wide' : '');
      b.style.setProperty('--c', c.c);
      b.innerHTML = '<span class="cat__top"><span class="cat__icon">' + c.icon + '</span><span class="cat__name">' + c.name + '</span><span class="cat__count">' + list.length + (result.capped && result.capped[c.id] ? '+' : '') + '</span></span>' +
        (result.failed && result.failed[c.id] ? '<span class="cat__none cat__retry">Couldn’t load: the free map service is busy. Tap to retry</span>'
          : list[0] ? '<span class="cat__near">Nearest <b>' + esc(list[0].name) + '</b> · ' + km(list[0].m) + ' · ' + travel(list[0].m) + '</span>'
          : '<span class="cat__none">None mapped within ' + km(c.id === 'metro' ? Math.max(radius, 5000) : radius) + '</span>');
      if (result.failed && result.failed[c.id]) { b.querySelector('.cat__count').textContent = '–'; b.addEventListener('click', function () { retry(c.id); }); }
      else b.addEventListener('click', function () { focusCat(c.id); });
      box.appendChild(b);
    });
    $('results').hidden = false;
    $('source-note').textContent = 'Data: ' + result.source + ', © OpenStreetMap contributors. Distances are straight-line; times are city-traffic estimates. The score is an indication from mapped places, not a valuation. Some places may be missing from the map.';
    startSpin();
  }

  // load the categories that failed, one by one, and redraw
  function retry(id) {
    var missing = Object.keys(result.failed || {});
    if (!missing.length) return;
    $('status').textContent = 'Trying again…';
    var at = { lat: site.lat, lng: site.lng };
    viaPhoton(missing).then(function (r) {
      if (at.lat !== site.lat || at.lng !== site.lng || !result) return;
      Object.keys(r.items).forEach(function (k) {
        if (r.failed[k]) return;
        r.items[k].forEach(function (p) { p.m = dist(site, p); });
        result.items[k] = r.items[k].filter(function (p) { return p.m <= (k === 'metro' ? Math.max(radius, 5000) : radius) + 50; }).sort(function (a, b) { return a.m - b.m; });
        delete result.failed[k];
      });
      try { if (!Object.keys(result.failed).length) sessionStorage.setItem(cacheKey(), JSON.stringify(result)); } catch (e) { /* fine */ }
      render();
      $('status').textContent = Object.keys(result.failed).length ? 'Some categories are still busy; try again in a minute.' : '';
    });
  }

  function focusCat(id) {
    active = active === id ? null : id;
    [].forEach.call(document.querySelectorAll('.cat'), function (b, i) {
      var cid = CATS[i].id;
      b.classList.toggle('is-on', active === cid);
      b.classList.toggle('is-off', !!active && active !== cid);
    });
    markers.forEach(function (m) { m.getElement().classList.toggle('is-dim', !!active && m.getElement().dataset.cat !== active); });
    var old = document.querySelector('.list');
    if (old) old.remove();
    if (!active) return;
    var list = result.items[active] || [];
    if (!list.length) return;
    stopSpin();
    // the list under its card
    var ul = document.createElement('ul');
    ul.className = 'list';
    list.slice(0, 40).forEach(function (p) {
      var li = document.createElement('li');
      li.innerHTML = '<span>' + esc(p.name) + '</span><small>' + km(p.m) + ' · ' + travel(p.m) + '</small>';
      li.addEventListener('click', function () {
        map.flyTo({ center: [p.lng, p.lat], zoom: 16.5, pitch: 60, duration: 1600 });
        var mk = markers.filter(function (m) { var ll = m.getLngLat(); return ll.lat === p.lat && ll.lng === p.lng; })[0];
        if (mk) setTimeout(function () { if (!mk.getPopup().isOpen()) mk.togglePopup(); }, 1650);
      });
      ul.appendChild(li);
    });
    var card = document.querySelectorAll('.cat')[CATS.findIndex(function (c) { return c.id === active; })];
    card.insertAdjacentElement('afterend', ul);
    // frame the site and these places
    var b = new maplibregl.LngLatBounds([site.lng, site.lat], [site.lng, site.lat]);
    list.slice(0, 12).forEach(function (p) { b.extend([p.lng, p.lat]); });
    map.fitBounds(b, { padding: { top: 80, bottom: 80, left: window.innerWidth > 760 ? 460 : 40, right: 80 }, pitch: 50, maxZoom: 16, duration: 1600 });
  }

  /* Camera ---------------------------------------------------------------------------------------- */

  function spinStep() {
    if (!spinning) return;
    map.easeTo({ bearing: map.getBearing() + 12, duration: 2000, easing: function (t) { return t; } });
  }
  map.on('moveend', function () { if (spinning) spinStep(); });
  function startSpin() {
    if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    spinning = true; $('t-spin').setAttribute('aria-pressed', 'true');
    setTimeout(spinStep, 2800);
  }
  function stopSpin() { spinning = false; $('t-spin').setAttribute('aria-pressed', 'false'); }
  map.on('mousedown', stopSpin);
  map.on('touchstart', stopSpin);
  map.on('wheel', stopSpin);

  $('t-spin').addEventListener('click', function () { spinning ? stopSpin() : (spinning = true, this.setAttribute('aria-pressed', 'true'), spinStep()); });
  $('t-3d').addEventListener('click', function () {
    var on = this.getAttribute('aria-pressed') !== 'true';
    this.setAttribute('aria-pressed', on ? 'true' : 'false');
    map.setLayoutProperty('buildings', 'visibility', on ? 'visible' : 'none');
    map.easeTo({ pitch: on ? 55 : 0, bearing: on ? map.getBearing() : 0, duration: 1000 });
  });
  $('t-reset').addEventListener('click', function () { stopSpin(); map.flyTo({ center: [site.lng, site.lat], zoom: 15, pitch: 55, duration: 1500 }); });
  $('fold').addEventListener('click', function () { $('panel').classList.toggle('is-folded'); });

  // ?lat=…&lng=…&r=… opens a plot directly (e.g. linked from a property page), ?go evaluates at once
  var qs = new URLSearchParams(location.search);
  if (qs.get('lat') && qs.get('lng')) {
    var la = parseFloat(qs.get('lat')), lo = parseFloat(qs.get('lng'));
    if (isFinite(la) && isFinite(lo)) { site = { lat: la, lng: lo, name: qs.get('name') || 'Selected plot' }; siteMarker.setLngLat([lo, la]); map.jumpTo({ center: [lo, la] }); $('site-name').textContent = site.name; }
  }
  if (qs.get('r') && /^(1000|2000|3000|5000)$/.test(qs.get('r'))) document.querySelector('.radius button[data-r="' + qs.get('r') + '"]').click();
  if (qs.has('go')) map.once('load', evaluate);
})();
