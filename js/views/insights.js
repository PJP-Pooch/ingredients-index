/* M5: Behind the scenes. Shows how the Index learns what customers want, and how CS can use it. */
(function () {
  const { esc, icon } = PM;
  const fmt = (n) => n >= 1000 ? (n / 1000).toFixed(n % 1000 ? 1 : 0) + 'K' : String(n);
  const ago = (t) => { const m = Math.round((Date.now() - t) / 60000); return m < 1 ? 'just now' : m < 60 ? `${m} min ago` : `${Math.round(m / 60)} hr ago`; };

  function render() {
    document.title = 'Behind the scenes · Ingredient Index';
    const missed = PM.store.get('missed', []);
    const asked = PM.store.get('asked', []);
    const max = INSIGHT_SEED[0][1];
    const counts = { safe: 0, moderation: 0, caution: 0, toxic: 0 };
    INGREDIENTS.forEach((i) => counts[i.verdict]++);
    const base = location.href.split('#')[0];
    return `
    <section class="ins wrap">
      <header class="ask-hero">
        <span class="tab" style="--tab-bg:var(--superfoods)">Behind the scenes</span>
        <h1>The Index learns as it goes</h1>
        <p>Every search, question and scanned label tells us what owners want to know next. Here’s what this prototype has picked up.</p>
      </header>

      <div class="ins-stats">
        <div><strong>${INGREDIENTS.length}</strong><span>ingredients live</span></div>
        <div><strong>${INGREDIENTS.filter((i) => i.inRecipes).length}</strong><span>in our recipes</span></div>
        <div><strong>${counts.toxic}</strong><span>toxic foods covered</span></div>
        <div class="is-warn"><strong>0/${INGREDIENTS.length}</strong><span>vet-reviewed (prototype)</span></div>
      </div>

      <div class="ins-grid">
        <section class="ins-card">
          <h2>${icon('search')} What people searched for that we don’t cover</h2>
          ${missed.length ? `<ul class="ins-live">${missed.slice(0, 8).map((m) => `<li><span>“${esc(m.q)}”</span><small>${ago(m.at)}</small></li>`).join('')}</ul>`
            : '<p class="ins-empty">Nothing yet in this session. Try searching for “zucchini” on the Index.</p>'}
          <h3>Biggest gaps by UK search demand</h3>
          <ul class="ins-bars">${INSIGHT_SEED.map(([k, v]) => `
            <li><span class="ins-bars__k">can dogs eat ${esc(k)}</span><span class="ins-bars__bar" style="--w:${(v / max) * 100}%"></span><span class="ins-bars__v">${fmt(v)}/mo</span></li>`).join('')}
          </ul>
          <p class="ins-src">Monthly UK searches, from the 2027 SEO content proposal.</p>
        </section>

        <section class="ins-card">
          <h2>${icon('sparkle')} Questions asked to the AI</h2>
          ${asked.length ? `<ul class="ins-live">${asked.slice(0, 8).map((m) => `<li><span>“${esc(m.q)}”</span><small>${ago(m.at)}</small></li>`).join('')}</ul>`
            : '<p class="ins-empty">No questions yet in this session. <a class="linkish" href="#/ask">Ask the Index something</a>.</p>'}
          <h3>What happens next</h3>
          <ol class="ins-flow">
            <li><strong>Spot the gap</strong> from searches, questions and labels</li>
            <li><strong>Draft</strong> the page in our tone of voice</li>
            <li><strong>Vet review</strong> and sign-off</li>
            <li><strong>Publish</strong>, so search, AI answers and CS all update at once</li>
          </ol>
        </section>
      </div>

      <section class="ins-card ins-cs">
        <h2>${icon('paw')} Customer Service answer links</h2>
        <p>Ready-made replies for the 2–3 hours a day the team spends on ingredient questions. Copy a link and paste it into a reply.</p>
        <div class="ins-table" role="table" aria-label="CS answer links">
          ${INGREDIENTS.slice().sort((a, b) => b.pop - a.pop).slice(0, 8).map((i) => `
            <div class="ins-row" role="row">
              <span role="cell">${PM.verdictPill(i.verdict, true)}</span>
              <span role="cell" class="ins-row__q"><strong>Can dogs eat ${esc(i.name.replace(/\s*\(.*\)/, '').toLowerCase())}?</strong><small>${esc(i.summary)}</small></span>
              <button role="cell" class="btn btn--ghost ins-copy" type="button" data-url="${esc(base + '#/ingredient/' + i.slug)}">Copy link</button>
            </div>`).join('')}
        </div>
      </section>
    </section>`;
  }

  function after(root) {
    root.querySelectorAll('.ins-copy').forEach((b) => b.addEventListener('click', async () => {
      try { await navigator.clipboard.writeText(b.dataset.url); b.textContent = 'Copied ✓'; }
      catch (e) { b.textContent = 'Copy failed'; }
      setTimeout(() => { b.textContent = 'Copy link'; }, 1600);
    }));
  }

  Router.add('insights', render, after);
})();
