/*
  SunPath IQ - Stage 1 app wiring
  --------------------------------
  Original vanilla JS wiring layer. Uses the global solarPosition() engine
  (solar-engine.js) via the sunPathDay() / daylightScore() helpers
  (solar-utils.js) to drive the controls, the polar sun-path canvas, and the
  Daylight Score panel. No external libraries.
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
    dayData: null
  };

  function qs(id) { return document.getElementById(id); }

  function todayUTC() {
    var n = new Date();
    return new Date(Date.UTC(n.getFullYear(), n.getMonth(), n.getDate()));
  }

  function pad2(n) { return n < 10 ? '0' + n : '' + n; }

  function toDateInputValue(d) {
    return d.getUTCFullYear() + '-' + pad2(d.getUTCMonth() + 1) + '-' + pad2(d.getUTCDate());
  }

  function computeAndRender() {
    var dayData = sunPathDay(state.date, state.lat, state.lon);
    state.dayData = dayData;
    var scoreData = daylightScore(dayData.dayLengthHours, dayData.noonElevation, dayData.noonAzimuth, state.orientation);
    renderScore(scoreData, dayData);
    drawPolar(dayData);
    updateTimeReadout();
  }

  function renderScore(scoreData, dayData) {
    qs('spiq-score-value').textContent = scoreData.score;
    qs('spiq-comp-day').textContent = scoreData.components.dayLength;
    qs('spiq-comp-alt').textContent = scoreData.components.altitude;
    qs('spiq-comp-orient').textContent = scoreData.components.orientation;
    qs('spiq-sunrise').textContent = dayData.sunrise ? (dayData.sunrise + ' solar time') : 'No sunrise';
    qs('spiq-noon').textContent = dayData.solarNoon ? (dayData.solarNoon + ' solar time') : '--';
    qs('spiq-sunset').textContent = dayData.sunset ? (dayData.sunset + ' solar time') : 'No sunset';
    qs('spiq-daylen').textContent = dayData.dayLengthHours + ' hrs';
  }

  function polarPoint(cx, cy, r, azimuthDeg) {
    var theta = (azimuthDeg - 90) * Math.PI / 180;
    return { x: cx + r * Math.cos(theta), y: cy + r * Math.sin(theta) };
  }

  function drawPolar(dayData) {
    var canvas = qs('spiq-canvas');
    var ctx = canvas.getContext('2d');
    var W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    var cx = W / 2, cy = H / 2, R = Math.min(W, H) / 2 - 34;

    ctx.fillStyle = '#0b1730';
    ctx.beginPath();
    ctx.arc(cx, cy, R, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = 'rgba(255,255,255,0.16)';
    ctx.lineWidth = 1;
    var rings = [0, 30, 60, 90];
    var i;
    for (i = 0; i < rings.length; i++) {
      var rr = R * (1 - rings[i] / 90);
      ctx.beginPath();
      ctx.arc(cx, cy, rr, 0, Math.PI * 2);
      ctx.stroke();
    }

    ctx.fillStyle = '#cbd5e1';
    ctx.font = '13px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    var compass = [ { az: 0, label: 'N' }, { az: 90, label: 'E' }, { az: 180, label: 'S' }, { az: 270, label: 'W' } ];
    for (i = 0; i < compass.length; i++) {
      var cp = polarPoint(cx, cy, R + 16, compass[i].az);
      ctx.fillText(compass[i].label, cp.x, cp.y);
    }

    ctx.beginPath();
    var started = false;
    var s;
    for (i = 0; i < dayData.samples.length; i++) {
      s = dayData.samples[i];
      if (s.elevation < 0) { started = false; continue; }
      var r2 = R * (1 - s.elevation / 90);
      var p = polarPoint(cx, cy, r2, s.azimuth);
      if (!started) { ctx.moveTo(p.x, p.y); started = true; } else { ctx.lineTo(p.x, p.y); }
    }
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 3;
    ctx.stroke();

    function markerAtMinute(min, color) {
      if (min === null || min === undefined) return;
      var idx = Math.round(min / 2);
      idx = Math.max(0, Math.min(dayData.samples.length - 1, idx));
      var samp = dayData.samples[idx];
      var rr2 = R * (1 - Math.max(0, samp.elevation) / 90);
      var pp = polarPoint(cx, cy, rr2, samp.azimuth);
      ctx.beginPath();
      ctx.arc(pp.x, pp.y, 5, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
    }
    markerAtMinute(dayData.sunriseMin, '#f97316');
    markerAtMinute(dayData.noonMin, '#fde047');
    markerAtMinute(dayData.sunsetMin, '#f97316');

    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2;
    var wallP = polarPoint(cx, cy, R, state.orientation);
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(wallP.x, wallP.y);
    ctx.stroke();

    var idxNow = Math.max(0, Math.min(dayData.samples.length - 1, Math.round(state.timeMin / 2)));
    var sNow = dayData.samples[idxNow];
    if (sNow.elevation >= 0) {
      var rNow = R * (1 - sNow.elevation / 90);
      var pNow = polarPoint(cx, cy, rNow, sNow.azimuth);
      ctx.beginPath();
      ctx.arc(pNow.x, pNow.y, 7, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
      ctx.strokeStyle = '#111827';
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  }

  function updateTimeReadout() {
    if (!state.dayData) return;
    var idx = Math.max(0, Math.min(state.dayData.samples.length - 1, Math.round(state.timeMin / 2)));
    var s = state.dayData.samples[idx];
    var timeStr = solarMinutesToHHMM(state.timeMin);
    var text = timeStr + ' solar time  -  elevation ' + s.elevation.toFixed(1) + ' deg, azimuth ' + s.azimuth.toFixed(1) + ' deg';
    if (s.elevation < 0) text += ' (below horizon)';
    qs('spiq-time-readout').textContent = text;
  }

  function syncOrientationSelectFromSlider(val) {
    var select = qs('spiq-orientation');
    var opts = select.options;
    var j, closest = 0, best = Infinity;
    for (j = 0; j < opts.length; j++) {
      var diff = Math.abs(parseFloat(opts[j].value) - val);
      if (diff < best) { best = diff; closest = j; }
    }
    select.selectedIndex = closest;
  }

  function wireEvents() {
    qs('spiq-lat').addEventListener('input', function () {
      var v = parseFloat(this.value);
      state.lat = isNaN(v) ? DEFAULT_LAT : v;
      computeAndRender();
    });

    qs('spiq-lon').addEventListener('input', function () {
      var v = parseFloat(this.value);
      state.lon = isNaN(v) ? DEFAULT_LON : v;
      computeAndRender();
    });

    qs('spiq-date').addEventListener('change', function () {
      if (!this.value) return;
      var parts = this.value.split('-');
      state.date = new Date(Date.UTC(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10)));
      computeAndRender();
    });

    qs('spiq-orientation').addEventListener('change', function () {
      state.orientation = parseFloat(this.value);
      qs('spiq-orientation-slider').value = this.value;
      computeAndRender();
    });

    qs('spiq-orientation-slider').addEventListener('input', function () {
      state.orientation = parseFloat(this.value);
      syncOrientationSelectFromSlider(state.orientation);
      computeAndRender();
    });

    qs('spiq-time-slider').addEventListener('input', function () {
      state.timeMin = parseInt(this.value, 10);
      if (state.dayData) drawPolar(state.dayData);
      updateTimeReadout();
    });

    var shortcutButtons = document.querySelectorAll('[data-shortcut]');
    var k;
    for (k = 0; k < shortcutButtons.length; k++) {
      shortcutButtons[k].addEventListener('click', function () {
        var year = new Date().getFullYear();
        var key = this.getAttribute('data-shortcut');
        var map = {
          spring: [2, 20],
          summer: [5, 21],
          fall: [8, 22],
          winter: [11, 21]
        };
        if (key === 'today') {
          state.date = todayUTC();
        } else if (map[key]) {
          state.date = new Date(Date.UTC(year, map[key][0], map[key][1]));
        }
        qs('spiq-date').value = toDateInputValue(state.date);
        computeAndRender();
      });
    }

    qs('spiq-geocode-btn').addEventListener('click', function () {
      var btn = this;
      var q = qs('spiq-address').value.trim();
      if (!q) return;
      btn.disabled = true;
      btn.textContent = 'Finding...';
      fetch('https://nominatim.openstreetmap.org/search?format=json&limit=1&q=' + encodeURIComponent(q))
        .then(function (r) { return r.json(); })
        .then(function (results) {
          if (results && results[0]) {
            state.lat = parseFloat(results[0].lat);
            state.lon = parseFloat(results[0].lon);
            qs('spiq-lat').value = state.lat.toFixed(4);
            qs('spiq-lon').value = state.lon.toFixed(4);
            computeAndRender();
          } else {
            alert('Address not found. Try a more specific address, or enter latitude and longitude manually.');
          }
        })
        .catch(function () {
          alert('Geocoding lookup failed. Please enter latitude and longitude manually.');
        })
        .then(function () {
          btn.disabled = false;
          btn.textContent = 'Find';
        });
    });
  }

  function init() {
    qs('spiq-date').value = toDateInputValue(state.date);
    wireEvents();
    computeAndRender();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
