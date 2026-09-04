/* Fertilising, profession scans, and overview card actions. */

async function fertiliseGrowingCard(card, fertiliserIndex) {
  const cropName = card.dataset.cropName;
  const resource = card.dataset.resource || 'crop';
  const fertiliserSource = (resource === 'fruit' ? fruitFertiliserIcons : cropFertiliserIcons)[fertiliserIndex];
  const timeGroup = Number(card.dataset.timeGroup);
  const expectedCount = Number(card.dataset.count);
  const mapKeys = card.dataset.mapKeys ? card.dataset.mapKeys.split('||').filter(Boolean) : [];
  if (!fertiliserSource || !cropName || !Number.isFinite(timeGroup)) throw new Error('Không xác định được nhóm cây cần bón phân. Hãy quét Map lại.');
  const knownCount = fertiliserCounts.get(fertiliserSource);
  if (knownCount === 0) throw new Error('Không còn loại phân bón này.');
  const tab = await findSunflowerTab();
  if (!tab?.id) throw new Error('Không tìm thấy tab Sunflower Land đang mở.');
  const [{ result }] = await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: async (requestedFertiliser, requestedCrop, requestedGroup, requestedMapKeys, maximum, requestedResource, forceFullBagScan) => {
      const sleep = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));
      const normalise = (value) => value.replace(/[_-]/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
      const parseCount = (value) => {
        const text = String(value || '').trim().toLowerCase().replace(/,/g, '');
        const valueAsNumber = Number.parseFloat(text);
        return Number.isFinite(valueAsNumber) ? Math.floor(valueAsNumber * (text.includes('k') ? 1000 : 1)) : 0;
      };
      const parseSeconds = (text) => {
        const match = String(text || '').replace(/\b(\d+)\s*hsr\b/gi, '$1hrs').match(/\b(?=\d+\s*(?:d(?:ays?)?|h(?:r(?:s)?|ours?)?|m(?:in(?:s)?)?|s(?:ec(?:s)?)?))(?:(\d+)\s*d(?:ays?)?)?\s*(?:(\d+)\s*h(?:r(?:s)?|ours?)?)?\s*(?:(\d+)\s*m(?:in(?:s)?)?)?\s*(?:(\d+)\s*s(?:ec(?:s)?)?)?/i);
        if (!match || (!match[1] && !match[2] && !match[3] && !match[4])) return null;
        return Number(match[1] || 0) * 86400 + Number(match[2] || 0) * 3600 + Number(match[3] || 0) * 60 + Number(match[4] || 0);
      };
      const getFertiliserType = (placement) => {
        const sources = Array.from(placement.querySelectorAll('img')).map((image) => image.currentSrc || image.src || '');
        return sources.some((source) => source.startsWith('data:image/webp;base64,UklGRpAAAABXRUJQVlA4TIMAAAAvD0AC')) ? 2
          : sources.some((source) => source.startsWith('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAICAYAAADA+m62')) ? 1
            : sources.some((source) => source.includes('/icons/stopwatch.png')) ? 2
              : sources.some((source) => source.startsWith('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAN')) ? 1 : 0;
      };
      const quickColumn = Array.from(document.querySelectorAll('div.flex.flex-col.items-center')).find((column) => Array.from(column.children).filter((child) => child.classList.contains('relative') && child.querySelector('.bg-brown-600 img[alt="item"]')).length >= 3);
      const quickSlots = quickColumn ? Array.from(quickColumn.children).filter((child) => child.classList.contains('relative') && child.querySelector('.bg-brown-600 img[alt="item"]')) : [];
      const quickSlotFor = (source) => quickSlots.find((slot) => {
        const image = slot.querySelector('.bg-brown-600 img[alt="item"]');
        return (image?.currentSrc || image?.src || '') === source;
      });
      const selectedQuickSlot = quickSlots.find((slot) => slot.querySelector('img[src*="/game-assets/ui/select/selectbox_"]')) || quickSlots[0];
      const selectedQuickImage = selectedQuickSlot?.querySelector('.bg-brown-600 img[alt="item"]');
      let available = 0;
      let scannedFertilisers = [];
      if (forceFullBagScan) {
        let bagSearch = document.querySelector('input[placeholder="Search here..."]');
        if (!bagSearch) {
          const basket = Array.from(document.querySelectorAll('img[src*="/game-assets/icons/basket.png"]')).find((image) => image.closest('div.relative.flex.mb-2.cursor-pointer'));
          const basketButton = basket?.closest('div.relative.flex.mb-2.cursor-pointer');
          if (!basketButton) return { error: 'Không tìm thấy nút mở túi đồ.' };
          basketButton.click();
          await sleep(400);
          bagSearch = document.querySelector('input[placeholder="Search here..."]');
        }
        const bagRoot = bagSearch?.closest('div.relative.max-h-\\[90vh\\]') || bagSearch?.parentElement?.parentElement?.parentElement;
        const closeBag = () => {
          const closeButton = bagRoot?.querySelector('img[src*="/game-assets/icons/close.png"]') || Array.from(document.querySelectorAll('img[src*="/game-assets/icons/close.png"]')).find((image) => image.closest('div.relative.max-h-\\[90vh\\]'));
          closeButton?.click();
          return Boolean(closeButton);
        };
        const fertiliserHeader = Array.from(document.querySelectorAll('div')).find((element) => element.textContent.trim() === 'Fertilisers');
        const slots = Array.from(fertiliserHeader?.parentElement?.querySelectorAll('.bg-brown-600') || []);
        scannedFertilisers = slots.map((slot) => {
          const image = slot.querySelector('img[alt="item"]');
          return image ? { icon: image.currentSrc || image.src || '', count: parseCount(slot.parentElement?.innerText || slot.parentElement?.textContent || slot.textContent) } : null;
        }).filter(Boolean);
        const fertiliserSlot = slots.find((slot) => {
          const image = slot.querySelector('img[alt="item"]');
          return image && (image.currentSrc || image.src || '') === requestedFertiliser;
        });
        available = fertiliserSlot ? parseCount(fertiliserSlot.textContent) : 0;
        if (!fertiliserSlot || !available) return { error: !fertiliserSlot ? 'Không tìm thấy loại phân bón này trong túi đồ.' : 'Không còn loại phân bón này.', fertiliserMissing: true, scannedFertilisers, closed: closeBag() };
        fertiliserSlot.click();
        await sleep(180);
        if (!closeBag()) return { error: 'Không tìm thấy nút đóng túi đồ.' };
        await sleep(250);
      }
      if ((selectedQuickImage?.currentSrc || selectedQuickImage?.src || '') === requestedFertiliser) {
        available = parseCount(selectedQuickSlot.textContent);
      } else {
        const quickFertiliser = quickSlotFor(requestedFertiliser);
        if (quickFertiliser) {
          quickFertiliser.querySelector('.bg-brown-600')?.click();
          available = parseCount(quickFertiliser.textContent);
          await sleep(180);
        }
      }
      if (!available) {
        const search = document.querySelector('input[placeholder="Search here..."]');
        if (!search) {
        const basket = Array.from(document.querySelectorAll('img[src*="/game-assets/icons/basket.png"]')).find((image) => image.closest('div.relative.flex.mb-2.cursor-pointer'));
        const basketButton = basket?.closest('div.relative.flex.mb-2.cursor-pointer');
        if (!basketButton) return { error: 'Không tìm thấy nút mở túi đồ.' };
        basketButton.click();
        await sleep(400);
        }
        const bagSearch = document.querySelector('input[placeholder="Search here..."]');
        const bagRoot = bagSearch?.closest('div.relative.max-h-\\[90vh\\]') || bagSearch?.parentElement?.parentElement?.parentElement;
        const closeBag = () => {
          const closeButton = bagRoot?.querySelector('img[src*="/game-assets/icons/close.png"]') || Array.from(document.querySelectorAll('img[src*="/game-assets/icons/close.png"]')).find((image) => image.closest('div.relative.max-h-\\[90vh\\]'));
          closeButton?.click();
          return Boolean(closeButton);
        };
        const fertiliserHeader = Array.from(document.querySelectorAll('div')).find((element) => element.textContent.trim() === 'Fertilisers');
        const fertiliserSection = fertiliserHeader?.parentElement;
        const fertiliserSlot = fertiliserSection && Array.from(fertiliserSection.querySelectorAll('.bg-brown-600')).find((slot) => {
          const image = slot.querySelector('img[alt="item"]');
          return image && (image.currentSrc || image.src || '') === requestedFertiliser;
        });
        if (!fertiliserSlot) return { error: 'Không tìm thấy loại phân bón này trong túi đồ.', fertiliserMissing: true, scannedFertilisers, closed: closeBag() };
        available = parseCount(fertiliserSlot.textContent);
        if (!available) return { error: 'Không còn loại phân bón này.', fertiliserMissing: true, scannedFertilisers, closed: closeBag() };
        fertiliserSlot.click();
        await sleep(180);
        if (!closeBag()) return { error: 'Không tìm thấy nút đóng túi đồ.' };
        await sleep(250);
      }
      const requestedName = normalise(requestedCrop).toLowerCase();
      const candidates = Array.from(document.querySelectorAll('div[data-map-placement="true"]')).map((placement) => {
        const cropImage = Array.from(placement.querySelectorAll('img')).find((image) => /\/game-assets\/crops\/([^/]+)\/(seedling|halfway|almost)\.png/i.test(image.currentSrc || image.src || ''));
        const match = cropImage && (cropImage.currentSrc || cropImage.src || '').match(/\/game-assets\/crops\/([^/]+)\/(seedling|halfway|almost)\.png/i);
        const isFruitPatch = Array.from(placement.querySelectorAll('img')).some((image) => /\/game-assets\/(?:[^/]+\/)?fruit\/fruit_patch\.(?:webp|png)(?:[?#]|$)/i.test(image.currentSrc || image.src || ''));
        const seconds = parseSeconds(placement.innerText);
        const group = seconds === null ? null : (Math.floor(seconds / 60) + 1) * 60;
        const fruitSprite = requestedResource === 'fruit' && Array.from(placement.querySelectorAll('img')).find((image) => {
          const source = image.currentSrc || image.src || '';
          return !/fruit_patch|soil2|empty_bar|stopwatch|selectbox|progress|\/game-assets\/ui\//i.test(source);
        });
        const target = requestedResource === 'fruit'
          ? fruitSprite?.parentElement || placement
          : placement.querySelector('.cursor-pointer');
        const placementKey = `${placement.style.top}|${placement.style.left}`;
        const matchesResource = requestedResource === 'fruit' ? isFruitPatch : Boolean(match) && normalise(match[1]).toLowerCase() === requestedName;
        return matchesResource && target && getFertiliserType(placement) === 0 ? { placement, target, placementKey, group } : null;
      }).filter(Boolean);
      const exactTargets = candidates.filter((item) => requestedMapKeys.includes(item.placementKey));
      const targets = (exactTargets.length ? exactTargets : candidates.filter((item) => item.group !== null && Math.abs(item.group - requestedGroup) <= 5)).slice(0, Math.min(available, maximum));
      if (!targets.length) return { error: 'Không còn cây phù hợp trong card này để bón phân. Hãy quét Map lại.' };
      let applied = 0;
      for (const { target } of targets) {
        target.click();
        applied += 1;
        await sleep(100);
      }
      await sleep(300);
      return { applied, remaining: Math.max(0, available - applied), fertilisedKeys: targets.slice(0, applied).map((item) => item.placementKey), scannedFertilisers };
    },
    args: [fertiliserSource, cropName, timeGroup, mapKeys, expectedCount, resource, !fertiliserCounts.has(fertiliserSource)]
  });
  if (Array.isArray(result?.scannedFertilisers)) {
    [...cropFertiliserIcons, ...fruitFertiliserIcons].forEach((icon) => fertiliserCounts.set(icon, 0));
    result.scannedFertilisers.forEach((item) => fertiliserCounts.set(item.icon, item.count));
  }
  if (result?.fertiliserMissing) {
    fertiliserCounts.set(fertiliserSource, 0);
    renderOverview();
  }
  if (result?.error) throw new Error(result.error);
  fertiliserCounts.set(fertiliserSource, result.remaining);
  if (result?.applied) applyFertiliserResult(resource, result.fertilisedKeys || [], fertiliserIndex + 1);
  return result;
}

