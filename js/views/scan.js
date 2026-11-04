/* M5: Snap a Label. Read an ingredients list and explain each item from the Index.
   Pasted text is parsed for real; photos use the sample label text (the live version would use a vision model). */
(function () {
  const { esc, icon, verdictPill } = PM;

  /* Split "Chicken (26%), Sweet Potato, ..." on commas/semicolons outside brackets */
  function parse(text) {
    const parts = []; let depth = 0, cur = '';
    for (const ch of text.replace(/^\s*(composition|ingredients)\s*:\s*/i, '')) {
      if (ch === '(' || ch === '[') depth++;
      if (ch === ')' || ch === ']') depth = Math.max(0, depth - 1);
      if ((ch === ',' || ch === ';' || ch === '\n') && !depth) { parts.push(cur); cur = ''; } else cur += ch;
    }
    parts.push(cur);
    return parts.map((p) => p.trim().replace(/\.$/, '')).filter((p) => p.length > 1).slice(0, 40).map((raw) => {
      const pct = (raw.match(/(\d+(?:\.\d+)?)\s*%/) || [])[1];
      const name = raw.replace(/\(?\s*\d+(?:\.\d+)?\s*%\s*\)?/, '').replace(/\s+/g, ' ').trim();
      return { name, pct, match: match(name) };
    });
  }

  /* Best Index match: the longest name/alias contained in the label item */
  function match(name) {
    const n = ' ' + Search.norm(name) + ' ';
    let best = null, len = 0;
    INGREDIENTS.forEach((it) => {
      [it.name.replace(/\s*\(.*\)/, ''), ...it.aliases].map(Search.norm).forEach((t) => {
        if (t.length > 2 && n.includes(' ' + t + ' ') && t.length > len) { best = it; len = t.length; }
      });
    });
    return best;
  }

  function results(items, fromPhoto) {
    const known = items.filter((i) => i.match);
    const watch = known.filter((i) => i.match.verdict === 'toxic' || i.match.verdict === 'caution');
    const unknown = items.filter((i) => !i.match);
    unknown.forEach((u) => Search.logMiss(u.name));
    return `
      <div class="scan-results">
        ${fromPhoto ? `<p class="scan-note">${icon('sparkle')} Prototype: we’ve read the sample label here. The live version would read your photo with AI.</p>` : ''}
        <div class="scan-stats">
          <div><strong>${items.length}</strong><span>ingredients found</span></div>
          <div><strong>${known.length}</strong><span>explained by the Index</span></div>
          <div class="${watch.length ? 'is-warn' : ''}"><strong>${watch.length}</strong><span>to watch out for</span></div>
        </div>
        <h2 class="scan-h">Here’s what’s in this bowl</h2>
        <ol class="scan-list">
          ${items.map((i, n) => `
            <li class="scan-row ${i.match ? '' : 'is-unknown'}" style="--i:${n}">
              <span class="scan-row__num">${n + 1}</span>
              <div class="scan-row__body">
                <p class="scan-row__name">${esc(i.name)}${i.pct ? ` <b>${esc(i.pct)}%</b>` : ''}</p>
                ${i.match
                  ? `<p class="scan-row__why">${esc(i.match.summary)}</p><a class="linkish" href="#/ingredient/${i.match.slug}">More on ${esc(i.match.name.toLowerCase())}</a>`
                  : '<p class="scan-row__why">Not in our Index yet. We’ve added it to the list for our vets.</p>'}
              </div>
              <div class="scan-row__verdict">${i.match ? verdictPill(i.match.verdict, true) : '<span class="scan-row__q">?</span>'}</div>
            </li>`).join('')}
        </ol>
        <p class="scan-foot">We explain ingredients. We never judge a brand. ${unknown.length ? `${unknown.length} item${unknown.length > 1 ? 's' : ''} sent to our content team.` : ''}</p>
        <button class="btn btn--ghost" type="button" data-again>${icon('camera')} Scan another label</button>
      </div>`;
  }

  const labelCard = () => `
    <div class="scan-label">
      <p class="scan-label__title">${esc(SCAN_SAMPLE.title)}</p>
      <p><strong>Composition:</strong> ${esc(SCAN_SAMPLE.text)}.</p>
    </div>`;

  function render() {
    document.title = 'Snap a Label · Pooch & Mutt';
    return `
    <section class="scan wrap">
      <header class="ask-hero">
        <span class="tab" style="--tab-bg:var(--veterinary)">${icon('sparkle')} AI concept</span>
        <h1>Snap a Label</h1>
        <p>Point your camera at any dog food ingredients list and we’ll explain every item, in plain English.</p>
      </header>
      <div class="scan-stage" data-state="start">
        <div class="scan-start">
          <label class="scan-cam">
            <input type="file" accept="image/*" capture="environment" class="visually-hidden">
            <span class="scan-cam__icon">${icon('camera')}</span>
            <strong>Take or upload a photo</strong>
            <small>Of the ingredients or “Composition” panel</small>
          </label>
          <div class="scan-or"><span>or</span></div>
          <div class="scan-sample">
            ${labelCard()}
            <button class="btn btn--sun" type="button" data-sample>${icon('sparkle')} Scan this sample label</button>
          </div>
          <details class="scan-paste">
            <summary>Paste an ingredients list instead</summary>
            <textarea rows="4" placeholder="e.g. Turkey (45%), Sweet Potato, Peas, Chamomile…"></textarea>
            <button class="btn" type="button" data-paste>Explain this list</button>
          </details>
        </div>
        <div class="scan-reading" hidden>
          <div class="scan-reading__frame"><div class="scan-reading__media"></div><span class="scan-laser"></span></div>
          <p class="scan-reading__msg">Reading the label…</p>
        </div>
        <div class="scan-out" aria-live="polite"></div>
      </div>
    </section>`;
  }

  function after(root) {
    const stage = root.querySelector('.scan-stage');
    const reading = root.querySelector('.scan-reading');
    const media = root.querySelector('.scan-reading__media');
    const out = root.querySelector('.scan-out');
    const msg = root.querySelector('.scan-reading__msg');

    function run(text, mediaHTML, fromPhoto) {
      root.querySelector('.scan-start').hidden = true;
      out.innerHTML = '';
      media.innerHTML = mediaHTML;
      reading.hidden = false;
      const steps = ['Reading the label…', 'Matching against the Index…', 'Checking with our vets’ notes…'];
      let s = 0;
      msg.textContent = steps[0];
      const t = setInterval(() => { s++; if (steps[s]) msg.textContent = steps[s]; }, 650);
      setTimeout(() => {
        clearInterval(t);
        reading.hidden = true;
        out.innerHTML = results(parse(text), fromPhoto);
        out.querySelector('[data-again]').addEventListener('click', () => {
          out.innerHTML = ''; root.querySelector('.scan-start').hidden = false; window.scrollTo({ top: 0 });
        });
        out.scrollIntoView({ block: 'start', behavior: PM.reducedMotion() ? 'auto' : 'smooth' });
      }, PM.reducedMotion() ? 200 : 2000);
    }

    root.querySelector('[data-sample]').addEventListener('click', () => run(SCAN_SAMPLE.text, labelCard(), false));
    root.querySelector('[data-paste]').addEventListener('click', () => {
      const v = root.querySelector('.scan-paste textarea').value;
      if (v.trim()) run(v, `<div class="scan-label"><p>${esc(v)}</p></div>`, false);
    });
    root.querySelector('.scan-cam input').addEventListener('change', (e) => {
      const f = e.target.files && e.target.files[0];
      if (!f) return;
      const url = URL.createObjectURL(f); // stays on the device; nothing is uploaded
      run(SCAN_SAMPLE.text, `<img src="${url}" alt="Your label photo">`, true);
    });
  }

  window.LabelScan = { parse };
  Router.add('scan', render, after);
})();
