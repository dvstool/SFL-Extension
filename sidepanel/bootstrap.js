/* Start only after every feature script has registered its handlers. */

async function bootstrapPanel() {
  const licensed = (await window.licenseManager?.requireActivation?.()) ?? true;
  if (!licensed) return;
  log('Sẵn sàng.');
  await initialisePanelConnection();
}

void bootstrapPanel();
