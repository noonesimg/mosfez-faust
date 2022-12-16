async function audioSource(audioContext) {
  const device = await navigator.mediaDevices.getUserMedia({
    audio: {
      echoCancellation: false
    }
  });
  return audioContext.createMediaStreamSource(device);
}

export { audioSource };
//# sourceMappingURL=audio-source.mjs.map
