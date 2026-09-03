async function rememberSunflowerTab(tab) {
  if (tab?.id && tab.url?.startsWith('https://sunflower-land.com/')) {
    await chrome.storage.session.set({ sunflowerTabId: tab.id });
  }
}

chrome.runtime.onInstalled.addListener(async () => {
  chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });
  const { readyNotificationsEnabled = true, notificationHeaderIcon } = await chrome.storage.local.get(['readyNotificationsEnabled', 'notificationHeaderIcon']);
  if (readyNotificationsEnabled) {
    await chrome.storage.local.set({ readyNotificationsEnabled: true });
    showReadyNotification('Đã bật thông báo sẵn sàng.', `sfl-extension-reloaded-${Date.now()}`, notificationHeaderIcon || chrome.runtime.getURL('assets/notification-icon.svg'));
  }
});

chrome.tabs.onActivated.addListener(async ({ tabId }) => {
  try { await rememberSunflowerTab(await chrome.tabs.get(tabId)); } catch { /* Tab was closed. */ }
});

chrome.tabs.onUpdated.addListener((_tabId, changeInfo, tab) => {
  if (changeInfo.url || tab.url?.startsWith('https://sunflower-land.com/')) rememberSunflowerTab(tab);
});

chrome.tabs.onRemoved.addListener(async (tabId) => {
  const { sunflowerTabId } = await chrome.storage.session.get('sunflowerTabId');
  if (sunflowerTabId === tabId) await chrome.storage.session.remove('sunflowerTabId');
});

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === 'SUNFLOWER_TAB_CONNECTED') {
    rememberSunflowerTab({ id: message.tabId, url: message.url });
  }
  if (message.type === 'SET_NOTIFICATION_HEADER_ICON' && message.icon) {
    chrome.storage.local.set({ notificationHeaderIcon: message.icon });
  }
  if (message.type === 'SHOW_READY_NOTIFICATION') {
    showReadyNotification(message.message || 'Tiến trình đã sẵn sàng.', message.id || `sfl-ready-${Date.now()}`, message.icon).then(sendResponse);
    return true;
  }
  if (message.type === 'SET_READY_NOTIFICATIONS') {
    (async () => {
      await chrome.storage.local.set({ readyNotificationsEnabled: Boolean(message.enabled) });
      sendResponse({ ok: true });
    })();
    return true;
  }
  if (message.type === 'SCHEDULE_READY_NOTIFICATIONS') {
    scheduleReadyNotifications(message.entries || []);
  }
  if (message.type === 'CANCEL_READY_NOTIFICATION') {
    chrome.alarms.clear(`${readyAlarmPrefix}${message.id}`);
  }
});

const readyAlarmPrefix = 'sfl-ready:';
const notificationIcon = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAAXNSR0IArs4c6QAAAJVJREFUGJV9kDEOwjAMRV8qlop7ZMnEjDKRo3TjPGy9Cdl6ABYykHugbpghTWoq0SdZlr78rW/DgnWhdrEuiNYAOhTWBXk97/ixpw5XjHYB4scegGmYAUzbmFMEkKW2CCA5RYx1oW35xzTMHACm27uJ/npkq0FXMvwEP31Kf6x35hSNUbZiUIM5xfWY3XB76Ic37XzhC+q2Mek2JJOBAAAAAElFTkSuQmCC';
const readyEntryStorageKey = 'readyNotificationEntries';

async function scheduleReadyNotifications(entries) {
  await chrome.storage.local.set({ [readyEntryStorageKey]: Object.fromEntries(entries.map((entry) => [entry.id, entry])) });
  const alarms = await chrome.alarms.getAll();
  await Promise.all(alarms.filter((alarm) => alarm.name.startsWith(readyAlarmPrefix)).map((alarm) => chrome.alarms.clear(alarm.name)));
  const now = Date.now();
  entries.filter((entry) => Number(entry.when) > now + 500).forEach((entry) => {
    chrome.alarms.create(`${readyAlarmPrefix}${entry.id}`, { when: Number(entry.when) });
  });
}

chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (!alarm.name.startsWith(readyAlarmPrefix)) return;
  const { readyNotificationsEnabled } = await chrome.storage.local.get('readyNotificationsEnabled');
  if (!readyNotificationsEnabled) return;
  const title = alarm.name.slice(readyAlarmPrefix.length).split('|')[0] || 'Sunflower Tools';
  const { [readyEntryStorageKey]: entries = {} } = await chrome.storage.local.get(readyEntryStorageKey);
  showReadyNotification(`${title} đã sẵn sàng.`, alarm.name, entries[alarm.name.slice(readyAlarmPrefix.length)]?.icon);
});

async function showReadyNotification(message, id, iconUrl = notificationIcon) {
  try {
    await chrome.notifications.create(id, {
    type: 'basic',
    iconUrl,
    title: 'Sunflower Tools',
    message,
    priority: 2
    });
    return { ok: true };
  } catch (error) {
    console.error('Không thể tạo thông báo Sunflower Tools:', error);
    return { ok: false, error: error?.message || String(error) };
  }
}
