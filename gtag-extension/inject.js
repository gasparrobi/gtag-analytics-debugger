// note: "inject.js" has to be added to web_accessible_resources in manifest.json
window.addEventListener(
  'message',
  (event) => {
    // We only accept messages from ourselves
    if (event.source != window) return;

    if (event.data.type === 'gtag-request') {
      const gtagData = window.dataLayer || null;
      sendGtagData(gtagData);
    }
  },
  false
);

const sendGtagData = (data) => {
  window.postMessage({ type: 'gtag-data', data: JSON.stringify(data) }, '*');
};
