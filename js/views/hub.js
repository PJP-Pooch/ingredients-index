/* M4: Benefit hubs (#/hub/calm, #/hub/digestion) and the toxic-foods hub with the printable Fridge List. */
(function () {
  const { esc, icon, VERDICTS } = PM;
  const ORDER = ['safe', 'moderation', 'caution'];
  const crumbs = (label) => `<nav class="ig-crumbs wrap" aria-label="Breadcrumb"><a href="#/">${icon('back')} Ingredient Index</a><span aria-hidden="true">/</span><span>${esc(label)}</span></nav>`;

  function benefitHub(key) {
    const h = HUBS[key];
    const b = BENEFITS[h.benefit];
    const items = INGREDIENTS.filter((i) => i.benefits.includes(h.benefit)).sort((a, c) => a.name.localeCompare(c.name));
    const prof = Profile.get();
    document.title = `Ingredients for ${h.title} · Pooch & Mutt Ingredient Index`;
    return `
    <article class="hub" style="--hub:${b.color}">
      ${crumbs(h.title)}
      <header class="hub-hero">
        <div class="wrap hub-hero__grid">
          <div>
            <span class="tab" style="--tab-bg:var(--navy);color:var(--cream)">Ingredients for ${esc(h.title)}</span>
            <h1>${esc(h.headline)}</h1>
            <p class="hub-hero__intro">${esc(h.intro)}</p>
            <p class="hub-hero__count"><strong>${items.length}</strong> ingredients in the Index can help${prof ? `, with portions sized for ${esc(prof.name)}` : ''}.</p>
          </div>
          <div class="hub-hero__dogs" aria-hidden="true">
            ${key === 'calm' ? PM.dog('pug-lying-down', '', 220) : PM.dog('jack-russel-eating-grass', '', 220)}
          </div>
        </div>
      </header>

      ${ORDER.map((v) => {
        const group = items.filter((i) => i.verdict === v);
        return group.length ? `
        <section class="ig-section wrap" aria-labelledby="g-${v}">
          <h2 id="g-${v}" class="hub-group">${PM.verdictPill(v)} <span>${group.length} ${group.length === 1 ? 'ingredient' : 'ingredients'}</span></h2>
          <div class="ix-grid">${group.map(IndexCard).join('')}</div>
        </section>` : '';
      }).join('')}

      ${h.bowl ? `
      <section class="ig-section wrap">
        <a class="hub-bowl" href="#/bowl/${h.bowl}">
          <img src="img/${esc(PRODUCTS[BOWLS[h.bowl].product].img)}" alt="">
          <span><span class="eyebrow">${icon('sparkle')} Inside the Bowl</span><strong>See how ${esc(BOWLS[h.bowl].title)} puts these to work</strong><span class="hub-bowl__go">Open the bowl ${icon('arrow')}</span></span>
        </a>
      </section>` : ''}

      <section class="ig-section wrap" aria-labelledby="tips-t">
        <h2 id="tips-t">It’s not just what’s in the bowl</h2>
        <div class="ig-good">${h.tips.map(([t, p]) => `<div class="ig-good__item"><h3>${esc(t)}</h3><p>${esc(p)}</p></div>`).join('')}</div>
      </section>

      <section class="ig-section wrap" aria-labelledby="prod-t">
        <h2 id="prod-t">Made for ${esc(h.title.toLowerCase())}</h2>
        <div class="ig-products">${h.products.map(ProductCard).join('')}</div>
      </section>
    </article>`;
  }

  function toxicHub() {
    const items = INGREDIENTS.filter((i) => i.verdict === 'toxic').sort((a, c) => a.name.localeCompare(c.name));
    const hides = items.flatMap((i) => i.aliases.slice(0, 3));
    document.title = 'Toxic Foods for Dogs: The Fridge List · Pooch & Mutt';
    return `
    <article class="hub hub--toxic">
      ${crumbs('Don’t feed')}
      <header class="ig-toxic-hero">
        <div class="wrap">
          <h1>Toxic foods for dogs</h1>
          <p class="ig-toxic-hero__qa">A calm, clear list of what to keep out of paw’s reach, and exactly what to do if they get hold of something.</p>
        </div>
      </header>

      <section class="wrap ig-now" aria-labelledby="now-t">
        <h2 id="now-t">If your dog has eaten something on this list</h2>
        <div class="ig-now__calls">
          <a class="btn btn--sun ig-now__call" href="tel:01202509000">${icon('phone')} PoisonLine 01202 509000</a>
          <a class="btn ig-now__call ig-now__call--alt" href="https://findavet.rcvs.org.uk/" target="_blank" rel="noopener">${icon('search')} Find an emergency vet</a>
        </div>
        <ol class="ig-now__steps">${TOXIC_STEPS.map(([h, p]) => `<li><strong>${esc(h)}</strong><span>${esc(p)}</span></li>`).join('')}</ol>
      </section>

      <section class="ig-section wrap" aria-labelledby="list-t">
        <h2 id="list-t">The ones to know</h2>
        <div class="ix-grid">${items.map(IndexCard).join('')}</div>
      </section>

      <section class="ig-section wrap" aria-labelledby="fridge-t">
        <div class="fridge-intro">
          <div>
            <h2 id="fridge-t">The Fridge List</h2>
            <p>Screenshot it, pin it, and let the whole household know. Especially handy at Christmas and Easter.</p>
          </div>
        </div>
        <div class="fridge" id="fridge">
          <div class="fridge__head">
            <img src="img/logo/master-logo-navy.png" alt="Pooch & Mutt">
            <span class="tab" style="--tab-bg:var(--raw)">The Fridge List</span>
          </div>
          <h3 class="fridge__title">Don’t feed these to your dog</h3>
          <ul class="fridge__list">
            ${items.map((i) => `<li><strong>${esc(i.name)}</strong><span>${esc(i.summary)}</span></li>`).join('')}
            ${FRIDGE_EXTRAS.map((x) => `<li><strong>${esc(x)}</strong></li>`).join('')}
          </ul>
          <p class="fridge__hides"><strong>Watch for them hiding in:</strong> ${esc(hides.join(', '))}.</p>
          <div class="fridge__help">
            <p><strong>If they’ve eaten something:</strong> call your vet straight away, even if they seem fine.</p>
            <p class="fridge__phone">Animal PoisonLine <strong>01202 509000</strong></p>
          </div>
          <p class="fridge__sign">For all breeds <span class="amp">&amp;</span> needs.</p>
        </div>
      </section>
    </article>`;
  }

  function render(slug) {
    if (slug === 'toxic-foods') return toxicHub();
    if (HUBS[slug]) return benefitHub(slug);
    return `<section class="wrap placeholder">${PM.dog('terrier-digging', '', 180)}<h1>We haven’t built that hub yet</h1><a class="btn" href="#/">${icon('back')} Back to the Index</a></section>`;
  }

  function after(root, slug) {
    document.body.classList.toggle('page--toxic', slug === 'toxic-foods');
  }


  Router.add('hub', render, after);
})();
