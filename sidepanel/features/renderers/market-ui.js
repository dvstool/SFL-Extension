/* Betty Market and seed-picker presentation. */

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
    const growth = item.growthTime || 'Chưa rõ';
    const growthIcon = item.growthIcon || 'https://sunflower-land.com/game-assets/icons/lightning.png';
    return `<article class="seed-picker-card" data-seed-picker-choice="true" data-seed-kind="${kind}" data-shop-seed-name="${escapeHtml(item.name)}" data-shop-slot-index="${escapeHtml(item.slotIndex)}"><img class="seed-picker-icon" src="${escapeHtml(item.icon)}" alt="" /><div class="seed-picker-content"><strong>${escapeHtml(name)}</strong><span>Đang có: ×${escapeHtml(getSeedCount(item))}</span><span class="seed-growth"><img src="${escapeHtml(growthIcon)}" alt="Thời gian lớn" />${escapeHtml(growth)}</span></div><span class="seed-picker-overlay">Chọn</span></article>`;
  }).join('');
}

function groupBettyCards(container) {
  const groups = [['crop', 'Crop'], ['fruit', 'Fruit'], ['flower', 'Flower'], ['greenhouse', 'Greenhouse']];
  const cards = Array.from(container.querySelectorAll('.shop-card'));
  const sections = groups.map(([key, label]) => {
    const matches = cards.filter((card) => card.dataset.shopCategory === key);
    if (!matches.length) return null;
    const section = document.createElement('section');
    section.className = 'shop-category-section';
    section.dataset.shopCategory = key;
    section.innerHTML = `<h2>${label}</h2><div class="shop-category-grid"></div>`;
    matches.forEach((card) => section.querySelector('.shop-category-grid').append(card));
    return section;
  }).filter(Boolean);
  container.replaceChildren(...sections);
}

function renderBettyShop(scan) {
  lastBettyScan = scan;
  if (scan.season) marketSeasonInfo = { season: scan.season, icon: scan.seasonIcon, ends: scan.seasonEnds };
  cropTiers.clear();
  scan.items.forEach((item) => {
    const tier = /basic\s+crop/i.test(item.category) ? 'I' : /medium\s+crop/i.test(item.category) ? 'II' : /advanced\s+crop/i.test(item.category) ? 'III' : '';
    if (tier) cropTiers.set(item.name.replace(/\s+seed$/i, '').toLowerCase(), tier);
  });
  if (lastScanData) { renderCropScan(lastScanData); renderTreeScan(lastScanData.trees); renderMiningScan(lastScanData.mining); renderFruitScan(lastScanData.fruit); }
  if (!scan.items.length) { shopResults.innerHTML = '<div class="empty-state">Không tìm thấy hạt giống trong Betty’s Market.</div>'; renderSeedPicker(); return; }
  shopResults.innerHTML = scan.items.map((item) => {
    const name = item.name;
    const category = seedShopCategory(item);
    const tier = /basic\s+crop/i.test(item.category) ? 'I' : /medium\s+crop/i.test(item.category) ? 'II' : /advanced\s+crop/i.test(item.category) ? 'III' : '';
    const options = item.buyOptions.length >= 3 || item.buyOptions.some((option) => /^Buy all$/i.test(option)) ? item.buyOptions : [...item.buyOptions, 'Buy all'];
    const requirements = item.requirements.map((requirement) => /^\s*[\d,.]+\s*$/.test(requirement) ? 'Không đủ coin' : requirement);
    const visibleRequirements = requirements.filter((requirement) => requirement !== 'Không đủ coin');
    const basketFull = requirements.some((requirement) => /you have too many seeds in your basket/i.test(requirement));
    const locked = visibleRequirements.some((requirement) => !/you have too many seeds in your basket/i.test(requirement));
    const available = item.stock > 0 && options.length > 0 && !basketFull && !locked;
    const price = Number(String(item.price || '').replace(/,/g, ''));
    const actions = available ? `<div class="shop-buy-actions">${options.map((option) => {
      const amount = /^Buy all$/i.test(option) ? Number(item.stock) || 0 : Number((String(option).match(/\d[\d,.]*/) || ['0'])[0].replace(/,/g, ''));
      const cost = price * amount;
      const insufficient = Number.isFinite(currentCoins) && Number.isFinite(price) && currentCoins + 1e-9 < cost;
      return `<span class="buy-action"><button type="button" data-shop-buy="${escapeHtml(option)}"${insufficient ? ' class="is-insufficient" disabled' : ''}>${escapeHtml(option)}</button><span class="buy-tooltip${insufficient ? ' is-missing' : ''}"><b>${escapeHtml(`${Number.isFinite(currentCoins) ? currentCoins.toLocaleString('en-US') : '—'}/${Number.isFinite(cost) ? cost.toLocaleString('en-US') : '—'}`)} 🪙</b></span></span>`;
    }).join('')}</div>` : '';
    const reason = visibleRequirements.length ? `<p class="shop-requirements">${escapeHtml(visibleRequirements.join('\n').replace(/You have too many seeds in your basket!/gi, 'Túi đã đầy'))}</p>` : item.stock === 0 ? '<p class="shop-requirements">Sold out</p>' : '';
    const state = locked ? 'is-unavailable is-level-locked' : basketFull ? 'is-unavailable is-basket-full' : item.stock === 0 ? 'is-unavailable is-sold-out' : '';
    const growth = item.growthTime || 'Chưa rõ';
    const growthIcon = item.growthIcon || 'https://sunflower-land.com/game-assets/icons/lightning.png';
    return `<article class="shop-card ${state} is-seed-choice" data-shop-category="${category}" data-shop-seed-name="${escapeHtml(name)}" data-shop-slot-index="${escapeHtml(item.slotIndex)}">${tier ? `<b class="shop-tier">${tier}</b>` : ''}<div class="shop-icon-box"><img class="shop-item-icon" src="${escapeHtml(item.icon)}" alt="" /><b class="crop-quantity">×${escapeHtml(getSeedCount(item))}</b></div><div class="shop-card-content"><strong>${escapeHtml(name.replace(/\s+seed$/i, ''))}</strong><div class="shop-card-meta"><span>${escapeHtml(`${item.stock} in stock`)}</span><span class="seed-growth"><img src="${escapeHtml(growthIcon)}" alt="Thời gian lớn" />${escapeHtml(growth)}</span></div>${reason}</div>${actions}<span class="shop-select-overlay">Chọn</span></article>`;
  }).join('');
  groupBettyCards(shopResults);
  renderSeedPicker();
  updateBettyActivityFilter(mapActivityTabs.find((tab) => tab.classList.contains('is-active'))?.dataset.mapActivityTab || 'overview');
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
