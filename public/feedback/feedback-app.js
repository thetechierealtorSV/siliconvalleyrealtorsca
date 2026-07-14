/*
 * Site Feedback survey, Nikolaenko Property Group.
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

  function submitFeedback(cfg, row) {
    // Post to the edge function, which validates + inserts server-side and (if
    // opted in) sends the owner SMS using the just-inserted row's own data.
    return fetch(cfg.url + '/functions/v1/notify-feedback', {
      method: 'POST',
      headers: {
        'apikey': cfg.key,
        'Authorization': 'Bearer ' + cfg.key,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(row)
    }).then(function (r) {
      return r.json().then(function (j) {
        if (!r.ok || !j || j.ok === false) {
          throw new Error((j && j.error) || ('HTTP ' + r.status));
        }
        return j;
      }, function () {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return { ok: true };
      });
    });
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

  var RATE_KEY = 'nkpg_fb_last_submit';
  var RATE_MS = 60 * 1000;

  function uploadScreenshot(cfg, file) {
    if (!file) return Promise.resolve(null);
    if (file.size > 5 * 1024 * 1024) return Promise.reject(new Error('Screenshot must be under 5MB.'));
    var ext = (file.name.split('.').pop() || 'png').toLowerCase().replace(/[^a-z0-9]/g, '') || 'png';
    var path = 'fb_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8) + '.' + ext;
    return fetch(cfg.url + '/storage/v1/object/feedback-attachments/' + path, {
      method: 'POST',
      headers: {
        'apikey': cfg.key,
        'Authorization': 'Bearer ' + cfg.key,
        'Content-Type': file.type || 'application/octet-stream',
        'x-upsert': 'false'
      },
      body: file
    }).then(function (r) {
      if (!r.ok) return r.text().then(function (t) {
        try { console.error('[feedback] screenshot upload failed:', r.status, t); } catch (e) {}
        throw new Error('Screenshot upload failed.');
      });
      return 'feedback-attachments/' + path;
    });
  }

  function wireSubmit() {
    var btn = $('fbiq-submit');
    var msg = $('fbiq-msg');
    var submitting = false;

    btn.addEventListener('click', function () {
      if (submitting) return;
      msg.textContent = '';

      // Honeypot, silently accept but discard.
      var hp = $('fbiq-hp');
      if (hp && hp.value) { showThankYou(); return; }

      // Rate limit
      try {
        var last = parseInt(localStorage.getItem(RATE_KEY) || '0', 10);
        if (last && Date.now() - last < RATE_MS) {
          msg.textContent = 'Please wait a moment before submitting again.';
          return;
        }
      } catch (e) { /* storage disabled */ }

      var liked = Object.keys(state.liked).filter(function (k) { return state.liked[k]; });
      var liked_notes = $('fbiq-liked-notes').value.trim();
      var improve_notes = $('fbiq-improve').value.trim();
      var rating = state.rating || null;
      var opt = $('fbiq-optin').checked;
      var name = $('fbiq-name').value.trim();
      var email = $('fbiq-email').value.trim();
      var fileInput = $('fbiq-screenshot');
      var file = fileInput && fileInput.files && fileInput.files[0] ? fileInput.files[0] : null;

      if (liked.length === 0 && !liked_notes && !improve_notes && !rating) {
        msg.textContent = 'Please share at least one thing before submitting.';
        return;
      }
      if (liked_notes.length > 1000 || improve_notes.length > 2000) {
        msg.textContent = 'Please shorten your notes and try again.';
        return;
      }
      if (opt) {
        if (!name) { msg.textContent = 'Please enter your name (or uncheck the contact box).'; return; }
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          msg.textContent = 'Please enter a valid email or uncheck the contact box.';
          return;
        }
      }

      submitting = true;
      btn.disabled = true;
      btn.textContent = 'Sending\u2026';

      getSupabaseConfig().then(function (cfg) {
        if (!cfg) throw new Error('Configuration unavailable.');
        return uploadScreenshot(cfg, file).then(function (attachment_url) {
          var row = {
            liked: liked.length ? liked : null,
            liked_notes: liked_notes || null,
            improve_notes: improve_notes || null,
            rating: rating,
            contact_opt_in: !!opt,
            name: opt ? name : null,
            email: opt ? email : null,
            attachment_url: attachment_url,
            page_url: (function () { try { return document.referrer || window.location.href; } catch (e) { return null; } })(),
            user_agent: navigator.userAgent ? String(navigator.userAgent).slice(0, 500) : null
          };
          return submitFeedback(cfg, row).then(function () {
            try { localStorage.setItem(RATE_KEY, String(Date.now())); } catch (e) {}
            showThankYou();
          });
        });
      }).catch(function (err) {
        submitting = false;
        btn.disabled = false;
        btn.textContent = 'Submit feedback';
        try { if (err) console.error('[feedback] submit failed:', err); } catch (e) {}
        msg.textContent = 'Sorry \u2014 we could not submit your feedback. Please try again.';
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
