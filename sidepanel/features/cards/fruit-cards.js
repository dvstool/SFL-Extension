/* Fruit-specific card markup and seed selection card. */

function fruitCard(item, type, heldSeed) {
  const growing = type === 'growing';
  const empty = type === 'empty';
  const dead = type === 'dead';
  const ready = type === 'ready';
  const hasCountdown = growing && Number.isFinite(item.seconds) && item.seconds > 0;
  const state = empty ? 'Đất trống' : dead ? 'Sẵn sàng' : growing ? 'Đang hồi' : 'Sẵn sàng';
  const detail = empty ? (heldSeed ? `${heldSeed.name} ×${heldSeed.count}` : 'Chưa cầm hạt Fruit') : growing ? (hasCountdown ? countdownMarkup(item) : 'Đang cập nhật thời gian…') : dead ? `Axe ×${toolCounts.get(axeIcon) ?? '—'}` : 'Sẵn sàng thu hoạch';
  const fruitName = String(item.label || '').replace(/\s+tree$/i, '').trim();
  const seedIcon = lastBettyScan?.items.find((seed) => /fruit/i.test(seed.category || '') && seed.name.replace(/\s+seed$/i, '').trim().toLowerCase() === fruitName.toLowerCase())?.icon;
  if (empty) {
    const plantCount = Math.min(Number(item.count || 0), getSeedCount(heldSeed));
    const plantLabel = `Trồng x${plantCount}`;
    return `<article class="crop-card fruit-card fruit-soil-card is-empty is-ready" data-resource="fruit" data-crop-name="Đất Fruit trống" data-fertiliser-type="${item.fertiliserType || 0}" data-map-keys="${escapeHtml((item.mapKeys || []).join('||'))}" data-count="${item.count}">${item.fertilised ? `<img class="fertiliser-mark" src="${fertiliserIcon}" alt="Đã bón phân" />` : ''}${item.fertiliserType === 2 ? '<img class="stopwatch-mark" src="https://sunflower-land.com/game-assets/icons/stopwatch.png" alt="Phân bón tăng tốc" />' : ''}<div class="crop-icon-box"><img class="crop-image" src="${escapeHtml(item.icon)}" alt="" /><b class="crop-quantity">×${item.count}</b></div><div class="crop-card-content"><span class="crop-card-state">Đất trống</span><strong class="crop-card-title">Đất Fruit trống</strong></div><div class="crop-card-actions"><button type="button" data-ui-action="${heldSeed ? 'plant-fruit' : 'choose-fruit-seed'}" data-action-label="${plantLabel}"${heldSeed && !plantCount ? ' disabled' : ''}>${heldSeed ? plantLabel : 'Chọn hạt trước'}</button></div></article>`;
  }
  const actions = ready ? '<button type="button" data-ui-action="harvest-fruit">Thu hoạch</button>' : dead ? '<button type="button" data-ui-action="chop-fruit">Chặt</button>' : item.fertilised ? '' : fruitFertiliserIcons.map((icon, index) => `<button class="fertiliser-button" type="button" data-ui-action="fertilise" data-fertiliser-index="${index}" title="Bón phân ${index + 1}"><img src="${icon}" alt="Phân bón ${index + 1}" /><span>×${formatExactCount(fertiliserCounts.get(icon))}</span></button>`).join('');
  return `<article class="crop-card fruit-card is-${type} ${ready || empty || dead ? 'is-ready' : ''}" data-resource="fruit" data-crop-name="${escapeHtml(fruitName)}" data-fertiliser-type="${item.fertiliserType || 0}" data-time-group="${item.timeGroup ?? ''}" data-map-keys="${escapeHtml((item.mapKeys || []).join('||'))}" data-count="${item.count}">${item.fertilised ? `<img class="fertiliser-mark" src="${fertiliserIcon}" alt="Đã bón phân" />` : ''}${item.fertiliserType === 2 ? '<img class="stopwatch-mark" src="https://sunflower-land.com/game-assets/icons/stopwatch.png" alt="Phân bón tăng tốc" />' : ''}<div class="crop-icon-box"><img class="crop-image" src="${escapeHtml(item.icon || seedIcon)}" alt="" /><b class="crop-quantity">×${item.count}</b></div><div class="crop-card-content"><span class="crop-card-state">${state}</span><strong class="crop-card-title">${escapeHtml(fruitName || 'Fruit')}</strong><span class="crop-card-meta">${detail}</span></div>${actions ? `<div class="crop-card-actions">${actions}</div>` : ''}</article>`;
}

function fruitSeedCard(seed) {
  return `<article class="crop-card fruit-card fruit-seed-card is-empty overview-seed-card" data-resource="fruit" data-ui-action="choose-fruit-seed"><div class="crop-icon-box">${seed?.icon ? `<img class="crop-image" src="${escapeHtml(seed.icon)}" alt="" /><b class="crop-quantity">×${getSeedCount(seed)}</b>` : '<span class="empty-seed-placeholder">?</span>'}</div><div class="crop-card-content"><span class="crop-card-state">Hạt trồng</span><strong class="crop-card-title">Hạt trồng</strong><span class="crop-card-meta">${escapeHtml(seed?.name || 'Chưa chọn hạt')}</span></div><span class="seed-card-select-overlay">Chọn hạt</span></article>`;
}
