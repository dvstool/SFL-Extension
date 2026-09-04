/* Side-panel composition root: DOM references and shared runtime state. */

const status = document.querySelector('#connection-status');
const siteLabel = document.querySelector('#site-label');
const disconnectedContent = document.querySelector('#disconnected-content');
const connectedContent = document.querySelector('#connected-content');
const landInfo = document.querySelector('#land-info');
const scanMapButton = document.querySelector('#scan-map');
const cropResults = document.querySelector('#crop-results');
const treeResults = document.querySelector('#tree-results');
const miningResults = document.querySelector('#mining-results');
const cropGrowingResults = document.querySelector('#crop-growing-results');
const treeGrowingResults = document.querySelector('#tree-growing-results');
const miningGrowingResults = document.querySelector('#mining-growing-results');
const blockedResults = document.querySelector('#blocked-results');
const panelLog = document.querySelector('#panel-log');
const connectButton = document.querySelector('#connect-button');
const scanFertilisersButton = document.querySelector('#scan-fertilisers');
const scanBettyButton = document.querySelector('#scan-betty');
const scanToolsButton = document.querySelector('#scan-tools');
const shopResults = document.querySelector('#shop-results');
const seedPickerResults = document.querySelector('#seed-picker-results');
const workbenchResults = document.querySelector('#workbench-results');
const marketTabContent = document.querySelector('#market-tab-content');
const workbenchTabContent = document.querySelector('#workbench-tab-content');
const overviewResults = document.querySelector('#overview-results');
const reloadExtensionButton = document.querySelector('#reload-extension');
const codeRelease = document.querySelector('#code-release');
const readyNotificationsToggle = document.querySelector('#ready-notifications');
const mapHoverHighlightsToggle = document.querySelector('#map-hover-highlights');
const notificationStatus = document.querySelector('#notification-status');
const toolTabs = Array.from(document.querySelectorAll('[data-tool-tab]'));
const toolTabPanels = Array.from(document.querySelectorAll('[data-tool-panel]'));
const mapActivityTabs = Array.from(document.querySelectorAll('[data-map-activity-tab]'));
const seedPickerTab = document.querySelector('[data-map-activity-tab="seeds"]');
const mapActivityContent = document.querySelector('#map-activity-content');
const seasonIcons = {
  spring: 'data:image/webp;base64,UklGRmwAAABXRUJQVlA4TF8AAAAvCkADECegoG0bNlQ+fwQmECBDMgygoG0bph/Z+EOa5j8A8Hs8O1+BISTJrmYNLhC8fwQvCCR/rM8Q0f8Acxe23xR7zcRenWSvbyW7zhK73hS91hRWM4HmApoALP5wAAA=',
  summer: 'data:image/webp;base64,UklGRpIAAABXRUJQVlA4TIYAAAAvDoADEDegoG0bpvx5lNj+5aMgbQMmgubf3VHUtg1UICVX9heCaZ/5D4CcuhG2Pf/HENhGkuRkrPNf+oRAXRGA9v8ffE3+OagYIvpPIGmzF7g1gJXXiPJ039V2C8R2Gc1TMckJTMGYUViTM6ZsxKymLlbWpKplg6lRHQXirMX//P46flwfJw==',
  autumn: 'data:image/webp;base64,UklGRpgAAABXRUJQVlA4TIsAAAAvDIADED+gqI0UaHfx7wv+WDgF4EUhI0nM+QOdwjeQZ+hR2kgS8pqhq++/DPLv5j8AEF8LzeukiCe6eJYJbCPbVnKyG+MNfIk/mls/zut/oIiI/k8AIL778dMUAlN0MjVHdJYpll1fOE1z28+t9sn53mhSN3SZYtkOudM+O7+eMC1bJ9jtMYD95ccAAA==',
  winter: 'data:image/webp;base64,UklGRoAAAABXRUJQVlA4THQAAAAvDoADECdApG0z/wLGJ/L4NgiybUYztEkd9mraNmDCs/zfIljzH4D/tyhTAatIsuLMxzMAKCCJgXcI4PKvKg8NEf1X2LYNMmZ4Axj88ROAceo6QFhzE/i0WheI5s2FYVbNFl9R1dIliRS+tOW70x/Xv2AAAA=='
};
const fertiliserIcon = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAANCAMAAACn6Q83AAAABGdBTUEAALGOfPtRkwAAACFQTFRFAAAAwMvcWmmIGBQl////JlxCY8dNJitEeMVop/+Ukv96pgoFnAAAAAt0Uk5TAP////////////99dn3VAAAAOElEQVQImVXMMQ4AMAgCQBck8f8PLqIdZLoEQoRCxoaZ/Koat8Yjm7URgQZwqFPXvGc9cX2ptZcPwv4Cs0IVRlAAAAAASUVORK5CYII=';
const cropFertiliserIcons = [
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAICAYAAADA+m62AAAAAXNSR0IArs4c6QAAAKtJREFUGJVtkLEKglAYhb8b2dLWEkJLlxLa0iVcbGzsYXwOHyoXadExqNAluGjQpgQOtngvCZ7x45z/5xxBrzDwO0YUxYkAENq029oUhwW2NwdApTXr64fbQxHFiZiGgd+dT3sAvt4MgKzNcT2J87Zw5BKgm+gX97wE4PJ64lpywACMsU9yXG3I2nzAjLGpFE2lUGkNgGtJVFobPrhYlLUpoQOaDVqPTfM/0Q81AUYm90CvAwAAAABJRU5ErkJggg==',
  'data:image/webp;base64,UklGRroAAABXRUJQVlA4TK0AAAAvD8ADEE+gkJEk5lQO4BWa1VM9x5M0IzWNpEBn4SowQI00hKLoj9pIUht8B2S2CPqviFGubP4DAPW76xkfokZNJc/nFxEozuCotra4+TvuayEKOoACDgqge1YZDLQWwABJ/LYe3hfR/wkweAmA+5uTAUmeH14Y3EPM7mQkn2PCCPml6Ix7wHGy0vfg9uXatyU4tWXa9lG0T9n2m2jXstUBtWupGpCuvVXQtnz/AgA='
];
const fruitFertiliserIcons = [
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAICAYAAADA+m62AAAAAXNSR0IArs4c6QAAALVJREFUGJVt0LFqwmAUhuEnwaHgItIQMqUVW+jWKeDi2rEX43V4Uy5CbkBopa1T+GsJLjab6RKLAb/x5T2cc75Il8V81rqS5WodQXSWnh4yt19HRToGZaj93A1t3ivL1ToaLOaz9vXlGUybAzjt9oo8sZ2MPE5SaOPzirePAA7bSpwnPQb/YjdpNM2cdvsegwH8flfdXY0iHYvzRBlqN0nTF+EzHGViZahdsvt0qPf1tWouK/oDwkw9oii9HTMAAAAASUVORK5CYII=',
  'data:image/webp;base64,UklGRpAAAABXRUJQVlA4TIMAAAAvD0ACEEegJgDQhDTUICXF9JX5GqmNZIN6/Rf2QagCISWIiDYgfOlezSsmidr8BwAYSSfytmZyK1i/DpvAKLbtJm/19y8OQnOAgTQD/OzpOAAL33cGDxH9nwBgNRMA60TugrUMdOGUkgfPoOeTB7qg75oHMqiseTZbVNbaVCna5PP7BQA='
];
let countdownTimer;
let treeRefreshTimer;
let petSleepTimer;
let petSleepCheckInProgress = false;
let scanMapQueue = Promise.resolve();
let lastScanData;
let marketSeasonInfo;
let selectedPlantSeed;
let lastBettyScan;
let lastToolsScan;
let seedSelectionReturnActivity = null;
let plantSeedPicking = false;
let fruitSeedPicking = false;
let selectedFruitSeed;
let seedPickerKind = 'crop';
let toolBagScanned = false;
let currentCoins = null;
let readyNotificationsEnabled = false;
const sentReadyNotifications = new Set();
const fertiliserCounts = new Map();
const toolCounts = new Map();
const seedInventory = new Map();
const composterDetails = new Map();
const countdownTargets = new Map();
const saltUpgradeFailures = new Set();
const saltUpgradeDetails = new Map();

