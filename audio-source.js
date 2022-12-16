'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

async function audioSource(audioContext) {
  const device = await navigator.mediaDevices.getUserMedia({
    audio: {
      echoCancellation: false
    }
  });
  return audioContext.createMediaStreamSource(device);
}

exports.audioSource = audioSource;
//# sourceMappingURL=audio-source.js.map
