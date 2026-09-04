/* Mushroom, Pet, Composter, and Fruit interactions. */

async function harvestMushrooms(card) {
  const mapKeys = card.dataset.mapKeys ? card.dataset.mapKeys.split('||').filter(Boolean) : [];
  if (!mapKeys.length) throw new Error('Không xác định được nấm trên map. Hãy quét Map lại.');
  const [{ result }] = await executeOnSunflowerTabs({
    func: async (keys) => {
      const sleep = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));
      const mushroomSource = (placement) => Array.from(placement.querySelectorAll('.mushroom [style*="background-image"]')).map((element) => element.style.backgroundImage || '').find((source) => /\/(?:wild|magic)_mushroom_sheet\.png/i.test(source));
      let harvested = 0;
      for (const key of keys) {
        const placement = Array.from(document.querySelectorAll('div[data-map-placement="true"]')).find((item) => `${item.style.top}|${item.style.left}` === key);
        if (!placement || !mushroomSource(placement)) continue;
        (placement.querySelector('.mushroom.cursor-pointer') || placement.querySelector('.mushroom') || placement).click();
        harvested += 1;
        await sleep(120);
      }
      return { harvested };
    },
    args: [mapKeys]
  });
  return result || { harvested: 0 };
}

async function wakeSleepingPets(card) {
  const mapKeys = card.dataset.mapKeys ? card.dataset.mapKeys.split('||').filter(Boolean) : [];
  if (!mapKeys.length) throw new Error('Không xác định được Pet đang ngủ. Hãy quét Map lại.');
  const [{ result }] = await executeOnSunflowerTabs({
    func: async (keys) => {
      const sleep = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));
      let awakened = 0;
      const awakenedKeys = [];
      const awakenedPets = [];
      for (const key of keys) {
        const placement = Array.from(document.querySelectorAll('div[data-map-placement="true"]')).find((item) => `${item.style.top}|${item.style.left}` === key);
        const sleeping = placement?.querySelector('img[alt="sleeping"][src*="/game-assets/icons/sleeping.webp"]');
        if (!sleeping) continue;
        const pet = Array.from(placement.querySelectorAll('img')).find((image) => image !== sleeping && image.alt?.trim() && image.alt.trim().toLowerCase() !== 'sleeping') || Array.from(placement.querySelectorAll('img')).find((image) => image !== sleeping && image.classList.contains('cursor-pointer'));
        const target = pet || sleeping;
        target.click();
        awakened += 1;
        awakenedKeys.push(key);
        await sleep(120);
        const activePet = Array.from(placement.querySelectorAll('img')).find((image) => image.alt?.trim() && image.alt.trim().toLowerCase() !== 'sleeping');
        awakenedPets.push({ mapKey: key, label: activePet?.alt?.trim() || pet?.alt?.trim() || 'Pet', icon: activePet?.currentSrc || activePet?.src || pet?.currentSrc || pet?.src || '' });
      }
      return { awakened, awakenedKeys, awakenedPets };
    },
    args: [mapKeys]
  });
  return result || { awakened: 0, awakenedKeys: [], awakenedPets: [] };
}

