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
function float32ArrayToAudioArray(arr) {
  return arr.map((arr2) => Array.from(arr2));
}
async function arrayBufferToAudioBuffer(arrayBuffer, audioCtx) {
  return await new Promise((resolve) => audioCtx.decodeAudioData(arrayBuffer, resolve));
}
function arrayBufferToWavBlob(buffer) {
  return new Blob([new DataView(buffer)], { type: "audio/wav" });
}
function toAudioArray(input) {
  if (isAudioBuffer(input)) {
    input = audioBufferToFloat32AudioArray(input);
  }
  if (isFloat32AudioArray(input)) {
    return float32ArrayToAudioArray(input);
  }
  if (isAudioArray(input)) {
    return input;
  }
  throw new Error(`toArray: unconvertible input type: ${input}`);
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
async function toWavBlob(input, audioCtxOrSampleRate) {
  const buffer = await toArrayBuffer(input, audioCtxOrSampleRate);
  return arrayBufferToWavBlob(buffer);
}
async function downloadWav(input, audioCtxOrSampleRate, name) {
  const blob = await toWavBlob(input, audioCtxOrSampleRate);
  downloadBlob(blob, `${name}.wav`);
}
function downloadBlob(blob, name) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  document.body.appendChild(anchor);
  anchor.href = url;
  anchor.download = name;
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

export { downloadBlob, downloadWav, isArrayBuffer, isAudioArray, isAudioBuffer, isFloat32AudioArray, toArrayBuffer, toAudioArray, toAudioBuffer, toFloat32AudioArray, toWavBlob };
//# sourceMappingURL=convert.mjs.map
