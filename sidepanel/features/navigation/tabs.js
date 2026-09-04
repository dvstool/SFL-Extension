/* Panel navigation, settings view, and the temporary seed-picker flow. */

let previousToolTab = 'map';
const settingsButton = document.querySelector('#open-settings');
const closeSettingsButton = document.querySelector('#close-settings');

function activateToolTab(tabName) {
  const currentTab = toolTabPanels.find((panel) => !panel.hidden)?.dataset.toolPanel;
  if (tabName === 'settings' && currentTab && currentTab !== 'settings') previousToolTab = currentTab;
  toolTabs.forEach((item) => {
    const active = item.dataset.toolTab === tabName;
    item.classList.toggle('is-active', active);
    item.setAttribute('aria-selected', String(active));
  });
  toolTabPanels.forEach((panel) => { panel.hidden = panel.dataset.toolPanel !== tabName; });
}

function activateMapActivityTab(activity) {
  const previousActivity = mapActivityTabs.find((tab) => tab.classList.contains('is-active'))?.dataset.mapActivityTab || '';
  updateMapActivityTabIndicators();
  mapActivityTabs.forEach((tab) => {
    const active = tab.dataset.mapActivityTab === activity;
    tab.classList.toggle('is-active', active);
    tab.setAttribute('aria-selected', String(active));
  });
  mapActivityContent.querySelectorAll('.activity-group').forEach((group) => { group.hidden = group.dataset.activity !== activity; });
  mapActivityContent.querySelectorAll('.crop-panel').forEach((panel) => { panel.hidden = !panel.querySelector('.activity-group:not([hidden])'); });
  mapActivityContent.querySelectorAll('.empty-state').forEach((state) => { state.hidden = activity !== 'crop' && state.dataset.activity !== activity; });
  updateBettyActivityFilter(activity);
  updateWorkbenchActivityFilter(activity);
  if (typeof syncGameBuildingActivity === 'function') void syncGameBuildingActivity(activity, previousActivity);
}

function setSeedPicking(active) {
  document.querySelector('#map-panel')?.classList.toggle('is-picking-seed', active);
}

function beginSeedPicking(kind) {
  const active = mapActivityTabs.find((tab) => tab.classList.contains('is-active'))?.dataset.mapActivityTab;
  seedSelectionReturnActivity = active === 'seeds' ? 'overview' : active;
  plantSeedPicking = kind === 'crop';
  fruitSeedPicking = kind === 'fruit';
  seedPickerKind = kind;
  if (seedPickerTab) {
    seedPickerTab.hidden = false;
    seedPickerTab.textContent = kind === 'fruit' ? 'Hạt Fruit' : 'Hạt Crop';
  }
  setSeedPicking(true);
  renderSeedPicker();
  activateMapActivityTab('seeds');
  if (!lastBettyScan) scanBettyButton.click();
}

function updateMapActivityTabIndicators() {
  mapActivityTabs.forEach((tab) => {
    const activity = tab.dataset.mapActivityTab;
    // Betty Market shows inventory data, not a pending or ready game action.
    if (activity === 'market') {
      tab.classList.remove('has-ready');
      return;
    }
    const readySelector = activity === 'crop' || activity === 'fruit' ? `[data-activity="${activity}"] .crop-card.is-ready, [data-activity="${activity}"] .crop-card.is-empty` : activity === 'tools' ? `[data-activity="tools"] .shop-card` : `[data-activity="${activity}"] .crop-card.is-ready`;
    tab.classList.toggle('has-ready', Boolean(mapActivityContent.querySelector(readySelector)));
  });
}

settingsButton?.addEventListener('click', () => activateToolTab('settings'));
closeSettingsButton?.addEventListener('click', () => activateToolTab(previousToolTab || 'map'));
toolTabs.forEach((tab) => tab.addEventListener('click', () => activateToolTab(tab.dataset.toolTab)));
mapActivityTabs.forEach((tab) => tab.addEventListener('click', () => activateMapActivityTab(tab.dataset.mapActivityTab)));
