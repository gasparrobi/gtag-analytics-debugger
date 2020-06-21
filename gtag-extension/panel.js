import '/vue.js';

chrome.runtime.onMessage.addListener((request) => {
  if (request.type === 'gtag-to-panel') {
  }
});

const app = new Vue({
  el: '#app',
  data: {
    message: 'Hello Vue!'
  }
});
