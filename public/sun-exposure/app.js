/*
  SunPath IQ - Stage 2 app wiring
  --------------------------------
  Original vanilla JS. Drives BOTH views from one shared state:
    - 3D sun & shadow scene (sunpath-3d.js / window.SunPath3D)
    - 2D polar sun-path diagram + Daylight Score (solar-utils.js)
  Time is TRUE SOLAR TIME throughout. No external libraries beyond three.js
  (used only by the 3D engine).
*/

(function () {
  'use strict';

  var DEFAULT_LAT = 37.4419;
  var DEFAULT_LON = -122.1430;

  var state = {
    lat: DEFAULT_LAT,
    lon: DEFAULT_LON,
    date: todayUTC(),
    orientation: 180,
    timeMin: 720,
    mode: '3d',
    dayData: null,
    threeReady: false
  };

  function qs(id) { return document.getElementById(id); }
  function todayUTC() { var n = new Date(); return new Date(Date.UTC(n.getFullYear(), n.getMonth(), n.getDate())); }
  function pad2(n) { return n < 10 ? '0' + n : '' + n; }
  function toDateInputValue(d) { return d.getUTCFullYear() + '-' + pad2(d.getUTCMonth() + 1) + '-' + pad2(d.getUTCDate()); }

  // ---------- shared compute ----------
  function recomputeDay() {
    state.dayData = sunPathDay(state.date, state.lat, state.lon);
    var sc = daylightScore(state.dayData.dayLengthHours, state.dayData.noonElevation, state.dayData.noonAzimuth, state.orientation);
    renderScore(sc, state.dayData);
  }

  function currentSample() {
    if (!state.dayData) return null;
    var idx = Math.max(0, Math.min(state.dayData.samples.length - 1, Math.round(state.timeMin / 2)));
    return state.dayData.samples[idx];
  }

  function renderScore(sc, dayData) {
    qs('spiq-score-value').textContent = sc.score;
    qs('spiq-comp-day').textContent = sc.components.dayLength;
    qs('spiq-comp-alt').textContent = sc.components.altitude;
    qs('spiq-comp-orient').textContent = sc.components.orientation;
    qs('spiq-sunrise').textContent = dayData.sunrise ? (dayData.sunrise + ' solar time') : 'No sunrise';
    qs('spiq-noon').textContent = dayData.solarNoon ? (dayData.solarNoon + ' solar time') : '--';
    qs('spiq-sunset').textContent = dayData.sunset ? (dayData.sunset + ' solar time') : 'No sunset';
    qs('spiq-daylen').textContent = dayData.dayLengthHours + ' hrs';
  }

  function updateTimeReadout() {
    var s = currentSample();
    if (!s) return;
    var text = solarMinutesToHHMM(state.timeMin) + ' solar time  -  elevation ' + s.elevation.toFixed(1) + ' deg, azimuth ' + s.azimuth.toFixed(1) + ' deg';
    if (s.elevation < 0) text += ' (below horizon)';
    qs('spiq-time-readout').textContent = text;
  }

  // ---------- push current sun to whichever view is active ----------
  function updateSun() {
    updateTimeReadout();
    var s = currentSample();
    if (!s) return;
    if (state.mode === '3d' && state.threeReady && window.SunPath3D) {
      window.SunPath3D.setSunFromSolar(s.elevation, s.azimuth);
    } else if (state.mode === '2d') {
      drawPolar(state.dayData);
    }
  }

  // ---------- 2D polar diagram ----------
  function polarPoint(cx, cy, r, az) { var t = (az - 90) * Math.PI / 180; return { x: cx + r * Math.cos(t), y: cy + r * Math.sin(t) }; }

  function drawPolar(dayData) {
    var canvas = qs('spiq-canvas'); if (!canvas || !dayData) return;
    var ctx = canvas.getContext('2d');
    var W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);
    var cx = W / 2, cy = H / 2, R = Math.min(W, H) / 2 - 34;
    ctx.fillStyle = '#0b1730'; ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.16)'; ctx.lineWidth = 1;
    var rings = [0, 30, 60, 90], i;
    for (i = 0; i < rings.length; i++) { var rr = R * (1 - rings[i] / 90); ctx.beginPath(); ctx.arc(cx, cy, rr, 0, Math.PI * 2); ctx.stroke(); }
    ctx.fillStyle = '#cbd5e1'; ctx.font = '13px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    var comp = [ [0, 'N'], [90, 'E'], [180, 'S'], [270, 'W'] ];
    for (i = 0; i < comp.length; i++) { var cp = polarPoint(cx, cy, R + 16, comp[i][0]); ctx.fillText(comp[i][1], cp.x, cp.y); }
    ctx.beginPath(); var started = false, s;
    for (i = 0; i < dayData.samples.length; i++) {
      s = dayData.samples[i];
      if (s.elevation < 0) { started = false; continue; }
      var r2 = R * (1 - s.elevation / 90), p = polarPoint(cx, cy, r2, s.azimuth);
      if (!started) { ctx.moveTo(p.x, p.y); started = true; } else { ctx.lineTo(p.x, p.y); }
    }
    ctx.strokeStyle = '#fbbf24'; ctx.lineWidth = 3; ctx.stroke();
    function marker(min, color) {
      if (min === null || min === undefined) return;
      var idx = Math.max(0, Math.min(dayData.samples.length - 1, Math.round(min / 2)));
      var samp = dayData.samples[idx], rr2 = R * (1 - Math.max(0, samp.elevation) / 90), pp = polarPoint(cx, cy, rr2, samp.azimuth);
      ctx.beginPath(); ctx.arc(pp.x, pp.y, 5, 0, Math.PI * 2); ctx.fillStyle = color; ctx.fill();
    }
    marker(dayData.sunriseMin, '#f97316'); marker(dayData.noonMin, '#fde047'); marker(dayData.sunsetMin, '#f97316');
    ctx.strokeStyle = '#38bdf8'; ctx.lineWidth = 2;
    var wp = polarPoint(cx, cy, R, state.orientation);
    ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(wp.x, wp.y); ctx.stroke();
    var sNow = currentSample();
    if (sNow && sNow.elevation >= 0) {
      var rNow = R * (1 - sNow.elevation / 90), pNow = polarPoint(cx, cy, rNow, sNow.azimuth);
      ctx.beginPath(); ctx.arc(pNow.x, pNow.y, 7, 0, Math.PI * 2); ctx.fillStyle = '#ffffff'; ctx.fill();
      ctx.strokeStyle = '#111827'; ctx.lineWidth = 2; ctx.stroke();
    }
  }

  // ---------- mode toggle ----------
  function setMode(mode) {
    state.mode = mode;
    var is3d = mode === '3d';
    qs('spiq-view-3d').style.display = is3d ? '' : 'none';
    qs('spiq-view-2d').style.display = is3d ? 'none' : '';
    qs('spiq-mode-3d').classList.toggle('spiq-active', is3d);
    qs('spiq-mode-2d').classList.toggle('spiq-active', !is3d);
    if (is3d && state.threeReady && window.SunPath3D) window.SunPath3D.resize();
    updateSun();
    if (!is3d) drawPolar(state.dayData);
  }

  // ---------- location change (recompute + reload 3D neighborhood) ----------
  function applyLocation(lat, lon, reload3d) {
    state.lat = lat; state.lon = lon;
    qs('spiq-lat').value = lat.toFixed(4);
    qs('spiq-lon').value = lon.toFixed(4);
    recomputeDay();
    updateSun();
    if (reload3d && state.threeReady && window.SunPath3D) {
      window.SunPath3D.setLocation(lat, lon).then(function () { updateSun(); });
    }
  }

  function syncOrientationSelect(val) {
    var sel = qs('spiq-orientation'), opts = sel.options, best = Infinity, closest = 0;
    for (var j = 0; j < opts.length; j++) { var diff = Math.abs(parseFloat(opts[j].value) - val); if (diff < best) { best = diff; closest = j; } }
    sel.selectedIndex = closest;
  }

  // ---------- events ----------
  function wire() {
    qs('spiq-lat').addEventListener('change', function () { var v = parseFloat(this.value); applyLocation(isNaN(v) ? DEFAULT_LAT : v, state.lon, true); });
    qs('spiq-lon').addEventListener('change', function () { var v = parseFloat(this.value); applyLocation(state.lat, isNaN(v) ? DEFAULT_LON : v, true); });

    qs('spiq-date').addEventListener('change', function () {
      if (!this.value) return;
      var p = this.value.split('-');
      state.date = new Date(Date.UTC(parseInt(p[0], 10), parseInt(p[1], 10) - 1, parseInt(p[2], 10)));
      recomputeDay(); updateSun();
    });

    qs('spiq-orientation').addEventListener('change', function () {
      state.orientation = parseFloat(this.value);
      qs('spiq-orientation-slider').value = this.value;
      recomputeDay(); if (state.mode === '2d') drawPolar(state.dayData);
    });
    qs('spiq-orientation-slider').addEventListener('input', function () {
      state.orientation = parseFloat(this.value); syncOrientationSelect(state.orientation);
      recomputeDay(); if (state.mode === '2d') drawPolar(state.dayData);
    });

    qs('spiq-time-slider').addEventListener('input', function () { state.timeMin = parseInt(this.value, 10); updateSun(); });

    var sc = document.querySelectorAll('[data-shortcut]');
    for (var k = 0; k < sc.length; k++) {
      sc[k].addEventListener('click', function () {
        var year = new Date().getFullYear();
        var key = this.getAttribute('data-shortcut');
        var map = { spring: [2, 20], summer: [5, 21], fall: [8, 22], winter: [11, 21] };
        if (key === 'today') state.date = todayUTC();
        else if (map[key]) state.date = new Date(Date.UTC(year, map[key][0], map[key][1]));
        qs('spiq-date').value = toDateInputValue(state.date);
        recomputeDay(); updateSun();
      });
    }

    qs('spiq-mode-3d').addEventListener('click', function () { setMode('3d'); });
    qs('spiq-mode-2d').addEventListener('click', function () { setMode('2d'); });

    qs('spiq-geocode-btn').addEventListener('click', function () {
      var btn = this, q = qs('spiq-address').value.trim();
      if (!q) return;
      btn.disabled = true; btn.textContent = 'Locating...';
      fetch('https://nominatim.openstreetmap.org/search?format=json&limit=1&q=' + encodeURIComponent(q))
        .then(function (r) { return r.json(); })
        .then(function (res) {
          if (res && res[0]) { applyLocation(parseFloat(res[0].lat), parseFloat(res[0].lon), true); }
          else { alert('Address not found. Try a more specific address, or enter latitude and longitude manually.'); }
        })
        .catch(function () { alert('Geocoding lookup failed. Please enter latitude and longitude manually.'); })
        .then(function () { btn.disabled = false; btn.textContent = 'Simulate'; });
    });
  }

  function initThree() {
    if (!window.SunPath3D || typeof THREE === 'undefined') {
      qs('spiq-3d-status').textContent = '3D view unavailable (three.js failed to load). Use the 2D Sun Path view.';
      return;
    }
    try {
      window.SunPath3D.init(qs('spiq-3d-container'), {
        onStatus: function (m) { var el = qs('spiq-3d-status'); if (el) el.textContent = m; }
      });
      state.threeReady = true;
      window.SunPath3D.setLocation(state.lat, state.lon).then(function () { updateSun(); });
      updateSun();
    } catch (e) {
      qs('spiq-3d-status').textContent = '3D view could not start on this device. Use the 2D Sun Path view.';
    }
  }

  function init() {
    qs('spiq-date').value = toDateInputValue(state.date);
    wire();
    recomputeDay();
    initThree();
    setMode('3d');
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();


/* URL parameter bootstrap: allows external pages (e.g. Sun & Property Explorer, Moxi listings) to
   pre-load a specific address or coordinates into SunPath IQ via ?address=... or ?lat=..&lon=..
   Original code; runs after init() has wired the UI. */
(function spiqUrlParamBootstrap(){
  function applyParams(){
    try {
      var p = new URLSearchParams(window.location.search);
      var lat = parseFloat(p.get('lat'));
      var lon = parseFloat(p.get('lon'));
      var address = p.get('address');
      if (!isNaN(lat) && !isNaN(lon)) {
        var latEl = qs('spiq-lat'); var lonEl = qs('spiq-lon');
        if (latEl) latEl.value = lat.toFixed(6);
        if (lonEl) lonEl.value = lon.toFixed(6);
        if (address) { var a = qs('spiq-address'); if (a) a.value = address; }
        if (typeof applyLocation === 'function') applyLocation(lat, lon, true);
      } else if (address) {
        var addrEl = qs('spiq-address');
        var btn = qs('spiq-geocode-btn');
        if (addrEl) addrEl.value = address;
        if (btn) btn.click();
      }
    } catch (e) { /* non-fatal */ }
  }
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(applyParams, 300);
  } else {
    window.addEventListener('DOMContentLoaded', function(){ setTimeout(applyParams, 300); });
  }
})();
