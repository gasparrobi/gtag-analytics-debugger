const s = document.createElement('script');
s.src = chrome.runtime.getURL('inject.js');
s.onload = function () {
  this.remove();
};
(document.head || document.documentElement).appendChild(s);

chrome.runtime.onMessage.addListener(function (msg, _, sendResponse) {
  if (msg.type === 'gtag-bg') {
    window.postMessage({ type: 'gtag-request' }, '*');
  } else if (msg.type === 'gtag-reset') {
    window.postMessage({ type: 'gtag-reset' }, '*');
  }
});

window.addEventListener(
  'message',
  (event) => {
    // We only accept messages from ourselves
    if (event.source != window) return;
    if (!event.data.type || !event.data.data) return;

    const { type, data, gtagInfo } = event.data;
    if (type === 'gtag-data') {
      chrome.runtime.sendMessage({
        type: 'gtag-to-panel',
        data
      });
    }
  },
  false
);
