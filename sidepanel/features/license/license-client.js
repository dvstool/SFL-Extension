/* License activation and periodic verification for release builds. */

(() => {
  const config = window.SUNFLOWER_LICENSE_CONFIG || {};
  const apiBaseUrl = String(config.apiBaseUrl || '').replace(/\/$/, '');
  const storageKey = 'licenseState';
  const installationKey = 'licenseInstallationId';
  const offlineGraceMs = 3 * 24 * 60 * 60 * 1000;

  function isEnabled() {
    return Boolean(config.enabled && apiBaseUrl);
  }

  function createGate() {
    const gate = document.createElement('section');
    gate.className = 'license-gate';
    gate.hidden = true;
    gate.innerHTML = `
      <div class="license-gate-card">
        <img src="../assets/sunflower-tools-icon.png" alt="" />
        <h2>Kích hoạt Sunflower Tools</h2>
        <p>Nhập key bạn đã nhận để sử dụng extension.</p>
        <label>License key<input id="license-key-input" autocomplete="off" spellcheck="false" placeholder="SFT-XXXX-XXXX-XXXX-XXXX" /></label>
        <button id="license-activate" type="button">Kích hoạt</button>
        <small id="license-message" aria-live="polite"></small>
      </div>`;
    document.body.append(gate);
    return gate;
  }

  async function getInstallationId() {
    const stored = await chrome.storage.local.get(installationKey);
    if (stored[installationKey]) return stored[installationKey];
    const id = crypto.randomUUID();
    await chrome.storage.local.set({ [installationKey]: id });
    return id;
  }

  async function callActivation(key) {
    const installationId = await getInstallationId();
    const response = await fetch(`${apiBaseUrl}/v1/activate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key, installationId, extensionVersion: chrome.runtime.getManifest().version })
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok || !result.active) throw new Error(result.message || 'Key không hợp lệ hoặc đã hết hạn.');
    return result;
  }

  function canUseCachedLicense(state) {
    return state?.active && state?.verifiedAt && Date.now() - state.verifiedAt <= offlineGraceMs
      && (!state.expiresAt || Date.parse(state.expiresAt) > Date.now());
  }

  async function requireActivation() {
    // The owner-only script is Git-ignored and absent from release ZIP files.
    if (window.SUNFLOWER_OWNER_ADMIN) return true;
    if (!isEnabled()) return true;
    const gate = createGate();
    const input = gate.querySelector('#license-key-input');
    const button = gate.querySelector('#license-activate');
    const message = gate.querySelector('#license-message');
    const stored = await chrome.storage.local.get(storageKey);
    const savedState = stored[storageKey];

    try {
      const result = await callActivation(savedState?.key || '');
      await chrome.storage.local.set({ [storageKey]: { key: savedState.key, active: true, verifiedAt: Date.now(), expiresAt: result.expiresAt || null } });
      return true;
    } catch (error) {
      if (canUseCachedLicense(savedState)) return true;
      gate.hidden = false;
      input.value = savedState?.key || '';
      message.textContent = error.message === 'Failed to fetch' ? 'Không thể kết nối máy chủ license. Kiểm tra mạng rồi thử lại.' : error.message;
    }

    return new Promise((resolve) => {
      button.addEventListener('click', async () => {
        const key = input.value.trim().toUpperCase();
        if (!key) { message.textContent = 'Hãy nhập license key.'; return; }
        button.disabled = true;
        message.textContent = 'Đang xác thực…';
        try {
          const result = await callActivation(key);
          await chrome.storage.local.set({ [storageKey]: { key, active: true, verifiedAt: Date.now(), expiresAt: result.expiresAt || null } });
          gate.hidden = true;
          resolve(true);
        } catch (error) {
          message.textContent = error.message === 'Failed to fetch' ? 'Không thể kết nối máy chủ license.' : error.message;
        } finally {
          button.disabled = false;
        }
      });
    });
  }

  window.licenseManager = Object.freeze({ requireActivation, isEnabled });
})();
