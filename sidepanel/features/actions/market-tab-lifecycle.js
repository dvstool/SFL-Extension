/* Keep Betty and Workbench dialogs in the game aligned with their panel tabs. */

let activeGameBuilding = '';

const buildingConfig = {
  market: {
    name: 'Betty’s Market',
    pattern: /\/game-assets\/(?:[^/]+\/)*buildings\/(?:[^/]+\/)*(?:bettys_)?market\.(?:webp|png)(?:[?#]|$)/i,
    scanButton: scanBettyButton,
    hasScan: () => Boolean(lastBettyScan)
  },
  workbench: {
    name: 'Workbench',
    pattern: /\/game-assets\/(?:[^/]+\/)*buildings\/(?:[^/]+\/)*workbench\.(?:webp|png)(?:[?#]|$)/i,
    scanButton: scanToolsButton,
    hasScan: () => Boolean(lastToolsScan)
  }
};

async function openGameBuilding(activity) {
  const config = buildingConfig[activity];
  if (!config) return false;
  const [{ result }] = await executeOnSunflowerTabs({
    func: async (patternSource) => {
      const pattern = new RegExp(patternSource, 'i');
      const image = Array.from(document.querySelectorAll('img')).find((item) => pattern.test(item.currentSrc || item.src || ''));
      const target = image?.closest('.cursor-pointer') || image?.parentElement;
      if (!target) return false;
      target.click();
      return true;
    },
    args: [config.pattern.source]
  });
  return Boolean(result);
}

async function closeGameBuilding(activity) {
  const config = buildingConfig[activity];
  if (!config) return;
  await executeOnSunflowerTabs({
    func: (patternSource) => {
      const pattern = new RegExp(patternSource, 'i');
      const image = Array.from(document.querySelectorAll('img')).find((item) => pattern.test(item.currentSrc || item.src || ''));
      const building = image?.closest('.cursor-pointer') || image?.parentElement;
      const dialogs = Array.from(document.querySelectorAll('div.relative.max-h-\\[90vh\\]'));
      const dialog = dialogs.find((item) => item.querySelector('#SeasonSeeds') || /\b(?:Land|Water|Animal) Tools\b/i.test(item.innerText || ''));
      if (!building || !dialog) return false;
      dialog.querySelector('img[src*="/game-assets/icons/close.png"]')?.click();
      return true;
    },
    args: [config.pattern.source]
  });
}

async function waitForScan(button) {
  const deadline = Date.now() + 12000;
  while (button.disabled && Date.now() < deadline) await new Promise((resolve) => setTimeout(resolve, 60));
}

async function syncGameBuildingActivity(activity, previousActivity = '') {
  const leaving = previousActivity === 'market' || previousActivity === 'workbench' ? previousActivity : '';
  const entering = activity === 'market' || activity === 'workbench' ? activity : '';
  if (leaving && leaving !== entering) await closeGameBuilding(leaving);
  activeGameBuilding = entering;
  if (!entering) return;
  const config = buildingConfig[entering];
  if (!config.hasScan()) {
    config.scanButton.click();
    await new Promise((resolve) => setTimeout(resolve, 30));
    await waitForScan(config.scanButton);
  }
  if (activeGameBuilding === entering) await openGameBuilding(entering);
}

async function highlightGameBuilding(activity) {
  const config = buildingConfig[activity];
  if (!config) return;
  try {
    const [{ result }] = await executeOnSunflowerTabs({
      func: (patternSource) => {
        const pattern = new RegExp(patternSource, 'i');
        const image = Array.from(document.querySelectorAll('img')).find((item) => pattern.test(item.currentSrc || item.src || ''));
        const placement = image?.closest('div[data-map-placement="true"]');
        return placement ? `${placement.style.top}|${placement.style.left}` : '';
      },
      args: [config.pattern.source]
    });
    if (result) await setMapCardHighlight([result]);
  } catch { /* Optional hover feedback. */ }
}

mapActivityTabs.forEach((tab) => {
  const activity = tab.dataset.mapActivityTab;
  if (activity !== 'market' && activity !== 'workbench') return;
  tab.addEventListener('pointerenter', () => { void highlightGameBuilding(activity); });
  tab.addEventListener('pointerleave', () => { void setMapCardHighlight(); });
});

