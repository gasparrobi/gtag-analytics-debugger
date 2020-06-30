chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.type === 'app-opened') triggerGtag();
  else if (message.type === 'app-reset') triggerReset();
});

const triggerGtagGlobalData = (data) =>
  chrome.runtime.sendMessage({ type: 'gtag-global-data', data });

const triggerGtag = () => {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    if (tabs[0]) chrome.tabs.sendMessage(tabs[0].id, { type: 'gtag-bg' });
  });
};

const triggerReset = () => {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    if (tabs[0]) chrome.tabs.sendMessage(tabs[0].id, { type: 'gtag-reset' });
  });
};

const urlRegex = new RegExp(
  /\.google-analytics\.com\/([rg]\/)?collect(?:[/?]+|$)/
);

chrome.webRequest.onCompleted.addListener(
  (details) => {
    if (urlRegex.test(details.url)) {
      triggerGtag();
    }
    return {};
  },
  { urls: ['<all_urls>'] },
  []
);

chrome.webRequest.onBeforeRequest.addListener(
  function (details) {
    if (urlRegex.test(details.url)) {
      const gtagData = parseRequestBody(details.requestBody);
      triggerGtagGlobalData(JSON.stringify(gtagData));
    }
    return {};
  },
  { urls: ['<all_urls>'] },
  ['requestBody']
);

const decoder = new TextDecoder('utf-8');
const parseRequestBody = (requestBody) => {
  const arrayBuff = requestBody?.raw[0]?.bytes;
  if (!arrayBuff) return null;

  const dataView = new DataView(arrayBuff);
  let detailsString = decoder.decode(dataView);
  detailsString = decodeURIComponent(detailsString);
  const urlVariables = detailsString.split('&');

  let gtagData = urlVariables
    .map((item) => {
      const [key, value] = item.split('=');
      const friendlyKey = lookupParameter(key);

      if (friendlyKey) {
        return {
          [lookupParameter(key)]: value
        };
      } else {
        return null;
      }
    })
    .filter((item) => item !== null);

  return gtagData;
};

const parameters = {
  // v: 'Protocol Version',
  tid: 'Property ID',
  // aip: 'Anonymize IP?',
  // ds: 'Data Source',
  // qt: 'Queue Time',
  // z: 'Cache Buster',
  cid: 'Client ID',
  uid: 'User ID',
  // sc: 'Session Control',
  // uip: 'IP Override',
  // ua: 'User-Agent Override',
  // geoid: 'Geo Override',
  // dr: 'Document Referrer',
  // cn: 'Campaign Name',
  // cs: 'Campaign Source',
  // cm: 'Campaign Medium',
  // ck: 'Campaign Keyword',
  // cc: 'Campaign Content',
  // ci: 'Campaign ID',
  // gclid: 'Adwords ID',
  // dclid: 'Display Ads ID',
  sr: 'Screen Resolution',
  vp: 'Viewport Size',
  // de: 'Document Encoding',
  // sd: 'Color Depth',
  ul: 'User Language',
  // je: 'Java Enabled?',
  // fl: 'Flash Version',
  // t: 'Hit Type',
  // ni: 'Non-Interaction Hit?',
  dl: 'Document Location'
  // dh: 'Document Hostname',
  // dp: 'Document Path',
  // dt: 'Document Title'
  // cd: 'Screen Name',
  // linkid: 'Link ID',
  // an: 'App Name',
  // aid: 'App ID',
  // av: 'App Version',
  // aiid: 'App Installer ID',
  // ec: 'Event Category',
  // ea: 'Event Action',
  // el: 'Event Label',
  // ev: 'Event Value',
  // ti: 'Transaction ID',
  // ta: 'Transaction Affiliation',
  // tr: 'Transaction Revenue',
  // ts: 'Transaction Shipping',
  // tt: 'Transaction Tax',
  // in: 'Item Name',
  // ip: 'Item Price',
  // iq: 'Item Quantity',
  // ic: 'Item Code',
  // iv: 'Item Category',
  // tcc: 'Coupon Code',
  // pal: 'Product Action List',
  // cos: 'Checkout Step',
  // col: 'Checkout Step Option',
  // promoa: 'Promotion Action',
  // cu: 'Currency Code',
  // sn: 'Social Network',
  // sa: 'Social Action',
  // st: 'Social Action Target',
  // utc: 'User Timing Category',
  // utv: 'User Timing Variable',
  // utt: 'User Timing Time',
  // utl: 'User Timing Label',
  // plt: 'Page Load Time',
  // dns: 'DNS Time',
  // pdt: 'Page Download Time',
  // rrt: 'Redirect Response Time',
  // tcp: 'TCP Connect Time',
  // srt: 'Server Response Time',
  // dit: 'DOM Interactive Time',
  // clt: 'Content Load Time',
  // exd: 'Exception Description',
  // exf: 'Exception Fatal?',
  // xid: 'Experiment ID',
  // xvar: 'Experiment Variant',
  // _gmsv: 'Google Mobile Services Version',
  // adid: 'Ad ID',
  // _s: 'Hit Sequence',
  // _v: 'SDK Version',
  // ht: 'Hit Sequence Number',
  // jid: 'Join ID',
  // cg1: 'Content Group 1',
  // cg2: 'Content Group 2',
  // cg3: 'Content Group 3',
  // cg4: 'Content Group 4',
  // cg5: 'Content Group 5',
  // _u: 'Verification Code',
  // a: 'Adsense Link Code'
};

const lookupParameter = (param) => {
  if (parameters[param]) {
    return parameters[param];
  } else {
    return null;
  }
};
