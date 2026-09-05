/* Auto Crop: sequentially uses the same harvest and planting paths as cards. */

const autoCropPanel = document.querySelector('#auto-crop-panel');
const AUTO_CROP_STORAGE_KEY = 'sunflower-tools:auto-crop-seeds';
let autoCropRunning = false;
let autoCropStopRequested = false;
let autoCropStatus = 'Chọn chế độ rồi bắt đầu Auto Crop.';
let autoCropLastCardSignature = '';
let autoTreeRunning = false;
let autoTreeStopRequested = false;
let autoTreeStatus = 'Sẵn sàng theo dõi Tree.';
let autoTreeLastCardSignature = '';
let autoCropSeedOrder = (() => {
  try { return JSON.parse(localStorage.getItem(AUTO_CROP_STORAGE_KEY) || '[]'); } catch { return []; }
})();

function autoCropSeeds() {
  // Auto Crop only receives seeds explicitly categorised by the game as Crop.
  // Flowers, Fruit and every other profession stay out of this workflow.
  return (lastBettyScan?.items || []).filter((item) => /\bcrops?\b/i.test(String(item.category || '')) && /seed$/i.test(String(item.name || '')));
}

function saveAutoCropSeedOrder() {
  localStorage.setItem(AUTO_CROP_STORAGE_KEY, JSON.stringify(autoCropSeedOrder));
}

function escapeAuto(value) {
  return typeof escapeHtml === 'function' ? escapeHtml(String(value || '')) : String(value || '');
}

function renderAutoCropPanel() {
  if (!autoCropPanel) return;
  const seeds = autoCropSeeds();
  const order = new Map(autoCropSeedOrder.map((name, index) => [seedInventoryKey(name), index + 1]));
  const seedMarkup = seeds.length
    ? seeds.map((seed) => {
      const position = order.get(seedInventoryKey(seed));
      return `<button class="auto-seed-choice${position ? ' is-selected' : ''}" type="button" data-auto-seed="${escapeAuto(seed.name)}"${autoCropRunning ? ' disabled' : ''}><img src="${escapeAuto(seed.icon)}" alt="" /><strong><b>${escapeAuto(seed.name.replace(/\s+seed$/i, ''))}</b><small>×${getSeedCount(seed)}</small></strong>${position ? `<em>${position}</em>` : ''}</button>`;
    }).join('')
    : `<div class="empty-state">Chưa có hạt Crop. <button class="auto-betty-scan" type="button" data-auto-scan-betty="true">⟳ Quét Betty</button></div>`;
  const axeCount = toolBagScanned ? Math.max(0, Number(toolCounts.get(axeIcon) || 0)) : '—';
  autoCropPanel.innerHTML = `<div class="auto-crop-box"><div class="auto-crop-heading"><h2>Auto Crop</h2><span>${autoCropRunning ? 'Đang chạy' : 'Sẵn sàng'}</span></div><p class="auto-crop-hint">Bấm các hạt bên dưới để chọn thứ tự trồng. Bấm lại để bỏ.</p><div class="auto-seed-list">${seedMarkup}</div><button class="auto-crop-run${autoCropRunning ? ' is-stop' : ''}" type="button" data-auto-run="true">${autoCropRunning ? 'Dừng sau thao tác hiện tại' : 'Bắt đầu Auto Crop'}</button><p class="auto-crop-status">${escapeAuto(autoCropStatus)}</p></div><div class="auto-tree-box"><div class="auto-crop-heading"><h2>Auto Tree</h2><span>Axe ×${axeCount}</span></div><p class="auto-crop-hint">Chặt Tree sau khi Quét Tree xác nhận sẵn sàng.</p><button class="auto-tree-run${autoTreeRunning ? ' is-stop' : ''}" type="button" data-auto-tree-run="true">${autoTreeRunning ? 'Dừng sau thao tác hiện tại' : 'Bắt đầu Auto Tree'}</button><p class="auto-crop-status">${escapeAuto(autoTreeStatus)}</p></div>`;
}

const autoSleep = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

async function waitAuto(predicate, timeout = 15000) {
  const deadline = Date.now() + timeout;
  while (Date.now() < deadline) {
    if (predicate()) return true;
    await autoSleep(60);
  }
  return false;
}

