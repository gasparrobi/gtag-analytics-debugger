chrome.devtools.panels.create('GTAGdebugger', null, '/index.html', (panel) => {
  // panel loaded
  panel.onShown.addListener(onPanelShown);
  // panel.onHidden.addListener(onPanelHidden);
});

const onPanelShown = () => {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    lastTabId = tabs[0].id;
    chrome.tabs.sendMessage(lastTabId, { type: 'gtag-bg' });
  });
};
