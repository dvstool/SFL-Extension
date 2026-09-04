/* Betty Market, Workbench, and seed purchasing interactions. */

scanBettyButton.addEventListener('click', async () => {
  scanBettyButton.disabled = true;
  scanBettyButton.textContent = 'Đang quét Betty…';
  const finishLog = startActionLog('Đang quét Betty…');
  try {
    const [{ result }] = await executeOnSunflowerTabs({
      func: async () => {
        const sleep = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));
        const waitFor = async (find, timeout = 260) => {
          const deadline = Date.now() + timeout;
          let value;
          while (!(value = find()) && Date.now() < deadline) await sleep(10);
          return value || null;
        };
        const marketPattern = /\/game-assets\/(?:[^/]+\/)*buildings\/(?:[^/]+\/)*(?:bettys_)?market\.(?:webp|png)(?:[?#]|$)/i;
        const marketImage = Array.from(document.querySelectorAll('img')).find((image) => marketPattern.test(image.currentSrc || image.src || ''));
        const target = marketImage?.closest('.cursor-pointer') || marketImage?.parentElement;
        if (!target) return { error: 'Không tìm thấy Betty’s Market trên map.' };
        if (!document.querySelector('#SeasonSeeds')) {
          target.click();
          await waitFor(() => Array.from(document.querySelectorAll('div.cursor-pointer, button')).find((element) => element.textContent.trim() === 'Buy'), 220);
        }
        const buyTab = Array.from(document.querySelectorAll('div.cursor-pointer, button')).find((element) => element.textContent.trim() === 'Buy');
        if (!document.querySelector('#SeasonSeeds')) buyTab?.click();
        const seasonSeeds = await waitFor(() => document.querySelector('#SeasonSeeds'), 220);
        if (!seasonSeeds) return { error: 'Không tìm thấy tab Buy của Betty’s Market.' };
        const dialog = seasonSeeds.closest('div.relative.max-h-\\[90vh\\]') || seasonSeeds.parentElement?.parentElement?.parentElement;
        if (!dialog) return { error: 'Không đọc được cửa sổ Betty’s Market.' };
        const seasonNode = Array.from(seasonSeeds.querySelectorAll('.capitalize')).find((element) => /^(spring|summer|autumn|winter)$/i.test(element.textContent.trim()));
        const season = seasonNode?.textContent.trim() || '';
        const seasonIcon = seasonNode?.querySelector('img')?.currentSrc || seasonNode?.querySelector('img')?.src || '';
        const seasonEnds = (dialog?.innerText.match(/\b\d+\s*days?\s+left\b/i) || [])[0] || '';
        const slots = Array.from(seasonSeeds.querySelectorAll('.bg-brown-600')).filter((slot) => slot.querySelector('img[alt="item"]'));
        const readSlotCount = (slot) => {
          const text = (slot.parentElement?.innerText || slot.parentElement?.textContent || slot.textContent || '').trim().replace(/,/g, '').toLowerCase();
          const match = text.match(/\d+(?:\.\d+)?\s*k?/);
          const value = Number.parseFloat(match?.[0] || '0');
          return Number.isFinite(value) ? Math.round(value * (String(match?.[0] || '').includes('k') ? 1000 : 1)) : 0;
        };
        const readSelectedItem = () => {
          const details = Array.from(dialog.querySelectorAll('div.flex.flex-col.h-full.justify-between')).find((element) => {
          const title = Array.from(element.querySelectorAll('p')).find((paragraph) => /\bSeed$/i.test(paragraph.textContent.trim()) || /^(Apple|Banana|Blueberry|Lemon|Orange|Grape)(?:\s+(?:Seed|Plant))?$/i.test(paragraph.textContent.trim()));
            return Boolean(title && (element.innerText.includes('in stock') || element.innerText.includes('Sold out') || Array.from(element.querySelectorAll('button')).some((button) => /^Buy\s+\d+$/i.test(button.innerText.trim()))));
          });
          if (!details) return null;
          const paragraphs = Array.from(details.querySelectorAll('p')).map((paragraph) => paragraph.textContent.trim()).filter(Boolean);
          const name = paragraphs.find((text) => /\bSeed$/i.test(text)) || paragraphs.find((text) => /^(Apple|Banana|Blueberry|Lemon|Orange|Grape)(?:\s+(?:Seed|Plant))?$/i.test(text)) || '';
          const category = paragraphs.find((text) => text !== name && /Crop|Flower|Fruit|Greenhouse|Seed/i.test(text)) || '';
          const icon = Array.from(details.querySelectorAll('img[alt="item"]')).find((image) => !/chevron|stopwatch/i.test(image.currentSrc || image.src || ''));
          const stockMatch = details.innerText.match(/([\d,.]+)\s+in stock/i);
          const stock = details.innerText.includes('Sold out') ? 0 : Number((stockMatch?.[1] || '0').replace(/,/g, ''));
          const metricRows = Array.from(details.querySelectorAll('div.flex.justify-between.min-h-\\[26px\\]'));
          const growthTime = metricRows.find((row) => Array.from(row.querySelectorAll('img')).some((image) => /\/game-assets\/icons\/lightning\.png/i.test(image.currentSrc || image.src || '')))?.innerText.trim() || '';
          const price = metricRows.at(-1)?.innerText.trim() || '';
          const basketMessage = paragraphs.find((text) => /you have too many seeds in your basket/i.test(text));
          const requirements = [
            ...Array.from(details.querySelectorAll('[style*="danger_border"]')).map((element) => element.textContent.trim()),
            basketMessage
          ].filter((text) => text && !/^Sold out$/i.test(text) && !/^\d[\d,.]*\s+in stock$/i.test(text));
          const buyOptions = Array.from(details.querySelectorAll('button')).map((button) => button.innerText.trim()).filter((text) => /^Buy\s+(?:\d+|All)$/i.test(text));
          const fruitName = name.replace(/\s+(?:Seed|Plant)$/i, '');
          return name && icon ? { name: /\bSeed$/i.test(name) ? name : `${fruitName} Seed`, category: category || (/^(Apple|Banana|Blueberry|Lemon|Orange|Grape)(?:\s+(?:Seed|Plant))?$/i.test(name) ? 'Fruit' : ''), icon: icon.currentSrc || icon.src, stock: Number.isFinite(stock) ? stock : 0, growthTime, price, requirements: [...new Set(requirements)], buyOptions } : null;
        };
        const selectedSlot = slots.find((slot) => slot.parentElement?.querySelector('img[src*="/game-assets/ui/select/selectbox_"]'));
        const orderedSlots = slots.map((slot, slotIndex) => ({ slot, slotIndex })).sort((left, right) => Number(right.slot === selectedSlot) - Number(left.slot === selectedSlot));
        const signature = (item) => item ? `${item.name}|${item.stock}|${item.growthTime}|${item.price}|${item.buyOptions.join('|')}|${item.requirements.join('|')}` : '';
        let previousSignature = signature(readSelectedItem());
        const items = [];
        for (const { slot, slotIndex } of orderedSlots) {
          const isSelected = slot === selectedSlot;
          if (!isSelected) slot.click();
          const item = isSelected
            ? readSelectedItem()
            : await waitFor(() => {
              const next = readSelectedItem();
              return next && signature(next) !== previousSignature ? next : null;
            }, 160);
          if (item) previousSignature = signature(item);
          if (item && !items.some((entry) => entry.name === item.name)) {
            items.push({ ...item, owned: readSlotCount(slot), slotIndex });
          }
        }
        const closeButton = dialog.querySelector('img[src*="/game-assets/icons/close.png"]');
        closeButton?.click();
        return { season, seasonIcon, seasonEnds, items, closed: Boolean(closeButton) };
      }
    });
    if (result?.error) throw new Error(result.error);
    syncSeedInventory(result.items);
    renderBettyShop(result);
    await refreshConnection();
  } catch (error) {
    shopResults.innerHTML = '';
    logActionError(error.message || 'Không thể quét Betty’s Market.');
  } finally {
    finishLog();
    scanBettyButton.disabled = false;
    scanBettyButton.textContent = 'Quét Betty';
  }
});