async function scanBettyForAuto() {
  if (scanBettyButton.disabled) return;
  autoCropStatus = 'Đang mở và quét Betty…';
  renderAutoCropPanel();
  scanBettyButton.click();
  const scanned = await waitAuto(() => !scanBettyButton.disabled, 18000);
  autoCropStatus = scanned && autoCropSeeds().length
    ? 'Đã nhận danh sách hạt. Hãy chọn thứ tự Auto Crop.'
    : 'Không lấy được hạt từ Betty. Hãy thử lại.';
  renderAutoCropPanel();
}

function autoCropCardSignature() {
  const section = autoCropOverviewSection();
  return Array.from(section?.querySelectorAll('.crop-card') || []).map((card) => [
    card.classList.contains('is-ready') ? 'ready' : card.classList.contains('is-empty') ? 'empty' : card.classList.contains('is-growing') ? 'growing' : 'other',
    card.dataset.mapKeys || '',
    card.dataset.count || '',
    card.querySelector('.crop-card-title')?.textContent?.trim() || ''
  ].join('|')).sort().join('||');
}

async function verifyAutoCropCards(reason = '') {
  autoCropStatus = `Đang quét Crop${reason ? ` · ${reason}` : ''}…`;
  renderAutoCropPanel();
  await scanMap('crop');
  if (!lastScanData) throw new Error('Không thể đọc Map để Auto Crop.');
  autoCropLastCardSignature = autoCropCardSignature();
}

function autoCropOverviewSection() {
  return Array.from(overviewResults?.querySelectorAll('.overview-section') || []).find((section) => /^Crop(?:\s|$)/i.test(section.querySelector('h2')?.textContent?.trim() || '')) || null;
}

function autoTreeOverviewSection() {
  return Array.from(overviewResults?.querySelectorAll('.overview-section') || []).find((section) => /^Tree(?:\s|$)/i.test(section.querySelector('h2')?.textContent?.trim() || '')) || null;
}

function autoTreeCardSignature() {
  const section = autoTreeOverviewSection();
  return Array.from(section?.querySelectorAll('.tree-card[data-resource="tree"]') || []).map((card) => [
    card.classList.contains('is-ready') ? 'ready' : 'growing', card.dataset.mapKeys || '', card.dataset.count || '', card.dataset.treeRefreshPending || ''
  ].join('|')).sort().join('||');
}

async function verifyAutoTreeCards(reason = '') {
  autoTreeStatus = `Đang quét Tree${reason ? ` · ${reason}` : ''}…`;
  renderAutoCropPanel();
  await scanMap('tree');
  if (!lastScanData?.trees) throw new Error('Không thể đọc Tree để Auto Tree.');
  autoTreeLastCardSignature = autoTreeCardSignature();
}

async function ensureAutoTreeAxe() {
  if (toolBagScanned && Number.isFinite(Number(toolCounts.get(axeIcon)))) return;
  autoTreeStatus = 'Đang quét Tools để kiểm tra Axe…';
  renderAutoCropPanel();
  scanToolsButton.click();
  const scanned = await waitAuto(() => !scanToolsButton.disabled && toolBagScanned, 18000);
  if (!scanned) throw new Error('Không quét được Tools để kiểm tra Axe.');
}

async function autoChopReadyTrees() {
  let felled = 0;
  while (!autoTreeStopRequested) {
    const axes = Number(toolCounts.get(axeIcon) || 0);
    if (axes <= 0) break;
    const card = autoTreeOverviewSection()?.querySelector('.tree-card[data-resource="tree"].is-ready');
    if (!card) break;
    autoTreeStatus = `Đang chặt Tree · Axe ×${axes}…`; renderAutoCropPanel();
    const result = await chopTrees(card);
    if (!result?.processed) break;
    felled += Number(result.felled || 0);
    const states = await readTreeStates(result.felledKeys || []);
    if (states.length) applyTreeStates(states);
    renderOverview();
    startCountdowns();
    if (Number(toolCounts.get(axeIcon) || 0) <= 0) break;
    await autoSleep(100);
  }
  return felled;
}

