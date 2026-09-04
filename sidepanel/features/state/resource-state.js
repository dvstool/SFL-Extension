/* Local state transitions for crop, mining, salt and fruit actions. */

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
      const fertiliserType = Number(item.fertiliserType || 0);
      const remaining = Math.max(0, Number(item.count || 0) - (plantedCounts.get(fertiliserType) || 0));
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
    else { card.dataset.count = String(remaining); card.querySelector('.crop-quantity').textContent = `×${remaining}`; }
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
    if (!cropPanel) { cropGrowingResults.innerHTML = '<section class="crop-panel" data-crop-panel="growing"><h2>Đang hồi</h2></section>'; cropPanel = cropGrowingResults.querySelector('[data-crop-panel="growing"]'); }
    const group = document.createElement('div');
    group.className = 'activity-group';
    group.dataset.activity = 'crop';
    group.innerHTML = '<h3>Crop</h3>';
    group.append(growingSection);
    cropPanel.append(group);
  }
  const grid = growingSection.querySelector('.crop-grid');
  result.growing.forEach((item) => grid.insertAdjacentHTML('beforeend', cropCard(item, 'growing')));
  startCountdowns();
}

function refreshAffectedSection(card, sections = []) {
  if (!lastScanData) return;
  const keys = new Set(String(card?.dataset?.mapKeys || '').split('||').filter(Boolean));
  if (!keys.size) return;
  const prune = (items = []) => items.map((item) => {
    const mapKeys = (item.mapKeys || []).filter((key) => !keys.has(key));
    return { ...item, mapKeys, count: mapKeys.length };
  }).filter((item) => item.mapKeys.length);
  if (sections.includes('crop')) ['ready', 'growing', 'empty'].forEach((state) => { lastScanData[state] = prune(lastScanData[state]); });
  if (sections.includes('fruit') && lastScanData.fruit) ['ready', 'growing', 'empty', 'dead'].forEach((state) => { lastScanData.fruit[state] = prune(lastScanData.fruit[state]); });
  if (sections.includes('tree') && lastScanData.trees) ['ready', 'growing'].forEach((state) => { lastScanData.trees[state] = prune(lastScanData.trees[state]); });
  if (sections.includes('mining') && lastScanData.mining) ['ready', 'growing'].forEach((state) => { lastScanData.mining[state] = prune(lastScanData.mining[state]); });
  if (sections.includes('composter') && lastScanData.composters) {
    ['ready', 'empty', 'growing'].forEach((state) => { lastScanData.composters[state] = prune(lastScanData.composters[state]); });
    keys.forEach((key) => composterDetails.delete(key));
  }
  if (sections.includes('salt') && lastScanData.salt) ['ready', 'growing', 'upgrade'].forEach((state) => { lastScanData.salt[state] = prune(lastScanData.salt[state]); });
  if (sections.includes('pet') && lastScanData.pets) lastScanData.pets.sleeping = prune(lastScanData.pets.sleeping);
  if (sections.includes('mushroom') && lastScanData.mushrooms) Object.values(lastScanData.mushrooms).forEach((item) => { if (item) { item.mapKeys = (item.mapKeys || []).filter((key) => !keys.has(key)); item.count = item.mapKeys.length; } });
  renderOverview();
  startCountdowns();
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
  lastScanData.composters = { ready: Array.from(groups.ready.values()), empty: Array.from(groups.empty.values()), growing: Array.from(groups.growing.values()) };
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
    if (group) { group.count += 1; group.mapKeys.push(state.mapKey); } else target.push(candidate);
  });
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
    if (existing) { existing.count += candidate.count; existing.mapKeys.push(...candidate.mapKeys); } else items.push(candidate);
  };
  lastScanData.salt.ready = (lastScanData.salt.ready || []).flatMap((item) => {
    const movedKeys = (item.mapKeys || []).filter((key) => harvested.has(key));
    const remainingKeys = (item.mapKeys || []).filter((key) => !harvested.has(key));
    if (movedKeys.length) {
      const remainingHits = Math.max(0, Number(item.hits || 1) - Math.max(1, Number(hitsTaken) || 1));
      const nextState = { ...item, hits: remainingHits, count: movedKeys.length, mapKeys: movedKeys, seconds: null, countdownTarget: null };
      if (remainingHits) append(nextReady, nextState); else append(movedToGrowing, nextState);
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
