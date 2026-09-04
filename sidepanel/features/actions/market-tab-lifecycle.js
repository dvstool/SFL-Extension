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
  clearGameActionMarker();
  const buildingForActivity = (value) => value === 'seeds' || value === 'market' ? 'market' : value === 'workbench' ? 'workbench' : '';
  const leaving = buildingForActivity(previousActivity);
  const entering = buildingForActivity(activity);
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

async function selectGameCatalogItem(activity, slotIndex, category = '') {
  if (!Number.isInteger(slotIndex)) return false;
  const [{ result }] = await executeOnSunflowerTabs({
    func: async (requestedActivity, requestedSlotIndex, requestedCategory) => {
      const sleep = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));
      const waitFor = async (find, timeout = 300) => {
        const deadline = Date.now() + timeout;
        let value;
        while (!(value = find()) && Date.now() < deadline) await sleep(15);
        return value || null;
      };
      const dialog = () => Array.from(document.querySelectorAll('div.relative.max-h-\\[90vh\\]')).find((item) => item.querySelector('#SeasonSeeds') || /\b(?:Land|Water|Animal) Tools\b/i.test(item.innerText || ''));
      if (requestedActivity === 'market') {
        if (!document.querySelector('#SeasonSeeds')) Array.from(document.querySelectorAll('div.cursor-pointer, button')).find((item) => item.textContent.trim() === 'Buy')?.click();
        const seasonSeeds = await waitFor(() => document.querySelector('#SeasonSeeds'));
        const slot = Array.from(seasonSeeds?.querySelectorAll('.bg-brown-600') || []).filter((item) => item.querySelector('img[alt="item"]'))[requestedSlotIndex];
        slot?.click();
        return Boolean(slot);
      }
      const workbenchDialog = dialog();
      Array.from(workbenchDialog?.querySelectorAll('button, div.cursor-pointer') || []).find((item) => item.textContent.trim() === 'Tools')?.click();
      await sleep(45);
      const heading = Array.from(workbenchDialog?.querySelectorAll('div') || []).find((item) => item.textContent.trim() === requestedCategory);
      const slot = Array.from(heading?.nextElementSibling?.querySelectorAll('.bg-brown-600, .bg-brown-700') || []).filter((item) => item.querySelector('img[alt="item"]'))[requestedSlotIndex];
      slot?.click();
      return Boolean(slot);
    },
    args: [activity, slotIndex, category]
  });
  return Boolean(result);
}

async function markGameAction(activity, slotIndex, category, actionLabel) {
  try {
    const selected = await selectGameCatalogItem(activity, slotIndex, category);
    if (!selected) return;
    await new Promise((resolve) => setTimeout(resolve, 55));
    await executeOnSunflowerTabs({
      func: (requestedActivity, requestedAction) => {
        const markerId = 'sunflower-tools-game-action-marker';
        document.getElementById(markerId)?.remove();
        const dialog = Array.from(document.querySelectorAll('div.relative.max-h-\\[90vh\\]')).find((item) => item.querySelector('#SeasonSeeds') || /\b(?:Land|Water|Animal) Tools\b/i.test(item.innerText || ''));
        const button = Array.from(dialog?.querySelectorAll('button') || []).find((item) => item.innerText.trim() === requestedAction || (requestedActivity === 'market' && item.innerText.trim().toLowerCase() === requestedAction.toLowerCase()));
        if (!button) return false;
        const rect = button.getBoundingClientRect();
        const size = 18;
        const marker = document.createElement('div');
        marker.id = markerId;
        marker.style.cssText = `position:fixed;z-index:2147483647;pointer-events:none;left:${rect.left + rect.width / 2 - size / 2}px;top:${rect.top + rect.height / 2 - size / 2}px;width:${size}px;height:${size}px;border:3px solid #22d3ee;border-radius:50%;background:rgba(34,211,238,.28);box-shadow:0 0 0 2px #fff,0 0 12px 5px rgba(34,211,238,.85);`;
        document.body.append(marker);
        return true;
      },
      args: [activity, actionLabel]
    });
  } catch { /* Preview marker is optional. */ }
}

function clearGameActionMarker() {
  void executeOnSunflowerTabs({
    func: () => document.getElementById('sunflower-tools-game-action-marker')?.remove()
  }).catch(() => {});
}

function enteredElement(event, selector) {
  const element = event.target.closest(selector);
  return element && !element.contains(event.relatedTarget) ? element : null;
}

const toolHoverRefreshes = new Set();
const toolHoverRefreshAt = new Map();

function refreshWorkbenchToolOnHover(category, slotIndex) {
  if (!category || !Number.isInteger(slotIndex) || typeof refreshPurchasedTool !== 'function') return;
  const isWorkbenchActive = mapActivityTabs.some((tab) => tab.dataset.mapActivityTab === 'workbench' && tab.classList.contains('is-active'));
  if (!isWorkbenchActive) return;
  const key = `${category}|${slotIndex}`;
  const now = Date.now();
  if (toolHoverRefreshes.has(key) || now - (toolHoverRefreshAt.get(key) || 0) < 750) return;
  toolHoverRefreshes.add(key);
  toolHoverRefreshAt.set(key, now);
  void refreshPurchasedTool(category, slotIndex).catch(() => {}).finally(() => toolHoverRefreshes.delete(key));
}

shopResults.addEventListener('pointerover', (event) => {
  const buyButton = enteredElement(event, '[data-shop-buy]');
  if (buyButton) {
    const card = buyButton.closest('[data-shop-slot-index]');
    void markGameAction('market', Number(card?.dataset.shopSlotIndex), '', buyButton.dataset.shopBuy || '');
    return;
  }
  const card = enteredElement(event, '.shop-card[data-shop-slot-index]');
  if (card) void selectGameCatalogItem('market', Number(card.dataset.shopSlotIndex));
});
shopResults.addEventListener('pointerout', (event) => {
  if (enteredElement({ target: event.target, relatedTarget: event.relatedTarget }, '[data-shop-buy]')) clearGameActionMarker();
});

workbenchResults.addEventListener('pointerover', (event) => {
  const craftButton = enteredElement(event, '[data-tool-craft]');
  const card = event.target.closest('.shop-card[data-tool-slot-index]');
  if (craftButton && card) {
    void markGameAction('workbench', Number(card.dataset.toolSlotIndex), card.dataset.toolCategory || '', craftButton.dataset.toolCraft || '');
    window.setTimeout(() => refreshWorkbenchToolOnHover(card.dataset.toolCategory || '', Number(card.dataset.toolSlotIndex)), 160);
    return;
  }
  if (card && !card.contains(event.relatedTarget)) refreshWorkbenchToolOnHover(card.dataset.toolCategory || '', Number(card.dataset.toolSlotIndex));
});
workbenchResults.addEventListener('pointerout', (event) => {
  if (enteredElement({ target: event.target, relatedTarget: event.relatedTarget }, '[data-tool-craft]')) clearGameActionMarker();
});

seedPickerResults?.addEventListener('pointerover', (event) => {
  const card = enteredElement(event, '[data-seed-picker-choice][data-shop-slot-index]');
  if (card) void selectGameCatalogItem('market', Number(card.dataset.shopSlotIndex));
});

mapActivityTabs.forEach((tab) => {
  const activity = tab.dataset.mapActivityTab;
  if (activity !== 'market' && activity !== 'workbench') return;
  tab.addEventListener('pointerenter', () => { void highlightGameBuilding(activity); });
  tab.addEventListener('pointerleave', () => { void setMapCardHighlight(); });
});