async function runAutoTree() {
  if (autoTreeRunning) { autoTreeStopRequested = true; return; }
  autoTreeRunning = true;
  window.autoTreeAutomationRunning = true;
  autoTreeStopRequested = false;
  let felled = 0;
  try {
    renderAutoCropPanel();
    await ensureAutoTreeAxe();
    if (Number(toolCounts.get(axeIcon) || 0) <= 0) {
      autoTreeStatus = 'Đã dừng: hết Axe.';
      return;
    }
    if (!lastScanData?.trees) await verifyAutoTreeCards('khởi tạo');
    autoTreeLastCardSignature = autoTreeCardSignature();
    while (!autoTreeStopRequested) {
      const signature = autoTreeCardSignature();
      if (signature !== autoTreeLastCardSignature) await verifyAutoTreeCards('card đổi trạng thái');
      const chopped = await autoChopReadyTrees();
      felled += chopped;
      if (chopped && !autoTreeStopRequested) await verifyAutoTreeCards('đã chặt');
      if (Number(toolCounts.get(axeIcon) || 0) <= 0) {
        autoTreeStatus = `Đã dừng: hết Axe · đã chặt ${felled} Tree.`;
        break;
      }
      if (!autoTreeStopRequested) {
        autoTreeStatus = `Đang chờ Tree sẵn sàng · Axe ×${toolCounts.get(axeIcon) || 0}.`;
        renderAutoCropPanel();
        await autoSleep(2000);
      }
    }
    if (autoTreeStopRequested) autoTreeStatus = `Đã dừng Auto Tree · đã chặt ${felled} Tree.`;
  } catch (error) {
    autoTreeStatus = error.message || 'Auto Tree thất bại.';
    logActionError(autoTreeStatus);
  } finally {
    autoTreeRunning = false;
    window.autoTreeAutomationRunning = false;
    autoTreeStopRequested = false;
    renderAutoCropPanel();
  }
}

async function autoHarvestReadyCrops() {
  let harvested = 0;
  while (!autoCropStopRequested) {
    const card = autoCropOverviewSection()?.querySelector('.crop-card.is-ready');
    if (!card) break;
    autoCropStatus = `Đang thu hoạch Crop (${harvested + 1})…`; renderAutoCropPanel();
    const result = await harvestCrops(card);
    if (result?.stopped) throw new Error(`Auto dừng ở mini game ${result.stopped}.`);
    if (!result?.harvested) break;
    harvested += result.harvested;
    moveHarvestedCropsToEmpty(result.harvestedKeys || []);
    renderOverview();
    startCountdowns();
    await autoSleep(100);
  }
  return harvested;
}

async function autoPlantSeed(seed) {
  selectedPlantSeed = { ...seed, count: getSeedCount(seed) };
  renderOverview();
  let planted = 0;
  while (!autoCropStopRequested && getSeedCount(seed) > 0) {
    const button = autoCropOverviewSection()?.querySelector('.empty-crop-plant:not(:disabled)');
    if (!button) break;
    const countBefore = getSeedCount(seed);
    autoCropStatus = `Đang trồng ${seed.name.replace(/\s+seed$/i, '')}…`; renderAutoCropPanel();
    button.click();
    const completed = await waitAuto(() => !button.isConnected || !button.disabled, 35000);
    if (!completed) throw new Error(`Trồng ${seed.name} quá thời gian chờ.`);
    const used = Math.max(0, countBefore - getSeedCount(seed));
    if (!used) break;
    planted += used;
    // The same selected seed remains active until its actual inventory count
    // reaches zero. Re-render now so its count changes after every planting.
    autoCropStatus = `Đã trồng ${seed.name.replace(/\s+seed$/i, '')}: còn ×${getSeedCount(seed)}.`;
    renderAutoCropPanel();
    // Planting replaces an empty card with a growing card. Verify that
    // transition from the game before using the card list again.
    if (!autoCropStopRequested) await verifyAutoCropCards('đã trồng');
    await autoSleep(100);
  }
  return planted;
}

