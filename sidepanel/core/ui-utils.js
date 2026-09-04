/*
 * Shared UI primitives.
 *
 * This is deliberately a classic extension script (rather than an ES module)
 * while the legacy coordinator is being split. Its declarations are shared by
 * the scripts loaded after it, so feature migration does not change runtime
 * behaviour.
 */

function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[character]);
}

function formatCountdown(seconds) {
  const value = Math.max(0, Math.ceil(seconds));
  const days = Math.floor(value / 86400);
  const hours = Math.floor((value % 86400) / 3600);
  const minutes = Math.floor((value % 3600) / 60);
  const remainingSeconds = value % 60;
  if (days) return `${days}d ${String(hours).padStart(2, '0')}h ${String(minutes).padStart(2, '0')}m`;
  if (hours) return `${hours}h ${String(minutes).padStart(2, '0')}m ${String(remainingSeconds).padStart(2, '0')}s`;
  if (minutes) return `${minutes}m ${String(remainingSeconds).padStart(2, '0')}s`;
  return `${remainingSeconds}s`;
}

function formatCompactCount(value) {
  if (!Number.isFinite(Number(value))) return value ?? '—';
  const count = Number(value);
  return Math.abs(count) >= 1000 ? `${(count / 1000).toFixed(1).replace(/\.0$/, '')}k` : String(count);
}

function formatExactCount(value) {
  return Number.isFinite(Number(value)) ? Number(value).toLocaleString('en-US') : '—';
}

function log(message) {
  const entry = document.createElement('div');
  entry.textContent = `[${new Date().toLocaleTimeString('vi-VN')}] ${message}`;
  panelLog.prepend(entry);
  while (panelLog.children.length > 40) panelLog.lastElementChild.remove();
  return entry;
}

function startActionLog(message, successMessage = '') {
  const entry = log(message);
  entry.classList.add('is-progress');
  const completedMessage = successMessage || ({
    'Đang khai thác…': 'Khai thác thành công.',
    'Đang chặt cây…': 'Chặt Tree thành công.',
    'Đang trồng…': 'Trồng thành công.',
    'Đang thu hoạch…': 'Thu hoạch thành công.',
    'Đang đốn…': 'Đốn Fruit thành công.',
    'Đang bón phân…': 'Bón phân thành công.',
    'Đang quét Map…': 'Đã quét Map.',
    'Đang quét Betty…': 'Đã quét Betty.',
    'Đang quét Tools…': 'Đã quét Tools.',
    'Đang quét túi đồ…': 'Đã quét túi đồ.',
    'Đang mua hạt…': 'Mua hạt thành công.',
    'Đang mua Tool…': 'Mua Tool thành công.'
  })[message] || 'Hoàn tất.';
  return (...messages) => {
    const failed = entry.dataset.failed === 'true';
    entry.remove();
    if (failed) return;
    const messageToLog = messages.length ? messages[0] : completedMessage;
    if (!messageToLog) return;
    const completed = log(messageToLog);
    completed.classList.add('is-success');
  };
}

function logActionError(message) {
  Array.from(panelLog.querySelectorAll('.is-progress')).at(-1)?.setAttribute('data-failed', 'true');
  const entry = log(message);
  entry.classList.add('is-error');
}
