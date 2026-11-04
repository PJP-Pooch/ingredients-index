/* M5: Ask the Index. Answers come ONLY from Index content (scripted for the prototype). Emergencies get a fixed response. */
(function () {
  const { esc, icon, verdictPill } = PM;
  const bySlug = (s) => INGREDIENTS.find((i) => i.slug === s);
  const has = (nq, w) => (' ' + nq + ' ').includes(' ' + Search.norm(w) + ' ') || (w.includes(' ') && nq.includes(Search.norm(w)));

  /* Which Index ingredients does the question mention? (name or alias, whole words) */
  function mentions(nq) {
    const out = [];
    INGREDIENTS.forEach((it) => {
      const terms = [it.name.replace(/\s*\(.*\)/, ''), ...it.aliases].map(Search.norm);
      if (terms.some((t) => t.length > 2 && (' ' + nq + ' ').includes(' ' + t + ' '))) out.push(it);
    });
    return out;
  }

  function answer(q) {
    const nq = Search.norm(q);
    const found = mentions(nq);
    const toxic = found.filter((i) => i.verdict === 'toxic');
    const urgent = EMERGENCY_WORDS.some((w) => has(nq, w));
    const ate = ATE_WORDS.some((w) => has(nq, w));
    if (urgent || (ate && toxic.length)) return { type: 'emergency', item: toxic[0] || null };

    const script = ASK_SCRIPTS.find((s) => s.match.every((g) => g.some((k) => has(nq, k))));
    if (script) return { type: 'script', paras: script.answer, sources: script.sources, link: script.link };
    if (found.length) return { type: 'grounded', items: found.slice(0, 2) };
    return { type: 'unknown' };
  }

  const dogName = () => { const p = Profile.get(); return p ? p.name : 'your dog'; };
  const fill = (s) => s.replace(/\{name\}/g, dogName());

  function portionLine(it) {
    if (!it.portion) return '';
    const p = Profile.get();
    const idx = Math.max(0, DOG_SIZES.findIndex((s) => s.key === (p ? p.size : PM.store.get('size', 'medium'))));
    const s = DOG_SIZES[idx];
    return `${p ? `For ${p.name} (${s.label.toLowerCase()})` : `For a ${s.label.toLowerCase()} dog`}, that’s about ${it.portion.amounts[idx]} ${it.portion.unit} a day.`;
  }

  const sourceChips = (slugs) => `
    <div class="ask-sources"><span>${icon('paw')} From the Index:</span>
      ${slugs.map(bySlug).filter(Boolean).map((i) => `<a href="#/ingredient/${i.slug}">${verdictPill(i.verdict, true)}${esc(i.name)}</a>`).join('')}
    </div>`;

  function bubbleHTML(a) {
    if (a.type === 'emergency') {
      const it = a.item;
      return `
        <div class="ask-msg ask-msg--bot ask-msg--urgent" role="alert">
          <p class="ask-urgent__title">${icon('phone')} This sounds urgent. Here’s what to do now.</p>
          <p>We don’t use AI to answer emergencies. These steps were written by our vets.</p>
          <ol>${TOXIC_STEPS.map(([h, p]) => `<li><strong>${esc(h)}.</strong> ${esc(p)}</li>`).join('')}</ol>
          <div class="ask-urgent__calls">
            <a class="btn btn--sun" href="tel:01202509000">${icon('phone')} PoisonLine 01202 509000</a>
            ${it ? `<a class="btn btn--ghost" href="#/ingredient/${it.slug}">About ${esc(it.name.toLowerCase())}</a>` : ''}
          </div>
        </div>`;
    }
    if (a.type === 'unknown') {
      return `
        <div class="ask-msg ask-msg--bot">
          <p data-type>I can only answer from what our vets have written for the Index, and we haven’t covered that one yet. I’ve passed your question on so we can dig it up.</p>
          <p data-type>How about trying the A–Z, or asking about a specific food?</p>
        </div>`;
    }
    if (a.type === 'script') {
      return `
        <div class="ask-msg ask-msg--bot">
          ${a.paras.map((p) => `<p data-type>${esc(fill(p))}</p>`).join('')}
          ${a.link ? `<a class="ask-link" href="${a.link[0]}">${esc(a.link[1])} ${icon('arrow')}</a>` : ''}
          ${sourceChips(a.sources)}
        </div>`;
    }
    // grounded: compose from the ingredient pages themselves
    return `
      <div class="ask-msg ask-msg--bot">
        ${a.items.map((it) => `
          <div class="ask-item">${verdictPill(it.verdict)}
            <p data-type>${esc(it.qa)}</p>
            ${portionLine(it) ? `<p data-type class="ask-portion">${esc(portionLine(it))}</p>` : ''}
          </div>`).join('')}
        ${sourceChips(a.items.map((i) => i.slug))}
      </div>`;
  }

  /* Reveal text word by word, like a streamed answer */
  function typeOut(el, done) {
    const paras = [...el.querySelectorAll('[data-type]')];
    const extras = [...el.children].filter((c) => !c.matches('[data-type]') && !c.querySelector('[data-type]'));
    if (PM.reducedMotion()) { done && done(); return; }
    const words = paras.map((p) => { const w = p.textContent.split(' '); p.textContent = ''; return w; });
    extras.forEach((x) => { x.style.opacity = 0; });
    el.querySelectorAll('.ask-item .verdict').forEach((v) => { v.style.opacity = 0; });
    let pi = 0, wi = 0;
    el.querySelectorAll('.ask-item .verdict').forEach((v) => { v.style.transition = 'opacity .3s'; v.style.opacity = 1; });
    const tick = () => {
      if (pi >= paras.length) { extras.forEach((x) => { x.style.transition = 'opacity .4s'; x.style.opacity = 1; }); done && done(); return; }
      paras[pi].textContent += (wi ? ' ' : '') + words[pi][wi];
      wi++;
      if (wi >= words[pi].length) { pi++; wi = 0; }
      setTimeout(tick, 28);
    };
    tick();
  }

  function render() {
    document.title = 'Ask the Index · Pooch & Mutt';
    const p = Profile.get();
    return `
    <section class="ask wrap">
      <header class="ask-hero">
        <span class="tab" style="--tab-bg:var(--veterinary)">${icon('sparkle')} AI concept</span>
        <h1>Ask the Index</h1>
        <p>Ask anything about what ${p ? esc(p.name) : 'your dog'} can eat. Answers come only from vet-reviewed Index pages, always with sources.</p>
      </header>
      <div class="ask-thread" aria-live="polite">
        <div class="ask-msg ask-msg--bot ask-msg--hello">
          <img src="img/dogs/pooch-and-mutt.svg" alt="">
          <p>Hello${p ? ` ${esc(p.name)}’s human` : ''}! Ask me a question, or try one of these:</p>
        </div>
        <div class="ask-suggest">${ASK_SUGGESTIONS.map((s) => `<button class="chip" type="button">${esc(s)}</button>`).join('')}</div>
      </div>
      <form class="ask-form" autocomplete="off">
        <label class="visually-hidden" for="ask-q">Your question</label>
        <input id="ask-q" maxlength="160" placeholder="e.g. Can ${p ? esc(p.name) : 'my dog'} eat mango?" enterkeyhint="send">
        <button class="btn btn--sun" type="submit" aria-label="Ask">${icon('arrow')}</button>
      </form>
      <p class="ask-note">Prototype: answers are scripted from Index content to show how a grounded AI assistant would behave. Emergencies always get our vets’ fixed guidance, never a generated reply.</p>
    </section>`;
  }

  function after(root) {
    const thread = root.querySelector('.ask-thread');
    const form = root.querySelector('.ask-form');
    const input = root.querySelector('#ask-q');
    let busy = false;

    function ask(q) {
      q = q.trim();
      if (!q || busy) return;
      busy = true;
      const asked = PM.store.get('asked', []);
      asked.unshift({ q, at: Date.now() });
      PM.store.set('asked', asked.slice(0, 30));
      root.querySelector('.ask-suggest')?.remove();
      thread.insertAdjacentHTML('beforeend', `<div class="ask-msg ask-msg--me">${esc(q)}</div>
        <div class="ask-msg ask-msg--bot ask-msg--thinking" aria-label="Sniffing out an answer"><span></span><span></span><span></span><em>Sniffing the Index…</em></div>`);
      input.value = '';
      scrollDown();
      const a = answer(q);
      if (a.type === 'unknown') Search.logMiss(q);
      setTimeout(() => {
        thread.querySelector('.ask-msg--thinking').remove();
        thread.insertAdjacentHTML('beforeend', bubbleHTML(a));
        const el = thread.lastElementChild;
        scrollDown();
        if (a.type === 'emergency') { busy = false; return; }
        typeOut(el, () => { busy = false; scrollDown(); });
      }, a.type === 'emergency' ? 300 : 1100);
    }
    const scrollDown = () => { const last = thread.lastElementChild; if (last) last.scrollIntoView({ block: 'nearest', behavior: PM.reducedMotion() ? 'auto' : 'smooth' }); };

    form.addEventListener('submit', (e) => { e.preventDefault(); ask(input.value); });
    root.querySelectorAll('.ask-suggest .chip').forEach((c) => c.addEventListener('click', () => ask(c.textContent)));
  }

  window.AskEngine = { answer };
  Router.add('ask', render, after);
})();
