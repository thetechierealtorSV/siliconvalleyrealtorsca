/*
  Feng Shui IQ - app wiring
  Drives the direction dial + score panel from the questionnaire.
  Uses Nominatim (OpenStreetMap) for optional address geocoding, matching
  the sun-exposure widget pattern. No external dependencies.
*/

(function () {
  'use strict';

  var DEFAULT_LAT = 37.4419;
  var DEFAULT_LON = -122.1430;

  var state = {
    lat: DEFAULT_LAT,
    lon: DEFAULT_LON,
    facing: 180,
    q: { stairs: 'no', tjunction: 'no', bedroom: 'yes', kitchen: 'good', center: 'open' }
  };

  function qs(id) { return document.getElementById(id); }

  function polarPoint(cx, cy, r, deg) {
    var t = (deg - 90) * Math.PI / 180;
    return { x: cx + r * Math.cos(t), y: cy + r * Math.sin(t) };
  }

  function drawDial() {
    var canvas = qs('fsiq-canvas');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    var W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);
    var cx = W / 2, cy = H / 2;
    var Router = Math.min(W, H) / 2 - 30;
    var Rinner = Router - 60;

    // Background
    ctx.fillStyle = '#0b1730';
    ctx.beginPath(); ctx.arc(cx, cy, Router, 0, Math.PI * 2); ctx.fill();

    // Outer ring - Vastu
    var i;
    for (i = 0; i < 8; i++) {
      var startA = (i * 45 - 90 - 22.5) * Math.PI / 180;
      var endA = ((i + 1) * 45 - 90 - 22.5) * Math.PI / 180;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, Router, startA, endA);
      ctx.closePath();
      var v = window.FengShuiUtils.VASTU[i];
      ctx.fillStyle = v.quality === 'highly auspicious' ? 'rgba(251,191,36,0.28)'
                    : v.quality === 'auspicious' ? 'rgba(251,146,60,0.22)'
                    : v.quality === 'inauspicious for entrance' ? 'rgba(220,38,38,0.20)'
                    : v.quality === 'caution' ? 'rgba(148,163,184,0.18)'
                    : 'rgba(56,189,248,0.15)';
      ctx.fill();
    }

    // Inner ring - Bagua
    ctx.beginPath(); ctx.arc(cx, cy, Rinner, 0, Math.PI * 2);
    ctx.fillStyle = '#0b1730'; ctx.fill();

    // Spokes
    ctx.strokeStyle = 'rgba(255,255,255,0.18)'; ctx.lineWidth = 1;
    for (i = 0; i < 8; i++) {
      var a = (i * 45 - 90 - 22.5) * Math.PI / 180;
      ctx.beginPath();
      ctx.moveTo(cx + Rinner * Math.cos(a), cy + Rinner * Math.sin(a));
      ctx.lineTo(cx + Router * Math.cos(a), cy + Router * Math.sin(a));
      ctx.stroke();
    }

    // Labels
    ctx.fillStyle = '#e6ebf5';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    for (i = 0; i < 8; i++) {
      var gua = window.FengShuiUtils.BAGUA[i];
      var vas = window.FengShuiUtils.VASTU[i];
      var mid = i * 45;
      var pOuter = polarPoint(cx, cy, (Router + Rinner) / 2, mid);
      var pInner = polarPoint(cx, cy, Rinner - 22, mid);
      ctx.fillStyle = '#fde047';
      ctx.fillText(vas.name, pOuter.x, pOuter.y - 6);
      ctx.fillStyle = '#cbd5e1';
      ctx.font = '10px sans-serif';
      ctx.fillText(vas.english, pOuter.x, pOuter.y + 7);
      ctx.font = '12px sans-serif';
      ctx.fillStyle = '#fbbf24';
      ctx.fillText(gua.name, pInner.x, pInner.y);
    }

    // Compass N/E/S/W
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 13px sans-serif';
    var comp = [[0,'N'],[90,'E'],[180,'S'],[270,'W']];
    for (i = 0; i < comp.length; i++) {
      var cp = polarPoint(cx, cy, Router + 16, comp[i][0]);
      ctx.fillText(comp[i][1], cp.x, cp.y);
    }

    // Facing arrow
    var fp = polarPoint(cx, cy, Router - 4, state.facing);
    ctx.strokeStyle = '#f97316'; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(fp.x, fp.y); ctx.stroke();
    ctx.fillStyle = '#f97316';
    ctx.beginPath(); ctx.arc(fp.x, fp.y, 6, 0, Math.PI * 2); ctx.fill();

    // Sitting arrow
    var sp = polarPoint(cx, cy, Rinner - 10, state.facing + 180);
    ctx.strokeStyle = '#38bdf8'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(sp.x, sp.y); ctx.stroke();

    // Center Brahmasthan dot
    ctx.fillStyle = '#fde047';
    ctx.beginPath(); ctx.arc(cx, cy, 5, 0, Math.PI * 2); ctx.fill();
  }

  function recompute() {
    var r = window.FengShuiUtils.harmonyScore(state.facing, state.q);
    qs('fsiq-score-value').textContent = r.total;
    qs('fsiq-comp-bagua').textContent = r.components.bagua;
    qs('fsiq-comp-vastu').textContent = r.components.vastu;
    qs('fsiq-comp-flow').textContent = r.components.flow;
    qs('fsiq-comp-sha').textContent = r.components.sha;

    var gua = r.gua, sit = r.sitting, v = r.vastu;
    qs('fsiq-bagua-detail').innerHTML =
      '<h3>Bagua (Chinese Compass School)</h3>' +
      '<p><b>Facing ' + gua.name + ' (' + gua.english + ')</b> &mdash; element <b>' + gua.element +
      '</b>, associated with <b>' + gua.lifeArea + '</b>.</p>' +
      '<p>Sitting direction: <b>' + sit.name + ' (' + sit.english + ')</b>. The facing/sitting pair defines the home\u2019s energetic axis.</p>';

    qs('fsiq-vastu-detail').innerHTML =
      '<h3>Vastu Shastra (Indian Directional Science)</h3>' +
      '<p><b>' + v.name + ' (' + v.english + ') entrance</b>, presided over by <b>' + v.deity +
      '</b> &mdash; considered <b>' + v.quality + '</b>. ' + v.note + '.</p>';

    var summary = '';
    if (r.total >= 80)      summary = 'Strong overall harmony. The facing direction is favorable in both traditions and the interior flow supports good chi.';
    else if (r.total >= 60) summary = 'Balanced. Some factors are excellent, others could be softened with intentional cures (mirrors, plants, screens).';
    else if (r.total >= 40) summary = 'Mixed. Review the sha chi and interior flow items below &mdash; small adjustments can raise the score meaningfully.';
    else                    summary = 'Challenging alignment. Traditional practitioners would recommend cures for the entrance, center, and any poison-arrow conditions.';
    qs('fsiq-summary').textContent = summary;

    drawDial();
  }

  function syncFacingSelect(val) {
    var sel = qs('fsiq-facing'), best = Infinity, closest = 0;
    for (var j = 0; j < sel.options.length; j++) {
      var diff = Math.abs(parseFloat(sel.options[j].value) - val);
      if (diff < best) { best = diff; closest = j; }
    }
    sel.selectedIndex = closest;
  }

  function wire() {
    qs('fsiq-lat').addEventListener('change', function () {
      var v = parseFloat(this.value); if (!isNaN(v)) state.lat = v;
    });
    qs('fsiq-lon').addEventListener('change', function () {
      var v = parseFloat(this.value); if (!isNaN(v)) state.lon = v;
    });

    qs('fsiq-facing').addEventListener('change', function () {
      state.facing = parseFloat(this.value);
      qs('fsiq-facing-slider').value = this.value;
      recompute();
    });
    qs('fsiq-facing-slider').addEventListener('input', function () {
      state.facing = parseFloat(this.value);
      syncFacingSelect(state.facing);
      recompute();
    });

    ['stairs','tjunction','bedroom','kitchen','center'].forEach(function (k) {
      qs('fsiq-' + k).addEventListener('change', function () {
        state.q[k] = this.value; recompute();
      });
    });

    qs('fsiq-analyze-btn').addEventListener('click', recompute);

    qs('fsiq-geocode-btn').addEventListener('click', function () {
      var btn = this, q = qs('fsiq-address').value.trim();
      if (!q) return;
      btn.disabled = true; btn.textContent = 'Locating...';
      fetch('https://nominatim.openstreetmap.org/search?format=json&limit=1&q=' + encodeURIComponent(q))
        .then(function (r) { return r.json(); })
        .then(function (res) {
          if (res && res[0]) {
            state.lat = parseFloat(res[0].lat);
            state.lon = parseFloat(res[0].lon);
            qs('fsiq-lat').value = state.lat.toFixed(4);
            qs('fsiq-lon').value = state.lon.toFixed(4);
            recompute();
          } else {
            alert('Address not found. Try a more specific address, or enter latitude and longitude manually.');
          }
        })
        .catch(function () { alert('Geocoding lookup failed. Please enter latitude and longitude manually.'); })
        .then(function () { btn.disabled = false; btn.textContent = 'Analyze'; });
    });
  }

  function init() {
    wire();
    recompute();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

  // URL param bootstrap (matches sun-exposure pattern)
  (function bootstrap() {
    function apply() {
      try {
        var p = new URLSearchParams(window.location.search);
        var lat = parseFloat(p.get('lat'));
        var lon = parseFloat(p.get('lon'));
        var address = p.get('address');
        var facing = parseFloat(p.get('facing'));
        if (!isNaN(facing)) {
          state.facing = facing;
          qs('fsiq-facing-slider').value = facing;
          syncFacingSelect(facing);
        }
        if (!isNaN(lat) && !isNaN(lon)) {
          state.lat = lat; state.lon = lon;
          qs('fsiq-lat').value = lat.toFixed(6);
          qs('fsiq-lon').value = lon.toFixed(6);
          if (address) qs('fsiq-address').value = address;
          recompute();
        } else if (address) {
          qs('fsiq-address').value = address;
          qs('fsiq-geocode-btn').click();
        }
      } catch (e) {}
    }
    if (document.readyState === 'complete' || document.readyState === 'interactive') setTimeout(apply, 300);
    else window.addEventListener('DOMContentLoaded', function () { setTimeout(apply, 300); });
  })();
})();
