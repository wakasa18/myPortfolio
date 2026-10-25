/**
 * Moonlight that follows the pointer across surfaces marked with [data-spotlight].
 * Writes --mx/--my (pointer position inside the surface) for the inner glow and the glowing border.
 * Surfaces that also carry [data-tilt] get --rx/--ry, a lean of at most MAX_TILT degrees toward the pointer.
 * One delegated listener, one write per frame, fine pointers only (never on touch).
 */
const MAX_TILT = 3.5;

export function startSpotlight(root: HTMLElement) {
  if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return () => {};
  let frame: number | null = null;
  let target: HTMLElement | null = null;
  let x = 0;
  let y = 0;

  const paint = () => {
    frame = null;
    if (!target) return;
    const rect = target.getBoundingClientRect();
    target.style.setProperty("--mx", `${(x - rect.left).toFixed(1)}px`);
    target.style.setProperty("--my", `${(y - rect.top).toFixed(1)}px`);
    if (target.hasAttribute("data-tilt") && rect.width > 0 && rect.height > 0) {
      const nx = Math.min(.5, Math.max(-.5, (x - rect.left) / rect.width - .5));
      const ny = Math.min(.5, Math.max(-.5, (y - rect.top) / rect.height - .5));
      target.style.setProperty("--ry", `${(nx * 2 * MAX_TILT).toFixed(2)}deg`);
      target.style.setProperty("--rx", `${(-ny * 2 * MAX_TILT).toFixed(2)}deg`);
    }
  };
  const onMove = (event: PointerEvent) => {
    if (!(event.target instanceof Element)) return;
    const surface = event.target.closest<HTMLElement>("[data-spotlight]");
    if (!surface) return;
    target = surface;
    x = event.clientX;
    y = event.clientY;
    if (frame === null) frame = requestAnimationFrame(paint);
  };
  // Level the card again when the pointer leaves it.
  const onOut = (event: PointerEvent) => {
    if (!(event.target instanceof Element)) return;
    const surface = event.target.closest<HTMLElement>("[data-spotlight]");
    if (!surface || (event.relatedTarget instanceof Node && surface.contains(event.relatedTarget))) return;
    surface.style.removeProperty("--rx");
    surface.style.removeProperty("--ry");
    if (target === surface && frame !== null) { cancelAnimationFrame(frame); frame = null; }
  };

  root.addEventListener("pointermove", onMove, { passive: true });
  root.addEventListener("pointerout", onOut, { passive: true });
  return () => {
    root.removeEventListener("pointermove", onMove);
    root.removeEventListener("pointerout", onOut);
    if (frame !== null) cancelAnimationFrame(frame);
    root.querySelectorAll<HTMLElement>("[data-tilt]").forEach(surface => { surface.style.removeProperty("--rx"); surface.style.removeProperty("--ry"); });
  };
}