cropGrowingResults.addEventListener('click', async (event) => {
  const button = event.target.closest('[data-ui-action="fertilise"]');
  if (!button) return;
  const card = button.closest('.crop-card');
  button.disabled = true;
  const finishLog = startActionLog('Đang bón phân…');
  try {
    const result = await fertiliseGrowingCard(card, Number(button.dataset.fertiliserIndex));
    if (!result.applied) logActionError('Không có cây nào được bón phân.');
    renderOverview();
    startCountdowns();
  } catch (error) {
    logActionError(error.message || 'Bón phân thất bại.');
  } finally {
    finishLog();
    button.disabled = false;
  }
});

mapActivityContent.addEventListener('click', async (event) => {
  const button = event.target.closest('[data-ui-action]');
  const action = button?.dataset.uiAction;
  if (!action) return;
  if (action === 'fertilise' && button.closest('#crop-growing-results')) return;
  if (action === 'chop' || action === 'mine') return;
  if (action === 'scan-profession') {
    const scope = button.dataset.scanScope;
    const labels = { crop: 'Crop', fruit: 'Fruit', tree: 'Tree', mining: 'Mining', salt: 'Salt', mushroom: 'Nấm', pet: 'Pet' };
    const label = labels[scope] || 'nghề này';
    const originalLabel = button.textContent;
    button.disabled = true;
    button.textContent = 'Đang quét…';
    const finishLog = startActionLog(`Đang quét ${label}…`);
    try {
      if (!await scanMap(scope)) logActionError(`Không thể quét ${label}.`);
    } catch (error) {
      logActionError(error.message || `Không thể quét ${label}.`);
    } finally {
      finishLog();
      if (button.isConnected) {
        button.disabled = false;
        button.textContent = originalLabel;
      }
    }
    return;
  }
  if (action === 'wake-pet') {
    const card = button.closest('.pet-card');
    const petName = card?.querySelector('.crop-card-title')?.textContent?.trim() || 'Pet';
    button.disabled = true;
    button.textContent = 'Đang đánh thức…';
    const finishLog = startActionLog(`Đang đánh thức ${petName}…`);
    let completedMessage = '';
    try {
      const result = await wakeSleepingPets(card);
      if (!result.awakened) logActionError(`Không tìm thấy ${petName} đang ngủ.`);
      else {
        completedMessage = `Đánh thức x${result.awakened} ${petName}`;
        markPetsAwake(result.awakenedKeys || [], result.awakenedPets || []);
      }
    } catch (error) {
      logActionError(error.message || `Không thể đánh thức ${petName}.`);
    } finally {
      finishLog(completedMessage);
      button.disabled = false;
      button.textContent = 'Đánh thức';
    }
    return;
  }
  if (action === 'harvest-mushrooms') {
    button.disabled = true;
    button.textContent = 'Đang thu hoạch…';
    const finishLog = startActionLog('Đang thu hoạch nấm…');
    try {
      const result = await harvestMushrooms(button.closest('.mushroom-card'));
      if (!result.harvested) logActionError('Không tìm thấy nấm sẵn sàng thu hoạch.');
      refreshAffectedSection(button.closest('.mushroom-card'), ['mushroom']);
    } catch (error) {
      logActionError(error.message || 'Thu hoạch nấm thất bại.');
    } finally {
      finishLog();
      button.disabled = false;
      button.textContent = 'Thu hoạch';
    }
    return;
  }
  if (action === 'harvest-salt') {
    if (!toolBagScanned) {
      scanToolsButton.click();
      log('Đang quét Tools để kiểm tra Salt Rake…');
      return;
    }
    button.disabled = true;
    button.textContent = 'Đang khai thác…';
    const finishLog = startActionLog('Đang khai thác Salt…');
    try {
      const result = await harvestSalt(button.closest('.salt-card'), Number(button.dataset.requestedSaltHits));
      if (!result.used) logActionError('Không có ô Salt sẵn sàng khai thác.');
      else {
        advanceHarvestedSalt(result.processedKeys || [], result.hitsPerSalt);
        renderOverview();
        startCountdowns();
      }
    } catch (error) {
      logActionError(error.message || 'Khai thác Salt thất bại.');
    } finally {
      finishLog();
      button.disabled = false;
      button.innerHTML = `<img src="${escapeHtml(saltRakeSource() || saltRakeFallback)}" alt="Salt Rake" /><span>×${button.dataset.requestedSaltHits || 1}</span>`;
    }
    return;
  }
  if (action === 'upgrade-salt') {
    const card = button.closest('.salt-upgrade-card');
    if (!card) return;
    const originalLabel = button.textContent;
    button.disabled = true;
    button.textContent = 'Đang nâng cấp…';
    const finishLog = startActionLog('Đang nâng cấp Salt…');
    try {
      const result = await upgradeSalt(card, Number(button.dataset.requestedSaltUpgrades));
      saltUpgradeDetails.set(card.dataset.mapKeys || '', { requirements: result.requirements, canUpgrade: result.canUpgrade });
      if (result.failed || !result.upgraded) {
        saltUpgradeFailures.add(card.dataset.mapKeys || '');
        logActionError('Upgrade Salt thất bại: thiếu nguyên liệu hoặc không mở được panel.');
        // Giữ nguyên card trên panel để nút đỏ và tooltip nguyên liệu thiếu vẫn hiển thị.
        renderOverview();
      } else {
        saltUpgradeFailures.delete(card.dataset.mapKeys || '');
        refreshAffectedSection(card, ['salt']);
      }
    } catch (error) {
      saltUpgradeFailures.add(card.dataset.mapKeys || '');
      logActionError(error.message || 'Upgrade Salt thất bại.');
      renderOverview();
    } finally {
      finishLog();
      if (button.isConnected) {
        button.disabled = false;
        button.textContent = originalLabel;
      }
    }
    return;
  }
  if (action === 'scan-composter') {
    button.disabled = true;
    button.textContent = 'Đang quét…';
    const finishLog = startActionLog('Đang quét Composter…');
    try {
      applyComposterStates(await readComposterStates());
      const result = await scanComposterDetails();
      result.details.forEach((detail) => composterDetails.set(detail.mapKey, {
        seconds: detail.seconds,
        requirements: detail.requirements || [],
        recipe: detail.requirements || [],
        canCompost: detail.canCompost
      }));
      if (!result.details.length) logActionError(result.found ? `Composter: click ${result.trace?.clicked || 0}, đọc ${result.trace?.read || 0}, đóng ${result.trace?.closed || 0}.` : 'Không tìm thấy Composter trên DOM game.');
      renderOverview();
      startCountdowns();
    } catch (error) {
      logActionError(error.message || 'Quét Composter thất bại.');
    } finally {
      finishLog();
      if (button.isConnected) {
        button.disabled = false;
        button.textContent = 'Quét compost';
      }
    }
    return;
  }
  if (action === 'collect-composter' || action === 'compost') {
    const label = action === 'collect-composter' ? 'Collect' : 'Compost';
    const composterCard = button.closest('.composter-card');
    button.disabled = true;
    button.textContent = `Đang ${label}…`;
    const finishLog = startActionLog(`Đang ${label} Composter…`);
    try {
      const result = await interactComposters(composterCard, label);
      if (!result.processed) logActionError(`Không có Composter để ${label}.`);
      else if (action === 'collect-composter') moveCollectedCompostersToEmpty(result.processedKeys || []);
      else if (action === 'compost') moveStartedCompostersToGrowing(result.processedKeys || [], result.details || []);
      renderOverview();
      startCountdowns();
    } catch (error) {
      logActionError(error.message || `${label} Composter thất bại.`);
      renderOverview();
    } finally {
      finishLog();
      button.disabled = false;
      button.textContent = label;
    }
    return;
  }
  if (action === 'fertilise') {
    const card = button.closest('.crop-card');
    button.disabled = true;
    const finishLog = startActionLog('Đang bón phân…');
    try {
      const result = await fertiliseGrowingCard(card, Number(button.dataset.fertiliserIndex));
      if (!result.applied) logActionError('Không có cây nào được bón phân.');
      renderOverview();
      startCountdowns();
    } catch (error) {
      logActionError(error.message || 'Bón phân thất bại.');
    } finally {
      finishLog();
      button.disabled = false;
    }
    return;
  }
  if (action === 'harvest') {
    button.disabled = true;
    button.textContent = 'Đang thu hoạch…';
    const finishLog = startActionLog('Đang thu hoạch…');
    try {
      const result = await harvestCrops(button.closest('.crop-card'));
      if (result.stopped) logActionError(`Thu hoạch dừng vì mini game ${result.stopped}.`);
      else if (!result.harvested) logActionError('Không có Crop sẵn sàng thu hoạch.');
      if (result.harvested) {
        moveHarvestedCropsToEmpty(result.harvestedKeys || []);
        renderOverview();
        startCountdowns();
      }
    } catch (error) {
      logActionError(error.message || 'Thu hoạch Crop thất bại.');
    } finally {
      finishLog();
      button.disabled = false;
      button.textContent = 'Thu hoạch';
    }
    return;
  }
  if (action === 'choose-seed') {
    beginSeedPicking('crop');
    log('Chọn trực tiếp một card hạt Crop đã quét.');
    return;
  }
  if (action === 'plant') {
    if (!selectedPlantSeed || !button.dataset.selectedSeed) {
      logActionError('Hãy chọn hạt tại card Chọn hạt trước khi trồng.');
      return;
    }
    const requestedMapKeys = button.closest('.crop-card')?.dataset.mapKeys?.split('||').filter(Boolean) || [];
    button.disabled = true;
    button.textContent = 'Đang trồng…';
    const finishLog = startActionLog('Đang trồng…');
    try {
      const tab = await findSunflowerTab();
      if (!tab?.id) throw new Error('Không tìm thấy tab Sunflower Land đang mở.');
      const [{ result }] = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: async (requestedFertiliserType, requestedSeedName, requestedMapKeys) => {
          const soilSelector = 'img[src*="/game-assets/crops/soil2.png"]';
          const titleCase = (value) => value.replace(/[_-]/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
          const quickSlots = () => {
            const quickSelectColumn = Array.from(document.querySelectorAll('div.flex.flex-col.items-center')).find((column) => Array.from(column.children).filter((child) => child.classList.contains('relative') && child.querySelector('.bg-brown-600 img[alt="item"]')).length >= 3);
            return quickSelectColumn ? Array.from(quickSelectColumn.children).filter((child) => child.classList.contains('relative') && child.querySelector('.bg-brown-600 img[alt="item"]')) : [];
          };
          const requestedCrop = String(requestedSeedName || '').replace(/\s+seed$/i, '').trim().replace(/[_-]/g, ' ').toLowerCase();
          const isRequestedSeed = (source) => {
            const match = source.match(/\/game-assets\/crops\/([^/]+)\/seed\.png/i);
            return Boolean(match && (!requestedCrop || match[1].replace(/[_-]/g, ' ').toLowerCase() === requestedCrop));
          };
          let seedSlot = quickSlots().find((slot) => {
            const source = slot.querySelector('.bg-brown-600 img[alt="item"]')?.currentSrc || slot.querySelector('.bg-brown-600 img[alt="item"]')?.src || '';
            return isRequestedSeed(source);
          });
          if (!seedSlot) {
            let bagSearch = document.querySelector('input[placeholder="Search here..."]');
            if (!bagSearch) {
              const basket = Array.from(document.querySelectorAll('img[src*="/game-assets/icons/basket.png"]')).find((image) => image.closest('div.relative.flex.mb-2.cursor-pointer'));
              basket?.closest('div.relative.flex.mb-2.cursor-pointer')?.click();
              await new Promise((resolve) => setTimeout(resolve, 400));
              bagSearch = document.querySelector('input[placeholder="Search here..."]');
            }
            const bagRoot = bagSearch?.closest('div.relative.max-h-\\[90vh\\]') || bagSearch?.parentElement?.parentElement?.parentElement;
            const bagSeedSlot = Array.from(bagRoot?.querySelectorAll('.bg-brown-600') || []).find((slot) => {
              const source = slot.querySelector('img[alt="item"]')?.currentSrc || slot.querySelector('img[alt="item"]')?.src || '';
              return isRequestedSeed(source);
            });
            if (bagSeedSlot) {
              bagSeedSlot.click();
              await new Promise((resolve) => setTimeout(resolve, 180));
            }
            bagRoot?.querySelector('img[src*="/game-assets/icons/close.png"]')?.click();
            seedSlot = quickSlots().find((slot) => {
              const source = slot.querySelector('.bg-brown-600 img[alt="item"]')?.currentSrc || slot.querySelector('.bg-brown-600 img[alt="item"]')?.src || '';
              return isRequestedSeed(source);
            });
          }
          if (!seedSlot) return { clicked: 0, emptyCounts: [], growing: [], error: `Không tìm thấy ${requestedSeedName} trên thanh chọn nhanh hoặc trong túi đồ.` };
          seedSlot.querySelector('.bg-brown-600')?.click();
          await new Promise((resolve) => setTimeout(resolve, 35));
          const heldItem = seedSlot.querySelector('.bg-brown-600 img[alt="item"]');
          const seedCount = Number((seedSlot.textContent.match(/\d[\d,.]*/)?.[0] || '0').replace(/[^\d]/g, ''));
          if (!seedCount) return { clicked: 0, emptyCounts: [], growing: [], error: 'Không còn hạt giống để trồng.' };
          const seedSource = heldItem.currentSrc || heldItem.src;
          const seedMatch = seedSource.match(/\/crops\/([^/]+)\/seed\.png/i);
          const getFertiliserType = (placement) => {
            const sources = Array.from(placement.querySelectorAll('img')).map((image) => image.currentSrc || image.src || '');
            return sources.some((source) => source.includes('/icons/stopwatch.png')) ? 2 : sources.some((source) => source.startsWith('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAN')) ? 1 : 0;
          };
          const requestedKeys = new Set(requestedMapKeys || []);
          const cropSoilTarget = (placement) => Array.from(placement.querySelectorAll('div')).find((element) => element.classList.contains('cursor-pointer') && element.classList.contains('hover:img-highlight') && element.querySelector(soilSelector));
          const targets = Array.from(document.querySelectorAll('div[data-map-placement="true"]')).map((placement) => {
            const key = `${placement.style.top}|${placement.style.left}`;
            const target = cropSoilTarget(placement);
            return target ? { key, target, fertiliserType: getFertiliserType(placement) } : null;
          }).filter((item) => item && (requestedKeys.size ? requestedKeys.has(item.key) : item.fertiliserType === requestedFertiliserType)).slice(0, seedCount);
          globalThis.__sunflowerToolsPlanting = true;
          globalThis.__sunflowerToolsIgnoreMapMutationsUntil = Date.now() + Math.max(4000, targets.length * 95 + 2000);
          try {
            for (const targetInfo of targets) {
              const placement = Array.from(document.querySelectorAll('div[data-map-placement="true"]')).find((item) => `${item.style.top}|${item.style.left}` === targetInfo.key);
              const currentTarget = placement && cropSoilTarget(placement);
              if (!currentTarget) continue;
              currentTarget.click();
              await new Promise((resolve) => setTimeout(resolve, 60));
            }
          } finally {
            globalThis.__sunflowerToolsPlanting = false;
          }
          const hasRenderedCrop = (placement) => Array.from(placement?.querySelectorAll('img') || []).some((image) => /\/game-assets\/crops\/[^/]+\/(seedling|halfway|almost)\.png/i.test(image.currentSrc || image.src || '')) && /\b\d+\s*(?:h|hr|hrs|hour|hours|m|min|mins|s|sec|secs)\b/i.test(placement?.innerText || '');
          // Chỉ đọc lại đúng các ô vừa trồng; chờ game render timer thực tế trước khi nhóm card.
          const maxPlantRenderAttempts = Math.max(10, Math.min(20, Math.ceil(targets.length / 2)));
          for (let attempt = 0; attempt < maxPlantRenderAttempts; attempt += 1) {
            const refreshedPlacements = Array.from(document.querySelectorAll('div[data-map-placement="true"]'));
            const renderedCount = targets.filter((targetInfo) => hasRenderedCrop(refreshedPlacements.find((item) => `${item.style.top}|${item.style.left}` === targetInfo.key))).length;
            if (renderedCount === targets.length) break;
            await new Promise((resolve) => setTimeout(resolve, 180));
          }
          await new Promise((resolve) => setTimeout(resolve, 80));
          const placements = Array.from(document.querySelectorAll('div[data-map-placement="true"]'));
          const parseSeconds = (text) => {
            const match = text.replace(/\b(\d+)\s*hsr\b/gi, '$1hrs').match(/\b(?=\d+\s*(?:d(?:ays?)?|h(?:r(?:s)?|ours?)?|m(?:in(?:s)?)?|s(?:ec(?:s)?)?))(?:(\d+)\s*d(?:ays?)?)?\s*(?:(\d+)\s*h(?:r(?:s)?|ours?)?)?\s*(?:(\d+)\s*m(?:in(?:s)?)?)?\s*(?:(\d+)\s*s(?:ec(?:s)?)?)?/i);
            if (!match || (!match[1] && !match[2] && !match[3] && !match[4])) return { seconds: null, hasSeconds: false };
            return {
              seconds: Number(match[1] || 0) * 86400 + Number(match[2] || 0) * 3600 + Number(match[3] || 0) * 60 + Number(match[4] || 0),
              hasSeconds: Boolean(match[4])
            };
          };
          const groupingWindow = (seconds) => seconds < 60 ? 20 : seconds < 3600 ? 30 : 60;
          const plantedEntries = [];
          const plantedTargets = [];
          targets.forEach((targetInfo) => {
            const placement = placements.find((item) => `${item.style.top}|${item.style.left}` === targetInfo.key);
            const image = placement && Array.from(placement.querySelectorAll('img')).find((item) => /\/game-assets\/crops\/([^/]+)\/(seedling|halfway|almost)\.png/i.test(item.currentSrc || item.src || ''));
            const match = image && (image.currentSrc || image.src).match(/\/game-assets\/crops\/([^/]+)\/(seedling|halfway|almost)\.png/i);
            if (!match) return;
            plantedTargets.push(targetInfo);
            const tooltipTime = Array.from(placement.querySelectorAll('div.transition-opacity span.font-secondary')).map((element) => element.textContent.trim()).find((text) => /^\d+\s*(?:day|d|hr|h|min|m|sec|s)/i.test(text)) || '';
            const timerText = Array.from(placement.querySelectorAll('span.text-white.text-center.font-pixel')).map((element) => element.textContent.trim()).find((text) => /\d+\s*(?:d|h|m|s)/i.test(text)) || '';
            const time = parseSeconds(tooltipTime || timerText);
            plantedEntries.push({
              label: titleCase(match[1]),
              icon: image.currentSrc || image.src,
              count: 1,
              // Fertiliser state belongs to the empty soil card selected for
              // planting. A newly planted crop must start unfertilised; only
              // an explicit fertilise action can move it to that card.
              fertilised: false,
              fertiliserType: 0,
              bee: false,
              stage: match[2],
              seconds: time.seconds,
              timeGroup: time.seconds ?? 'unknown',
              hasPreciseSeconds: time.hasSeconds,
              mapKeys: [targetInfo.key]
            });
          });
          const plantedGroups = [];
          plantedEntries.sort((left, right) => (right.seconds || 0) - (left.seconds || 0)).forEach((entry) => {
            const group = plantedGroups.find((candidate) => candidate.label === entry.label && candidate.fertiliserType === entry.fertiliserType && ((Number.isFinite(candidate.seconds) && Number.isFinite(entry.seconds) && Math.abs(candidate.seconds - entry.seconds) <= groupingWindow(Math.max(candidate.seconds, entry.seconds))) || (!Number.isFinite(candidate.seconds) && !Number.isFinite(entry.seconds))));
            if (group) {
              group.count += entry.count;
              group.mapKeys.push(...entry.mapKeys);
            } else plantedGroups.push({ ...entry, mapKeys: [...entry.mapKeys] });
          });
          const emptyByType = new Map();
          plantedTargets.forEach(({ fertiliserType }) => emptyByType.set(fertiliserType, (emptyByType.get(fertiliserType) || 0) + 1));
          return { clicked: plantedTargets.length, emptyCounts: Array.from(emptyByType, ([fertiliserType, count]) => ({ fertiliserType, count })), growing: plantedGroups, seedName: seedMatch ? titleCase(seedMatch[1]) : 'Hạt giống', remainingSeeds: Math.max(0, seedCount - plantedTargets.length) };
        },
        args: [Number(button.dataset.targetFertiliserType || 0), button.dataset.selectedSeed || '', requestedMapKeys]
      });
      if (result.error) throw new Error(result.error);
      if (!result.clicked) logActionError('Không tìm thấy ô Crop trống thuộc nhóm đã chọn.');
      applyPlantResult(result);
      if (result.clicked) {
        renderOverview();
        startCountdowns();
      }
    } catch (error) {
      logActionError(error.message || 'Trồng Crop thất bại.');
    } finally {
      finishLog();
      button.disabled = false;
      button.textContent = button.dataset.actionLabel || 'Trồng';
    }
    return;
  }
});

