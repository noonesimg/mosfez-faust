'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var offlineRenderInnerStringified = "\"use strict\";\nObject.defineProperty(exports, \"__esModule\", { value: true });\nfunction audioBufferToWav(buffer, opt) {\n  opt = opt || {};\n  var numChannels = buffer.numberOfChannels;\n  var sampleRate = buffer.sampleRate;\n  var format = opt.float32 ? 3 : 1;\n  var bitDepth = format === 3 ? 32 : 16;\n  var result;\n  if (numChannels === 2) {\n    result = interleave(buffer.getChannelData(0), buffer.getChannelData(1));\n  } else {\n    result = buffer.getChannelData(0);\n  }\n  return encodeWAV(result, format, sampleRate, numChannels, bitDepth);\n}\nfunction encodeWAV(samples, format, sampleRate, numChannels, bitDepth) {\n  var bytesPerSample = bitDepth / 8;\n  var blockAlign = numChannels * bytesPerSample;\n  var buffer = new ArrayBuffer(44 + samples.length * bytesPerSample);\n  var view = new DataView(buffer);\n  writeString(view, 0, \"RIFF\");\n  view.setUint32(4, 36 + samples.length * bytesPerSample, true);\n  writeString(view, 8, \"WAVE\");\n  writeString(view, 12, \"fmt \");\n  view.setUint32(16, 16, true);\n  view.setUint16(20, format, true);\n  view.setUint16(22, numChannels, true);\n  view.setUint32(24, sampleRate, true);\n  view.setUint32(28, sampleRate * blockAlign, true);\n  view.setUint16(32, blockAlign, true);\n  view.setUint16(34, bitDepth, true);\n  writeString(view, 36, \"data\");\n  view.setUint32(40, samples.length * bytesPerSample, true);\n  if (format === 1) {\n    floatTo16BitPCM(view, 44, samples);\n  } else {\n    writeFloat32(view, 44, samples);\n  }\n  return buffer;\n}\nfunction interleave(inputL, inputR) {\n  var length = inputL.length + inputR.length;\n  var result = new Float32Array(length);\n  var index = 0;\n  var inputIndex = 0;\n  while (index < length) {\n    result[index++] = inputL[inputIndex];\n    result[index++] = inputR[inputIndex];\n    inputIndex++;\n  }\n  return result;\n}\nfunction writeFloat32(output, offset, input) {\n  for (var i = 0; i < input.length; i++, offset += 4) {\n    output.setFloat32(offset, input[i], true);\n  }\n}\nfunction floatTo16BitPCM(output, offset, input) {\n  for (var i = 0; i < input.length; i++, offset += 2) {\n    var s = Math.max(-1, Math.min(1, input[i]));\n    output.setInt16(offset, s < 0 ? s * 32768 : s * 32767, true);\n  }\n}\nfunction writeString(view, offset, string) {\n  for (var i = 0; i < string.length; i++) {\n    view.setUint8(offset + i, string.charCodeAt(i));\n  }\n}\nfunction createAudioCtx(audioCtxOrSampleRate) {\n  if (typeof audioCtxOrSampleRate === \"number\") {\n    return new AudioContext({ sampleRate: audioCtxOrSampleRate });\n  }\n  return audioCtxOrSampleRate;\n}\nfunction isObjectType(type, value) {\n  return Object.prototype.toString.call(value) === `[object ${type}]`;\n}\nfunction isAudioArray(value) {\n  return Array.isArray(value) && value.length > 0 && Array.isArray(value[0]);\n}\nfunction isFloat32AudioArray(value) {\n  return Array.isArray(value) && value.length > 0 && isObjectType(\"Float32Array\", value[0]);\n}\nfunction isAudioBuffer(value) {\n  return isObjectType(\"AudioBuffer\", value);\n}\nfunction isArrayBuffer(value) {\n  return isObjectType(\"ArrayBuffer\", value);\n}\nfunction audioArrayToAudioBuffer(channels, audioCtx) {\n  const buffer = audioCtx.createBuffer(channels.length, channels[0].length, audioCtx.sampleRate);\n  for (let channel = 0; channel < buffer.numberOfChannels; channel++) {\n    const nowBuffering = buffer.getChannelData(channel);\n    for (let i = 0; i < buffer.length; i++) {\n      nowBuffering[i] = channels[channel][i];\n    }\n  }\n  return buffer;\n}\nasync function arrayBufferToAudioBuffer(arrayBuffer, audioCtx) {\n  return await new Promise((resolve) => audioCtx.decodeAudioData(arrayBuffer, resolve));\n}\nasync function toAudioBuffer(input, audioCtxOrSampleRate) {\n  if (isAudioBuffer(input)) {\n    return input;\n  }\n  const audioCtx = createAudioCtx(audioCtxOrSampleRate);\n  if (isArrayBuffer(input)) {\n    return arrayBufferToAudioBuffer(input, audioCtx);\n  }\n  if (isAudioArray(input) || isFloat32AudioArray(input)) {\n    return audioArrayToAudioBuffer(input, audioCtx);\n  }\n  throw new Error(`toAudioBuffer: unconvertible input type: ${input}`);\n}\nasync function toArrayBuffer(input, audioCtxOrSampleRate) {\n  if (isArrayBuffer(input)) {\n    return input;\n  }\n  const audioCtx = createAudioCtx(audioCtxOrSampleRate);\n  const buffer = await toAudioBuffer(input, audioCtx);\n  return audioBufferToWav(buffer, { float32: true });\n}\nfunction offlineRenderInner(callback) {\n  return async (params) => {\n    const { channels, length, sampleRate, inputArrayBuffer, props } = params;\n    const offlineContext = new OfflineAudioContext(channels, length, sampleRate);\n    let source;\n    if (inputArrayBuffer) {\n      source = offlineContext.createBufferSource();\n      source.buffer = await toAudioBuffer(inputArrayBuffer, sampleRate);\n    }\n    if (typeof callback !== \"function\") {\n      throw new Error(`functionString must set exports.buildContext`);\n    }\n    await callback(offlineContext, source, props);\n    source?.start();\n    const audioBuffer = await offlineContext.startRendering();\n    const arrayBuffer = await toArrayBuffer(audioBuffer, sampleRate);\n    return [arrayBuffer, [arrayBuffer]];\n  };\n}\nexports.offlineRenderInner = offlineRenderInner;\n";

