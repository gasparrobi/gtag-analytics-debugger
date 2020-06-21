// var _port;

// const testConnect = () => {
//   console.log(_port);
//   _port.postMessage({
//     msg: "hello from popup",
//   });
// };

// chrome.runtime.onConnect.addListener(function (port) {
//   console.log(port);
//   console.log("connected to: ", port.name);
//   _port = port;

//   _port.onMessage.addListener(processMessages);
//   _port.postMessage({
//     msg: "hello from popup",
//   });
// });

// document.addEventListener("DOMContentLoaded", function () {
//   document.querySelector("#testConnect").addEventListener("click", testConnect);
// });
