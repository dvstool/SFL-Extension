const status = document.querySelector('#connection-status');
const siteLabel = document.querySelector('#site-label');
const disconnectedContent = document.querySelector('#disconnected-content');
const connectedContent = document.querySelector('#connected-content');
const landInfo = document.querySelector('#land-info');
const scanMapButton = document.querySelector('#scan-map');
const cropResults = document.querySelector('#crop-results');
const treeResults = document.querySelector('#tree-results');
const miningResults = document.querySelector('#mining-results');
const cropGrowingResults = document.querySelector('#crop-growing-results');
const treeGrowingResults = document.querySelector('#tree-growing-results');
const miningGrowingResults = document.querySelector('#mining-growing-results');
const blockedResults = document.querySelector('#blocked-results');
const panelLog = document.querySelector('#panel-log');
const connectButton = document.querySelector('#connect-button');
const scanFertilisersButton = document.querySelector('#scan-fertilisers');
const scanBettyButton = document.querySelector('#scan-betty');
const scanToolsButton = document.querySelector('#scan-tools');
const shopResults = document.querySelector('#shop-results');
const seedPickerResults = document.querySelector('#seed-picker-results');
const workbenchResults = document.querySelector('#workbench-results');
const marketTabContent = document.querySelector('#market-tab-content');
const workbenchTabContent = document.querySelector('#workbench-tab-content');
const overviewResults = document.querySelector('#overview-results');
const reloadExtensionButton = document.querySelector('#reload-extension');
const codeRelease = document.querySelector('#code-release');
const readyNotificationsToggle = document.querySelector('#ready-notifications');
const notificationStatus = document.querySelector('#notification-status');
const toolTabs = Array.from(document.querySelectorAll('[data-tool-tab]'));
const toolTabPanels = Array.from(document.querySelectorAll('[data-tool-panel]'));
const mapActivityTabs = Array.from(document.querySelectorAll('[data-map-activity-tab]'));
const seedPickerTab = document.querySelector('[data-map-activity-tab="seeds"]');
const mapActivityContent = document.querySelector('#map-activity-content');
const seasonIcons = {
  spring: 'data:image/webp;base64,UklGRmwAAABXRUJQVlA4TF8AAAAvCkADECegoG0bNlQ+fwQmECBDMgygoG0bph/Z+EOa5j8A8Hs8O1+BISTJrmYNLhC8fwQvCCR/rM8Q0f8Acxe23xR7zcRenWSvbyW7zhK73hS91hRWM4HmApoALP5wAAA=',
  summer: 'data:image/webp;base64,UklGRpIAAABXRUJQVlA4TIYAAAAvDoADEDegoG0bpvx5lNj+5aMgbQMmgubf3VHUtg1UICVX9heCaZ/5D4CcuhG2Pf/HENhGkuRkrPNf+oRAXRGA9v8ffE3+OagYIvpPIGmzF7g1gJXXiPJ039V2C8R2Gc1TMckJTMGYUViTM6ZsxKymLlbWpKplg6lRHQXirMX//P46flwfJw==',
  autumn: 'data:image/webp;base64,UklGRpgAAABXRUJQVlA4TIsAAAAvDIADED+gqI0UaHfx7wv+WDgF4EUhI0nM+QOdwjeQZ+hR2kgS8pqhq++/DPLv5j8AEF8LzeukiCe6eJYJbCPbVnKyG+MNfIk/mls/zut/oIiI/k8AIL778dMUAlN0MjVHdJYpll1fOE1z28+t9sn53mhSN3SZYtkOudM+O7+eMC1bJ9jtMYD95ccAAA==',
  winter: 'data:image/webp;base64,UklGRoAAAABXRUJQVlA4THQAAAAvDoADECdApG0z/wLGJ/L4NgiybUYztEkd9mraNmDCs/zfIljzH4D/tyhTAatIsuLMxzMAKCCJgXcI4PKvKg8NEf1X2LYNMmZ4Axj88ROAceo6QFhzE/i0WheI5s2FYVbNFl9R1dIliRS+tOW70x/Xv2AAAA=='
};
const fertiliserIcon = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAANCAMAAACn6Q83AAAABGdBTUEAALGOfPtRkwAAACFQTFRFAAAAwMvcWmmIGBQl////JlxCY8dNJitEeMVop/+Ukv96pgoFnAAAAAt0Uk5TAP////////////99dn3VAAAAOElEQVQImVXMMQ4AMAgCQBck8f8PLqIdZLoEQoRCxoaZ/Koat8Yjm7URgQZwqFPXvGc9cX2ptZcPwv4Cs0IVRlAAAAAASUVORK5CYII=';
const cropFertiliserIcons = [
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAICAYAAADA+m62AAAAAXNSR0IArs4c6QAAAKtJREFUGJVtkLEKglAYhb8b2dLWEkJLlxLa0iVcbGzsYXwOHyoXadExqNAluGjQpgQOtngvCZ7x45z/5xxBrzDwO0YUxYkAENq029oUhwW2NwdApTXr64fbQxHFiZiGgd+dT3sAvt4MgKzNcT2J87Zw5BKgm+gX97wE4PJ64lpywACMsU9yXG3I2nzAjLGpFE2lUGkNgGtJVFobPrhYlLUpoQOaDVqPTfM/0Q81AUYm90CvAwAAAABJRU5ErkJggg==',
  'data:image/webp;base64,UklGRroAAABXRUJQVlA4TK0AAAAvD8ADEE+gkJEk5lQO4BWa1VM9x5M0IzWNpEBn4SowQI00hKLoj9pIUht8B2S2CPqviFGubP4DAPW76xkfokZNJc/nFxEozuCotra4+TvuayEKOoACDgqge1YZDLQWwABJ/LYe3hfR/wkweAmA+5uTAUmeH14Y3EPM7mQkn2PCCPml6Ix7wHGy0vfg9uXatyU4tWXa9lG0T9n2m2jXstUBtWupGpCuvVXQtnz/AgA='
];
const fruitFertiliserIcons = [
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAICAYAAADA+m62AAAAAXNSR0IArs4c6QAAALVJREFUGJVt0LFqwmAUhuEnwaHgItIQMqUVW+jWKeDi2rEX43V4Uy5CbkBopa1T+GsJLjab6RKLAb/x5T2cc75Il8V81rqS5WodQXSWnh4yt19HRToGZaj93A1t3ivL1ToaLOaz9vXlGUybAzjt9oo8sZ2MPE5SaOPzirePAA7bSpwnPQb/YjdpNM2cdvsegwH8flfdXY0iHYvzRBlqN0nTF+EzHGViZahdsvt0qPf1tWouK/oDwkw9oii9HTMAAAAASUVORK5CYII=',
  'data:image/webp;base64,UklGRpAAAABXRUJQVlA4TIMAAAAvD0ACEEegJgDQhDTUICXF9JX5GqmNZIN6/Rf2QagCISWIiDYgfOlezSsmidr8BwAYSSfytmZyK1i/DpvAKLbtJm/19y8OQnOAgTQD/OzpOAAL33cGDxH9nwBgNRMA60TugrUMdOGUkgfPoOeTB7qg75oHMqiseTZbVNbaVCna5PP7BQA='
];
let countdownTimer;
let treeRefreshTimer;
let petSleepTimer;
let petSleepCheckInProgress = false;
let scanMapQueue = Promise.resolve();
let lastScanData;
let marketSeasonInfo;
let selectedPlantSeed;
let lastBettyScan;
let lastToolsScan;
let seedSelectionReturnActivity = null;
let plantSeedPicking = false;
let fruitSeedPicking = false;
let selectedFruitSeed;
let seedPickerKind = 'crop';
let toolBagScanned = false;
let currentCoins = null;
let readyNotificationsEnabled = false;
const sentReadyNotifications = new Set();
const fertiliserCounts = new Map();
const toolCounts = new Map();
const seedInventory = new Map();
const composterDetails = new Map();
const countdownTargets = new Map();
const saltUpgradeFailures = new Set();
const saltUpgradeDetails = new Map();

function setCurrentCoins(value) {
  currentCoins = Math.max(0, Number(value) || 0);
  return currentCoins;
}

const cropTiers = new Map();

function seedInventoryKey(seed) {
  const name = typeof seed === 'string' ? seed : seed?.name;
  return String(name || '').replace(/\s+(?:seed|plant)$/i, '').trim().replace(/[_-]/g, ' ').replace(/\s+/g, ' ').toLowerCase();
}

function isFruitSeed(seed) {
  return Boolean(seed?.isFruitSeed || /^(apple|banana|blueberry|lemon|orange|grape)$/i.test(String(seed?.name || '').replace(/\s+(?:seed|plant)$/i, '').trim()));
}

function getSeedCount(seed) {
  const key = seedInventoryKey(seed);
  if (seedInventory.has(key)) return seedInventory.get(key);
  const fallback = seed && typeof seed === 'object' ? seed.count ?? seed.owned : 0;
  return Number(fallback) || 0;
}

function setSeedCount(seed, count) {
  const key = seedInventoryKey(seed);
  if (!key) return 0;
  const value = Math.max(0, Number(count) || 0);
  seedInventory.set(key, value);
  lastBettyScan?.items?.forEach((item) => {
    if (seedInventoryKey(item) === key) item.owned = value;
  });
  if (selectedPlantSeed && seedInventoryKey(selectedPlantSeed) === key) selectedPlantSeed.count = value;
  if (selectedFruitSeed && seedInventoryKey(selectedFruitSeed) === key) selectedFruitSeed.count = value;
  if (lastScanData?.heldSeed && seedInventoryKey(lastScanData.heldSeed) === key) lastScanData.heldSeed.count = value;
  if (lastScanData?.heldFruitSeed && seedInventoryKey(lastScanData.heldFruitSeed) === key) lastScanData.heldFruitSeed.count = value;
  return value;
}

