/*
 * Nikolaenko Property Group, "What Matters to You?" preferences widget.
 * Self-contained vanilla JS. Mount by placing:
 *   <div id="nkpg-preferences"></div>
 *   <script src="/shared/preferences-widget.js"></script>
 *
 * Config: reads window.__NKPG_SUPABASE__ = { url, key } (set in index.html
 * via Vite env substitution). Falls back to fetching /shared/supabase-config.json
 * if not injected (for the static widget pages).
 */
(function () {
  'use strict';

  var MOUNT_ID = 'nkpg-preferences';
  var STYLE_ID = 'nkpg-preferences-style';

  var PREFERENCES = [
    { id: 'natural_light',   label: 'Natural Light',              tool: { href: '/sun-exposure', label: 'Try SunPath IQ →' } },
    { id: 'feng_shui',       label: 'Feng Shui / Vastu Harmony',  tool: { href: '/feng-shui',    label: 'Try Feng Shui IQ →' } },
    { id: 'top_schools',     label: 'Top Schools' },
    { id: 'commute',         label: 'Commute to Major Employers' },
    { id: 'lot_size',        label: 'Lot Size' },
    { id: 'investment',      label: 'Investment Potential' },
    { id: 'privacy',         label: 'Privacy & Discretion' },
    { id: 'new_renovated',   label: 'New / Renovated' }
  ];

  var CSS = [
    '#nkpg-preferences *,#nkpg-preferences *::before,#nkpg-preferences *::after{box-sizing:border-box}',
    '.nkpg-pref{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;color:#e6ebf5;background:linear-gradient(180deg,#0b1226 0%,#142042 100%);border:1px solid rgba(148,163,184,.18);border-radius:14px;padding:26px;max-width:820px;margin:32px auto;box-shadow:0 20px 60px rgba(0,0,0,.35)}',
    '.nkpg-pref h3{margin:0 0 6px;font-size:1.35rem;background:linear-gradient(90deg,#fde047,#fb923c,#f97316);-webkit-background-clip:text;background-clip:text;color:transparent;letter-spacing:.3px}',
    '.nkpg-pref .nkpg-sub{margin:0 0 18px;color:#9fb0d0;font-size:.9rem}',
    '.nkpg-chips{display:flex;flex-wrap:wrap;gap:10px;margin-bottom:18px}',
    '.nkpg-chip{cursor:pointer;padding:9px 14px;border-radius:999px;border:1px solid rgba(148,163,184,.35);background:rgba(8,14,30,.55);color:#e6ebf5;font-size:.88rem;font-weight:500;transition:all .18s ease;user-select:none}',
    '.nkpg-chip:hover{border-color:#fbbf24;color:#fde047}',
    '.nkpg-chip.nkpg-on{background:linear-gradient(90deg,#f97316,#fb923c);border-color:#fb923c;color:#1a1200;font-weight:700}',
    '.nkpg-tools{display:flex;flex-wrap:wrap;gap:10px;margin-bottom:18px;min-height:0}',
    '.nkpg-tool{display:inline-flex;align-items:center;gap:6px;padding:8px 14px;border-radius:8px;background:rgba(251,191,36,.12);border:1px solid rgba(251,191,36,.4);color:#fde047;font-size:.85rem;text-decoration:none;font-weight:600}',
    '.nkpg-tool:hover{background:rgba(251,191,36,.22)}',
    '.nkpg-cta{display:flex;flex-wrap:wrap;gap:10px;align-items:center;justify-content:space-between;border-top:1px solid rgba(148,163,184,.15);padding-top:16px}',
    '.nkpg-cta p{margin:0;color:#b7c3dc;font-size:.88rem}',
    '.nkpg-btn{background:linear-gradient(90deg,#f97316,#fb923c);color:#1a1200;border:none;border-radius:10px;padding:10px 18px;font-weight:700;font-size:.9rem;cursor:pointer}',
    '.nkpg-btn:hover{filter:brightness(1.08)}',
    '.nkpg-btn:disabled{opacity:.5;cursor:not-allowed}',
    '.nkpg-btn.nkpg-ghost{background:transparent;color:#b7c3dc;border:1px solid rgba(148,163,184,.35)}',
    '.nkpg-form{margin-top:18px;display:grid;grid-template-columns:1fr 1fr;gap:12px}',
    '.nkpg-form label{display:block;font-size:.78rem;color:#b7c3dc;margin-bottom:5px}',
    '.nkpg-form .nkpg-full{grid-column:1 / -1}',
    '.nkpg-form input{width:100%;padding:10px 12px;border-radius:8px;border:1px solid rgba(148,163,184,.35);background:rgba(8,14,30,.7);color:#e6ebf5;font-size:.92rem}',
    '.nkpg-form input:focus{outline:none;border-color:#fb923c}',
    '.nkpg-msg{font-size:.82rem;margin-top:10px;color:#fca5a5}',
    '.nkpg-ok{padding:22px;text-align:center}',
    '.nkpg-ok .nkpg-check{font-size:2.4rem;color:#fbbf24;margin-bottom:6px}',
    '.nkpg-ok h4{margin:0 0 6px;color:#fde047;font-size:1.15rem}',
    '.nkpg-ok p{margin:0;color:#b7c3dc;font-size:.9rem}',
    '@media (max-width:600px){.nkpg-form{grid-template-columns:1fr}.nkpg-pref{padding:20px;margin:20px 12px}}'
  ].join('');

  function injectStyles() {
    if (document.getElementById(STYLE_ID)) return;
    var s = document.createElement('style');
    s.id = STYLE_ID;
    s.textContent = CSS;
    document.head.appendChild(s);
  }

  function el(tag, attrs, children) {
    var e = document.createElement(tag);
    if (attrs) for (var k in attrs) {
      if (k === 'class') e.className = attrs[k];
      else if (k === 'text') e.textContent = attrs[k];
      else if (k.slice(0, 2) === 'on') e.addEventListener(k.slice(2), attrs[k]);
      else e.setAttribute(k, attrs[k]);
    }
    if (children) children.forEach(function (c) { if (c) e.appendChild(c); });
    return e;
  }

  function getSupabaseConfig() {
    return new Promise(function (resolve) {
      var w = window.__NKPG_SUPABASE__;
      if (w && w.url && w.key) return resolve(w);
      // Inside an iframe (e.g. /feng-shui, /sun-exposure), inherit from parent.
      try {
        var p = window.parent && window.parent.__NKPG_SUPABASE__;
        if (p && p.url && p.key) return resolve(p);
      } catch (e) { /* cross-origin, ignore */ }
      // Final fallback: /shared/supabase-config.json (optional)
      fetch('/shared/supabase-config.json', { cache: 'no-store' })
        .then(function (r) { return r.ok ? r.json() : null; })
        .then(function (j) { resolve(j && j.url && j.key ? j : null); })
        .catch(function () { resolve(null); });
    });
  }

  function postJson(url, key, table, row) {
    return fetch(url + '/rest/v1/' + table, {
      method: 'POST',
      headers: {
        'apikey': key,
        'Authorization': 'Bearer ' + key,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify(row)
    }).then(function (r) {
      if (!r.ok) return r.text().then(function (t) { throw new Error(t || ('HTTP ' + r.status)); });
      return true;
    });
  }

  function render(mount) {
    var state = { selected: {}, submitting: false, showForm: false };

    var wrap = el('div', { class: 'nkpg-pref', role: 'region', 'aria-label': 'What matters to you' });
    wrap.appendChild(el('h3', { text: 'What Matters to You?' }));
    wrap.appendChild(el('p', { class: 'nkpg-sub', text: 'Tap the qualities your ideal home needs. We\u2019ll surface tools and hand-picked matches.' }));

    var chipsRow = el('div', { class: 'nkpg-chips' });
    var toolsRow = el('div', { class: 'nkpg-tools' });

    PREFERENCES.forEach(function (p) {
      var chip = el('button', {
        type: 'button', class: 'nkpg-chip', 'data-id': p.id, 'aria-pressed': 'false',
        onclick: function () {
          state.selected[p.id] = !state.selected[p.id];
          chip.classList.toggle('nkpg-on', !!state.selected[p.id]);
          chip.setAttribute('aria-pressed', state.selected[p.id] ? 'true' : 'false');
          refreshTools();
        }
      });
      chip.textContent = p.label;
      chipsRow.appendChild(chip);
    });

    function refreshTools() {
      toolsRow.innerHTML = '';
      PREFERENCES.forEach(function (p) {
        if (state.selected[p.id] && p.tool) {
          var a = el('a', { class: 'nkpg-tool', href: p.tool.href });
          a.textContent = p.tool.label;
          toolsRow.appendChild(a);
        }
      });
    }

    wrap.appendChild(chipsRow);
    wrap.appendChild(toolsRow);

    var ctaRow = el('div', { class: 'nkpg-cta' });
    ctaRow.appendChild(el('p', { text: 'Want us to send hand-picked listings matching these?' }));
    var openBtn = el('button', {
      type: 'button', class: 'nkpg-btn',
      onclick: function () { state.showForm = true; formWrap.style.display = 'grid'; openBtn.style.display = 'none'; }
    });
    openBtn.textContent = 'Get matched listings';
    ctaRow.appendChild(openBtn);
    wrap.appendChild(ctaRow);

    var formWrap = el('form', { class: 'nkpg-form', novalidate: 'novalidate' });
    formWrap.style.display = 'none';
    formWrap.appendChild((function () {
      var d = el('div'); d.appendChild(el('label', { for: 'nkpg-name', text: 'Name' }));
      d.appendChild(el('input', { id: 'nkpg-name', type: 'text', autocomplete: 'name', maxlength: '200' }));
      return d;
    })());
    formWrap.appendChild((function () {
      var d = el('div'); d.appendChild(el('label', { for: 'nkpg-phone', text: 'Phone' }));
      d.appendChild(el('input', { id: 'nkpg-phone', type: 'tel', autocomplete: 'tel', maxlength: '40' }));
      return d;
    })());
    formWrap.appendChild((function () {
      var d = el('div', { class: 'nkpg-full' });
      d.appendChild(el('label', { for: 'nkpg-email', text: 'Email' }));
      d.appendChild(el('input', { id: 'nkpg-email', type: 'email', autocomplete: 'email', required: 'required', maxlength: '320' }));
      return d;
    })());
    var submitBtn = el('button', { type: 'submit', class: 'nkpg-btn nkpg-full' });
    submitBtn.textContent = 'Send my preferences';
    formWrap.appendChild(submitBtn);
    var msg = el('div', { class: 'nkpg-msg nkpg-full' });
    formWrap.appendChild(msg);
    wrap.appendChild(formWrap);

    formWrap.addEventListener('submit', function (e) {
      e.preventDefault();
      if (state.submitting) return;
      var email = formWrap.querySelector('#nkpg-email').value.trim();
      var name = formWrap.querySelector('#nkpg-name').value.trim();
      var phone = formWrap.querySelector('#nkpg-phone').value.trim();
      var selected = Object.keys(state.selected).filter(function (k) { return state.selected[k]; });
      msg.textContent = '';
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        msg.textContent = 'Please enter a valid email.'; return;
      }
      if (selected.length === 0) {
        msg.textContent = 'Select at least one preference above.'; return;
      }
      state.submitting = true;
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending\u2026';

      getSupabaseConfig().then(function (cfg) {
        if (!cfg) throw new Error('Configuration unavailable.');
        var source_page = (typeof location !== 'undefined') ? location.pathname : null;
        var prefRow = {
          preferences: selected,
          name: name || null,
          email: email,
          phone: phone || null,
          source_page: source_page
        };
        return postJson(cfg.url, cfg.key, 'lead_preferences', prefRow).then(function () {
          // Mirror into lead_notifications so it flows through existing pipeline.
          var noteRow = {
            channel: 'preferences_widget',
            status: 'received',
            detail: 'Preferences: ' + selected.join(', ') + ' | ' + email + (phone ? ' | ' + phone : '') + ' | ' + (source_page || '')
          };
          return postJson(cfg.url, cfg.key, 'lead_notifications', noteRow).catch(function () { /* non-blocking */ });
        });
      }).then(function () {
        var ok = el('div', { class: 'nkpg-ok' });
        ok.appendChild(el('div', { class: 'nkpg-check', text: '\u2713' }));
        ok.appendChild(el('h4', { text: 'Thank you \u2014 preferences received' }));
        ok.appendChild(el('p', { text: 'Chris and the Nikolaenko team will reach out with matching listings shortly.' }));
        wrap.innerHTML = '';
        wrap.appendChild(ok);
      }).catch(function (err) {
        state.submitting = false;
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send my preferences';
        msg.textContent = 'Sorry \u2014 could not submit. ' + (err && err.message ? err.message : '');
      });
    });

    mount.innerHTML = '';
    mount.appendChild(wrap);
  }

  function init() {
    var mount = document.getElementById(MOUNT_ID);
    if (!mount) return;
    injectStyles();
    render(mount);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
