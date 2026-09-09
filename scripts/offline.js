(() => {
  const tabs = Array.from(document.querySelectorAll('.activity-tab'));
  const cards = Array.from(
    document.querySelectorAll('.activity-grid .project-card'),
  );
  const panel = document
    .querySelector('.activity-grid')
    ?.closest('[role="tabpanel"]');

  function selectCategory(index, focus = false) {
    const selected = tabs[index];
    const category = selected.childNodes[0].textContent.trim();
    tabs.forEach((tab) => {
      const active = tab === selected;
      tab.setAttribute('aria-selected', String(active));
      tab.toggleAttribute('data-active', active);
      tab.tabIndex = active ? 0 : -1;
      if (panel) tab.setAttribute('aria-controls', panel.id);
    });
    if (panel) panel.setAttribute('aria-labelledby', selected.id);
    cards.forEach((card) => {
      card.hidden = index !== 0 && card.dataset.category !== category;
    });
    if (focus) selected.focus();
  }
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => selectCategory(index));
    tab.addEventListener('keydown', (event) => {
      const keys = ['ArrowLeft', 'ArrowRight', 'Home', 'End'];
      if (!keys.includes(event.key)) return;
      event.preventDefault();
      const next =
        event.key === 'Home'
          ? 0
          : event.key === 'End'
            ? tabs.length - 1
            : (index + (event.key === 'ArrowRight' ? 1 : -1) + tabs.length) %
              tabs.length;
      selectCategory(next, true);
    });
  });
  if (tabs.length) selectCategory(0);

  const record = document.querySelector('#offline-activity-data');
  if (!record) return;
  const images = JSON.parse(record.textContent);
  const buttons = Array.from(document.querySelectorAll('.gallery-item'));
  const dialog = document.createElement('dialog');
  dialog.className = 'offline-viewer';
  dialog.setAttribute('aria-labelledby', 'offline-viewer-title');
  dialog.innerHTML = `
    <div class="viewer-toolbar">
      <div><h2 class="viewer-title" id="offline-viewer-title"></h2><p class="viewer-description"></p></div>
      <div class="viewer-actions">
        <button type="button" class="viewer-icon" data-action="zoom" aria-label="放大图片" aria-pressed="false">＋</button>
        <button type="button" class="viewer-icon" data-action="close" aria-label="关闭图片">×</button>
      </div>
    </div>
    <div class="viewer-scroll" tabindex="0" aria-label="图片内容，可滚动查看"><div class="viewer-image-stack"></div></div>
    <div class="viewer-footer"><button type="button" data-action="previous">← 上一张</button><span>← → 切换 · Esc 关闭</span><button type="button" data-action="next">下一张 →</button></div>`;
  document.body.append(dialog);
  const scroll = dialog.querySelector('.viewer-scroll');
  const stack = dialog.querySelector('.viewer-image-stack');
  const zoomButton = dialog.querySelector('[data-action="zoom"]');
  let current = 0;
  let zoomed = false;
  let previousOverflow = '';
  let opener;

  function setZoom(value) {
    zoomed = value;
    scroll.classList.toggle('is-zoomed', zoomed);
    stack.style.width = zoomed
      ? `${Math.min(images[current].parts[0].width, 2400)}px`
      : '';
    zoomButton.setAttribute('aria-pressed', String(zoomed));
    zoomButton.setAttribute('aria-label', zoomed ? '适应屏幕' : '放大图片');
    zoomButton.textContent = zoomed ? '−' : '＋';
  }
  function render(index) {
    current = (index + images.length) % images.length;
    const image = images[current];
    const label = buttons[current].querySelector('img').alt;
    dialog.querySelector('.viewer-title').textContent = label;
    dialog.querySelector('.viewer-description').textContent =
      `${current + 1} / ${images.length} · ${image.kind === 'long' ? '向下滚动查看完整长图' : '活动现场与宣传记录'}`;
    stack.classList.toggle('is-long', image.kind === 'long');
    stack.replaceChildren(
      ...image.parts.map((part, index) => {
        const img = document.createElement('img');
        img.src = part.src;
        img.width = part.width;
        img.height = part.height;
        img.alt = `${label}${image.parts.length > 1 ? `，第 ${index + 1} 部分` : ''}`;
        img.loading = index === 0 ? 'eager' : 'lazy';
        img.decoding = 'async';
        return img;
      }),
    );
    dialog.querySelector('.viewer-footer').hidden = images.length < 2;
    setZoom(false);
    scroll.scrollTo(0, 0);
  }
  buttons.forEach((button, index) =>
    button.addEventListener('click', () => {
      opener = button;
      previousOverflow = document.body.style.overflow;
      render(index);
      dialog.showModal();
      document.body.style.overflow = 'hidden';
    }),
  );
  dialog.addEventListener('click', (event) => {
    const action = event.target.closest('[data-action]')?.dataset.action;
    if (action === 'close' || event.target === dialog) dialog.close();
    if (action === 'zoom') setZoom(!zoomed);
    if (action === 'previous') render(current - 1);
    if (action === 'next') render(current + 1);
  });
  dialog.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      render(current + (event.key === 'ArrowRight' ? 1 : -1));
    }
  });
  dialog.addEventListener('close', () => {
    document.body.style.overflow = previousOverflow;
    opener?.focus();
  });
})();
