/* Normalized seed inventory shared by Crop, Fruit and Betty views. */

function setCurrentCoins(value) {
  currentCoins = Math.max(0, Number(value) || 0);
  return currentCoins;
}

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
  lastBettyScan?.items?.forEach((item) => { if (seedInventoryKey(item) === key) item.owned = value; });
  if (selectedPlantSeed && seedInventoryKey(selectedPlantSeed) === key) selectedPlantSeed.count = value;
  if (selectedFruitSeed && seedInventoryKey(selectedFruitSeed) === key) selectedFruitSeed.count = value;
  if (lastScanData?.heldSeed && seedInventoryKey(lastScanData.heldSeed) === key) lastScanData.heldSeed.count = value;
  if (lastScanData?.heldFruitSeed && seedInventoryKey(lastScanData.heldFruitSeed) === key) lastScanData.heldFruitSeed.count = value;
  return value;
}

function syncSeedInventory(items = []) {
  items.forEach((item) => setSeedCount(item, item.owned));
}
