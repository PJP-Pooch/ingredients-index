/* M6: demo mode (?demo=1), reset (?reset=1), menu drawer and festive mode. Runs before Router.start(). */
(function () {
  const { icon, store } = PM;
  const BISCUIT = { name: 'Biscuit', size: 'medium', stage: 'adult' };
  const clearAll = () => {
    try { Object.keys(localStorage).filter((k) => k.startsWith('pm:')).forEach((k) => localStorage.removeItem(k)); } catch (e) { /* ignore */ }
    try { sessionStorage.clear(); } catch (e) { /* ignore */ }
  };

  function startDemo() {
    clearAll();
    store.set('profile', BISCUIT);
    store.set('size', BISCUIT.size);
    try { sessionStorage.setItem('pm:demo', '1'); } catch (e) { /* ignore */ }
  }
  // Entry points: #demo / #reset (work in the published viewer) or ?demo=1 / ?reset=1 (local file)
  const params = new URLSearchParams(location.search);
  if (params.has('reset') || location.hash === '#reset') clearAll();
  if (params.get('demo') === '1' || location.hash === '#demo') startDemo();
  if (location.hash === '#demo' || location.hash === '#reset') history.replaceState(null, '', location.pathname + location.search);
  window.addEventListener('hashchange', () => {
    if (location.hash === '#demo' || location.hash === '#reset') {
      location.hash === '#demo' ? startDemo() : clearAll();
      history.replaceState(null, '', location.pathname + location.search);
      location.reload();
    }
  });
  let demo = false;
  try { demo = sessionStorage.getItem('pm:demo') === '1'; } catch (e) { /* ignore */ }

  /* ---------- Menu drawer ---------- */
  const LINKS = [
    ['#/', 'The A–Z Index'], ['#/hub/toxic-foods', 'Don’t feed: the Fridge List'], ['#/hub/calm', 'Ingredients for calm'],
    ['#/hub/digestion', 'Ingredients for digestion'], ['#/bowl/calm-relaxed', 'Inside the Bowl'],
    ['#/ask', 'Ask the Index'], ['#/scan', 'Snap a Label'], ['#/insights', 'Behind the scenes']
  ];
  const drawer = document.createElement('nav');
  drawer.className = 'drawer';
  drawer.setAttribute('aria-label', 'Menu');
  drawer.hidden = true;
  drawer.innerHTML = `
    <div class="drawer__panel">
      <ul>${LINKS.map(([h, l]) => `<li><a href="${h}">${l} ${icon('arrow')}</a></li>`).join('')}</ul>
      <button class="btn btn--sun drawer__dog" type="button">${icon('paw')} Your dog</button>
      <a class="drawer__shop" href="${window.SHOP_URL}" target="_blank" rel="noopener">Shop Pooch &amp; Mutt</a>
    </div>`;
  document.body.appendChild(drawer);
  const menuBtn = document.querySelector('.site-header [aria-label="Menu"]');
  const setMenu = (open) => {
    drawer.hidden = !open;
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.innerHTML = icon(open ? 'close' : 'menu');
    document.body.classList.toggle('menu-open', open);
    if (open) drawer.querySelector('a').focus();
  };
  menuBtn.setAttribute('aria-expanded', 'false');
  menuBtn.addEventListener('click', () => setMenu(drawer.hidden));
  drawer.addEventListener('click', (e) => { if (e.target === drawer || e.target.closest('a')) setMenu(false); });
  drawer.querySelector('.drawer__dog').addEventListener('click', () => { setMenu(false); Profile.open(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !drawer.hidden) setMenu(false); });

  // Basket goes to the shop
  const basket = document.querySelector('.site-header [aria-label="Basket"]');
  if (basket) { basket.href = window.SHOP_URL; basket.target = '_blank'; basket.rel = 'noopener'; }

  /* ---------- Demo panel (presenter only) ---------- */
  if (demo) {
    const STEPS = [['#/', 'The Index'], ['#/ingredient/blueberries', 'Blueberries'], ['#/ingredient/grapes', 'Grapes (toxic)'],
      ['#/bowl/calm-relaxed', 'Inside the Bowl'], ['#/ask', 'Ask the Index'], ['#/scan', 'Snap a Label'], ['#/insights', 'Behind the scenes']];
    const panel = document.createElement('div');
    panel.className = 'demo';
    panel.innerHTML = `
      <button class="demo__toggle" type="button" aria-expanded="false">Demo</button>
      <div class="demo__panel" hidden>
        <p class="demo__title">Presenter controls</p>
        <ol>${STEPS.map(([h, l], i) => `<li><a href="${h}"><b>${i + 1}</b> ${l}</a></li>`).join('')}</ol>
        <label class="demo__switch"><input type="checkbox" ${store.get('season') === 'xmas' ? 'checked' : ''}> Festive mode</label>
        <button class="demo__reset" type="button">Reset demo (Biscuit)</button>
        <button class="demo__clear" type="button">Start as a new visitor</button>
      </div>`;
    document.body.appendChild(panel);
    const toggle = panel.querySelector('.demo__toggle'), box = panel.querySelector('.demo__panel');
    toggle.addEventListener('click', () => { box.hidden = !box.hidden; toggle.setAttribute('aria-expanded', String(!box.hidden)); });
    panel.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => { box.hidden = true; }));
    panel.querySelector('input').addEventListener('change', (e) => { store.set('season', e.target.checked ? 'xmas' : null); Router.refresh(); });
    const reloadHome = () => { history.replaceState(null, '', location.pathname + location.search); location.reload(); };
    panel.querySelector('.demo__reset').addEventListener('click', () => { startDemo(); reloadHome(); });
    panel.querySelector('.demo__clear').addEventListener('click', () => {
      clearAll(); try { sessionStorage.setItem('pm:demo', '1'); } catch (e) { /* ignore */ }
      reloadHome();
    });
  }
})();
