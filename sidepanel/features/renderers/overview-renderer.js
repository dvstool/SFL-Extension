/* Overview rendering and card transition effects. */

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
    ...cropEmpty.map((item) => cropCard({ ...item, label: 'Đất Crop trống', canPlant: Boolean(cropSeed), seedName: cropSeed?.name || '', seedIcon: cropSeed?.icon || '', seedCount: getSeedCount(cropSeed) }, 'empty')),
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
  const treeCards = readyTrees.map((item) => treeCard(item, 'ready'));
  const treeGrowingCards = growingTrees.map((item) => treeCard(item, 'growing'));
  const miningOrder = { stone: 0, iron: 1, gold: 2 };
  const sortMining = (items) => [...items].sort((left, right) => (miningOrder[left.resource] ?? 99) - (miningOrder[right.resource] ?? 99));
  const readyMining = sortMining(data.mining?.ready || []);
  const growingMining = sortMining(data.mining?.growing || []);
  const miningCards = readyMining.map((item) => miningCard(item, 'ready'));
  const miningGrowingCards = growingMining.map((item) => miningCard(item, 'growing'));
  const saltReady = data.salt?.ready || [];
  const saltGrowing = data.salt?.growing || [];
  const saltUpgrade = data.salt?.upgrade || [];
  const saltGrowingCards = saltGrowing.map((item) => saltCard(item, true));
  const saltCards = saltReady.length || saltGrowing.length || saltUpgrade.length
    ? (saltReady.length
      ? [...saltReady.map((item) => saltCard(item)), ...saltGrowingCards, ...saltUpgrade.map((item) => saltUpgradeCard(item))]
      : [...saltUpgrade.map((item) => saltUpgradeCard(item)), ...saltGrowingCards])
    : [];
  const mushroomCards = (data.mushrooms?.wild?.count || data.mushrooms?.magic?.count) ? [mushroomCard(data.mushrooms)] : [];
  const sleepingPetCards = (data.pets?.sleeping || []).map((item) => petCard(item, 'sleeping'));
  const awakePetCards = (data.pets?.awake || []).map((item) => petCard(item, 'awake'));
  const mapCards = (() => {
    const detail = landInfo?.querySelector('.land-details');
    const balances = Array.from(landInfo?.querySelectorAll('.land-balance') || []);
    const landName = Array.from(detail?.querySelector('strong')?.childNodes || [])
      .filter((node) => node.nodeType === Node.TEXT_NODE)
      .map((node) => node.textContent.trim())
      .join(' ') || '';
    const landIcon = detail?.querySelector('.land-thumbnail')?.currentSrc || detail?.querySelector('.land-thumbnail')?.src || '';
    const season = detail?.querySelector('span')?.textContent.trim() || '';
    const cards = [];
    if (landName) {
      cards.push(`<article class="crop-card map-overview-card map-land-card" data-resource="map-land"><div class="crop-icon-box">${landIcon ? `<img class="crop-image" src="${escapeHtml(landIcon)}" alt="" />` : '<span class="map-card-fallback">⌂</span>'}</div><div class="crop-card-content"><span class="crop-card-state">Land</span><strong class="crop-card-title">${escapeHtml(landName)}</strong>${season ? `<span class="crop-card-meta">${escapeHtml(season)}</span>` : ''}</div></article>`);
    }
    balances.forEach((balance, index) => {
      const rawLabel = balance.querySelector('img')?.alt || 'Số dư';
      const label = ({ coins: 'COINS', gems: 'GEMS', flw: 'FLOWER', flower: 'FLOWER' })[rawLabel.trim().toLowerCase()] || rawLabel.toUpperCase();
      const icon = balance.querySelector('img')?.currentSrc || balance.querySelector('img')?.src || '';
      const value = balance.querySelector('b')?.textContent.trim() || balance.textContent.trim();
      if (!value) return;
      cards.push(`<article class="crop-card map-overview-card map-${escapeHtml(label.toLowerCase())}-card" data-resource="map-balance-${index}"><div class="crop-icon-box">${icon ? `<img class="crop-image" src="${escapeHtml(icon)}" alt="" />` : '<span class="map-card-fallback">●</span>'}</div><div class="crop-card-content"><span class="crop-card-state">${escapeHtml(label)}</span><strong class="crop-card-title">${escapeHtml(value)}</strong></div></article>`);
    });
    return cards;
  })();
  const reloadIcon = 'https://assets-v2.lottiefiles.com/a/2e38d784-116e-11ee-95a0-ff83a71694af/KTpQk2gMhQ.gif';
  const reloadStaticIcon = 'https://cdn-icons-png.flaticon.com/512/159/159061.png';
  const reloadButton = (name, scanScope) => {
    const buttonLabel = `Reload ${name}`;
    const icon = `<span class="profession-reload-icon" aria-hidden="true"><img class="profession-reload-icon-static" src="${reloadStaticIcon}" alt="" /><img class="profession-reload-icon-loading" src="${reloadIcon}" alt="" /></span><span>${name}</span>`;
    return scanScope === 'fertilisers'
      ? `<button class="profession-scan" type="button" data-ui-action="scan-fertilisers" title="Quét túi đồ để đọc Fertilisers" aria-label="Quét Fertilisers">${icon}</button>`
      : scanScope === 'map'
      ? `<button class="profession-scan" type="button" data-ui-action="scan-map-header" title="Reload Map" aria-label="Reload Map">${icon}</button>`
      : scanScope === 'tools'
      ? `<button class="profession-scan" type="button" data-ui-action="scan-tools-header" title="Quét Tools" aria-label="Quét Tools">${icon}</button>`
      : scanScope === 'composter'
      ? `<button class="profession-scan" type="button" data-ui-action="scan-composter" title="${buttonLabel}" aria-label="${buttonLabel}">${icon}</button>`
      : `<button class="profession-scan" type="button" data-ui-action="scan-profession" data-scan-scope="${scanScope}" title="${buttonLabel}" aria-label="${buttonLabel}">${icon}</button>`;
  };
  const section = (name, cards, growingCards = [], scanScope = '', headerScopes = [scanScope]) => {
    const header = headerScopes.map((scope) => reloadButton(scope === 'fertilisers' ? 'Fertilisers' : scope === 'tools' ? 'Tools' : name, scope)).join('');
    return `<section class="overview-section"><h2 class="overview-section-controls">${header}</h2><div class="crop-grid">${cards.join('')}</div>${growingCards.length ? `<div class="crop-grid overview-growing-grid">${growingCards.join('')}</div>` : ''}</section>`;
  };
  overviewResults.innerHTML = `<div class="activity-group" data-activity="overview">${section('Map', mapCards, [], 'map')}${mushroomCards.length ? section('Foraging', mushroomCards, [], 'mushroom') : ''}${sleepingPetCards.length || awakePetCards.length ? section('Pet', sleepingPetCards, awakePetCards, 'pet') : ''}${section('Crop', cropCards, cropGrowingCards, 'crop', ['crop', 'fertilisers'])}${hasFruit ? section('Fruit', fruitCards, fruitGrowingCards, 'fruit', ['fruit', 'fertilisers']) : ''}${hasComposters ? section('Composter', composterCards, composterGrowingCards, 'composter') : ''}${section('Tree', treeCards, treeGrowingCards, 'tree', ['tree', 'tools'])}${section('Mining', miningCards, miningGrowingCards, 'mining', ['mining', 'tools'])}${saltCards.length ? section('Salt', saltCards, [], 'salt', ['salt', 'tools']) : ''}</div>`;
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

