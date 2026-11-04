/* Shared helpers, icons and small render components. Classic script: exposes window.PM */
(function () {
  const stroke = 'fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"';
  const ICONS = {
    menu: `<svg viewBox="0 0 24 24" ${stroke}><path d="M4 7h16M4 12h16M4 17h10"/></svg>`,
    search: `<svg viewBox="0 0 24 24" ${stroke}><circle cx="11" cy="11" r="6.5"/><path d="m20 20-4.2-4.2"/></svg>`,
    basket: `<svg viewBox="0 0 24 24" ${stroke}><path d="M5 9h14l-1.4 9.2a2 2 0 0 1-2 1.8H8.4a2 2 0 0 1-2-1.8z"/><path d="M9 9V7a3 3 0 0 1 6 0v2"/></svg>`,
    arrow: `<svg viewBox="0 0 24 24" ${stroke}><path d="M5 12h14M13 6l6 6-6 6"/></svg>`,
    back: `<svg viewBox="0 0 24 24" ${stroke}><path d="M19 12H5M11 6l-6 6 6 6"/></svg>`,
    close: `<svg viewBox="0 0 24 24" ${stroke}><path d="M6 6l12 12M18 6 6 18"/></svg>`,
    paw: `<svg viewBox="0 0 24 24" fill="currentColor"><ellipse cx="6.5" cy="10" rx="2" ry="2.6"/><ellipse cx="10" cy="6.2" rx="2" ry="2.6"/><ellipse cx="14.2" cy="6.2" rx="2" ry="2.6"/><ellipse cx="17.6" cy="10" rx="2" ry="2.6"/><path d="M12 11.5c-3 0-6 3.6-6 6.1 0 1.6 1.3 2.4 2.8 2.4 1.3 0 2.1-.7 3.2-.7s1.9.7 3.2.7c1.5 0 2.8-.8 2.8-2.4 0-2.5-3-6.1-6-6.1z"/></svg>`,
    phone: `<svg viewBox="0 0 24 24" ${stroke}><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/></svg>`,
    share: `<svg viewBox="0 0 24 24" ${stroke}><path d="M12 15V3M8 7l4-4 4 4"/><path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7"/></svg>`,
    camera: `<svg viewBox="0 0 24 24" ${stroke}><path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/></svg>`,
    sparkle: `<svg viewBox="0 0 24 24" ${stroke}><path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18"/></svg>`,
    /* Verdict icons */
    safe: `<svg viewBox="0 0 24 24" ${stroke}><circle cx="12" cy="12" r="9" fill="#fff" stroke="none" opacity=".55"/><circle cx="12" cy="12" r="9"/><path d="m8 12.5 2.6 2.6L16.5 9"/></svg>`,
    moderation: `<svg viewBox="0 0 24 24" ${stroke}><circle cx="12" cy="12" r="9" fill="#fff" stroke="none" opacity=".55"/><circle cx="12" cy="12" r="9"/><path d="M12 3a9 9 0 0 1 0 18z" fill="currentColor"/></svg>`,
    caution: `<svg viewBox="0 0 24 24" ${stroke}><path d="M12 3.5 21.5 20h-19z" fill="#fff" fill-opacity=".55"/><path d="M12 10v4.5M12 17.5v.01"/></svg>`,
    toxic: `<svg viewBox="0 0 24 24" ${stroke}><circle cx="12" cy="12" r="9"/><path d="m9 9 6 6M15 9l-6 6"/></svg>`
  };

  const VERDICTS = {
    safe: { label: 'Safe to share', short: 'Safe' },
    moderation: { label: 'Safe in small amounts', short: 'Small amounts' },
    caution: { label: 'Only with care', short: 'With care' },
    toxic: { label: "Don't feed", short: "Don't feed" }
  };

  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  const icon = (name) => ICONS[name] || '';

  const verdictPill = (v, short) =>
    `<span class="verdict verdict--${v}">${icon(v)}${esc(short ? VERDICTS[v].short : VERDICTS[v].label)}</span>`;

  const recipeBadge = () => `<span class="badge-recipe">${icon('paw')}In our recipes</span>`;

  const art = (file, blob = 'var(--b-digestion)', alt = '') =>
    `<div class="art" style="--blob:${blob}"><img src="img/ingredients/${esc(file)}" alt="${esc(alt)}" loading="lazy" decoding="async"></div>`;

  const dog = (slug, alt = '', w = 160) =>
    `<img src="img/dogs/${esc(slug)}.svg" alt="${esc(alt)}" width="${w}" loading="lazy">`;

  /* Animated character: HEVC-with-alpha only renders correctly in Safari, so use a static SVG elsewhere */
  const isSafari = /Apple/.test(navigator.vendor || '') && !/CriOS|FxiOS|EdgiOS/.test(navigator.userAgent);
  const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const character = (video, fallbackDog, alt = '') =>
    isSafari && !reducedMotion()
      ? `<video class="character" src="img/media/${esc(video)}.mp4" autoplay muted loop playsinline aria-label="${esc(alt)}"></video>`
      : `<img class="character" src="img/dogs/${esc(fallbackDog)}.svg" alt="${esc(alt)}">`;

  const store = {
    get(k, d = null) { try { const v = localStorage.getItem('pm:' + k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem('pm:' + k, JSON.stringify(v)); } catch (e) { /* storage unavailable */ } }
  };

  /* Fill any [data-icon] placeholders in static markup */
  const hydrateIcons = (root = document) =>
    root.querySelectorAll('[data-icon]').forEach((el) => { if (!el.innerHTML.trim()) el.innerHTML = icon(el.dataset.icon); });

  window.PM = { ICONS, VERDICTS, esc, icon, verdictPill, recipeBadge, art, dog, character, isSafari, reducedMotion, store, hydrateIcons };
})();
