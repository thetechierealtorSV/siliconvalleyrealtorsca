/*
 * Site Feedback survey — Nikolaenko Property Group.
 * Self-contained vanilla JS. Writes to public.site_feedback via Supabase REST,
 * then fires notify-feedback edge function when contact opt-in is true.
 * Never blocks the thank-you state on notification failure.
 */
(function () {
  'use strict';

  var LIKED_OPTIONS = [
    { id: 'design',     label: 'Design' },
    { id: 'ease',       label: 'Ease of use' },
    { id: 'sunpath',    label: 'SunPath tool' },
    { id: 'fengshui',   label: 'Feng Shui tool' },
    { id: 'listings',   label: 'Listings' },
    { id: 'speed',      label: 'Speed' }
  ];

  var state = { liked: {}, rating: 0 };

  function $(id) { return document.getElementById(id); }

  function getSupabaseConfig() {
    return new Promise(function (resolve) {
      var w = window.__NKPG_SUPABASE__;
      if (w && w.url && w.key) return resolve(w);
      try {
        var p = window.parent && window.parent.__NKPG_SUPABASE__;
        if (p && p.url && p.key) return resolve(p);
      } catch (e) { /* cross-origin */ }
      fetch('/shared/supabase-config.json', { cache: 'no-store' })
        .then(function (r) { return r.ok ? r.json() : null; })
        .then(function (j) { resolve(j && j.url && j.key ? j : null); })
        .catch(function () { resolve(null); });
    });
  }

  function renderLiked() {
    var wrap = $('fbiq-liked');
    LIKED_OPTIONS.forEach(function (o) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'fbiq-chip';
      btn.textContent = o.label;
      btn.setAttribute('aria-pressed', 'false');
      btn.addEventListener('click', function () {
        state.liked[o.id] = !state.liked[o.id];
        btn.classList.toggle('fbiq-on', !!state.liked[o.id]);
        btn.setAttribute('aria-pressed', state.liked[o.id] ? 'true' : 'false');
      });
      wrap.appendChild(btn);
    });
  }

  function renderStars() {
    var wrap = $('fbiq-stars');
    for (var i = 1; i <= 5; i++) {
      (function (n) {
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'fbiq-star';
        b.textContent = '\u2605';
        b.setAttribute('role', 'radio');
        b.setAttribute('aria-label', n + ' star' + (n > 1 ? 's' : ''));
        b.setAttribute('aria-checked', 'false');
        b.addEventListener('click', function () {
          state.rating = n;
          Array.prototype.forEach.call(wrap.children, function (c, idx) {
            c.classList.toggle('fbiq-on', idx < n);
            c.setAttribute('aria-checked', idx === n - 1 ? 'true' : 'false');
          });
        });
        wrap.appendChild(b);
      })(i);
    }
  }

  function wireOptin() {
    var cb = $('fbiq-optin');
    var box = $('fbiq-contact');
    cb.addEventListener('change', function () {
      box.classList.toggle('fbiq-show', cb.checked);
    });
  }

  function insertFeedback(cfg, row) {
    return fetch(cfg.url + '/rest/v1/site_feedback', {
      method: 'POST',
      headers: {
        'apikey': cfg.key,
        'Authorization': 'Bearer ' + cfg.key,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify(row)
    }).then(function (r) {
      if (!r.ok) return r.text().then(function (t) { throw new Error(t || ('HTTP ' + r.status)); });
      return true;
    });
  }

  function notify(cfg, row) {
    // Fire-and-forget — never block the user on this.
    try {
      fetch(cfg.url + '/functions/v1/notify-feedback', {
        method: 'POST',
        headers: {
          'apikey': cfg.key,
          'Authorization': 'Bearer ' + cfg.key,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(row)
      }).catch(function (e) { console.warn('notify-feedback failed:', e); });
    } catch (e) { console.warn('notify-feedback threw:', e); }
  }

  function showThankYou() {
    var panel = $('fbiq-panel');
    panel.innerHTML =
      '<div class="fbiq-ok">' +
      '<div class="fbiq-check">\u2713</div>' +
      '<h2>Thanks for the feedback</h2>' +
      '<p>We read every submission. If you asked for a follow-up, Chris will be in touch.</p>' +
      '</div>';
  }

  function wireSubmit() {
    var btn = $('fbiq-submit');
    var msg = $('fbiq-msg');
    var submitting = false;

    btn.addEventListener('click', function () {
      if (submitting) return;
      msg.textContent = '';

      var liked = Object.keys(state.liked).filter(function (k) { return state.liked[k]; });
      var liked_notes = $('fbiq-liked-notes').value.trim();
      var improve_notes = $('fbiq-improve').value.trim();
      var rating = state.rating || null;
      var opt = $('fbiq-optin').checked;
      var name = $('fbiq-name').value.trim();
      var email = $('fbiq-email').value.trim();

      if (liked.length === 0 && !liked_notes && !improve_notes && !rating) {
        msg.textContent = 'Please share at least one thing before submitting.';
        return;
      }
      if (opt && email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        msg.textContent = 'Please enter a valid email or uncheck the contact box.';
        return;
      }

      submitting = true;
      btn.disabled = true;
      btn.textContent = 'Sending\u2026';

      var row = {
        liked: liked.length ? liked : null,
        liked_notes: liked_notes || null,
        improve_notes: improve_notes || null,
        rating: rating,
        contact_opt_in: !!opt,
        name: opt ? (name || null) : null,
        email: opt ? (email || null) : null
      };

      getSupabaseConfig().then(function (cfg) {
        if (!cfg) throw new Error('Configuration unavailable.');
        return insertFeedback(cfg, row).then(function () {
          if (opt) notify(cfg, row);
          showThankYou();
        });
      }).catch(function (err) {
        submitting = false;
        btn.disabled = false;
        btn.textContent = 'Submit feedback';
        msg.textContent = 'Sorry \u2014 could not submit. ' + (err && err.message ? err.message : '');
      });
    });
  }

  function init() {
    renderLiked();
    renderStars();
    wireOptin();
    wireSubmit();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else { init(); }
})();
