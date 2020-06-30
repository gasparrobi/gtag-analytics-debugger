chrome.devtools.panels.create('GTAGdebugger', null, '/index.html', (panel) => {
  // panel loaded
  panel.onShown.addListener(onPanelShown);
  // panel.onHidden.addListener(onPanelHidden);
});

const onPanelShown = () => {
  chrome.runtime.sendMessage({ type: 'panel-shown' });
};
