/** Demand-driven loop: paused/offscreen content leaves no animation callback running. */
export function createFrameLoop(
  draw: (deltaMs: number) => void,
  request: (callback: FrameRequestCallback) => number = requestAnimationFrame,
  cancel: (id: number) => void = cancelAnimationFrame,
) {
  let pending: number | null = null;
  let running = false;
  let disposed = false;
  let previous: number | null = null;

  function schedule() {
    if (!disposed && pending === null) pending = request(tick);
  }
  function tick(now: number) {
    pending = null;
    if (disposed) return;
    const delta = running && previous !== null ? Math.min(now - previous, 50) : 0;
    previous = now;
    draw(delta);
    if (running) schedule();
  }
  function cancelPending() {
    if (pending !== null) cancel(pending);
    pending = null;
  }
  return {
    setRunning(value: boolean) {
      if (disposed || running === value) return;
      running = value;
      previous = null;
      if (value) schedule(); else cancelPending();
    },
    requestDraw: schedule,
    dispose() { disposed = true; running = false; cancelPending(); },
  };
}
