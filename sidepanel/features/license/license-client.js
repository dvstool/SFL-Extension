/* License activation and periodic verification for release builds. */

(() => {
  const config = window.SUNFLOWER_LICENSE_CONFIG || {};
  const apiBaseUrl = String(config.apiBaseUrl || '').replace(/\/$/, '');
  const storageKey = 'licenseState';
  const installationKey = 'licenseInstallationId';
  const offlineGraceMs = 3 * 24 * 60 * 60 * 1000;
  const activationTimeoutMs = 12_000;

  function isEnabled() {
    return Boolean(config.enabled && apiBaseUrl);
  }

  function renderLicenseFooter(state, ownerAdmin = false) {
    const footer = document.querySelector('#site-label');
    if (!footer) return;
    const setFooter = (text, key = '') => {
      footer.textContent = text;
      const prefix = String(key || '').slice(0, 8);
      if (!prefix) return;
      footer.append(' · Key: ');
      const keyText = document.createElement('b');
      keyText.textContent = `${prefix}…`;
      footer.append(keyText);
    };
    if (ownerAdmin) { setFooter('♛ ADMIN LOCAL · License không giới hạn'); return; }
    if (!state?.active) { setFooter('License chưa được kích hoạt'); return; }
    if (!state.expiresAt) { setFooter('Hạn dùng: Không giới hạn', state.key); return; }
    const expiresAt = new Date(state.expiresAt);
    if (Number.isNaN(expiresAt.getTime())) { setFooter('Hạn dùng: Không xác định', state.key); return; }
    setFooter(expiresAt <= new Date() ? 'License đã hết hạn' : `Hạn dùng: ${expiresAt.toLocaleString('vi-VN')}`, state.key);
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
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), activationTimeoutMs);
    try {
      const response = await fetch(`${apiBaseUrl}/v1/activate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, installationId, extensionVersion: chrome.runtime.getManifest().version }),
        signal: controller.signal
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || !result.active) throw new Error(result.message || 'Key không hợp lệ hoặc đã hết hạn.');
      return result;
    } catch (error) {
      if (error?.name === 'AbortError') throw new Error('Máy chủ license không phản hồi sau 12 giây. Hãy thử lại.');
      throw error;
    } finally {
      clearTimeout(timeout);
    }
  }

  function activationErrorMessage(error) {
    console.error('License activation failed:', error);
    return error?.message === 'Failed to fetch' ? 'Không thể kết nối máy chủ license. Kiểm tra mạng rồi thử lại.' : (error?.message || 'Không thể xác thực key.');
  }

  function canUseCachedLicense(state) {
    return state?.active && state?.verifiedAt && Date.now() - state.verifiedAt <= offlineGraceMs
      && (!state.expiresAt || Date.parse(state.expiresAt) > Date.now());
  }

  async function requireActivation() {
    // The owner-only script is Git-ignored and absent from release ZIP files.
    if (window.SUNFLOWER_OWNER_ADMIN) { renderLicenseFooter(null, true); return true; }
    if (!isEnabled()) { renderLicenseFooter({ active: true, expiresAt: null }); return true; }
    const gate = createGate();
    const input = gate.querySelector('#license-key-input');
    const button = gate.querySelector('#license-activate');
    const message = gate.querySelector('#license-message');
    const stored = await chrome.storage.local.get(storageKey);
    const savedState = stored[storageKey];
    renderLicenseFooter(savedState);

    try {
      const result = await callActivation(savedState?.key || '');
      const nextState = { key: savedState.key, active: true, verifiedAt: Date.now(), expiresAt: result.expiresAt || null };
      await chrome.storage.local.set({ [storageKey]: nextState });
      renderLicenseFooter(nextState);
      return true;
    } catch (error) {
      if (canUseCachedLicense(savedState)) return true;
      gate.hidden = false;
      input.value = savedState?.key || '';
      message.textContent = activationErrorMessage(error);
    }

    return new Promise((resolve) => {
      button.addEventListener('click', async () => {
        const key = input.value.trim().toUpperCase();
        if (!key) { message.textContent = 'Hãy nhập license key.'; return; }
        button.disabled = true;
        message.textContent = 'Đang xác thực…';
        try {
          const result = await callActivation(key);
          const nextState = { key, active: true, verifiedAt: Date.now(), expiresAt: result.expiresAt || null };
          await chrome.storage.local.set({ [storageKey]: nextState });
          renderLicenseFooter(nextState);
          gate.hidden = true;
          resolve(true);
        } catch (error) {
          message.textContent = activationErrorMessage(error);
        } finally {
          button.disabled = false;
        }
      });
    });
  }

  window.licenseManager = Object.freeze({ requireActivation, isEnabled });
})();