function syncSeedInventory(items = []) {
  items.forEach((item) => setSeedCount(item, item.owned));
}
const axeIcon = 'https://sunflower-land.com/game-assets/tools/axe.png';
const pickaxeTools = {
  stone: { name: 'Pickaxe', fallback: 'https://sunflower-land.com/game-assets/tools/wood_pickaxe.png', pattern: /\/tools\/(?:wood_)?pickaxe\.png(?:[?#]|$)/i },
  iron: { name: 'Stone Pickaxe', fallback: 'https://sunflower-land.com/game-assets/tools/stone_pickaxe.png', pattern: /\/tools\/stone_pickaxe\.png(?:[?#]|$)/i },
  gold: { name: 'Iron Pickaxe', fallback: 'https://sunflower-land.com/game-assets/tools/iron_pickaxe.png', pattern: /\/tools\/iron_pickaxe\.png(?:[?#]|$)/i }
};
const saltRakeFallback = 'https://sunflower-land.com/game-assets/tools/salt_rake.webp';
const CODE_RELEASED_AT = '04/09/2026 13:08';
const beeIcon = 'data:image/webp;base64,UklGRl4AAABXRUJQVlA4TFIAAAAvCcABEC9AEECSRGhzDTfQGmQBJtOYP00iOXRFJmCxNEshuU8y8x+A/1VrdJMUELSNYkXkHODg7ggG4BU8Ef0PEgapbFrZs852/cPsP9DvEGEH';
const saltUpgradeIcon = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAAXNSR0IArs4c6QAAAJVJREFUGJV9kDEOwjAMRV8qlop7ZMnEjDKRo3TjPGy9Cdl6ABYykHugbpghTWoq0SdZlr78rW/DgnWhdrEuiNYAOhTWBXk97/ixpw5XjHYB4scegGmYAUzbmFMEkKW2CCA5RYx1oW35xzTMHACm27uJ/npkq0FXMvwEP31Kf6x35hSNUbZiUIM5xfWY3XB76Ic37XzhC+q2Mek2JJOBAAAAAElFTkSuQmCC';

codeRelease.textContent = CODE_RELEASED_AT;

function activateToolTab(tabName) {
  toolTabs.forEach((item) => {
    const active = item.dataset.toolTab === tabName;
    item.classList.toggle('is-active', active);
    item.setAttribute('aria-selected', String(active));
  });
  toolTabPanels.forEach((panel) => { panel.hidden = panel.dataset.toolPanel !== tabName; });
}

toolTabs.forEach((tab) => tab.addEventListener('click', () => activateToolTab(tab.dataset.toolTab)));

async function initialiseReadyNotifications() {
  const { readyNotificationsEnabled: enabled = true } = await chrome.storage.local.get('readyNotificationsEnabled');
  if (enabled) await chrome.storage.local.set({ readyNotificationsEnabled: true });
  readyNotificationsEnabled = enabled;
  if (readyNotificationsToggle) readyNotificationsToggle.checked = enabled;
  if (notificationStatus) notificationStatus.textContent = enabled ? 'Đang bật.' : 'Đang tắt.';
  const headerIcon = document.querySelector('.brand-icon')?.currentSrc || document.querySelector('.brand-icon')?.src || '';
  if (headerIcon) chrome.runtime.sendMessage({ type: 'SET_NOTIFICATION_HEADER_ICON', icon: headerIcon });
}

readyNotificationsToggle?.addEventListener('change', async () => {
  const enabled = readyNotificationsToggle.checked;
  readyNotificationsEnabled = enabled;
  if (notificationStatus) notificationStatus.textContent = enabled ? 'Đang gửi thông báo thử…' : 'Đang tắt.';
  try {
    if (enabled) {
      await chrome.notifications.create(`sfl-side-test-${Date.now()}`, {
        type: 'basic',
        iconUrl: saltUpgradeIcon,
        title: 'Sunflower Tools',
        message: 'Thông báo sẵn sàng đã được bật.',
        priority: 2
      });
    }
    chrome.runtime.sendMessage({ type: 'SET_READY_NOTIFICATIONS', enabled });
    if (notificationStatus && enabled) notificationStatus.textContent = 'Chrome đã tạo thông báo thử.';
  } catch (error) {
    if (notificationStatus) notificationStatus.textContent = `Lỗi thông báo: ${error.message || error}`;
  }
  if (readyNotificationsToggle.checked) syncReadyNotifications();
  else chrome.runtime.sendMessage({ type: 'SCHEDULE_READY_NOTIFICATIONS', entries: [] });
});

initialiseReadyNotifications();

function syncReadyNotifications() {
  const entries = Array.from(document.querySelectorAll('[data-countdown-target]')).map((element) => readyNotificationEntry(element.closest('.crop-card'), Number(element.dataset.countdownTarget))).filter((entry) => Number.isFinite(entry.when));
  chrome.runtime.sendMessage({ type: 'SCHEDULE_READY_NOTIFICATIONS', entries });
}

function readyNotificationEntry(card, when) {
  const title = card?.querySelector('.crop-card-title')?.textContent?.trim() || 'Tiến trình';
  const count = Number(card?.dataset.count || 1);
  const prefix = count > 1 ? `${count} ${title}` : title;
  const mapKeys = card?.dataset.mapKeys || card?.dataset.resource || title;
  const icon = document.querySelector('.brand-icon')?.currentSrc || document.querySelector('.brand-icon')?.src || saltUpgradeIcon;
  // `when` makes the same map tile eligible again after a new grow cycle.
  return { id: `${prefix}|${mapKeys}|${when}`, when, icon };
}

async function notifyReadyNow(card, when) {
  if (!readyNotificationsEnabled) return;
  const entry = readyNotificationEntry(card, when);
  if (sentReadyNotifications.has(entry.id)) return;
  sentReadyNotifications.add(entry.id);
  chrome.runtime.sendMessage({ type: 'CANCEL_READY_NOTIFICATION', id: entry.id });
  try {
    await chrome.notifications.create(`sfl-countdown-${Date.now()}`, {
      type: 'basic',
      iconUrl: entry.icon,
      title: 'Sunflower Tools',
      message: `${entry.id.split('|')[0]} đã sẵn sàng.`,
      priority: 2
    });
  } catch (error) {
    console.error('Không thể gửi thông báo hoàn tất:', error);
  }
}

function activateMapActivityTab(activity) {
  updateMapActivityTabIndicators();
  mapActivityTabs.forEach((tab) => {
    const active = tab.dataset.mapActivityTab === activity;
    tab.classList.toggle('is-active', active);
    tab.setAttribute('aria-selected', String(active));
  });
  mapActivityContent.querySelectorAll('.activity-group').forEach((group) => {
    group.hidden = group.dataset.activity !== activity;
  });
  mapActivityContent.querySelectorAll('.crop-panel').forEach((panel) => {
    panel.hidden = !panel.querySelector('.activity-group:not([hidden])');
  });
  mapActivityContent.querySelectorAll('.empty-state').forEach((state) => {
    state.hidden = activity !== 'crop' && state.dataset.activity !== activity;
  });
  updateBettyActivityFilter(activity);
  updateWorkbenchActivityFilter(activity);
}

function setSeedPicking(active) {
  document.querySelector('#map-panel')?.classList.toggle('is-picking-seed', active);
}

function beginSeedPicking(kind) {
  const active = mapActivityTabs.find((tab) => tab.classList.contains('is-active'))?.dataset.mapActivityTab;
  seedSelectionReturnActivity = active === 'seeds' ? 'overview' : active;
  plantSeedPicking = kind === 'crop';
  fruitSeedPicking = kind === 'fruit';
  seedPickerKind = kind;
  if (seedPickerTab) {
    seedPickerTab.hidden = false;
    seedPickerTab.textContent = kind === 'fruit' ? 'Hạt Fruit' : 'Hạt Crop';
  }
  setSeedPicking(true);
  renderSeedPicker();
  activateMapActivityTab('seeds');
  if (!lastBettyScan) scanBettyButton.click();
}

function updateBettyActivityFilter(activity) {
  const sections = Array.from(shopResults.querySelectorAll('.shop-category-section'));
  const visible = activity === 'market';
  if (marketTabContent) marketTabContent.hidden = !visible;
  sections.forEach((section) => { section.hidden = false; });
  shopResults.hidden = false;
}

function updateWorkbenchActivityFilter(activity) {
  if (workbenchTabContent) workbenchTabContent.hidden = activity !== 'workbench';
}

function updateMapActivityTabIndicators() {
  mapActivityTabs.forEach((tab) => {
    const activity = tab.dataset.mapActivityTab;
    const readySelector = activity === 'market'
      ? '#shop-results .shop-card'
      : activity === 'crop' || activity === 'fruit'
      ? `[data-activity="${activity}"] .crop-card.is-ready, [data-activity="${activity}"] .crop-card.is-empty`
      : activity === 'tools'
        ? `[data-activity="tools"] .shop-card`
      : `[data-activity="${activity}"] .crop-card.is-ready`;
    tab.classList.toggle('has-ready', Boolean(mapActivityContent.querySelector(readySelector)));
  });
}

mapActivityTabs.forEach((tab) => tab.addEventListener('click', () => activateMapActivityTab(tab.dataset.mapActivityTab)));

function renderBettyShop(scan) {
  lastBettyScan = scan;
  if (scan.season) marketSeasonInfo = { season: scan.season, icon: scan.seasonIcon, ends: scan.seasonEnds };
  cropTiers.clear();
  scan.items.forEach((item) => {
    const tier = /basic\s+crop/i.test(item.category) ? 'I' : /medium\s+crop/i.test(item.category) ? 'II' : /advanced\s+crop/i.test(item.category) ? 'III' : '';
    if (tier) cropTiers.set(item.name.replace(/\s+seed$/i, '').toLowerCase(), tier);
  });
  if (lastScanData) {
    renderCropScan(lastScanData);
    renderTreeScan(lastScanData.trees);
    renderMiningScan(lastScanData.mining);
    renderFruitScan(lastScanData.fruit);
  }
  if (!scan.items.length) {
    shopResults.innerHTML = '<div class="empty-state">Không tìm thấy hạt giống trong Betty’s Market.</div>';
    renderSeedPicker();
    return;
  }
  const renderCards = () => scan.items.map((item) => {
    const name = item.name;
    const displayName = name.replace(/\s+seed$/i, '');
    const shopCategory = seedShopCategory(item);
    const stock = `${item.stock} in stock`;
    const tier = /basic\s+crop/i.test(item.category) ? 'I' : /medium\s+crop/i.test(item.category) ? 'II' : /advanced\s+crop/i.test(item.category) ? 'III' : '';
    const buyOptions = item.buyOptions.length >= 3 || item.buyOptions.some((option) => /^Buy all$/i.test(option)) ? item.buyOptions : [...item.buyOptions, 'Buy all'];
    const displayRequirements = item.requirements.map((requirement) => /^\s*[\d,.]+\s*$/.test(requirement) ? 'Không đủ coin' : requirement);
    const visibleRequirements = displayRequirements.filter((requirement) => requirement !== 'Không đủ coin');
    const hasBasketFull = displayRequirements.some((requirement) => /you have too many seeds in your basket/i.test(requirement));
    const hasLockedRequirement = visibleRequirements.some((requirement) => !/you have too many seeds in your basket/i.test(requirement));
    const available = item.stock > 0 && buyOptions.length > 0 && !hasBasketFull && !hasLockedRequirement;
    const unavailableReason = (visibleRequirements.length ? visibleRequirements.join('\n') : item.stock === 0 ? 'Sold out' : '').replace(/You have too many seeds in your basket!/gi, 'Túi đã đầy');
    const priceText = String(item.price || '').trim().replace(/,/g, '');
    const unitPrice = priceText ? Number(priceText) : Number.NaN;
    const buyAmount = (option) => /^Buy all$/i.test(option)
      ? Number(item.stock) || 0
      : Number((String(option).match(/\d[\d,.]*/) || ['0'])[0].replace(/,/g, ''));
    const actions = available ? `<div class="shop-buy-actions">${buyOptions.map((option) => {
      const amount = buyAmount(option);
      const cost = unitPrice * amount;
      const insufficient = Number.isFinite(currentCoins) && Number.isFinite(unitPrice) && currentCoins + 1e-9 < cost;
      const coins = Number.isFinite(currentCoins) ? currentCoins.toLocaleString('en-US', { maximumFractionDigits: 1 }) : '—';
      const price = Number.isFinite(cost) ? cost.toLocaleString('en-US', { maximumFractionDigits: 1 }) : '—';
      return `<span class="buy-action"><button type="button" data-shop-buy="${escapeHtml(option)}"${insufficient ? ' class="is-insufficient" disabled' : ''}>${escapeHtml(option)}</button><span class="buy-tooltip${insufficient ? ' is-missing' : ''}"><b>${escapeHtml(`${coins}/${price}`)} 🪙</b></span></span>`;
    }).join('')}</div>` : '';
    const reason = unavailableReason ? `<p class="shop-requirements">${escapeHtml(unavailableReason)}</p>` : '';
    const statusClass = hasLockedRequirement ? 'is-level-locked' : hasBasketFull ? 'is-basket-full' : item.stock === 0 ? 'is-sold-out' : '';
    const growth = item.growthTime || 'Chưa rõ';
    const pickerMeta = `<div class="shop-card-meta"><span>${escapeHtml(stock)}</span><span class="seed-growth"><img src="https://sunflower-land.com/game-assets/icons/lightning.png" alt="Thời gian lớn" />${escapeHtml(growth)}</span></div>`;
    const cardState = statusClass ? `is-unavailable ${statusClass}` : '';
    return `<article class="shop-card ${cardState} is-seed-choice" data-shop-category="${shopCategory}" data-shop-seed-name="${escapeHtml(name)}" data-shop-slot-index="${escapeHtml(item.slotIndex)}">${tier ? `<b class="shop-tier">${tier}</b>` : ''}<div class="shop-icon-box"><img class="shop-item-icon" src="${escapeHtml(item.icon)}" alt="" /><b class="crop-quantity">×${escapeHtml(getSeedCount(item))}</b></div><div class="shop-card-content"><strong>${escapeHtml(displayName)}</strong>${pickerMeta}${reason}</div>${actions}<span class="shop-select-overlay">Chọn</span></article>`;
  }).join('');
  shopResults.innerHTML = renderCards();
  groupBettyCards(shopResults);
  renderSeedPicker();
  updateBettyActivityFilter(mapActivityTabs.find((tab) => tab.classList.contains('is-active'))?.dataset.mapActivityTab || 'crop');
}

function seedShopCategory(item) {
  const name = String(item?.name || '');
  const category = String(item?.category || '');
  return /greenhouse/i.test(category) ? 'greenhouse' : /fruit|^(apple|banana|blueberry|lemon|orange|grape)\s+seed$/i.test(`${category} ${name}`) ? 'fruit' : /flower/i.test(category) ? 'flower' : 'crop';
}

function renderSeedPicker() {
  if (!seedPickerResults) return;
  const kind = fruitSeedPicking ? 'fruit' : 'crop';
  if (!lastBettyScan) {
    seedPickerResults.innerHTML = '<div class="empty-state">Đang quét Betty để lấy danh sách hạt…</div>';
    return;
  }
  const seeds = lastBettyScan.items.filter((item) => seedShopCategory(item) === kind);
  if (!seeds.length) {
    seedPickerResults.innerHTML = `<div class="empty-state">Không tìm thấy hạt ${kind === 'fruit' ? 'Fruit' : 'Crop'} trong Betty’s Market.</div>`;
    return;
  }
  seedPickerResults.innerHTML = seeds.map((item) => {
    const name = String(item.name || '').replace(/\s+seed$/i, '');
    const owned = getSeedCount(item);
    const growth = item.growthTime || 'Chưa rõ';
    return `<article class="seed-picker-card" data-seed-picker-choice="true" data-seed-kind="${kind}" data-shop-seed-name="${escapeHtml(item.name)}" data-shop-slot-index="${escapeHtml(item.slotIndex)}"><img class="seed-picker-icon" src="${escapeHtml(item.icon)}" alt="" /><div class="seed-picker-content"><strong>${escapeHtml(name)}</strong><span>Đang có: ×${escapeHtml(owned)}</span><span class="seed-growth"><img src="https://sunflower-land.com/game-assets/icons/lightning.png" alt="Thời gian lớn" />${escapeHtml(growth)}</span></div><span class="seed-picker-overlay">Chọn</span></article>`;
  }).join('');
}

function groupBettyCards(container) {
  const groups = [
    ['crop', 'Crop'],
    ['fruit', 'Fruit'],
    ['flower', 'Flower'],
    ['greenhouse', 'Greenhouse']
  ];
  const cards = Array.from(container.querySelectorAll('.shop-card'));
  const sections = groups.map(([key, label]) => {
    const matches = cards.filter((card) => card.dataset.shopCategory === key);
    if (!matches.length) return null;
    const section = document.createElement('section');
    section.className = 'shop-category-section';
    section.dataset.shopCategory = key;
    section.innerHTML = `<h2>${label}</h2><div class="shop-category-grid"></div>`;
    const grid = section.querySelector('.shop-category-grid');
    matches.forEach((card) => grid.append(card));
    return section;
  }).filter(Boolean);
  container.replaceChildren(...sections);
}

function updateBettyCard(card, result) {
  if (!card || !Number.isFinite(result?.stock)) return;
  const owned = setSeedCount(card.dataset.shopSeedName, result.owned);
  card.querySelector('.crop-quantity').textContent = `×${owned}`;
  const stockLabel = card.querySelector('.shop-card-meta span:first-child');
  if (stockLabel) stockLabel.textContent = `Stock: ${result.stock}`;
  card.querySelector('.shop-buy-actions')?.remove();
  card.querySelector('.shop-requirements')?.remove();
  const unavailable = result.stock <= 0 ? 'Sold out' : result.basketFull ? 'Túi đã đầy' : '';
  card.classList.remove('is-level-locked', 'is-sold-out', 'is-basket-full');
  if (result.stock <= 0) card.classList.add('is-sold-out');
  else if (result.basketFull) card.classList.add('is-basket-full');
  card.classList.toggle('is-unavailable', Boolean(unavailable));
  if (unavailable) {
    const reason = document.createElement('p');
    reason.className = 'shop-requirements';
    reason.textContent = unavailable;
    card.querySelector('.shop-card-content')?.append(reason);
    return;
  }
  const currentOptions = result.buyOptions || [];
  const options = currentOptions.length >= 3 || currentOptions.some((option) => /^Buy all$/i.test(option)) ? currentOptions : [...currentOptions, 'Buy all'];
  if (!options.length) return;
  const actions = document.createElement('div');
  actions.className = 'shop-buy-actions';
  options.forEach((option) => {
    const action = document.createElement('button');
    action.type = 'button';
    action.dataset.shopBuy = option;
    action.textContent = option;
    actions.append(action);
  });
  card.append(actions);
}

function syncBettyPurchase(seedName, result) {
  const item = lastBettyScan?.items.find((entry) => entry.name === seedName);
  if (!item) return;
  item.stock = result.stock;
  item.owned = result.owned;
  setSeedCount(seedName, result.owned);
  item.buyOptions = result.buyOptions || item.buyOptions;
  if (result.basketFull && !item.requirements.some((requirement) => /you have too many seeds in your basket/i.test(requirement))) item.requirements.push('You have too many seeds in your basket!');
  renderBettyShop(lastBettyScan);
}

scanBettyButton.addEventListener('click', async () => {
  scanBettyButton.disabled = true;
  scanBettyButton.textContent = 'Đang quét Betty…';
  const finishLog = startActionLog('Đang quét Betty…');
  try {
    const [{ result }] = await executeOnSunflowerTabs({
      func: async () => {
        const sleep = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));
        const waitFor = async (find, timeout = 260) => {
          const deadline = Date.now() + timeout;
          let value;
          while (!(value = find()) && Date.now() < deadline) await sleep(10);
          return value || null;
        };
        const marketPattern = /\/game-assets\/(?:[^/]+\/)*buildings\/(?:[^/]+\/)*(?:bettys_)?market\.(?:webp|png)(?:[?#]|$)/i;
        const marketImage = Array.from(document.querySelectorAll('img')).find((image) => marketPattern.test(image.currentSrc || image.src || ''));
        const target = marketImage?.closest('.cursor-pointer') || marketImage?.parentElement;
        if (!target) return { error: 'Không tìm thấy Betty’s Market trên map.' };
        if (!document.querySelector('#SeasonSeeds')) {
          target.click();
          await waitFor(() => Array.from(document.querySelectorAll('div.cursor-pointer, button')).find((element) => element.textContent.trim() === 'Buy'), 220);
        }
        const buyTab = Array.from(document.querySelectorAll('div.cursor-pointer, button')).find((element) => element.textContent.trim() === 'Buy');
        if (!document.querySelector('#SeasonSeeds')) buyTab?.click();
        const seasonSeeds = await waitFor(() => document.querySelector('#SeasonSeeds'), 220);
        if (!seasonSeeds) return { error: 'Không tìm thấy tab Buy của Betty’s Market.' };
        const dialog = seasonSeeds.closest('div.relative.max-h-\\[90vh\\]') || seasonSeeds.parentElement?.parentElement?.parentElement;
        if (!dialog) return { error: 'Không đọc được cửa sổ Betty’s Market.' };
        const seasonNode = Array.from(seasonSeeds.querySelectorAll('.capitalize')).find((element) => /^(spring|summer|autumn|winter)$/i.test(element.textContent.trim()));
        const season = seasonNode?.textContent.trim() || '';
        const seasonIcon = seasonNode?.querySelector('img')?.currentSrc || seasonNode?.querySelector('img')?.src || '';
        const seasonEnds = (dialog?.innerText.match(/\b\d+\s*days?\s+left\b/i) || [])[0] || '';
        const slots = Array.from(seasonSeeds.querySelectorAll('.bg-brown-600')).filter((slot) => slot.querySelector('img[alt="item"]'));
        const readSlotCount = (slot) => {
          const text = (slot.parentElement?.innerText || slot.parentElement?.textContent || slot.textContent || '').trim().replace(/,/g, '').toLowerCase();
          const match = text.match(/\d+(?:\.\d+)?\s*k?/);
          const value = Number.parseFloat(match?.[0] || '0');
          return Number.isFinite(value) ? Math.round(value * (String(match?.[0] || '').includes('k') ? 1000 : 1)) : 0;
        };
        const readSelectedItem = () => {
          const details = Array.from(dialog.querySelectorAll('div.flex.flex-col.h-full.justify-between')).find((element) => {
          const title = Array.from(element.querySelectorAll('p')).find((paragraph) => /\bSeed$/i.test(paragraph.textContent.trim()) || /^(Apple|Banana|Blueberry|Lemon|Orange|Grape)(?:\s+(?:Seed|Plant))?$/i.test(paragraph.textContent.trim()));
            return Boolean(title && (element.innerText.includes('in stock') || element.innerText.includes('Sold out') || Array.from(element.querySelectorAll('button')).some((button) => /^Buy\s+\d+$/i.test(button.innerText.trim()))));
          });
          if (!details) return null;
          const paragraphs = Array.from(details.querySelectorAll('p')).map((paragraph) => paragraph.textContent.trim()).filter(Boolean);
          const name = paragraphs.find((text) => /\bSeed$/i.test(text)) || paragraphs.find((text) => /^(Apple|Banana|Blueberry|Lemon|Orange|Grape)(?:\s+(?:Seed|Plant))?$/i.test(text)) || '';
          const category = paragraphs.find((text) => text !== name && /Crop|Flower|Fruit|Greenhouse|Seed/i.test(text)) || '';
          const icon = Array.from(details.querySelectorAll('img[alt="item"]')).find((image) => !/chevron|stopwatch/i.test(image.currentSrc || image.src || ''));
          const stockMatch = details.innerText.match(/([\d,.]+)\s+in stock/i);
          const stock = details.innerText.includes('Sold out') ? 0 : Number((stockMatch?.[1] || '0').replace(/,/g, ''));
          const metricRows = Array.from(details.querySelectorAll('div.flex.justify-between.min-h-\\[26px\\]'));
          const growthTime = metricRows.find((row) => Array.from(row.querySelectorAll('img')).some((image) => /\/game-assets\/icons\/lightning\.png/i.test(image.currentSrc || image.src || '')))?.innerText.trim() || '';
          const price = metricRows.at(-1)?.innerText.trim() || '';
          const basketMessage = paragraphs.find((text) => /you have too many seeds in your basket/i.test(text));
          const requirements = [
            ...Array.from(details.querySelectorAll('[style*="danger_border"]')).map((element) => element.textContent.trim()),
            basketMessage
          ].filter((text) => text && !/^Sold out$/i.test(text) && !/^\d[\d,.]*\s+in stock$/i.test(text));
          const buyOptions = Array.from(details.querySelectorAll('button')).map((button) => button.innerText.trim()).filter((text) => /^Buy\s+(?:\d+|All)$/i.test(text));
          const fruitName = name.replace(/\s+(?:Seed|Plant)$/i, '');
          return name && icon ? { name: /\bSeed$/i.test(name) ? name : `${fruitName} Seed`, category: category || (/^(Apple|Banana|Blueberry|Lemon|Orange|Grape)(?:\s+(?:Seed|Plant))?$/i.test(name) ? 'Fruit' : ''), icon: icon.currentSrc || icon.src, stock: Number.isFinite(stock) ? stock : 0, growthTime, price, requirements: [...new Set(requirements)], buyOptions } : null;
        };
        const selectedSlot = slots.find((slot) => slot.parentElement?.querySelector('img[src*="/game-assets/ui/select/selectbox_"]'));
        const orderedSlots = slots.map((slot, slotIndex) => ({ slot, slotIndex })).sort((left, right) => Number(right.slot === selectedSlot) - Number(left.slot === selectedSlot));
        const signature = (item) => item ? `${item.name}|${item.stock}|${item.growthTime}|${item.price}|${item.buyOptions.join('|')}|${item.requirements.join('|')}` : '';
        let previousSignature = signature(readSelectedItem());
        const items = [];
        for (const { slot, slotIndex } of orderedSlots) {
          const isSelected = slot === selectedSlot;
          if (!isSelected) slot.click();
          const item = isSelected
            ? readSelectedItem()
            : await waitFor(() => {
              const next = readSelectedItem();
              return next && signature(next) !== previousSignature ? next : null;
            }, 160);
          if (item) previousSignature = signature(item);
          if (item && !items.some((entry) => entry.name === item.name)) {
            items.push({ ...item, owned: readSlotCount(slot), slotIndex });
          }
        }
        const closeButton = dialog.querySelector('img[src*="/game-assets/icons/close.png"]');
        closeButton?.click();
        return { season, seasonIcon, seasonEnds, items, closed: Boolean(closeButton) };
      }
    });
    if (result?.error) throw new Error(result.error);
    syncSeedInventory(result.items);
    renderBettyShop(result);
    await refreshConnection();
  } catch (error) {
    shopResults.innerHTML = '';
    logActionError(error.message || 'Không thể quét Betty’s Market.');
  } finally {
    finishLog();
    scanBettyButton.disabled = false;
    scanBettyButton.textContent = 'Quét Betty';
  }
});

function renderToolsScan(scan) {
  lastToolsScan = scan;
  const items = scan?.items || [];
  if (items.length) {
    toolCounts.clear();
    items.forEach((item) => toolCounts.set(item.icon, Math.max(0, Number(item.count) || 0)));
    toolBagScanned = true;
  }
  renderWorkbench(scan);
  renderOverview();
}

function renderWorkbench(scan = lastToolsScan) {
  if (!workbenchResults) return;
  const items = scan?.items || [];
  if (!items.length) {
    workbenchResults.innerHTML = '<div class="empty-state">Chưa quét Tools. Mở Workbench rồi bấm Quét Tools.</div>';
    return;
  }
  const categories = ['Land Tools', 'Water Tools', 'Animal Tools'];
  workbenchResults.innerHTML = categories.map((category) => {
    const tools = items.filter((item) => item.category === category);
    if (!tools.length) return '';
    const cards = tools.map((item) => overviewToolCard(item.name, item.icon, item.count)).join('');
    return `<section class="shop-category-section workbench-category-section"><h2>${escapeHtml(category)}</h2><div class="shop-category-grid">${cards}</div></section>`;
  }).join('') || '<div class="empty-state">Không tìm thấy tool trong Workbench.</div>';
}

scanToolsButton.addEventListener('click', async () => {
  const label = scanToolsButton.querySelector('span:last-child');
  scanToolsButton.disabled = true;
  scanToolsButton.classList.add('is-scanning');
  if (label) label.textContent = 'Đang quét…';
  const finishLog = startActionLog('Đang quét Tools…');
  try {
    const [{ result }] = await executeOnSunflowerTabs({
      func: async () => {
        const sleep = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));
        const waitFor = async (find, timeout = 650) => {
          const until = Date.now() + timeout;
          let found;
          while (!(found = find()) && Date.now() < until) await sleep(15);
          return found || null;
        };
        const workbenchPattern = /\/game-assets\/(?:[^/]+\/)*buildings\/(?:[^/]+\/)*workbench\.(?:webp|png)(?:[?#]|$)/i;
        const workbench = Array.from(document.querySelectorAll('img')).find((image) => workbenchPattern.test(image.currentSrc || image.src || ''));
        const target = workbench?.closest('.cursor-pointer') || workbench?.parentElement;
        if (!target) return { error: 'Không tìm thấy Workbench trên map.' };
        const dialogs = () => Array.from(document.querySelectorAll('div.relative.max-h-\\[90vh\\]'));
        const isWorkbenchDialog = (element) => /\b(?:Land|Water|Animal) Tools\b/i.test(element?.innerText || '');
        const openDialogs = new Set(dialogs());
        let dialog = dialogs().find(isWorkbenchDialog);
        if (!dialog) {
          target.click();
          dialog = await waitFor(() => dialogs().find((element) => !openDialogs.has(element) || isWorkbenchDialog(element)));
        }
        if (!dialog) return { error: 'Không mở được cửa sổ Workbench.' };
        const toolsTab = Array.from(dialog.querySelectorAll('button, div.cursor-pointer')).find((element) => element.textContent.trim() === 'Tools');
        toolsTab?.click();
        const categories = ['Land Tools', 'Water Tools', 'Animal Tools'];
        await waitFor(() => categories.some((category) => Array.from(dialog.querySelectorAll('div')).some((element) => element.textContent.trim() === category)), 350);
        const readCount = (slot) => {
          const text = (slot.parentElement?.innerText || slot.parentElement?.textContent || slot.textContent || '').replace(/,/g, '').toLowerCase();
          const match = text.match(/\d+(?:\.\d+)?\s*k?/);
          const value = Number.parseFloat(match?.[0] || '0');
          return Number.isFinite(value) ? Math.round(value * (String(match?.[0] || '').includes('k') ? 1000 : 1)) : 0;
        };
        const fallbackName = (icon) => {
          const filename = (icon || '').split('/').pop()?.split(/[?#]/)[0] || 'Tool';
          return filename.replace(/\.(png|webp)$/i, '').replace(/[_-]+/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
        };
        const readSelectedDetails = async () => {
          const detail = Array.from(dialog.querySelectorAll('div')).find((element) => element.classList.contains('sm:w-2/5'));
          let ingredientPanel = detail?.querySelector('#ingredients-info-panel');
          if (!ingredientPanel) {
            const ingredientTrigger = Array.from(detail?.querySelectorAll('div.relative.cursor-pointer') || []).find((element) => /\d[\d,.]*\s*\/\s*\d[\d,.]*/.test(element.innerText || ''));
            ingredientTrigger?.click();
            await sleep(40);
            ingredientPanel = detail?.querySelector('#ingredients-info-panel');
          }
          const ingredientNames = new Map(Array.from(ingredientPanel?.querySelectorAll('img[alt]') || []).map((image) => [image.currentSrc || image.src || '', image.alt.trim()]));
          const candidates = Array.from(detail?.querySelectorAll('p, span') || []).map((element) => element.textContent.trim()).filter((text) => text && !/^(Tools|Land Tools|Water Tools|Animal Tools|Buy|Sell|Guide|Craft)$/i.test(text) && !/^\d/.test(text));
          const name = candidates.find((text) => /(?:Axe|Pickaxe|Rod|Hammer|Saw|Scythe|Drill|Hoe|Pot|Rake|Tool)/i.test(text)) || candidates[0] || '';
          const text = detail?.innerText || '';
          const stockText = (text.match(/(?:\d[\d,.]*\s+in stock|Sold out)/i) || [''])[0];
          const soldOut = /Sold out/i.test(stockText);
          const requirementRows = Array.from(detail?.querySelectorAll('div.flex.justify-between.min-h-\\[26px\\]') || []);
          const requirements = requirementRows.map((row) => {
            const icon = row.querySelector('img[alt="item"]')?.currentSrc || row.querySelector('img[alt="item"]')?.src || '';
            return { icon, name: ingredientNames.get(icon) || '', text: row.innerText.trim() };
          }).filter((entry) => entry.text);
          const craftButtons = Array.from(detail?.querySelectorAll('button') || []).filter((button) => /^Craft\s+\d+$/i.test(button.innerText.trim()));
          const craftOptions = craftButtons.map((button) => button.innerText.trim());
          const disabledCraftOptions = craftButtons.filter((button) => button.disabled).map((button) => button.innerText.trim());
          const note = Array.from(detail?.querySelectorAll('p')).map((element) => element.textContent.trim()).find((value) => /required|not enough|cannot craft/i.test(value)) || '';
          return { name, stockText, soldOut, requirements, craftOptions, disabledCraftOptions, note };
        };
        const items = [];
        for (const category of categories) {
          const heading = Array.from(dialog.querySelectorAll('div')).find((element) => element.textContent.trim() === category);
          const section = heading?.nextElementSibling;
          // Available and unavailable tools use different brown shades.
          // Stone Pickaxe, for example, is rendered with bg-brown-700.
          const slots = Array.from(section?.querySelectorAll('.bg-brown-600, .bg-brown-700') || []).filter((slot) => slot.querySelector('img[alt="item"]'));
          for (const [slotIndex, slot] of slots.entries()) {
            const image = slot.querySelector('img[alt="item"]');
            const icon = image.currentSrc || image.src;
            slot.click();
            // The Workbench keeps the previous tool's panel visible briefly.
            // Wait for the selected tool image before reading its name.
            await waitFor(() => {
              const detail = Array.from(dialog.querySelectorAll('div')).find((element) => element.classList.contains('sm:w-2/5'));
              return Array.from(detail?.querySelectorAll('img') || []).some((detailImage) => (detailImage.currentSrc || detailImage.src || '') === icon);
            }, 700);
            await sleep(45);
            const details = await readSelectedDetails();
            const name = details.name || fallbackName(icon);
            // “N in stock” is the Workbench shop/crafting stock, not the
            // player's inventory. Inventory is shown only on the tool-slot badge.
            const count = readCount(slot);
            if (!items.some((item) => item.icon === icon)) items.push({ ...details, name, icon, count, category, slotIndex });
          }
        }
        const closeButton = dialog.querySelector('img[src*="/game-assets/icons/close.png"]');
        closeButton?.click();
        return { items, closed: Boolean(closeButton) };
      }
    });
    if (result?.error) throw new Error(result.error);
    renderToolsScan(result);
  } catch (error) {
    logActionError(error.message || 'Không thể quét Workbench.');
  } finally {
    finishLog();
    scanToolsButton.disabled = false;
    scanToolsButton.classList.remove('is-scanning');
    if (label) label.textContent = 'Tools';
  }
});

async function refreshPurchasedTool(category, slotIndex) {
  const [{ result }] = await executeOnSunflowerTabs({
    func: async (requestedCategory, requestedSlotIndex) => {
      const sleep = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));
      const workbenchPattern = /\/game-assets\/(?:[^/]+\/)*buildings\/(?:[^/]+\/)*workbench\.(?:webp|png)(?:[?#]|$)/i;
      const workbench = Array.from(document.querySelectorAll('img')).find((image) => workbenchPattern.test(image.currentSrc || image.src || ''));
      const target = workbench?.closest('.cursor-pointer') || workbench?.parentElement;
      if (!target) return { error: 'Không tìm thấy Workbench trên map.' };
      const dialogs = () => Array.from(document.querySelectorAll('div.relative.max-h-\\[90vh\\]'));
      const before = new Set(dialogs());
      target.click();
      let dialog;
      for (let attempt = 0; attempt < 40 && !dialog; attempt += 1) {
        dialog = dialogs().find((element) => !before.has(element) || /\b(?:Land|Water|Animal) Tools\b/i.test(element.innerText || ''));
        if (!dialog) await sleep(15);
      }
      if (!dialog) return { error: 'Không mở được Workbench.' };
      try {
        Array.from(dialog.querySelectorAll('button, div.cursor-pointer')).find((element) => element.textContent.trim() === 'Tools')?.click();
        await sleep(70);
        const heading = Array.from(dialog.querySelectorAll('div')).find((element) => element.textContent.trim() === requestedCategory);
        const slots = Array.from(heading?.nextElementSibling?.querySelectorAll('.bg-brown-600, .bg-brown-700') || []).filter((slot) => slot.querySelector('img[alt="item"]'));
        const slot = slots[requestedSlotIndex];
        if (!slot) return { error: 'Index Tool đã thay đổi. Hãy Quét Tools lại.' };
        slot.click();
        await sleep(40);
        const detail = Array.from(dialog.querySelectorAll('div')).find((element) => element.classList.contains('sm:w-2/5'));
        const text = detail?.innerText || '';
        const stockText = (text.match(/(?:\d[\d,.]*\s+in stock|Sold out)/i) || [''])[0];
        const craftButtons = Array.from(detail?.querySelectorAll('button') || []).filter((button) => /^Craft\s+\d+$/i.test(button.innerText.trim()));
        const requirementRows = Array.from(detail?.querySelectorAll('div.flex.justify-between.min-h-\\[26px\\]') || []);
        const readCount = (entry) => {
          const value = (entry.parentElement?.innerText || entry.parentElement?.textContent || entry.textContent || '').replace(/,/g, '').toLowerCase();
          const match = value.match(/\d+(?:\.\d+)?\s*k?/);
          const number = Number.parseFloat(match?.[0] || '0');
          return Number.isFinite(number) ? Math.round(number * (String(match?.[0] || '').includes('k') ? 1000 : 1)) : 0;
        };
        const icon = slot.querySelector('img[alt="item"]')?.currentSrc || slot.querySelector('img[alt="item"]')?.src || '';
        return {
          item: {
            icon,
            count: readCount(slot),
            stockText,
            soldOut: /Sold out/i.test(stockText),
            requirements: requirementRows.map((row) => ({ icon: row.querySelector('img[alt="item"]')?.currentSrc || row.querySelector('img[alt="item"]')?.src || '', text: row.innerText.trim() })).filter((entry) => entry.text),
            craftOptions: craftButtons.map((button) => button.innerText.trim()),
            disabledCraftOptions: craftButtons.filter((button) => button.disabled).map((button) => button.innerText.trim())
          }
        };
      } finally {
        dialog.querySelector('img[src*="/game-assets/icons/close.png"]')?.click();
      }
    },
    args: [category, slotIndex]
  });
  if (result?.error) throw new Error(result.error);
  const item = lastToolsScan?.items.find((entry) => entry.category === category && Number(entry.slotIndex) === slotIndex);
  if (!item || !result?.item) return false;
  Object.assign(item, result.item);
  toolCounts.set(item.icon, item.count);
  renderWorkbench();
  renderOverview();
  return true;
}

mapActivityContent.addEventListener('click', async (event) => {
  const scanTools = event.target.closest('[data-ui-action="scan-tools"]');
  if (scanTools) {
    scanToolsButton.click();
    return;
  }
  const button = event.target.closest('[data-tool-craft]');
  if (!button || button.disabled) return;
  const card = button.closest('[data-tool-category][data-tool-slot-index]');
  const category = card?.dataset.toolCategory;
  const slotIndex = Number(card?.dataset.toolSlotIndex);
  const craftLabel = button.dataset.toolCraft;
  if (!category || !Number.isInteger(slotIndex) || !craftLabel) return;
  const buttons = Array.from(card.querySelectorAll('[data-tool-craft]'));
  buttons.forEach((item) => { item.disabled = true; });
  const previous = button.textContent;
  button.textContent = 'Đang mua…';
  const finishLog = startActionLog('Đang mua Tool…');
  let completedMessage = '';
  try {
    const [{ result }] = await executeOnSunflowerTabs({
      func: async (requestedCategory, requestedSlotIndex, requestedCraft) => {
        const sleep = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));
        const workbenchPattern = /\/game-assets\/(?:[^/]+\/)*buildings\/(?:[^/]+\/)*workbench\.(?:webp|png)(?:[?#]|$)/i;
        const workbench = Array.from(document.querySelectorAll('img')).find((image) => workbenchPattern.test(image.currentSrc || image.src || ''));
        const target = workbench?.closest('.cursor-pointer') || workbench?.parentElement;
        if (!target) return { error: 'Không tìm thấy Workbench trên map.' };
        const dialogs = () => Array.from(document.querySelectorAll('div.relative.max-h-\\[90vh\\]'));
        const before = new Set(dialogs());
        target.click();
        let dialog;
        for (let attempt = 0; attempt < 40 && !dialog; attempt += 1) {
          dialog = dialogs().find((element) => !before.has(element) || /\b(?:Land|Water|Animal) Tools\b/i.test(element.innerText || ''));
          if (!dialog) await sleep(15);
        }
        if (!dialog) return { error: 'Không mở được Workbench.' };
        Array.from(dialog.querySelectorAll('button, div.cursor-pointer')).find((element) => element.textContent.trim() === 'Tools')?.click();
        await sleep(70);
        const heading = Array.from(dialog.querySelectorAll('div')).find((element) => element.textContent.trim() === requestedCategory);
        const slots = Array.from(heading?.nextElementSibling?.querySelectorAll('.bg-brown-600, .bg-brown-700') || []).filter((slot) => slot.querySelector('img[alt="item"]'));
        const slot = slots[requestedSlotIndex];
        if (!slot) return { error: 'Index Tool đã thay đổi. Hãy Quét Tools lại.' };
        slot.click();
        await sleep(40);
        const craftButton = Array.from(dialog.querySelectorAll('button')).find((element) => element.innerText.trim() === requestedCraft && !element.disabled);
        if (!craftButton) return { error: `${requestedCraft} hiện không khả dụng.` };
        craftButton.click();
        const requestedAmount = Number((requestedCraft.match(/\d+/) || ['1'])[0]);
        if (requestedAmount > 10) {
          let confirmationButton;
          for (let attempt = 0; attempt < 40 && !confirmationButton; attempt += 1) {
            confirmationButton = Array.from(document.querySelectorAll('button')).find((element) => element !== craftButton && element.offsetParent !== null && element.innerText.trim() === requestedCraft && !element.disabled && !dialog.contains(element));
            if (!confirmationButton) await sleep(15);
          }
          if (!confirmationButton) {
            dialog.querySelector('img[src*="/game-assets/icons/close.png"]')?.click();
            return { error: `Không thấy hộp xác nhận ${requestedCraft}.` };
          }
          confirmationButton.click();
        }
        await sleep(180);
        dialog.querySelector('img[src*="/game-assets/icons/close.png"]')?.click();
        return { crafted: true, amount: Number((requestedCraft.match(/\d+/) || ['1'])[0]) };
      },
      args: [category, slotIndex, craftLabel]
    });
    if (result?.error) throw new Error(result.error);
    if (!result?.crafted) throw new Error('Không thể mua Tool.');
    const purchasedTool = lastToolsScan?.items.find((entry) => entry.category === category && Number(entry.slotIndex) === slotIndex);
    const coinCost = (purchasedTool?.requirements || []).reduce((total, entry) => {
      const value = Number(String(entry.text || '').replace(/,/g, ''));
      return Number.isFinite(value) && value > 0 ? total + value : total;
    }, 0);
    if (Number.isFinite(currentCoins) && coinCost > 0) setCurrentCoins(currentCoins - coinCost * (Number(result.amount) || 1));
    await refreshPurchasedTool(category, slotIndex);
    completedMessage = `Mua thành công x${result.amount || 1} ${purchasedTool?.name || 'Tool'}`;
  } catch (error) {
    logActionError(error.message || 'Mua Tool thất bại.');
    buttons.forEach((item) => { item.disabled = false; });
    button.textContent = previous;
  } finally {
    finishLog(completedMessage);
  }
});

async function selectSeedForPlant(card, seedKind = 'crop') {
  const seedName = card?.dataset.shopSeedName;
  const slotIndex = Number(card?.dataset.shopSlotIndex);
  if (!seedName || !Number.isInteger(slotIndex)) return;
  const selectedSeed = {
    name: seedName.replace(/\s+seed$/i, ''),
    icon: card.querySelector('.shop-item-icon, .seed-picker-icon')?.currentSrc || card.querySelector('.shop-item-icon, .seed-picker-icon')?.src || '',
    count: getSeedCount(seedName),
    isSeed: true
  };
  if (seedKind === 'fruit') selectedFruitSeed = selectedSeed;
  else selectedPlantSeed = selectedSeed;
  plantSeedPicking = false;
  fruitSeedPicking = false;
  setSeedPicking(false);
  if (seedPickerTab) seedPickerTab.hidden = true;
  if (lastBettyScan) renderBettyShop(lastBettyScan);
  renderSeedPicker();
  if (lastScanData) {
    renderCropScan(lastScanData, true);
    renderFruitScan(lastScanData.fruit);
  }
  const returnActivity = seedSelectionReturnActivity;
  seedSelectionReturnActivity = null;
  if (returnActivity) activateMapActivityTab(returnActivity);
  activateToolTab('map');
  try {
    const [{ result }] = await executeOnSunflowerTabs({
      func: async (requestedName, requestedSlotIndex, requestedSeedKind, requestedIcon) => {
        const sleep = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));
        const normalise = (value) => String(value || '').trim().replace(/[_-]/g, ' ').replace(/\s+/g, ' ').toLowerCase();
        const requestedCrop = normalise(requestedName).replace(/\s+seed$/, '');
        const quickColumn = Array.from(document.querySelectorAll('div.flex.flex-col.items-center')).find((column) => Array.from(column.children).filter((child) => child.classList.contains('relative') && child.querySelector('.bg-brown-600 img[alt="item"]')).length >= 3);
        const quickSlots = quickColumn ? Array.from(quickColumn.children).filter((child) => child.classList.contains('relative') && child.querySelector('.bg-brown-600 img[alt="item"]')) : [];
        const matchingQuickSlot = quickSlots.find((slot) => {
          const source = slot.querySelector('.bg-brown-600 img[alt="item"]')?.currentSrc || slot.querySelector('.bg-brown-600 img[alt="item"]')?.src || '';
          const match = source.match(/\/game-assets\/crops\/([^/]+)\/seed\.png/i);
          return requestedSeedKind === 'fruit' ? source === requestedIcon : match && normalise(match[1]) === requestedCrop;
        });
        if (matchingQuickSlot) {
          matchingQuickSlot.querySelector('.bg-brown-600')?.click();
          return { selected: true };
        }
        const marketPattern = /\/game-assets\/(?:[^/]+\/)*buildings\/(?:[^/]+\/)*(?:bettys_)?market\.(?:webp|png)(?:[?#]|$)/i;
        const marketImage = Array.from(document.querySelectorAll('img')).find((image) => marketPattern.test(image.currentSrc || image.src || ''));
        const marketTarget = marketImage?.closest('.cursor-pointer') || marketImage?.parentElement;
        if (!marketTarget) return { selected: false, openedShop: false };
        if (!document.querySelector('#SeasonSeeds')) {
          marketTarget.click();
          await sleep(180);
        }
        if (!document.querySelector('#SeasonSeeds')) Array.from(document.querySelectorAll('div.cursor-pointer, button')).find((element) => element.textContent.trim() === 'Buy')?.click();
        await sleep(80);
        const seasonSeeds = document.querySelector('#SeasonSeeds');
        const slots = seasonSeeds ? Array.from(seasonSeeds.querySelectorAll('.bg-brown-600')).filter((slot) => slot.querySelector('img[alt="item"]')) : [];
        const marketSlot = slots[requestedSlotIndex];
        marketSlot?.click();
        await sleep(35);
        const dialog = seasonSeeds?.closest('div.relative.max-h-\\[90vh\\]') || seasonSeeds?.parentElement?.parentElement?.parentElement;
        dialog?.querySelector('img[src*="/game-assets/icons/close.png"]')?.click();
        return { selected: false, openedShop: Boolean(marketSlot) };
      },
      args: [seedName, slotIndex, seedKind, selectedSeed.icon]
    });
    if (result?.selected) {
      log(`Đã chọn ${seedName} trên thanh chọn nhanh.`);
      renderOverview();
    } else if (result?.openedShop) {
      log(`${seedName} chưa có trên thanh chọn nhanh. Đã mở Betty và chọn hạt này.`);
    } else log(`Không tìm thấy ${seedName} trên thanh chọn nhanh hoặc Betty.`);
  } catch (error) {
    log(error.message || 'Không thể chọn hạt trồng.');
  }
}

mapActivityContent.addEventListener('click', (event) => {
  const card = event.target.closest('[data-seed-picker-choice]');
  if (!card || (!plantSeedPicking && !fruitSeedPicking)) return;
  selectSeedForPlant(card, card.dataset.seedKind === 'fruit' ? 'fruit' : 'crop');
});

shopResults.addEventListener('click', async (event) => {
  const button = event.target.closest('[data-shop-buy]');
  if (!button) {
    const card = event.target.closest('[data-shop-seed-name]');
    const seedKind = card?.dataset.shopCategory === 'fruit' ? 'fruit' : 'crop';
    const canPick = seedKind === 'fruit' ? fruitSeedPicking : plantSeedPicking;
    if (card && canPick) selectSeedForPlant(card, seedKind);
    return;
  }
  if (button.disabled) return;
  const card = button.closest('[data-shop-seed-name]');
  const seedName = card?.dataset.shopSeedName;
  const slotIndex = Number(card?.dataset.shopSlotIndex);
  const requestedBuy = button.dataset.shopBuy;
  if (!seedName || !requestedBuy || !Number.isInteger(slotIndex)) return;
  const buttons = Array.from(card.querySelectorAll('[data-shop-buy]'));
  buttons.forEach((item) => { item.disabled = true; });
  const previousLabel = button.textContent;
  button.textContent = 'Đang mua…';
  const finishLog = startActionLog('Đang mua hạt…');
  try {
    const [{ result }] = await executeOnSunflowerTabs({
      func: async (requestedName, requestedAction, requestedSlotIndex) => {
        const sleep = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));
        const normalise = (value) => String(value || '').trim().replace(/\s+/g, ' ').toLowerCase();
        const marketPattern = /\/game-assets\/(?:[^/]+\/)*buildings\/(?:[^/]+\/)*(?:bettys_)?market\.(?:webp|png)(?:[?#]|$)/i;
        const marketImage = Array.from(document.querySelectorAll('img')).find((image) => marketPattern.test(image.currentSrc || image.src || ''));
        const marketTarget = marketImage?.closest('.cursor-pointer') || marketImage?.parentElement;
        if (!marketTarget) return { error: 'Không tìm thấy Betty’s Market trên map.' };
        if (!document.querySelector('#SeasonSeeds')) {
          marketTarget.click();
          await sleep(350);
        }
        const buyTab = Array.from(document.querySelectorAll('div.cursor-pointer, button')).find((element) => element.textContent.trim() === 'Buy');
        if (!document.querySelector('#SeasonSeeds')) buyTab?.click();
        await sleep(100);
        const seasonSeeds = document.querySelector('#SeasonSeeds');
        if (!seasonSeeds) return { error: 'Không tìm thấy tab Buy của Betty’s Market.' };
        const dialog = seasonSeeds.closest('div.relative.max-h-\\[90vh\\]') || seasonSeeds.parentElement?.parentElement?.parentElement;
        if (!dialog) return { error: 'Không đọc được cửa sổ Betty’s Market.' };
        const readDetails = () => {
          const details = Array.from(dialog.querySelectorAll('div.flex.flex-col.h-full.justify-between')).find((element) => {
            const title = Array.from(element.querySelectorAll('p')).find((paragraph) => /\bSeed$/i.test(paragraph.textContent.trim()) || /^(Apple|Banana|Blueberry|Lemon|Orange|Grape)(?:\s+(?:Seed|Plant))?$/i.test(paragraph.textContent.trim()));
            return Boolean(title && (element.innerText.includes('in stock') || element.innerText.includes('Sold out') || Array.from(element.querySelectorAll('button')).some((candidate) => /^Buy\s+\d+$/i.test(candidate.innerText.trim()))));
          });
          if (!details) return null;
          const rawName = Array.from(details.querySelectorAll('p')).map((paragraph) => paragraph.textContent.trim()).find((text) => /\bSeed$/i.test(text)) || Array.from(details.querySelectorAll('p')).map((paragraph) => paragraph.textContent.trim()).find((text) => /^(Apple|Banana|Blueberry|Lemon|Orange|Grape)(?:\s+(?:Seed|Plant))?$/i.test(text)) || '';
          const name = /\bSeed$/i.test(rawName) ? rawName : rawName ? `${rawName.replace(/\s+(?:Seed|Plant)$/i, '')} Seed` : '';
          const stockMatch = details.innerText.match(/([\d,.]+)\s+in stock/i);
          const stock = details.innerText.includes('Sold out') ? 0 : Number((stockMatch?.[1] || '0').replace(/,/g, ''));
          const basketFull = /you have too many seeds in your basket/i.test(details.innerText);
          const buttons = Array.from(details.querySelectorAll('button')).filter((candidate) => candidate.offsetParent !== null).map((candidate) => ({ element: candidate, label: candidate.innerText.trim() })).filter((candidate) => /^Buy\s+\d+$/i.test(candidate.label));
          return { details, name, stock: Number.isFinite(stock) ? stock : 0, basketFull, buttons };
        };
        const slots = Array.from(seasonSeeds.querySelectorAll('.bg-brown-600')).filter((slot) => slot.querySelector('img[alt="item"]'));
        const readSlotCount = (slot) => {
          const text = (slot.parentElement?.innerText || slot.parentElement?.textContent || slot.textContent || '').trim().replace(/,/g, '').toLowerCase();
          const match = text.match(/\d+(?:\.\d+)?\s*k?/);
          const value = Number.parseFloat(match?.[0] || '0');
          return Number.isFinite(value) ? Math.round(value * (String(match?.[0] || '').includes('k') ? 1000 : 1)) : 0;
        };
        const slot = slots[requestedSlotIndex];
        if (!slot) {
          dialog.querySelector('img[src*="/game-assets/icons/close.png"]')?.click();
          return { error: 'Index hạt đã thay đổi. Hãy Quét Betty lại.' };
        }
        slot.click();
        await sleep(35);
        let info = readDetails();
        const initialOwned = readSlotCount(slot);
        if (!info || normalise(info.name) !== normalise(requestedName)) {
          dialog.querySelector('img[src*="/game-assets/icons/close.png"]')?.click();
          return { error: 'Index hạt không còn khớp. Hãy Quét Betty lại.' };
        }
        let purchased = 0;
        let basketFull = info.basketFull;
        const waitForDetailsChange = async (previousStock, timeout = 280) => {
          const deadline = Date.now() + timeout;
          let details = readDetails();
          while (details && details.stock === previousStock && !details.basketFull && Date.now() < deadline) {
            await sleep(20);
            details = readDetails();
          }
          return details;
        };
        const buyOnce = async (label) => {
          const before = readDetails();
          if (!before || before.basketFull || before.stock <= 0) return { bought: 0, basketFull: Boolean(before?.basketFull) };
          const buyButton = before.buttons.find((candidate) => candidate.label === label)?.element;
          if (!buyButton || buyButton.disabled) return { bought: 0, basketFull: false };
          buyButton.click();
          const amount = Number(label.match(/\d+/)?.[0]);
          let after;
          // Chỉ Buy X lớn hơn 10 mới mở panel xác nhận. Buy 1 và Buy 10 là giao dịch một click.
          if (amount > 10) {
            const confirmationDeadline = Date.now() + 220;
            let confirmation;
            while (!confirmation && Date.now() < confirmationDeadline) {
              confirmation = Array.from(document.querySelectorAll('[data-headlessui-state="open"], [data-open], [role="dialog"]')).find((panel) => panel.offsetParent !== null && panel !== dialog && !dialog.contains(panel) && /Are you sure you want to spend/i.test(panel.innerText) && Array.from(panel.querySelectorAll('button')).some((candidate) => candidate.offsetParent !== null && candidate.innerText.trim() === label));
              if (!confirmation) await sleep(20);
            }
            const confirmButton = confirmation && Array.from(confirmation.querySelectorAll('button')).find((candidate) => candidate.offsetParent !== null && candidate.innerText.trim() === label);
            if (confirmButton) {
              confirmButton.click();
            }
            after = await waitForDetailsChange(before.stock);
          } else {
            after = await waitForDetailsChange(before.stock);
          }
          return { bought: Math.max(0, before.stock - (after?.stock ?? before.stock)), basketFull: Boolean(after?.basketFull) };
        };
        try {
          if (normalise(requestedAction) === 'buy all') {
            for (let attempts = 0; attempts < 1000; attempts += 1) {
              info = readDetails();
              if (!info || info.stock <= 0 || info.basketFull) { basketFull ||= Boolean(info?.basketFull); break; }
              const numericOptions = info.buttons.map((candidate) => ({ ...candidate, amount: Number(candidate.label.match(/\d+/)?.[0]) })).filter((candidate) => Number.isFinite(candidate.amount) && candidate.amount > 0 && candidate.amount <= info.stock).sort((a, b) => b.amount - a.amount);
              const next = numericOptions.find((candidate) => candidate.amount === 10) || numericOptions[0];
              if (!next) break;
              const outcome = await buyOnce(next.label);
              purchased += outcome.bought;
              basketFull ||= outcome.basketFull;
              if (!outcome.bought) break;
            }
          } else {
            const outcome = await buyOnce(requestedAction);
            purchased += outcome.bought;
            basketFull ||= outcome.basketFull;
          }
          const finalInfo = readDetails();
          return { purchased, basketFull, stock: finalInfo?.stock ?? 0, owned: initialOwned + purchased, buyOptions: finalInfo?.buttons.map((candidate) => candidate.label) || [] };
        } finally {
          dialog.querySelector('img[src*="/game-assets/icons/close.png"]')?.click();
        }
      },
      args: [seedName, requestedBuy, slotIndex]
    });
    if (result?.error) throw new Error(result.error);
    if (result?.basketFull) logActionError('Túi đã đầy, đã dừng mua.');
    if (!result?.purchased && !result?.basketFull) logActionError(`Không thể mua ${seedName}; stock hoặc nút Buy đã thay đổi.`);
    if (result?.purchased && Number.isFinite(currentCoins)) {
      const item = lastBettyScan?.items.find((entry) => entry.name === seedName);
      const unitPrice = Number(String(item?.price || '').replace(/,/g, ''));
      if (Number.isFinite(unitPrice)) setCurrentCoins(currentCoins - unitPrice * result.purchased);
    }
    syncBettyPurchase(seedName, result);
    if (result?.purchased) await refreshConnection();
  } catch (error) {
    logActionError(error.message || 'Mua hạt thất bại.');
    buttons.forEach((item) => { item.disabled = false; });
    button.textContent = previousLabel;
  } finally {
    finishLog();
  }
});

function titleCase(value) {
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
}

async function findSunflowerTab() {
  const { sunflowerTabId } = await chrome.storage.session.get('sunflowerTabId');
  if (sunflowerTabId) {
    try {
      const rememberedTab = await chrome.tabs.get(sunflowerTabId);
      if (rememberedTab.url?.startsWith('https://sunflower-land.com/')) return rememberedTab;
    } catch { /* The remembered tab no longer exists. */ }
  }
  const allTabs = await chrome.tabs.query({ url: 'https://sunflower-land.com/*' });
  return allTabs.find((tab) => tab.active) || allTabs[0] || null;
}

async function executeOnSunflowerTabs(injection) {
  const tab = await findSunflowerTab();
  if (!tab?.id) throw new Error('Không tìm thấy tab Sunflower Land đang mở.');
  const result = await chrome.scripting.executeScript({ ...injection, target: { tabId: tab.id } });
  chrome.storage.session.set({ sunflowerTabId: tab.id });
  return result;
}

function renderConnection(tab) {
  const connected = Boolean(tab?.url && new URL(tab.url).hostname === 'sunflower-land.com');
  connectButton.disabled = connected;
  disconnectedContent.hidden = connected;
  connectedContent.hidden = !connected;
  status.className = `connection ${connected ? 'is-connected' : 'is-disconnected'}`;
  status.innerHTML = `<span></span> ${connected ? 'Đã kết nối Sunflower Land' : 'Chưa kết nối Sunflower Land'}`;
  siteLabel.textContent = connected ? 'sunflower-land.com • connected' : 'Mở sunflower-land.com để kết nối';
  if (!connected) landInfo.textContent = 'Mở Sunflower Land để đọc thông tin land.';
  return connected;
}

async function refreshConnection() {
  try {
    const tab = await findSunflowerTab();
    if (!renderConnection(tab) || !tab?.id) return;
    chrome.runtime.sendMessage({ type: 'SUNFLOWER_TAB_CONNECTED', tabId: tab.id, url: tab.url });
    const [{ result }] = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => {
        const balance = (alt) => {
          const icon = Array.from(document.querySelectorAll('img')).find((image) => image.alt.trim().toLowerCase() === alt.toLowerCase());
          const container = icon?.closest('.flex.items-center');
          return { value: container?.querySelector('.balance-text')?.textContent.trim() || '', icon: icon?.currentSrc || icon?.src || '' };
        };
        return {
          genesis: document.querySelector('#genesisBlock')?.getAttribute('src') || '',
          tree: Array.from(document.querySelectorAll('img')).map((image) => image.currentSrc || image.src || '').find((source) => /\/game-assets\/resources\/tree\/[^/]+\/[^/]+_([^/]+)_tree\.webp/i.test(source)) || '',
          betty: Array.from(document.querySelectorAll('img')).map((image) => image.currentSrc || image.src || '').find((source) => /\/game-assets\/(?:[^/]+\/)*buildings\/(?:[^/]+\/)*(?:bettys_)?market\.(?:webp|png)(?:[?#]|$)/i.test(source)) || '',
          balances: { coins: balance('Coins'), gems: balance('Gems'), flw: balance('FLOWER') }
        };
      }
    });
    const landMatch = result.genesis.match(/\/land\/levels\/([^/]+)(?:\/([^/]+))?\/level_(\d+)\.(?:webp|png)/i);
    const treeMatch = result.tree.match(/\/resources\/tree\/([^/]+)\/([^/_]+)_([^/_]+)_tree\.webp/i);
    const bettyMatch = result.betty.match(/\/game-assets\/([^/]+)\/buildings\//i);
    const landName = landMatch ? `${titleCase(landMatch[1])}.Lv${landMatch[3]}` : bettyMatch ? titleCase(bettyMatch[1]) : treeMatch ? titleCase(treeMatch[3]) : '';
    const season = landMatch?.[2] || treeMatch?.[2];
    const displayedSeason = marketSeasonInfo?.season || season;
    const image = result.genesis || result.tree || result.betty;
    const seasonIcon = marketSeasonInfo?.icon || seasonIcons[String(displayedSeason || '').toLowerCase()] || seasonIcons.spring;
    const balances = result.balances || {};
    const scannedCoins = Number(String(balances.coins?.value || '').replace(/,/g, ''));
    if (Number.isFinite(scannedCoins)) setCurrentCoins(scannedCoins, balances.coins?.icon);
    const balanceItem = (label, balance) => balance?.value ? `<span class="land-balance"><b>${escapeHtml(balance.value)}</b>${balance.icon ? `<img src="${escapeHtml(balance.icon)}" alt="${label}" />` : label}</span>` : '';
    landInfo.innerHTML = landName
      ? `<div class="land-details land-info-card"><strong><img class="land-thumbnail" src="${image}" alt="Land" />${landName}</strong>${displayedSeason ? `<span><img class="season-icon" src="${seasonIcon}" alt="Season" />${titleCase(displayedSeason)}</span>` : ''}</div><div class="land-balances land-balance-card">${balanceItem('Coins', balances.coins)}${balanceItem('Gems', balances.gems)}${balanceItem('FLW', balances.flw)}</div>`
      : 'Không tìm thấy thông tin land.';
    if (lastToolsScan) renderOverview();
    return true;
  } catch {
    renderConnection(null);
    return false;
  }
}

async function initialisePanelConnection() {
  const connected = await refreshConnection();
  if (!connected) return;
  await scanMap();
}

chrome.runtime.onMessage.addListener((message) => {
  if (message.type === 'HARVEST_NPC_MINI_GAME_FAILED') logActionError(`Không thể tự giải mini game ${message.game}: không tìm đủ mục tiêu.`);
  if (message.type === 'HARVEST_CHEST_STARTED' && !message.clicked) logActionError('Gặp mini game Chest nhưng không tìm được ảnh Chest để click.');
});

function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[character]);
}

function formatCountdown(seconds) {
  const value = Math.max(0, Math.ceil(seconds));
  const days = Math.floor(value / 86400);
  const hours = Math.floor((value % 86400) / 3600);
  const minutes = Math.floor((value % 3600) / 60);
  const remainingSeconds = value % 60;
  if (days) return `${days}d ${String(hours).padStart(2, '0')}h ${String(minutes).padStart(2, '0')}m`;
  if (hours) return `${hours}h ${String(minutes).padStart(2, '0')}m ${String(remainingSeconds).padStart(2, '0')}s`;
  if (minutes) return `${minutes}m ${String(remainingSeconds).padStart(2, '0')}s`;
  return `${remainingSeconds}s`;
}

function formatCompactCount(value) {
  if (!Number.isFinite(Number(value))) return value ?? '—';
  const count = Number(value);
  return Math.abs(count) >= 1000 ? `${(count / 1000).toFixed(1).replace(/\.0$/, '')}k` : String(count);
}

function formatExactCount(value) {
  return Number.isFinite(Number(value)) ? Number(value).toLocaleString('en-US') : '—';
}

function log(message) {
  const entry = document.createElement('div');
  entry.textContent = `[${new Date().toLocaleTimeString('vi-VN')}] ${message}`;
  panelLog.prepend(entry);
  while (panelLog.children.length > 40) panelLog.lastElementChild.remove();
  return entry;
}

function startActionLog(message, successMessage = '') {
  const entry = log(message);
  entry.classList.add('is-progress');
  const completedMessage = successMessage || ({
    'Đang khai thác…': 'Khai thác thành công.',
    'Đang chặt cây…': 'Chặt Tree thành công.',
    'Đang trồng…': 'Trồng thành công.',
    'Đang thu hoạch…': 'Thu hoạch thành công.',
    'Đang đốn…': 'Đốn Fruit thành công.',
    'Đang bón phân…': 'Bón phân thành công.',
    'Đang quét Map…': 'Đã quét Map.',
    'Đang quét Betty…': 'Đã quét Betty.',
    'Đang quét Tools…': 'Đã quét Tools.',
    'Đang quét túi đồ…': 'Đã quét túi đồ.',
    'Đang mua hạt…': 'Mua hạt thành công.',
    'Đang mua Tool…': 'Mua Tool thành công.'
  })[message] || 'Hoàn tất.';
  return (...messages) => {
    const failed = entry.dataset.failed === 'true';
    entry.remove();
    if (failed) return;
    const messageToLog = messages.length ? messages[0] : completedMessage;
    if (!messageToLog) return;
    const completed = log(messageToLog);
    completed.classList.add('is-success');
  };
}

function logActionError(message) {
  Array.from(panelLog.querySelectorAll('.is-progress')).at(-1)?.setAttribute('data-failed', 'true');
  const entry = log(message);
  entry.classList.add('is-error');
}

function promoteGrowingCard(card) {
  const growingSection = card.closest('.crop-section');
  let readySection = cropResults.querySelector('[data-activity="crop"] .crop-section');
  if (!readySection) {
    let cropPanel = cropResults.querySelector('[data-crop-panel="ready"]');
    if (!cropPanel) {
      cropResults.insertAdjacentHTML('afterbegin', '<section class="crop-panel" data-crop-panel="ready"><h2>Sẵn sàng</h2></section>');
      cropPanel = cropResults.querySelector('[data-crop-panel="ready"]');
    }
    const group = document.createElement('div');
    group.className = 'activity-group';
    group.dataset.activity = 'crop';
    group.innerHTML = '<h3>Crop</h3>';
    readySection = document.createElement('div');
    readySection.className = 'crop-section';
    readySection.dataset.cropSection = 'ready';
    readySection.innerHTML = '<div class="crop-grid"></div>';
    group.append(readySection);
    cropPanel.append(group);
  }
  const readyGrid = readySection.querySelector('.crop-grid');
  const matchingCard = Array.from(readyGrid.querySelectorAll('.crop-card')).find((candidate) => candidate.dataset.cropName === card.dataset.cropName && candidate.dataset.fertiliserType === card.dataset.fertiliserType);
  const count = Number(card.dataset.count || 1);
  if (matchingCard) {
    const total = Number(matchingCard.dataset.count || 0) + count;
    matchingCard.dataset.count = String(total);
    const existingKeys = matchingCard.dataset.mapKeys ? matchingCard.dataset.mapKeys.split('||').filter(Boolean) : [];
    const addedKeys = card.dataset.mapKeys ? card.dataset.mapKeys.split('||').filter(Boolean) : [];
    matchingCard.dataset.mapKeys = Array.from(new Set(existingKeys.concat(addedKeys))).join('||');
    matchingCard.querySelector('.crop-quantity').textContent = `×${total}`;
    card.remove();
  } else {
    card.classList.remove('is-growing');
    card.classList.add('is-ready');
    const cropImage = card.querySelector('.crop-image');
    cropImage.src = cropImage.src.replace(/\/(seedling|halfway|almost)\.png(?:[?#].*)?$/i, '/plant.png');
    card.querySelector('.crop-quantity').textContent = `×${count}`;
    card.querySelector('.crop-card-state').textContent = 'Sẵn sàng';
    card.querySelector('.crop-card-meta')?.remove();
    let actions = card.querySelector('.crop-card-actions');
    if (!actions) {
      actions = document.createElement('div');
      actions.className = 'crop-card-actions';
      card.append(actions);
    }
    actions.innerHTML = '<button type="button" data-ui-action="harvest">Thu hoạch</button>';
    readyGrid.append(card);
  }
  if (!growingSection.querySelector('.crop-card')) growingSection.remove();
}

function promoteGrowingTree(card) {
  card.dataset.treeRefreshPending = 'true';
  card.querySelector('.crop-card-meta').textContent = 'Đang cập nhật Tree…';
  card.querySelector('[data-countdown-target]')?.remove();
}

function promoteGrowingComposter(card) {
  card.classList.remove('is-growing');
  card.classList.add('is-ready');
  card.querySelector('.crop-card-state').textContent = 'Sẵn sàng';
  const meta = card.querySelector('.crop-card-meta');
  if (meta) meta.textContent = 'Sẵn sàng thu hoạch';
  let actions = card.querySelector('.crop-card-actions');
  if (!actions) {
    actions = document.createElement('div');
    actions.className = 'crop-card-actions';
    card.append(actions);
  }
  actions.innerHTML = '<span class="compost-action"><button type="button" data-ui-action="collect-composter">Collect</button></span>';
}

function promoteGrowingCrop(card) {
  const mapKeys = (card.dataset.mapKeys || '').split('||').filter(Boolean);
  if (!mapKeys.length || !lastScanData?.growing) return false;
  const movedKeys = new Set(mapKeys);
  let promoted = null;
  lastScanData.growing = lastScanData.growing.flatMap((item) => {
    const itemKeys = item.mapKeys || [];
    const keysToMove = itemKeys.filter((key) => movedKeys.has(key));
    if (!keysToMove.length) return [item];
    promoted ||= { ...item, count: 0, mapKeys: [] };
    promoted.count += keysToMove.length;
    promoted.mapKeys.push(...keysToMove);
    const remainingKeys = itemKeys.filter((key) => !movedKeys.has(key));
    return remainingKeys.length ? [{ ...item, count: remainingKeys.length, mapKeys: remainingKeys }] : [];
  });
  if (!promoted?.count) return false;
  const readyIcon = String(promoted.icon || '').replace(/\/(seedling|halfway|almost)\.png(?:[?#].*)?$/i, '/plant.png');
  const readyItems = lastScanData.ready || (lastScanData.ready = []);
  const existing = readyItems.find((item) => item.label === promoted.label && Number(item.fertiliserType || 0) === Number(promoted.fertiliserType || 0) && Boolean(item.bee) === Boolean(promoted.bee));
  if (existing) {
    existing.count = Number(existing.count || 0) + promoted.count;
    existing.mapKeys = Array.from(new Set([...(existing.mapKeys || []), ...promoted.mapKeys]));
    existing.icon = readyIcon || existing.icon;
  } else {
    readyItems.push({ ...promoted, icon: readyIcon || promoted.icon, seconds: null, countdownTarget: null });
  }
  countdownTargets.delete(mapKeys.join('||'));
  renderOverview();
  startCountdowns();
  return true;
}

function scheduleTreeRefresh() {
  window.clearTimeout(treeRefreshTimer);
  treeRefreshTimer = window.setTimeout(() => scanMap(), 700);
}

function startCountdowns() {
  window.clearInterval(countdownTimer);
  syncReadyNotifications();
  const update = () => {
    document.querySelectorAll('[data-countdown-target]').forEach((element) => {
      const seconds = (Number(element.dataset.countdownTarget) - Date.now()) / 1000;
      if (seconds <= 0) {
        const card = element.closest('.crop-card');
        if (card && !card.classList.contains('is-ready')) {
          notifyReadyNow(card, Number(element.dataset.countdownTarget));
          if (card.dataset.resource === 'composter') {
            promoteGrowingComposter(card);
          } else if (card.dataset.resource === 'tree') {
            promoteGrowingTree(card);
            scheduleTreeRefresh();
            log('Tree đã sẵn sàng chặt, đang cập nhật…');
          } else if (card.dataset.resource === 'mining') {
            card.querySelector('.crop-card-meta').textContent = 'Đang cập nhật mỏ…';
            element.remove();
            scheduleTreeRefresh();
            log(`${card.querySelector('.crop-card-title').textContent} đã sẵn sàng khai thác, đang cập nhật…`);
          } else if (card.dataset.resource === 'fruit') {
            card.querySelector('.crop-card-meta').textContent = 'Đang cập nhật Fruit…';
            element.remove();
            scheduleTreeRefresh();
            log(`${card.querySelector('.crop-card-title').textContent} đã sẵn sàng thu hoạch, đang cập nhật…`);
          } else if (card.dataset.resource === 'pet') {
            element.remove();
            void checkAwakePets();
          } else {
            if (!promoteGrowingCrop(card)) {
              card.querySelector('.crop-card-meta').textContent = 'Đang cập nhật Crop…';
              element.remove();
            }
          }
        }
      } else element.textContent = formatCountdown(seconds);
    });
  };
  update();
  countdownTimer = window.setInterval(update, 1000);
}

function countdownMarkup(item) {
  const seconds = Number(item?.seconds);
  if (!Number.isFinite(seconds) || seconds <= 0) return '';
  const key = (item?.mapKeys || []).join('||');
  const previousTarget = Number(item.countdownTarget);
  const cachedTarget = key ? Number(countdownTargets.get(key)) : NaN;
  const target = Number.isFinite(previousTarget) && previousTarget > Date.now() ? previousTarget : Number.isFinite(cachedTarget) && cachedTarget > Date.now() ? cachedTarget : Date.now() + seconds * 1000;
  item.countdownTarget = target;
  if (key) countdownTargets.set(key, target);
  return `<b data-countdown-target="${target}">${formatCountdown(Math.max(0, (target - Date.now()) / 1000))}</b>`;
}

function cropCard(item, type) {
  const isGrowing = type === 'growing';
  const isEmpty = type === 'empty';
  const isTornado = type === 'tornado';
  const tier = isGrowing ? cropTiers.get(String(item.label || '').toLowerCase()) : '';
  const stateLabel = isTornado ? 'Bị khóa' : isEmpty ? 'Đất trống' : isGrowing ? 'Đang hồi' : 'Sẵn sàng';
  const hasCountdown = Number.isFinite(item.seconds) && item.seconds > 0;
  const detail = isTornado ? '' : isGrowing ? hasCountdown ? `<span class="crop-card-meta">${countdownMarkup(item)}</span>` : '<span class="crop-card-meta">Đang cập nhật thời gian…</span>' : '';
  const plantCount = Math.min(Number(item.count || 0), Math.max(0, Number(item.seedCount || 0)));
  const plantLabel = `Trồng x${plantCount}`;
  const action = isTornado ? '' : isEmpty ? (item.canPlant ? `<button type="button" data-ui-action="plant" data-selected-seed="${escapeHtml(item.seedName || '')}" data-target-fertiliser-type="${item.fertiliserType || 0}" data-action-label="${plantLabel}"${plantCount ? '' : ' disabled'}>${plantLabel}</button>` : '<button type="button" disabled>Chọn hạt trước</button>') : type === 'ready' ? '<button type="button" data-ui-action="harvest">Thu hoạch</button>' : item.fertilised ? '' : cropFertiliserIcons.map((icon, index) => `<button class="fertiliser-button" type="button" data-ui-action="fertilise" data-fertiliser-index="${index}" title="Bón phân ${index + 1}"><img src="${icon}" alt="Phân bón ${index + 1}" /><span>×${formatExactCount(fertiliserCounts.get(icon))}</span></button>`).join('');
  if (isEmpty) {
    const soilCard = `<article class="crop-card is-empty" data-crop-name="${escapeHtml(item.label)}" data-fertiliser-type="${item.fertiliserType || 0}" data-map-keys="${escapeHtml((item.mapKeys || []).join('||'))}" data-count="${item.count}"><div class="crop-icon-box"><img class="crop-image" src="${escapeHtml(item.icon)}" alt="" /><b class="crop-quantity">×${item.count}</b></div><div class="crop-card-content"><span class="crop-card-state">Đất trống</span><strong class="crop-card-title">${escapeHtml(item.label)}</strong></div><div class="crop-card-actions">${action}</div></article>`;
    return soilCard;
  }
  return `<article class="crop-card is-${type} ${type === 'ready' ? 'is-ready' : ''} ${isTornado ? 'is-tornado' : ''}" data-crop-name="${escapeHtml(item.label)}" data-fertiliser-type="${item.fertiliserType || 0}" data-time-group="${item.timeGroup ?? ''}" data-map-keys="${escapeHtml((item.mapKeys || []).join('||'))}" data-has-precise-seconds="${Boolean(item.hasPreciseSeconds)}" data-count="${item.count}">${tier ? `<b class="crop-tier">${tier}</b>` : ''}${item.fertilised ? `<img class="fertiliser-mark" src="${fertiliserIcon}" alt="Đã bón phân" />` : ''}${item.bee ? `<img class="bee-mark ${item.fertiliserType === 1 ? 'with-fertiliser' : ''}" src="${beeIcon}" alt="Bee" />` : ''}${item.fertiliserType === 2 ? '<img class="stopwatch-mark" src="https://sunflower-land.com/game-assets/icons/stopwatch.png" alt="Phân bón tăng tốc" />' : ''}${item.tornadoIcon ? `<img class="tornado-mark" src="${escapeHtml(item.tornadoIcon)}" alt="Tornado" />` : ''}<div class="crop-icon-box"><img class="crop-image" src="${escapeHtml(item.icon)}" alt="" /><b class="crop-quantity">×${item.count}</b></div><div class="crop-card-content"><span class="crop-card-state">${stateLabel}</span><strong class="crop-card-title">${escapeHtml(item.label)}</strong>${detail}</div>${action ? `<div class="crop-card-actions">${action}</div>` : ''}</article>`;
}

function cropSeedCard(seed) {
  const seedName = seed?.name || 'Chưa chọn hạt';
  return `<article class="crop-card is-empty empty-seed-card overview-seed-card" data-ui-action="choose-seed"><div class="crop-icon-box">${seed?.icon ? `<img class="crop-image" src="${escapeHtml(seed.icon)}" alt="" />` : '<span class="empty-seed-placeholder">?</span>'}${seed?.icon ? `<b class="crop-quantity">×${getSeedCount(seed)}</b>` : ''}</div><div class="crop-card-content"><span class="crop-card-state">Hạt trồng</span><strong class="crop-card-title">Hạt trồng</strong><span class="crop-card-meta">${escapeHtml(seedName)}</span></div><span class="seed-card-select-overlay">Chọn hạt</span></article>`;
}

function toolCanCraft(item, option) {
  const amount = Number((String(option).match(/\d+/) || ['1'])[0]);
  if (item.disabledCraftOptions?.includes(option)) return false;
  return (item.requirements || []).every((entry) => {
    const pair = String(entry.text || '').match(/^\s*([\d,.]+)\s*\/\s*([\d,.]+)\s*$/);
    if (pair) return Number(pair[1].replace(/,/g, '')) + 1e-9 >= Number(pair[2].replace(/,/g, '')) * amount;
    const price = Number(String(entry.text || '').replace(/,/g, ''));
    return !Number.isFinite(price) || !Number.isFinite(currentCoins) || currentCoins + 1e-9 >= price * amount;
  });
}

function toolRequirementMissing(entry) {
  const pair = String(entry.text || '').match(/^\s*([\d,.]+)\s*\/\s*([\d,.]+)\s*$/);
  return Boolean(pair && Number(pair[1].replace(/,/g, '')) + 1e-9 < Number(pair[2].replace(/,/g, '')));
}

function toolCraftTooltip(item, option) {
  const amount = Number((String(option).match(/\d+/) || ['1'])[0]);
  const formatValue = (value) => Number.isFinite(Number(value)) ? Number(value).toLocaleString('en-US', { maximumFractionDigits: 1 }) : String(value);
  const rows = (item.requirements || []).map((entry) => {
    const pair = String(entry.text || '').match(/^\s*([\d,.]+)\s*\/\s*([\d,.]+)\s*$/);
    if (pair) {
      const available = Number(pair[1].replace(/,/g, ''));
      const required = Number(pair[2].replace(/,/g, '')) * amount;
      const missing = available + 1e-9 < required;
      return `<span class="craft-tooltip-row${missing ? ' is-missing' : ''}">${entry.icon ? `<img src="${escapeHtml(entry.icon)}" alt="" />` : ''}<b>${escapeHtml(`${formatValue(available)}/${formatValue(required)}`)}</b></span>`;
    }
    const price = Number(String(entry.text || '').replace(/,/g, ''));
    if (Number.isFinite(price) && price > 0) {
      const required = price * amount;
      const available = Number.isFinite(currentCoins) ? currentCoins : '—';
      const missing = Number.isFinite(currentCoins) && currentCoins + 1e-9 < required;
      return `<span class="craft-tooltip-row${missing ? ' is-missing' : ''}">${entry.icon ? `<img src="${escapeHtml(entry.icon)}" alt="" />` : ''}<b>${escapeHtml(`${formatValue(available)}/${formatValue(required)}`)}</b></span>`;
    }
    return '';
  }).join('');
  return rows ? `<span class="craft-tooltip">${rows}</span>` : '';
}

function toolBuyLabel(option) {
  return String(option).replace(/^Craft\b/i, 'Buy');
}

function overviewToolCard(name, icon, count, category = 'Craft') {
  const item = lastToolsScan?.items.find((entry) => entry.icon === icon);
  if (!item) return `<article class="shop-card overview-tool-card"><b class="shop-tier tool-card-label">TOOL</b><div class="shop-icon-box"><img class="shop-item-icon" src="${escapeHtml(icon)}" alt="" /><b class="crop-quantity">×${escapeHtml(count)}</b></div><div class="shop-card-content"><strong>${escapeHtml(name)}</strong></div><div class="shop-buy-actions scan-tools-actions"><button type="button" data-ui-action="scan-tools">Quét Tools</button></div></article>`;
  const stock = item.soldOut ? 'Stock: 0' : item.stockText || `×${item.count}`;
  const hasMissingRequirement = (item.requirements || []).some(toolRequirementMissing);
  const options = item.craftOptions || [];
  const actions = !item.soldOut ? options.map((option) => `<span class="craft-action"><button type="button" data-tool-craft="${escapeHtml(option)}"${toolCanCraft(item, option) ? '' : ' class="is-insufficient" disabled'}>${escapeHtml(toolBuyLabel(option))}</button>${toolCraftTooltip(item, option)}</span>`).join('') : '';
  return `<article class="shop-card tool-shop-card overview-tool-card ${item.soldOut || hasMissingRequirement ? 'is-unavailable' : ''} ${item.soldOut ? 'is-sold-out' : ''}" data-tool-category="${escapeHtml(item.category)}" data-tool-slot-index="${item.slotIndex}"><b class="shop-tier tool-card-label">TOOL</b><div class="shop-icon-box"><img class="shop-item-icon" src="${escapeHtml(item.icon)}" alt="" /><b class="crop-quantity">×${escapeHtml(item.count)}</b></div><div class="shop-card-content"><strong>${escapeHtml(item.name)}</strong><div class="shop-card-meta"><span>${escapeHtml(stock)}</span>${item.soldOut ? '<span class="tool-sold-out">Sold out</span>' : ''}</div></div>${actions ? `<div class="shop-buy-actions">${actions}</div>` : ''}</article>`;
}

function renderOverview() {
  if (!overviewResults) return;
  const data = lastScanData;
  if (!data) return;
  const cardKey = (card) => [card.dataset.resource || '', card.dataset.cropName || '', card.dataset.miningResource || '', card.dataset.mapKeys || ''].join('|');
  const cardSignature = (card) => [
    Array.from(card.classList).filter((name) => name !== 'card-appear' && name !== 'card-state-change').sort().join(' '),
    card.dataset.count || '',
    card.dataset.saltHits || '',
    card.querySelector('.crop-card-state')?.textContent?.trim() || '',
    card.querySelector('.crop-card-title')?.textContent?.trim() || '',
    card.querySelector('.crop-image')?.currentSrc || card.querySelector('.crop-image')?.src || ''
  ].join('|');
  const previousCards = new Map(Array.from(overviewResults.querySelectorAll('.crop-card')).map((card) => {
    const key = cardKey(card);
    const box = card.getBoundingClientRect();
    const parentBox = overviewResults.getBoundingClientRect();
    return [key, { html: card.outerHTML, signature: cardSignature(card), left: box.left - parentBox.left, top: box.top - parentBox.top, width: box.width, height: box.height }];
  }));
  const cropSeed = selectedPlantSeed || null;
  const fruitSeed = selectedFruitSeed || (isFruitSeed(data.heldFruitSeed) ? data.heldFruitSeed : null);
  const cropEmpty = Array.from((data.empty || []).reduce((groups, item) => {
    const key = `${item.fertiliserType || 0}|${Boolean(item.fertilised)}`;
    const current = groups.get(key) || { ...item, count: 0, mapKeys: [] };
    current.count += Number(item.count || (item.mapKeys || []).length || 0);
    current.mapKeys.push(...(item.mapKeys || []));
    groups.set(key, current);
    return groups;
  }, new Map()).values());
  const hasCropSoil = cropEmpty.length > 0;
  const hasFruitSoil = (data.fruit?.empty || []).length > 0;
  const hasFruit = Boolean((data.fruit?.empty?.length || 0) + (data.fruit?.ready?.length || 0) + (data.fruit?.growing?.length || 0) + (data.fruit?.dead?.length || 0));
  const cropCards = [
    ...cropEmpty.map((item) => cropCard({ ...item, label: 'Đất Crop trống', canPlant: Boolean(cropSeed), seedName: cropSeed?.name || '', seedCount: getSeedCount(cropSeed) }, 'empty')),
    ...(hasCropSoil ? [cropSeedCard(cropSeed)] : []),
    ...(data.ready || []).map((item) => cropCard(item, 'ready'))
  ];
  const cropGrowingCards = (data.growing || []).map((item) => cropCard(item, 'growing'));
  const fruitCards = [
    ...(data.fruit?.empty || []).map((item) => fruitCard(item, 'empty', fruitSeed)),
    ...(hasFruitSoil ? [fruitSeedCard(fruitSeed)] : []),
    ...(data.fruit?.ready || []).map((item) => fruitCard(item, 'ready', fruitSeed)),
    ...(data.fruit?.dead || []).map((item) => fruitCard(item, 'dead', fruitSeed))
  ];
  const fruitGrowingCards = (data.fruit?.growing || []).map((item) => fruitCard(item, 'growing', fruitSeed));
  const enrichComposters = (items = []) => {
    const grouped = new Map();
    items.forEach((item) => (item.mapKeys || []).forEach((mapKey) => {
      const detail = composterDetails.get(mapKey) || {};
      const seconds = detail.seconds ?? null;
      const key = `${item.label}|${Number.isFinite(seconds) ? seconds : 'unknown'}|${detail.canCompost ?? ''}`;
      const current = grouped.get(key) || { ...item, count: 0, seconds, recipe: detail.recipe || item.recipe || [], requirements: detail.requirements || item.requirements || [], canCompost: detail.canCompost, mapKeys: [] };
      current.count += 1;
      current.mapKeys.push(mapKey);
      grouped.set(key, current);
    }));
    return Array.from(grouped.values());
  };
  const composters = {
    ready: enrichComposters(data.composters?.ready),
    empty: enrichComposters(data.composters?.empty),
    growing: enrichComposters(data.composters?.growing)
  };
  const composterCards = [
    ...composters.ready.map((item) => composterCard(item, 'ready')),
    ...composters.empty.map((item) => composterCard(item, 'empty'))
  ];
  const composterGrowingCards = composters.growing.map((item) => composterCard(item, 'growing'));
  const hasComposters = Boolean(composterCards.length + composterGrowingCards.length);
  const readyTrees = data.trees?.ready || [];
  const growingTrees = data.trees?.growing || [];
  const axeCard = overviewToolCard('Axe', axeIcon, toolCounts.get(axeIcon) ?? (toolBagScanned ? 0 : '—'));
  const treeCards = readyTrees.length ? [...readyTrees.map((item) => treeCard(item, 'ready')), axeCard] : [];
  const treeGrowingCards = [...growingTrees.map((item) => treeCard(item, 'growing')), ...(!readyTrees.length && growingTrees.length ? [axeCard] : [])];
  const miningOrder = { stone: 0, iron: 1, gold: 2 };
  const sortMining = (items) => [...items].sort((left, right) => (miningOrder[left.resource] ?? 99) - (miningOrder[right.resource] ?? 99));
  const readyMining = sortMining(data.mining?.ready || []);
  const growingMining = sortMining(data.mining?.growing || []);
  const miningToolCard = (item) => {
    const tool = pickaxeTools[item.resource] || {};
    const source = pickaxeSource(item.resource);
    return overviewToolCard(tool.name || 'Pickaxe', source || tool.fallback || '', source ? toolCounts.get(source) : (toolBagScanned ? 0 : '—'));
  };
  const readyMiningResources = new Set(readyMining.map((item) => item.resource));
  const miningCards = [
    ...readyMining.flatMap((item) => [miningCard(item, 'ready'), miningToolCard(item)])
  ];
  const pairedGrowing = new Set();
  const miningGrowingPairs = Object.keys(miningOrder).flatMap((resource) => {
    if (readyMiningResources.has(resource)) return [];
    const shortest = growingMining
      .filter((item) => item.resource === resource)
      .sort((left, right) => (Number.isFinite(left.seconds) ? left.seconds : Infinity) - (Number.isFinite(right.seconds) ? right.seconds : Infinity))[0];
    if (!shortest) return [];
    pairedGrowing.add(shortest);
    return [miningCard(shortest, 'growing'), miningToolCard(shortest)];
  });
  const miningGrowingCards = [
    ...miningGrowingPairs,
    ...growingMining.filter((item) => !pairedGrowing.has(item)).map((item) => miningCard(item, 'growing'))
  ];
  const saltReady = data.salt?.ready || [];
  const saltGrowing = data.salt?.growing || [];
  const saltUpgrade = data.salt?.upgrade || [];
  const saltRake = saltRakeSource();
  const saltRakeCard = overviewToolCard('Salt Rake', saltRake || saltRakeFallback, saltRake ? toolCounts.get(saltRake) : (toolBagScanned ? 0 : '—'));
  const saltGrowingCards = saltGrowing.map((item) => saltCard(item, true));
  const saltCards = saltReady.length || saltGrowing.length || saltUpgrade.length
    ? (saltReady.length
      ? [...saltReady.map((item) => saltCard(item)), saltRakeCard, ...saltGrowingCards, ...saltUpgrade.map((item) => saltUpgradeCard(item))]
      : [...saltUpgrade.map((item) => saltUpgradeCard(item)), saltRakeCard, ...saltGrowingCards])
    : [];
  const mushroomCards = (data.mushrooms?.wild?.count || data.mushrooms?.magic?.count) ? [mushroomCard(data.mushrooms)] : [];
  const sleepingPetCards = (data.pets?.sleeping || []).map((item) => petCard(item, 'sleeping'));
  const awakePetCards = (data.pets?.awake || []).map((item) => petCard(item, 'awake'));
  const section = (title, cards, growingCards = [], scanScope = '') => `<section class="overview-section"><h2>${title}${scanScope ? ` <button class="profession-scan" type="button" data-ui-action="scan-profession" data-scan-scope="${scanScope}">Quét</button>` : ''}</h2><div class="crop-grid">${cards.join('')}</div>${growingCards.length ? `<div class="crop-grid overview-growing-grid">${growingCards.join('')}</div>` : ''}</section>`;
  overviewResults.innerHTML = `<div class="activity-group" data-activity="overview">${mushroomCards.length ? section('Foraging', mushroomCards, [], 'mushroom') : ''}${sleepingPetCards.length || awakePetCards.length ? section('Pet', sleepingPetCards, awakePetCards, 'pet') : ''}${section('Crop', cropCards, cropGrowingCards, 'crop')}${hasFruit ? section('Fruit', fruitCards, fruitGrowingCards, 'fruit') : ''}${hasComposters ? section('Composter <button class="composter-scan-all" type="button" data-ui-action="scan-composter">Quét compost</button>', composterCards, composterGrowingCards) : ''}${section('Tree', treeCards, treeGrowingCards, 'tree')}${section('Mining', miningCards, miningGrowingCards, 'mining')}${saltCards.length ? section('Salt', saltCards, [], 'salt') : ''}</div>`;
  const currentCards = new Set();
  overviewResults.querySelectorAll('.crop-card').forEach((card) => {
    const key = cardKey(card);
    currentCards.add(key);
    const previous = previousCards.get(key);
    if (!previous) card.classList.add('card-appear');
    else if (previous.signature !== cardSignature(card)) card.classList.add('card-state-change');
  });
  previousCards.forEach((previous, key) => {
    if (currentCards.has(key) || !previous.width || !previous.height) return;
    const leavingCard = document.createElement('div');
    leavingCard.className = 'card-leave-overlay';
    leavingCard.style.cssText = `left:${previous.left}px;top:${previous.top}px;width:${previous.width}px;height:${previous.height}px;`;
    leavingCard.innerHTML = previous.html;
    overviewResults.append(leavingCard);
    leavingCard.addEventListener('animationend', () => leavingCard.remove(), { once: true });
  });
  // Re-rendering replaces the Overview DOM node. Preserve the currently open
  // activity instead of letting the new Overview node appear by default.
  const activeActivity = mapActivityTabs.find((tab) => tab.classList.contains('is-active'))?.dataset.mapActivityTab || 'overview';
  const overviewGroup = overviewResults.querySelector('.activity-group[data-activity="overview"]');
  if (overviewGroup) overviewGroup.hidden = activeActivity !== 'overview';
  updateBettyActivityFilter(activeActivity);
  updateWorkbenchActivityFilter(activeActivity);
  updateMapActivityTabIndicators();
  schedulePetSleepCheck();
}

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
  const heldCropSeed = data.heldSeed?.isSeed ? data.heldSeed : null;
  const plantSeed = selectedPlantSeed || heldCropSeed || null;
  const canPlantSelectedSeed = Boolean(plantSeed);
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
  activateMapActivityTab(mapActivityTabs.find((tab) => tab.classList.contains('is-active'))?.dataset.mapActivityTab || 'crop');
  startCountdowns();
}

function treeCard(item, type) {
  const growing = type === 'growing';
  const hasCountdown = growing && Number.isFinite(item.seconds) && item.seconds > 0;
  const axeCount = toolCounts.get(axeIcon) ?? '—';
  const detail = growing ? (hasCountdown ? countdownMarkup(item) : 'Đang cập nhật thời gian…') : '';
  const treeCount = Number(item.count || 0);
  const maxChops = Number.isFinite(Number(axeCount)) ? Math.min(treeCount, Math.max(0, Number(axeCount))) : treeCount;
  const chopLabel = `Chặt x${maxChops}`;
  const action = growing ? '' : !toolBagScanned ? '<div class="crop-card-actions"><button type="button" data-ui-action="scan-tools">Quét Tools</button></div>' : `<div class="crop-card-actions"><button type="button" data-ui-action="chop" data-action-label="${chopLabel}"${maxChops ? '' : ' disabled'}>${chopLabel}</button></div>`;
  return `<article class="crop-card tree-card is-${growing ? 'growing' : 'ready'} ${growing ? '' : 'is-ready'}" data-resource="tree" data-map-keys="${escapeHtml((item.mapKeys || []).join('||'))}" data-count="${item.count}"><div class="crop-icon-box"><img class="crop-image" src="${escapeHtml(item.icon)}" alt="Tree" /><b class="crop-quantity">×${item.count}</b></div><div class="crop-card-content"><span class="crop-card-state">${growing ? 'Đang hồi' : 'Sẵn sàng'}</span><strong class="crop-card-title">Tree</strong>${detail ? `<span class="crop-card-meta">${detail}</span>` : ''}</div>${action}</article>`;
}

function renderTreeScan(trees) {
  treeResults.innerHTML = '';
  treeGrowingResults.innerHTML = '';
  renderOverview();
  activateMapActivityTab(mapActivityTabs.find((tab) => tab.classList.contains('is-active'))?.dataset.mapActivityTab || 'crop');
}

function pickaxeSource(resource) {
  const tool = pickaxeTools[resource];
  if (!tool) return '';
  const sourceMatch = Array.from(toolCounts.keys()).find((source) => tool.pattern.test(source));
  if (sourceMatch) return sourceMatch;
  const wantedName = String(tool.name || '').replace(/[^a-z]/gi, '').toLowerCase();
  return lastToolsScan?.items.find((item) => String(item.name || '').replace(/[^a-z]/gi, '').toLowerCase() === wantedName)?.icon || '';
}

function updateToolCount(icon, count) {
  const nextCount = Math.max(0, Number(count) || 0);
  toolCounts.set(icon, nextCount);
  const scannedTool = lastToolsScan?.items.find((item) => item.icon === icon);
  if (scannedTool) scannedTool.count = nextCount;
  renderWorkbench();
}

function miningCard(item, type) {
  const growing = type === 'growing';
  const scannedToolIcon = pickaxeSource(item.resource);
  const tool = pickaxeTools[item.resource] || {};
  const toolIcon = scannedToolIcon || tool.fallback;
  const toolName = tool.name || 'Pickaxe';
  const toolCount = scannedToolIcon ? toolCounts.get(scannedToolIcon) : toolBagScanned ? 0 : '—';
  const detail = growing ? (Number.isFinite(item.seconds) ? countdownMarkup(item) : 'Đang cập nhật thời gian…') : '';
  const rockCount = Number(item.count || 0);
  const maxMines = Number.isFinite(Number(toolCount)) ? Math.min(rockCount, Math.max(0, Number(toolCount))) : rockCount;
  const mineLabel = `Khai thác x${maxMines}`;
  const action = growing ? '' : !toolBagScanned ? '<div class="crop-card-actions"><button type="button" data-ui-action="scan-tools">Quét Tools</button></div>' : `<div class="crop-card-actions"><button type="button" data-ui-action="mine" data-action-label="${mineLabel}"${maxMines ? '' : ' disabled'}>${mineLabel}</button></div>`;
  return `<article class="crop-card tree-card mining-card is-${growing ? 'growing' : 'ready'} ${growing ? '' : 'is-ready'}" data-resource="mining" data-mining-resource="${item.resource}" data-map-keys="${escapeHtml((item.mapKeys || []).join('||'))}" data-count="${item.count}"><div class="crop-icon-box"><img class="crop-image" src="${escapeHtml(item.icon)}" alt="${escapeHtml(item.label)}" /><b class="crop-quantity">×${item.count}</b></div><div class="crop-card-content"><span class="crop-card-state">${growing ? 'Đang hồi' : 'Sẵn sàng'}</span><strong class="crop-card-title">${escapeHtml(item.label)}</strong>${detail ? `<span class="crop-card-meta">${detail}</span>` : ''}</div>${action}</article>`;
}

function saltRakeSource() {
  return Array.from(toolCounts.keys()).find((source) => /salt[_-]?rake/i.test(source));
}

function saltCard(item, growing = false) {
  if (growing) {
    const hasCountdown = Number.isFinite(item.seconds) && item.seconds > 0;
    const detail = hasCountdown ? countdownMarkup(item) : 'Đang cập nhật thời gian…';
    return `<article class="crop-card tree-card salt-card is-growing" data-resource="salt" data-map-keys="${escapeHtml((item.mapKeys || []).join('||'))}" data-count="${item.count}"><div class="crop-icon-box"><img class="crop-image" src="${escapeHtml(item.icon)}" alt="Salt" /><b class="crop-quantity">×${item.count}</b></div><div class="crop-card-content"><span class="crop-card-state">Đang hồi</span><strong class="crop-card-title">Salt</strong><span class="crop-card-meta">${detail}</span></div></article>`;
  }
  const rakeSource = saltRakeSource();
  const rakeIcon = rakeSource || saltRakeFallback;
  const needsToolScan = !toolBagScanned;
  const lacksRake = toolBagScanned && (!rakeSource || !Number(toolCounts.get(rakeSource)));
  const actions = [1, 2, 3].map((hits) => {
    const unavailable = hits > item.hits || lacksRake;
    const needsScan = needsToolScan;
    return `<span class="salt-rake-action"><button class="salt-rake-button${unavailable || needsScan ? ' is-insufficient' : ''}" type="button" data-ui-action="harvest-salt" data-requested-salt-hits="${hits}"${unavailable && !needsScan ? ' disabled' : ''}><img src="${escapeHtml(rakeIcon)}" alt="Salt Rake" /><span>×${hits}</span></button>${needsScan ? '<span class="salt-rake-tooltip">Quét Tools</span>' : ''}</span>`;
  }).join('');
  return `<article class="crop-card tree-card salt-card is-ready" data-resource="salt" data-salt-hits="${item.hits}" data-map-keys="${escapeHtml((item.mapKeys || []).join('||'))}" data-count="${item.count}"><div class="crop-icon-box"><img class="crop-image" src="${escapeHtml(item.icon)}" alt="Salt" /><b class="crop-quantity">×${item.count}</b></div><div class="crop-card-content"><span class="crop-card-state">Sẵn sàng</span><strong class="crop-card-title">Salt</strong></div><div class="crop-card-actions">${actions}</div></article>`;
}

function scaledSaltRequirement(entry, multiplier) {
  const ratio = String(entry.text || '').match(/^(\d+(?:[.,]\d+)?)\s*\/\s*(\d+(?:[.,]\d+)?)$/);
  const format = (value) => Number.isInteger(value) ? String(value) : String(Math.round(value * 100) / 100);
  if (!ratio) {
    const amount = Number(String(entry.text || '').replace(/,/g, ''));
    if (!Number.isFinite(amount)) return { ...entry, text: String(entry.text || '') };
    const required = amount * multiplier;
    const isCoin = /coin|sunflower/i.test(entry.icon || '');
    return { ...entry, text: format(required), missing: entry.missing || (isCoin && currentCoins < required) };
  }
  const owned = Number(ratio[1].replace(',', '.'));
  const required = Number(ratio[2].replace(',', '.')) * multiplier;
  return { ...entry, text: `${format(owned)}/${format(required)}`, missing: owned < required };
}

function saltUpgradeTooltip(requirements, multiplier) {
  const rows = requirements.map((entry) => scaledSaltRequirement(entry, multiplier));
  return `<span class="craft-tooltip salt-upgrade-tooltip">${rows.map((entry) => `<span class="craft-tooltip-row${entry.missing ? ' is-missing' : ''}">${entry.icon ? `<img src="${escapeHtml(entry.icon)}" alt="" />` : ''}<b>${escapeHtml(entry.text)}</b></span>`).join('')}</span>`;
}

function saltUpgradeCard(item) {
  const mapKeys = (item.mapKeys || []).join('||');
  const detail = saltUpgradeDetails.get(mapKeys);
  const failed = saltUpgradeFailures.has(mapKeys) || detail?.canUpgrade === false;
  const requirementRows = Array.isArray(detail?.requirements) ? detail.requirements : [];
  const actions = Array.from({ length: item.count }, (_, index) => index + 1).map((amount) => `<span class="salt-upgrade-action"><button class="salt-upgrade-button${failed ? ' is-insufficient' : ''}" type="button" data-ui-action="upgrade-salt" data-requested-salt-upgrades="${amount}"${failed ? ' disabled' : ''}>×${amount}</button>${requirementRows.length ? saltUpgradeTooltip(requirementRows, amount) : ''}</span>`).join('');
  return `<article class="crop-card tree-card salt-card salt-upgrade-card is-ready" data-resource="salt-upgrade" data-map-keys="${escapeHtml(mapKeys)}" data-count="${item.count}"><div class="crop-icon-box"><img class="crop-image" src="${escapeHtml(item.icon)}" alt="Salt" /><img class="salt-upgrade-mark" src="${saltUpgradeIcon}" alt="Upgrade" /><b class="crop-quantity">×${item.count}</b></div><div class="crop-card-content"><span class="crop-card-state">Nâng cấp</span><strong class="crop-card-title">Upgrade Salt</strong></div><div class="crop-card-actions salt-upgrade-actions">${actions}</div></article>`;
}

function mushroomCard(mushrooms) {
  const wild = mushrooms.wild || { count: 0, mapKeys: [] };
  const magic = mushrooms.magic || { count: 0, mapKeys: [] };
  const mapKeys = [...(wild.mapKeys || []), ...(magic.mapKeys || [])];
  const count = Number(wild.count || 0) + Number(magic.count || 0);
  const item = (type, label, amount) => `<span class="mushroom-count${amount ? '' : ' is-empty'}" title="${label}"><i class="mushroom-icon mushroom-icon-${type}" aria-hidden="true"></i><b>×${amount}</b></span>`;
  return `<article class="crop-card mushroom-card is-ready" data-resource="mushroom" data-map-keys="${escapeHtml(mapKeys.join('||'))}" data-count="${count}"><div class="mushroom-summary"><div><span class="crop-card-state">Sẵn sàng</span><strong class="crop-card-title">Nấm hoang</strong></div><div class="mushroom-counts">${item('wild', 'Wild Mushroom', wild.count || 0)}${item('magic', 'Magic Mushroom', magic.count || 0)}</div></div><button type="button" data-ui-action="harvest-mushrooms">Thu hoạch</button></article>`;
}

function petCard(item, state = 'sleeping') {
  const sleeping = state === 'sleeping';
  const action = sleeping ? '<div class="crop-card-actions"><button type="button" data-ui-action="wake-pet">Đánh thức</button></div>' : '';
  return `<article class="crop-card tree-card pet-card is-growing" data-resource="pet" data-pet-state="${sleeping ? 'sleeping' : 'awake'}" data-map-keys="${escapeHtml((item.mapKeys || []).join('||'))}" data-count="${item.count}"><div class="crop-icon-box"><img class="crop-image" src="${escapeHtml(item.icon)}" alt="${escapeHtml(item.label)}" /><b class="crop-quantity">×${item.count}</b></div><div class="crop-card-content"><span class="crop-card-state">${sleeping ? 'Đang ngủ' : 'Activity'}</span><strong class="crop-card-title">${escapeHtml(item.label)}</strong></div>${action}</article>`;
}

function composterCard(item, type) {
  const growing = type === 'growing';
  const empty = type === 'empty';
  const ready = type === 'ready';
  const hasCountdown = growing && Number.isFinite(item.seconds) && item.seconds > 0;
  const state = ready ? 'Sẵn sàng' : empty ? 'Trống' : 'Đang hồi';
  const detail = growing ? (hasCountdown ? countdownMarkup(item) : 'Đang cập nhật thời gian…') : ready ? 'Sẵn sàng thu hoạch' : 'Sẵn sàng ủ phân';
  const action = ready ? 'Collect' : empty ? 'Compost' : '';
  const recipe = (item.requirements || item.recipe || []).map((entry) => {
    const amounts = String(entry.text || '').match(/([\d.,]+)\s*\/\s*([\d.,]+)/);
    const available = Number(amounts?.[1]?.replace(/,/g, ''));
    const needed = Number(amounts?.[2]?.replace(/,/g, ''));
    const missing = Number.isFinite(available) && Number.isFinite(needed) && available < needed;
    return `<span class="compost-tooltip-item${missing ? ' is-missing' : ''}">${entry.icon ? `<img src="${escapeHtml(entry.icon)}" alt="" />` : ''}<b>${escapeHtml(entry.text)}</b></span>`;
  }).join('');
  const insufficient = empty && item.canCompost === false;
  return `<article class="crop-card composter-card is-${type} ${ready ? 'is-ready' : ''}" data-resource="composter" data-map-keys="${escapeHtml((item.mapKeys || []).join('||'))}" data-count="${item.count}"><div class="crop-icon-box"><img class="crop-image" src="${escapeHtml(item.icon)}" alt="" /><b class="crop-quantity">×${item.count}</b></div><div class="crop-card-content"><span class="crop-card-state">${state}</span><strong class="crop-card-title">${escapeHtml(item.label)}</strong><span class="crop-card-meta">${detail}</span></div>${action ? `<div class="crop-card-actions"><span class="compost-action"><button type="button" data-ui-action="${ready ? 'collect-composter' : 'compost'}"${insufficient ? ' class="is-insufficient" disabled' : ''}>${action}</button>${recipe ? `<span class="compost-tooltip">${recipe}</span>` : ''}</span></div>` : ''}</article>`;
}

function renderMiningScan(mining) {
  miningResults.innerHTML = '';
  miningGrowingResults.innerHTML = '';
  renderOverview();
  activateMapActivityTab(mapActivityTabs.find((tab) => tab.classList.contains('is-active'))?.dataset.mapActivityTab || 'crop');
}

function fruitCard(item, type, heldSeed) {
  const growing = type === 'growing';
  const empty = type === 'empty';
  const dead = type === 'dead';
  const ready = type === 'ready';
  const hasCountdown = growing && Number.isFinite(item.seconds) && item.seconds > 0;
  const state = empty ? 'Đất trống' : dead ? 'Sẵn sàng' : growing ? 'Đang hồi' : 'Sẵn sàng';
  const detail = empty ? (heldSeed ? `${heldSeed.name} ×${heldSeed.count}` : 'Chưa cầm hạt Fruit') : growing ? (hasCountdown ? countdownMarkup(item) : 'Đang cập nhật thời gian…') : dead ? `Axe ×${toolCounts.get(axeIcon) ?? '—'}` : 'Sẵn sàng thu hoạch';
  const fruitName = String(item.label || '').replace(/\s+tree$/i, '').trim();
  const seedIcon = lastBettyScan?.items.find((seed) => /fruit/i.test(seed.category || '') && seed.name.replace(/\s+seed$/i, '').trim().toLowerCase() === fruitName.toLowerCase())?.icon;
  if (empty) {
    const plantCount = Math.min(Number(item.count || 0), getSeedCount(heldSeed));
    const plantLabel = `Trồng x${plantCount}`;
    const soilCard = `<article class="crop-card fruit-card fruit-soil-card is-empty is-ready" data-resource="fruit" data-crop-name="Đất Fruit trống" data-fertiliser-type="${item.fertiliserType || 0}" data-map-keys="${escapeHtml((item.mapKeys || []).join('||'))}" data-count="${item.count}">${item.fertilised ? `<img class="fertiliser-mark" src="${fertiliserIcon}" alt="Đã bón phân" />` : ''}${item.fertiliserType === 2 ? '<img class="stopwatch-mark" src="https://sunflower-land.com/game-assets/icons/stopwatch.png" alt="Phân bón tăng tốc" />' : ''}<div class="crop-icon-box"><img class="crop-image" src="${escapeHtml(item.icon)}" alt="" /><b class="crop-quantity">×${item.count}</b></div><div class="crop-card-content"><span class="crop-card-state">Đất trống</span><strong class="crop-card-title">Đất Fruit trống</strong></div><div class="crop-card-actions"><button type="button" data-ui-action="${heldSeed ? 'plant-fruit' : 'choose-fruit-seed'}" data-action-label="${plantLabel}"${heldSeed && !plantCount ? ' disabled' : ''}>${heldSeed ? plantLabel : 'Chọn hạt trước'}</button></div></article>`;
    return soilCard;
  }
  const actions = empty
    ? `<button type="button" data-ui-action="${heldSeed ? 'plant-fruit' : 'choose-fruit-seed'}">${heldSeed ? `Trồng x${Math.min(Number(item.count || 0), getSeedCount(heldSeed))}` : 'Chọn hạt'}</button>`
    : ready ? '<button type="button" data-ui-action="harvest-fruit">Thu hoạch</button>'
      : dead ? '<button type="button" data-ui-action="chop-fruit">Chặt</button>'
        : item.fertilised ? '' : fruitFertiliserIcons.map((icon, index) => `<button class="fertiliser-button" type="button" data-ui-action="fertilise" data-fertiliser-index="${index}" title="Bón phân ${index + 1}"><img src="${icon}" alt="Phân bón ${index + 1}" /><span>×${formatExactCount(fertiliserCounts.get(icon))}</span></button>`).join('');
  return `<article class="crop-card fruit-card is-${type} ${ready || empty || dead ? 'is-ready' : ''}" data-resource="fruit" data-crop-name="${escapeHtml(fruitName)}" data-fertiliser-type="${item.fertiliserType || 0}" data-time-group="${item.timeGroup ?? ''}" data-map-keys="${escapeHtml((item.mapKeys || []).join('||'))}" data-count="${item.count}">${item.fertilised ? `<img class="fertiliser-mark" src="${fertiliserIcon}" alt="Đã bón phân" />` : ''}${item.fertiliserType === 2 ? '<img class="stopwatch-mark" src="https://sunflower-land.com/game-assets/icons/stopwatch.png" alt="Phân bón tăng tốc" />' : ''}<div class="crop-icon-box"><img class="crop-image" src="${escapeHtml(item.icon || seedIcon)}" alt="" /><b class="crop-quantity">×${item.count}</b></div><div class="crop-card-content"><span class="crop-card-state">${state}</span><strong class="crop-card-title">${escapeHtml(fruitName || 'Fruit')}</strong><span class="crop-card-meta">${detail}</span></div>${actions ? `<div class="crop-card-actions">${actions}</div>` : ''}</article>`;
}

function fruitSeedCard(seed) {
  return `<article class="crop-card fruit-card fruit-seed-card is-empty overview-seed-card" data-resource="fruit" data-ui-action="choose-fruit-seed"><div class="crop-icon-box">${seed?.icon ? `<img class="crop-image" src="${escapeHtml(seed.icon)}" alt="" /><b class="crop-quantity">×${getSeedCount(seed)}</b>` : '<span class="empty-seed-placeholder">?</span>'}</div><div class="crop-card-content"><span class="crop-card-state">Hạt trồng</span><strong class="crop-card-title">Hạt trồng</strong><span class="crop-card-meta">${escapeHtml(seed?.name || 'Chưa chọn hạt')}</span></div><span class="seed-card-select-overlay">Chọn hạt</span></article>`;
}

function renderFruitScan(fruit) {
  const heldSeed = selectedFruitSeed || lastScanData?.heldFruitSeed || null;
  const hasFruit = Boolean((fruit?.empty?.length || 0) + (fruit?.ready?.length || 0) + (fruit?.growing?.length || 0) + (fruit?.dead?.length || 0));
  renderOverview();
  activateMapActivityTab(mapActivityTabs.find((tab) => tab.classList.contains('is-active'))?.dataset.mapActivityTab || 'crop');
}

function applyPlantResult(result) {
  const normaliseSeedName = (value) => String(value || '').replace(/\s+seed$/i, '').trim().toLowerCase();
  const plantedSeedName = normaliseSeedName(result.seedName);
  setSeedCount(result.seedName, result.remainingSeeds);
  if (lastScanData?.heldSeed?.isSeed && normaliseSeedName(lastScanData.heldSeed.name) === plantedSeedName) lastScanData.heldSeed.count = Number(result.remainingSeeds) || 0;
  if (lastScanData) {
    const plantedKeys = new Set((result.growing || []).flatMap((item) => item.mapKeys || []));
    const plantedCounts = new Map((result.emptyCounts || []).map((item) => [Number(item.fertiliserType || 0), Number(item.count || 0)]));
    lastScanData.empty = (lastScanData.empty || []).flatMap((item) => {
      const itemKeys = item.mapKeys || [];
      if (itemKeys.length) {
        const remainingKeys = itemKeys.filter((key) => !plantedKeys.has(key));
        return remainingKeys.length ? [{ ...item, count: remainingKeys.length, mapKeys: remainingKeys }] : [];
      }
      // Dữ liệu quét cũ chưa có mapKeys: chỉ trừ đúng số ô đã trồng, không xoá cả card.
      const fertiliserType = Number(item.fertiliserType || 0);
      const planted = plantedCounts.get(fertiliserType) || 0;
      const remaining = Math.max(0, Number(item.count || 0) - planted);
      return remaining ? [{ ...item, count: remaining, mapKeys: [] }] : [];
    });
    if ((result.growing || []).length) lastScanData.growing = [...(lastScanData.growing || []), ...(result.growing || [])];
    return;
  }
  const emptySection = cropResults.querySelector('[data-activity="crop"] .crop-section');
  result.emptyCounts.forEach(({ fertiliserType, count }) => {
    const card = emptySection && Array.from(emptySection.querySelectorAll('.crop-card')).find((item) => item.querySelector('[data-ui-action="plant"]') && Number(item.dataset.fertiliserType) === fertiliserType);
    if (!card) return;
    const remaining = Math.max(0, Number(card.dataset.count) - count);
    if (!remaining) card.remove();
    else {
      card.dataset.count = String(remaining);
      card.querySelector('.crop-quantity').textContent = `×${remaining}`;
    }
  });
  if (emptySection && !emptySection.querySelector('[data-ui-action="plant"]') && !emptySection.querySelector('.crop-card')) emptySection.remove();
  if (!result.growing.length) return;
  let growingSection = cropGrowingResults.querySelector('[data-activity="crop"] .crop-section');
  if (!growingSection) {
    growingSection = document.createElement('div');
    growingSection.className = 'crop-section';
    growingSection.dataset.cropSection = 'growing';
    growingSection.innerHTML = '<div class="crop-grid"></div>';
    let cropPanel = cropGrowingResults.querySelector('[data-crop-panel="growing"]');
    if (!cropPanel) {
      cropGrowingResults.innerHTML = '<section class="crop-panel" data-crop-panel="growing"><h2>Đang hồi</h2></section>';
      cropPanel = cropGrowingResults.querySelector('[data-crop-panel="growing"]');
    }
    const group = document.createElement('div');
    group.className = 'activity-group';
    group.dataset.activity = 'crop';
    group.innerHTML = '<h3>Crop</h3>';
    group.append(growingSection);
    cropPanel.append(group);
  }
  const grid = growingSection.querySelector('.crop-grid');
  result.growing.forEach((item) => {
    grid.insertAdjacentHTML('beforeend', cropCard(item, 'growing'));
  });
  startCountdowns();
}

function clearScopedCountdownTargets(value) {
  if (!value || typeof value !== 'object') return;
  if (Array.isArray(value)) {
    value.forEach(clearScopedCountdownTargets);
    return;
  }
  if (Array.isArray(value.mapKeys) && value.mapKeys.length) {
    countdownTargets.delete(value.mapKeys.join('||'));
  }
  Object.values(value).forEach(clearScopedCountdownTargets);
}

function mergeProfessionScan(scope, result) {
  const professionData = {
    crop: { empty: result.empty, tornado: result.tornado, growing: result.growing, ready: result.ready },
    fruit: { fruit: result.fruit },
    tree: { trees: result.trees },
    mining: { mining: result.mining },
    salt: { salt: result.salt },
    mushroom: { mushrooms: result.mushrooms },
    pet: { pets: result.pets }
  }[scope];
  if (!professionData) return false;
  if (scope === 'pet') {
    const scannedAwake = result.pets?.awake || [];
    const previousByKey = new Map((lastScanData?.pets?.awake || []).flatMap((item) => (item.mapKeys || []).map((mapKey) => [mapKey, item])));
    const awake = scannedAwake.map((item) => {
      const previous = previousByKey.get((item.mapKeys || [])[0]);
      const checks = petSleepCheckInProgress ? Number(previous?.petCheckCount || 0) + 1 : Number(previous?.petCheckCount || 0);
      const delay = checks >= 3 ? 15 : 30;
      return { ...item, petCheckCount: checks, nextPetCheckAt: petSleepCheckInProgress ? Date.now() + delay * 60 * 1000 : previous?.nextPetCheckAt || Date.now() + 30 * 60 * 1000 };
    });
    professionData.pets.awake = awake;
  }
  clearScopedCountdownTargets(professionData);
  lastScanData = { ...(lastScanData || {}), ...professionData };
  renderOverview();
  startCountdowns();
  return true;
}

function scanMap(scope = 'all') {
  const task = scanMapQueue.then(() => scanMapNow(scope));
  scanMapQueue = task.catch(() => false);
  return task;
}

async function scanMapNow(scope = 'all') {
  scanMapButton.disabled = true;
  scanMapButton.classList.add('is-scanning');
  let scanned = false;
  try {
    const [{ result }] = await executeOnSunflowerTabs({
      func: () => {
        const cropPattern = /\/game-assets\/crops\/([^/]+)\/(seedling|halfway|almost|plant)\.png/i;
        const soilIcon = 'https://sunflower-land.com/game-assets/crops/soil2.png';
        const parseSeconds = (text) => {
          const normalised = String(text || '').replace(/\b(\d+)\s*hsr\b/gi, '$1hrs');
          const match = normalised.match(/\b(?=\d+\s*(?:d(?:ays?)?|h(?:r(?:s)?|ours?)?|m(?:in(?:s)?)?|s(?:ec(?:s)?)?))(?:(\d+)\s*d(?:ays?)?)?\s*(?:(\d+)\s*h(?:r(?:s)?|ours?)?)?\s*(?:(\d+)\s*m(?:in(?:s)?)?)?\s*(?:(\d+)\s*s(?:ec(?:s)?)?)?/i);
          if (!match || (!match[1] && !match[2] && !match[3] && !match[4])) return { seconds: null, hasSeconds: false };
          return {
            seconds: (Number(match[1] || 0) * 86400) + (Number(match[2] || 0) * 3600) + (Number(match[3] || 0) * 60) + Number(match[4] || 0),
            hasSeconds: Boolean(match[4])
          };
        };
        const readPlacementTime = (placement) => {
          const tooltipTime = Array.from(placement.querySelectorAll('div.transition-opacity span.font-secondary')).map((element) => element.textContent.trim()).find((text) => /^\d+\s*(?:day|d|hr|h|min|m|sec|s)/i.test(text));
          const timerText = Array.from(placement.querySelectorAll('span.text-white.text-center.font-pixel, span.font-pixel')).map((element) => element.textContent.trim()).find((text) => /^\d+\s*(?:d|h|m|s)/i.test(text));
          return parseSeconds(tooltipTime || timerText || placement.innerText || placement.textContent || '');
        };
        const groupingWindow = (seconds) => seconds < 60 ? 20 : seconds < 3600 ? 30 : 60;
        const titleCase = (value) => value.replace(/[_-]/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
        const growingEntries = [];
        const treeGrowingEntries = [];
        const fruitGrowingEntries = [];
        const miningGrowingEntries = [];
        const ready = new Map();
        const treeReady = new Map();
        const miningReady = new Map();
        const empty = new Map();
        const fruitEmpty = new Map();
        const fruitReady = new Map();
        const fruitDead = new Map();
        const composterReady = new Map();
        const composterEmpty = new Map();
        const composterGrowing = new Map();
        const saltReady = new Map();
        const saltGrowing = new Map();
        const saltUpgrade = new Map();
        const mushrooms = {
          wild: { count: 0, mapKeys: [] },
          magic: { count: 0, mapKeys: [] }
        };
        const sleepingPets = new Map();
        const awakePets = new Map();
        const knownActivePetNames = new Set(['butters', 'flicker']);
        let bettyLand = '';
        let tornadoCount = 0;
        let tornadoIcon = '';
        document.querySelectorAll('div[data-map-placement="true"]').forEach((placement) => {
          const images = Array.from(placement.querySelectorAll('img'));
          const sources = images.map((image) => image.currentSrc || image.src || '');
          const bettySource = sources.find((source) => /\/game-assets\/(?:[^/]+\/)*buildings\/(?:[^/]+\/)*(?:bettys_)?market\.(?:webp|png)(?:[?#]|$)/i.test(source));
          if (bettySource) bettyLand ||= bettySource.match(/\/game-assets\/([^/]+)\/buildings\//i)?.[1] || '';
          const treeImage = images.find((image) => /\/game-assets\/resources\/tree\/[^/]+\/[^/]+_([^/]+)_tree\.webp/i.test(image.currentSrc || image.src || ''));
          const treeMatch = treeImage && (treeImage.currentSrc || treeImage.src || '').match(/\/game-assets\/resources\/tree\/([^/]+)\/([^/_]+)_([^/_]+)_tree\.webp/i);
          const miningImage = images.find((image) => /\/game-assets\/resources\/(stone|iron|gold)_small\.png/i.test(image.currentSrc || image.src || ''));
          const miningMatch = miningImage && (miningImage.currentSrc || miningImage.src || '').match(/\/game-assets\/resources\/(stone|iron|gold)_small\.png/i);
          const cropImage = images.find((image) => cropPattern.test(image.currentSrc || image.src || ''));
          const cropMatch = cropImage && (cropImage.currentSrc || cropImage.src).match(cropPattern);
          const sleepingIcon = images.find((image) => image.alt?.trim().toLowerCase() === 'sleeping' && /\/game-assets\/icons\/sleeping\.webp/i.test(image.currentSrc || image.src || ''));
          if (sleepingIcon) {
            const petImage = images.find((image) => image !== sleepingIcon && image.alt?.trim() && image.alt.trim().toLowerCase() !== 'sleeping') || images.find((image) => image !== sleepingIcon && image.classList.contains('cursor-pointer'));
            const label = petImage?.alt?.trim() || 'Pet';
            const icon = petImage?.currentSrc || petImage?.src || sleepingIcon.currentSrc || sleepingIcon.src;
            const key = `${label}|${icon}`;
            const current = sleepingPets.get(key) || { label, icon, count: 0, mapKeys: [] };
            current.count += 1;
            current.mapKeys.push(`${placement.style.top}|${placement.style.left}`);
            sleepingPets.set(key, current);
            return;
          }
          // Active pets use an inlined sprite, an alt name, and the clickable
          // highlight classes shown on the map. Their asset has no stable URL.
          const activePet = images.find((image) => {
            const source = image.currentSrc || image.src || '';
            return source.startsWith('data:image/') && knownActivePetNames.has(image.alt?.trim().toLowerCase()) && image.classList.contains('cursor-pointer') && image.classList.contains('hover:img-highlight');
          });
          if (activePet) {
            const label = activePet.alt.trim();
            const icon = activePet.currentSrc || activePet.src;
            const key = `${label}|${icon}`;
            const current = awakePets.get(key) || { label, icon, count: 0, mapKeys: [] };
            current.count += 1;
            current.mapKeys.push(`${placement.style.top}|${placement.style.left}`);
            awakePets.set(key, current);
            return;
          }
          const saltStates = [
            ['data:image/webp;base64,UklGRpQAAABXRUJQVlA4TIgAAAAvEQAEED9AJADhlqNuqZruhBtE', 1],
            ['data:image/webp;base64,UklGRqgAAABXRUJQVlA4TJsAAAAvEQAEEEdgJgAZtaQVyevzK7Bz', 2],
            ['data:image/webp;base64,UklGRrwAAABXRUJQVlA4TK8AAAAvEQAEEE9gtAES3uJlnqHS6HZn', 3]
          ];
          const saltGrowingPrefix = 'data:image/webp;base64,UklGRnwAAABXRUJQVlA4THAAAAAvEQAEEDdAJmCxWkqpKoJfCTXIBCzWRP8MfjHE8CLUwLj+HdRSwSTwNP8B+N8yRdrZIi4wim2rDVVAX0MsUAxgIFVA9+/h/7+KgYj+TwA7cDbXAoee7w92PW8HbHohwm9qgSOcHx7PA4/W4HmiEyEA';
          const saltUpgradePrefix = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9';
          const saltUpgradeImage = images.find((image) => (image.currentSrc || image.src || '').startsWith(saltUpgradePrefix));
          if (saltUpgradeImage) {
            const saltBaseImage = images.find((image) => (image.currentSrc || image.src || '').startsWith(saltGrowingPrefix));
            const source = saltBaseImage?.currentSrc || saltBaseImage?.src || saltUpgradeImage.currentSrc || saltUpgradeImage.src;
            const current = saltUpgrade.get('upgrade') || { icon: source, count: 0, mapKeys: [] };
            current.count += 1;
            current.mapKeys.push(`${placement.style.top}|${placement.style.left}`);
            saltUpgrade.set('upgrade', current);
            return;
          }
          const saltImage = images.find((image) => saltStates.some(([prefix]) => (image.currentSrc || image.src || '').startsWith(prefix)));
          if (saltImage) {
            const source = saltImage.currentSrc || saltImage.src;
            const hits = saltStates.find(([prefix]) => source.startsWith(prefix))?.[1] || 1;
            const current = saltReady.get(hits) || { hits, icon: source, count: 0, mapKeys: [] };
            current.count += 1;
            current.mapKeys.push(`${placement.style.top}|${placement.style.left}`);
            saltReady.set(hits, current);
            return;
          }
          const saltGrowingImage = images.find((image) => (image.currentSrc || image.src || '').startsWith(saltGrowingPrefix));
          if (saltGrowingImage) {
            const time = readPlacementTime(placement);
            const key = time.seconds ?? 'unknown';
            const current = saltGrowing.get(key) || { icon: saltGrowingImage.currentSrc || saltGrowingImage.src, count: 0, seconds: time.seconds, mapKeys: [] };
            current.count += 1;
            current.mapKeys.push(`${placement.style.top}|${placement.style.left}`);
            saltGrowing.set(key, current);
            return;
          }
          const composterImage = images.find((image) => /composter/i.test(image.alt || '') || /\/game-assets\/composters\/[^/]+\.(?:webp|png)(?:[?#]|$)/i.test(image.currentSrc || image.src || ''));
          const composterSource = composterImage && (composterImage.currentSrc || composterImage.src || '');
          if (composterImage) {
            const mapKey = `${placement.style.top}|${placement.style.left}`;
            const composterName = (composterSource.match(/\/composters\/([^/.]+)\.webp/i)?.[1] || 'Composter').replace(/_(?:ready|closed)$/i, '');
            const label = composterImage.alt?.trim() || titleCase(composterName);
            const state = /_ready\.(?:webp|png)(?:[?#]|$)/i.test(composterSource) || Boolean(placement.querySelector('img.ready')) ? 'ready' : /_closed\.(?:webp|png)(?:[?#]|$)/i.test(composterSource) ? 'growing' : 'empty';
            const group = state === 'ready' ? composterReady : state === 'empty' ? composterEmpty : composterGrowing;
            const key = `${label}|${state}`;
            const time = readPlacementTime(placement);
            const current = group.get(key) || { label, icon: composterSource, count: 0, seconds: state === 'growing' ? time.seconds : null, mapKeys: [] };
            current.count += 1;
            current.mapKeys.push(mapKey);
            group.set(key, current);
            return;
          }
          const mushroomSource = Array.from(placement.querySelectorAll('.mushroom [style*="background-image"]')).map((element) => element.style.backgroundImage || '').find((source) => /\/(wild|magic)_mushroom_sheet\.png/i.test(source));
          const mushroomMatch = mushroomSource && mushroomSource.match(/\/(wild|magic)_mushroom_sheet\.png/i);
          if (mushroomMatch) {
            const mushroom = mushrooms[mushroomMatch[1].toLowerCase()];
            mushroom.count += 1;
            mushroom.mapKeys.push(`${placement.style.top}|${placement.style.left}`);
            return;
          }
          const fruitPatch = sources.some((source) => /\/game-assets\/(?:[^/]+\/)?fruit\/fruit_patch\.(?:webp|png)(?:[?#]|$)/i.test(source));
          const firstLayer = placement.firstElementChild;
          const secondLayer = firstLayer?.firstElementChild;
          const thirdLayer = secondLayer?.firstElementChild;
          const isCropSoilLayout = Boolean(
            firstLayer?.classList.contains('w-full') && firstLayer.classList.contains('h-full') && firstLayer.classList.contains('relative') &&
            secondLayer?.classList.contains('w-full') && secondLayer.classList.contains('h-full') && secondLayer.classList.contains('relative') &&
            thirdLayer?.classList.contains('w-full') && thirdLayer.classList.contains('h-full') && thirdLayer.classList.contains('relative') &&
            thirdLayer.classList.contains('cursor-pointer') && thirdLayer.classList.contains('hover:img-highlight') &&
            thirdLayer.querySelector('img[src*="/game-assets/crops/soil2.png"]')
          );
          if (fruitPatch) {
            const mapKey = `${placement.style.top}|${placement.style.left}`;
            const fertiliserType = sources.some((source) => source.startsWith('data:image/webp;base64,UklGRpAAAABXRUJQVlA4TIMAAAAvD0AC')) ? 2
              : sources.some((source) => source.startsWith('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAICAYAAADA+m62')) ? 1
                : sources.some((source) => source.includes('/icons/stopwatch.png')) ? 2
                  : images.some((image) => (image.currentSrc || image.src || '').startsWith('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAN')) ? 1 : 0;
            const fertilised = fertiliserType > 0;
            const fruitTooltipNode = Array.from(placement.querySelectorAll('div.transition-opacity')).find((element) => element.querySelector('span.whitespace-nowrap') && element.querySelector('span.font-secondary'));
            const fruitTitle = fruitTooltipNode?.querySelector('span.whitespace-nowrap')?.textContent.trim() || Array.from(placement.querySelectorAll('span')).map((element) => element.textContent.trim()).find((text) => /\b.+\s+(?:Tree\s+)?(?:Growing|Ready|Replenishing)\b/i.test(text)) || '';
            const fruitName = fruitTitle.match(/^(.+?)\s+(?:Tree\s+)?(?:Growing|Ready|Replenishing)$/i)?.[1] || '';
            // Ready fruit sprites can be inlined by the game, without a tooltip or an asset URL.
            // The banana sprite is 31×35px and starts with this stable PNG header.
            const bananaSprite = images.find((image) => (image.currentSrc || image.src || '').startsWith('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB8AAAAjCAYAAABsFtHv'));
            const readyFruitSprite = bananaSprite || images.find((image) => {
              const source = image.currentSrc || image.src || '';
              return source.startsWith('data:image/') && Boolean(image.style.bottom) && !source.startsWith('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAN');
            });
            const shrubImage = images.find((image) => /\/game-assets\/fruit\/bush_shrub\.png(?:[?#]|$)/i.test(image.currentSrc || image.src || ''));
            const harvestedBushImage = images.find((image) => /\/game-assets\/fruit\/harvested_bush\.png(?:[?#]|$)/i.test(image.currentSrc || image.src || ''));
            const fruitLabel = fruitName || (bananaSprite ? 'Banana' : shrubImage ? 'Bush Shrub' : 'Fruit');
            const deadImage = images.find((image) => /\/game-assets\/fruit\/(?:dead_tree|dead_bush|withered_bush|bush_shrub)\.(?:webp|png)(?:[?#]|$)/i.test(image.currentSrc || image.src || ''));
            const soilImage = images.find((image) => /\/game-assets\/crops\/soil2\.png/i.test(image.currentSrc || image.src || ''));
            const time = fruitTooltipNode ? parseSeconds(fruitTooltipNode.querySelector('span.font-secondary')?.textContent || '') : readPlacementTime(placement);
            const fruitIsReady = /\bReady\b/i.test(fruitTitle) && !Number.isFinite(time.seconds);
            if (deadImage) {
              const key = String(fertiliserType);
              const current = fruitDead.get(key) || { label: 'Gốc Fruit chết', icon: deadImage.currentSrc || deadImage.src, count: 0, fertilised, fertiliserType, mapKeys: [] };
              current.count += 1;
              current.mapKeys.push(mapKey);
              fruitDead.set(key, current);
            } else if (soilImage && !cropImage) {
              const key = String(fertiliserType);
              const current = fruitEmpty.get(key) || { label: 'Đất Fruit trống', icon: soilIcon, count: 0, fertilised, fertiliserType, mapKeys: [] };
              current.count += 1;
              current.mapKeys.push(mapKey);
              fruitEmpty.set(key, current);
            } else if (!fruitIsReady && (harvestedBushImage || cropImage || /\b(?:Growing|Replenishing)\b/i.test(fruitTitle) || Number.isFinite(time.seconds))) {
              const isFruitVisual = (image) => {
                const source = image.currentSrc || image.src || '';
                return Boolean(source) && !/fruit_patch|soil2|empty_bar|stopwatch|dead_(?:tree|bush)|withered_bush|selectbox|progress/i.test(source) && !/\/game-assets\/ui\//i.test(source);
              };
              const fruitTooltip = Array.from(placement.querySelectorAll('div')).find((element) => element.innerText.includes(fruitTitle) && Array.from(element.querySelectorAll('img')).some(isFruitVisual));
              const fruitImage = harvestedBushImage || Array.from(fruitTooltip?.querySelectorAll('img') || []).find(isFruitVisual) || images.find((image) => image.style.bottom && isFruitVisual(image)) || images.find(isFruitVisual);
              fruitGrowingEntries.push({ label: fruitLabel, icon: fruitImage?.currentSrc || fruitImage?.src || cropImage?.currentSrc || cropImage?.src || soilIcon, count: 1, fertilised, fertiliserType, seconds: time.seconds, timeGroup: time.seconds ?? 'unknown', hasPreciseSeconds: time.hasSeconds, mapKeys: [mapKey] });
            } else {
              const icon = readyFruitSprite || images.find((image) => !/fruit_patch|soil2|stopwatch|dead_(?:tree|bush)|withered_bush/i.test(image.currentSrc || image.src || '') && !(image.currentSrc || image.src || '').startsWith('data:'));
              const key = `${fruitLabel}|${fertiliserType}`;
              const current = fruitReady.get(key) || { label: fruitLabel, icon: icon?.currentSrc || icon?.src || 'https://sunflower-land.com/game-assets/fruit/fruit_tree.webp', count: 0, fertilised, fertiliserType, mapKeys: [] };
              current.count += 1;
              current.mapKeys.push(mapKey);
              fruitReady.set(key, current);
            }
            return;
          }
          if (treeMatch) {
            const key = `${treeMatch[1]}|${treeMatch[2]}|${treeMatch[3]}`;
            const current = treeReady.get(key) || { icon: treeImage.currentSrc || treeImage.src, count: 0, mapKeys: [] };
            current.count += 1;
            current.mapKeys.push(`${placement.style.top}|${placement.style.left}`);
            treeReady.set(key, current);
            return;
          }
          if (miningMatch) {
            const resource = miningMatch[1].toLowerCase();
            const mapKey = `${placement.style.top}|${placement.style.left}`;
            const hasMiningTimer = /\b\d+\s*(?:h|hr|hrs|hour|hours|m|min|mins|s|sec|secs)\b/i.test(placement.innerText || '');
            const isGrowingMining = Boolean(/(?:^|\s)opacity-50(?:\s|$)/.test(placement.innerHTML) || miningImage.closest('.opacity-50') || placement.querySelector('.opacity-50 img[src*="_small.png"]') || hasMiningTimer);
            if (!isGrowingMining) {
              const current = miningReady.get(resource) || { resource, label: `${titleCase(resource)} Rock`, icon: miningImage.currentSrc || miningImage.src, count: 0, mapKeys: [] };
              current.count += 1;
              current.mapKeys.push(mapKey);
              miningReady.set(resource, current);
              return;
            }
            const time = readPlacementTime(placement);
            miningGrowingEntries.push({ resource, label: `${titleCase(resource)} Rock`, icon: miningImage.currentSrc || miningImage.src, count: 1, seconds: time.seconds, mapKeys: [mapKey] });
            return;
          }
          if (!cropMatch) {
            const isGrowingTree = sources.some((source) => source.includes('/game-assets/resources/stump.png')) || sources.some((source) => source.includes('/game-assets/resources/tree.png'));
            if (isGrowingTree) {
              const stumpImage = images.find((image) => image.classList.contains('opacity-50')) || images.find((image) => (image.currentSrc || image.src || '').includes('/game-assets/resources/stump.png'));
              const time = readPlacementTime(placement);
              if (time.seconds !== null) {
                treeGrowingEntries.push({ icon: stumpImage?.currentSrc || stumpImage?.src || 'https://sunflower-land.com/game-assets/resources/stump.png', count: 1, seconds: time.seconds, mapKeys: [`${placement.style.top}|${placement.style.left}`] });
                return;
              }
              const readyTreeImage = images.find((image) => (image.currentSrc || image.src || '').includes('/game-assets/resources/tree.png'));
              if (readyTreeImage) {
                const source = readyTreeImage.currentSrc || readyTreeImage.src;
                const key = `generic|${source}`;
                const current = treeReady.get(key) || { icon: source, count: 0, mapKeys: [] };
                current.count += 1;
                current.mapKeys.push(`${placement.style.top}|${placement.style.left}`);
                treeReady.set(key, current);
              }
              return;
            }
            const tornadoImage = images.find((image) => image.alt === 'tornado');
            if (tornadoImage && sources.some((source) => source.includes('/game-assets/crops/soil_dry.png'))) {
              tornadoCount += 1;
              tornadoIcon ||= tornadoImage.currentSrc || tornadoImage.src;
              return;
            }
            if (isCropSoilLayout) {
              const fertiliserType = sources.some((source) => source.includes('/icons/stopwatch.png')) ? 2 : images.some((image) => (image.currentSrc || image.src || '').startsWith('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAN')) ? 1 : 0;
              const fertilised = fertiliserType > 0;
              const key = String(fertiliserType);
              const current = empty.get(key) || { count: 0, icon: soilIcon, fertilised, fertiliserType, mapKeys: [] };
              current.count += 1;
              current.mapKeys.push(`${placement.style.top}|${placement.style.left}`);
              empty.set(key, current);
            }
            return;
          }
          const [, name, stage] = cropMatch;
          const fertiliserType = sources.some((source) => source.includes('/icons/stopwatch.png')) ? 2 : images.some((image) => (image.currentSrc || image.src || '').startsWith('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAN')) ? 1 : 0;
          const fertilised = fertiliserType > 0;
          const bee = sources.some((source) => source.startsWith('data:image/webp;base64,UklGRl4AAABXRUJQVlA4TFIAAAAvCcABEC9AEECSRGhz'));
          const record = { label: titleCase(name), icon: cropImage.currentSrc || cropImage.src, count: 1, fertilised, fertiliserType, bee };
          if (stage === 'plant') {
            const key = `${name}|${fertiliserType}|${bee}`;
            const current = ready.get(key) || { ...record, mapKeys: [] };
            current.count += ready.has(key) ? 1 : 0;
            current.mapKeys.push(`${placement.style.top}|${placement.style.left}`);
            ready.set(key, current);
            return;
          }
          const time = readPlacementTime(placement);
          growingEntries.push({ ...record, stage, seconds: time.seconds, timeGroup: time.seconds ?? 'unknown', hasPreciseSeconds: time.hasSeconds, mapKeys: [`${placement.style.top}|${placement.style.left}`] });
        });
        const groupedGrowing = [];
        const growingByCrop = new Map();
        growingEntries.forEach((entry) => {
          const key = `${entry.label}|${entry.stage}|${entry.fertiliserType}|${entry.bee}`;
          const list = growingByCrop.get(key) || [];
          list.push(entry);
          growingByCrop.set(key, list);
        });
        growingByCrop.forEach((entries) => {
          const timedEntries = entries.filter((entry) => Number.isFinite(entry.seconds)).sort((left, right) => right.seconds - left.seconds);
          const groups = [];
          timedEntries.forEach((entry) => {
            const group = groups.find((candidate) => candidate.seconds - entry.seconds <= groupingWindow(Math.max(candidate.seconds, entry.seconds)));
            if (group) {
              group.count += entry.count;
              group.mapKeys.push(...entry.mapKeys);
            } else {
              groups.push({ ...entry, count: entry.count, mapKeys: [...entry.mapKeys] });
            }
          });
        groupedGrowing.push(...groups);
          entries.filter((entry) => !Number.isFinite(entry.seconds)).forEach((entry) => groupedGrowing.push(entry));
        });
        const groupedTrees = [];
        treeGrowingEntries.sort((left, right) => right.seconds - left.seconds).forEach((entry) => {
          const group = groupedTrees.find((candidate) => candidate.seconds - entry.seconds <= 5);
          if (group) {
            group.count += entry.count;
            group.mapKeys.push(...(entry.mapKeys || []));
          }
          else groupedTrees.push({ ...entry });
        });
        const groupedMining = [];
        miningGrowingEntries.sort((left, right) => (right.seconds || 0) - (left.seconds || 0)).forEach((entry) => {
          const group = groupedMining.find((candidate) => candidate.resource === entry.resource && Number.isFinite(candidate.seconds) && Number.isFinite(entry.seconds) && candidate.seconds - entry.seconds <= 5);
          if (group) {
            group.count += 1;
            group.mapKeys.push(...entry.mapKeys);
          } else groupedMining.push({ ...entry, mapKeys: [...entry.mapKeys] });
        });
        const groupedFruitGrowing = [];
        fruitGrowingEntries.sort((left, right) => (right.seconds || 0) - (left.seconds || 0)).forEach((entry) => {
          const group = groupedFruitGrowing.find((candidate) => candidate.label === entry.label && candidate.fertiliserType === entry.fertiliserType && ((Number.isFinite(candidate.seconds) && Number.isFinite(entry.seconds) && Math.abs(candidate.seconds - entry.seconds) <= groupingWindow(Math.max(candidate.seconds, entry.seconds))) || (!Number.isFinite(candidate.seconds) && !Number.isFinite(entry.seconds))));
          if (group) {
            group.count += entry.count;
            group.mapKeys.push(...entry.mapKeys);
          } else groupedFruitGrowing.push({ ...entry, mapKeys: [...entry.mapKeys] });
        });
        const fruitNames = ['apple', 'banana', 'blueberry', 'lemon', 'orange', 'grape'];
        const reactFruitName = (element) => {
          const visited = new Set();
          const read = (value, depth = 0) => {
            if (depth > 3 || value == null || visited.has(value)) return '';
            if (typeof value === 'string') return fruitNames.find((name) => new RegExp(`\\b${name}(?:\\s+seed)?\\b`, 'i').test(value)) || '';
            if (typeof value !== 'object') return '';
            visited.add(value);
            for (const [key, nested] of Object.entries(value)) {
              if (!/name|item|seed|fruit|children|props/i.test(key)) continue;
              const found = read(nested, depth + 1);
              if (found) return found;
            }
            return '';
          };
          for (let node = element; node; node = node.parentElement) {
            const props = Object.getOwnPropertyNames(node).filter((key) => key.startsWith('__reactProps$') || key.startsWith('__reactFiber$'));
            for (const key of props) {
              const found = read(node[key]);
              if (found) return found;
            }
          }
          return '';
        };
        const quickSelectColumn = Array.from(document.querySelectorAll('div.flex.flex-col.items-center')).find((column) => {
          const slots = Array.from(column.children).filter((child) => child.classList.contains('relative') && child.querySelector('.bg-brown-600 img[alt="item"]'));
          return slots.length >= 3;
        });
        const firstQuickSlot = quickSelectColumn && Array.from(quickSelectColumn.children).find((child) => child.classList.contains('relative') && child.querySelector('.bg-brown-600 img[alt="item"]'));
        const selectedQuickSlot = quickSelectColumn && Array.from(quickSelectColumn.children).find((child) => child.classList.contains('relative') && child.querySelector('img[src*="/game-assets/ui/select/selectbox_"]'));
        const activeQuickSlot = selectedQuickSlot || firstQuickSlot;
        const seedImage = activeQuickSlot?.querySelector('.bg-brown-600 img[alt="item"]') || null;
        const seedSource = seedImage?.currentSrc || seedImage?.src || '';
        const cropSeedMatch = seedSource.match(/\/game-assets\/crops\/([^/]+)\/seed\.png/i);
        const fruitSeedMatch = seedSource.match(/\/game-assets\/fruit\/([^/]+?)(?:_seed|\/seed)\.png/i);
        const knownFruitIcon = seedSource.startsWith('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA0AAAAOCAYAAAD0f5bS') ? 'banana' : '';
        const selectedFruitName = fruitSeedMatch?.[1] || reactFruitName(activeQuickSlot || seedImage) || knownFruitIcon;
        const itemNameMatch = seedSource.match(/\/([^/.]+)\.(?:png|webp)$/i);
        return {
          empty: Array.from(empty.values()),
          tornado: { count: tornadoCount, icon: 'https://sunflower-land.com/game-assets/crops/soil_dry.png', tornadoIcon },
          growing: groupedGrowing,
          ready: Array.from(ready.values()),
          trees: { ready: Array.from(treeReady.values()), growing: groupedTrees },
          mining: { ready: Array.from(miningReady.values()), growing: groupedMining },
          salt: { ready: Array.from(saltReady.values()), growing: Array.from(saltGrowing.values()), upgrade: Array.from(saltUpgrade.values()) },
          composters: { ready: Array.from(composterReady.values()), empty: Array.from(composterEmpty.values()), growing: Array.from(composterGrowing.values()) },
          mushrooms,
          pets: { sleeping: Array.from(sleepingPets.values()), awake: Array.from(awakePets.values()) },
          fruit: { empty: Array.from(fruitEmpty.values()), ready: Array.from(fruitReady.values()), growing: groupedFruitGrowing, dead: Array.from(fruitDead.values()) },
          bettyLand,
          heldQuickItem: seedImage ? { name: cropSeedMatch ? titleCase(cropSeedMatch[1]) : itemNameMatch ? titleCase(itemNameMatch[1]) : 'Vật phẩm đã chọn', icon: seedSource, count: Number((activeQuickSlot.textContent.match(/\d[\d,.]*/)?.[0] || '0').replace(/[^\d]/g, '')) } : null,
          heldSeed: seedImage ? { name: cropSeedMatch ? titleCase(cropSeedMatch[1]) : itemNameMatch ? titleCase(itemNameMatch[1]) : 'Vật phẩm đã chọn', icon: seedSource, isSeed: /\/seed\.png(?:$|[?#])/i.test(seedSource), count: Number((activeQuickSlot.textContent.match(/\d[\d,.]*/)?.[0] || '0').replace(/[^\d]/g, '')) } : null,
          heldFruitSeed: selectedFruitName ? { name: titleCase(selectedFruitName), icon: seedSource, count: Number((activeQuickSlot.textContent.match(/\d[\d,.]*/)?.[0] || '0').replace(/[^\d]/g, '')) } : null
        };
      }
    });
    const fullScan = scope === 'all' || !lastScanData;
    if (fullScan) {
      const previousByKey = new Map((lastScanData?.pets?.awake || []).flatMap((item) => (item.mapKeys || []).map((mapKey) => [mapKey, item])));
      result.pets.awake = (result.pets?.awake || []).map((item) => {
        const previous = previousByKey.get((item.mapKeys || [])[0]);
        return { ...item, seconds: previous?.seconds || 2 * 60 * 60, countdownTarget: previous?.countdownTarget || Date.now() + 2 * 60 * 60 * 1000 };
      });
    }
    if (fullScan || scope === 'crop' || scope === 'fruit') {
      if (result.heldSeed?.isSeed) setSeedCount(result.heldSeed, result.heldSeed.count, { icon: result.heldSeed.icon });
      if (result.heldFruitSeed) setSeedCount(result.heldFruitSeed.name, result.heldFruitSeed.count, { icon: result.heldFruitSeed.icon, category: 'Hạt Fruit' });
      if (fruitSeedPicking && result.heldQuickItem?.icon) {
        selectedFruitSeed = { ...result.heldQuickItem };
        setSeedCount(selectedFruitSeed.name, selectedFruitSeed.count, { icon: selectedFruitSeed.icon, category: 'Hạt Fruit' });
        fruitSeedPicking = false;
        log(`Đã chọn ${selectedFruitSeed.name} làm hạt Fruit.`);
      } else if (selectedFruitSeed?.icon && result.heldQuickItem?.icon === selectedFruitSeed.icon) {
        setSeedCount(selectedFruitSeed.name, result.heldQuickItem.count, { icon: selectedFruitSeed.icon, category: 'Hạt Fruit' });
      }
    }
    if (fullScan) {
      renderCropScan(result);
      renderTreeScan(result.trees);
      renderMiningScan(result.mining);
      renderFruitScan(result.fruit);
      await refreshConnection();
    } else if (!mergeProfessionScan(scope, result)) {
      throw new Error('Không xác định được nghề cần quét.');
    }
    scanned = true;
  } catch (error) {
    logActionError(`Quét ${scope === 'all' ? 'Map' : scope}: ${error.message || 'lỗi không xác định'}`);
    if (scope === 'all' || !lastScanData) {
      cropResults.innerHTML = `<div class="empty-state">${escapeHtml(error.message || 'Không thể quét map.')}</div>`;
      blockedResults.innerHTML = '';
      treeResults.innerHTML = '';
      miningResults.innerHTML = '';
      cropGrowingResults.innerHTML = '';
      treeGrowingResults.innerHTML = '';
      miningGrowingResults.innerHTML = '';
    }
  } finally {
    scanMapButton.disabled = false;
    scanMapButton.classList.remove('is-scanning');
  }
  return scanned;
}

scanMapButton.addEventListener('click', async () => {
  const finishLog = startActionLog('Đang quét Map…');
  try {
    if (!await scanMap()) logActionError('Không thể quét Map.');
  } catch (error) {
    logActionError(error.message || 'Không thể quét Map.');
  } finally {
    finishLog();
  }
});

async function chopTrees(card) {
  const mapKeys = card.dataset.mapKeys ? card.dataset.mapKeys.split('||').filter(Boolean) : [];
  if (!mapKeys.length) throw new Error('Không xác định được cây cần chặt. Hãy quét Map lại.');
  const knownAxes = toolCounts.get(axeIcon);
  if (knownAxes === 0) throw new Error('Không còn Axe.');
  const tab = await findSunflowerTab();
  if (!tab?.id) throw new Error('Không tìm thấy tab Sunflower Land đang mở.');
  const [{ result }] = await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: async (keys, axeLimit, axeSource) => {
      const sleep = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));
      const isReadyTree = (placement) => Array.from(placement.querySelectorAll('img')).some((image) => /\/game-assets\/resources\/tree\/[^/]+\/[^/]+_([^/]+)_(?:tree|trees_shake_sheet)\.webp/i.test(image.currentSrc || image.src || '')) || Array.from(placement.querySelectorAll('[style*="background-image"]')).some((element) => /\/game-assets\/resources\/tree\/[^/]+\/[^/]+_([^/]+)_trees_shake_sheet\.webp/i.test(element.style.backgroundImage || ''));
      const quickColumn = Array.from(document.querySelectorAll('div.flex.flex-col.items-center')).find((column) => Array.from(column.children).filter((child) => child.classList.contains('relative') && child.querySelector('.bg-brown-600 img[alt="item"]')).length >= 3);
      const axeSlot = quickColumn && Array.from(quickColumn.children).find((slot) => {
        const image = slot.querySelector('.bg-brown-600 img[alt="item"]');
        return (image?.currentSrc || image?.src || '') === axeSource;
      });
      axeSlot?.querySelector('.bg-brown-600')?.click();
      if (axeSlot) await sleep(180);
      let axeUsed = 0;
      let processed = 0;
      let felled = 0;
      const felledKeys = [];
      let hitsPerTree;
      for (const key of keys) {
        if (axeLimit !== null && felled >= axeLimit) break;
        const placement = Array.from(document.querySelectorAll('div[data-map-placement="true"]')).find((item) => `${item.style.top}|${item.style.left}` === key);
        if (!placement || !isReadyTree(placement)) continue;
        const clickTree = () => (placement.querySelector('.cursor-pointer') || placement.firstElementChild || placement).click();
        clickTree();
        axeUsed += 1;
        let hits = 1;
        await sleep(120);
        if (hitsPerTree === undefined) hitsPerTree = isReadyTree(placement) ? 3 : 1;
        while (isReadyTree(placement) && hits < hitsPerTree) {
          clickTree();
          axeUsed += 1;
          hits += 1;
          await sleep(120);
        }
        if (!isReadyTree(placement)) {
          felled += 1;
          felledKeys.push(key);
        }
        processed += 1;
        await sleep(60);
      }
      return { processed, felled, felledKeys, axeUsed, hitsPerTree: hitsPerTree || 1 };
    },
    args: [mapKeys, Number.isFinite(knownAxes) ? knownAxes : null, axeIcon]
  });
  if (Number.isFinite(knownAxes)) updateToolCount(axeIcon, knownAxes - result.felled);
  return result;
}

async function readTreeStates(mapKeys = []) {
  if (!mapKeys.length) return [];
  const [{ result }] = await executeOnSunflowerTabs({
    func: async (keys) => {
      const sleep = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));
      const parseSeconds = (text) => Array.from(String(text || '').matchAll(/(\d+)\s*(days?|d|hrs?|h|mins?|m|secs?|s)\b/gi)).reduce((total, match) => total + Number(match[1]) * (/^d/.test(match[2]) ? 86400 : /^h/.test(match[2]) ? 3600 : /^m/.test(match[2]) ? 60 : 1), 0) || null;
      const readGrowingState = (mapKey) => {
        const placement = Array.from(document.querySelectorAll('div[data-map-placement="true"]')).find((item) => `${item.style.top}|${item.style.left}` === mapKey);
        const images = Array.from(placement?.querySelectorAll('img') || []);
        const source = (image) => image.currentSrc || image.src || '';
        const stump = images.find((image) => /\/game-assets\/resources\/(?:stump|tree)\.png/i.test(source(image)) || image.classList.contains('opacity-50'));
        const timer = Array.from(placement?.querySelectorAll('div.transition-opacity span.font-secondary, span.text-white.text-center.font-pixel, span.font-pixel') || []).map((node) => node.textContent.trim()).find((text) => /\d+\s*(?:d|day|h|hr|m|min|s|sec)/i.test(text));
        const seconds = parseSeconds(timer || placement?.innerText || '');
        // A ready-tree sprite can persist for a few frames after the final hit.
        // Only commit a state once the DOM itself shows the replenishing tree.
        if (!stump && !Number.isFinite(seconds)) return null;
        return { mapKey, state: 'growing', icon: source(stump || images[0] || {}), seconds };
      };
      for (let attempt = 0; attempt < 10; attempt += 1) {
        const states = keys.map(readGrowingState).filter(Boolean);
        if (states.length === keys.length) return states;
        await sleep(120);
      }
      // Keep cards not yet rendered by the game unchanged. The subsequent map
      // refresh will read them again instead of deleting them from local state.
      return keys.map(readGrowingState).filter(Boolean);
    },
    args: [mapKeys]
  });
  return Array.isArray(result) ? result : [];
}

function applyTreeStates(states = []) {
  if (!lastScanData?.trees || !states.length) return;
  states = states.filter((state) => state?.mapKey && state.state === 'growing');
  if (!states.length) return;
  const changed = new Set(states.map((state) => state.mapKey));
  const originalByKey = new Map();
  ['ready', 'growing'].forEach((state) => (lastScanData.trees[state] || []).forEach((item) => (item.mapKeys || []).forEach((mapKey) => originalByKey.set(mapKey, item))));
  ['ready', 'growing'].forEach((state) => {
    lastScanData.trees[state] = (lastScanData.trees[state] || []).flatMap((item) => {
      const mapKeys = (item.mapKeys || []).filter((mapKey) => !changed.has(mapKey));
      return mapKeys.length ? [{ ...item, count: mapKeys.length, mapKeys }] : [];
    });
  });
  states.forEach((state) => {
    const original = originalByKey.get(state.mapKey) || {};
    const target = lastScanData.trees[state.state] || (lastScanData.trees[state.state] = []);
    const group = target.find((item) => item.icon === (state.icon || original.icon) && Number(item.seconds) === Number(state.seconds));
    if (group) {
      group.count += 1;
      group.mapKeys.push(state.mapKey);
    } else target.push({ ...original, icon: state.icon || original.icon, count: 1, mapKeys: [state.mapKey], seconds: state.state === 'growing' ? state.seconds : null, countdownTarget: null });
  });
}

async function mineRocks(card) {
  const resource = card.dataset.miningResource;
  const toolIcon = pickaxeSource(resource);
  const mapKeys = card.dataset.mapKeys ? card.dataset.mapKeys.split('||').filter(Boolean) : [];
  if (!resource || !mapKeys.length) throw new Error('Không xác định được mỏ cần khai thác. Hãy quét Map lại.');
  if (!toolIcon) throw new Error(toolBagScanned ? `Không còn ${pickaxeTools[resource]?.name || 'Pickaxe'}.` : 'Hãy quét túi đồ để kiểm tra Pickaxe trước.');
  const knownTools = toolCounts.get(toolIcon);
  if (knownTools === 0) throw new Error(`Không còn ${resource === 'stone' ? 'Pickaxe' : resource === 'iron' ? 'Stone Pickaxe' : 'Iron Pickaxe'}.`);
  const [{ result }] = await executeOnSunflowerTabs({
    func: async (keys, resourceName, toolLimit, toolSource) => {
      const sleep = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));
      const isReadyRock = (placement) => {
        const readyRockPattern = new RegExp(`/game-assets/resources/${resourceName}_small\\.png`, 'i');
        const damagedRockPattern = new RegExp(`/game-assets/resources/${resourceName}/${resourceName}_rock_spark\\.png`, 'i');
        const hasReadyImage = Array.from(placement.querySelectorAll('img')).some((image) => readyRockPattern.test(image.currentSrc || image.src || '') && !image.closest('.opacity-50'));
        const hasDamagedSprite = Array.from(placement.querySelectorAll('[style*="background-image"]')).some((element) => damagedRockPattern.test(element.style.backgroundImage || '') && !element.closest('.opacity-50'));
        return hasReadyImage || hasDamagedSprite;
      };
      const quickColumn = Array.from(document.querySelectorAll('div.flex.flex-col.items-center')).find((column) => Array.from(column.children).filter((child) => child.classList.contains('relative') && child.querySelector('.bg-brown-600 img[alt="item"]')).length >= 3);
      const toolSlot = quickColumn && Array.from(quickColumn.children).find((slot) => (slot.querySelector('.bg-brown-600 img[alt="item"]')?.currentSrc || slot.querySelector('.bg-brown-600 img[alt="item"]')?.src || '') === toolSource);
      toolSlot?.querySelector('.bg-brown-600')?.click();
      if (toolSlot) await sleep(160);
      let processed = 0;
      let mined = 0;
      const minedKeys = [];
      let hitsPerRock;
      for (const key of keys) {
        if (toolLimit !== null && mined >= toolLimit) break;
        const placement = Array.from(document.querySelectorAll('div[data-map-placement="true"]')).find((item) => `${item.style.top}|${item.style.left}` === key);
        if (!placement || !isReadyRock(placement)) continue;
        const hit = () => (placement.querySelector('.cursor-pointer') || placement.firstElementChild || placement).click();
        hit();
        let hits = 1;
        await sleep(160);
        if (hitsPerRock === undefined) hitsPerRock = isReadyRock(placement) ? 3 : 1;
        while (isReadyRock(placement) && hits < hitsPerRock) {
          hit();
          hits += 1;
          await sleep(160);
        }
        if (!isReadyRock(placement)) {
          mined += 1;
          minedKeys.push(key);
        }
        processed += 1;
        await sleep(60);
      }
      return { processed, mined, minedKeys, hitsPerRock: hitsPerRock || 1 };
    },
    args: [mapKeys, resource, Number.isFinite(knownTools) ? knownTools : null, toolIcon]
  });
  if (Number.isFinite(knownTools)) updateToolCount(toolIcon, knownTools - result.mined);
  return result;
}

async function readMiningTimers(mapKeys = []) {
  if (!mapKeys.length) return [];
  const [{ result }] = await executeOnSunflowerTabs({
    func: async (keys) => {
      const sleep = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));
      const parseSeconds = (text) => {
        const match = String(text || '').match(/(?:(\d+)\s*d(?:ays?)?)?\s*(?:(\d+)\s*h(?:r(?:s)?|ours?)?)?\s*(?:(\d+)\s*m(?:in(?:s)?)?)?\s*(?:(\d+)\s*s(?:ec(?:s)?)?)?/i);
        if (!match || (!match[1] && !match[2] && !match[3] && !match[4])) return null;
        return Number(match[1] || 0) * 86400 + Number(match[2] || 0) * 3600 + Number(match[3] || 0) * 60 + Number(match[4] || 0);
      };
      await sleep(280);
      return keys.map((key) => {
        const placement = Array.from(document.querySelectorAll('div[data-map-placement="true"]')).find((item) => `${item.style.top}|${item.style.left}` === key);
        const tooltip = Array.from(placement?.querySelectorAll('div.transition-opacity span.font-secondary') || []).map((node) => node.textContent.trim()).find((text) => /\d+\s*(?:d|day|h|hr|m|min|s|sec)/i.test(text));
        const mapTimer = Array.from(placement?.querySelectorAll('span.text-white.text-center.font-pixel, span.font-pixel') || []).map((node) => node.textContent.trim()).find((text) => /\d+\s*(?:d|h|m|s)/i.test(text));
        return { mapKey: key, seconds: parseSeconds(tooltip || mapTimer || placement?.innerText || '') };
      });
    },
    args: [mapKeys]
  });
  return Array.isArray(result) ? result : [];
}

async function harvestSalt(card, requestedHits) {
  const mapKeys = card.dataset.mapKeys ? card.dataset.mapKeys.split('||').filter(Boolean) : [];
  const hits = Math.min(Number(card.dataset.saltHits) || 1, Math.max(1, Number(requestedHits) || 1));
  const rakeSource = saltRakeSource();
  if (!mapKeys.length) throw new Error('Không xác định được ô Salt. Hãy quét Map lại.');
  const knownRakes = rakeSource ? toolCounts.get(rakeSource) : null;
  if (knownRakes === 0) throw new Error('Không còn Salt Rake.');
  const [{ result }] = await executeOnSunflowerTabs({
    func: async (keys, hitsPerSalt, rakeLimit) => {
      const sleep = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));
      let used = 0;
      const processedKeys = [];
      for (const key of keys) {
        const placement = Array.from(document.querySelectorAll('div[data-map-placement="true"]')).find((item) => `${item.style.top}|${item.style.left}` === key);
        if (!placement) continue;
        let hitApplied = false;
        for (let hit = 0; hit < hitsPerSalt && (rakeLimit === null || used < rakeLimit); hit += 1) {
          (placement.querySelector('.cursor-pointer') || placement.firstElementChild || placement).click();
          used += 1;
          hitApplied = true;
          await sleep(120);
        }
        if (hitApplied) processedKeys.push(key);
      }
      return { used, processedKeys, hitsPerSalt };
    },
    args: [mapKeys, hits, Number.isFinite(knownRakes) ? knownRakes : null]
  });
  if (result?.error) throw new Error(result.error);
  if (Number.isFinite(knownRakes)) updateToolCount(rakeSource, knownRakes - result.used);
  return result;
}

async function upgradeSalt(card, requestedUpgrades) {
  const mapKeys = card.dataset.mapKeys ? card.dataset.mapKeys.split('||').filter(Boolean) : [];
  const requested = Math.min(mapKeys.length, Math.max(1, Number(requestedUpgrades) || 1));
  if (!mapKeys.length) throw new Error('Không xác định được ô Salt cần nâng cấp. Hãy quét Map lại.');
  const [{ result }] = await executeOnSunflowerTabs({
    func: async (keys, limit) => {
      const sleep = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));
      const isVisible = (element) => Boolean(element && element.getClientRects().length);
      const waitFor = async (predicate, timeout = 1200) => {
        const deadline = Date.now() + timeout;
        while (Date.now() < deadline) {
          const value = predicate();
          if (value) return value;
          await sleep(30);
        }
        return null;
      };
      const panelForClose = (close) => {
        let panel = close?.parentElement;
        while (panel && panel !== document.body) {
          if (/Upgrade Salt Farm|Upgrade your salt farm|Requirements/i.test(panel.innerText || '')) return panel;
          panel = panel.parentElement;
        }
        return close?.parentElement || null;
      };
      const readRequirements = (panel, fallbackText) => {
        const box = Array.from(panel?.querySelectorAll('div.flex.flex-col.w-full') || []).find((element) => /^Requirements\b/i.test(element.innerText.trim()));
        const entries = Array.from(box?.querySelectorAll('div.flex-shrink-0.gap-1') || []).map((element) => {
          const image = element.querySelector('img[alt="item"]');
          const amount = Array.from(element.querySelectorAll('.font-secondary')).map((node) => node.textContent.trim()).find((text) => /\d/.test(text)) || '';
          const ratio = amount.match(/(\d+(?:[.,]\d+)?)\s*\/\s*(\d+(?:[.,]\d+)?)/);
          const background = Array.from(element.querySelectorAll('.font-secondary')).map((node) => getComputedStyle(node).backgroundColor.match(/\d+/g)?.map(Number) || []).find((rgb) => rgb.length >= 3 && rgb[0] > 90 && rgb[1] < 100 && rgb[2] < 100);
          const missing = ratio ? Number(ratio[1].replace(',', '.')) < Number(ratio[2].replace(',', '.')) : Boolean(background);
          return amount ? { icon: image?.currentSrc || image?.src || '', text: amount, missing } : null;
        }).filter(Boolean);
        return entries.length ? entries : fallbackText ? [{ icon: '', text: fallbackText, missing: false }] : [];
      };
      let upgraded = 0;
      let failed = false;
      let lastRequirements = [];
      for (const key of keys.slice(0, limit)) {
        const placement = Array.from(document.querySelectorAll('div[data-map-placement="true"]')).find((item) => `${item.style.top}|${item.style.left}` === key);
        if (!placement) continue;
        (placement.querySelector('.cursor-pointer') || placement.firstElementChild || placement).click();
        const panelMatch = await waitFor(() => Array.from(document.querySelectorAll('img[src*="/game-assets/icons/close.png"]')).map((close) => ({ close, panel: panelForClose(close) })).find(({ close, panel }) => isVisible(close) && /Upgrade Salt Farm|Upgrade your salt farm|Requirements/i.test(panel?.innerText || '')));
        if (!panelMatch) {
          failed = true;
          break;
        }
        const { close, panel } = panelMatch;
        const panelText = panel?.innerText || '';
        const requirementText = (panelText.match(/Requirements\s*([\s\S]*?)(?=\s*Next Level|$)/i)?.[1] || '').replace(/\s+/g, ' ').trim();
        const requirementEntries = readRequirements(panel, requirementText);
        lastRequirements = requirementEntries.length ? requirementEntries : lastRequirements;
        const ratios = Array.from(requirementText.matchAll(/(\d+(?:[.,]\d+)?)\s*\/\s*(\d+(?:[.,]\d+)?)/g));
        const ratioMissing = ratios.some(([, owned, required]) => Number(String(owned).replace(',', '.')) < Number(String(required).replace(',', '.')));
        const upgradeButton = Array.from(panel?.querySelectorAll('button') || []).find((button) => /^Upgrade Salt Farm$/i.test(button.innerText.trim()));
        const cannotUpgrade = ratioMissing || Boolean(upgradeButton?.disabled) || /not enough|insufficient|missing|required|cannot|unable|failed/i.test(panelText);
        if (!cannotUpgrade && upgradeButton) {
          upgradeButton.click();
          await sleep(140);
        }
        if (close.isConnected) close.click();
        await sleep(140);
        if (cannotUpgrade || !upgradeButton) {
          failed = true;
          return { upgraded, failed, requirements: requirementEntries, canUpgrade: false };
        }
        upgraded += 1;
      }
      return { upgraded, failed, requirements: lastRequirements, canUpgrade: !failed };
    },
    args: [mapKeys, requested]
  });
  if (!result) throw new Error('Không thể mở panel Upgrade Salt.');
  return result;
}

mapActivityContent.addEventListener('click', async (event) => {
  const button = event.target.closest('[data-ui-action="mine"]');
  if (!button) return;
  const card = button.closest('.mining-card');
  const resourceName = card?.querySelector('.crop-card-title')?.textContent?.trim() || 'mỏ';
  button.disabled = true;
  button.textContent = 'Đang khai thác…';
  const finishLog = startActionLog(`Đang khai thác ${resourceName}…`);
  let completedMessage = '';
  try {
    const result = await mineRocks(card);
    if (!result.processed) logActionError('Không tìm thấy mỏ sẵn sàng khai thác.');
    else completedMessage = `Khai thác x${result.mined || result.processed} ${resourceName}`;
    if (result.mined) {
      moveMinedRocksToGrowing(result.minedKeys || []);
      applyMiningTimers(await readMiningTimers(result.minedKeys || []));
      renderOverview();
      startCountdowns();
    }
  } catch (error) {
    logActionError(error.message || 'Khai thác thất bại.');
  } finally {
    finishLog(completedMessage);
    button.disabled = false;
    button.textContent = button.dataset.actionLabel || 'Khai thác';
  }
});

async function harvestCrops(card) {
  const mapKeys = card.dataset.mapKeys ? card.dataset.mapKeys.split('||').filter(Boolean) : [];
  if (!mapKeys.length) throw new Error('Không xác định được Crop của card này. Hãy quét Map lại.');
  const [{ result }] = await executeOnSunflowerTabs({
    world: 'MAIN',
    func: async (keys) => {
      const sleep = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));
      const notify = (message) => {
        try { globalThis.chrome?.runtime?.sendMessage(message)?.catch?.(() => {}); } catch { /* MAIN world has no extension API. */ }
      };
      const openPanels = () => Array.from(document.querySelectorAll('[data-headlessui-state="open"], [data-open]')).filter((panel) => panel.offsetParent !== null);
      const miniGame = () => {
        const markers = [
          ['Tap the chest to open it', 'Chest'],
          ['Stop the Goblins!', 'Goblins'],
          ['Stop the Moon Seekers!', 'Moon Seekers']
        ];
        for (const panel of openPanels()) {
          const text = Array.from(panel.querySelectorAll('span')).map((span) => span.textContent.trim()).find((value) => markers.some(([marker]) => value === marker));
          const match = markers.find(([marker]) => marker === text);
          if (match) return { panel, name: match[1] };
        }
        return null;
      };
      const closeReward = () => {
        const panel = openPanels().find((candidate) => candidate.innerText.includes('Reward Discovered'));
        const button = panel && Array.from(panel.querySelectorAll('button')).find((candidate) => candidate.offsetParent !== null && candidate.innerText.trim() === 'Close');
        if (!button) return false;
        button.click();
        return true;
      };
      const clickChest = () => {
        const dialog = Array.from(document.querySelectorAll('[data-headlessui-state="open"]')).find((panel) => panel.offsetParent !== null && panel.innerText.includes('Tap the chest to open it'));
        // DOM đã xác nhận ảnh chest luôn là img.absolute.w-16 trong popup mở.
        const chest = dialog?.querySelector('img.absolute.w-16') || document.querySelector('img.absolute.w-16');
        if (!chest) return false;
        const rect = chest.getBoundingClientRect();
        const eventOptions = { bubbles: true, cancelable: true, view: window, clientX: rect.left + rect.width / 2, clientY: rect.top + rect.height / 2, button: 0, buttons: 1 };
        // Gửi trực tiếp lên ảnh Chest được nhận diện, để event.target chính là img.
        ['pointerdown', 'pointerup'].forEach((type) => chest.dispatchEvent(typeof PointerEvent === 'function' ? new PointerEvent(type, { ...eventOptions, pointerId: 1, pointerType: 'mouse', isPrimary: true }) : new MouseEvent(type, eventOptions)));
        ['mousedown', 'mouseup', 'click'].forEach((type) => chest.dispatchEvent(new MouseEvent(type, eventOptions)));
        chest.click();
        return true;
      };
      const clickNpcTargets = async (game) => {
        const assetName = game.name === 'Goblins' ? 'goblin' : game.name === 'Moon Seekers' ? 'skeleton' : '';
        if (!assetName) return { clicked: 0, targets: 0 };
        const grid = Array.from(game.panel.querySelectorAll('div.flex.flex-wrap.justify-center.items-center')).find((element) => Array.from(element.children).filter((child) => child.classList.contains('cursor-pointer')).length >= 12);
        if (!grid) return { clicked: 0, targets: 0 };
        const targets = Array.from(grid.children).filter((slot) => {
          const image = slot.querySelector('img');
          const propsKey = image && Object.getOwnPropertyNames(image).find((key) => key.startsWith('__reactProps$'));
          const reactSource = propsKey ? image[propsKey]?.src : '';
          const source = reactSource || image?.currentSrc || image?.src || '';
          return new RegExp(`/game-assets/npcs/[^/]*${assetName}`, 'i').test(source);
        });
        for (const target of targets) {
          const image = target.querySelector('img') || target;
          const rect = image.getBoundingClientRect();
          const options = { bubbles: true, cancelable: true, view: window, clientX: rect.left + rect.width / 2, clientY: rect.top + rect.height / 2, button: 0, buttons: 1 };
          ['pointerdown', 'pointerup'].forEach((type) => target.dispatchEvent(typeof PointerEvent === 'function' ? new PointerEvent(type, { ...options, pointerId: 1, pointerType: 'mouse', isPrimary: true }) : new MouseEvent(type, options)));
          target.click();
          await sleep(110);
        }
        return { clicked: targets.length, targets: targets.length };
      };
      const waitForNewMiniGame = async () => {
        const deadline = Date.now() + 170;
        while (Date.now() < deadline) {
          const game = miniGame();
          if (game) return game;
          await sleep(25);
        }
        return null;
      };
      const resolveMiniGame = async (game) => {
        const chestGame = game.name === 'Chest';
        if (chestGame) {
          notify({ type: 'HARVEST_CHEST_STARTED', clicked: clickChest() });
        } else {
          const solved = await clickNpcTargets(game);
          if (solved.clicked !== 3) {
            notify({ type: 'HARVEST_NPC_MINI_GAME_FAILED', game: game.name });
            return false;
          }
          notify({ type: 'HARVEST_NPC_MINI_GAME_STARTED', game: game.name, targets: solved.targets });
        }
        const deadline = Date.now() + (chestGame ? 300000 : 10000);
        let withoutPanelSince = 0;
        while (Date.now() < deadline) {
          if (closeReward()) {
            notify({ type: 'HARVEST_REWARD_CLOSED', game: game.name });
            await sleep(350);
            return true;
          }
          if (!miniGame()) {
            if (!chestGame) return true;
            withoutPanelSince ||= Date.now();
            if (Date.now() - withoutPanelSince >= 1500) return true;
          } else {
            withoutPanelSince = 0;
          }
          await sleep(250);
        }
        return false;
      };
      let harvested = 0;
      const harvestedKeys = [];
      for (const key of keys) {
        const pending = miniGame();
        if (pending && !(await resolveMiniGame(pending))) return { harvested, harvestedKeys, stopped: pending.name };
        const placement = Array.from(document.querySelectorAll('div[data-map-placement="true"]')).find((element) => `${element.style.top}|${element.style.left}` === key);
        const ready = placement && Array.from(placement.querySelectorAll('img')).some((image) => /\/game-assets\/crops\/[^/]+\/plant\.png/i.test(image.currentSrc || image.src || ''));
        if (!ready) continue;
        (placement.querySelector('.cursor-pointer') || placement.firstElementChild || placement).click();
        harvested += 1;
        harvestedKeys.push(key);
        const triggered = await waitForNewMiniGame();
        if (triggered && !(await resolveMiniGame(triggered))) return { harvested, harvestedKeys, stopped: triggered.name };
      }
      return { harvested, harvestedKeys, stopped: '' };
    },
    args: [mapKeys]
  });
  return result;
}

mapActivityContent.addEventListener('click', async (event) => {
  const button = event.target.closest('[data-ui-action="chop"]');
  if (!button) return;
  button.disabled = true;
  button.textContent = 'Đang chặt…';
  const finishLog = startActionLog('Đang chặt cây…');
  try {
    const result = await chopTrees(button.closest('.tree-card'));
    if (!result.processed) logActionError('Không tìm thấy Tree sẵn sàng chặt.');
    else if (result.felled) {
      const felledKeys = result.felledKeys || [];
      const states = await readTreeStates(felledKeys);
      if (states.length) applyTreeStates(states);
      if (states.length < felledKeys.length) scheduleTreeRefresh();
      renderOverview();
      startCountdowns();
    }
  } catch (error) {
    logActionError(error.message || 'Chặt Tree thất bại.');
  } finally {
    finishLog();
    button.disabled = false;
    button.textContent = button.dataset.actionLabel || 'Chặt';
  }
});

async function harvestMushrooms(card) {
  const mapKeys = card.dataset.mapKeys ? card.dataset.mapKeys.split('||').filter(Boolean) : [];
  if (!mapKeys.length) throw new Error('Không xác định được nấm trên map. Hãy quét Map lại.');
  const [{ result }] = await executeOnSunflowerTabs({
    func: async (keys) => {
      const sleep = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));
      const mushroomSource = (placement) => Array.from(placement.querySelectorAll('.mushroom [style*="background-image"]')).map((element) => element.style.backgroundImage || '').find((source) => /\/(?:wild|magic)_mushroom_sheet\.png/i.test(source));
      let harvested = 0;
      for (const key of keys) {
        const placement = Array.from(document.querySelectorAll('div[data-map-placement="true"]')).find((item) => `${item.style.top}|${item.style.left}` === key);
        if (!placement || !mushroomSource(placement)) continue;
        (placement.querySelector('.mushroom.cursor-pointer') || placement.querySelector('.mushroom') || placement).click();
        harvested += 1;
        await sleep(120);
      }
      return { harvested };
    },
    args: [mapKeys]
  });
  return result || { harvested: 0 };
}

function refreshAffectedSection(card, sections = []) {
  if (!lastScanData) return;
  const keys = new Set(String(card?.dataset?.mapKeys || '').split('||').filter(Boolean));
  if (!keys.size) return;
  const prune = (items = []) => items.map((item) => {
    const mapKeys = (item.mapKeys || []).filter((key) => !keys.has(key));
    return { ...item, mapKeys, count: mapKeys.length };
  }).filter((item) => item.mapKeys.length);
  if (sections.includes('crop')) {
    lastScanData.ready = prune(lastScanData.ready);
    lastScanData.growing = prune(lastScanData.growing);
    lastScanData.empty = prune(lastScanData.empty);
  }
  if (sections.includes('fruit') && lastScanData.fruit) {
    ['ready', 'growing', 'empty', 'dead'].forEach((state) => { lastScanData.fruit[state] = prune(lastScanData.fruit[state]); });
  }
  if (sections.includes('tree') && lastScanData.trees) {
    lastScanData.trees.ready = prune(lastScanData.trees.ready);
    lastScanData.trees.growing = prune(lastScanData.trees.growing);
  }
  if (sections.includes('mining') && lastScanData.mining) {
    lastScanData.mining.ready = prune(lastScanData.mining.ready);
    lastScanData.mining.growing = prune(lastScanData.mining.growing);
  }
  if (sections.includes('composter') && lastScanData.composters) {
    ['ready', 'empty', 'growing'].forEach((state) => { lastScanData.composters[state] = prune(lastScanData.composters[state]); });
    keys.forEach((key) => composterDetails.delete(key));
  }
  if (sections.includes('salt') && lastScanData.salt) {
    ['ready', 'growing', 'upgrade'].forEach((state) => { lastScanData.salt[state] = prune(lastScanData.salt[state]); });
  }
  if (sections.includes('pet') && lastScanData.pets) lastScanData.pets.sleeping = prune(lastScanData.pets.sleeping);
  if (sections.includes('mushroom') && lastScanData.mushrooms) {
    Object.values(lastScanData.mushrooms).forEach((item) => {
      if (!item) return;
      item.mapKeys = (item.mapKeys || []).filter((key) => !keys.has(key));
      item.count = item.mapKeys.length;
    });
  }
  renderOverview();
  startCountdowns();
}

function moveHarvestedCropsToEmpty(mapKeys = []) {
  if (!lastScanData || !mapKeys.length) return;
  const harvested = new Set(mapKeys);
  const moved = [];
  lastScanData.ready = (lastScanData.ready || []).flatMap((item) => {
    const movedKeys = (item.mapKeys || []).filter((key) => harvested.has(key));
    const remainingKeys = (item.mapKeys || []).filter((key) => !harvested.has(key));
    if (movedKeys.length) moved.push({ ...item, icon: 'https://sunflower-land.com/game-assets/crops/soil2.png', count: movedKeys.length, mapKeys: movedKeys, seconds: null, countdownTarget: null });
    return remainingKeys.length ? [{ ...item, count: remainingKeys.length, mapKeys: remainingKeys }] : [];
  });
  lastScanData.empty = [...(lastScanData.empty || []), ...moved];
}

function moveMinedRocksToGrowing(mapKeys = []) {
  if (!lastScanData?.mining || !mapKeys.length) return;
  const mined = new Set(mapKeys);
  const moved = [];
  lastScanData.mining.ready = (lastScanData.mining.ready || []).flatMap((item) => {
    const movedKeys = (item.mapKeys || []).filter((key) => mined.has(key));
    const remainingKeys = (item.mapKeys || []).filter((key) => !mined.has(key));
    if (movedKeys.length) moved.push({ ...item, count: movedKeys.length, mapKeys: movedKeys, seconds: null, countdownTarget: null });
    return remainingKeys.length ? [{ ...item, count: remainingKeys.length, mapKeys: remainingKeys }] : [];
  });
  lastScanData.mining.growing = [...(lastScanData.mining.growing || []), ...moved];
}

function applyMiningTimers(timerEntries = []) {
  if (!lastScanData?.mining || !timerEntries.length) return;
  const secondsByKey = new Map(timerEntries.filter((entry) => Number.isFinite(entry.seconds)).map((entry) => [entry.mapKey, entry.seconds]));
  const grouped = new Map();
  (lastScanData.mining.growing || []).forEach((item) => (item.mapKeys || []).forEach((mapKey) => {
    const seconds = secondsByKey.has(mapKey) ? secondsByKey.get(mapKey) : item.seconds;
    const key = `${item.resource}|${Number.isFinite(seconds) ? seconds : 'unknown'}|${item.icon}`;
    const current = grouped.get(key) || { ...item, count: 0, seconds: Number.isFinite(seconds) ? seconds : null, countdownTarget: null, mapKeys: [] };
    current.count += 1;
    current.mapKeys.push(mapKey);
    grouped.set(key, current);
  }));
  lastScanData.mining.growing = Array.from(grouped.values());
}

function advanceHarvestedSalt(mapKeys = [], hitsTaken = 1) {
  if (!lastScanData?.salt || !mapKeys.length) return;
  const harvested = new Set(mapKeys);
  const nextReady = [];
  const movedToGrowing = [];
  const append = (items, candidate) => {
    const existing = items.find((item) => Number(item.hits) === Number(candidate.hits) && item.icon === candidate.icon && Number(item.fertiliserType || 0) === Number(candidate.fertiliserType || 0));
    if (existing) {
      existing.count += candidate.count;
      existing.mapKeys.push(...candidate.mapKeys);
    } else items.push(candidate);
  };
  lastScanData.salt.ready = (lastScanData.salt.ready || []).flatMap((item) => {
    const movedKeys = (item.mapKeys || []).filter((key) => harvested.has(key));
    const remainingKeys = (item.mapKeys || []).filter((key) => !harvested.has(key));
    if (movedKeys.length) {
      const remainingHits = Math.max(0, Number(item.hits || 1) - Math.max(1, Number(hitsTaken) || 1));
      const nextState = { ...item, hits: remainingHits, count: movedKeys.length, mapKeys: movedKeys, seconds: null, countdownTarget: null };
      if (remainingHits) append(nextReady, nextState);
      else append(movedToGrowing, nextState);
    }
    return remainingKeys.length ? [{ ...item, count: remainingKeys.length, mapKeys: remainingKeys }] : [];
  });
  nextReady.forEach((item) => append(lastScanData.salt.ready, item));
  movedToGrowing.forEach((item) => append(lastScanData.salt.growing || (lastScanData.salt.growing = []), item));
}

function moveFruitCards(mapKeys = [], fromState, toState, icon) {
  if (!lastScanData?.fruit || !mapKeys.length) return;
  const changed = new Set(mapKeys);
  const moved = [];
  lastScanData.fruit[fromState] = (lastScanData.fruit[fromState] || []).flatMap((item) => {
    const movedKeys = (item.mapKeys || []).filter((key) => changed.has(key));
    const remainingKeys = (item.mapKeys || []).filter((key) => !changed.has(key));
    if (movedKeys.length) moved.push({ ...item, icon: icon || item.icon, count: movedKeys.length, mapKeys: movedKeys, seconds: null, countdownTarget: null });
    return remainingKeys.length ? [{ ...item, count: remainingKeys.length, mapKeys: remainingKeys }] : [];
  });
  lastScanData.fruit[toState] = [...(lastScanData.fruit[toState] || []), ...moved];
}

async function wakeSleepingPets(card) {
  const mapKeys = card.dataset.mapKeys ? card.dataset.mapKeys.split('||').filter(Boolean) : [];
  if (!mapKeys.length) throw new Error('Không xác định được Pet đang ngủ. Hãy quét Map lại.');
  const [{ result }] = await executeOnSunflowerTabs({
    func: async (keys) => {
      const sleep = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));
      let awakened = 0;
      const awakenedKeys = [];
      const awakenedPets = [];
      for (const key of keys) {
        const placement = Array.from(document.querySelectorAll('div[data-map-placement="true"]')).find((item) => `${item.style.top}|${item.style.left}` === key);
        const sleeping = placement?.querySelector('img[alt="sleeping"][src*="/game-assets/icons/sleeping.webp"]');
        if (!sleeping) continue;
        const pet = Array.from(placement.querySelectorAll('img')).find((image) => image !== sleeping && image.alt?.trim() && image.alt.trim().toLowerCase() !== 'sleeping') || Array.from(placement.querySelectorAll('img')).find((image) => image !== sleeping && image.classList.contains('cursor-pointer'));
        const target = pet || sleeping;
        target.click();
        awakened += 1;
        awakenedKeys.push(key);
        await sleep(120);
        const activePet = Array.from(placement.querySelectorAll('img')).find((image) => image.alt?.trim() && image.alt.trim().toLowerCase() !== 'sleeping');
        awakenedPets.push({ mapKey: key, label: activePet?.alt?.trim() || pet?.alt?.trim() || 'Pet', icon: activePet?.currentSrc || activePet?.src || pet?.currentSrc || pet?.src || '' });
      }
      return { awakened, awakenedKeys, awakenedPets };
    },
    args: [mapKeys]
  });
  return result || { awakened: 0, awakenedKeys: [], awakenedPets: [] };
}

function markPetsAwake(mapKeys = [], pets = []) {
  if (!lastScanData?.pets || !mapKeys.length) return;
  const awakened = new Set(mapKeys);
  const detailsByKey = new Map(pets.map((pet) => [pet.mapKey, pet]));
  const active = [];
  lastScanData.pets.sleeping = (lastScanData.pets.sleeping || []).flatMap((item) => {
    const awakenedKeys = (item.mapKeys || []).filter((key) => awakened.has(key));
    const remainingKeys = (item.mapKeys || []).filter((key) => !awakened.has(key));
    if (awakenedKeys.length) {
      const details = detailsByKey.get(awakenedKeys[0]) || {};
      active.push({ ...item, label: details.label || item.label, icon: details.icon || item.icon, count: awakenedKeys.length, mapKeys: awakenedKeys, petCheckCount: 0, nextPetCheckAt: Date.now() + 30 * 60 * 1000 });
    }
    return remainingKeys.length ? [{ ...item, count: remainingKeys.length, mapKeys: remainingKeys }] : [];
  });
  lastScanData.pets.awake = [...(lastScanData.pets.awake || []), ...active];
  renderOverview();
  startCountdowns();
}

async function checkAwakePets() {
  if (petSleepCheckInProgress || !(lastScanData?.pets?.awake || []).length) return;
  petSleepCheckInProgress = true;
  try {
    if (!await scanMap('pet')) scheduleNextPetCheck();
  } catch (error) {
    logActionError(error.message || 'Không thể quét trạng thái Pet.');
    scheduleNextPetCheck();
  } finally {
    petSleepCheckInProgress = false;
  }
}

function scheduleNextPetCheck() {
  if (!lastScanData?.pets?.awake?.length) return;
  const target = Date.now() + 15 * 60 * 1000;
  lastScanData.pets.awake.forEach((item) => {
    item.nextPetCheckAt = target;
  });
  renderOverview();
  startCountdowns();
}

function schedulePetSleepCheck() {
  window.clearTimeout(petSleepTimer);
  const awakePets = lastScanData?.pets?.awake || [];
  awakePets.forEach((item) => {
    if (!Number.isFinite(Number(item.nextPetCheckAt))) item.nextPetCheckAt = Date.now() + 30 * 60 * 1000;
  });
  const checks = awakePets.map((item) => Number(item.nextPetCheckAt)).filter((value) => Number.isFinite(value));
  if (!checks.length) return;
  petSleepTimer = window.setTimeout(() => void checkAwakePets(), Math.max(250, Math.min(Math.min(...checks) - Date.now(), 2147483647)));
}

function moveCollectedCompostersToEmpty(mapKeys = []) {
  if (!lastScanData?.composters || !mapKeys.length) return;
  const collected = new Set(mapKeys);
  const moved = [];
  lastScanData.composters.ready = (lastScanData.composters.ready || []).flatMap((item) => {
    const movedKeys = (item.mapKeys || []).filter((key) => collected.has(key));
    const remainingKeys = (item.mapKeys || []).filter((key) => !collected.has(key));
    if (movedKeys.length) moved.push({ ...item, count: movedKeys.length, mapKeys: movedKeys, seconds: null, recipe: [], requirements: [] });
    return remainingKeys.length ? [{ ...item, count: remainingKeys.length, mapKeys: remainingKeys }] : [];
  });
  lastScanData.composters.empty = [...(lastScanData.composters.empty || []), ...moved];
}

function moveStartedCompostersToGrowing(mapKeys = [], details = []) {
  if (!lastScanData?.composters || !mapKeys.length) return;
  const started = new Set(mapKeys);
  const secondsByKey = new Map(details.map((detail) => [detail.mapKey, Number(detail.seconds)]));
  const moved = [];
  lastScanData.composters.empty = (lastScanData.composters.empty || []).flatMap((item) => {
    const movedKeys = (item.mapKeys || []).filter((key) => started.has(key));
    const remainingKeys = (item.mapKeys || []).filter((key) => !started.has(key));
    movedKeys.forEach((key) => moved.push({ ...item, count: 1, mapKeys: [key], seconds: secondsByKey.get(key) || null, recipe: [], requirements: [] }));
    return remainingKeys.length ? [{ ...item, count: remainingKeys.length, mapKeys: remainingKeys }] : [];
  });
  lastScanData.composters.growing = [...(lastScanData.composters.growing || []), ...moved];
}

async function interactComposters(card, action) {
  const mapKeys = card.dataset.mapKeys ? card.dataset.mapKeys.split('||').filter(Boolean) : [];
  if (!mapKeys.length) throw new Error('Không xác định được Composter trên map. Hãy quét Map lại.');
  const [{ result }] = await executeOnSunflowerTabs({
    func: async (keys, requestedAction) => {
      const sleep = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));
      const waitFor = async (predicate, timeout = 4000) => {
        const deadline = Date.now() + timeout;
        while (Date.now() < deadline) {
          const found = predicate();
          if (found) return found;
          await sleep(30);
        }
        return null;
      };
      const isComposter = (placement) => Array.from(placement.querySelectorAll('img')).some((image) => /composter/i.test(image.alt || '') || /\/game-assets\/composters\/[^/]+\.(?:webp|png)(?:[?#]|$)/i.test(image.currentSrc || image.src || ''));
      const parseSeconds = (text) => Array.from(String(text || '').matchAll(/(\d+)\s*(days?|d|hrs?|h|mins?|m|secs?|s)\b/gi)).reduce((total, match) => {
        const unit = match[2].toLowerCase();
        return total + Number(match[1]) * (/^d/.test(unit) ? 86400 : /^h/.test(unit) ? 3600 : /^m/.test(unit) ? 60 : 1);
      }, 0) || null;
      const readRequirements = (panel) => {
        const requirementsLabel = Array.from(panel?.querySelectorAll('div, span') || []).find((element) => element.innerText?.trim() === 'Requirements');
        let requirementsSection = requirementsLabel || null;
        while (requirementsSection && !Array.from(requirementsSection.children).some((child) => child.classList?.contains('mt-2'))) requirementsSection = requirementsSection.parentElement;
        const requirementsContainer = Array.from(requirementsSection?.children || []).find((child) => child.classList?.contains('mt-2'));
        return Array.from(requirementsContainer?.querySelectorAll('img[alt="item"]') || []).map((image) => {
          let row = image.parentElement;
          while (row && row !== requirementsContainer && !row.classList.contains('min-h-[26px]')) row = row.parentElement;
          return { icon: image.currentSrc || image.src || '', text: row?.innerText?.trim() || '' };
        }).filter((entry) => entry.icon && entry.text);
      };
      let processed = 0;
      const processedKeys = [];
      const details = [];
      for (const key of keys) {
        const placement = Array.from(document.querySelectorAll('div[data-map-placement="true"]')).find((item) => `${item.style.top}|${item.style.left}` === key);
        if (!placement || !isComposter(placement)) continue;
        (placement.querySelector('.cursor-pointer') || placement.firstElementChild || placement).click();
        const actionButton = await waitFor(() => Array.from(document.querySelectorAll('button')).find((button) => button.offsetParent !== null && button.innerText.trim() === requestedAction));
        if (!actionButton) return { processed, error: `Không mở được nút ${requestedAction} của Composter.` };
        let panel = actionButton.parentElement;
        while (panel && panel !== document.body && !panel.querySelector('img[src*="/game-assets/icons/close.png"]')) panel = panel.parentElement;
        const requirements = requestedAction === 'Compost' ? readRequirements(panel) : [];
        const detail = { mapKey: key, seconds: null, requirements, canCompost: requestedAction === 'Compost' ? !actionButton.disabled : undefined };
        details.push(detail);
        if (actionButton.disabled) {
          panel?.querySelector('img[src*="/game-assets/icons/close.png"]')?.click();
          return { processed, details, error: 'Không đủ nguyên liệu để Compost.' };
        }
        actionButton.click();
        await sleep(350);
        if (requestedAction === 'Compost') {
          const timer = await waitFor(() => panel?.querySelector('img[src*="/game-assets/icons/timer.png"]'), 1800);
          detail.seconds = parseSeconds(timer?.parentElement?.innerText || '');
        }
        if (requestedAction === 'Collect') {
          const compostButton = await waitFor(() => Array.from(panel?.querySelectorAll('button') || []).find((button) => /^Compost$/i.test(button.innerText.trim())), 1800);
          if (compostButton) {
            detail.requirements = readRequirements(panel);
            detail.canCompost = !compostButton.disabled;
          }
        }
        const closeButton = await waitFor(() => {
          const close = panel?.querySelector('img[src*="/game-assets/icons/close.png"]');
          return close?.offsetParent !== null ? close : null;
        }, 2200);
        if (!closeButton) return { processed, error: 'Không tìm thấy nút đóng Composter.' };
        closeButton.click();
        processed += 1;
        processedKeys.push(key);
        await sleep(120);
      }
      return { processed, processedKeys, details };
    },
    args: [mapKeys, action]
  });
  result?.details?.forEach((detail) => {
    const previous = composterDetails.get(detail.mapKey) || {};
    composterDetails.set(detail.mapKey, { ...previous, seconds: detail.seconds ?? previous.seconds, requirements: detail.requirements || previous.requirements || [], recipe: detail.requirements || previous.recipe || [], canCompost: detail.canCompost ?? previous.canCompost });
  });
  if (result?.error) throw new Error(result.error);
  return result || { processed: 0, processedKeys: [] };
}

async function scanComposterDetails() {
  const [{ result }] = await executeOnSunflowerTabs({
    func: async () => {
      const sleep = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));
      const waitFor = async (predicate, timeout = 2500) => {
        const deadline = Date.now() + timeout;
        while (Date.now() < deadline) {
          const value = predicate();
          if (value) return value;
          await sleep(30);
        }
        return null;
      };
      const parseSeconds = (text) => {
        const match = String(text || '').replace(/\b(\d+)\s*hsr\b/gi, '$1hrs').match(/\b(?=\d+\s*(?:d(?:ays?)?|h(?:r(?:s)?|ours?)?|m(?:in(?:s)?)?|s(?:ec(?:s)?)?))(?:(\d+)\s*d(?:ays?)?)?\s*(?:(\d+)\s*h(?:r(?:s)?|ours?)?)?\s*(?:(\d+)\s*m(?:in(?:s)?)?)?\s*(?:(\d+)\s*s(?:ec(?:s)?)?)?/i);
        return match && (match[1] || match[2] || match[3] || match[4]) ? Number(match[1] || 0) * 86400 + Number(match[2] || 0) * 3600 + Number(match[3] || 0) * 60 + Number(match[4] || 0) : null;
      };
      const dialogs = () => Array.from(document.querySelectorAll('div[data-headlessui-state="open"]')).filter((dialog) => dialog.offsetParent !== null && /Composter/.test(dialog.innerText || ''));
      const closeDialog = async (dialog) => {
        const close = dialog?.querySelector('img.flex-none.cursor-pointer.float-right[src*="/game-assets/icons/close.png"], img[src*="/game-assets/icons/close.png"]');
        if (close?.offsetParent !== null) {
          const rect = close.getBoundingClientRect();
          const options = { bubbles: true, cancelable: true, view: window, clientX: rect.left + rect.width / 2, clientY: rect.top + rect.height / 2, button: 0, buttons: 1 };
          ['pointerdown', 'pointerup', 'mousedown', 'mouseup', 'click'].forEach((type) => close.dispatchEvent(typeof PointerEvent === 'function' && type.startsWith('pointer') ? new PointerEvent(type, { ...options, pointerId: 1, pointerType: 'mouse', isPrimary: true }) : new MouseEvent(type, options)));
          close.click();
          await waitFor(() => !dialog.isConnected || dialog.offsetParent === null, 1500);
          return true;
        }
        return false;
      };
      const placements = [...new Set(Array.from(document.querySelectorAll('div[data-map-placement="true"] img[alt="Compost Bin"], div[data-map-placement="true"] img[alt*="Composter"]')).map((image) => image.closest('div[data-map-placement="true"]')).filter(Boolean))];
      const details = [];
      const trace = { clicked: 0, read: 0, closed: 0 };
      for (const placement of placements) {
        const source = Array.from(placement.querySelectorAll('img')).map((image) => image.currentSrc || image.src || '').find((value) => /\/game-assets\/composters\//i.test(value)) || '';
        const growing = /_closed\.(?:webp|png)(?:[?#]|$)/i.test(source);
        const ready = /_ready\.(?:webp|png)(?:[?#]|$)/i.test(source);
        const target = placement.querySelector('.cursor-pointer') || placement.firstElementChild || placement;
        const dialogsBefore = new Set(dialogs());
        const rect = target.getBoundingClientRect();
        const options = { bubbles: true, cancelable: true, view: window, clientX: rect.left + rect.width / 2, clientY: rect.top + rect.height / 2, button: 0, buttons: 1 };
        ['pointerdown', 'pointerup'].forEach((type) => target.dispatchEvent(typeof PointerEvent === 'function' ? new PointerEvent(type, { ...options, pointerId: 1, pointerType: 'mouse', isPrimary: true }) : new MouseEvent(type, options)));
        target.click();
        trace.clicked += 1;
        const dialog = await waitFor(() => dialogs().find((item) => !dialogsBefore.has(item)), 3000);
        if (!dialog) {
          if (growing) {
            const mapTimer = Array.from(placement.querySelectorAll('span')).map((element) => element.textContent || '').find((text) => /\d+\s*(?:d|h|m|s)/i.test(text)) || '';
            details.push({ mapKey: `${placement.style.top}|${placement.style.left}`, seconds: parseSeconds(mapTimer), requirements: [], canCompost: undefined });
          }
          continue;
        }
        try {
          if (growing) {
            const timer = dialog.querySelector('img[src*="/game-assets/icons/timer.png"]');
            const mapTimer = Array.from(placement.querySelectorAll('span')).map((element) => element.textContent || '').find((text) => /\d+\s*(?:d|h|m|s)/i.test(text)) || '';
            details.push({ mapKey: `${placement.style.top}|${placement.style.left}`, seconds: parseSeconds(timer?.parentElement?.innerText || '') ?? parseSeconds(mapTimer), requirements: [], canCompost: undefined });
          } else if (!ready) {
            const compostButton = Array.from(dialog.querySelectorAll('button')).find((button) => /^Compost$/i.test(button.innerText.trim()));
            const requirementsLabel = Array.from(dialog.querySelectorAll('div, span')).find((element) => element.innerText?.trim() === 'Requirements');
            let requirementsSection = requirementsLabel || null;
            while (requirementsSection && !Array.from(requirementsSection.children).some((child) => child.classList?.contains('mt-2'))) requirementsSection = requirementsSection.parentElement;
            const requirementsContainer = Array.from(requirementsSection?.children || []).find((child) => child.classList?.contains('mt-2'));
            const requirements = Array.from(requirementsContainer?.querySelectorAll('img[alt="item"]') || []).map((image) => {
              let row = image.parentElement;
              while (row && row !== requirementsContainer && !row.classList.contains('min-h-[26px]')) row = row.parentElement;
              return { icon: image.currentSrc || image.src || '', text: row?.innerText?.trim() || '' };
            }).filter((entry) => entry.icon && entry.text);
            details.push({ mapKey: `${placement.style.top}|${placement.style.left}`, seconds: null, requirements, canCompost: Boolean(compostButton && !compostButton.disabled) });
          } else {
            details.push({ mapKey: `${placement.style.top}|${placement.style.left}`, seconds: null, requirements: [], canCompost: undefined });
          }
          trace.read += 1;
        } finally {
          if (await closeDialog(dialog)) trace.closed += 1;
        }
      }
      return { details, found: placements.length, trace };
    }
  });
  return result || { details: [], found: 0, trace: { clicked: 0, read: 0, closed: 0 } };
}

async function readComposterStates() {
  const [{ result }] = await executeOnSunflowerTabs({
    func: () => [...new Set(Array.from(document.querySelectorAll('div[data-map-placement="true"] img[alt="Compost Bin"], div[data-map-placement="true"] img[alt*="Composter"]')).map((image) => image.closest('div[data-map-placement="true"]')).filter(Boolean))].map((placement) => {
      const image = Array.from(placement.querySelectorAll('img')).find((item) => /composter/i.test(item.alt || '') || /\/game-assets\/composters\/[^/]+\.(?:webp|png)(?:[?#]|$)/i.test(item.currentSrc || item.src || ''));
      const icon = image?.currentSrc || image?.src || '';
      const sourceName = icon.match(/\/composters\/([^/.]+)\.(?:webp|png)/i)?.[1] || 'Composter';
      const label = image?.alt?.trim() || sourceName.replace(/_(?:ready|closed)$/i, '').replace(/[_-]/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
      const state = /_ready\.(?:webp|png)(?:[?#]|$)/i.test(icon) || Boolean(placement.querySelector('img.ready')) ? 'ready' : /_closed\.(?:webp|png)(?:[?#]|$)/i.test(icon) ? 'growing' : 'empty';
      return { mapKey: `${placement.style.top}|${placement.style.left}`, label, icon, state };
    })
  });
  return Array.isArray(result) ? result : [];
}

function applyComposterStates(states = []) {
  if (!lastScanData || !states.length) return;
  const groups = { ready: new Map(), empty: new Map(), growing: new Map() };
  states.forEach((state) => {
    const key = `${state.label}|${state.icon}`;
    const current = groups[state.state].get(key) || { label: state.label, icon: state.icon, count: 0, mapKeys: [] };
    current.count += 1;
    current.mapKeys.push(state.mapKey);
    groups[state.state].set(key, current);
    if (state.state !== 'growing') composterDetails.delete(state.mapKey);
  });
  lastScanData.composters = {
    ready: Array.from(groups.ready.values()),
    empty: Array.from(groups.empty.values()),
    growing: Array.from(groups.growing.values())
  };
}

async function interactFruit(card, action) {
  const mapKeys = card.dataset.mapKeys ? card.dataset.mapKeys.split('||').filter(Boolean) : [];
  if (!mapKeys.length) throw new Error('Không xác định được Fruit trên map. Hãy quét Map lại.');
  const [{ result }] = await executeOnSunflowerTabs({
    func: async (keys, requestedAction, requestedAxe, requestedSeedSource) => {
      const sleep = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));
      const placements = () => Array.from(document.querySelectorAll('div[data-map-placement="true"]'));
      const sourceList = (placement) => Array.from(placement.querySelectorAll('img')).map((image) => image.currentSrc || image.src || '');
      const isFruit = (placement) => sourceList(placement).some((source) => /\/game-assets\/(?:[^/]+\/)?fruit\/fruit_patch\.(?:webp|png)(?:[?#]|$)/i.test(source));
      const hasDeadTree = (placement) => sourceList(placement).some((source) => /\/game-assets\/fruit\/(?:dead_tree|dead_bush|withered_bush|bush_shrub)\.(?:webp|png)(?:[?#]|$)/i.test(source));
      const hasSoil = (placement) => sourceList(placement).some((source) => /\/game-assets\/crops\/soil2\.png/i.test(source));
      const hasGrowing = (placement) => Array.from(placement.querySelectorAll('img')).some((image) => /\/game-assets\/crops\/[^/]+\/(seedling|halfway|almost)\.png|\/game-assets\/fruit\/harvested_bush\.png/i.test(image.currentSrc || image.src || ''));
      const quickColumn = Array.from(document.querySelectorAll('div.flex.flex-col.items-center')).find((column) => Array.from(column.children).some((child) => child.querySelector('.bg-brown-600 img[alt="item"]')));
      const quickSlots = quickColumn ? Array.from(quickColumn.children).filter((child) => child.querySelector('.bg-brown-600 img[alt="item"]')) : [];
      const processedKeys = [];
      if (requestedAction === 'plant') {
        const seedSlot = quickSlots.find((slot) => {
          const source = slot.querySelector('.bg-brown-600 img[alt="item"]')?.currentSrc || slot.querySelector('.bg-brown-600 img[alt="item"]')?.src || '';
          return requestedSeedSource ? source === requestedSeedSource : /\/game-assets\/fruit\/.*(?:_seed|\/seed)\.png/i.test(source);
        });
        if (!seedSlot) return { error: 'Hãy chọn hạt Fruit trên thanh chọn nhanh trước.' };
        const available = Number((seedSlot.textContent.match(/\d[\d,.]*/)?.[0] || '0').replace(/[^\d]/g, ''));
        if (!available) return { error: 'Không còn hạt Fruit để trồng.' };
        seedSlot.querySelector('.bg-brown-600')?.click();
        await sleep(80);
        let processed = 0;
        for (const key of keys.slice(0, available)) {
          const placement = placements().find((item) => `${item.style.top}|${item.style.left}` === key);
          if (!placement || !isFruit(placement) || !hasSoil(placement)) continue;
          (placement.querySelector('.cursor-pointer') || placement).click();
          processed += 1;
          processedKeys.push(key);
          await sleep(115);
        }
        return { processed, processedKeys };
      }
      if (requestedAction === 'chop') {
        const axeSlot = quickSlots.find((slot) => (slot.querySelector('.bg-brown-600 img[alt="item"]')?.currentSrc || slot.querySelector('.bg-brown-600 img[alt="item"]')?.src || '') === requestedAxe);
        if (axeSlot && Number((axeSlot.textContent.match(/\d[\d,.]*/)?.[0] || '0').replace(/[^\d]/g, '')) > 0) {
          axeSlot.querySelector('.bg-brown-600')?.click();
          await sleep(80);
        }
      }
      let processed = 0;
      for (const key of keys) {
        const placement = placements().find((item) => `${item.style.top}|${item.style.left}` === key);
        if (!placement) continue;
        const eligible = requestedAction === 'chop' ? hasDeadTree(placement) : isFruit(placement) && !hasDeadTree(placement) && !hasSoil(placement) && !hasGrowing(placement);
        if (!eligible) continue;
        (placement.querySelector('.cursor-pointer') || placement).click();
        processed += 1;
        processedKeys.push(key);
        await sleep(130);
      }
      return { processed, processedKeys };
    },
    args: [mapKeys, action, axeIcon, selectedFruitSeed?.icon || lastScanData?.heldFruitSeed?.icon || '']
  });
  if (result?.error) throw new Error(result.error);
  return result;
}

async function readFruitStates(mapKeys = []) {
  if (!mapKeys.length) return [];
  const [{ result }] = await executeOnSunflowerTabs({
    func: async (keys) => {
      const sleep = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));
      const parseSeconds = (text) => {
        const match = String(text || '').match(/(?:(\d+)\s*d(?:ays?)?)?\s*(?:(\d+)\s*h(?:r(?:s)?|ours?)?)?\s*(?:(\d+)\s*m(?:in(?:s)?)?)?\s*(?:(\d+)\s*s(?:ec(?:s)?)?)?/i);
        if (!match || (!match[1] && !match[2] && !match[3] && !match[4])) return null;
        return Number(match[1] || 0) * 86400 + Number(match[2] || 0) * 3600 + Number(match[3] || 0) * 60 + Number(match[4] || 0);
      };
      await sleep(300);
      return keys.map((mapKey) => {
        const placement = Array.from(document.querySelectorAll('div[data-map-placement="true"]')).find((item) => `${item.style.top}|${item.style.left}` === mapKey);
        const images = Array.from(placement?.querySelectorAll('img') || []);
        const source = (image) => image.currentSrc || image.src || '';
        const titleCase = (value) => String(value || '').replace(/[_-]/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
        const crop = images.find((image) => /\/game-assets\/crops\/[^/]+\/(?:seedling|halfway|almost|plant)\.png/i.test(source(image)));
        const tooltipNode = Array.from(placement?.querySelectorAll('div.transition-opacity') || []).find((element) => element.querySelector('span.whitespace-nowrap') && element.querySelector('span.font-secondary'));
        const title = tooltipNode?.querySelector('span.whitespace-nowrap')?.textContent.trim() || '';
        const fruitName = title.match(/^(.+?)\s+(?:Tree\s+)?(?:Growing|Ready|Replenishing)$/i)?.[1] || '';
        const dead = images.find((image) => /\/game-assets\/fruit\/(?:dead_tree|dead_bush|withered_bush|bush_shrub)\.(?:webp|png)/i.test(source(image)));
        const soil = images.find((image) => /\/game-assets\/crops\/soil2\.png/i.test(source(image)));
        const harvestedBush = images.find((image) => /\/game-assets\/fruit\/harvested_bush\.png/i.test(source(image)));
        const tooltipTime = Array.from(placement?.querySelectorAll('div.transition-opacity span.font-secondary') || []).map((node) => node.textContent.trim()).find((text) => /\d+\s*(?:d|day|h|hr|m|min|s|sec)/i.test(text));
        const mapTimer = Array.from(placement?.querySelectorAll('span.text-white.text-center.font-pixel, span.font-pixel') || []).map((node) => node.textContent.trim()).find((text) => /\d+\s*(?:d|h|m|s)/i.test(text));
        const seconds = parseSeconds(tooltipTime || mapTimer || placement?.innerText || '');
        const readyByTooltip = /\bReady\b/i.test(title) && !Number.isFinite(seconds);
        const state = dead ? 'dead' : soil && !crop ? 'empty' : !readyByTooltip && (harvestedBush || crop || /\b(?:Growing|Replenishing)\b/i.test(title) || Number.isFinite(seconds)) ? 'growing' : 'ready';
        const icon = source(dead || soil || harvestedBush || crop || images.find((image) => !/fruit_patch|stopwatch|empty_bar|progress|\/game-assets\/ui\//i.test(source(image))) || {});
        return { mapKey, state, icon, seconds, label: fruitName ? titleCase(fruitName) : '' };
      });
    },
    args: [mapKeys]
  });
  return Array.isArray(result) ? result : [];
}

function applyFruitStates(states = []) {
  if (!lastScanData?.fruit || !states.length) return;
  const changed = new Set(states.map((state) => state.mapKey));
  const originalByKey = new Map();
  ['ready', 'growing', 'empty', 'dead'].forEach((state) => (lastScanData.fruit[state] || []).forEach((item) => (item.mapKeys || []).forEach((mapKey) => originalByKey.set(mapKey, item))));
  ['ready', 'growing', 'empty', 'dead'].forEach((state) => {
    lastScanData.fruit[state] = (lastScanData.fruit[state] || []).flatMap((item) => {
      const mapKeys = (item.mapKeys || []).filter((mapKey) => !changed.has(mapKey));
      return mapKeys.length ? [{ ...item, count: mapKeys.length, mapKeys }] : [];
    });
  });
  states.forEach((state) => {
    const original = originalByKey.get(state.mapKey) || {};
    const target = lastScanData.fruit[state.state] || (lastScanData.fruit[state.state] = []);
    const label = state.state === 'empty' ? 'Đất Fruit trống' : state.state === 'dead' ? 'Gốc Fruit chết' : state.label || original.label || 'Fruit';
    const candidate = { ...original, label, icon: state.icon || original.icon, count: 1, mapKeys: [state.mapKey], seconds: state.state === 'growing' ? state.seconds : null, countdownTarget: null };
    const group = target.find((item) => item.label === candidate.label && Number(item.fertiliserType || 0) === Number(candidate.fertiliserType || 0) && Number(item.seconds) === Number(candidate.seconds));
    if (group) {
      group.count += 1;
      group.mapKeys.push(state.mapKey);
    } else target.push(candidate);
  });
}

mapActivityContent.addEventListener('click', async (event) => {
  const button = event.target.closest('[data-ui-action]');
  const action = button?.dataset.uiAction;
  if (!['plant-fruit', 'harvest-fruit', 'chop-fruit', 'choose-fruit-seed'].includes(action)) return;
  const card = button.closest('.fruit-card');
  if (!card) return;
  if (action === 'choose-fruit-seed') {
    beginSeedPicking('fruit');
    log('Chọn trực tiếp một card hạt Fruit đã quét.');
    return;
  }
  if (action === 'plant-fruit') {
    const allEmptyKeys = Array.from(mapActivityContent.querySelectorAll('.fruit-soil-card[data-map-keys]')).flatMap((soil) => soil.dataset.mapKeys.split('||').filter(Boolean));
    if (allEmptyKeys.length) card.dataset.mapKeys = Array.from(new Set(allEmptyKeys)).join('||');
  }
  button.disabled = true;
  const originalLabel = button.textContent;
  const labels = { 'plant-fruit': 'Đang trồng…', 'harvest-fruit': 'Đang thu hoạch…', 'chop-fruit': 'Đang đốn…' };
  button.textContent = labels[action];
  const finishLog = startActionLog(labels[action]);
  try {
    const result = await interactFruit(card, action === 'plant-fruit' ? 'plant' : action === 'harvest-fruit' ? 'harvest' : 'chop');
    if (!result.processed) logActionError('Không có Fruit phù hợp để thao tác.');
    else {
      if (action === 'plant-fruit') {
        const fruitSeed = selectedFruitSeed || lastScanData?.heldFruitSeed;
        if (fruitSeed) setSeedCount(fruitSeed, Math.max(0, getSeedCount(fruitSeed) - result.processed));
      }
      applyFruitStates(await readFruitStates(result.processedKeys || []));
      renderOverview();
      startCountdowns();
    }
  } catch (error) {
    logActionError(error.message || 'Thao tác Fruit thất bại.');
  } finally {
    finishLog();
    if (button.isConnected) {
      button.disabled = false;
      button.textContent = originalLabel;
    }
  }
});

async function fertiliseGrowingCard(card, fertiliserIndex) {
  const cropName = card.dataset.cropName;
  const resource = card.dataset.resource || 'crop';
  const fertiliserSource = (resource === 'fruit' ? fruitFertiliserIcons : cropFertiliserIcons)[fertiliserIndex];
  const timeGroup = Number(card.dataset.timeGroup);
  const expectedCount = Number(card.dataset.count);
  const mapKeys = card.dataset.mapKeys ? card.dataset.mapKeys.split('||').filter(Boolean) : [];
  if (!fertiliserSource || !cropName || !Number.isFinite(timeGroup)) throw new Error('Không xác định được nhóm cây cần bón phân. Hãy quét Map lại.');
  const knownCount = fertiliserCounts.get(fertiliserSource);
  if (knownCount === 0) throw new Error('Không còn loại phân bón này.');
  const tab = await findSunflowerTab();
  if (!tab?.id) throw new Error('Không tìm thấy tab Sunflower Land đang mở.');
  const [{ result }] = await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: async (requestedFertiliser, requestedCrop, requestedGroup, requestedMapKeys, maximum, requestedResource, forceFullBagScan) => {
      const sleep = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));
      const normalise = (value) => value.replace(/[_-]/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
      const parseCount = (value) => {
        const text = String(value || '').trim().toLowerCase().replace(/,/g, '');
        const valueAsNumber = Number.parseFloat(text);
        return Number.isFinite(valueAsNumber) ? Math.floor(valueAsNumber * (text.includes('k') ? 1000 : 1)) : 0;
      };
      const parseSeconds = (text) => {
        const match = String(text || '').replace(/\b(\d+)\s*hsr\b/gi, '$1hrs').match(/\b(?=\d+\s*(?:d(?:ays?)?|h(?:r(?:s)?|ours?)?|m(?:in(?:s)?)?|s(?:ec(?:s)?)?))(?:(\d+)\s*d(?:ays?)?)?\s*(?:(\d+)\s*h(?:r(?:s)?|ours?)?)?\s*(?:(\d+)\s*m(?:in(?:s)?)?)?\s*(?:(\d+)\s*s(?:ec(?:s)?)?)?/i);
        if (!match || (!match[1] && !match[2] && !match[3] && !match[4])) return null;
        return Number(match[1] || 0) * 86400 + Number(match[2] || 0) * 3600 + Number(match[3] || 0) * 60 + Number(match[4] || 0);
      };
      const getFertiliserType = (placement) => {
        const sources = Array.from(placement.querySelectorAll('img')).map((image) => image.currentSrc || image.src || '');
        return sources.some((source) => source.startsWith('data:image/webp;base64,UklGRpAAAABXRUJQVlA4TIMAAAAvD0AC')) ? 2
          : sources.some((source) => source.startsWith('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAICAYAAADA+m62')) ? 1
            : sources.some((source) => source.includes('/icons/stopwatch.png')) ? 2
              : sources.some((source) => source.startsWith('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAN')) ? 1 : 0;
      };
      const quickColumn = Array.from(document.querySelectorAll('div.flex.flex-col.items-center')).find((column) => Array.from(column.children).filter((child) => child.classList.contains('relative') && child.querySelector('.bg-brown-600 img[alt="item"]')).length >= 3);
      const quickSlots = quickColumn ? Array.from(quickColumn.children).filter((child) => child.classList.contains('relative') && child.querySelector('.bg-brown-600 img[alt="item"]')) : [];
      const quickSlotFor = (source) => quickSlots.find((slot) => {
        const image = slot.querySelector('.bg-brown-600 img[alt="item"]');
        return (image?.currentSrc || image?.src || '') === source;
      });
      const selectedQuickSlot = quickSlots.find((slot) => slot.querySelector('img[src*="/game-assets/ui/select/selectbox_"]')) || quickSlots[0];
      const selectedQuickImage = selectedQuickSlot?.querySelector('.bg-brown-600 img[alt="item"]');
      let available = 0;
      let scannedFertilisers = [];
      if (forceFullBagScan) {
        let bagSearch = document.querySelector('input[placeholder="Search here..."]');
        if (!bagSearch) {
          const basket = Array.from(document.querySelectorAll('img[src*="/game-assets/icons/basket.png"]')).find((image) => image.closest('div.relative.flex.mb-2.cursor-pointer'));
          const basketButton = basket?.closest('div.relative.flex.mb-2.cursor-pointer');
          if (!basketButton) return { error: 'Không tìm thấy nút mở túi đồ.' };
          basketButton.click();
          await sleep(400);
          bagSearch = document.querySelector('input[placeholder="Search here..."]');
        }
        const bagRoot = bagSearch?.closest('div.relative.max-h-\\[90vh\\]') || bagSearch?.parentElement?.parentElement?.parentElement;
        const closeBag = () => {
          const closeButton = bagRoot?.querySelector('img[src*="/game-assets/icons/close.png"]') || Array.from(document.querySelectorAll('img[src*="/game-assets/icons/close.png"]')).find((image) => image.closest('div.relative.max-h-\\[90vh\\]'));
          closeButton?.click();
          return Boolean(closeButton);
        };
        const fertiliserHeader = Array.from(document.querySelectorAll('div')).find((element) => element.textContent.trim() === 'Fertilisers');
        const slots = Array.from(fertiliserHeader?.parentElement?.querySelectorAll('.bg-brown-600') || []);
        scannedFertilisers = slots.map((slot) => {
          const image = slot.querySelector('img[alt="item"]');
          return image ? { icon: image.currentSrc || image.src || '', count: parseCount(slot.parentElement?.innerText || slot.parentElement?.textContent || slot.textContent) } : null;
        }).filter(Boolean);
        const fertiliserSlot = slots.find((slot) => {
          const image = slot.querySelector('img[alt="item"]');
          return image && (image.currentSrc || image.src || '') === requestedFertiliser;
        });
        available = fertiliserSlot ? parseCount(fertiliserSlot.textContent) : 0;
        if (!fertiliserSlot || !available) return { error: !fertiliserSlot ? 'Không tìm thấy loại phân bón này trong túi đồ.' : 'Không còn loại phân bón này.', fertiliserMissing: true, scannedFertilisers, closed: closeBag() };
        fertiliserSlot.click();
        await sleep(180);
        if (!closeBag()) return { error: 'Không tìm thấy nút đóng túi đồ.' };
        await sleep(250);
      }
      if ((selectedQuickImage?.currentSrc || selectedQuickImage?.src || '') === requestedFertiliser) {
        available = parseCount(selectedQuickSlot.textContent);
      } else {
        const quickFertiliser = quickSlotFor(requestedFertiliser);
        if (quickFertiliser) {
          quickFertiliser.querySelector('.bg-brown-600')?.click();
          available = parseCount(quickFertiliser.textContent);
          await sleep(180);
        }
      }
      if (!available) {
        const search = document.querySelector('input[placeholder="Search here..."]');
        if (!search) {
        const basket = Array.from(document.querySelectorAll('img[src*="/game-assets/icons/basket.png"]')).find((image) => image.closest('div.relative.flex.mb-2.cursor-pointer'));
        const basketButton = basket?.closest('div.relative.flex.mb-2.cursor-pointer');
        if (!basketButton) return { error: 'Không tìm thấy nút mở túi đồ.' };
        basketButton.click();
        await sleep(400);
        }
        const bagSearch = document.querySelector('input[placeholder="Search here..."]');
        const bagRoot = bagSearch?.closest('div.relative.max-h-\\[90vh\\]') || bagSearch?.parentElement?.parentElement?.parentElement;
        const closeBag = () => {
          const closeButton = bagRoot?.querySelector('img[src*="/game-assets/icons/close.png"]') || Array.from(document.querySelectorAll('img[src*="/game-assets/icons/close.png"]')).find((image) => image.closest('div.relative.max-h-\\[90vh\\]'));
          closeButton?.click();
          return Boolean(closeButton);
        };
        const fertiliserHeader = Array.from(document.querySelectorAll('div')).find((element) => element.textContent.trim() === 'Fertilisers');
        const fertiliserSection = fertiliserHeader?.parentElement;
        const fertiliserSlot = fertiliserSection && Array.from(fertiliserSection.querySelectorAll('.bg-brown-600')).find((slot) => {
          const image = slot.querySelector('img[alt="item"]');
          return image && (image.currentSrc || image.src || '') === requestedFertiliser;
        });
        if (!fertiliserSlot) return { error: 'Không tìm thấy loại phân bón này trong túi đồ.', fertiliserMissing: true, scannedFertilisers, closed: closeBag() };
        available = parseCount(fertiliserSlot.textContent);
        if (!available) return { error: 'Không còn loại phân bón này.', fertiliserMissing: true, scannedFertilisers, closed: closeBag() };
        fertiliserSlot.click();
        await sleep(180);
        if (!closeBag()) return { error: 'Không tìm thấy nút đóng túi đồ.' };
        await sleep(250);
      }
      const requestedName = normalise(requestedCrop).toLowerCase();
      const candidates = Array.from(document.querySelectorAll('div[data-map-placement="true"]')).map((placement) => {
        const cropImage = Array.from(placement.querySelectorAll('img')).find((image) => /\/game-assets\/crops\/([^/]+)\/(seedling|halfway|almost)\.png/i.test(image.currentSrc || image.src || ''));
        const match = cropImage && (cropImage.currentSrc || cropImage.src || '').match(/\/game-assets\/crops\/([^/]+)\/(seedling|halfway|almost)\.png/i);
        const isFruitPatch = Array.from(placement.querySelectorAll('img')).some((image) => /\/game-assets\/(?:[^/]+\/)?fruit\/fruit_patch\.(?:webp|png)(?:[?#]|$)/i.test(image.currentSrc || image.src || ''));
        const seconds = parseSeconds(placement.innerText);
        const group = seconds === null ? null : (Math.floor(seconds / 60) + 1) * 60;
        const fruitSprite = requestedResource === 'fruit' && Array.from(placement.querySelectorAll('img')).find((image) => {
          const source = image.currentSrc || image.src || '';
          return !/fruit_patch|soil2|empty_bar|stopwatch|selectbox|progress|\/game-assets\/ui\//i.test(source);
        });
        const target = requestedResource === 'fruit'
          ? fruitSprite?.parentElement || placement
          : placement.querySelector('.cursor-pointer');
        const placementKey = `${placement.style.top}|${placement.style.left}`;
        const matchesResource = requestedResource === 'fruit' ? isFruitPatch : Boolean(match) && normalise(match[1]).toLowerCase() === requestedName;
        return matchesResource && target && getFertiliserType(placement) === 0 ? { placement, target, placementKey, group } : null;
      }).filter(Boolean);
      const exactTargets = candidates.filter((item) => requestedMapKeys.includes(item.placementKey));
      const targets = (exactTargets.length ? exactTargets : candidates.filter((item) => item.group !== null && Math.abs(item.group - requestedGroup) <= 5)).slice(0, Math.min(available, maximum));
      if (!targets.length) return { error: 'Không còn cây phù hợp trong card này để bón phân. Hãy quét Map lại.' };
      let applied = 0;
      for (const { target } of targets) {
        target.click();
        applied += 1;
        await sleep(100);
      }
      await sleep(300);
      return { applied, remaining: Math.max(0, available - applied), scannedFertilisers };
    },
    args: [fertiliserSource, cropName, timeGroup, mapKeys, expectedCount, resource, !fertiliserCounts.has(fertiliserSource)]
  });
  if (Array.isArray(result?.scannedFertilisers)) {
    [...cropFertiliserIcons, ...fruitFertiliserIcons].forEach((icon) => fertiliserCounts.set(icon, 0));
    result.scannedFertilisers.forEach((item) => fertiliserCounts.set(item.icon, item.count));
  }
  if (result?.fertiliserMissing) {
    fertiliserCounts.set(fertiliserSource, 0);
    renderOverview();
  }
  if (result?.error) throw new Error(result.error);
  fertiliserCounts.set(fertiliserSource, result.remaining);
  return result;
}

cropGrowingResults.addEventListener('click', async (event) => {
  const button = event.target.closest('[data-ui-action="fertilise"]');
  if (!button) return;
  const card = button.closest('.crop-card');
  button.disabled = true;
  const finishLog = startActionLog('Đang bón phân…');
  try {
    const result = await fertiliseGrowingCard(card, Number(button.dataset.fertiliserIndex));
    if (!result.applied) logActionError('Không có cây nào được bón phân.');
    renderOverview();
    startCountdowns();
  } catch (error) {
    logActionError(error.message || 'Bón phân thất bại.');
  } finally {
    finishLog();
    button.disabled = false;
  }
});

mapActivityContent.addEventListener('click', async (event) => {
  const button = event.target.closest('[data-ui-action]');
  const action = button?.dataset.uiAction;
  if (!action) return;
  if (action === 'fertilise' && button.closest('#crop-growing-results')) return;
  if (action === 'chop' || action === 'mine') return;
  if (action === 'scan-profession') {
    const scope = button.dataset.scanScope;
    const labels = { crop: 'Crop', fruit: 'Fruit', tree: 'Tree', mining: 'Mining', salt: 'Salt', mushroom: 'Nấm', pet: 'Pet' };
    const label = labels[scope] || 'nghề này';
    const originalLabel = button.textContent;
    button.disabled = true;
    button.textContent = 'Đang quét…';
    const finishLog = startActionLog(`Đang quét ${label}…`);
    try {
      if (!await scanMap(scope)) logActionError(`Không thể quét ${label}.`);
    } catch (error) {
      logActionError(error.message || `Không thể quét ${label}.`);
    } finally {
      finishLog();
      if (button.isConnected) {
        button.disabled = false;
        button.textContent = originalLabel;
      }
    }
    return;
  }
  if (action === 'wake-pet') {
    const card = button.closest('.pet-card');
    const petName = card?.querySelector('.crop-card-title')?.textContent?.trim() || 'Pet';
    button.disabled = true;
    button.textContent = 'Đang đánh thức…';
    const finishLog = startActionLog(`Đang đánh thức ${petName}…`);
    let completedMessage = '';
    try {
      const result = await wakeSleepingPets(card);
      if (!result.awakened) logActionError(`Không tìm thấy ${petName} đang ngủ.`);
      else {
        completedMessage = `Đánh thức x${result.awakened} ${petName}`;
        markPetsAwake(result.awakenedKeys || [], result.awakenedPets || []);
      }
    } catch (error) {
      logActionError(error.message || `Không thể đánh thức ${petName}.`);
    } finally {
      finishLog(completedMessage);
      button.disabled = false;
      button.textContent = 'Đánh thức';
    }
    return;
  }
  if (action === 'harvest-mushrooms') {
    button.disabled = true;
    button.textContent = 'Đang thu hoạch…';
    const finishLog = startActionLog('Đang thu hoạch nấm…');
    try {
      const result = await harvestMushrooms(button.closest('.mushroom-card'));
      if (!result.harvested) logActionError('Không tìm thấy nấm sẵn sàng thu hoạch.');
      refreshAffectedSection(button.closest('.mushroom-card'), ['mushroom']);
    } catch (error) {
      logActionError(error.message || 'Thu hoạch nấm thất bại.');
    } finally {
      finishLog();
      button.disabled = false;
      button.textContent = 'Thu hoạch';
    }
    return;
  }
  if (action === 'harvest-salt') {
    if (!toolBagScanned) {
      scanToolsButton.click();
      log('Đang quét Tools để kiểm tra Salt Rake…');
      return;
    }
    button.disabled = true;
    button.textContent = 'Đang khai thác…';
    const finishLog = startActionLog('Đang khai thác Salt…');
    try {
      const result = await harvestSalt(button.closest('.salt-card'), Number(button.dataset.requestedSaltHits));
      if (!result.used) logActionError('Không có ô Salt sẵn sàng khai thác.');
      else {
        advanceHarvestedSalt(result.processedKeys || [], result.hitsPerSalt);
        renderOverview();
        startCountdowns();
      }
    } catch (error) {
      logActionError(error.message || 'Khai thác Salt thất bại.');
    } finally {
      finishLog();
      button.disabled = false;
      button.innerHTML = `<img src="${escapeHtml(saltRakeSource() || saltRakeFallback)}" alt="Salt Rake" /><span>×${button.dataset.requestedSaltHits || 1}</span>`;
    }
    return;
  }
  if (action === 'upgrade-salt') {
    const card = button.closest('.salt-upgrade-card');
    if (!card) return;
    const originalLabel = button.textContent;
    button.disabled = true;
    button.textContent = 'Đang nâng cấp…';
    const finishLog = startActionLog('Đang nâng cấp Salt…');
    try {
      const result = await upgradeSalt(card, Number(button.dataset.requestedSaltUpgrades));
      saltUpgradeDetails.set(card.dataset.mapKeys || '', { requirements: result.requirements, canUpgrade: result.canUpgrade });
      if (result.failed || !result.upgraded) {
        saltUpgradeFailures.add(card.dataset.mapKeys || '');
        logActionError('Upgrade Salt thất bại: thiếu nguyên liệu hoặc không mở được panel.');
        // Giữ nguyên card trên panel để nút đỏ và tooltip nguyên liệu thiếu vẫn hiển thị.
        renderOverview();
      } else {
        saltUpgradeFailures.delete(card.dataset.mapKeys || '');
        refreshAffectedSection(card, ['salt']);
      }
    } catch (error) {
      saltUpgradeFailures.add(card.dataset.mapKeys || '');
      logActionError(error.message || 'Upgrade Salt thất bại.');
      renderOverview();
    } finally {
      finishLog();
      if (button.isConnected) {
        button.disabled = false;
        button.textContent = originalLabel;
      }
    }
    return;
  }
  if (action === 'scan-composter') {
    button.disabled = true;
    button.textContent = 'Đang quét…';
    const finishLog = startActionLog('Đang quét Composter…');
    try {
      applyComposterStates(await readComposterStates());
      const result = await scanComposterDetails();
      result.details.forEach((detail) => composterDetails.set(detail.mapKey, {
        seconds: detail.seconds,
        requirements: detail.requirements || [],
        recipe: detail.requirements || [],
        canCompost: detail.canCompost
      }));
      if (!result.details.length) logActionError(result.found ? `Composter: click ${result.trace?.clicked || 0}, đọc ${result.trace?.read || 0}, đóng ${result.trace?.closed || 0}.` : 'Không tìm thấy Composter trên DOM game.');
      renderOverview();
      startCountdowns();
    } catch (error) {
      logActionError(error.message || 'Quét Composter thất bại.');
    } finally {
      finishLog();
      if (button.isConnected) {
        button.disabled = false;
        button.textContent = 'Quét compost';
      }
    }
    return;
  }
  if (action === 'collect-composter' || action === 'compost') {
    const label = action === 'collect-composter' ? 'Collect' : 'Compost';
    const composterCard = button.closest('.composter-card');
    button.disabled = true;
    button.textContent = `Đang ${label}…`;
    const finishLog = startActionLog(`Đang ${label} Composter…`);
    try {
      const result = await interactComposters(composterCard, label);
      if (!result.processed) logActionError(`Không có Composter để ${label}.`);
      else if (action === 'collect-composter') moveCollectedCompostersToEmpty(result.processedKeys || []);
      else if (action === 'compost') moveStartedCompostersToGrowing(result.processedKeys || [], result.details || []);
      renderOverview();
      startCountdowns();
    } catch (error) {
      logActionError(error.message || `${label} Composter thất bại.`);
      renderOverview();
    } finally {
      finishLog();
      button.disabled = false;
      button.textContent = label;
    }
    return;
  }
  if (action === 'fertilise') {
    const card = button.closest('.crop-card');
    button.disabled = true;
    const finishLog = startActionLog('Đang bón phân…');
    try {
      const result = await fertiliseGrowingCard(card, Number(button.dataset.fertiliserIndex));
      if (!result.applied) logActionError('Không có cây nào được bón phân.');
      renderOverview();
      startCountdowns();
    } catch (error) {
      logActionError(error.message || 'Bón phân thất bại.');
    } finally {
      finishLog();
      button.disabled = false;
    }
    return;
  }
  if (action === 'harvest') {
    button.disabled = true;
    button.textContent = 'Đang thu hoạch…';
    const finishLog = startActionLog('Đang thu hoạch…');
    try {
      const result = await harvestCrops(button.closest('.crop-card'));
      if (result.stopped) logActionError(`Thu hoạch dừng vì mini game ${result.stopped}.`);
      else if (!result.harvested) logActionError('Không có Crop sẵn sàng thu hoạch.');
      if (result.harvested) {
        moveHarvestedCropsToEmpty(result.harvestedKeys || []);
        renderOverview();
        startCountdowns();
      }
    } catch (error) {
      logActionError(error.message || 'Thu hoạch Crop thất bại.');
    } finally {
      finishLog();
      button.disabled = false;
      button.textContent = 'Thu hoạch';
    }
    return;
  }
  if (action === 'choose-seed') {
    beginSeedPicking('crop');
    log('Chọn trực tiếp một card hạt Crop đã quét.');
    return;
  }
  if (action === 'plant') {
    if (!selectedPlantSeed || !button.dataset.selectedSeed) {
      logActionError('Hãy chọn hạt tại card Chọn hạt trước khi trồng.');
      return;
    }
    button.disabled = true;
    button.textContent = 'Đang trồng…';
    const finishLog = startActionLog('Đang trồng…');
    try {
      const tab = await findSunflowerTab();
      if (!tab?.id) throw new Error('Không tìm thấy tab Sunflower Land đang mở.');
      const [{ result }] = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: async (requestedFertiliserType, requestedSeedName) => {
          const soilSelector = 'img[src*="/game-assets/crops/soil2.png"]';
          const titleCase = (value) => value.replace(/[_-]/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
          const quickSlots = () => {
            const quickSelectColumn = Array.from(document.querySelectorAll('div.flex.flex-col.items-center')).find((column) => Array.from(column.children).filter((child) => child.classList.contains('relative') && child.querySelector('.bg-brown-600 img[alt="item"]')).length >= 3);
            return quickSelectColumn ? Array.from(quickSelectColumn.children).filter((child) => child.classList.contains('relative') && child.querySelector('.bg-brown-600 img[alt="item"]')) : [];
          };
          const requestedCrop = String(requestedSeedName || '').replace(/\s+seed$/i, '').trim().replace(/[_-]/g, ' ').toLowerCase();
          const isRequestedSeed = (source) => {
            const match = source.match(/\/game-assets\/crops\/([^/]+)\/seed\.png/i);
            return Boolean(match && (!requestedCrop || match[1].replace(/[_-]/g, ' ').toLowerCase() === requestedCrop));
          };
          let seedSlot = quickSlots().find((slot) => {
            const source = slot.querySelector('.bg-brown-600 img[alt="item"]')?.currentSrc || slot.querySelector('.bg-brown-600 img[alt="item"]')?.src || '';
            return isRequestedSeed(source);
          });
          if (!seedSlot) {
            let bagSearch = document.querySelector('input[placeholder="Search here..."]');
            if (!bagSearch) {
              const basket = Array.from(document.querySelectorAll('img[src*="/game-assets/icons/basket.png"]')).find((image) => image.closest('div.relative.flex.mb-2.cursor-pointer'));
              basket?.closest('div.relative.flex.mb-2.cursor-pointer')?.click();
              await new Promise((resolve) => setTimeout(resolve, 400));
              bagSearch = document.querySelector('input[placeholder="Search here..."]');
            }
            const bagRoot = bagSearch?.closest('div.relative.max-h-\\[90vh\\]') || bagSearch?.parentElement?.parentElement?.parentElement;
            const bagSeedSlot = Array.from(bagRoot?.querySelectorAll('.bg-brown-600') || []).find((slot) => {
              const source = slot.querySelector('img[alt="item"]')?.currentSrc || slot.querySelector('img[alt="item"]')?.src || '';
              return isRequestedSeed(source);
            });
            if (bagSeedSlot) {
              bagSeedSlot.click();
              await new Promise((resolve) => setTimeout(resolve, 180));
            }
            bagRoot?.querySelector('img[src*="/game-assets/icons/close.png"]')?.click();
            seedSlot = quickSlots().find((slot) => {
              const source = slot.querySelector('.bg-brown-600 img[alt="item"]')?.currentSrc || slot.querySelector('.bg-brown-600 img[alt="item"]')?.src || '';
              return isRequestedSeed(source);
            });
          }
          if (!seedSlot) return { clicked: 0, emptyCounts: [], growing: [], error: `Không tìm thấy ${requestedSeedName} trên thanh chọn nhanh hoặc trong túi đồ.` };
          seedSlot.querySelector('.bg-brown-600')?.click();
          await new Promise((resolve) => setTimeout(resolve, 35));
          const heldItem = seedSlot.querySelector('.bg-brown-600 img[alt="item"]');
          const seedCount = Number((seedSlot.textContent.match(/\d[\d,.]*/)?.[0] || '0').replace(/[^\d]/g, ''));
          if (!seedCount) return { clicked: 0, emptyCounts: [], growing: [], error: 'Không còn hạt giống để trồng.' };
          const seedSource = heldItem.currentSrc || heldItem.src;
          const seedMatch = seedSource.match(/\/crops\/([^/]+)\/seed\.png/i);
          const getFertiliserType = (placement) => {
            const sources = Array.from(placement.querySelectorAll('img')).map((image) => image.currentSrc || image.src || '');
            return sources.some((source) => source.includes('/icons/stopwatch.png')) ? 2 : sources.some((source) => source.startsWith('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAN')) ? 1 : 0;
          };
          const targets = Array.from(document.querySelectorAll('div[data-map-placement="true"]')).map((placement) => {
            const first = placement.firstElementChild;
            const second = first?.firstElementChild;
            const third = second?.firstElementChild;
            const cropSoil = third?.classList.contains('cursor-pointer') && third.classList.contains('hover:img-highlight') && third.querySelector(soilSelector);
            return cropSoil ? { key: `${placement.style.top}|${placement.style.left}`, target: third, fertiliserType: getFertiliserType(placement) } : null;
          }).filter((item) => item && item.fertiliserType === requestedFertiliserType).slice(0, seedCount);
          globalThis.__sunflowerToolsPlanting = true;
          globalThis.__sunflowerToolsIgnoreMapMutationsUntil = Date.now() + Math.max(4000, targets.length * 95 + 2000);
          try {
            for (const targetInfo of targets) {
              const placement = Array.from(document.querySelectorAll('div[data-map-placement="true"]')).find((item) => `${item.style.top}|${item.style.left}` === targetInfo.key);
              const first = placement?.firstElementChild;
              const second = first?.firstElementChild;
              const currentTarget = second?.firstElementChild;
              if (!currentTarget) continue;
              currentTarget.click();
              await new Promise((resolve) => setTimeout(resolve, 60));
            }
          } finally {
            globalThis.__sunflowerToolsPlanting = false;
          }
          const hasRenderedCrop = (placement) => Array.from(placement?.querySelectorAll('img') || []).some((image) => /\/game-assets\/crops\/[^/]+\/(seedling|halfway|almost)\.png/i.test(image.currentSrc || image.src || '')) && /\b\d+\s*(?:h|hr|hrs|hour|hours|m|min|mins|s|sec|secs)\b/i.test(placement?.innerText || '');
          // Chỉ đọc lại đúng các ô vừa trồng; chờ game render timer thực tế trước khi nhóm card.
          const maxPlantRenderAttempts = Math.max(10, Math.min(20, Math.ceil(targets.length / 2)));
          for (let attempt = 0; attempt < maxPlantRenderAttempts; attempt += 1) {
            const refreshedPlacements = Array.from(document.querySelectorAll('div[data-map-placement="true"]'));
            const renderedCount = targets.filter((targetInfo) => hasRenderedCrop(refreshedPlacements.find((item) => `${item.style.top}|${item.style.left}` === targetInfo.key))).length;
            if (renderedCount === targets.length) break;
            await new Promise((resolve) => setTimeout(resolve, 180));
          }
          await new Promise((resolve) => setTimeout(resolve, 80));
          const placements = Array.from(document.querySelectorAll('div[data-map-placement="true"]'));
          const parseSeconds = (text) => {
            const match = text.replace(/\b(\d+)\s*hsr\b/gi, '$1hrs').match(/\b(?=\d+\s*(?:d(?:ays?)?|h(?:r(?:s)?|ours?)?|m(?:in(?:s)?)?|s(?:ec(?:s)?)?))(?:(\d+)\s*d(?:ays?)?)?\s*(?:(\d+)\s*h(?:r(?:s)?|ours?)?)?\s*(?:(\d+)\s*m(?:in(?:s)?)?)?\s*(?:(\d+)\s*s(?:ec(?:s)?)?)?/i);
            if (!match || (!match[1] && !match[2] && !match[3] && !match[4])) return { seconds: null, hasSeconds: false };
            return {
              seconds: Number(match[1] || 0) * 86400 + Number(match[2] || 0) * 3600 + Number(match[3] || 0) * 60 + Number(match[4] || 0),
              hasSeconds: Boolean(match[4])
            };
          };
          const groupingWindow = (seconds) => seconds < 60 ? 20 : seconds < 3600 ? 30 : 60;
          const plantedEntries = [];
          const plantedTargets = [];
          targets.forEach((targetInfo) => {
            const placement = placements.find((item) => `${item.style.top}|${item.style.left}` === targetInfo.key);
            const image = placement && Array.from(placement.querySelectorAll('img')).find((item) => /\/game-assets\/crops\/([^/]+)\/(seedling|halfway|almost)\.png/i.test(item.currentSrc || item.src || ''));
            const match = image && (image.currentSrc || image.src).match(/\/game-assets\/crops\/([^/]+)\/(seedling|halfway|almost)\.png/i);
            if (!match) return;
            plantedTargets.push(targetInfo);
            const tooltipTime = Array.from(placement.querySelectorAll('div.transition-opacity span.font-secondary')).map((element) => element.textContent.trim()).find((text) => /^\d+\s*(?:day|d|hr|h|min|m|sec|s)/i.test(text)) || '';
            const timerText = Array.from(placement.querySelectorAll('span.text-white.text-center.font-pixel')).map((element) => element.textContent.trim()).find((text) => /\d+\s*(?:d|h|m|s)/i.test(text)) || '';
            const time = parseSeconds(tooltipTime || timerText || placement.innerText);
            plantedEntries.push({ label: titleCase(match[1]), icon: image.currentSrc || image.src, count: 1, fertilised: targetInfo.fertiliserType > 0, fertiliserType: targetInfo.fertiliserType, seconds: time.seconds, timeGroup: time.seconds ?? 'unknown', hasPreciseSeconds: time.hasSeconds, mapKeys: [targetInfo.key] });
          });
          const plantedGroups = [];
          plantedEntries.sort((left, right) => (right.seconds || 0) - (left.seconds || 0)).forEach((entry) => {
            const group = plantedGroups.find((candidate) => candidate.label === entry.label && candidate.fertiliserType === entry.fertiliserType && ((Number.isFinite(candidate.seconds) && Number.isFinite(entry.seconds) && Math.abs(candidate.seconds - entry.seconds) <= groupingWindow(Math.max(candidate.seconds, entry.seconds))) || (!Number.isFinite(candidate.seconds) && !Number.isFinite(entry.seconds))));
            if (group) {
              group.count += entry.count;
              group.mapKeys.push(...entry.mapKeys);
            } else plantedGroups.push({ ...entry, mapKeys: [...entry.mapKeys] });
          });
          const emptyByType = new Map();
          plantedTargets.forEach(({ fertiliserType }) => emptyByType.set(fertiliserType, (emptyByType.get(fertiliserType) || 0) + 1));
          return { clicked: plantedTargets.length, emptyCounts: Array.from(emptyByType, ([fertiliserType, count]) => ({ fertiliserType, count })), growing: plantedGroups, seedName: seedMatch ? titleCase(seedMatch[1]) : 'Hạt giống', remainingSeeds: Math.max(0, seedCount - plantedTargets.length) };
        },
        args: [Number(button.dataset.targetFertiliserType || 0), button.dataset.selectedSeed || '']
      });
      if (result.error) throw new Error(result.error);
      if (!result.clicked) logActionError('Không tìm thấy ô Crop trống thuộc nhóm đã chọn.');
      applyPlantResult(result);
      if (result.clicked) {
        renderOverview();
        startCountdowns();
      }
    } catch (error) {
      logActionError(error.message || 'Trồng Crop thất bại.');
    } finally {
      finishLog();
      button.disabled = false;
      button.textContent = button.dataset.actionLabel || 'Trồng';
    }
    return;
  }
});

async function testMiniGame(button, marker, name) {
  button.disabled = true;
  try {
    const [{ result }] = await executeOnSunflowerTabs({
      func: (expectedMarker) => document.body.innerText.includes(expectedMarker),
      args: [marker]
    });
    log(result ? `Đã phát hiện mini game ${name}.` : `Chưa phát hiện mini game ${name}.`);
  } catch (error) {
    log(error.message || `Không thể kiểm tra ${name}.`);
  } finally {
    button.disabled = false;
  }
}

async function inspectMiniGameReactState(button, output, copyButton, panelTitle, gameName) {
  button.disabled = true;
  try {
    const [{ result }] = await executeOnSunflowerTabs({
      world: 'MAIN',
      func: (panelTitle, gameName) => {
        const hash = (value) => {
          let output = 2166136261;
          for (let index = 0; index < value.length; index += 1) output = Math.imul(output ^ value.charCodeAt(index), 16777619);
          return (output >>> 0).toString(16).padStart(8, '0');
        };
        const clean = (value, depth = 0, seen = new WeakSet()) => {
          if (value == null || typeof value === 'number' || typeof value === 'boolean') return value;
          if (typeof value === 'string') return value.startsWith('data:image/') ? `[image ${value.slice(0, 24)}… length=${value.length} hash=${hash(value)}]` : value.slice(0, 500);
          if (typeof value === 'function') return `[function ${value.name || 'anonymous'}]`;
          if (value instanceof Node) return `[DOM ${value.nodeName}]`;
          if (depth >= 3 || typeof value !== 'object') return `[${typeof value}]`;
          if (seen.has(value)) return '[circular]';
          seen.add(value);
          if (Array.isArray(value)) return value.slice(0, 20).map((item) => clean(item, depth + 1, seen));
          const result = {};
          Object.keys(value).slice(0, 35).forEach((key) => {
            if (!key.startsWith('_debug')) result[key] = clean(value[key], depth + 1, seen);
          });
          return result;
        };
        const reactData = (element) => {
          const inspected = [];
          for (let node = element, depth = 0; node && depth < 12; node = node.parentElement, depth += 1) {
            const keys = Object.getOwnPropertyNames(node);
            const reactKeys = keys.filter((key) => /react|fiber|preact/i.test(key));
            const propsKey = keys.find((key) => key.startsWith('__reactProps$'));
            const fiberKey = keys.find((key) => key.startsWith('__reactFiber$')) || keys.find((key) => key.startsWith('__reactInternalInstance$')) || keys.find((key) => key.startsWith('__reactContainer$'));
            if (reactKeys.length) inspected.push({ depth, node: node.nodeName, keys: reactKeys });
            if (propsKey || fiberKey) {
              const fiber = fiberKey ? node[fiberKey] : null;
              return clean({
                foundAt: { depth, node: node.nodeName, propsKey: propsKey || null, fiberKey: fiberKey || null },
                props: propsKey ? node[propsKey] : null,
                fiber: fiber ? {
                  type: typeof fiber.type === 'string' ? fiber.type : fiber.type?.name || fiber.elementType?.name || null,
                  memoizedProps: fiber.memoizedProps,
                  pendingProps: fiber.pendingProps,
                  memoizedState: fiber.memoizedState
                } : null,
                inspected
              });
            }
          }
          return { foundAt: null, inspected };
        };
        const panel = Array.from(document.querySelectorAll('[data-headlessui-state="open"]')).find((element) => element.offsetParent !== null && element.innerText.includes(panelTitle));
        if (!panel) return { error: `Mini game ${gameName} chưa mở.` };
        const grid = Array.from(panel.querySelectorAll('div.flex.flex-wrap.justify-center.items-center')).find((element) => Array.from(element.children).filter((child) => child.classList.contains('cursor-pointer')).length >= 12);
        if (!grid) return { error: `Không tìm thấy lưới 16 ô ${gameName}.` };
        const slots = Array.from(grid.children).filter((child) => child.classList.contains('cursor-pointer'));
        return {
          reactDevToolsHook: Boolean(globalThis.__REACT_DEVTOOLS_GLOBAL_HOOK__),
          slots: slots.map((slot, index) => {
            const image = slot.querySelector('img');
            const source = image?.currentSrc || image?.src || '';
            return {
              index: index + 1,
              image: { width: image?.naturalWidth || 0, height: image?.naturalHeight || 0, sourceHash: source ? hash(source) : '', sourceLength: source.length },
              slotReact: reactData(slot),
              imageReact: image ? reactData(image) : null
            };
          })
        };
      },
      args: [panelTitle, gameName]
    });
    if (result.error) throw new Error(result.error);
    output.value = JSON.stringify(result, null, 2);
    copyButton.disabled = false;
    log(`Đã trích xuất React props/Fiber của ${result.slots.length} ô ${gameName}. Hãy copy dữ liệu gửi lại.`);
  } catch (error) {
    output.value = '';
    copyButton.disabled = true;
    log(error.message || `Không thể đọc React props của ${gameName}.`);
  } finally {
    button.disabled = false;
  }
}

function inspectGoblinReactState() {
  return inspectMiniGameReactState(inspectGoblinsButton, goblinReactOutput, copyGoblinReactButton, 'Stop the Goblins!', 'Goblins');
}

function inspectMoonSeekersReactState() {
  return inspectMiniGameReactState(inspectMoonSeekersButton, moonSeekersReactOutput, copyMoonSeekersReactButton, 'Stop the Moon Seekers!', 'Moon Seekers');
}

async function clickOneNpcMiniGame(button, panelTitle, assetName, displayName) {
  button.disabled = true;
  try {
    const [{ result }] = await executeOnSunflowerTabs({
      world: 'MAIN',
      func: (panelTitle, assetName, displayName) => {
        const panel = Array.from(document.querySelectorAll('[data-headlessui-state="open"]')).find((element) => element.offsetParent !== null && element.innerText.includes(panelTitle));
        if (!panel) return { error: `Mini game ${displayName} chưa mở.` };
        const images = Array.from(panel.querySelectorAll('img'));
        const targets = images.filter((image) => {
          const propsKey = Object.getOwnPropertyNames(image).find((key) => key.startsWith('__reactProps$'));
          const reactSource = propsKey ? image[propsKey]?.src : '';
          const source = reactSource || image.currentSrc || image.src || '';
          return new RegExp(`/game-assets/npcs/[^/]*${assetName}`, 'i').test(source);
        });
        const npc = targets[0];
        if (!npc) return { error: `Không tìm thấy ${displayName} trong 16 ô.` };
        const target = npc.closest('.cursor-pointer') || npc.parentElement || npc;
        const rect = npc.getBoundingClientRect();
        const options = { bubbles: true, cancelable: true, view: window, clientX: rect.left + rect.width / 2, clientY: rect.top + rect.height / 2, button: 0, buttons: 1 };
        ['pointerdown', 'pointerup'].forEach((type) => target.dispatchEvent(typeof PointerEvent === 'function' ? new PointerEvent(type, { ...options, pointerId: 1, pointerType: 'mouse', isPrimary: true }) : new MouseEvent(type, options)));
        target.click();
        const propsKey = Object.getOwnPropertyNames(npc).find((key) => key.startsWith('__reactProps$'));
        const source = propsKey ? npc[propsKey]?.src : npc.currentSrc || npc.src || '';
        return {
          clicked: true,
          detected: targets.length,
          name: source.split('/').pop()?.replace(/\.[a-z0-9]+.*$/i, '') || displayName,
          position: images.indexOf(npc) + 1
        };
      },
      args: [panelTitle, assetName, displayName]
    });
    if (result.error) throw new Error(result.error);
    log(`Nhận diện ${result.detected} ${displayName}; đã click ${result.name} (vị trí ảnh ${result.position}) để test.`);
  } catch (error) {
    log(error.message || `Không thể click ${displayName}.`);
  } finally {
    button.disabled = false;
  }
}

function clickOneGoblin() {
  return clickOneNpcMiniGame(testGoblinsButton, 'Stop the Goblins!', 'goblin', 'Goblin');
}

function clickOneSkeleton() {
  return clickOneNpcMiniGame(testMoonSeekersButton, 'Stop the Moon Seekers!', 'skeleton', 'Skeleton');
}

function waitForTabComplete(tabId, timeout = 15000) {
  return new Promise((resolve) => {
    const finish = () => {
      clearTimeout(timer);
      chrome.tabs.onUpdated.removeListener(listener);
      resolve();
    };
    const listener = (updatedTabId, changeInfo) => {
      if (updatedTabId === tabId && changeInfo.status === 'complete') finish();
    };
    const timer = setTimeout(finish, timeout);
    chrome.tabs.onUpdated.addListener(listener);
  });
}

connectButton.addEventListener('click', async () => {
  try {
    let tab = await findSunflowerTab();
    if (!tab?.id) {
      tab = await chrome.tabs.create({ url: 'https://sunflower-land.com/play/', active: false });
      if (!tab.id) throw new Error('Không thể mở tab Sunflower Land.');
      await chrome.storage.session.set({ sunflowerTabId: tab.id });
      log('Đã mở tab Sunflower Land, đang chờ game tải…');
      await waitForTabComplete(tab.id);
    }
    await refreshConnection();
    if (connectButton.disabled) {
      log('Đã kết nối với tab Sunflower Land.');
      await scanMap();
    } else log('Sunflower Land chưa tải xong. Hãy bấm Kết nối lại sau vài giây.');
  } catch (error) {
    log(error.message || 'Không thể kết nối Sunflower Land.');
  }
});
async function openBagInTab(tabId) {
  const [{ result }] = await chrome.scripting.executeScript({
    target: { tabId },
    func: () => {
      if (document.querySelector('input[placeholder="Search here..."]')) return true;
      const basket = Array.from(document.querySelectorAll('img[src*="/game-assets/icons/basket.png"]')).find((image) => image.closest('div.relative.flex.mb-2.cursor-pointer'));
      const button = basket?.closest('div.relative.flex.mb-2.cursor-pointer');
      if (!button) return false;
      button.click();
      return true;
    }
  });
  return result;
}

scanFertilisersButton.addEventListener('click', async () => {
  const finishLog = startActionLog('Đang quét túi đồ…');
  try {
    const tab = await findSunflowerTab();
    if (!tab?.id) throw new Error('Không tìm thấy tab Sunflower Land đang mở.');
    scanFertilisersButton.disabled = true;
    scanFertilisersButton.classList.add('is-scanning');
    if (!await openBagInTab(tab.id)) throw new Error('Không tìm thấy nút túi đồ.');
    await new Promise((resolve) => setTimeout(resolve, 500));
    const [{ result }] = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: async () => {
        const sleep = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));
        const parseCount = (value) => {
          const text = value.trim().toLowerCase().replace(/,/g, '');
          const number = Number.parseFloat(text);
          return Number.isFinite(number) ? Math.round(number * (text.includes('k') ? 1000 : 1)) : 0;
        };
        const revealExactCounts = (element) => {
          ['mouseover', 'mousemove', 'mouseenter'].forEach((type) => element?.dispatchEvent(new MouseEvent(type, { bubbles: true, view: window })));
        };
        const collectSection = async (name) => {
          const header = Array.from(document.querySelectorAll('div')).find((element) => element.textContent.trim() === name);
          const section = header?.parentElement;
          revealExactCounts(header);
          revealExactCounts(section);
          await sleep(100);
          const slots = Array.from(section?.querySelectorAll('.bg-brown-600') || []).filter((slot) => slot.querySelector('img[alt="item"]'));
          const items = [];
          for (const slot of slots) {
            const image = slot.querySelector('img[alt="item"]');
            const icon = image?.currentSrc || image?.src || '';
            if (!icon) continue;
            slot.click();
            await sleep(55);
            const detail = Array.from(document.querySelectorAll('div.flex.flex-col.justify-between.h-full')).find((element) => Array.from(element.querySelectorAll('img[alt="item"]')).some((itemImage) => (itemImage.currentSrc || itemImage.src || '') === icon));
            const name = Array.from(detail?.querySelectorAll('span.sm\\:text-center') || []).map((element) => element.textContent.trim()).find(Boolean) || '';
            const count = parseCount(slot.parentElement?.innerText || slot.parentElement?.textContent || slot.textContent);
            if (!items.some((item) => item.icon === icon)) items.push({ icon, name, count });
          }
          return items;
        };
        const fertilisers = await collectSection('Fertilisers');
        const search = document.querySelector('input[placeholder="Search here..."]');
        const bagRoot = search?.closest('div.relative.max-h-\\[90vh\\]') || search?.parentElement?.parentElement?.parentElement;
        const closeButton = bagRoot?.querySelector('img[src*="/game-assets/icons/close.png"]') || Array.from(document.querySelectorAll('img[src*="/game-assets/icons/close.png"]')).find((image) => image.closest('div.relative.max-h-\\[90vh\\]'));
        closeButton?.click();
        return { fertilisers, closed: Boolean(closeButton) };
      }
    });
    // Chỉ sau một lượt quét mới khẳng định loại không xuất hiện trong túi là 0.
    [...cropFertiliserIcons, ...fruitFertiliserIcons].forEach((icon) => fertiliserCounts.set(icon, 0));
    result.fertilisers.forEach((item) => fertiliserCounts.set(item.icon, Math.max(0, Number(item.count) || 0)));
    if (lastScanData) {
      renderCropScan(lastScanData);
      renderTreeScan(lastScanData.trees);
      renderMiningScan(lastScanData.mining);
      renderFruitScan(lastScanData.fruit);
    }
  } catch (error) {
    logActionError(error.message || 'Không thể quét phân bón.');
  } finally {
    finishLog();
    scanFertilisersButton.disabled = false;
    scanFertilisersButton.classList.remove('is-scanning');
  }
});
reloadExtensionButton.addEventListener('click', async () => {
  reloadExtensionButton.disabled = true;
  reloadExtensionButton.title = 'Đang cập nhật panel…';
  window.location.reload();
});
log('Sẵn sàng.');
void initialisePanelConnection();
