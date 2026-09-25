/** Scroll-driven transforms; geometry is measured only when layout changes. */
export function startParallax(container: HTMLElement) {
    const layers = Array.from(container.querySelectorAll<HTMLElement>("[data-parallax]")).map(element => ({
      element,
      anchor: element.parentElement!,
      speed: Number(element.dataset.parallax),
      hero: element.dataset.parallaxOrigin === "top",
      top: 0, height: 0,
    }));
    let frame: number | null = null;
    let viewport = window.innerHeight;
    const touch = window.matchMedia("(pointer: coarse)");

    const update = () => {
      frame = null;
      const scroll = window.scrollY;
      for (const layer of layers) {
        if (layer.top + layer.height < scroll || layer.top > scroll + viewport) {
          layer.element.style.willChange = "";
          continue;
        }
        const distance = layer.hero ? Math.max(0, scroll - layer.top) : scroll + viewport / 2 - layer.top - layer.height / 2;
        const limit = layer.hero ? 100 : 30;
        const offset = Math.max(-limit, Math.min(limit, distance * layer.speed * (touch.matches ? 0.5 : 1)));
        layer.element.style.willChange = "translate";
        layer.element.style.translate = `0 ${offset.toFixed(2)}px`;
      }
    };
    const queue = () => {
      if (frame === null && !document.hidden) frame = requestAnimationFrame(update);
    };
    const measure = () => {
      viewport = window.innerHeight;
      const scroll = window.scrollY;
      // Batch every layout read before any transform writes.
      for (const layer of layers) {
        const rect = layer.anchor.getBoundingClientRect();
        layer.top = rect.top + scroll;
        layer.height = rect.height;
      }
      queue();
    };
    const onVisibility = () => {
      if (document.hidden && frame !== null) { cancelAnimationFrame(frame); frame = null; }
      else queue();
    };
    const observer = new ResizeObserver(measure);
    observer.observe(container);
    layers.forEach(layer => observer.observe(layer.anchor));
    window.addEventListener("scroll", queue, { passive: true });
    window.addEventListener("resize", measure, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    measure();
    return () => {
      if (frame !== null) cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("scroll", queue);
      window.removeEventListener("resize", measure);
      document.removeEventListener("visibilitychange", onVisibility);
      layers.forEach(({ element }) => { element.style.translate = ""; element.style.willChange = ""; });
    };
}