function audioBufferToWav(buffer, opt) {
  opt = opt || {};
  var numChannels = buffer.numberOfChannels;
  var sampleRate = buffer.sampleRate;
  var format = opt.float32 ? 3 : 1;
  var bitDepth = format === 3 ? 32 : 16;
  var result;
  if (numChannels === 2) {
    result = interleave(buffer.getChannelData(0), buffer.getChannelData(1));
  } else {
    result = buffer.getChannelData(0);
  }
  return encodeWAV(result, format, sampleRate, numChannels, bitDepth);
}
function encodeWAV(samples, format, sampleRate, numChannels, bitDepth) {
  var bytesPerSample = bitDepth / 8;
  var blockAlign = numChannels * bytesPerSample;
  var buffer = new ArrayBuffer(44 + samples.length * bytesPerSample);
  var view = new DataView(buffer);
  writeString(view, 0, "RIFF");
  view.setUint32(4, 36 + samples.length * bytesPerSample, true);
  writeString(view, 8, "WAVE");
  writeString(view, 12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, format, true);
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * blockAlign, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitDepth, true);
  writeString(view, 36, "data");
  view.setUint32(40, samples.length * bytesPerSample, true);
  if (format === 1) {
    floatTo16BitPCM(view, 44, samples);
  } else {
    writeFloat32(view, 44, samples);
  }
  return buffer;
}
function interleave(inputL, inputR) {
  var length = inputL.length + inputR.length;
  var result = new Float32Array(length);
  var index = 0;
  var inputIndex = 0;
  while (index < length) {
    result[index++] = inputL[inputIndex];
    result[index++] = inputR[inputIndex];
    inputIndex++;
  }
  return result;
}
function writeFloat32(output, offset, input) {
  for (var i = 0; i < input.length; i++, offset += 4) {
    output.setFloat32(offset, input[i], true);
  }
}
function floatTo16BitPCM(output, offset, input) {
  for (var i = 0; i < input.length; i++, offset += 2) {
    var s = Math.max(-1, Math.min(1, input[i]));
    output.setInt16(offset, s < 0 ? s * 32768 : s * 32767, true);
  }
}
function writeString(view, offset, string) {
  for (var i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}

function createAudioCtx(audioCtxOrSampleRate) {
  if (typeof audioCtxOrSampleRate === "number") {
    return new AudioContext({ sampleRate: audioCtxOrSampleRate });
  }
  return audioCtxOrSampleRate;
}
function isObjectType(type, value) {
  return Object.prototype.toString.call(value) === `[object ${type}]`;
}
function isAudioArray(value) {
  return Array.isArray(value) && value.length > 0 && Array.isArray(value[0]);
}
function isFloat32AudioArray(value) {
  return Array.isArray(value) && value.length > 0 && isObjectType("Float32Array", value[0]);
}
function isAudioBuffer(value) {
  return isObjectType("AudioBuffer", value);
}
function isArrayBuffer(value) {
  return isObjectType("ArrayBuffer", value);
}
function audioArrayToAudioBuffer(channels, audioCtx) {
  const buffer = audioCtx.createBuffer(channels.length, channels[0].length, audioCtx.sampleRate);
  for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
    const nowBuffering = buffer.getChannelData(channel);
    for (let i = 0; i < buffer.length; i++) {
      nowBuffering[i] = channels[channel][i];
    }
  }
  return buffer;
}
function audioBufferToFloat32AudioArray(audioBuffer) {
  const channels = [];
  for (let i = 0; i < audioBuffer.numberOfChannels; i++) {
    channels.push(audioBuffer.getChannelData(i));
  }
  return channels;
}
function arrayToFloat32AudioArray(arr) {
  return arr.map((arr2) => new Float32Array(arr2));
}
async function arrayBufferToAudioBuffer(arrayBuffer, audioCtx) {
  return await new Promise((resolve) => audioCtx.decodeAudioData(arrayBuffer, resolve));
}
function toFloat32AudioArray(input) {
  if (isFloat32AudioArray(input)) {
    return input;
  }
  if (isAudioArray(input)) {
    return arrayToFloat32AudioArray(input);
  }
  if (isAudioBuffer(input)) {
    return audioBufferToFloat32AudioArray(input);
  }
  throw new Error(`toFloat32AudioArray: unconvertible input type: ${input}`);
}
async function toAudioBuffer(input, audioCtxOrSampleRate) {
  if (isAudioBuffer(input)) {
    return input;
  }
  const audioCtx = createAudioCtx(audioCtxOrSampleRate);
  if (isArrayBuffer(input)) {
    return arrayBufferToAudioBuffer(input, audioCtx);
  }
  if (isAudioArray(input) || isFloat32AudioArray(input)) {
    return audioArrayToAudioBuffer(input, audioCtx);
  }
  throw new Error(`toAudioBuffer: unconvertible input type: ${input}`);
}
async function toArrayBuffer(input, audioCtxOrSampleRate) {
  if (isArrayBuffer(input)) {
    return input;
  }
  const audioCtx = createAudioCtx(audioCtxOrSampleRate);
  const buffer = await toAudioBuffer(input, audioCtx);
  return audioBufferToWav(buffer, { float32: true });
}

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

async function offlineRender(params) {
  const { functionString = "", channels, sampleRate, input, props } = params;
  let { length } = params;
  let inputArrayBuffer;
  let transferrables = [];
  if (input) {
    inputArrayBuffer = await toArrayBuffer(input, sampleRate);
    transferrables = [inputArrayBuffer];
    if (length === void 0) {
      length = toFloat32AudioArray(input)[0]?.length ?? 0;
    }
  }
  const result = await runInIframe({
    functionString: `
      ${offlineRenderInnerStringified}
      ${functionString}
      exports.run = exports.offlineRenderInner(exports.buildContext);
    `,
    params: {
      channels,
      sampleRate,
      inputArrayBuffer,
      length: length ?? 0,
      props
    },
    transferrables
  });
  const audioBuffer = await toAudioBuffer(result, sampleRate);
  return toFloat32AudioArray(audioBuffer);
}

exports.offlineRender = offlineRender;
//# sourceMappingURL=offline-render.js.map