async function runAutoCrop() {
  if (autoCropRunning) { autoCropStopRequested = true; return; }
  autoCropRunning = true;
  autoCropStopRequested = false;
  let harvested = 0;
  let planted = 0;
  try {
    renderAutoCropPanel();
    // Use the visible cards as the working state. A scoped Crop scan is only
    // needed initially, or after those cards change state.
    if (!lastScanData) await verifyAutoCropCards('khởi tạo');
    autoCropLastCardSignature = autoCropCardSignature();
    // Keep polling until the user asks to stop. A cycle may do nothing while
    // crops are growing, then harvest and replant as soon as they are ready.
    while (!autoCropStopRequested) {
      const currentSignature = autoCropCardSignature();
      if (currentSignature !== autoCropLastCardSignature) await verifyAutoCropCards('card đổi trạng thái');
      const harvestedNow = await autoHarvestReadyCrops();
      harvested += harvestedNow;
      if (harvestedNow && !autoCropStopRequested) await verifyAutoCropCards('đã thu hoạch');
      if (autoCropStopRequested) break;
      const available = autoCropSeeds();
      const configuredSeeds = autoCropSeedOrder.map((name) => available.find((seed) => seedInventoryKey(seed) === seedInventoryKey(name))).filter(Boolean);
      if (!configuredSeeds.length) throw new Error(available.length ? 'Hãy chọn ít nhất một hạt cho Auto Crop.' : 'Hãy quét Betty Market rồi chọn hạt cho Auto Crop.');
      // A chosen seed can already be ×0. Skip it rather than disabling the
      // empty-soil card and stopping before the next chosen seed is tried.
      const seeds = configuredSeeds.filter((seed) => getSeedCount(seed) > 0);
      if (!seeds.length) {
        autoCropStatus = 'Đang chờ hạt Crop trong túi…';
        renderAutoCropPanel();
        await autoSleep(2000);
        continue;
      }
      for (const seed of seeds) {
        if (autoCropStopRequested) break;
        const heldBefore = getSeedCount(seed);
        const emptyBefore = Array.from(autoCropOverviewSection()?.querySelectorAll('.crop-card.is-empty') || []).reduce((total, card) => total + Math.max(1, Number(card.dataset.count || 0)), 0);
        const plantedWithSeed = await autoPlantSeed(seed);
        planted += plantedWithSeed;
        const heldAfter = getSeedCount(seed);
        // Never advance just because a card was temporarily re-rendered. The
        // next seed is allowed only after the held stack is actually empty.
        // When empty soil is at least the held stack, autoPlantSeed completes
        // that whole batch first and this count becomes zero.
        if (heldAfter > 0) {
          autoCropStatus = `Giữ ${seed.name.replace(/\s+seed$/i, '')} đang cầm: còn ×${heldAfter}${emptyBefore >= heldBefore ? ' · chờ xác minh lượt trồng' : ''}.`;
          renderAutoCropPanel();
          break;
        }
        // The selected seed may be exhausted, making its button disabled.
        // Check the soil card itself so Auto can continue with the next seed.
        const hasSoil = Boolean(autoCropOverviewSection()?.querySelector('.crop-card.is-empty'));
        if (!hasSoil) break;
      }
      if (autoCropStopRequested) break;
      autoCropStatus = `Đang chờ lượt tiếp theo · Thu hoạch ${harvested}, trồng ${planted}.`;
      renderAutoCropPanel();
      await autoSleep(2000);
    }
    autoCropStatus = `Đã dừng Auto Crop · Thu hoạch ${harvested}, trồng ${planted}.`;
    log(autoCropStatus);
  } catch (error) {
    autoCropStatus = error.message || 'Auto Crop thất bại.';
    logActionError(autoCropStatus);
  } finally {
    autoCropRunning = false;
    autoCropStopRequested = false;
    renderAutoCropPanel();
  }
}

autoCropPanel?.addEventListener('click', (event) => {
  if (event.target.closest('[data-auto-tree-run]')) {
    void runAutoTree();
    return;
  }
  if (event.target.closest('[data-auto-scan-betty]') && !autoCropRunning) {
    void scanBettyForAuto();
    return;
  }
  const seedButton = event.target.closest('[data-auto-seed]');
  if (seedButton && !autoCropRunning) {
    const name = seedButton.dataset.autoSeed;
    const key = seedInventoryKey(name);
    const index = autoCropSeedOrder.findIndex((item) => seedInventoryKey(item) === key);
    if (index >= 0) autoCropSeedOrder.splice(index, 1); else autoCropSeedOrder.push(name);
    saveAutoCropSeedOrder();
    renderAutoCropPanel();
    return;
  }
  if (event.target.closest('[data-auto-run]')) void runAutoCrop();
});
