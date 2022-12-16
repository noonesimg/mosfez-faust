var runInIframeInnerStringified = "\"use strict\";\nObject.defineProperty(exports, \"__esModule\", { value: true });\nasync function receiveParams() {\n  return new Promise((resolve) => {\n    const messageListener = (message) => {\n      if (message.source !== window.parent || message.origin !== window.location.origin) {\n        return;\n      }\n      window.removeEventListener(\"message\", messageListener);\n      resolve(message.data);\n    };\n    window.addEventListener(\"message\", messageListener);\n  });\n}\nasync function sendResult(result, transferrables) {\n  window.parent.postMessage(result, window.location.origin, transferrables);\n}\nasync function runInIframeInner(callback) {\n  const params = await receiveParams();\n  const [result, transferrables = []] = await callback(params);\n  sendResult(result, transferrables);\n}\nexports.runInIframeInner = runInIframeInner;\n";

async function runInIframe(options) {
  const { functionString, params, transferrables = [] } = options;
  const iframe = document.createElement("iframe");
  iframe.style.display = "none";
  document.body.append(iframe);
  const { contentWindow } = iframe;
  if (!contentWindow)
    throw new Error(`contentWindow not available on iframe`);
  contentWindow.document.write(`<script>
      var exports = {};
      ${functionString}
      ${runInIframeInnerStringified}
      exports.runInIframeInner(exports.run);
    <\/script>`);
  return new Promise((resolve) => {
    const messageListener = (message) => {
      if (message.source !== contentWindow)
        return;
      window.removeEventListener("message", messageListener);
      iframe.remove();
      resolve(message.data);
    };
    window.addEventListener("message", messageListener);
    contentWindow.postMessage(params, window.location.origin, transferrables);
  });
}

export { runInIframe };
//# sourceMappingURL=run-in-iframe.mjs.map
