/*
 * Floating "Feedback" launcher button. Opens /feedback in a new tab.
 * Embed site-wide with: <script src="/shared/feedback-launcher.js" defer></script>
 */
(function () {
  'use strict';
  if (window.__NKPG_FEEDBACK_LAUNCHER__) return;
  window.__NKPG_FEEDBACK_LAUNCHER__ = true;

  var STYLE_ID = 'nkpg-feedback-launcher-style';
  var CSS =
    '.nkpg-fb-launcher{position:fixed;right:20px;bottom:20px;z-index:9998;' +
    'background:linear-gradient(90deg,#f97316,#fb923c);color:#1a1200;' +
    'border:none;border-radius:999px;padding:11px 18px;font-weight:700;' +
    'font-size:.88rem;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;' +
    'cursor:pointer;box-shadow:0 8px 24px rgba(0,0,0,.35);' +
    'display:inline-flex;align-items:center;gap:8px;transition:transform .15s ease,filter .15s ease}' +
    '.nkpg-fb-launcher:hover{filter:brightness(1.08);transform:translateY(-1px)}' +
    '.nkpg-fb-launcher:focus{outline:2px solid #fde047;outline-offset:2px}' +
    '@media (max-width:600px){.nkpg-fb-launcher{right:12px;bottom:12px;padding:10px 14px;font-size:.82rem}}';

  function mount() {
    if (document.querySelector('.nkpg-fb-launcher')) return;
    var s = document.getElementById(STYLE_ID);
    if (!s) {
      s = document.createElement('style');
      s.id = STYLE_ID;
      s.textContent = CSS;
      document.head.appendChild(s);
    }
    var a = document.createElement('a');
    a.className = 'nkpg-fb-launcher';
    a.href = '/feedback/';
    a.target = '_blank';
    a.rel = 'noopener';
    a.setAttribute('aria-label', 'Share site feedback');
    a.innerHTML = '<span aria-hidden="true">\uD83D\uDCAC</span><span>Feedback</span>';
    document.body.appendChild(a);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount);
  } else { mount(); }
})();