const cropTiers = new Map();
const axeIcon = 'https://sunflower-land.com/game-assets/tools/axe.png';
const pickaxeTools = {
  stone: { name: 'Pickaxe', fallback: 'https://sunflower-land.com/game-assets/tools/wood_pickaxe.png', pattern: /\/tools\/(?:wood_)?pickaxe\.png(?:[?#]|$)/i },
  iron: { name: 'Stone Pickaxe', fallback: 'https://sunflower-land.com/game-assets/tools/stone_pickaxe.png', pattern: /\/tools\/stone_pickaxe\.png(?:[?#]|$)/i },
  gold: { name: 'Iron Pickaxe', fallback: 'https://sunflower-land.com/game-assets/tools/iron_pickaxe.png', pattern: /\/tools\/iron_pickaxe\.png(?:[?#]|$)/i }
};
const saltRakeFallback = 'https://sunflower-land.com/game-assets/tools/salt_rake.webp';
// Update this timestamp whenever the extension code is released.
const CODE_RELEASED_AT = '04/09/2026 · 20:51';
const beeIcon = 'data:image/webp;base64,UklGRl4AAABXRUJQVlA4TFIAAAAvCcABEC9AEECSRGhzDTfQGmQBJtOYP00iOXRFJmCxNEshuU8y8x+A/1VrdJMUELSNYkXkHODg7ggG4BU8Ef0PEgapbFrZs852/cPsP9DvEGEH';
const saltUpgradeIcon = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAAXNSR0IArs4c6QAAAJVJREFUGJV9kDEOwjAMRV8qlop7ZMnEjDKRo3TjPGy9Cdl6ABYykHugbpghTWoq0SdZlr78rW/DgnWhdrEuiNYAOhTWBXk97/ixpw5XjHYB4scegGmYAUzbmFMEkKW2CCA5RYx1oW35xzTMHACm27uJ/npkq0FXMvwEP31Kf6x35hSNUbZiUIM5xfWY3XB76Ic37XzhC+q2Mek2JJOBAAAAAElFTkSuQmCC';

codeRelease.textContent = CODE_RELEASED_AT;

window.addEventListener('error', (event) => {
  const source = event.filename ? ` (${event.filename.split('/').pop()}:${event.lineno || 0})` : '';
  logActionError(`Lỗi panel: ${event.message || 'Không xác định'}${source}`);
});

window.addEventListener('unhandledrejection', (event) => {
  const reason = event.reason instanceof Error ? event.reason.message : String(event.reason || 'Không xác định');
  logActionError(`Promise bị từ chối: ${reason}`);
});
