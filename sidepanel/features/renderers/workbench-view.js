/* Workbench presentation only. Scanning and crafting stay in the coordinator. */

function renderWorkbench(scan = lastToolsScan) {
  if (!workbenchResults) return;
  const items = scan?.items || [];
  if (!items.length) {
    workbenchResults.innerHTML = '<div class="empty-state">Chưa quét Tools. Mở Workbench rồi bấm Quét Tools.</div>';
    return;
  }
  const categories = ['Land Tools', 'Water Tools', 'Animal Tools'];
  workbenchResults.innerHTML = categories.map((category) => {
    const tools = items.filter((item) => item.category === category);
    if (!tools.length) return '';
    const cards = tools.map((item) => overviewToolCard(item.name, item.icon, item.count)).join('');
    return `<section class="shop-category-section workbench-category-section"><h2>${escapeHtml(category)}</h2><div class="shop-category-grid">${cards}</div></section>`;
  }).join('') || '<div class="empty-state">Không tìm thấy tool trong Workbench.</div>';
}

function toolCanCraft(item, option) {
  const amount = Number((String(option).match(/\d+/) || ['1'])[0]);
  if (item.disabledCraftOptions?.includes(option)) return false;
  return (item.requirements || []).every((entry) => {
    const pair = String(entry.text || '').match(/^\s*([\d,.]+)\s*\/\s*([\d,.]+)\s*$/);
    if (pair) return Number(pair[1].replace(/,/g, '')) + 1e-9 >= Number(pair[2].replace(/,/g, '')) * amount;
    const price = Number(String(entry.text || '').replace(/,/g, ''));
    return !Number.isFinite(price) || !Number.isFinite(currentCoins) || currentCoins + 1e-9 >= price * amount;
  });
}

function toolRequirementMissing(entry) {
  const pair = String(entry.text || '').match(/^\s*([\d,.]+)\s*\/\s*([\d,.]+)\s*$/);
  return Boolean(pair && Number(pair[1].replace(/,/g, '')) + 1e-9 < Number(pair[2].replace(/,/g, '')));
}

function toolCraftTooltip(item, option) {
  const amount = Number((String(option).match(/\d+/) || ['1'])[0]);
  const formatValue = (value) => Number.isFinite(Number(value)) ? Number(value).toLocaleString('en-US', { maximumFractionDigits: 1 }) : String(value);
  const rows = (item.requirements || []).map((entry) => {
    const pair = String(entry.text || '').match(/^\s*([\d,.]+)\s*\/\s*([\d,.]+)\s*$/);
    if (pair) {
      const available = Number(pair[1].replace(/,/g, ''));
      const required = Number(pair[2].replace(/,/g, '')) * amount;
      return `<span class="craft-tooltip-row${available + 1e-9 < required ? ' is-missing' : ''}">${entry.icon ? `<img src="${escapeHtml(entry.icon)}" alt="" />` : ''}<b>${escapeHtml(`${formatValue(available)}/${formatValue(required)}`)}</b></span>`;
    }
    const price = Number(String(entry.text || '').replace(/,/g, ''));
    if (!Number.isFinite(price) || price <= 0) return '';
    const required = price * amount;
    const available = Number.isFinite(currentCoins) ? currentCoins : '—';
    return `<span class="craft-tooltip-row${Number.isFinite(currentCoins) && currentCoins + 1e-9 < required ? ' is-missing' : ''}">${entry.icon ? `<img src="${escapeHtml(entry.icon)}" alt="" />` : ''}<b>${escapeHtml(`${formatValue(available)}/${formatValue(required)}`)}</b></span>`;
  }).join('');
  return rows ? `<span class="craft-tooltip">${rows}</span>` : '';
}

function toolBuyLabel(option) {
  return String(option).replace(/^Craft\b/i, 'Buy');
}

function overviewToolCard(name, icon, count, category = 'Craft') {
  const item = lastToolsScan?.items.find((entry) => entry.icon === icon);
  if (!item) return `<article class="shop-card overview-tool-card"><b class="shop-tier tool-card-label">TOOL</b><div class="shop-icon-box"><img class="shop-item-icon" src="${escapeHtml(icon)}" alt="" /><b class="crop-quantity">×${escapeHtml(count)}</b></div><div class="shop-card-content"><strong>${escapeHtml(name)}</strong></div><div class="shop-buy-actions scan-tools-actions"><button type="button" data-ui-action="scan-tools">Quét Tools</button></div></article>`;
  const stock = item.soldOut ? 'Stock: 0' : item.stockText || `×${item.count}`;
  const hasMissingRequirement = (item.requirements || []).some(toolRequirementMissing);
  const actions = !item.soldOut ? (item.craftOptions || []).map((option) => `<span class="craft-action"><button type="button" data-tool-craft="${escapeHtml(option)}"${toolCanCraft(item, option) ? '' : ' class="is-insufficient" disabled'}>${escapeHtml(toolBuyLabel(option))}</button>${toolCraftTooltip(item, option)}</span>`).join('') : '';
  return `<article class="shop-card tool-shop-card overview-tool-card ${item.soldOut || hasMissingRequirement ? 'is-unavailable' : ''} ${item.soldOut ? 'is-sold-out' : ''}" data-tool-category="${escapeHtml(item.category)}" data-tool-slot-index="${item.slotIndex}"><b class="shop-tier tool-card-label">TOOL</b><div class="shop-icon-box"><img class="shop-item-icon" src="${escapeHtml(item.icon)}" alt="" /><b class="crop-quantity">×${escapeHtml(item.count)}</b></div><div class="shop-card-content"><strong>${escapeHtml(item.name)}</strong><div class="shop-card-meta"><span>${escapeHtml(stock)}</span>${item.soldOut ? '<span class="tool-sold-out">Sold out</span>' : ''}</div></div>${actions ? `<div class="shop-buy-actions">${actions}</div>` : ''}</article>`;
}

function renderToolsScan(scan) {
  lastToolsScan = scan;
  const items = scan?.items || [];
  if (items.length) {
    toolCounts.clear();
    items.forEach((item) => toolCounts.set(item.icon, Math.max(0, Number(item.count) || 0)));
    toolBagScanned = true;
  }
  renderWorkbench(scan);
  renderOverview();
}

function pickaxeSource(resource) {
  const tool = pickaxeTools[resource];
  if (!tool) return '';
  const sourceMatch = Array.from(toolCounts.keys()).find((source) => tool.pattern.test(source));
  if (sourceMatch) return sourceMatch;
  const wantedName = String(tool.name || '').replace(/[^a-z]/gi, '').toLowerCase();
  return lastToolsScan?.items.find((item) => String(item.name || '').replace(/[^a-z]/gi, '').toLowerCase() === wantedName)?.icon || '';
}

function updateToolCount(icon, count) {
  const nextCount = Math.max(0, Number(count) || 0);
  toolCounts.set(icon, nextCount);
  const scannedTool = lastToolsScan?.items.find((item) => item.icon === icon);
  if (scannedTool) scannedTool.count = nextCount;
  renderWorkbench();
}
