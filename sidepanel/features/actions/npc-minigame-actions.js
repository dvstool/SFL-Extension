/* NPC mini-game diagnostics, test clicks, and tab lifecycle helpers. */

const NPC_MINI_GAMES = Object.freeze({
  goblin: Object.freeze({ panelTitle: 'Stop the Goblins!', gameName: 'Goblins', assetName: 'goblin' }),
  skeleton: Object.freeze({ panelTitle: 'Stop the Moon Seekers!', gameName: 'Moon Seekers', assetName: 'skeleton' })
});

function errorMessage(error, fallback) {
  return error instanceof Error && error.message ? error.message : fallback;
}

async function withDisabledButton(button, task) {
  if (!button || button.disabled) return undefined;
  button.disabled = true;
  try {
    return await task();
  } finally {
    if (button.isConnected) button.disabled = false;
  }
}

async function testMiniGame(button, marker, name) {
  return withDisabledButton(button, async () => {
    try {
      const [{ result = false } = {}] = await executeOnSunflowerTabs({
        func: (expectedMarker) => Boolean(document.body?.innerText.includes(expectedMarker)),
        args: [marker]
      });
      log(result ? `Đã phát hiện mini game ${name}.` : `Chưa phát hiện mini game ${name}.`);
    } catch (error) {
      log(errorMessage(error, `Không thể kiểm tra ${name}.`));
    }
  });
}

async function inspectMiniGameReactState(button, output, copyButton, panelTitle, gameName) {
  return withDisabledButton(button, async () => {
    try {
      const [{ result = { error: 'Không nhận được dữ liệu mini game.' } } = {}] = await executeOnSunflowerTabs({
        world: 'MAIN',
        func: (requestedPanelTitle, requestedGameName) => {
          const hash = (value) => {
            let hashValue = 2166136261;
            for (let index = 0; index < value.length; index += 1) hashValue = Math.imul(hashValue ^ value.charCodeAt(index), 16777619);
            return (hashValue >>> 0).toString(16).padStart(8, '0');
          };
          const sanitize = (value, depth = 0, seen = new WeakSet()) => {
            if (value == null || ['number', 'boolean'].includes(typeof value)) return value;
            if (typeof value === 'string') return value.startsWith('data:image/') ? `[image ${value.slice(0, 24)}… length=${value.length} hash=${hash(value)}]` : value.slice(0, 500);
            if (typeof value === 'function') return `[function ${value.name || 'anonymous'}]`;
            if (value instanceof Node) return `[DOM ${value.nodeName}]`;
            if (depth >= 3 || typeof value !== 'object') return `[${typeof value}]`;
            if (seen.has(value)) return '[circular]';
            seen.add(value);
            if (Array.isArray(value)) return value.slice(0, 20).map((item) => sanitize(item, depth + 1, seen));
            return Object.keys(value).slice(0, 35).reduce((clean, key) => {
              if (!key.startsWith('_debug')) clean[key] = sanitize(value[key], depth + 1, seen);
              return clean;
            }, {});
          };
          const readReactData = (element) => {
            const inspected = [];
            for (let node = element, depth = 0; node && depth < 12; node = node.parentElement, depth += 1) {
              const keys = Object.getOwnPropertyNames(node);
              const propsKey = keys.find((key) => key.startsWith('__reactProps$'));
              const fiberKey = keys.find((key) => key.startsWith('__reactFiber$') || key.startsWith('__reactInternalInstance$') || key.startsWith('__reactContainer$'));
              const reactKeys = keys.filter((key) => /react|fiber|preact/i.test(key));
              if (reactKeys.length) inspected.push({ depth, node: node.nodeName, keys: reactKeys });
              if (!propsKey && !fiberKey) continue;
              const fiber = fiberKey ? node[fiberKey] : null;
              return sanitize({
                foundAt: { depth, node: node.nodeName, propsKey: propsKey || null, fiberKey: fiberKey || null },
                props: propsKey ? node[propsKey] : null,
                fiber: fiber ? { type: typeof fiber.type === 'string' ? fiber.type : fiber.type?.name || fiber.elementType?.name || null, memoizedProps: fiber.memoizedProps, pendingProps: fiber.pendingProps, memoizedState: fiber.memoizedState } : null,
                inspected
              });
            }
            return { foundAt: null, inspected };
          };
          const panel = Array.from(document.querySelectorAll('[data-headlessui-state="open"]')).find((element) => element.offsetParent !== null && element.innerText.includes(requestedPanelTitle));
          if (!panel) return { error: `Mini game ${requestedGameName} chưa mở.` };
          const grid = Array.from(panel.querySelectorAll('div.flex.flex-wrap.justify-center.items-center')).find((element) => Array.from(element.children).filter((child) => child.classList.contains('cursor-pointer')).length >= 12);
          if (!grid) return { error: `Không tìm thấy lưới 16 ô ${requestedGameName}.` };
          const slots = Array.from(grid.children).filter((child) => child.classList.contains('cursor-pointer'));
          return {
            reactDevToolsHook: Boolean(globalThis.__REACT_DEVTOOLS_GLOBAL_HOOK__),
            slots: slots.map((slot, index) => {
              const image = slot.querySelector('img');
              const source = image?.currentSrc || image?.src || '';
              return { index: index + 1, image: { width: image?.naturalWidth || 0, height: image?.naturalHeight || 0, sourceHash: source ? hash(source) : '', sourceLength: source.length }, slotReact: readReactData(slot), imageReact: image ? readReactData(image) : null };
            })
          };
        },
        args: [panelTitle, gameName]
      });
      if (result?.error) throw new Error(result.error);
      output.value = JSON.stringify(result, null, 2);
      copyButton.disabled = false;
      log(`Đã trích xuất React props/Fiber của ${result.slots.length} ô ${gameName}. Hãy copy dữ liệu gửi lại.`);
    } catch (error) {
      output.value = '';
      copyButton.disabled = true;
      log(errorMessage(error, `Không thể đọc React props của ${gameName}.`));
    }
  });
}