async function interactComposters(card, action) {
  const mapKeys = card.dataset.mapKeys ? card.dataset.mapKeys.split('||').filter(Boolean) : [];
  if (!mapKeys.length) throw new Error('Không xác định được Composter trên map. Hãy quét Map lại.');
  const [{ result }] = await executeOnSunflowerTabs({
    func: async (keys, requestedAction) => {
      const sleep = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));
      const waitFor = async (predicate, timeout = 4000) => {
        const deadline = Date.now() + timeout;
        while (Date.now() < deadline) {
          const found = predicate();
          if (found) return found;
          await sleep(30);
        }
        return null;
      };
      const isComposter = (placement) => Array.from(placement.querySelectorAll('img')).some((image) => /composter/i.test(image.alt || '') || /\/game-assets\/composters\/[^/]+\.(?:webp|png)(?:[?#]|$)/i.test(image.currentSrc || image.src || ''));
      const parseSeconds = (text) => Array.from(String(text || '').matchAll(/(\d+)\s*(days?|d|hrs?|h|mins?|m|secs?|s)\b/gi)).reduce((total, match) => {
        const unit = match[2].toLowerCase();
        return total + Number(match[1]) * (/^d/.test(unit) ? 86400 : /^h/.test(unit) ? 3600 : /^m/.test(unit) ? 60 : 1);
      }, 0) || null;
      const readRequirements = (panel) => {
        const requirementsLabel = Array.from(panel?.querySelectorAll('div, span') || []).find((element) => element.innerText?.trim() === 'Requirements');
        let requirementsSection = requirementsLabel || null;
        while (requirementsSection && !Array.from(requirementsSection.children).some((child) => child.classList?.contains('mt-2'))) requirementsSection = requirementsSection.parentElement;
        const requirementsContainer = Array.from(requirementsSection?.children || []).find((child) => child.classList?.contains('mt-2'));
        return Array.from(requirementsContainer?.querySelectorAll('img[alt="item"]') || []).map((image) => {
          let row = image.parentElement;
          while (row && row !== requirementsContainer && !row.classList.contains('min-h-[26px]')) row = row.parentElement;
          return { icon: image.currentSrc || image.src || '', text: row?.innerText?.trim() || '' };
        }).filter((entry) => entry.icon && entry.text);
      };
      let processed = 0;
      const processedKeys = [];
      const details = [];
      for (const key of keys) {
        const placement = Array.from(document.querySelectorAll('div[data-map-placement="true"]')).find((item) => `${item.style.top}|${item.style.left}` === key);
        if (!placement || !isComposter(placement)) continue;
        (placement.querySelector('.cursor-pointer') || placement.firstElementChild || placement).click();
        const actionButton = await waitFor(() => Array.from(document.querySelectorAll('button')).find((button) => button.offsetParent !== null && button.innerText.trim() === requestedAction));
        if (!actionButton) return { processed, error: `Không mở được nút ${requestedAction} của Composter.` };
        let panel = actionButton.parentElement;
        while (panel && panel !== document.body && !panel.querySelector('img[src*="/game-assets/icons/close.png"]')) panel = panel.parentElement;
        const requirements = requestedAction === 'Compost' ? readRequirements(panel) : [];
        const detail = { mapKey: key, seconds: null, requirements, canCompost: requestedAction === 'Compost' ? !actionButton.disabled : undefined };
        details.push(detail);
        if (actionButton.disabled) {
          panel?.querySelector('img[src*="/game-assets/icons/close.png"]')?.click();
          return { processed, details, error: 'Không đủ nguyên liệu để Compost.' };
        }
        actionButton.click();
        await sleep(350);
        if (requestedAction === 'Compost') {
          const timer = await waitFor(() => panel?.querySelector('img[src*="/game-assets/icons/timer.png"]'), 1800);
          detail.seconds = parseSeconds(timer?.parentElement?.innerText || '');
        }
        if (requestedAction === 'Collect') {
          const compostButton = await waitFor(() => Array.from(panel?.querySelectorAll('button') || []).find((button) => /^Compost$/i.test(button.innerText.trim())), 1800);
          if (compostButton) {
            detail.requirements = readRequirements(panel);
            detail.canCompost = !compostButton.disabled;
          }
        }
        const closeButton = await waitFor(() => {
          const close = panel?.querySelector('img[src*="/game-assets/icons/close.png"]');
          return close?.offsetParent !== null ? close : null;
        }, 2200);
        if (!closeButton) return { processed, error: 'Không tìm thấy nút đóng Composter.' };
        closeButton.click();
        processed += 1;
        processedKeys.push(key);
        await sleep(120);
      }
      return { processed, processedKeys, details };
    },
    args: [mapKeys, action]
  });
  result?.details?.forEach((detail) => {
    const previous = composterDetails.get(detail.mapKey) || {};
    composterDetails.set(detail.mapKey, { ...previous, seconds: detail.seconds ?? previous.seconds, requirements: detail.requirements || previous.requirements || [], recipe: detail.requirements || previous.recipe || [], canCompost: detail.canCompost ?? previous.canCompost });
  });
  if (result?.error) throw new Error(result.error);
  return result || { processed: 0, processedKeys: [] };
}

async function scanComposterDetails() {
  const [{ result }] = await executeOnSunflowerTabs({
    func: async () => {
      const sleep = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));
      const waitFor = async (predicate, timeout = 2500) => {
        const deadline = Date.now() + timeout;
        while (Date.now() < deadline) {
          const value = predicate();
          if (value) return value;
          await sleep(30);
        }
        return null;
      };
      const parseSeconds = (text) => {
        const match = String(text || '').replace(/\b(\d+)\s*hsr\b/gi, '$1hrs').match(/\b(?=\d+\s*(?:d(?:ays?)?|h(?:r(?:s)?|ours?)?|m(?:in(?:s)?)?|s(?:ec(?:s)?)?))(?:(\d+)\s*d(?:ays?)?)?\s*(?:(\d+)\s*h(?:r(?:s)?|ours?)?)?\s*(?:(\d+)\s*m(?:in(?:s)?)?)?\s*(?:(\d+)\s*s(?:ec(?:s)?)?)?/i);
        return match && (match[1] || match[2] || match[3] || match[4]) ? Number(match[1] || 0) * 86400 + Number(match[2] || 0) * 3600 + Number(match[3] || 0) * 60 + Number(match[4] || 0) : null;
      };
      const dialogs = () => Array.from(document.querySelectorAll('div[data-headlessui-state="open"]')).filter((dialog) => dialog.offsetParent !== null && /Composter/.test(dialog.innerText || ''));
      const closeDialog = async (dialog) => {
        const close = dialog?.querySelector('img.flex-none.cursor-pointer.float-right[src*="/game-assets/icons/close.png"], img[src*="/game-assets/icons/close.png"]');
        if (close?.offsetParent !== null) {
          const rect = close.getBoundingClientRect();
          const options = { bubbles: true, cancelable: true, view: window, clientX: rect.left + rect.width / 2, clientY: rect.top + rect.height / 2, button: 0, buttons: 1 };
          ['pointerdown', 'pointerup', 'mousedown', 'mouseup', 'click'].forEach((type) => close.dispatchEvent(typeof PointerEvent === 'function' && type.startsWith('pointer') ? new PointerEvent(type, { ...options, pointerId: 1, pointerType: 'mouse', isPrimary: true }) : new MouseEvent(type, options)));
          close.click();
          await waitFor(() => !dialog.isConnected || dialog.offsetParent === null, 1500);
          return true;
        }
        return false;
      };
      const placements = [...new Set(Array.from(document.querySelectorAll('div[data-map-placement="true"] img[alt="Compost Bin"], div[data-map-placement="true"] img[alt*="Composter"]')).map((image) => image.closest('div[data-map-placement="true"]')).filter(Boolean))];
      const details = [];
      const trace = { clicked: 0, read: 0, closed: 0 };
      for (const placement of placements) {
        const source = Array.from(placement.querySelectorAll('img')).map((image) => image.currentSrc || image.src || '').find((value) => /\/game-assets\/composters\//i.test(value)) || '';
        const growing = /_closed\.(?:webp|png)(?:[?#]|$)/i.test(source);
        const ready = /_ready\.(?:webp|png)(?:[?#]|$)/i.test(source);
        const target = placement.querySelector('.cursor-pointer') || placement.firstElementChild || placement;
        const dialogsBefore = new Set(dialogs());
        const rect = target.getBoundingClientRect();
        const options = { bubbles: true, cancelable: true, view: window, clientX: rect.left + rect.width / 2, clientY: rect.top + rect.height / 2, button: 0, buttons: 1 };
        ['pointerdown', 'pointerup'].forEach((type) => target.dispatchEvent(typeof PointerEvent === 'function' ? new PointerEvent(type, { ...options, pointerId: 1, pointerType: 'mouse', isPrimary: true }) : new MouseEvent(type, options)));
        target.click();
        trace.clicked += 1;
        const dialog = await waitFor(() => dialogs().find((item) => !dialogsBefore.has(item)), 3000);
        if (!dialog) {
          if (growing) {
            const mapTimer = Array.from(placement.querySelectorAll('span')).map((element) => element.textContent || '').find((text) => /\d+\s*(?:d|h|m|s)/i.test(text)) || '';
            details.push({ mapKey: `${placement.style.top}|${placement.style.left}`, seconds: parseSeconds(mapTimer), requirements: [], canCompost: undefined });
          }
          continue;
        }
        try {
          if (growing) {
            const timer = dialog.querySelector('img[src*="/game-assets/icons/timer.png"]');
            const mapTimer = Array.from(placement.querySelectorAll('span')).map((element) => element.textContent || '').find((text) => /\d+\s*(?:d|h|m|s)/i.test(text)) || '';
            details.push({ mapKey: `${placement.style.top}|${placement.style.left}`, seconds: parseSeconds(timer?.parentElement?.innerText || '') ?? parseSeconds(mapTimer), requirements: [], canCompost: undefined });
          } else if (!ready) {
            const compostButton = Array.from(dialog.querySelectorAll('button')).find((button) => /^Compost$/i.test(button.innerText.trim()));
            const requirementsLabel = Array.from(dialog.querySelectorAll('div, span')).find((element) => element.innerText?.trim() === 'Requirements');
            let requirementsSection = requirementsLabel || null;
            while (requirementsSection && !Array.from(requirementsSection.children).some((child) => child.classList?.contains('mt-2'))) requirementsSection = requirementsSection.parentElement;
            const requirementsContainer = Array.from(requirementsSection?.children || []).find((child) => child.classList?.contains('mt-2'));
            const requirements = Array.from(requirementsContainer?.querySelectorAll('img[alt="item"]') || []).map((image) => {
              let row = image.parentElement;
              while (row && row !== requirementsContainer && !row.classList.contains('min-h-[26px]')) row = row.parentElement;
              return { icon: image.currentSrc || image.src || '', text: row?.innerText?.trim() || '' };
            }).filter((entry) => entry.icon && entry.text);
            details.push({ mapKey: `${placement.style.top}|${placement.style.left}`, seconds: null, requirements, canCompost: Boolean(compostButton && !compostButton.disabled) });
          } else {
            details.push({ mapKey: `${placement.style.top}|${placement.style.left}`, seconds: null, requirements: [], canCompost: undefined });
          }
          trace.read += 1;
        } finally {
          if (await closeDialog(dialog)) trace.closed += 1;
        }
      }
      return { details, found: placements.length, trace };
    }
  });
  return result || { details: [], found: 0, trace: { clicked: 0, read: 0, closed: 0 } };
}

async function readComposterStates() {
  const [{ result }] = await executeOnSunflowerTabs({
    func: () => [...new Set(Array.from(document.querySelectorAll('div[data-map-placement="true"] img[alt="Compost Bin"], div[data-map-placement="true"] img[alt*="Composter"]')).map((image) => image.closest('div[data-map-placement="true"]')).filter(Boolean))].map((placement) => {
      const image = Array.from(placement.querySelectorAll('img')).find((item) => /composter/i.test(item.alt || '') || /\/game-assets\/composters\/[^/]+\.(?:webp|png)(?:[?#]|$)/i.test(item.currentSrc || item.src || ''));
      const icon = image?.currentSrc || image?.src || '';
      const sourceName = icon.match(/\/composters\/([^/.]+)\.(?:webp|png)/i)?.[1] || 'Composter';
      const label = image?.alt?.trim() || sourceName.replace(/_(?:ready|closed)$/i, '').replace(/[_-]/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
      const state = /_ready\.(?:webp|png)(?:[?#]|$)/i.test(icon) || Boolean(placement.querySelector('img.ready')) ? 'ready' : /_closed\.(?:webp|png)(?:[?#]|$)/i.test(icon) ? 'growing' : 'empty';
      return { mapKey: `${placement.style.top}|${placement.style.left}`, label, icon, state };
    })
  });
  return Array.isArray(result) ? result : [];
}

async function interactFruit(card, action) {
  const mapKeys = card.dataset.mapKeys ? card.dataset.mapKeys.split('||').filter(Boolean) : [];
  if (!mapKeys.length) throw new Error('Không xác định được Fruit trên map. Hãy quét Map lại.');
  const [{ result }] = await executeOnSunflowerTabs({
    func: async (keys, requestedAction, requestedAxe, requestedSeedSource) => {
      const sleep = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));
      const placements = () => Array.from(document.querySelectorAll('div[data-map-placement="true"]'));
      const sourceList = (placement) => Array.from(placement.querySelectorAll('img')).map((image) => image.currentSrc || image.src || '');
      const isFruit = (placement) => sourceList(placement).some((source) => /\/game-assets\/(?:[^/]+\/)?fruit\/fruit_patch\.(?:webp|png)(?:[?#]|$)/i.test(source));
      const hasDeadTree = (placement) => sourceList(placement).some((source) => /\/game-assets\/fruit\/(?:dead_tree|dead_bush|withered_bush|bush_shrub)\.(?:webp|png)(?:[?#]|$)/i.test(source));
      const hasSoil = (placement) => sourceList(placement).some((source) => /\/game-assets\/crops\/soil2\.png/i.test(source));
      const hasGrowing = (placement) => Array.from(placement.querySelectorAll('img')).some((image) => /\/game-assets\/crops\/[^/]+\/(seedling|halfway|almost)\.png|\/game-assets\/fruit\/harvested_bush\.png/i.test(image.currentSrc || image.src || ''));
      const quickColumn = Array.from(document.querySelectorAll('div.flex.flex-col.items-center')).find((column) => Array.from(column.children).some((child) => child.querySelector('.bg-brown-600 img[alt="item"]')));
      const quickSlots = quickColumn ? Array.from(quickColumn.children).filter((child) => child.querySelector('.bg-brown-600 img[alt="item"]')) : [];
      const processedKeys = [];
      if (requestedAction === 'plant') {
        const seedSlot = quickSlots.find((slot) => {
          const source = slot.querySelector('.bg-brown-600 img[alt="item"]')?.currentSrc || slot.querySelector('.bg-brown-600 img[alt="item"]')?.src || '';
          return requestedSeedSource ? source === requestedSeedSource : /\/game-assets\/fruit\/.*(?:_seed|\/seed)\.png/i.test(source);
        });
        if (!seedSlot) return { error: 'Hãy chọn hạt Fruit trên thanh chọn nhanh trước.' };
        const available = Number((seedSlot.textContent.match(/\d[\d,.]*/)?.[0] || '0').replace(/[^\d]/g, ''));
        if (!available) return { error: 'Không còn hạt Fruit để trồng.' };
        seedSlot.querySelector('.bg-brown-600')?.click();
        await sleep(80);
        let processed = 0;
        for (const key of keys.slice(0, available)) {
          const placement = placements().find((item) => `${item.style.top}|${item.style.left}` === key);
          if (!placement || !isFruit(placement) || !hasSoil(placement)) continue;
          (placement.querySelector('.cursor-pointer') || placement).click();
          processed += 1;
          processedKeys.push(key);
          await sleep(115);
        }
        return { processed, processedKeys };
      }
      if (requestedAction === 'chop') {
        const axeSlot = quickSlots.find((slot) => (slot.querySelector('.bg-brown-600 img[alt="item"]')?.currentSrc || slot.querySelector('.bg-brown-600 img[alt="item"]')?.src || '') === requestedAxe);
        if (axeSlot && Number((axeSlot.textContent.match(/\d[\d,.]*/)?.[0] || '0').replace(/[^\d]/g, '')) > 0) {
          axeSlot.querySelector('.bg-brown-600')?.click();
          await sleep(80);
        }
      }
      let processed = 0;
      for (const key of keys) {
        const placement = placements().find((item) => `${item.style.top}|${item.style.left}` === key);
        if (!placement) continue;
        const eligible = requestedAction === 'chop' ? hasDeadTree(placement) : isFruit(placement) && !hasDeadTree(placement) && !hasSoil(placement) && !hasGrowing(placement);
        if (!eligible) continue;
        (placement.querySelector('.cursor-pointer') || placement).click();
        processed += 1;
        processedKeys.push(key);
        await sleep(130);
      }
      return { processed, processedKeys };
    },
    args: [mapKeys, action, axeIcon, selectedFruitSeed?.icon || lastScanData?.heldFruitSeed?.icon || '']
  });
  if (result?.error) throw new Error(result.error);
  return result;
}

async function readFruitStates(mapKeys = []) {
  if (!mapKeys.length) return [];
  const [{ result }] = await executeOnSunflowerTabs({
    func: async (keys) => {
      const sleep = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));
      const parseSeconds = (text) => {
        const match = String(text || '').match(/(?:(\d+)\s*d(?:ays?)?)?\s*(?:(\d+)\s*h(?:r(?:s)?|ours?)?)?\s*(?:(\d+)\s*m(?:in(?:s)?)?)?\s*(?:(\d+)\s*s(?:ec(?:s)?)?)?/i);
        if (!match || (!match[1] && !match[2] && !match[3] && !match[4])) return null;
        return Number(match[1] || 0) * 86400 + Number(match[2] || 0) * 3600 + Number(match[3] || 0) * 60 + Number(match[4] || 0);
      };
      await sleep(300);
      return keys.map((mapKey) => {
        const placement = Array.from(document.querySelectorAll('div[data-map-placement="true"]')).find((item) => `${item.style.top}|${item.style.left}` === mapKey);
        const images = Array.from(placement?.querySelectorAll('img') || []);
        const source = (image) => image.currentSrc || image.src || '';
        const titleCase = (value) => String(value || '').replace(/[_-]/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
        const crop = images.find((image) => /\/game-assets\/crops\/[^/]+\/(?:seedling|halfway|almost|plant)\.png/i.test(source(image)));
        const tooltipNode = Array.from(placement?.querySelectorAll('div.transition-opacity') || []).find((element) => element.querySelector('span.whitespace-nowrap') && element.querySelector('span.font-secondary'));
        const title = tooltipNode?.querySelector('span.whitespace-nowrap')?.textContent.trim() || '';
        const fruitName = title.match(/^(.+?)\s+(?:Tree\s+)?(?:Growing|Ready|Replenishing)$/i)?.[1] || '';
        const dead = images.find((image) => /\/game-assets\/fruit\/(?:dead_tree|dead_bush|withered_bush|bush_shrub)\.(?:webp|png)/i.test(source(image)));
        const soil = images.find((image) => /\/game-assets\/crops\/soil2\.png/i.test(source(image)));
        const harvestedBush = images.find((image) => /\/game-assets\/fruit\/harvested_bush\.png/i.test(source(image)));
        const tooltipTime = Array.from(placement?.querySelectorAll('div.transition-opacity span.font-secondary') || []).map((node) => node.textContent.trim()).find((text) => /\d+\s*(?:d|day|h|hr|m|min|s|sec)/i.test(text));
        const mapTimer = Array.from(placement?.querySelectorAll('span.text-white.text-center.font-pixel, span.font-pixel') || []).map((node) => node.textContent.trim()).find((text) => /\d+\s*(?:d|h|m|s)/i.test(text));
        const seconds = parseSeconds(tooltipTime || mapTimer || placement?.innerText || '');
        const readyByTooltip = /\bReady\b/i.test(title) && !Number.isFinite(seconds);
        const state = dead ? 'dead' : soil && !crop ? 'empty' : !readyByTooltip && (harvestedBush || crop || /\b(?:Growing|Replenishing)\b/i.test(title) || Number.isFinite(seconds)) ? 'growing' : 'ready';
        const icon = source(dead || soil || harvestedBush || crop || images.find((image) => !/fruit_patch|stopwatch|empty_bar|progress|\/game-assets\/ui\//i.test(source(image))) || {});
        return { mapKey, state, icon, seconds, label: fruitName ? titleCase(fruitName) : '' };
      });
    },
    args: [mapKeys]
  });
  return Array.isArray(result) ? result : [];
}

mapActivityContent.addEventListener('click', async (event) => {
  const button = event.target.closest('[data-ui-action]');
  const action = button?.dataset.uiAction;
  if (!['plant-fruit', 'harvest-fruit', 'chop-fruit', 'choose-fruit-seed'].includes(action)) return;
  const card = button.closest('.fruit-card');
  if (!card) return;
  if (action === 'choose-fruit-seed') {
    beginSeedPicking('fruit');
    log('Chọn trực tiếp một card hạt Fruit đã quét.');
    return;
  }
  if (action === 'plant-fruit') {
    const allEmptyKeys = Array.from(mapActivityContent.querySelectorAll('.fruit-soil-card[data-map-keys]')).flatMap((soil) => soil.dataset.mapKeys.split('||').filter(Boolean));
    if (allEmptyKeys.length) card.dataset.mapKeys = Array.from(new Set(allEmptyKeys)).join('||');
  }
  button.disabled = true;
  const originalLabel = button.textContent;
  const labels = { 'plant-fruit': 'Đang trồng…', 'harvest-fruit': 'Đang thu hoạch…', 'chop-fruit': 'Đang đốn…' };
  button.textContent = labels[action];
  const finishLog = startActionLog(labels[action]);
  try {
    const result = await interactFruit(card, action === 'plant-fruit' ? 'plant' : action === 'harvest-fruit' ? 'harvest' : 'chop');
    if (!result.processed) logActionError('Không có Fruit phù hợp để thao tác.');
    else {
      if (action === 'plant-fruit') {
        const fruitSeed = selectedFruitSeed || lastScanData?.heldFruitSeed;
        if (fruitSeed) setSeedCount(fruitSeed, Math.max(0, getSeedCount(fruitSeed) - result.processed));
      }
      applyFruitStates(await readFruitStates(result.processedKeys || []));
      renderOverview();
      startCountdowns();
    }
  } catch (error) {
    logActionError(error.message || 'Thao tác Fruit thất bại.');
  } finally {
    finishLog();
    if (button.isConnected) {
      button.disabled = false;
      button.textContent = originalLabel;
    }
  }
});

