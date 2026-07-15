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

  // Luxury espresso + antique gold palette, matches SunPath IQ + Feng Shui IQ
  var CSS = [
    '#nkpg-preferences *,#nkpg-preferences *::before,#nkpg-preferences *::after{box-sizing:border-box}',
    '.nkpg-pref{font-family:Inter,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;color:#f5f0ea;background:linear-gradient(180deg,rgba(28,24,20,0.92) 0%,rgba(15,13,10,0.94) 100%);border:1px solid rgba(184,134,11,0.32);border-radius:16px;padding:28px;max-width:860px;margin:32px auto;box-shadow:0 30px 80px -30px rgba(0,0,0,.7)}',
    '.nkpg-pref h3{margin:0 0 6px;font-family:"Playfair Display",Georgia,serif;font-size:1.6rem;font-weight:600;background:linear-gradient(90deg,#e8c684,#b8860b 55%,#d4a94a);-webkit-background-clip:text;background-clip:text;color:transparent;letter-spacing:.5px}',
    '.nkpg-pref .nkpg-sub{margin:0 0 20px;color:#c9bfae;font-size:.95rem;letter-spacing:.02em}',
    '.nkpg-chips{display:flex;flex-wrap:wrap;gap:10px;margin-bottom:18px}',
    '.nkpg-chip{cursor:pointer;padding:9px 16px;border-radius:999px;border:1px solid rgba(184,134,11,0.35);background:rgba(20,17,13,0.65);color:#f5f0ea;font-size:.88rem;font-weight:500;transition:all .2s ease;user-select:none;font-family:inherit}',
    '.nkpg-chip:hover{border-color:#e8c684;color:#e8c684;transform:translateY(-1px)}',
    '.nkpg-chip.nkpg-on{background:linear-gradient(90deg,#b8860b,#d4a94a);border-color:#e8c684;color:#14110d;font-weight:700}',
    '.nkpg-tools{display:flex;flex-wrap:wrap;gap:10px;margin-bottom:18px;min-height:0}',
    '.nkpg-tool{display:inline-flex;align-items:center;gap:6px;padding:9px 16px;border-radius:8px;background:rgba(184,134,11,0.12);border:1px solid rgba(184,134,11,0.45);color:#e8c684;font-size:.85rem;text-decoration:none;font-weight:600;letter-spacing:.02em}',
    '.nkpg-tool:hover{background:rgba(184,134,11,0.22);color:#f5e4b6}',
    '.nkpg-cta{display:flex;flex-wrap:wrap;gap:12px;align-items:center;justify-content:space-between;border-top:1px solid rgba(184,134,11,0.18);padding-top:18px}',
    '.nkpg-cta p{margin:0;color:#c9bfae;font-size:.9rem}',
    '.nkpg-btn{background:linear-gradient(90deg,#b8860b,#d4a94a);color:#14110d;border:none;border-radius:10px;padding:11px 20px;font-weight:700;font-size:.9rem;cursor:pointer;letter-spacing:.03em;font-family:inherit;transition:filter .2s ease,transform .2s ease}',
    '.nkpg-btn:hover{filter:brightness(1.08);transform:translateY(-1px)}',
    '.nkpg-btn:disabled{opacity:.5;cursor:not-allowed;transform:none}',
    '.nkpg-btn.nkpg-ghost{background:transparent;color:#c9bfae;border:1px solid rgba(184,134,11,0.35)}',
    '.nkpg-form{margin-top:18px;display:grid;grid-template-columns:1fr 1fr;gap:12px}',
    '.nkpg-form label{display:block;font-size:.78rem;color:#c9bfae;margin-bottom:5px;letter-spacing:.05em;text-transform:uppercase}',
    '.nkpg-form .nkpg-full{grid-column:1 / -1}',
    '.nkpg-form input{width:100%;padding:11px 13px;border-radius:8px;border:1px solid rgba(184,134,11,0.30);background:rgba(15,13,10,0.75);color:#f5f0ea;font-size:.92rem;font-family:inherit}',
    '.nkpg-form input:focus{outline:none;border-color:#e8c684;box-shadow:0 0 0 3px rgba(184,134,11,0.18)}',
    '.nkpg-msg{font-size:.82rem;margin-top:10px;color:#f0a0a0}',
    '.nkpg-ok{padding:24px;text-align:center}',
    '.nkpg-ok .nkpg-check{font-size:2.4rem;color:#e8c684;margin-bottom:6px}',
    '.nkpg-ok h4{margin:0 0 6px;color:#e8c684;font-family:"Playfair Display",Georgia,serif;font-size:1.35rem;font-weight:600}',
    '.nkpg-ok p{margin:0;color:#c9bfae;font-size:.95rem}',
    '@media (max-width:600px){.nkpg-form{grid-template-columns:1fr}.nkpg-pref{padding:22px;margin:20px 12px}.nkpg-pref h3{font-size:1.35rem}}'
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
        try { if (err) console.error('[preferences-widget] submit failed:', err); } catch (e) {}
        msg.textContent = 'Sorry \u2014 we could not submit your preferences. Please try again in a moment.';
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
