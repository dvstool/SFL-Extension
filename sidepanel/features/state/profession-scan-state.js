/* Merge a scoped map scan into the cached overview state. */

function clearScopedCountdownTargets(value) {
  if (!value || typeof value !== 'object') return;
  if (Array.isArray(value)) {
    value.forEach(clearScopedCountdownTargets);
    return;
  }
  if (Array.isArray(value.mapKeys) && value.mapKeys.length) countdownTargets.delete(value.mapKeys.join('||'));
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
    professionData.pets.awake = scannedAwake.map((item) => {
      const previous = previousByKey.get((item.mapKeys || [])[0]);
      const checks = petSleepCheckInProgress ? Number(previous?.petCheckCount || 0) + 1 : Number(previous?.petCheckCount || 0);
      const delay = checks >= 3 ? 15 : 30;
      return { ...item, petCheckCount: checks, nextPetCheckAt: petSleepCheckInProgress ? Date.now() + delay * 60 * 1000 : previous?.nextPetCheckAt || Date.now() + 30 * 60 * 1000 };
    });
  }
  clearScopedCountdownTargets(professionData);
  lastScanData = { ...(lastScanData || {}), ...professionData };
  renderOverview();
  startCountdowns();
  return true;
}
