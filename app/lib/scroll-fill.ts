/**
 * Drives --fill (0 to 1) on a text block while it travels up the viewport.
 * Words light up one by one; the block is fully lit by the time it reaches 35% of the screen.
 */
export function startScrollFill(element: HTMLElement) {
  let frame: number | null = null;

  const update = () => {
    frame = null;
    const viewport = window.innerHeight;
    const start = viewport * 0.9;
    const end = viewport * 0.35;
    const atBottom = window.scrollY + viewport >= document.documentElement.scrollHeight - 2;
    const raw = (start - element.getBoundingClientRect().top) / (start - end);
    const progress = atBottom ? 1 : Math.min(1, Math.max(0, raw));
    element.style.setProperty("--fill", progress.toFixed(3));
  };
  const queue = () => { if (frame === null) frame = requestAnimationFrame(update); };

  element.dataset.fill = "live";
  window.addEventListener("scroll", queue, { passive: true });
  window.addEventListener("resize", queue, { passive: true });
  update();
  return () => {
    window.removeEventListener("scroll", queue);
    window.removeEventListener("resize", queue);
    if (frame !== null) cancelAnimationFrame(frame);
    element.removeAttribute("data-fill");
    element.style.removeProperty("--fill");
  };
}
