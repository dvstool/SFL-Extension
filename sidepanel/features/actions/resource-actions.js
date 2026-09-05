/* Tree, mining, and Salt game interactions. */

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
      const readCount = (value) => {
        const match = String(value || '').replace(/,/g, '').match(/(\d+(?:\.\d+)?)\s*(k)?\b/i);
        const amount = Number.parseFloat(match?.[1] || '0');
        return Number.isFinite(amount) ? Math.floor(amount * (match?.[2] ? 1000 : 1)) : null;
      };
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
      // The game selects Axe automatically while chopping. Read that quick
      // slot after the action so the panel has the authoritative stack count.
      await sleep(120);
      return { processed, felled, felledKeys, axeUsed, remainingAxes: axeSlot ? readCount(axeSlot.textContent) : null, hitsPerTree: hitsPerTree || 1 };
    },
    args: [mapKeys, Number.isFinite(knownAxes) ? knownAxes : null, axeIcon]
  });
  // Prefer the game's quick-slot count; fall back to one Axe per felled tree.
  if (Number.isFinite(result?.remainingAxes)) updateToolCount(axeIcon, result.remainingAxes);
  else if (Number.isFinite(knownAxes)) updateToolCount(axeIcon, knownAxes - result.felled);
  return result;
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