function inspectGoblinReactState() {
  const game = NPC_MINI_GAMES.goblin;
  return inspectMiniGameReactState(inspectGoblinsButton, goblinReactOutput, copyGoblinReactButton, game.panelTitle, game.gameName);
}

function inspectMoonSeekersReactState() {
  const game = NPC_MINI_GAMES.skeleton;
  return inspectMiniGameReactState(inspectMoonSeekersButton, moonSeekersReactOutput, copyMoonSeekersReactButton, game.panelTitle, game.gameName);
}

async function clickOneNpcMiniGame(button, panelTitle, assetName, displayName) {
  return withDisabledButton(button, async () => {
    try {
      const [{ result = { error: 'Không nhận được kết quả click mini game.' } } = {}] = await executeOnSunflowerTabs({
        world: 'MAIN',
        func: (requestedPanelTitle, requestedAssetName, requestedDisplayName) => {
          const panel = Array.from(document.querySelectorAll('[data-headlessui-state="open"]')).find((element) => element.offsetParent !== null && element.innerText.includes(requestedPanelTitle));
          if (!panel) return { error: `Mini game ${requestedDisplayName} chưa mở.` };
          const assetPattern = new RegExp(`/game-assets/npcs/[^/]*${requestedAssetName}`, 'i');
          const images = Array.from(panel.querySelectorAll('img'));
          const targets = images.filter((image) => {
            const propsKey = Object.getOwnPropertyNames(image).find((key) => key.startsWith('__reactProps$'));
            const reactSource = propsKey ? image[propsKey]?.src : '';
            return assetPattern.test(reactSource || image.currentSrc || image.src || '');
          });
          const npc = targets[0];
          if (!npc) return { error: `Không tìm thấy ${requestedDisplayName} trong 16 ô.` };
          const target = npc.closest('.cursor-pointer') || npc.parentElement || npc;
          const rect = npc.getBoundingClientRect();
          const eventOptions = { bubbles: true, cancelable: true, view: window, clientX: rect.left + rect.width / 2, clientY: rect.top + rect.height / 2, button: 0, buttons: 1 };
          ['pointerdown', 'pointerup'].forEach((type) => target.dispatchEvent(typeof PointerEvent === 'function' ? new PointerEvent(type, { ...eventOptions, pointerId: 1, pointerType: 'mouse', isPrimary: true }) : new MouseEvent(type, eventOptions)));
          target.click();
          const propsKey = Object.getOwnPropertyNames(npc).find((key) => key.startsWith('__reactProps$'));
          const source = propsKey ? npc[propsKey]?.src : npc.currentSrc || npc.src || '';
          return { detected: targets.length, name: source.split('/').pop()?.replace(/\.[a-z0-9]+.*$/i, '') || requestedDisplayName, position: images.indexOf(npc) + 1 };
        },
        args: [panelTitle, assetName, displayName]
      });
      if (result?.error) throw new Error(result.error);
      log(`Nhận diện ${result.detected} ${displayName}; đã click ${result.name} (vị trí ảnh ${result.position}) để test.`);
    } catch (error) {
      log(errorMessage(error, `Không thể click ${displayName}.`));
    }
  });
}

function clickOneGoblin() {
  const game = NPC_MINI_GAMES.goblin;
  return clickOneNpcMiniGame(testGoblinsButton, game.panelTitle, game.assetName, 'Goblin');
}

function clickOneSkeleton() {
  const game = NPC_MINI_GAMES.skeleton;
  return clickOneNpcMiniGame(testMoonSeekersButton, game.panelTitle, game.assetName, 'Skeleton');
}

function waitForTabComplete(tabId, timeout = 15000) {
  return new Promise((resolve) => {
    let settled = false;
    const finish = () => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      chrome.tabs.onUpdated.removeListener(listener);
      resolve();
    };
    const listener = (updatedTabId, changeInfo) => {
      if (updatedTabId === tabId && changeInfo.status === 'complete') finish();
    };
    const timer = setTimeout(finish, timeout);
    chrome.tabs.onUpdated.addListener(listener);
  });
}
