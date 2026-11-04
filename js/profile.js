/* M3: "Meet your dog". Device-only dog profile, dialog UI and header avatar. Exposes window.Profile */
(function () {
  const { esc, icon, store } = PM;
  const STAGES = [['puppy', 'Puppy'], ['adult', 'Adult'], ['senior', 'Senior']];
  const RHYMES = [
    ['From tasty bites', 'to zoomie nights'],
    ['From park runs', 'to troubled tums'],
    ['From sofa snugs', 'to chewing rugs']
  ];

  const get = () => store.get('profile', null);
  const sizeOf = (p) => DOG_SIZES.find((s) => s.key === (p ? p.size : store.get('size', 'medium'))) || DOG_SIZES[2];

  function save(p) {
    store.set('profile', p);
    store.set('size', p.size);
    sync();
    document.dispatchEvent(new CustomEvent('pm:profile', { detail: p }));
  }
  function forget() {
    try { localStorage.removeItem('pm:profile'); } catch (e) { /* ignore */ }
    sync();
    document.dispatchEvent(new CustomEvent('pm:profile', { detail: null }));
  }

  /* Header avatar button */
  function sync() {
    const p = get();
    let btn = document.querySelector('.dog-avatar');
    if (!btn) {
      btn = document.createElement('button');
      btn.className = 'dog-avatar';
      btn.type = 'button';
      btn.addEventListener('click', open);
      document.querySelector('.site-header__actions').prepend(btn);
    }
    const s = sizeOf(p);
    btn.innerHTML = p
      ? `<img src="img/dogs/${s.dog}.svg" alt=""><span>${esc(p.name)}</span>`
      : `<span class="dog-avatar__paw">${icon('paw')}</span><span>Add your dog</span>`;
    btn.setAttribute('aria-label', p ? `Your dog: ${p.name}. Edit` : 'Add your dog');
    btn.classList.toggle('has-dog', !!p);
  }

  /* Dialog */
  let dlg;
  function open() {
    const p = get() || { name: '', size: store.get('size', 'medium'), stage: 'adult' };
    let idx = Math.max(0, DOG_SIZES.findIndex((s) => s.key === p.size));
    if (!dlg) {
      dlg = document.createElement('dialog');
      dlg.className = 'meet';
      document.body.appendChild(dlg);
      dlg.addEventListener('click', (e) => { if (e.target === dlg) dlg.close(); });
    }
    dlg.innerHTML = `
      <form method="dialog" class="meet__inner">
        <button class="icon-btn meet__close" value="cancel" aria-label="Close">${icon('close')}</button>
        <span class="tab" style="--tab-bg:var(--superfoods)">Meet your dog</span>
        <h2>${p.name ? `Hello again, ${esc(p.name)}` : 'Who are we feeding?'}</h2>
        <p class="meet__sub">Tell us a little about them and every answer becomes theirs.</p>

        <label class="meet__label" for="meet-name">Their name</label>
        <input id="meet-name" class="meet__input" maxlength="20" autocomplete="off" placeholder="e.g. Biscuit" value="${esc(p.name)}" required>

        <p class="meet__label" id="meet-size-l">Their size</p>
        <div class="meet__stage">
          <img class="meet__dog" src="img/dogs/${DOG_SIZES[idx].dog}.svg" alt="">
          <div class="meet__shadow"></div>
        </div>
        <input class="meet__range" type="range" min="0" max="4" step="1" value="${idx}" aria-labelledby="meet-size-l" aria-valuetext="${DOG_SIZES[idx].label}, ${DOG_SIZES[idx].range}">
        <p class="meet__size"><strong>${DOG_SIZES[idx].label}</strong> · ${DOG_SIZES[idx].range}</p>

        <p class="meet__label" id="meet-stage-l">Life stage</p>
        <div class="meet__stages" role="radiogroup" aria-labelledby="meet-stage-l">
          ${STAGES.map(([k, l]) => `<button type="button" class="chip" role="radio" aria-checked="${p.stage === k}" aria-pressed="${p.stage === k}" data-stage="${k}">${l}</button>`).join('')}
        </div>

        <button class="btn btn--sun meet__save" value="save">${icon('paw')} <span>Save ${esc(p.name || 'my dog')}</span></button>
        <p class="meet__privacy">Saved only on this device. No account, no emails.</p>
        ${get() ? '<button type="button" class="meet__forget">Forget my dog</button>' : ''}
      </form>`;

    const name = dlg.querySelector('#meet-name');
    const range = dlg.querySelector('.meet__range');
    const dogImg = dlg.querySelector('.meet__dog');
    let stage = p.stage;

    range.addEventListener('input', () => {
      idx = +range.value;
      const s = DOG_SIZES[idx];
      dogImg.src = `img/dogs/${s.dog}.svg`;
      dogImg.style.setProperty('--scale', 0.55 + idx * 0.13);
      dogImg.classList.remove('is-hop'); void dogImg.offsetWidth; dogImg.classList.add('is-hop');
      dlg.querySelector('.meet__size').innerHTML = `<strong>${s.label}</strong> · ${s.range}`;
      range.setAttribute('aria-valuetext', `${s.label}, ${s.range}`);
    });
    dogImg.style.setProperty('--scale', 0.55 + idx * 0.13);
    name.addEventListener('input', () => { dlg.querySelector('.meet__save span').textContent = `Save ${name.value.trim() || 'my dog'}`; });
    dlg.querySelectorAll('[data-stage]').forEach((b) => b.addEventListener('click', () => {
      stage = b.dataset.stage;
      dlg.querySelectorAll('[data-stage]').forEach((x) => { const on = x === b; x.setAttribute('aria-checked', on); x.setAttribute('aria-pressed', on); });
    }));
    const forgetBtn = dlg.querySelector('.meet__forget');
    if (forgetBtn) forgetBtn.addEventListener('click', () => { forget(); dlg.close(); toast('All forgotten. Come back any time.'); });

    dlg.querySelector('form').addEventListener('submit', (e) => {
      if (e.submitter && e.submitter.value === 'cancel') return;
      const n = name.value.trim();
      if (!n) { e.preventDefault(); name.focus(); return; }
      const isNew = !get();
      save({ name: n, size: DOG_SIZES[idx].key, stage });
      if (isNew) {
        const [a, b] = RHYMES[Math.floor(Math.random() * RHYMES.length)];
        toast(`Nice to meet you, ${n}! ${a} ${'&'} ${b}, we’ve got you.`);
      } else toast(`Updated. Every answer is now ${n}-shaped.`);
    });

    dlg.showModal();
    if (!p.name) name.focus();
  }

  /* Toast */
  function toast(msg) {
    let t = document.querySelector('.toast');
    if (!t) { t = document.createElement('div'); t.className = 'toast'; t.setAttribute('role', 'status'); document.body.appendChild(t); }
    t.innerHTML = `<span class="toast__paw">${icon('paw')}</span>${esc(msg)}`;
    t.classList.remove('is-on'); void t.offsetWidth; t.classList.add('is-on');
    clearTimeout(t._h); t._h = setTimeout(() => t.classList.remove('is-on'), 4200);
  }

  // Re-render the current view when the profile changes, so copy and portions update everywhere
  document.addEventListener('pm:profile', () => Router.refresh());

  window.Profile = { get, open, save, forget, sizeOf, toast, sync };
})();
