/**
 * Timing helpers for the About section's education timeline.
 *
 * The line, the travelling spark, the dots and the text are all CSS animations. CSS cannot know where each
 * dot sits along the line, so this measures them and writes --d (ms) on each node: the moment the spark
 * reaches it. It also counts "Year 4 of 4" up from 1 as the spark passes that node.
 *
 * DRAW_MS and EASE mirror --edu-draw and --edu-ease in about-editorial.css; change them together.
 * Everything here is finite and runs once per reveal. No render loop, nothing hidden when it is off.
 */
const DRAW_MS = 1500;
const EASE = [.55, .05, .25, 1] as const;
const NODE_RADIUS = 6.5; // half of the 13px dot
const COUNT_STEP_MS = 240;

/** Fraction of the animation's duration at which a cubic-bezier easing reaches `progress`. */
function timeAtProgress([x1, y1, x2, y2]: readonly [number, number, number, number] | typeof EASE, progress: number) {
  const bezier = (a: number, b: number, s: number) => 3 * (1 - s) * (1 - s) * s * a + 3 * (1 - s) * s * s * b + s * s * s;
  let low = 0;
  let high = 1;
  for (let i = 0; i < 24; i++) {
    const mid = (low + high) / 2;
    if (bezier(y1, y2, mid) < progress) low = mid; else high = mid;
  }
  return bezier(x1, x2, (low + high) / 2);
}

export function startAboutMotion(root: HTMLElement) {
  const education = root.querySelector<HTMLElement>(".about-education");
  if (!education) return () => {};

  const stacked = window.matchMedia("(max-width: 1000px)");
  const counter = education.querySelector<HTMLElement>("[data-count-to]");
  const target = Number(counter?.dataset.countTo) || 0;
  const timers: number[] = [];

  // Where the spark is when it reaches each node. The line lives on .education-path on wide screens,
  // and on the facts row once the layout stacks.
  const measure = () => {
    const rail = education.querySelector<HTMLElement>(stacked.matches ? ".education-facts" : ".education-path");
    const box = rail?.getBoundingClientRect();
    if (!box || !box.width) return;
    education.querySelectorAll<HTMLElement>(".education-study, .education-fact").forEach(node => {
      const rect = node.getBoundingClientRect();
      const progress = Math.min(1, Math.max(0, (rect.left - box.left + NODE_RADIUS) / box.width));
      node.style.setProperty("--d", `${Math.round(timeAtProgress(EASE, progress) * DRAW_MS)}ms`);
    });
  };
  measure();
  const resize = new ResizeObserver(measure);
  resize.observe(education);

  const countUp = () => {
    if (!counter || target < 2) return;
    const node = counter.closest<HTMLElement>(".education-fact");
    const arrival = parseFloat(node?.style.getPropertyValue("--d") || "0") || 0;
    counter.textContent = "1";
    for (let value = 2; value <= target; value++) {
      timers.push(window.setTimeout(() => { counter.textContent = String(value); }, 150 + arrival + (value - 1) * COUNT_STEP_MS));
    }
  };

  // The shared reveal controller flags the block when it scrolls into view.
  let watcher: MutationObserver | null = null;
  if (education.dataset.revealed !== "true") {
    watcher = new MutationObserver(() => {
      if (education.dataset.revealed !== "true") return;
      watcher?.disconnect();
      watcher = null;
      countUp();
    });
    watcher.observe(education, { attributes: true, attributeFilter: ["data-revealed"] });
  }

  return () => {
    resize.disconnect();
    watcher?.disconnect();
    timers.forEach(window.clearTimeout);
    if (counter) counter.textContent = String(target);
    education.querySelectorAll<HTMLElement>(".education-study, .education-fact").forEach(node => node.style.removeProperty("--d"));
  };
}
