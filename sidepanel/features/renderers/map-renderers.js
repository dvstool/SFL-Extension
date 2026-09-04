/* Lightweight map renderers; action handlers remain in the coordinator. */

function renderActivityCards(container, title, activity, label, cards) {
  if (!cards.length) return;
  let grid = container.querySelector(`[data-activity="${activity}"] .crop-grid`);
  if (!grid) {
    const panelKey = title === 'Sẵn sàng' ? 'ready' : title === 'Đang hồi' ? 'growing' : 'blocked';
    let panel = container.querySelector(`[data-crop-panel="${panelKey}"]`);
    if (!panel) {
      container.insertAdjacentHTML('beforeend', `<section class="crop-panel" data-crop-panel="${panelKey}"><h2>${title}</h2></section>`);
      panel = container.querySelector(`[data-crop-panel="${panelKey}"]`);
    }
    panel.insertAdjacentHTML('beforeend', `<div class="activity-group" data-activity="${activity}"><h3>${label}</h3><div class="crop-section"><div class="crop-grid"></div></div></div>`);
    grid = panel.querySelector(`[data-activity="${activity}"] .crop-grid`);
  }
  grid.insertAdjacentHTML('beforeend', cards.join(''));
}

function renderCropScan(data) {
  countdownTargets.clear();
  lastScanData = data;
  const now = Date.now();
  const runningCards = Array.from(cropResults.querySelectorAll('.crop-card[data-countdown-target]'));
  data.growing.forEach((item) => {
    if (!Number.isFinite(item.seconds)) return;
    const itemKeys = new Set(item.mapKeys || []);
    const candidates = runningCards.filter((card) => card.dataset.cropName === item.label && Number(card.dataset.fertiliserType) === Number(item.fertiliserType) && card.dataset.mapKeys.split('||').some((key) => itemKeys.has(key)));
    const closest = candidates.map((card) => (Number(card.querySelector('[data-countdown-target]').dataset.countdownTarget) - now) / 1000).filter((seconds) => seconds > 0).sort((left, right) => Math.abs(left - item.seconds) - Math.abs(right - item.seconds))[0];
    if (Number.isFinite(closest)) item.seconds = Math.min(item.seconds, closest);
  });
  cropResults.innerHTML = '';
  cropGrowingResults.innerHTML = '';
  blockedResults.innerHTML = '';
  renderOverview();
  activateMapActivityTab(mapActivityTabs.find((tab) => tab.classList.contains('is-active'))?.dataset.mapActivityTab || 'overview');
  startCountdowns();
}

function treeCard(item, type) {
  const growing = type === 'growing';
  const hasCountdown = growing && Number.isFinite(item.seconds) && item.seconds > 0;
  const axeCount = toolBagScanned ? (toolCounts.get(axeIcon) ?? 0) : '—';
  const treeCount = Number(item.count || 0);
  const maxChops = Number.isFinite(Number(axeCount)) ? Math.min(treeCount, Math.max(0, Number(axeCount))) : treeCount;
  const action = growing ? '' : !toolBagScanned ? '<div class="crop-card-actions"><button type="button" data-ui-action="scan-tools">Quét Tools</button></div>' : `<div class="crop-card-actions"><button type="button" data-ui-action="chop" data-action-label="Chặt x${maxChops}"${maxChops ? '' : ' disabled'}>Chặt x${maxChops}</button></div>`;
  const toolBadgeState = toolBagScanned && !Number(axeCount) ? ' is-empty' : toolBagScanned ? '' : ' is-unscanned';
  const toolBadge = `<span class="resource-tool-count${toolBadgeState}" title="Axe ×${escapeHtml(axeCount)}"><img src="${escapeHtml(axeIcon)}" alt="" /><b>×${escapeHtml(axeCount)}</b></span>`;
  const detail = growing ? (hasCountdown ? countdownMarkup(item) : 'Đang cập nhật thời gian…') : '';
  return `<article class="crop-card tree-card is-${growing ? 'growing' : 'ready'} ${growing ? '' : 'is-ready'}" data-resource="tree" data-map-keys="${escapeHtml((item.mapKeys || []).join('||'))}" data-count="${item.count}"><div class="crop-icon-box"><img class="crop-image" src="${escapeHtml(item.icon)}" alt="Tree" /><b class="crop-quantity">×${item.count}</b></div><div class="crop-card-content"><span class="crop-card-state">${growing ? 'Đang hồi' : 'Sẵn sàng'}</span><strong class="crop-card-title">Tree</strong>${detail ? `<span class="crop-card-meta">${detail}</span>` : ''}</div>${toolBadge}${action}</article>`;
}

function renderTreeScan() {
  treeResults.innerHTML = '';
  treeGrowingResults.innerHTML = '';
  renderOverview();
  activateMapActivityTab(mapActivityTabs.find((tab) => tab.classList.contains('is-active'))?.dataset.mapActivityTab || 'crop');
}

function renderMiningScan() {
  miningResults.innerHTML = '';
  miningGrowingResults.innerHTML = '';
  renderOverview();
  activateMapActivityTab(mapActivityTabs.find((tab) => tab.classList.contains('is-active'))?.dataset.mapActivityTab || 'crop');
}

function renderFruitScan() {
  renderOverview();
  activateMapActivityTab(mapActivityTabs.find((tab) => tab.classList.contains('is-active'))?.dataset.mapActivityTab || 'crop');
}
