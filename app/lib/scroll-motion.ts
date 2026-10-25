const EASE = "cubic-bezier(.2,.7,.2,1)";

/**
 * Finite compositor animations: no render loop, hidden content, or scroll hijacking.
 *
 * Markup hooks (all optional):
 *   data-scroll-reveal            the block that triggers a reveal when it scrolls into view
 *   data-reveal-delay="100"       ms before the reveal starts
 *   data-reveal-stagger           only the details animate; the block itself stays put (no double fade)
 *   data-reveal-detail            fades and rises, 70ms after the previous detail
 *   data-reveal-detail="lines"    heading whose .reveal-line-inner children slide up out of a mask
 *   data-reveal-detail="pop"      small scale-and-rise pop, 40ms after the previous pop (chips, tags)
 */
export function startScrollReveals(root: HTMLElement) {
  const running = new Set<Animation>();
  const finish = (animation: Animation) => {
    running.delete(animation);
    animation.cancel();
  };
  const track = (element: HTMLElement, keyframes: Keyframe[], options: KeyframeAnimationOptions) => {
    if (element.contains(document.activeElement)) return;
    const animation = element.animate(keyframes, { fill: "backwards", ...options });
    running.add(animation);
    animation.onfinish = () => finish(animation);
  };
  const play = (element: HTMLElement, delay: number, card = false) => track(element, [
    { opacity: .08, transform: `translateY(${card ? 38 : 24}px)${card ? " scale(.98)" : ""}` },
    { opacity: 1, transform: "translateY(0) scale(1)" },
  ], { duration: card ? 760 : 620, delay, easing: EASE });
  const playPop = (element: HTMLElement, delay: number) => track(element, [
    { opacity: 0, transform: "translateY(10px) scale(.82)" },
    { opacity: 1, transform: "translateY(0) scale(1)" },
  ], { duration: 520, delay, easing: "cubic-bezier(.3,1.35,.5,1)" });
  const playLines = (heading: HTMLElement, delay: number) => {
    heading.querySelectorAll<HTMLElement>(".reveal-line-inner").forEach((line, index) => track(line, [
      { transform: "translateY(110%)" },
      { transform: "translateY(0)" },
    ], { duration: 780, delay: delay + index * 90, easing: EASE }));
  };

  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      const element = entry.target as HTMLElement;
      observer.unobserve(element);
      // Remember completed reveals across filtering, menu toggles, and pause changes.
      // CSS also reads this flag to start one-shot transitions such as the degree progress bar.
      element.dataset.revealed = "true";
      if (document.hidden) continue;
      const delay = Number(element.dataset.revealDelay || 0);
      const stagger = element.hasAttribute("data-reveal-stagger");
      if (!stagger) play(element, delay, element.classList.contains("project-card"));
      let step = 0;
      let pop = 0;
      element.querySelectorAll<HTMLElement>("[data-reveal-detail]").forEach(detail => {
        const kind = detail.dataset.revealDetail;
        if (kind === "pop") { playPop(detail, delay + 120 + pop++ * 40); return; }
        const start = delay + (stagger ? 0 : 100) + step++ * 70;
        if (kind === "lines") playLines(detail, start);
        else play(detail, start);
      });
    }
  }, { threshold: .08, rootMargin: "0px 0px -32px 0px" });
  root.querySelectorAll<HTMLElement>("[data-scroll-reveal]:not([data-revealed])").forEach(element => observer.observe(element));
  // Keyboard focus must never wait for a decorative entrance to finish.
  const cancelAnimations = () => { running.forEach(animation => animation.cancel()); running.clear(); };
  const onVisibility = () => { if (document.hidden) cancelAnimations(); };
  root.addEventListener("focusin", cancelAnimations);
  document.addEventListener("visibilitychange", onVisibility);
  return () => {
    observer.disconnect();
    root.removeEventListener("focusin", cancelAnimations);
    document.removeEventListener("visibilitychange", onVisibility);
    cancelAnimations();
  };
}

export function startScrollHeader(header: HTMLElement, keepVisible: boolean) {
  let frame: number | null = null;
  let previous = Math.max(0, window.scrollY);
  let travel = 0;
  let direction = 0;
  let pageHeight = document.documentElement.scrollHeight;
  let viewport = window.innerHeight;
  const progress = header.querySelector<HTMLElement>(".topbar-progress");
  const update = () => {
    frame = null;
    const scroll = Math.max(0, Math.min(window.scrollY, Math.max(0, pageHeight - viewport)));
    const delta = scroll - previous;
    const nextDirection = Math.sign(delta);
    if (nextDirection !== direction && nextDirection !== 0) { travel = 0; direction = nextDirection; }
    travel += delta;
    header.dataset.scrolled = String(scroll > 24);
    if (keepVisible || scroll < 160) header.dataset.hidden = "false";
    else if (Math.abs(travel) > 12) header.dataset.hidden = String(travel > 0);
    progress?.style.setProperty("transform", `scaleX(${Math.min(1, scroll / Math.max(1, pageHeight - viewport))})`);
    previous = scroll;
  };
  const queue = () => { if (frame === null && !document.hidden) frame = requestAnimationFrame(update); };
  const measure = () => { pageHeight = document.documentElement.scrollHeight; viewport = window.innerHeight; queue(); };
  const onVisibility = () => {
    if (document.hidden && frame !== null) { cancelAnimationFrame(frame); frame = null; }
    else { previous = Math.max(0, window.scrollY); travel = 0; queue(); }
  };
  header.dataset.hidden = "false";
  const resize = new ResizeObserver(measure);
  resize.observe(document.documentElement);
  window.addEventListener("scroll", queue, { passive: true });
  window.addEventListener("resize", measure, { passive: true });
  document.addEventListener("visibilitychange", onVisibility);
  queue();
  return () => {
    if (frame !== null) cancelAnimationFrame(frame);
    resize.disconnect();
    window.removeEventListener("scroll", queue);
    window.removeEventListener("resize", measure);
    document.removeEventListener("visibilitychange", onVisibility);
    header.dataset.hidden = "false";
  };
}