scanToolsButton.addEventListener('click', async () => {
  const label = scanToolsButton.querySelector('span:last-child');
  scanToolsButton.disabled = true;
  scanToolsButton.classList.add('is-scanning');
  if (label) label.textContent = 'Đang quét…';
  const finishLog = startActionLog('Đang quét Tools…');
  try {
    const [{ result }] = await executeOnSunflowerTabs({
      func: async () => {
        const sleep = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));
        const waitFor = async (find, timeout = 650) => {
          const until = Date.now() + timeout;
          let found;
          while (!(found = find()) && Date.now() < until) await sleep(15);
          return found || null;
        };
        const workbenchPattern = /\/game-assets\/(?:[^/]+\/)*buildings\/(?:[^/]+\/)*workbench\.(?:webp|png)(?:[?#]|$)/i;
        const workbench = Array.from(document.querySelectorAll('img')).find((image) => workbenchPattern.test(image.currentSrc || image.src || ''));
        const target = workbench?.closest('.cursor-pointer') || workbench?.parentElement;
        if (!target) return { error: 'Không tìm thấy Workbench trên map.' };
        const dialogs = () => Array.from(document.querySelectorAll('div.relative.max-h-\\[90vh\\]'));
        const isWorkbenchDialog = (element) => /\b(?:Land|Water|Animal) Tools\b/i.test(element?.innerText || '');
        const openDialogs = new Set(dialogs());
        let dialog = dialogs().find(isWorkbenchDialog);
        if (!dialog) {
          target.click();
          dialog = await waitFor(() => dialogs().find((element) => !openDialogs.has(element) || isWorkbenchDialog(element)));
        }
        if (!dialog) return { error: 'Không mở được cửa sổ Workbench.' };
        const toolsTab = Array.from(dialog.querySelectorAll('button, div.cursor-pointer')).find((element) => element.textContent.trim() === 'Tools');
        toolsTab?.click();
        const categories = ['Land Tools', 'Water Tools', 'Animal Tools'];
        await waitFor(() => categories.some((category) => Array.from(dialog.querySelectorAll('div')).some((element) => element.textContent.trim() === category)), 350);
        const readCount = (slot) => {
          const text = (slot.parentElement?.innerText || slot.parentElement?.textContent || slot.textContent || '').replace(/,/g, '').toLowerCase();
          const match = text.match(/\d+(?:\.\d+)?\s*k?/);
          const value = Number.parseFloat(match?.[0] || '0');
          return Number.isFinite(value) ? Math.round(value * (String(match?.[0] || '').includes('k') ? 1000 : 1)) : 0;
        };
        const fallbackName = (icon) => {
          const filename = (icon || '').split('/').pop()?.split(/[?#]/)[0] || 'Tool';
          return filename.replace(/\.(png|webp)$/i, '').replace(/[_-]+/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
        };
        const readSelectedDetails = async () => {
          const detail = Array.from(dialog.querySelectorAll('div')).find((element) => element.classList.contains('sm:w-2/5'));
          let ingredientPanel = detail?.querySelector('#ingredients-info-panel');
          if (!ingredientPanel) {
            const ingredientTrigger = Array.from(detail?.querySelectorAll('div.relative.cursor-pointer') || []).find((element) => /\d[\d,.]*\s*\/\s*\d[\d,.]*/.test(element.innerText || ''));
            ingredientTrigger?.click();
            await sleep(40);
            ingredientPanel = detail?.querySelector('#ingredients-info-panel');
          }
          const ingredientNames = new Map(Array.from(ingredientPanel?.querySelectorAll('img[alt]') || []).map((image) => [image.currentSrc || image.src || '', image.alt.trim()]));
          const candidates = Array.from(detail?.querySelectorAll('p, span') || []).map((element) => element.textContent.trim()).filter((text) => text && !/^(Tools|Land Tools|Water Tools|Animal Tools|Buy|Sell|Guide|Craft)$/i.test(text) && !/^\d/.test(text));
          const name = candidates.find((text) => /(?:Axe|Pickaxe|Rod|Hammer|Saw|Scythe|Drill|Hoe|Pot|Rake|Tool)/i.test(text)) || candidates[0] || '';
          const text = detail?.innerText || '';
          const stockText = (text.match(/(?:\d[\d,.]*\s+in stock|Sold out)/i) || [''])[0];
          const soldOut = /Sold out/i.test(stockText);
          const requirementRows = Array.from(detail?.querySelectorAll('div.flex.justify-between.min-h-\\[26px\\]') || []);
          const requirements = requirementRows.map((row) => {
            const icon = row.querySelector('img[alt="item"]')?.currentSrc || row.querySelector('img[alt="item"]')?.src || '';
            return { icon, name: ingredientNames.get(icon) || '', text: row.innerText.trim() };
          }).filter((entry) => entry.text);
          const craftButtons = Array.from(detail?.querySelectorAll('button') || []).filter((button) => /^Craft\s+\d+$/i.test(button.innerText.trim()));
          const craftOptions = craftButtons.map((button) => button.innerText.trim());
          const disabledCraftOptions = craftButtons.filter((button) => button.disabled).map((button) => button.innerText.trim());
          const note = Array.from(detail?.querySelectorAll('p')).map((element) => element.textContent.trim()).find((value) => /required|not enough|cannot craft/i.test(value)) || '';
          return { name, stockText, soldOut, requirements, craftOptions, disabledCraftOptions, note };
        };
        const items = [];
        for (const category of categories) {
          const heading = Array.from(dialog.querySelectorAll('div')).find((element) => element.textContent.trim() === category);
          const section = heading?.nextElementSibling;
          // Available and unavailable tools use different brown shades.
          // Stone Pickaxe, for example, is rendered with bg-brown-700.
          const slots = Array.from(section?.querySelectorAll('.bg-brown-600, .bg-brown-700') || []).filter((slot) => slot.querySelector('img[alt="item"]'));
          for (const [slotIndex, slot] of slots.entries()) {
            const image = slot.querySelector('img[alt="item"]');
            const icon = image.currentSrc || image.src;
            slot.click();
            // The Workbench keeps the previous tool's panel visible briefly.
            // Wait for the selected tool image before reading its name.
            await waitFor(() => {
              const detail = Array.from(dialog.querySelectorAll('div')).find((element) => element.classList.contains('sm:w-2/5'));
              return Array.from(detail?.querySelectorAll('img') || []).some((detailImage) => (detailImage.currentSrc || detailImage.src || '') === icon);
            }, 700);
            await sleep(45);
            const details = await readSelectedDetails();
            const name = details.name || fallbackName(icon);
            // “N in stock” is the Workbench shop/crafting stock, not the
            // player's inventory. Inventory is shown only on the tool-slot badge.
            const count = readCount(slot);
            if (!items.some((item) => item.icon === icon)) items.push({ ...details, name, icon, count, category, slotIndex });
          }
        }
        const closeButton = dialog.querySelector('img[src*="/game-assets/icons/close.png"]');
        closeButton?.click();
        return { items, closed: Boolean(closeButton) };
      }
    });
    if (result?.error) throw new Error(result.error);
    renderToolsScan(result);
  } catch (error) {
    logActionError(error.message || 'Không thể quét Workbench.');
  } finally {
    finishLog();
    scanToolsButton.disabled = false;
    scanToolsButton.classList.remove('is-scanning');
    if (label) label.textContent = 'Tools';
  }
});

async function refreshPurchasedTool(category, slotIndex) {
  const [{ result }] = await executeOnSunflowerTabs({
    func: async (requestedCategory, requestedSlotIndex) => {
      const sleep = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));
      const workbenchPattern = /\/game-assets\/(?:[^/]+\/)*buildings\/(?:[^/]+\/)*workbench\.(?:webp|png)(?:[?#]|$)/i;
      const workbench = Array.from(document.querySelectorAll('img')).find((image) => workbenchPattern.test(image.currentSrc || image.src || ''));
      const target = workbench?.closest('.cursor-pointer') || workbench?.parentElement;
      const dialogs = () => Array.from(document.querySelectorAll('div.relative.max-h-\\[90vh\\]'));
      const isWorkbenchDialog = (element) => /\b(?:Land|Water|Animal) Tools\b/i.test(element.innerText || '');
      let dialog = dialogs().find(isWorkbenchDialog);
      if (!dialog) {
        if (!target) return { error: 'Không tìm thấy Workbench trên map.' };
        target.click();
        for (let attempt = 0; attempt < 40 && !dialog; attempt += 1) {
          dialog = dialogs().find(isWorkbenchDialog);
          if (!dialog) await sleep(15);
        }
      }
      if (!dialog) return { error: 'Không mở được Workbench.' };
      try {
        Array.from(dialog.querySelectorAll('button, div.cursor-pointer')).find((element) => element.textContent.trim() === 'Tools')?.click();
        await sleep(70);
        const heading = Array.from(dialog.querySelectorAll('div')).find((element) => element.textContent.trim() === requestedCategory);
        const slots = Array.from(heading?.nextElementSibling?.querySelectorAll('.bg-brown-600, .bg-brown-700') || []).filter((slot) => slot.querySelector('img[alt="item"]'));
        const slot = slots[requestedSlotIndex];
        if (!slot) return { error: 'Index Tool đã thay đổi. Hãy Quét Tools lại.' };
        slot.click();
        await sleep(40);
        const detail = Array.from(dialog.querySelectorAll('div')).find((element) => element.classList.contains('sm:w-2/5'));
        const text = detail?.innerText || '';
        const stockText = (text.match(/(?:\d[\d,.]*\s+in stock|Sold out)/i) || [''])[0];
        const craftButtons = Array.from(detail?.querySelectorAll('button') || []).filter((button) => /^Craft\s+\d+$/i.test(button.innerText.trim()));
        const requirementRows = Array.from(detail?.querySelectorAll('div.flex.justify-between.min-h-\\[26px\\]') || []);
        const readCount = (entry) => {
          const value = (entry.parentElement?.innerText || entry.parentElement?.textContent || entry.textContent || '').replace(/,/g, '').toLowerCase();
          const match = value.match(/\d+(?:\.\d+)?\s*k?/);
          const number = Number.parseFloat(match?.[0] || '0');
          return Number.isFinite(number) ? Math.round(number * (String(match?.[0] || '').includes('k') ? 1000 : 1)) : 0;
        };
        const icon = slot.querySelector('img[alt="item"]')?.currentSrc || slot.querySelector('img[alt="item"]')?.src || '';
        return {
          item: {
            icon,
            count: readCount(slot),
            stockText,
            soldOut: /Sold out/i.test(stockText),
            requirements: requirementRows.map((row) => ({ icon: row.querySelector('img[alt="item"]')?.currentSrc || row.querySelector('img[alt="item"]')?.src || '', text: row.innerText.trim() })).filter((entry) => entry.text),
            craftOptions: craftButtons.map((button) => button.innerText.trim()),
            disabledCraftOptions: craftButtons.filter((button) => button.disabled).map((button) => button.innerText.trim())
          }
        };
      } finally { /* Keep Workbench open while its panel tab remains active. */ }
    },
    args: [category, slotIndex]
  });
  if (result?.error) throw new Error(result.error);
  const item = lastToolsScan?.items.find((entry) => entry.category === category && Number(entry.slotIndex) === slotIndex);
  if (!item || !result?.item) return false;
  Object.assign(item, result.item);
  toolCounts.set(item.icon, item.count);
  renderWorkbench();
  renderOverview();
  return true;
}

mapActivityContent.addEventListener('click', async (event) => {
  const scanTools = event.target.closest('[data-ui-action="scan-tools"]');
  if (scanTools) {
    scanToolsButton.click();
    return;
  }
  const button = event.target.closest('[data-tool-craft]');
  if (!button || button.disabled) return;
  const card = button.closest('[data-tool-category][data-tool-slot-index]');
  const category = card?.dataset.toolCategory;
  const slotIndex = Number(card?.dataset.toolSlotIndex);
  const craftLabel = button.dataset.toolCraft;
  if (!category || !Number.isInteger(slotIndex) || !craftLabel) return;
  const buttons = Array.from(card.querySelectorAll('[data-tool-craft]'));
  buttons.forEach((item) => { item.disabled = true; });
  const previous = button.textContent;
  button.textContent = 'Đang mua…';
  const finishLog = startActionLog('Đang mua Tool…');
  let completedMessage = '';
  try {
    const [{ result }] = await executeOnSunflowerTabs({
      func: async (requestedCategory, requestedSlotIndex, requestedCraft) => {
        const sleep = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));
        const workbenchPattern = /\/game-assets\/(?:[^/]+\/)*buildings\/(?:[^/]+\/)*workbench\.(?:webp|png)(?:[?#]|$)/i;
        const workbench = Array.from(document.querySelectorAll('img')).find((image) => workbenchPattern.test(image.currentSrc || image.src || ''));
        const target = workbench?.closest('.cursor-pointer') || workbench?.parentElement;
        const dialogs = () => Array.from(document.querySelectorAll('div.relative.max-h-\\[90vh\\]'));
        const isWorkbenchDialog = (element) => /\b(?:Land|Water|Animal) Tools\b/i.test(element.innerText || '');
        let dialog = dialogs().find(isWorkbenchDialog);
        if (!dialog) {
          if (!target) return { error: 'Không tìm thấy Workbench trên map.' };
          target.click();
          for (let attempt = 0; attempt < 40 && !dialog; attempt += 1) {
            dialog = dialogs().find(isWorkbenchDialog);
            if (!dialog) await sleep(15);
          }
        }
        if (!dialog) return { error: 'Không mở được Workbench.' };
        Array.from(dialog.querySelectorAll('button, div.cursor-pointer')).find((element) => element.textContent.trim() === 'Tools')?.click();
        await sleep(70);
        const heading = Array.from(dialog.querySelectorAll('div')).find((element) => element.textContent.trim() === requestedCategory);
        const slots = Array.from(heading?.nextElementSibling?.querySelectorAll('.bg-brown-600, .bg-brown-700') || []).filter((slot) => slot.querySelector('img[alt="item"]'));
        const slot = slots[requestedSlotIndex];
        if (!slot) return { error: 'Index Tool đã thay đổi. Hãy Quét Tools lại.' };
        slot.click();
        await sleep(40);
        const craftButton = Array.from(dialog.querySelectorAll('button')).find((element) => element.innerText.trim() === requestedCraft && !element.disabled);
        if (!craftButton) return { error: `${requestedCraft} hiện không khả dụng.` };
        craftButton.click();
        const requestedAmount = Number((requestedCraft.match(/\d+/) || ['1'])[0]);
        if (requestedAmount > 10) {
          let confirmationButton;
          for (let attempt = 0; attempt < 40 && !confirmationButton; attempt += 1) {
            confirmationButton = Array.from(document.querySelectorAll('button')).find((element) => element !== craftButton && element.offsetParent !== null && element.innerText.trim() === requestedCraft && !element.disabled && !dialog.contains(element));
            if (!confirmationButton) await sleep(15);
          }
          if (!confirmationButton) {
            return { error: `Không thấy hộp xác nhận ${requestedCraft}.` };
          }
          confirmationButton.click();
        }
        await sleep(180);
        return { crafted: true, amount: Number((requestedCraft.match(/\d+/) || ['1'])[0]) };
      },
      args: [category, slotIndex, craftLabel]
    });
    if (result?.error) throw new Error(result.error);
    if (!result?.crafted) throw new Error('Không thể mua Tool.');
    const purchasedTool = lastToolsScan?.items.find((entry) => entry.category === category && Number(entry.slotIndex) === slotIndex);
    const coinCost = (purchasedTool?.requirements || []).reduce((total, entry) => {
      const value = Number(String(entry.text || '').replace(/,/g, ''));
      return Number.isFinite(value) && value > 0 ? total + value : total;
    }, 0);
    if (Number.isFinite(currentCoins) && coinCost > 0) setCurrentCoins(currentCoins - coinCost * (Number(result.amount) || 1));
    await refreshPurchasedTool(category, slotIndex);
    completedMessage = `Mua thành công x${result.amount || 1} ${purchasedTool?.name || 'Tool'}`;
  } catch (error) {
    logActionError(error.message || 'Mua Tool thất bại.');
    buttons.forEach((item) => { item.disabled = false; });
    button.textContent = previous;
  } finally {
    finishLog(completedMessage);
  }
});

async function selectSeedForPlant(card, seedKind = 'crop') {
  const seedName = card?.dataset.shopSeedName;
  const slotIndex = Number(card?.dataset.shopSlotIndex);
  if (!seedName || !Number.isInteger(slotIndex)) return;
  const selectedSeed = {
    name: seedName.replace(/\s+seed$/i, ''),
    icon: card.querySelector('.shop-item-icon, .seed-picker-icon')?.currentSrc || card.querySelector('.shop-item-icon, .seed-picker-icon')?.src || '',
    count: getSeedCount(seedName),
    isSeed: true
  };
  if (seedKind === 'fruit') selectedFruitSeed = selectedSeed;
  else selectedPlantSeed = selectedSeed;
  plantSeedPicking = false;
  fruitSeedPicking = false;
  setSeedPicking(false);
  if (seedPickerTab) seedPickerTab.hidden = true;
  if (lastBettyScan) renderBettyShop(lastBettyScan);
  renderSeedPicker();
  if (lastScanData) {
    renderCropScan(lastScanData, true);
    renderFruitScan(lastScanData.fruit);
  }
  const returnActivity = seedSelectionReturnActivity;
  seedSelectionReturnActivity = null;
  if (returnActivity) activateMapActivityTab(returnActivity);
  activateToolTab('map');
  try {
    const [{ result }] = await executeOnSunflowerTabs({
      func: async (requestedName, requestedSlotIndex, requestedSeedKind, requestedIcon) => {
        const sleep = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));
        const normalise = (value) => String(value || '').trim().replace(/[_-]/g, ' ').replace(/\s+/g, ' ').toLowerCase();
        const requestedCrop = normalise(requestedName).replace(/\s+seed$/, '');
        const quickColumn = Array.from(document.querySelectorAll('div.flex.flex-col.items-center')).find((column) => Array.from(column.children).filter((child) => child.classList.contains('relative') && child.querySelector('.bg-brown-600 img[alt="item"]')).length >= 3);
        const quickSlots = quickColumn ? Array.from(quickColumn.children).filter((child) => child.classList.contains('relative') && child.querySelector('.bg-brown-600 img[alt="item"]')) : [];
        const matchingQuickSlot = quickSlots.find((slot) => {
          const source = slot.querySelector('.bg-brown-600 img[alt="item"]')?.currentSrc || slot.querySelector('.bg-brown-600 img[alt="item"]')?.src || '';
          const match = source.match(/\/game-assets\/crops\/([^/]+)\/seed\.png/i);
          return requestedSeedKind === 'fruit' ? source === requestedIcon : match && normalise(match[1]) === requestedCrop;
        });
        if (matchingQuickSlot) {
          matchingQuickSlot.querySelector('.bg-brown-600')?.click();
          return { selected: true };
        }
        const marketPattern = /\/game-assets\/(?:[^/]+\/)*buildings\/(?:[^/]+\/)*(?:bettys_)?market\.(?:webp|png)(?:[?#]|$)/i;
        const marketImage = Array.from(document.querySelectorAll('img')).find((image) => marketPattern.test(image.currentSrc || image.src || ''));
        const marketTarget = marketImage?.closest('.cursor-pointer') || marketImage?.parentElement;
        if (!marketTarget) return { selected: false, openedShop: false };
        if (!document.querySelector('#SeasonSeeds')) {
          marketTarget.click();
          await sleep(180);
        }
        if (!document.querySelector('#SeasonSeeds')) Array.from(document.querySelectorAll('div.cursor-pointer, button')).find((element) => element.textContent.trim() === 'Buy')?.click();
        await sleep(80);
        const seasonSeeds = document.querySelector('#SeasonSeeds');
        const slots = seasonSeeds ? Array.from(seasonSeeds.querySelectorAll('.bg-brown-600')).filter((slot) => slot.querySelector('img[alt="item"]')) : [];
        const marketSlot = slots[requestedSlotIndex];
        marketSlot?.click();
        await sleep(35);
        const dialog = seasonSeeds?.closest('div.relative.max-h-\\[90vh\\]') || seasonSeeds?.parentElement?.parentElement?.parentElement;
        dialog?.querySelector('img[src*="/game-assets/icons/close.png"]')?.click();
        return { selected: false, openedShop: Boolean(marketSlot) };
      },
      args: [seedName, slotIndex, seedKind, selectedSeed.icon]
    });
    if (result?.selected) {
      log(`Đã chọn ${seedName} trên thanh chọn nhanh.`);
      renderOverview();
    } else if (result?.openedShop) {
      log(`${seedName} chưa có trên thanh chọn nhanh. Đã mở Betty và chọn hạt này.`);
    } else log(`Không tìm thấy ${seedName} trên thanh chọn nhanh hoặc Betty.`);
  } catch (error) {
    log(error.message || 'Không thể chọn hạt trồng.');
  } finally {
    // Choosing a seed ends the picker flow, so Betty should not remain open on the crop/fruit tab.
    if (typeof closeGameBuilding === 'function') await closeGameBuilding('market');
  }
}

mapActivityContent.addEventListener('click', (event) => {
  const card = event.target.closest('[data-seed-picker-choice]');
  if (!card || (!plantSeedPicking && !fruitSeedPicking)) return;
  selectSeedForPlant(card, card.dataset.seedKind === 'fruit' ? 'fruit' : 'crop');
});

shopResults.addEventListener('click', async (event) => {
  const button = event.target.closest('[data-shop-buy]');
  if (!button) {
    const card = event.target.closest('[data-shop-seed-name]');
    const seedKind = card?.dataset.shopCategory === 'fruit' ? 'fruit' : 'crop';
    const canPick = seedKind === 'fruit' ? fruitSeedPicking : plantSeedPicking;
    if (card && canPick) selectSeedForPlant(card, seedKind);
    return;
  }
  if (button.disabled) return;
  const card = button.closest('[data-shop-seed-name]');
  const seedName = card?.dataset.shopSeedName;
  const slotIndex = Number(card?.dataset.shopSlotIndex);
  const requestedBuy = button.dataset.shopBuy;
  if (!seedName || !requestedBuy || !Number.isInteger(slotIndex)) return;
  const buttons = Array.from(card.querySelectorAll('[data-shop-buy]'));
  buttons.forEach((item) => { item.disabled = true; });
  const previousLabel = button.textContent;
  button.textContent = 'Đang mua…';
  const finishLog = startActionLog('Đang mua hạt…');
  try {
    const [{ result }] = await executeOnSunflowerTabs({
      func: async (requestedName, requestedAction, requestedSlotIndex) => {
        const sleep = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));
        const normalise = (value) => String(value || '').trim().replace(/\s+/g, ' ').toLowerCase();
        const marketPattern = /\/game-assets\/(?:[^/]+\/)*buildings\/(?:[^/]+\/)*(?:bettys_)?market\.(?:webp|png)(?:[?#]|$)/i;
        const marketImage = Array.from(document.querySelectorAll('img')).find((image) => marketPattern.test(image.currentSrc || image.src || ''));
        const marketTarget = marketImage?.closest('.cursor-pointer') || marketImage?.parentElement;
        if (!marketTarget) return { error: 'Không tìm thấy Betty’s Market trên map.' };
        if (!document.querySelector('#SeasonSeeds')) {
          marketTarget.click();
          await sleep(350);
        }
        const buyTab = Array.from(document.querySelectorAll('div.cursor-pointer, button')).find((element) => element.textContent.trim() === 'Buy');
        if (!document.querySelector('#SeasonSeeds')) buyTab?.click();
        await sleep(100);
        const seasonSeeds = document.querySelector('#SeasonSeeds');
        if (!seasonSeeds) return { error: 'Không tìm thấy tab Buy của Betty’s Market.' };
        const dialog = seasonSeeds.closest('div.relative.max-h-\\[90vh\\]') || seasonSeeds.parentElement?.parentElement?.parentElement;
        if (!dialog) return { error: 'Không đọc được cửa sổ Betty’s Market.' };
        const readDetails = () => {
          const details = Array.from(dialog.querySelectorAll('div.flex.flex-col.h-full.justify-between')).find((element) => {
            const title = Array.from(element.querySelectorAll('p')).find((paragraph) => /\bSeed$/i.test(paragraph.textContent.trim()) || /^(Apple|Banana|Blueberry|Lemon|Orange|Grape)(?:\s+(?:Seed|Plant))?$/i.test(paragraph.textContent.trim()));
            return Boolean(title && (element.innerText.includes('in stock') || element.innerText.includes('Sold out') || Array.from(element.querySelectorAll('button')).some((candidate) => /^Buy\s+\d+$/i.test(candidate.innerText.trim()))));
          });
          if (!details) return null;
          const rawName = Array.from(details.querySelectorAll('p')).map((paragraph) => paragraph.textContent.trim()).find((text) => /\bSeed$/i.test(text)) || Array.from(details.querySelectorAll('p')).map((paragraph) => paragraph.textContent.trim()).find((text) => /^(Apple|Banana|Blueberry|Lemon|Orange|Grape)(?:\s+(?:Seed|Plant))?$/i.test(text)) || '';
          const name = /\bSeed$/i.test(rawName) ? rawName : rawName ? `${rawName.replace(/\s+(?:Seed|Plant)$/i, '')} Seed` : '';
          const stockMatch = details.innerText.match(/([\d,.]+)\s+in stock/i);
          const stock = details.innerText.includes('Sold out') ? 0 : Number((stockMatch?.[1] || '0').replace(/,/g, ''));
          const basketFull = /you have too many seeds in your basket/i.test(details.innerText);
          const buttons = Array.from(details.querySelectorAll('button')).filter((candidate) => candidate.offsetParent !== null).map((candidate) => ({ element: candidate, label: candidate.innerText.trim() })).filter((candidate) => /^Buy\s+\d+$/i.test(candidate.label));
          return { details, name, stock: Number.isFinite(stock) ? stock : 0, basketFull, buttons };
        };
        const slots = Array.from(seasonSeeds.querySelectorAll('.bg-brown-600')).filter((slot) => slot.querySelector('img[alt="item"]'));
        const readSlotCount = (slot) => {
          const text = (slot.parentElement?.innerText || slot.parentElement?.textContent || slot.textContent || '').trim().replace(/,/g, '').toLowerCase();
          const match = text.match(/\d+(?:\.\d+)?\s*k?/);
          const value = Number.parseFloat(match?.[0] || '0');
          return Number.isFinite(value) ? Math.round(value * (String(match?.[0] || '').includes('k') ? 1000 : 1)) : 0;
        };
        const slot = slots[requestedSlotIndex];
        if (!slot) {
          dialog.querySelector('img[src*="/game-assets/icons/close.png"]')?.click();
          return { error: 'Index hạt đã thay đổi. Hãy Quét Betty lại.' };
        }
        slot.click();
        await sleep(35);
        let info = readDetails();
        const initialOwned = readSlotCount(slot);
        if (!info || normalise(info.name) !== normalise(requestedName)) {
          dialog.querySelector('img[src*="/game-assets/icons/close.png"]')?.click();
          return { error: 'Index hạt không còn khớp. Hãy Quét Betty lại.' };
        }
        let purchased = 0;
        let basketFull = info.basketFull;
        const waitForDetailsChange = async (previousStock, timeout = 280) => {
          const deadline = Date.now() + timeout;
          let details = readDetails();
          while (details && details.stock === previousStock && !details.basketFull && Date.now() < deadline) {
            await sleep(20);
            details = readDetails();
          }
          return details;
        };
        const buyOnce = async (label) => {
          const before = readDetails();
          if (!before || before.basketFull || before.stock <= 0) return { bought: 0, basketFull: Boolean(before?.basketFull) };
          const buyButton = before.buttons.find((candidate) => candidate.label === label)?.element;
          if (!buyButton || buyButton.disabled) return { bought: 0, basketFull: false };
          buyButton.click();
          const amount = Number(label.match(/\d+/)?.[0]);
          let after;
          // Chỉ Buy X lớn hơn 10 mới mở panel xác nhận. Buy 1 và Buy 10 là giao dịch một click.
          if (amount > 10) {
            const confirmationDeadline = Date.now() + 220;
            let confirmation;
            while (!confirmation && Date.now() < confirmationDeadline) {
              confirmation = Array.from(document.querySelectorAll('[data-headlessui-state="open"], [data-open], [role="dialog"]')).find((panel) => panel.offsetParent !== null && panel !== dialog && !dialog.contains(panel) && /Are you sure you want to spend/i.test(panel.innerText) && Array.from(panel.querySelectorAll('button')).some((candidate) => candidate.offsetParent !== null && candidate.innerText.trim() === label));
              if (!confirmation) await sleep(20);
            }
            const confirmButton = confirmation && Array.from(confirmation.querySelectorAll('button')).find((candidate) => candidate.offsetParent !== null && candidate.innerText.trim() === label);
            if (confirmButton) {
              confirmButton.click();
            }
            after = await waitForDetailsChange(before.stock);
          } else {
            after = await waitForDetailsChange(before.stock);
          }
          return { bought: Math.max(0, before.stock - (after?.stock ?? before.stock)), basketFull: Boolean(after?.basketFull) };
        };
        try {
          if (normalise(requestedAction) === 'buy all') {
            for (let attempts = 0; attempts < 1000; attempts += 1) {
              info = readDetails();
              if (!info || info.stock <= 0 || info.basketFull) { basketFull ||= Boolean(info?.basketFull); break; }
              const numericOptions = info.buttons.map((candidate) => ({ ...candidate, amount: Number(candidate.label.match(/\d+/)?.[0]) })).filter((candidate) => Number.isFinite(candidate.amount) && candidate.amount > 0 && candidate.amount <= info.stock).sort((a, b) => b.amount - a.amount);
              const next = numericOptions.find((candidate) => candidate.amount === 10) || numericOptions[0];
              if (!next) break;
              const outcome = await buyOnce(next.label);
              purchased += outcome.bought;
              basketFull ||= outcome.basketFull;
              if (!outcome.bought) break;
            }
          } else {
            const outcome = await buyOnce(requestedAction);
            purchased += outcome.bought;
            basketFull ||= outcome.basketFull;
          }
          const finalInfo = readDetails();
          return { purchased, basketFull, stock: finalInfo?.stock ?? 0, owned: initialOwned + purchased, buyOptions: finalInfo?.buttons.map((candidate) => candidate.label) || [] };
        } finally {
          dialog.querySelector('img[src*="/game-assets/icons/close.png"]')?.click();
        }
      },
      args: [seedName, requestedBuy, slotIndex]
    });
    if (result?.error) throw new Error(result.error);
    if (result?.basketFull) logActionError('Túi đã đầy, đã dừng mua.');
    if (!result?.purchased && !result?.basketFull) logActionError(`Không thể mua ${seedName}; stock hoặc nút Buy đã thay đổi.`);
    if (result?.purchased && Number.isFinite(currentCoins)) {
      const item = lastBettyScan?.items.find((entry) => entry.name === seedName);
      const unitPrice = Number(String(item?.price || '').replace(/,/g, ''));
      if (Number.isFinite(unitPrice)) setCurrentCoins(currentCoins - unitPrice * result.purchased);
    }
    syncBettyPurchase(seedName, result);
    if (result?.purchased) await refreshConnection();
  } catch (error) {
    logActionError(error.message || 'Mua hạt thất bại.');
    buttons.forEach((item) => { item.disabled = false; });
    button.textContent = previousLabel;
  } finally {
    finishLog();
  }
});

chrome.runtime.onMessage.addListener((message) => {
  if (message.type === 'HARVEST_NPC_MINI_GAME_FAILED') logActionError(`Không thể tự giải mini game ${message.game}: không tìm đủ mục tiêu.`);
  if (message.type === 'HARVEST_CHEST_STARTED' && !message.clicked) logActionError('Gặp mini game Chest nhưng không tìm được ảnh Chest để click.');
});

