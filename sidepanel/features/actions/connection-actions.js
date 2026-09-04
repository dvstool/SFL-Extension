/* Explicit connection and panel reload actions. */

connectButton.addEventListener('click', async () => {
  try {
    let tab = await findSunflowerTab();
    if (!tab?.id) {
      tab = await chrome.tabs.create({ url: 'https://sunflower-land.com/play/', active: false });
      if (!tab.id) throw new Error('Không thể mở tab Sunflower Land.');
      await chrome.storage.session.set({ sunflowerTabId: tab.id });
      log('Đã mở tab Sunflower Land, đang chờ game tải…');
      await waitForTabComplete(tab.id);
    }
    await refreshConnection();
    if (connectButton.disabled) {
      log('Đã kết nối với tab Sunflower Land.');
      await scanMap();
    } else log('Sunflower Land chưa tải xong. Hãy bấm Kết nối lại sau vài giây.');
  } catch (error) {
    log(error.message || 'Không thể kết nối Sunflower Land.');
  }
});

reloadExtensionButton.addEventListener('click', () => {
  reloadExtensionButton.disabled = true;
  reloadExtensionButton.title = 'Đang cập nhật panel…';
  window.location.reload();
});
