'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function playBuffer(buffer, audioContext) {
  const source = audioContext.createBufferSource();
  source.buffer = buffer;
  source.connect(audioContext.destination);
  source.addEventListener("ended", () => {
    source.disconnect(audioContext.destination);
  });
  source.start();
}

exports.playBuffer = playBuffer;
//# sourceMappingURL=play.js.map
