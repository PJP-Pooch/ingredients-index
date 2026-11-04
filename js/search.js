/* Typo-tolerant ingredient search over names + aliases. Exposes window.Search */
(function () {
  const norm = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/&/g, ' and ').replace(/[^a-z0-9 ]+/g, ' ').replace(/\s+/g, ' ').trim();

  // Optimal string alignment distance (Damerau-Levenshtein with adjacent swaps), capped for speed
  function dist(a, b, max) {
    if (Math.abs(a.length - b.length) > max) return max + 1;
    const d = Array.from({ length: a.length + 1 }, (_, i) => [i]);
    for (let j = 1; j <= b.length; j++) d[0][j] = j;
    for (let i = 1; i <= a.length; i++) {
      let rowMin = Infinity;
      for (let j = 1; j <= b.length; j++) {
        const cost = a[i - 1] === b[j - 1] ? 0 : 1;
        d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost);
        if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1);
        rowMin = Math.min(rowMin, d[i][j]);
      }
      if (rowMin > max) return max + 1;
    }
    return d[a.length][b.length];
  }

  let index = [];
  function build(items) {
    index = items.map((item) => {
      const terms = [item.name, ...(item.aliases || [])].map(norm);
      const words = new Set(terms.flatMap((t) => t.split(' ')).filter((w) => w.length > 2));
      return { item, terms, words: [...words] };
    });
  }

  /* Returns [{ item, score, via }] best first. `via` is the alias that matched, when it isn't the name. */
  function query(q, limit = 8) {
    const nq = norm(q);
    if (!nq) return [];
    const tol = nq.length <= 3 ? 0 : nq.length <= 6 ? 1 : 2;
    const out = [];
    for (const entry of index) {
      let best = 0, via = null;
      entry.terms.forEach((t, i) => {
        let s = 0;
        if (t === nq) s = 100;
        else if (t.startsWith(nq)) s = 80 - (t.length - nq.length) * 0.5;
        else if (t.split(' ').some((w) => w.startsWith(nq))) s = 65;
        else if (nq.length > 2 && t.includes(nq)) s = 50;
        if (s && i === 0) s += 5; // prefer the canonical name
        if (s > best) { best = s; via = i === 0 ? null : t; }
      });
      if (!best && tol) {
        for (const w of entry.words.concat(entry.terms)) {
          const d = dist(nq, w.slice(0, Math.max(nq.length, w.length)), tol);
          const dPrefix = w.length > nq.length ? dist(nq, w.slice(0, nq.length), tol) : d;
          const dd = Math.min(d, dPrefix + 0.5);
          if (dd <= tol) {
            const s = 40 - dd * 10;
            if (s > best) { best = s; via = entry.terms[0] === w ? null : w; }
          }
        }
      }
      if (best) out.push({ item: entry.item, score: best + (entry.item.pop || 0) * 0.05, via });
    }
    return out.sort((a, b) => b.score - a.score).slice(0, limit);
  }

  /* Remember searches that found nothing; surfaced in the insights panel (M5) */
  function logMiss(q) {
    const list = PM.store.get('missed', []);
    const t = q.trim();
    if (t.length < 3 || list.some((m) => m.q === t.toLowerCase())) return;
    list.unshift({ q: t.toLowerCase(), at: Date.now() });
    PM.store.set('missed', list.slice(0, 50));
  }

  window.Search = { build, query, logMiss, norm };
})();
