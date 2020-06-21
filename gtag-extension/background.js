const triggerGtag = () => {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    console.log(tabs[0]);
    chrome.tabs.sendMessage(tabs[0].id, { type: 'gtag-bg' });
  });
};

chrome.webRequest.onCompleted.addListener(
  (details) => {
    if (details.url.indexOf('google-analytics.com/collect') > -1) {
      triggerGtag();
    }
    return {};
  },
  { urls: ['<all_urls>'] },
  []
);
