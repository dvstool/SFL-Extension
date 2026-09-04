/* Composter state transitions after Collect and Compost actions. */

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