async function testMiniGame(button, marker, name) {
  button.disabled = true;
  try {
    const [{ result }] = await executeOnSunflowerTabs({
      func: (expectedMarker) => document.body.innerText.includes(expectedMarker),
      args: [marker]
    });
    log(result ? `Đã phát hiện mini game ${name}.` : `Chưa phát hiện mini game ${name}.`);
  } catch (error) {
    log(error.message || `Không thể kiểm tra ${name}.`);
  } finally {
    button.disabled = false;
  }
}

async function inspectMiniGameReactState(button, output, copyButton, panelTitle, gameName) {
  button.disabled = true;
  try {
    const [{ result }] = await executeOnSunflowerTabs({
      world: 'MAIN',
      func: (panelTitle, gameName) => {
        const hash = (value) => {
          let output = 2166136261;
          for (let index = 0; index < value.length; index += 1) output = Math.imul(output ^ value.charCodeAt(index), 16777619);
          return (output >>> 0).toString(16).padStart(8, '0');
        };
        const clean = (value, depth = 0, seen = new WeakSet()) => {
          if (value == null || typeof value === 'number' || typeof value === 'boolean') return value;
          if (typeof value === 'string') return value.startsWith('data:image/') ? `[image ${value.slice(0, 24)}… length=${value.length} hash=${hash(value)}]` : value.slice(0, 500);
          if (typeof value === 'function') return `[function ${value.name || 'anonymous'}]`;
          if (value instanceof Node) return `[DOM ${value.nodeName}]`;
          if (depth >= 3 || typeof value !== 'object') return `[${typeof value}]`;
          if (seen.has(value)) return '[circular]';
          seen.add(value);
          if (Array.isArray(value)) return value.slice(0, 20).map((item) => clean(item, depth + 1, seen));
          const result = {};
          Object.keys(value).slice(0, 35).forEach((key) => {
            if (!key.startsWith('_debug')) result[key] = clean(value[key], depth + 1, seen);
          });
          return result;
        };
        const reactData = (element) => {
          const inspected = [];
          for (let node = element, depth = 0; node && depth < 12; node = node.parentElement, depth += 1) {
            const keys = Object.getOwnPropertyNames(node);
            const reactKeys = keys.filter((key) => /react|fiber|preact/i.test(key));
            const propsKey = keys.find((key) => key.startsWith('__reactProps$'));
            const fiberKey = keys.find((key) => key.startsWith('__reactFiber$')) || keys.find((key) => key.startsWith('__reactInternalInstance$')) || keys.find((key) => key.startsWith('__reactContainer$'));
            if (reactKeys.length) inspected.push({ depth, node: node.nodeName, keys: reactKeys });
            if (propsKey || fiberKey) {
              const fiber = fiberKey ? node[fiberKey] : null;
              return clean({
                foundAt: { depth, node: node.nodeName, propsKey: propsKey || null, fiberKey: fiberKey || null },
                props: propsKey ? node[propsKey] : null,
                fiber: fiber ? {
                  type: typeof fiber.type === 'string' ? fiber.type : fiber.type?.name || fiber.elementType?.name || null,
                  memoizedProps: fiber.memoizedProps,
                  pendingProps: fiber.pendingProps,
                  memoizedState: fiber.memoizedState
                } : null,
                inspected
              });
            }
          }
          return { foundAt: null, inspected };
        };
        const panel = Array.from(document.querySelectorAll('[data-headlessui-state="open"]')).find((element) => element.offsetParent !== null && element.innerText.includes(panelTitle));
        if (!panel) return { error: `Mini game ${gameName} chưa mở.` };
        const grid = Array.from(panel.querySelectorAll('div.flex.flex-wrap.justify-center.items-center')).find((element) => Array.from(element.children).filter((child) => child.classList.contains('cursor-pointer')).length >= 12);
        if (!grid) return { error: `Không tìm thấy lưới 16 ô ${gameName}.` };
        const slots = Array.from(grid.children).filter((child) => child.classList.contains('cursor-pointer'));
        return {
          reactDevToolsHook: Boolean(globalThis.__REACT_DEVTOOLS_GLOBAL_HOOK__),
          slots: slots.map((slot, index) => {
            const image = slot.querySelector('img');
            const source = image?.currentSrc || image?.src || '';
            return {
              index: index + 1,
              image: { width: image?.naturalWidth || 0, height: image?.naturalHeight || 0, sourceHash: source ? hash(source) : '', sourceLength: source.length },
              slotReact: reactData(slot),
              imageReact: image ? reactData(image) : null
            };
          })
        };
      },
      args: [panelTitle, gameName]
    });
    if (result.error) throw new Error(result.error);
    output.value = JSON.stringify(result, null, 2);
    copyButton.disabled = false;
    log(`Đã trích xuất React props/Fiber của ${result.slots.length} ô ${gameName}. Hãy copy dữ liệu gửi lại.`);
  } catch (error) {
    output.value = '';
    copyButton.disabled = true;
    log(error.message || `Không thể đọc React props của ${gameName}.`);
  } finally {
    button.disabled = false;
  }
}

