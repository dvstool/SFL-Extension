/* Connection discovery and page-script execution boundary. */

function titleCase(value) {
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
}

async function findSunflowerTab() {
  const { sunflowerTabId } = await chrome.storage.session.get('sunflowerTabId');
  if (sunflowerTabId) {
    try {
      const rememberedTab = await chrome.tabs.get(sunflowerTabId);
      if (rememberedTab.url?.startsWith('https://sunflower-land.com/')) return rememberedTab;
    } catch { /* The remembered tab no longer exists. */ }
  }
  const allTabs = await chrome.tabs.query({ url: 'https://sunflower-land.com/*' });
  return allTabs.find((tab) => tab.active) || allTabs[0] || null;
}

async function executeOnSunflowerTabs(injection) {
  const tab = await findSunflowerTab();
  if (!tab?.id) throw new Error('Không tìm thấy tab Sunflower Land đang mở.');
  const result = await chrome.scripting.executeScript({ ...injection, target: { tabId: tab.id } });
  chrome.storage.session.set({ sunflowerTabId: tab.id });
  return result;
}

function renderConnection(tab) {
  const connected = Boolean(tab?.url && new URL(tab.url).hostname === 'sunflower-land.com');
  connectButton.disabled = connected;
  disconnectedContent.hidden = connected;
  connectedContent.hidden = !connected;
  status.className = `connection ${connected ? 'is-connected' : 'is-disconnected'}`;
  status.innerHTML = `<span></span> ${connected ? 'Đã kết nối Sunflower Land' : 'Chưa kết nối Sunflower Land'}`;
  if (!connected) landInfo.textContent = 'Mở Sunflower Land để đọc thông tin land.';
  return connected;
}

async function refreshConnection() {
  try {
    const tab = await findSunflowerTab();
    if (!renderConnection(tab) || !tab?.id) return;
    chrome.runtime.sendMessage({ type: 'SUNFLOWER_TAB_CONNECTED', tabId: tab.id, url: tab.url });
    const [{ result }] = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => {
        const balance = (alt) => {
          const icon = Array.from(document.querySelectorAll('img')).find((image) => image.alt.trim().toLowerCase() === alt.toLowerCase());
          const container = icon?.closest('.flex.items-center');
          return { value: container?.querySelector('.balance-text')?.textContent.trim() || '', icon: icon?.currentSrc || icon?.src || '' };
        };
        return {
          genesis: document.querySelector('#genesisBlock')?.getAttribute('src') || '',
          tree: Array.from(document.querySelectorAll('img')).map((image) => image.currentSrc || image.src || '').find((source) => /\/game-assets\/resources\/tree\/[^/]+\/[^/]+_([^/]+)_tree\.webp/i.test(source)) || '',
          betty: Array.from(document.querySelectorAll('img')).map((image) => image.currentSrc || image.src || '').find((source) => /\/game-assets\/(?:[^/]+\/)*buildings\/(?:[^/]+\/)*(?:bettys_)?market\.(?:webp|png)(?:[?#]|$)/i.test(source)) || '',
          balances: { coins: balance('Coins'), gems: balance('Gems'), flw: balance('FLOWER') }
        };
      }
    });
    const landMatch = result.genesis.match(/\/land\/levels\/([^/]+)(?:\/([^/]+))?\/level_(\d+)\.(?:webp|png)/i);
    const treeMatch = result.tree.match(/\/resources\/tree\/([^/]+)\/([^/_]+)_([^/_]+)_tree\.webp/i);
    const bettyMatch = result.betty.match(/\/game-assets\/([^/]+)\/buildings\//i);
    const landName = landMatch ? `${titleCase(landMatch[1])}.Lv${landMatch[3]}` : bettyMatch ? titleCase(bettyMatch[1]) : treeMatch ? titleCase(treeMatch[3]) : '';
    const displayedSeason = marketSeasonInfo?.season || landMatch?.[2] || treeMatch?.[2];
    const image = result.genesis || result.tree || result.betty;
    const seasonIcon = marketSeasonInfo?.icon || seasonIcons[String(displayedSeason || '').toLowerCase()] || seasonIcons.spring;
    const balances = result.balances || {};
    const scannedCoins = Number(String(balances.coins?.value || '').replace(/,/g, ''));
    if (Number.isFinite(scannedCoins)) setCurrentCoins(scannedCoins);
    const balanceItem = (label, balance) => balance?.value ? `<span class="land-balance"><b>${escapeHtml(balance.value)}</b>${balance.icon ? `<img src="${escapeHtml(balance.icon)}" alt="${label}" />` : label}</span>` : '';
    landInfo.innerHTML = landName ? `<div class="land-details land-info-card"><strong><img class="land-thumbnail" src="${image}" alt="Land" />${landName}</strong>${displayedSeason ? `<span><img class="season-icon" src="${seasonIcon}" alt="Season" />${titleCase(displayedSeason)}</span>` : ''}</div><div class="land-balances land-balance-card">${balanceItem('Coins', balances.coins)}${balanceItem('Gems', balances.gems)}${balanceItem('FLW', balances.flw)}</div>` : 'Không tìm thấy thông tin land.';
    if (lastToolsScan) renderOverview();
    return true;
  } catch {
    renderConnection(null);
    return false;
  }
}

async function initialisePanelConnection() {
  const connected = await refreshConnection();
  if (connected) await scanMap();
}
