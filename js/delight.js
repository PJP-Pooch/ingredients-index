/* M3: delight helpers: portion visualiser, verdict reveal, sniff trail. Exposes window.Delight */
(function () {
  const { esc, icon } = PM;

  /* "8–12" -> {min: 8, max: 12}; "½" -> {min: .5, max: .5}; "1½" -> 1.5 */
  function parseAmount(s) {
    const num = (t) => {
      t = t.trim();
      const frac = { '½': 0.5, '¼': 0.25, '¾': 0.75 };
      let v = 0;
      for (const ch of t) if (frac[ch]) v += frac[ch];
      const whole = parseFloat(t.replace(/[½¼¾]/g, ''));
      return (isNaN(whole) ? 0 : whole) + v;
    };
    const [a, b] = String(s).split(/[–-]/);
    const min = num(a);
    return { min, max: b ? num(b) : min };
  }

  const isSpoon = (unit) => /spoon/.test(unit);

  const spoonSVG = (fill) => `<svg viewBox="0 0 40 40" class="pv__spoon" aria-hidden="true">
      <ellipse cx="14" cy="14" rx="10" ry="8" fill="${fill}" stroke="var(--navy)" stroke-width="2"/>
      <path d="M21 19 35 33" stroke="var(--navy)" stroke-width="3.5" stroke-linecap="round"/></svg>`;

  /* Returns the visual row of pieces: solid up to min, faded up to max ("up to") */
  function pieces(it, sizeIdx) {
    const { min, max } = parseAmount(it.portion.amounts[sizeIdx]);
    const spoon = isSpoon(it.portion.unit);
    const cap = 20;
    const total = Math.min(Math.ceil(max), cap);
    let out = '';
    for (let i = 0; i < total; i++) {
      const fade = i >= Math.ceil(min);
      const partial = i === Math.floor(max) && max % 1 ? max % 1 : (i === Math.floor(min) && min % 1 && !fade ? min % 1 : 0);
      const style = `--i:${i};${partial ? `--clip:${100 - partial * 100}%` : ''}`;
      const cls = `pv__piece${fade ? ' is-extra' : ''}${partial ? ' is-partial' : ''}`;
      out += spoon
        ? `<span class="${cls}" style="${style}">${spoonSVG(it.blob)}</span>`
        : `<span class="${cls}" style="${style}"><img src="img/${esc(it.img)}" alt=""></span>`;
    }
    return out;
  }

  function visualiser(it, sizeIdx, profile) {
    const s = DOG_SIZES[sizeIdx];
    const who = profile ? esc(profile.name) : `A ${s.label.toLowerCase()} dog`;
    return `
      <div class="pv">
        <figure class="pv__dog"><img src="img/dogs/${s.dog}.svg" alt=""><figcaption>${who}</figcaption></figure>
        <div class="pv__plate" aria-hidden="true">${pieces(it, sizeIdx)}</div>
      </div>`;
  }

  /* Verdict reveal: a little character reaction. Toxic gets nothing (calm by design). */
  function reactor(verdict) {
    if (verdict === 'toxic') return '';
    const dog = { safe: 'jack-russell', moderation: 'cockapoo', caution: 'basset-hound' }[verdict];
    const burst = verdict === 'safe'
      ? `<span class="burst">${[0, 1, 2, 3, 4].map((i) => `<i style="--a:${-70 + i * 35}deg;--d:${i * 40}ms">${icon('paw')}</i>`).join('')}</span>` : '';
    return `<div class="reactor reactor--${verdict}" aria-hidden="true"><img src="img/dogs/${dog}.svg" alt="">${burst}</div>`;
  }

  /* Sniff trail: the ingredients visited this session, joined with "&" */
  const TRAIL_KEY = 'pm:trail';
  function readTrail() { try { return JSON.parse(sessionStorage.getItem(TRAIL_KEY)) || []; } catch (e) { return []; } }
  function pushTrail(slug) {
    const t = readTrail().filter((s) => s !== slug);
    t.push(slug);
    try { sessionStorage.setItem(TRAIL_KEY, JSON.stringify(t.slice(-6))); } catch (e) { /* ignore */ }
    return t.slice(-6);
  }
  function clearTrail() { try { sessionStorage.removeItem(TRAIL_KEY); } catch (e) { /* ignore */ } }

  function trailHTML(currentSlug) {
    const t = readTrail().map((s) => window.INGREDIENTS.find((i) => i.slug === s)).filter(Boolean);
    if (t.length < 2) return '';
    return `
      <nav class="trail wrap" aria-label="Your sniff trail">
        <span class="trail__label">${icon('paw')} Your sniff trail</span>
        <ol class="trail__list">${t.map((i, n) => `
          ${n ? '<li class="trail__amp" aria-hidden="true">&amp;</li>' : ''}
          <li>${i.slug === currentSlug ? `<span aria-current="page">${esc(i.name)}</span>` : `<a href="#/ingredient/${i.slug}">${esc(i.name)}</a>`}</li>`).join('')}
        </ol>
        <button class="trail__clear" type="button">Start fresh</button>
      </nav>`;
  }

  window.Delight = { parseAmount, visualiser, pieces, reactor, pushTrail, clearTrail, trailHTML };
})();
