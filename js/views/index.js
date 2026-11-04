/* M1: The Index landing: hero search, curated rails, filters, A–Z list. */
(function () {
  const { esc, icon, verdictPill, recipeBadge, character, VERDICTS } = PM;
  const ALL = () => window.INGREDIENTS.slice().sort((a, b) => a.name.localeCompare(b.name));
  const PLACEHOLDERS = ['blueberries', 'cheese', 'grapes', 'peanut butter', 'that thing he ate in the park', 'sweet potato', 'chocolate'];
  const state = { verdicts: new Set(), benefits: new Set(), recipes: false };

  const thumb = (it, cls = '') =>
    `<div class="art ${cls} ${it.verdict === 'toxic' ? 'art--dog' : ''}" style="--blob:${it.blob}"><img src="img/${esc(it.img)}" alt="" loading="lazy" decoding="async"></div>`;

  const benefitDots = (it) => it.benefits.map((b) =>
    `<span class="bdot" style="--dot:${BENEFITS[b].color}" title="${esc(BENEFITS[b].label)}"></span>`).join('');

  const card = (it) => `
    <a class="card ix-card ${it.verdict === 'toxic' ? 'ix-card--toxic' : ''}" href="#/ingredient/${it.slug}">
      ${thumb(it)}
      <div class="ix-card__body">
        <h3>${esc(it.name)}</h3>
        <div class="ix-card__meta">${verdictPill(it.verdict, true)}${it.inRecipes ? recipeBadge() : ''}</div>
        <p>${esc(it.summary)}</p>
        ${it.benefits.length ? `<div class="ix-card__benefits">${benefitDots(it)}<span>${it.benefits.map((b) => esc(BENEFITS[b].label)).join(' · ')}</span></div>` : ''}
      </div>
    </a>`;

  const railCard = (it) => `
    <a class="rail-card ${it.verdict === 'toxic' ? 'rail-card--toxic' : ''}" href="#/ingredient/${it.slug}">
      ${thumb(it, 'art--sm')}
      <strong>${esc(it.name)}</strong>
      ${verdictPill(it.verdict, true)}
    </a>`;

  const rail = (title, sub, items, mod = '') => `
    <section class="rail ${mod}">
      <div class="rail__head"><h2>${title}</h2><p>${sub}</p></div>
      <div class="rail__track">${items.map(railCard).join('')}</div>
    </section>`;

  const chip = (group, value, label, dot, count) =>
    `<button class="chip" data-group="${group}" data-value="${value}" aria-pressed="false">${dot ? `<span class="dot" style="--dot:${dot}"></span>` : ''}${esc(label)}<span class="chip__count">${count}</span></button>`;

  function render() {
    document.title = 'The Ingredient Index · Pooch & Mutt';
    const prof = Profile.get();
    const items = ALL();
    const count = (fn) => items.filter(fn).length;
    const popular = items.slice().sort((a, b) => b.pop - a.pop);
    return `
    <section class="ix-hero">
      <img class="ix-hero__deco ix-hero__deco--star" src="img/deco/star-1.png" alt="">
      <div class="wrap ix-hero__grid">
        <div class="ix-hero__copy view-enter">
          <span class="tab">The Ingredient Index</span>
          <h1>Can ${prof ? `<span class="ix-hero__name">${esc(prof.name)}</span>` : 'my dog'} eat <span class="ix-hero__that">that?</span></h1>
          <p class="ix-hero__lede">Straight answers on everyday foods <span class="amp">&amp;</span> every ingredient in our recipes, with the why behind each one.</p>
          <div class="ix-search" role="search">
            <span class="ix-search__icon">${icon('search')}</span>
            <label class="visually-hidden" for="ix-q">Search ingredients</label>
            <input id="ix-q" type="search" role="combobox" aria-expanded="false" aria-controls="ix-suggest" aria-autocomplete="list"
              autocomplete="off" spellcheck="false" placeholder="Try ‘blueberries’" enterkeyhint="go">
            <ul id="ix-suggest" class="ix-suggest" role="listbox" aria-label="Suggestions" hidden></ul>
          </div>
          <p class="ix-hero__hint">Popular right now:
            ${popular.slice(0, 4).map((i) => `<a href="#/ingredient/${i.slug}">${esc(i.name.split(' (')[0])}</a>`).join('')}
          </p>
          ${prof
            ? `<p class="ix-meet ix-meet--set"><img src="img/dogs/${Profile.sizeOf(prof).dog}.svg" alt=""><span>Portions sized for <strong>${esc(prof.name)}</strong> (${Profile.sizeOf(prof).label.toLowerCase()}${prof.stage !== 'adult' ? ', ' + prof.stage : ''})</span><button class="linkish" data-meet>Edit</button></p>`
            : `<button class="ix-meet" data-meet><span class="ix-meet__dogs"><img src="img/dogs/chihuahua.svg" alt=""><img src="img/dogs/cockapoo.svg" alt=""><img src="img/dogs/bernese.svg" alt=""></span><span><strong>Make it about your dog</strong><small>Add their name & size for personal portions</small></span>${icon('arrow')}</button>`}
        </div>
        <div class="ix-hero__char" aria-hidden="true">
          <video class="ix-hero__logo" autoplay muted playsinline loop poster="img/logo/master-logo-navy.png">
            <source src="img/logo/master-navy.mp4" type='video/mp4; codecs="hvc1"'>
            <source src="img/logo/master-navy.webm" type="video/webm">
          </video>
        </div>
      </div>
    </section>

    ${PM.store.get('season') === 'xmas' ? `
    <section class="wrap festive" aria-label="Festive season">
      <img class="festive__star" src="img/deco/star-2.png" alt="">
      <div>
        <p class="eyebrow">Festive season</p>
        <h2>’Tis the season to be careful</h2>
        <p>Mince pies, chocolate and gravy are all on the naughty list. A little plain turkey and carrot? Very nice indeed.</p>
      </div>
      <div class="festive__links">
        <a class="btn btn--sun" href="#/hub/toxic-foods">Get the Fridge List</a>
        <a class="btn btn--ghost festive__ghost" href="#/ingredient/turkey">Christmas turkey</a>
      </div>
    </section>` : ''}

    <div class="wrap ix-rails">
      ${rail('Most sniffed out', 'What owners are asking about this month.', popular.slice(0, 8))}
      ${rail('Don’t feed: the toxic list', 'The ones to keep well out of paw’s reach.', items.filter((i) => i.verdict === 'toxic'), 'rail--toxic')}
      ${rail('What’s in our food', 'Every ingredient in our recipes, and why it’s there.', items.filter((i) => i.inRecipes))}
    </div>

    <section class="wrap ix-browse" id="browse" aria-labelledby="browse-title">
      <div class="ix-browse__head">
        <h2 id="browse-title">Browse <span class="amp">A–Z</span></h2>
        <button class="ix-clear" type="button" hidden>Clear filters</button>
      </div>
      <div class="ix-filters">
        <div class="chip-row" role="group" aria-label="Filter by verdict">
          ${Object.keys(VERDICTS).map((v) => chip('verdicts', v, VERDICTS[v].short, `var(--v-${v === 'moderation' ? 'mod' : v})`, count((i) => i.verdict === v))).join('')}
          ${chip('recipes', '1', 'In our recipes', null, count((i) => i.inRecipes))}
        </div>
        <div class="chip-row" role="group" aria-label="Filter by benefit">
          ${Object.entries(BENEFITS).map(([k, b]) => chip('benefits', k, b.label, b.color, count((i) => i.benefits.includes(k)))).join('')}
        </div>
      </div>
      <nav class="az" aria-label="Jump to letter"></nav>
      <p class="ix-count" aria-live="polite"></p>
      <div id="ix-list" class="ix-list"></div>
    </section>

    <aside class="trial-bar" aria-label="Trial offer">
      <p><strong>Feed what’s good, every day.</strong> <span>Try 14 days for £14.</span></p>
      <a class="btn btn--sun" href="https://www.poochandmutt.co.uk/" target="_blank" rel="noopener">Start trial</a>
      <button class="icon-btn trial-bar__close" type="button" aria-label="Dismiss offer">${icon('close')}</button>
    </aside>`;
  }

  /* ---------- Behaviour ---------- */
  function after(root) {
    Search.build(window.INGREDIENTS);
    const input = root.querySelector('#ix-q');
    const list = root.querySelector('#ix-suggest');
    let active = -1, results = [], missTimer;

    // Only explain the match when the alias isn't just a spelling of the name (e.g. "garlic" -> Onion)
    const showVia = (r) => r.via && !Search.norm(r.item.name).split(' ').some((w) => w.startsWith(r.via.slice(0, 3)));
    const suggestionHTML = (r, i) => `
      <li role="option" id="sug-${i}" aria-selected="false" data-slug="${r.item.slug}">
        ${thumb(r.item, 'art--xs')}
        <span class="ix-suggest__name">${esc(r.item.name)}${showVia(r) ? `<small>includes “${esc(r.via)}”</small>` : ''}</span>
        ${verdictPill(r.item.verdict, true)}
      </li>`;

    function showSuggestions() {
      const q = input.value;
      clearTimeout(missTimer);
      if (!q.trim()) { close(); return; }
      results = Search.query(q, 6);
      active = results.length ? 0 : -1;
      list.innerHTML = results.length
        ? results.map(suggestionHTML).join('')
        : `<li class="ix-suggest__empty" role="option" aria-disabled="true">
             <img src="img/dogs/terrier-digging.svg" alt="" width="64">
             <span><strong>Nothing’s buried here yet.</strong> We’ve told our vets you asked about “${esc(q.trim())}”.</span>
           </li>`;
      if (!results.length) missTimer = setTimeout(() => Search.logMiss(q), 900);
      list.hidden = false;
      input.setAttribute('aria-expanded', 'true');
      highlight();
    }
    function highlight() {
      list.querySelectorAll('[role=option][data-slug]').forEach((li, i) => li.setAttribute('aria-selected', String(i === active)));
      if (active >= 0) input.setAttribute('aria-activedescendant', 'sug-' + active); else input.removeAttribute('aria-activedescendant');
    }
    function close() { list.hidden = true; input.setAttribute('aria-expanded', 'false'); input.removeAttribute('aria-activedescendant'); }
    const go = (slug) => { close(); Router.go('ingredient-' + slug); };

    input.addEventListener('input', showSuggestions);
    input.addEventListener('focus', () => { document.body.classList.add('is-searching'); if (input.value) showSuggestions(); });
    input.addEventListener('blur', () => setTimeout(() => { document.body.classList.remove('is-searching'); close(); }, 150));
    input.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown' && results.length) { active = (active + 1) % results.length; highlight(); e.preventDefault(); }
      else if (e.key === 'ArrowUp' && results.length) { active = (active - 1 + results.length) % results.length; highlight(); e.preventDefault(); }
      else if (e.key === 'Enter') { if (results[active]) go(results[active].item.slug); else if (input.value.trim()) Search.logMiss(input.value); }
      else if (e.key === 'Escape') { close(); }
    });
    list.addEventListener('mousedown', (e) => { const li = e.target.closest('[data-slug]'); if (li) { e.preventDefault(); go(li.dataset.slug); } });

    // Cycling placeholder (pauses while focused or filled)
    let p = 0;
    const cycle = setInterval(() => {
      if (!input.isConnected) return clearInterval(cycle);
      if (document.activeElement === input || input.value) return;
      p = (p + 1) % PLACEHOLDERS.length;
      input.placeholder = `Try ‘${PLACEHOLDERS[p]}’`;
    }, 2600);

    // Filters
    root.querySelectorAll('.ix-filters .chip').forEach((btn) => btn.addEventListener('click', () => {
      const { group, value } = btn.dataset;
      if (group === 'recipes') state.recipes = !state.recipes;
      else state[group].has(value) ? state[group].delete(value) : state[group].add(value);
      renderList(root);
    }));
    root.querySelector('.ix-clear').addEventListener('click', () => {
      state.verdicts.clear(); state.benefits.clear(); state.recipes = false; renderList(root);
    });

    // Trial bar
    const bar = root.querySelector('.trial-bar');
    let dismissed = false;
    try { dismissed = sessionStorage.getItem('pm:trial-dismissed') === '1'; } catch (e) { /* ignore */ }
    if (dismissed) bar.remove();
    else root.querySelector('.trial-bar__close').addEventListener('click', () => {
      bar.classList.add('is-leaving');
      try { sessionStorage.setItem('pm:trial-dismissed', '1'); } catch (e) { /* ignore */ }
      setTimeout(() => bar.remove(), 300);
    });

    root.querySelectorAll('[data-meet]').forEach((b) => b.addEventListener('click', () => Profile.open()));
    const logo = root.querySelector('.ix-hero__logo');
    if (logo && PM.reducedMotion()) { logo.removeAttribute('autoplay'); logo.loop = false; logo.pause(); }

    syncHeaderHeight();
    renderList(root);
    if (window.__focusSearch) { window.__focusSearch = false; input.focus(); }
  }

  // Header search icon: jump to (and focus) the Index search from anywhere
  document.addEventListener('click', (e) => {
    const link = e.target.closest('.site-header [aria-label="Search ingredients"]');
    if (!link) return;
    e.preventDefault();
    const input = document.getElementById('ix-q');
    if (input) { input.scrollIntoView({ block: 'center' }); input.focus(); }
    else { window.__focusSearch = true; Router.go(''); }
  });

  function renderList(root) {
    const items = ALL().filter((i) =>
      (!state.verdicts.size || state.verdicts.has(i.verdict)) &&
      (!state.benefits.size || i.benefits.some((b) => state.benefits.has(b))) &&
      (!state.recipes || i.inRecipes));

    root.querySelectorAll('.ix-filters .chip').forEach((btn) => {
      const { group, value } = btn.dataset;
      btn.setAttribute('aria-pressed', String(group === 'recipes' ? state.recipes : state[group].has(value)));
    });
    const filtered = state.verdicts.size || state.benefits.size || state.recipes;
    root.querySelector('.ix-clear').hidden = !filtered;
    root.querySelector('.ix-count').textContent = filtered
      ? `Showing ${items.length} of ${window.INGREDIENTS.length} ingredients`
      : `${items.length} ingredients, with more being dug up every week`;

    const groups = {};
    items.forEach((i) => (groups[i.name[0].toUpperCase()] ||= []).push(i));
    root.querySelector('.az').innerHTML = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map((l) =>
      groups[l] ? `<a href="#az-${l}" data-letter="${l}">${l}</a>` : `<span aria-disabled="true">${l}</span>`).join('');
    root.querySelectorAll('.az a').forEach((a) => a.addEventListener('click', (e) => {
      e.preventDefault();
      document.getElementById('az-' + a.dataset.letter).scrollIntoView({ behavior: PM.reducedMotion() ? 'auto' : 'smooth', block: 'start' });
    }));

    root.querySelector('#ix-list').innerHTML = items.length
      ? Object.keys(groups).sort().map((l) => `
          <div class="ix-group" id="az-${l}">
            <h3 class="ix-group__letter" aria-label="Letter ${l}">${l}</h3>
            <div class="ix-grid">${groups[l].map(card).join('')}</div>
          </div>`).join('')
      : `<div class="ix-empty"><img src="img/dogs/terrier-digging.svg" alt="" width="140">
           <p><strong>No ingredients match all of those.</strong> How about loosening a filter?</p></div>`;
  }

  function syncHeaderHeight() {
    const h = document.querySelector('.site-header').offsetHeight;
    document.documentElement.style.setProperty('--header-h', h + 'px');
  }
  window.addEventListener('resize', syncHeaderHeight);

  window.IndexCard = card;
  Router.add('home', render, after);
})();
