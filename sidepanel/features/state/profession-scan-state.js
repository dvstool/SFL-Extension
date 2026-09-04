/* Merge a scoped map scan into the cached overview state. */

function timedScanEntries(value, path = []) {
  if (!value || typeof value !== 'object') return [];
  if (Array.isArray(value)) {
    return value.flatMap((item) => Array.isArray(item?.mapKeys) ? [{ state: path.join('.'), item }] : []);
  }
  return Object.entries(value).flatMap(([key, child]) => timedScanEntries(child, [...path, key]));
}

// The map often reports coarse values such as "1h 2m" while the panel is
// accurately counting down "1h 2m 37s". Keep that existing countdown unless
// the scan represents a genuine change, rather than rounding it back to :00.
function preserveScanCountdowns(nextData, previousData = lastScanData) {
  if (!nextData || !previousData) return;
  const now = Date.now();
  const previousByStateAndKey = new Map();
  timedScanEntries(previousData).forEach(({ state, item }) => {
    (item.mapKeys || []).forEach((mapKey) => previousByStateAndKey.set(`${state}|${mapKey}`, item));
  });
  timedScanEntries(nextData).forEach(({ state, item }) => {
    const scannedSeconds = Number(item.seconds);
    if (!Number.isFinite(scannedSeconds) || scannedSeconds <= 0) return;
    const previous = (item.mapKeys || []).map((mapKey) => previousByStateAndKey.get(`${state}|${mapKey}`)).find(Boolean);
    if (!previous) return;
    const stateChanged = ['label', 'resource', 'stage', 'fertiliserType'].some((field) => previous[field] != null || item[field] != null
      ? String(previous[field] ?? '') !== String(item[field] ?? '')
      : false);
    if (stateChanged) return;
    const target = Number(previous.countdownTarget) || Number(countdownTargets.get((previous.mapKeys || []).join('||')));
    if (!Number.isFinite(target) || target <= now) return;
    const remainingSeconds = (target - now) / 1000;
    // Values containing seconds (e.g. 3m 12s) are precise enough for a 2s
    // threshold. Hour/minute-only values are rounded by the game, so use 1m.
    const threshold = item.hasPreciseSeconds ? 2 : 60;
    if (Math.abs(scannedSeconds - remainingSeconds) < threshold) item.countdownTarget = target;
  });
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
    professionData.pets.awake = scannedAwake.map((item) => {
      const previous = previousByKey.get((item.mapKeys || [])[0]);
      const checks = petSleepCheckInProgress ? Number(previous?.petCheckCount || 0) + 1 : Number(previous?.petCheckCount || 0);
      const delay = checks >= 3 ? 15 : 30;
      return { ...item, petCheckCount: checks, nextPetCheckAt: petSleepCheckInProgress ? Date.now() + delay * 60 * 1000 : previous?.nextPetCheckAt || Date.now() + 30 * 60 * 1000 };
    });
  }
  preserveScanCountdowns(professionData);
  lastScanData = { ...(lastScanData || {}), ...professionData };
  renderOverview();
  startCountdowns();
  return true;
}
