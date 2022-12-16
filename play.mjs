function playBuffer(buffer, audioContext) {
  const source = audioContext.createBufferSource();
  source.buffer = buffer;
  source.connect(audioContext.destination);
  source.addEventListener("ended", () => {
    source.disconnect(audioContext.destination);
  });
  source.start();
}

export { playBuffer };
//# sourceMappingURL=play.mjs.map
