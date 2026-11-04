/* M6: collectable share cards, drawn to canvas in the pack's visual language. Exposes window.ShareCard */
(function () {
  const { esc, icon } = PM;
  const W = 1080, H = 1350;
  const VC = {
    safe: ['#DDF1DF', '#1F5A2E'], moderation: ['#FBEAC2', '#6B4A00'],
    caution: ['#FCD9BE', '#7A3200'], toxic: ['#D66965', '#071D49']
  };
  const cssVar = (v) => {
    const m = /var\((--[\w-]+)\)/.exec(v || '');
    return m ? getComputedStyle(document.documentElement).getPropertyValue(m[1]).trim() : (v || '#F2E9DB');
  };
  const load = (src) => new Promise((res) => { const i = new Image(); i.onload = () => res(i); i.onerror = () => res(null); i.src = src; });

  function wrap(ctx, text, x, y, maxW, lh, maxLines) {
    const words = text.split(' '); let line = '', lines = [];
    words.forEach((w) => { const t = line ? line + ' ' + w : w; if (ctx.measureText(t).width > maxW && line) { lines.push(line); line = w; } else line = t; });
    lines.push(line);
    if (lines.length > maxLines) { lines = lines.slice(0, maxLines); lines[maxLines - 1] = lines[maxLines - 1].replace(/\s*\S*$/, '…'); }
    lines.forEach((l, i) => ctx.fillText(l, x, y + i * lh));
    return lines.length;
  }

  function pinkedRect(ctx, x, y, w, h, tooth) {
    ctx.beginPath(); ctx.moveTo(x, y + tooth);
    for (let i = x; i < x + w; i += tooth * 2) { ctx.lineTo(i + tooth, y); ctx.lineTo(Math.min(i + tooth * 2, x + w), y + tooth); }
    ctx.lineTo(x + w, y + h - tooth);
    for (let i = x + w; i > x; i -= tooth * 2) { ctx.lineTo(i - tooth, y + h); ctx.lineTo(Math.max(i - tooth * 2, x), y + h - tooth); }
    ctx.closePath(); ctx.fill();
  }

  function roundRect(ctx, x, y, w, h, r) { ctx.beginPath(); ctx.roundRect ? ctx.roundRect(x, y, w, h, r) : ctx.rect(x, y, w, h); ctx.fill(); }

  async function draw(canvas, it) {
    const ctx = canvas.getContext('2d');
    const toxic = it.verdict === 'toxic';
    const navy = '#071D49', cream = '#F2E9DB';
    const accent = toxic ? cream : cssVar(it.blob);
    await Promise.all([document.fonts.load('800 96px Fraunces'), document.fonts.load('800 34px "DM Sans"'), document.fonts.load('500 40px "DM Sans"')]).catch(() => {});
    const [logo, art] = await Promise.all([load(`img/logo/single-line-${toxic ? 'cream' : 'navy'}.png`), load(`img/${it.img}`)]);

    ctx.fillStyle = toxic ? navy : cream; ctx.fillRect(0, 0, W, H);
    // logo
    if (logo) { const lw = 380, lh = lw * logo.height / logo.width; ctx.drawImage(logo, (W - lw) / 2, 70, lw, lh); }
    // pinked tab
    ctx.fillStyle = toxic ? '#D66965' : '#F1B434';
    pinkedRect(ctx, 270, 190, 540, 86, 10);
    ctx.fillStyle = navy; ctx.font = '800 32px "DM Sans", sans-serif'; ctx.textAlign = 'center';
    ctx.letterSpacing = '6px';
    ctx.fillText('THE INGREDIENT INDEX', W / 2, 245);
    ctx.letterSpacing = '0px';
    // blob + art
    ctx.save(); ctx.globalAlpha = toxic ? 1 : 0.6; ctx.fillStyle = accent;
    ctx.beginPath(); ctx.ellipse(W / 2, 560, 290, 270, -0.2, 0, Math.PI * 2); ctx.fill(); ctx.restore();
    if (art) {
      const box = toxic ? 360 : 460;
      const r = Math.min(box / (art.naturalWidth || 400), box / (art.naturalHeight || 400));
      const w = (art.naturalWidth || 400) * r, h = (art.naturalHeight || 400) * r;
      ctx.drawImage(art, (W - w) / 2, 560 - h / 2, w, h);
    }
    // name
    ctx.fillStyle = toxic ? cream : navy;
    ctx.font = '800 92px Fraunces, Georgia, serif';
    const n = wrap(ctx, it.name.replace(/\s*\(.*\)/, ''), W / 2, 935, 920, 96, 2);
    // verdict pill
    const [bg, fg] = VC[it.verdict];
    const label = PM.VERDICTS[it.verdict].label.toUpperCase();
    ctx.font = '800 34px "DM Sans", sans-serif';
    const pw = ctx.measureText(label).width + 80, py = 935 + (n - 1) * 96 + 50;
    ctx.fillStyle = bg; roundRect(ctx, (W - pw) / 2, py, pw, 70, 35);
    ctx.fillStyle = fg; ctx.fillText(label, W / 2, py + 47);
    // fact
    ctx.fillStyle = toxic ? cream : navy; ctx.font = '500 40px "DM Sans", sans-serif';
    wrap(ctx, it.summary, W / 2, py + 140, 880, 54, 2);
    // footer band
    ctx.fillStyle = toxic ? cream : navy; ctx.fillRect(0, H - 110, W, 110);
    ctx.fillStyle = toxic ? navy : cream; ctx.font = '700 36px "DM Sans", sans-serif';
    ctx.fillText('poochandmutt.co.uk/ingredients', W / 2, H - 45);
  }

  let dlg;
  async function open(it) {
    if (!dlg) {
      dlg = document.createElement('dialog');
      dlg.className = 'meet share';
      document.body.appendChild(dlg);
      dlg.addEventListener('click', (e) => { if (e.target === dlg) dlg.close(); });
    }
    const url = location.href.split('?')[0];
    dlg.innerHTML = `
      <div class="meet__inner">
        <button class="icon-btn meet__close" type="button" aria-label="Close">${icon('close')}</button>
        <span class="tab" style="--tab-bg:var(--superfoods)">Share card</span>
        <h2>Pass it on</h2>
        <p class="meet__sub">A collectable card for Stories, WhatsApp or the family group chat.</p>
        <canvas class="share__canvas" width="${W}" height="${H}" aria-hidden="true"></canvas>
        <img class="share__canvas share__img" alt="Share card for ${esc(it.name)}" hidden>
        <p class="meet__privacy share__hint" hidden>Press and hold (or right-click) the card to save it.</p>
        <div class="share__actions">
          <button class="btn btn--sun" type="button" data-share>${icon('share')} Share</button>
          <button class="btn btn--ghost" type="button" data-copy>Copy text</button>
        </div>
        <p class="meet__privacy share__msg" aria-live="polite"></p>
      </div>`;
    const canvas = dlg.querySelector('canvas');
    const msg = dlg.querySelector('.share__msg');
    dlg.querySelector('.meet__close').addEventListener('click', () => dlg.close());
    dlg.showModal();
    await draw(canvas, it);

    // Show the card as a real image so it can be saved with press-and-hold / right-click (downloads are blocked in some viewers)
    let blob = null;
    try { blob = await new Promise((r) => canvas.toBlob(r, 'image/png')); } catch (e) { blob = null; } // file:// taints the canvas
    if (blob) {
      const img = dlg.querySelector('.share__img');
      img.src = URL.createObjectURL(blob);
      img.hidden = false; canvas.hidden = true;
      dlg.querySelector('.share__hint').hidden = false;
    }
    const file = blob ? new File([blob], `pooch-and-mutt-${it.slug}.png`, { type: 'image/png' }) : null;
    const text = `${it.name}: ${PM.VERDICTS[it.verdict].label}. ${it.summary} From the Pooch & Mutt Ingredient Index.`;

    async function copy() {
      try { await navigator.clipboard.writeText(text); msg.textContent = 'Copied. Paste it into WhatsApp or anywhere you like.'; }
      catch (e) { msg.textContent = text; }
    }
    dlg.querySelector('[data-share]').addEventListener('click', async () => {
      try {
        if (file && navigator.canShare && navigator.canShare({ files: [file] })) { await navigator.share({ files: [file], title: it.name, text }); return; }
        if (navigator.share) { await navigator.share({ title: it.name, text, url }); return; }
      } catch (e) {
        if (e && e.name === 'AbortError') return; // the person closed the share sheet
      }
      copy(); // sharing unavailable here: fall back to copying the text
    });
    dlg.querySelector('[data-copy]').addEventListener('click', copy);
  }

  window.ShareCard = { open, draw };
})();
