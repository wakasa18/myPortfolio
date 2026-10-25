/** Marks the nav link of the section currently being read with aria-current="location". */
export function startScrollSpy(nav: HTMLElement) {
  const entries = Array.from(nav.querySelectorAll<HTMLAnchorElement>('a[href^="#"]'))
    .map(link => ({ link, section: document.getElementById(link.hash.slice(1)) }))
    .filter((entry): entry is { link: HTMLAnchorElement; section: HTMLElement } => entry.section !== null);
  if (!entries.length) return () => {};
  let frame: number | null = null;

  const update = () => {
    frame = null;
    const line = window.innerHeight * 0.4;
    const atBottom = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2;
    let current: HTMLAnchorElement | null = null;
    for (const entry of entries) if (entry.section.getBoundingClientRect().top <= line) current = entry.link;
    if (atBottom) current = entries[entries.length - 1].link;
    for (const { link } of entries) {
      if (link === current) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    }
  };
  const queue = () => { if (frame === null) frame = requestAnimationFrame(update); };

  window.addEventListener("scroll", queue, { passive: true });
  window.addEventListener("resize", queue, { passive: true });
  update();
  return () => {
    window.removeEventListener("scroll", queue);
    window.removeEventListener("resize", queue);
    if (frame !== null) cancelAnimationFrame(frame);
    for (const { link } of entries) link.removeAttribute("aria-current");
  };
}
