/* M2: Ingredient page. Safe / moderation / caution share a template; toxic gets a calm, no-sell variant. */
(function () {
  const { esc, icon, verdictPill, recipeBadge, VERDICTS } = PM;
  const bySlug = (s) => window.INGREDIENTS.find((i) => i.slug === s);
  const plainName = (it) => it.name.replace(/\s*\(.*\)$/, '');
  const title = (it) => it.category === 'functional' ? `${plainName(it)} for Dogs` : `Can Dogs Eat ${plainName(it)}?`;
  const sizeKey = () => PM.store.get('size', 'medium');

  const art = (it, cls = '') =>
    `<div class="art ${cls} ${it.verdict === 'toxic' ? 'art--dog' : ''}" style="--blob:${it.blob}"><img src="img/${esc(it.img)}" alt="" decoding="async"></div>`;

  const list = (items, ic) => `<ul class="ig-list">${items.map((t) => `<li><span class="ig-list__icon">${icon(ic)}</span>${esc(t)}</li>`).join('')}</ul>`;

  const crumbs = (it) => `
    <nav class="ig-crumbs wrap" aria-label="Breadcrumb">
      <a href="#/">${icon('back')} Ingredient Index</a><span aria-hidden="true">/</span><span>${esc(CATEGORIES[it.category])}</span>
    </nav>${Delight.trailHTML(it.slug)}`;

  const faqs = (it) => it.faqs && it.faqs.length ? `
    <section class="ig-section wrap" id="faqs" aria-labelledby="faqs-t">
      <h2 id="faqs-t">Common questions</h2>
      <div class="ig-faqs">${it.faqs.map(([q, a]) => `<details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join('')}</div>
    </section>` : '';

  const relatedCards = (slugs, heading, sub) => {
    const items = (slugs || []).map(bySlug).filter(Boolean);
    if (!items.length) return '';
    return `
    <section class="ig-section wrap ig-related" aria-labelledby="rel-t">
      <h2 id="rel-t">${heading}</h2>${sub ? `<p class="ig-sub">${sub}</p>` : ''}
      <div class="ig-related__grid">${items.map((r) => `
        <a class="card ig-related__card" href="#/ingredient/${r.slug}">
          ${art(r, 'art--sm')}<strong>${esc(r.name)}</strong>${verdictPill(r.verdict, true)}
        </a>`).join('')}</div>
    </section>`;
  };

  const review = () => `
    <aside class="ig-review wrap" aria-label="Review status">
      <div class="flash">Awaiting<br>vet<br>review</div>
      <p><strong>Prototype content.</strong> Drafted 04/11/2026 from general veterinary guidance for demonstration. In the live Index every page is reviewed and signed off by our vets, with sources listed here.</p>
    </aside>`;

  const productCard = (key) => {
    const p = PRODUCTS[key];
    if (!p) return '';
    return `
      <article class="ig-product" style="--label:${p.labelColor}">
        <div class="ig-product__img"><img src="img/${esc(p.img)}" alt="${esc(p.name)} pack" loading="lazy"></div>
        <div class="ig-product__body">
          <span class="tab" style="--tab-bg:${p.rangeColor}">${esc(p.range)}</span>
          <h3>${esc(p.name)}</h3>
          <p>${esc(p.line)}</p>
          <ul class="ig-product__claims">${p.claims.map((c) => `<li>${esc(c)}</li>`).join('')}</ul>
          <div class="ig-product__ctas">
            <a class="btn btn--sun" href="${SHOP_URL}" target="_blank" rel="noopener">Try 14 days for £14</a>
            <a class="btn btn--ghost" href="${SHOP_URL}" target="_blank" rel="noopener">View product</a>
          </div>
        </div>
      </article>`;
  };

  const STAGE_TIPS = {
    puppy: ['Puppy tip', 'Young tums are still learning. How about introducing new foods one at a time, in tiny amounts?'],
    senior: ['Senior tip', 'Older dogs can be more sensitive. Start small, and check with your vet if they have any health conditions.']
  };
  const noteFor = (s, p) => `${p ? `For ${esc(p.name)}, a ${s.label.toLowerCase()} dog` : `For a ${s.label.toLowerCase()} dog`} (${s.range}). Treats should stay under 10% of daily calories, so trim their main meal on treat-heavy days.`;

  function portionBlock(it) {
    if (!it.portion) return '';
    const sizes = DOG_SIZES;
    const p = Profile.get();
    const cur = sizes.find((s) => s.key === sizeKey()) || sizes[2];
    const tip = p && STAGE_TIPS[p.stage];
    return `
    <section class="ig-section wrap" id="how-much" aria-labelledby="hm-t">
      <h2 id="hm-t">How much${p ? ` for ${esc(p.name)}` : ''}?</h2>
      <p class="ig-sub">A rough daily treat guide. ${p ? `We’ve picked ${esc(p.name)}’s size, but you can try others:` : `Pick your dog’s size, or <button class="linkish" data-meet>tell us about your dog</button>:`}</p>
      <div class="ig-portion">
        <div class="ig-sizes" role="radiogroup" aria-label="Dog size">
          ${sizes.map((s) => `
            <button class="ig-size" role="radio" aria-checked="${s.key === cur.key}" data-size="${s.key}">
              <img src="img/dogs/${s.dog}.svg" alt="" loading="lazy"><span>${s.label}</span><small>${s.range}</small>
            </button>`).join('')}
        </div>
        <div class="ig-portion__result">
          <div class="ig-portion__vis">${Delight.visualiser(it, sizes.indexOf(cur), p && p.size === cur.key ? p : null)}</div>
          <div class="ig-portion__figures" aria-live="polite">
            <span class="ig-portion__amount">${esc(it.portion.amounts[sizes.indexOf(cur)])}</span>
            <span class="ig-portion__unit">${esc(it.portion.unit)} a day</span>
            <p class="ig-portion__note">${noteFor(cur, p && p.size === cur.key ? p : null)}</p>
          </div>
        </div>
        ${tip ? `<p class="ig-portion__tip"><strong>${tip[0]}:</strong> ${tip[1]}</p>` : ''}
      </div>
    </section>`;
  }

  /* ---------- Safe / moderation / caution ---------- */
  function standard(it) {
    const jumps = [['why-good', 'Benefits', it.good], ['how-much', 'How much?', it.portion], ['prep', 'Prep & watch-outs', true],
      ['in-our-food', 'In our food', it.inRecipes && it.recipe], ['faqs', 'FAQs', it.faqs && it.faqs.length]].filter((j) => j[2]);
    return `
    <article class="ig ig--${it.verdict}">
      ${crumbs(it)}
      <header class="ig-hero wrap">
        <div class="ig-hero__art">${art(it)}</div>
        <div class="ig-hero__copy">
          <div class="ig-hero__tags">${it.inRecipes ? recipeBadge() : ''}<span class="ig-hero__cat">${esc(CATEGORIES[it.category])}</span></div>
          <h1>${esc(title(it))}</h1>
          <div class="ig-answer ig-answer--${it.verdict}">
            ${Delight.reactor(it.verdict)}
            <div class="ig-answer__verdict">${verdictPill(it.verdict)}${Profile.get() ? `<span class="ig-answer__for">for ${esc(Profile.get().name)}</span>` : ''}</div>
            <p class="ig-answer__label">Quick answer</p>
            <p class="ig-answer__text">${esc(it.qa)}</p>
            ${it.benefits.length ? `<div class="ig-answer__benefits">${it.benefits.map((b) =>
              `<span class="chip chip--static"><span class="dot" style="--dot:${BENEFITS[b].color}"></span>${esc(BENEFITS[b].label)}</span>`).join('')}</div>` : ''}
            <button class="share-btn" type="button" data-share-card>${icon('share')} Share card</button>
          </div>
        </div>
      </header>

      <nav class="ig-jump wrap" aria-label="On this page">${jumps.map(([id, l]) => `<a href="#${id}" data-jump="${id}">${l}</a>`).join('')}</nav>

      ${it.good ? `
      <section class="ig-section wrap" id="why-good" aria-labelledby="wg-t">
        <h2 id="wg-t">${it.verdict === 'caution' ? 'The upside' : 'Why it’s good'}</h2>
        <div class="ig-good">${it.good.map(([h, p], i) => `
          <div class="ig-good__item" style="--i:${i}"><h3>${esc(h)}</h3><p>${esc(p)}</p></div>`).join('')}</div>
      </section>` : ''}

      ${portionBlock(it)}

      <section class="ig-section wrap ig-twocol" id="prep" aria-label="Preparation and watch-outs">
        <div class="ig-panel"><h2>${it.verdict === 'caution' ? 'If you do' : 'How to serve it'}</h2>${list(it.prep, 'safe')}</div>
        <div class="ig-panel ig-panel--warn"><h2>Watch-outs</h2>${list(it.risks, 'caution')}</div>
      </section>

      ${it.inRecipes && it.recipe ? `
      <section class="ig-section wrap" id="in-our-food" aria-labelledby="iof-t">
        <div class="label-panel ig-why" style="--label-bg:${it.blob}">
          <p class="eyebrow">${icon('paw')} Why it’s in our food</p>
          <h2 id="iof-t">${esc(it.recipe)}</h2>
        </div>
        ${it.products.length ? `<p class="ig-sub ig-found">Found in:</p><div class="ig-products">${it.products.map(productCard).join('')}</div>` : ''}
      </section>` : ''}

      ${faqs(it)}
      ${relatedCards(it.related, '<span class="amp">&amp;</span> what else?', 'Keep sniffing. There’s no full stop here.')}
      ${review()}
    </article>`;
  }

  /* ---------- Toxic: calm, fast, no selling ---------- */
  function toxic(it) {
    return `
    <article class="ig ig--toxic">
      ${crumbs(it)}
      <header class="ig-toxic-hero">
        <div class="wrap ig-toxic-hero__grid">
          <div class="ig-toxic-hero__art">${art(it)}</div>
          <div>
            <h1>${esc(title(it))}</h1>
            <div class="ig-toxic-hero__verdict">${verdictPill('toxic')}</div>
            <p class="ig-toxic-hero__qa">${esc(it.qa)}</p>
            <button class="share-btn share-btn--light" type="button" data-share-card>${icon('share')} Share to warn others</button>
          </div>
        </div>
      </header>

      <section class="wrap ig-now" aria-labelledby="now-t">
        <h2 id="now-t">If your dog has eaten ${esc(plainName(it).toLowerCase())}</h2>
        <div class="ig-now__calls">
          <a class="btn btn--sun ig-now__call" href="tel:01202509000">${icon('phone')} PoisonLine 01202 509000</a>
          <a class="btn ig-now__call ig-now__call--alt" href="https://findavet.rcvs.org.uk/" target="_blank" rel="noopener">${icon('search')} Find an emergency vet</a>
        </div>
        <ol class="ig-now__steps">${TOXIC_STEPS.map(([h, p]) => `<li><strong>${esc(h)}</strong><span>${esc(p)}</span></li>`).join('')}</ol>
      </section>

      <section class="ig-section wrap ig-twocol" aria-label="Signs and hidden sources">
        <div class="ig-panel"><h2>Signs to watch for</h2>${list(it.symptoms, 'caution')}<p class="ig-onset">${esc(it.onset)}</p></div>
        <div class="ig-panel"><h2>Where it hides</h2>${list(it.risks, 'search')}</div>
      </section>

      ${faqs(it)}
      ${relatedCards(it.swaps, 'Safe swaps', 'Treats your dog can enjoy instead.')}
      ${review()}
    </article>`;
  }

  function render(slug) {
    const it = bySlug(slug);
    if (!it) return `<section class="wrap placeholder">${PM.dog('terrier-digging', '', 180)}<h1>We haven’t dug that one up yet</h1><a class="btn" href="#/">${icon('back')} Back to the Index</a></section>`;
    document.title = `${title(it)} · Pooch & Mutt Ingredient Index`;
    Delight.pushTrail(it.slug);
    return it.verdict === 'toxic' ? toxic(it) : standard(it);
  }

  function after(root, slug) {
    const it = bySlug(slug);
    if (!it) return;
    document.body.classList.toggle('page--toxic', it.verdict === 'toxic');

    // Jump links (hash is used by the router, so scroll manually)
    root.querySelectorAll('[data-jump]').forEach((a) => a.addEventListener('click', (e) => {
      e.preventDefault();
      root.querySelector('#' + a.dataset.jump).scrollIntoView({ behavior: PM.reducedMotion() ? 'auto' : 'smooth' });
    }));

    // Portion size picker
    root.querySelectorAll('.ig-size').forEach((btn) => btn.addEventListener('click', () => {
      const i = DOG_SIZES.findIndex((s) => s.key === btn.dataset.size);
      const s = DOG_SIZES[i];
      const p = Profile.get();
      PM.store.set('size', s.key);
      root.querySelectorAll('.ig-size').forEach((b) => b.setAttribute('aria-checked', String(b === btn)));
      const amt = root.querySelector('.ig-portion__amount');
      amt.textContent = it.portion.amounts[i];
      amt.classList.remove('is-bump'); void amt.offsetWidth; amt.classList.add('is-bump');
      // Only label it with the dog's name when it's their saved size
      const own = p && p.size === s.key ? p : null;
      root.querySelector('.ig-portion__vis').innerHTML = Delight.visualiser(it, i, own);
      root.querySelector('.ig-portion__note').innerHTML = noteFor(s, own);
    }));

    root.querySelectorAll('[data-meet]').forEach((b) => b.addEventListener('click', () => Profile.open()));
    root.querySelectorAll('[data-share-card]').forEach((b) => b.addEventListener('click', () => ShareCard.open(it)));
    const clear = root.querySelector('.trail__clear');
    if (clear) clear.addEventListener('click', () => { Delight.clearTrail(); Delight.pushTrail(slug); root.querySelector('.trail').remove(); });
  }


  window.ProductCard = productCard;
  Router.add('ingredient', render, after);
})();
