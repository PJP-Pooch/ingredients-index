/* Tiny hash router. Views register with Router.add(name, renderFn, afterFn). Exposes window.Router
   Canonical URLs are plain #names (artifact-safe): #ingredient-blueberries, #hub-calm, #bowl-calm-relaxed, #ask, #scan, #insights.
   Legacy "#/ingredient/blueberries" links still work: they are rewritten to the plain form. */
(function () {
  const views = {};
  const ROUTES = [
    [/^$/, 'home'],
    [/^ingredient-([\w-]+)$/, 'ingredient'],
    [/^hub-([\w-]+)$/, 'hub'],
    [/^bowl-([\w-]+)$/, 'bowl'],
    [/^ask$/, 'ask'],
    [/^scan$/, 'scan'],
    [/^insights$/, 'insights']
  ];

  /* "#/ingredient/apple" -> "ingredient-apple"; "#/" -> "" */
  const toPlain = (h) => h.replace(/^#/, '').replace(/^\//, '').replace(/\//g, '-');

  const placeholder = (title) => `
    <section class="wrap placeholder view-enter">
      ${PM.dog('terrier-digging', '', 180)}
      <h1>${PM.esc(title)}</h1>
      <a class="btn" href="#/">${PM.icon('back')} Back to the Index</a>
    </section>`;

  const FALLBACKS = {
    notfound: () => `
      <section class="wrap placeholder view-enter">
        ${PM.dog('terrier-digging', '', 180)}
        <h1>This page has been buried like a bone</h1>
        <p>We've sniffed everywhere. How about starting from the A–Z?</p>
        <a class="btn" href="#/">${PM.icon('back')} Back to the Index</a>
      </section>`
  };

  function resolve() {
    const name = toPlain(location.hash || '');
    for (const [re, view] of ROUTES) {
      const m = name.match(re);
      if (m) return { name: view, params: m.slice(1), plain: name };
    }
    return { name: 'notfound', params: [], plain: name };
  }

  function render(keepScroll) {
    // Rewrite legacy #/path hashes to the plain form (fires hashchange again)
    if (/^#\//.test(location.hash) && location.hash !== '#/') { location.replace('#' + toPlain(location.hash)); return; }
    const y = window.scrollY;
    const { name, params, plain } = resolve();
    // In-page anchors (e.g. the skip link) are not routes
    if (name === 'notfound' && plain && document.getElementById(plain)) return;
    const view = document.getElementById('view');
    const fn = views[name] || FALLBACKS[name] || FALLBACKS.notfound;
    const html = fn(...params);
    const swap = () => {
      document.body.classList.remove('page--toxic');
      view.innerHTML = html;
      PM.hydrateIcons(view);
      if (fn.after) fn.after(view, ...params);
      window.scrollTo({ top: keepScroll === true ? y : 0, behavior: 'instant' });
      if (keepScroll !== true) view.focus({ preventScroll: true });
    };
    if (document.startViewTransition && !PM.reducedMotion() && view.childElementCount && keepScroll !== true) {
      const t = document.startViewTransition(swap);
      t.ready.catch(() => {}); t.finished.catch(() => {});
    } else swap();

    document.querySelectorAll('.subnav a').forEach((a) => {
      if (toPlain(a.getAttribute('href')) === plain) a.setAttribute('aria-current', 'page');
      else a.removeAttribute('aria-current');
    });
  }

  window.Router = {
    add(name, fn, after) { if (after) fn.after = after; views[name] = fn; },
    go(hash) { location.hash = '#' + toPlain(hash); },
    refresh() { render(true); },
    toPlain,
    start() {
      PM.hydrateIcons();
      if (window.Profile) Profile.sync();
      window.addEventListener('hashchange', () => render());
      render();
    }
  };
})();