function inspectGoblinReactState() {
  return inspectMiniGameReactState(inspectGoblinsButton, goblinReactOutput, copyGoblinReactButton, 'Stop the Goblins!', 'Goblins');
}

function inspectMoonSeekersReactState() {
  return inspectMiniGameReactState(inspectMoonSeekersButton, moonSeekersReactOutput, copyMoonSeekersReactButton, 'Stop the Moon Seekers!', 'Moon Seekers');
}

async function clickOneNpcMiniGame(button, panelTitle, assetName, displayName) {
  button.disabled = true;
  try {
    const [{ result }] = await executeOnSunflowerTabs({
      world: 'MAIN',
      func: (panelTitle, assetName, displayName) => {
        const panel = Array.from(document.querySelectorAll('[data-headlessui-state="open"]')).find((element) => element.offsetParent !== null && element.innerText.includes(panelTitle));
        if (!panel) return { error: `Mini game ${displayName} chưa mở.` };
        const images = Array.from(panel.querySelectorAll('img'));
        const targets = images.filter((image) => {
          const propsKey = Object.getOwnPropertyNames(image).find((key) => key.startsWith('__reactProps$'));
          const reactSource = propsKey ? image[propsKey]?.src : '';
          const source = reactSource || image.currentSrc || image.src || '';
          return new RegExp(`/game-assets/npcs/[^/]*${assetName}`, 'i').test(source);
        });
        const npc = targets[0];
        if (!npc) return { error: `Không tìm thấy ${displayName} trong 16 ô.` };
        const target = npc.closest('.cursor-pointer') || npc.parentElement || npc;
        const rect = npc.getBoundingClientRect();
        const options = { bubbles: true, cancelable: true, view: window, clientX: rect.left + rect.width / 2, clientY: rect.top + rect.height / 2, button: 0, buttons: 1 };
        ['pointerdown', 'pointerup'].forEach((type) => target.dispatchEvent(typeof PointerEvent === 'function' ? new PointerEvent(type, { ...options, pointerId: 1, pointerType: 'mouse', isPrimary: true }) : new MouseEvent(type, options)));
        target.click();
        const propsKey = Object.getOwnPropertyNames(npc).find((key) => key.startsWith('__reactProps$'));
        const source = propsKey ? npc[propsKey]?.src : npc.currentSrc || npc.src || '';
        return {
          clicked: true,
          detected: targets.length,
          name: source.split('/').pop()?.replace(/\.[a-z0-9]+.*$/i, '') || displayName,
          position: images.indexOf(npc) + 1
        };
      },
      args: [panelTitle, assetName, displayName]
    });
    if (result.error) throw new Error(result.error);
    log(`Nhận diện ${result.detected} ${displayName}; đã click ${result.name} (vị trí ảnh ${result.position}) để test.`);
  } catch (error) {
    log(error.message || `Không thể click ${displayName}.`);
  } finally {
    button.disabled = false;
  }
}

function clickOneGoblin() {
  return clickOneNpcMiniGame(testGoblinsButton, 'Stop the Goblins!', 'goblin', 'Goblin');
}

function clickOneSkeleton() {
  return clickOneNpcMiniGame(testMoonSeekersButton, 'Stop the Moon Seekers!', 'skeleton', 'Skeleton');
}

