/* M4: Inside the Bowl. The pack opens into its ingredients; tap one to learn why it's there. */
(function () {
  const { esc, icon } = PM;

  function render(slug) {
    const b = BOWLS[slug];
    if (!b) return `<section class="wrap placeholder">${PM.dog('terrier-digging', '', 180)}<h1>That bowl’s empty</h1><a class="btn" href="#/">${icon('back')} Back to the Index</a></section>`;
    const p = PRODUCTS[b.product];
    const prof = Profile.get();
    const n = b.ingredients.length;
    document.title = `Inside the Bowl: ${b.title} · Pooch & Mutt`;
    return `
    <article class="bowl-page">
      <nav class="ig-crumbs wrap" aria-label="Breadcrumb"><a href="#/">${icon('back')} Ingredient Index</a><span aria-hidden="true">/</span><span>Inside the Bowl</span></nav>

      <header class="bowl-hero wrap">
        <span class="tab" style="--tab-bg:${p.rangeColor}">${esc(b.eyebrow)}</span>
        <h1><span class="bowl-hero__kicker">Inside the Bowl:</span> ${esc(b.title)}</h1>
        <p class="bowl-hero__headline">${esc(b.headline)}</p>
        <p class="bowl-hero__intro">${esc(b.intro)}</p>
        ${prof ? `<p class="bowl-hero__for">${PM.icon('paw')} Got a stressed or zoomie roomie like ${esc(prof.name)}? This one’s for you.</p>` : ''}
      </header>

      <section class="bowl-stage wrap" data-open="false" aria-label="Ingredients in ${esc(b.title)}">
        <div class="bowl-ring" style="--n:${n}">
          <button class="bowl-pack" type="button" aria-expanded="false" aria-controls="bowl-detail" style="--label:${p.labelColor}">
            <img src="img/${esc(p.img)}" alt="${esc(p.name)} pack">
            <span class="bowl-pack__cta">${icon('sparkle')} Tap to open the bowl</span>
          </button>
          ${b.ingredients.map((it, i) => `
            <button class="bowl-item" type="button" data-idx="${i}" style="--i:${i};--a:${-90 + i * (360 / n)}deg;--c:${it.color}" tabindex="-1" aria-hidden="true">
              <span class="bowl-item__art"><img src="img/${esc(it.img)}" alt=""></span>
              <span class="bowl-item__name">${esc(it.name)}${it.pct ? ` <b>${esc(it.pct)}</b>` : ''}</span>
            </button>`).join('')}
        </div>
        <div class="bowl-detail" id="bowl-detail" aria-live="polite">
          <p class="bowl-detail__hint">${n} ingredients, each with a job to do. Open the bowl to meet them.</p>
        </div>
      </section>

      <section class="bowl-claims" aria-label="What it does">
        <ul class="wrap">${b.claims.map(([c, img]) => `<li><img src="img/deco/${img}.png" alt=""><span>${esc(c)}</span></li>`).join('')}</ul>
      </section>

      <section class="ig-section wrap" aria-labelledby="try-t">
        <h2 id="try-t">See the difference for yourself</h2>
        <p class="ig-sub">Curious what’s really in the bowl? Now you know. Try it with 14 days for £14.</p>
        <div class="ig-products">${ProductCard(b.product)}${b.alt ? ProductCard(b.alt) : ''}</div>
      </section>

      <section class="ig-section wrap" aria-labelledby="more-t">
        <h2 id="more-t"><span class="amp" style="color:var(--primal)">&amp;</span> keep exploring</h2>
        <div class="bowl-more">
          <a class="card bowl-more__card" href="#/hub/calm" style="--c:var(--b-calm)"><strong>Ingredients for calm</strong><span>What helps support a calmer mood ${icon('arrow')}</span></a>
          <a class="card bowl-more__card" href="#/hub/digestion" style="--c:var(--b-digestion)"><strong>Ingredients for digestion</strong><span>Gentle on tums ${icon('arrow')}</span></a>
          <a class="card bowl-more__card" href="#/" style="--c:var(--superfoods)"><strong>The full A–Z</strong><span>Every ingredient, explained ${icon('arrow')}</span></a>
        </div>
      </section>
    </article>`;
  }

  function after(root, slug) {
    const b = BOWLS[slug];
    if (!b) return;
    const stage = root.querySelector('.bowl-stage');
    const pack = root.querySelector('.bowl-pack');
    const items = [...root.querySelectorAll('.bowl-item')];
    const detail = root.querySelector('.bowl-detail');

    function show(i) {
      const it = b.ingredients[i];
      items.forEach((el, j) => el.setAttribute('aria-pressed', String(i === j)));
      detail.innerHTML = `
        <div class="bowl-detail__card" style="--c:${it.color}">
          <span class="bowl-detail__art"><img src="img/${esc(it.img)}" alt=""></span>
          <div>
            <h3>${esc(it.name)}${it.pct ? ` <span>${esc(it.pct)}</span>` : ''}</h3>
            <p>${esc(it.role)}</p>
            ${it.slug ? `<a class="linkish" href="#/ingredient/${it.slug}">Can dogs eat ${esc(it.name.toLowerCase())}? Read more</a>` : ''}
          </div>
        </div>`;
    }

    function open() {
      if (stage.dataset.open === 'true') return;
      stage.dataset.open = 'true';
      pack.setAttribute('aria-expanded', 'true');
      items.forEach((el) => { el.tabIndex = 0; el.removeAttribute('aria-hidden'); });
      setTimeout(() => show(0), PM.reducedMotion() ? 0 : 700);
    }

    pack.addEventListener('click', () => {
      if (stage.dataset.open === 'true') {
        // Second tap: a little shake, like a treat bag
        pack.classList.remove('is-shake'); void pack.offsetWidth; pack.classList.add('is-shake');
      } else open();
    });
    items.forEach((el) => el.addEventListener('click', () => show(+el.dataset.idx)));

    // Open by itself when it scrolls into view (once), so the demo flows
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver((entries) => {
        if (entries.some((e) => e.isIntersecting)) { setTimeout(open, 600); io.disconnect(); }
      }, { threshold: 0.6 });
      io.observe(pack);
    }
  }

  Router.add('bowl', render, after);
})();
