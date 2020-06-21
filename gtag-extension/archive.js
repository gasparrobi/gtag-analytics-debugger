const decoder = new TextDecoder('utf-8');
// no need for this because everything is already structured in window.dataLayer
// but will keep it as here it might come in handy later

chrome.webRequest.onBeforeRequest.addListener(
  function (details) {
    if (details.url.indexOf('google-analytics.com/collect') > -1) {
      sendMessage();
      const gtagData = parseRequestBody(details.requestBody);
    }
    return {};
  },
  { urls: ['<all_urls>'] },
  ['requestBody']
);

// started parsing the actual request but it's actually already parsed inside window.dataLayer
const parseRequestBody = (requestBody) => {
  const arrayBuff = requestBody?.raw[0]?.bytes;
  if (!arrayBuff) return null;

  let gtagData = {};

  const dataView = new DataView(arrayBuff);
  let detailsString = decoder.decode(dataView);
  detailsString = decodeURIComponent(detailsString);
  const urlVariables = detailsString.split('&');

  urlVariables.forEach((item) => {
    const [key, value] = item.split('=');
    gtagData[key] = value;
  });

  return gtagData;
};
