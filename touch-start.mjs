function touchStart(audioCtx) {
  if (audioCtx.state !== "suspended")
    return;
  const b = document.body;
  const events = ["touchstart", "touchend", "mousedown", "keydown"];
  const clean = () => events.forEach((e) => b.removeEventListener(e, unlock));
  const unlock = () => audioCtx.resume().then(clean);
  events.forEach((e) => b.addEventListener(e, unlock, false));
}

export { touchStart };
//# sourceMappingURL=touch-start.mjs.map
