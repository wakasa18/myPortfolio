"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore, type CSSProperties } from "react";
import { ArrowDownToLine, ArrowUpRight, ChevronDown } from "lucide-react";
import { pharmacyProject, profile } from "@/app/lib/portfolio-profile";
import { PharmacyPreview, projectChapters } from "./pharmacy-preview";

function useMediaQuery(query: string) {
  const subscribe = useCallback((onChange: () => void) => {
    const media = window.matchMedia(query);
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, [query]);
  return useSyncExternalStore(subscribe, () => window.matchMedia(query).matches, () => false);
}

export function PharmacyProject({ paused = false }: { paused?: boolean }) {
  const [active, setActive] = useState(0);
  const [fits, setFits] = useState(true);
  const [inView, setInView] = useState(false);
  const tourRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const stacked = useMediaQuery("(max-width: 1000px)");
  const tallDesktop = useMediaQuery("(min-width: 1101px) and (min-height: 850px)");
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)");
  const stopMotion = paused || reduced;
  // Pausing removes animation without collapsing the scroll track under the visitor.
  const pinned = tallDesktop && fits && !reduced;

  // The preview demo only plays while the active screen is actually on screen.
  useEffect(() => {
    const section = document.getElementById(`work-preview-${projectChapters[active].id}`);
    if (!section) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.3 });
    observer.observe(section);
    return () => observer.disconnect();
  }, [active]);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const measure = () => setFits(stage.scrollHeight + 136 <= window.innerHeight);
    const observer = new ResizeObserver(measure);
    observer.observe(stage);
    window.addEventListener("resize", measure, { passive: true });
    return () => { observer.disconnect(); window.removeEventListener("resize", measure); };
  }, []);

  useEffect(() => {
    const tour = tourRef.current;
    const stage = stageRef.current;
    if (!pinned || !tour || !stage) return;
    let frame: number | null = null;
    const update = () => {
      frame = null;
      const distance = tour.offsetHeight - stage.offsetHeight;
      const top = Number.parseFloat(getComputedStyle(stage).top) || 0;
      const progress = Math.max(0, Math.min(1, (top - tour.getBoundingClientRect().top) / Math.max(1, distance)));
      tour.style.setProperty("--tour-progress", progress.toFixed(4));
      setActive(previous => {
        const next = Math.min(2, Math.floor(progress * 3));
        return previous === next ? previous : next;
      });
    };
    const queue = () => { if (frame === null) frame = requestAnimationFrame(update); };
    window.addEventListener("scroll", queue, { passive: true });
    window.addEventListener("resize", queue, { passive: true });
    queue();
    return () => {
      if (frame !== null) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", queue);
      window.removeEventListener("resize", queue);
    };
  }, [pinned]);

  useEffect(() => {
    if (!stacked) return;
    const chapters = document.querySelectorAll<HTMLElement>(".work-preview-chapter");
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          const index = projectChapters.findIndex(chapter => `work-preview-${chapter.id}` === entry.target.id);
          if (index !== -1) setActive(index);
        }
      }
    }, { rootMargin: "-15% 0px -45% 0px", threshold: 0 });
    chapters.forEach(chapter => observer.observe(chapter));
    return () => observer.disconnect();
  }, [stacked]);

  const selectChapter = (index: number) => {
    setActive(index);
    if (stacked) {
      document.getElementById(`work-preview-${projectChapters[index].id}`)?.scrollIntoView({ behavior: stopMotion ? "instant" : "smooth", block: "start" });
    } else if (pinned && tourRef.current && stageRef.current) {
      const tour = tourRef.current;
      const stage = stageRef.current;
      const top = Number.parseFloat(getComputedStyle(stage).top) || 0;
      const distance = tour.offsetHeight - stage.offsetHeight;
      // Aim inside the chapter interval rather than on a rounding boundary.
      const position = index === 0 ? 0 : (index + .15) / 3;
      window.scrollTo({ top: window.scrollY + tour.getBoundingClientRect().top - top + distance * position, behavior: stopMotion ? "instant" : "smooth" });
    }
  };

  return <article className="work-project" aria-labelledby="pharmacy-title" data-paused={stopMotion}>
    <div className="work-tour" ref={tourRef} data-pinned={pinned}>
      <div className="work-stage" ref={stageRef}>
        <nav className="work-chapter-nav" aria-label="Pharxmaco project walkthrough">
          {projectChapters.map((chapter, index) => <button key={chapter.id} type="button" style={{ "--i": index } as CSSProperties} aria-pressed={active === index} aria-controls={`work-preview-${chapter.id}`} onClick={() => selectChapter(index)}>
            <span className="work-chapter-number" aria-hidden="true">0{index + 1}</span><span>{chapter.title}</span>
          </button>)}
        </nav>
        <div className="work-showcase-grid">
          <div className="work-project-summary">
            <h3 id="pharmacy-title">{pharmacyProject.name}</h3>
            <p className="work-project-subtitle">Point of sale & inventory</p>
            <p className="work-project-status">Team project <span aria-hidden="true">·</span> {pharmacyProject.period} <span aria-hidden="true">·</span> Ongoing</p>
            <p className="work-project-title">{pharmacyProject.title}</p>
            <dl className="work-role"><dt>My contribution</dt><dd>Front-end & back-end development</dd></dl>
            <div className="work-project-actions">
              <a href={pharmacyProject.liveHref} target="_blank" rel="noopener noreferrer" aria-describedby="pharmacy-live-note">Explore project <ArrowUpRight size={17} aria-hidden="true" /><span className="sr-only"> (opens in a new tab)</span></a>
              <a href={profile.portfolioHref} download>Project brief <ArrowDownToLine size={17} aria-hidden="true" /></a>
            </div>
            <dl className="work-technology"><dt>Technology</dt><dd>PHP / CodeIgniter 4 / MySQL</dd></dl>
            <div className="work-cashier-login">
              <p id="pharmacy-live-note">The live system opens to the staff sign-in page.</p>
              <strong>Cashier login</strong>
              <dl><div><dt>Username</dt><dd><code>cashier</code></dd></div><div><dt>Password</dt><dd><code>cashier123</code></dd></div></dl>
            </div>
          </div>
          <div className="work-previews">
            {projectChapters.map((chapter, index) => <section key={chapter.id} id={`work-preview-${chapter.id}`} className="work-preview-chapter" data-active={active === index} aria-labelledby={`work-chapter-${chapter.id}`}>
              <h4 className="work-mobile-chapter" id={`work-chapter-${chapter.id}`}><span aria-hidden="true">0{index + 1}</span>{chapter.title}</h4>
              <figure className="work-preview-figure">
                <PharmacyPreview chapter={chapter.id} active={active === index} still={stopMotion} hold={!inView} />
                <figcaption><span>Illustrative preview · Sample data</span><span className="work-preview-count" aria-hidden="true">0{index + 1} / 03</span></figcaption>
              </figure>
              <div className="work-chapter-caption"><span>{chapter.caption}</span><p>{chapter.description}</p></div>
            </section>)}
          </div>
        </div>
        <p className="work-scroll-cue" aria-hidden="true"><ChevronDown size={15} /><span key={active}>{active < 2 ? `0${active + 2} ${projectChapters[active + 1].title}` : "End of project walkthrough"}</span></p>
      </div>
    </div>
    <div className="work-project-notes">
      <div><h4>Behind the interface</h4><p>I contributed to POS and sales transactions, inventory and automatic stock updates, authentication and role-based access, and transaction history with return and refund processing. My work also includes database integration, debugging, and interface improvements.</p><p className="work-scope-note">Sales forecasting is part of the wider project scope.</p></div>
      <div><h4>Technologies used</h4><p className="work-full-stack">{pharmacyProject.technologies.join(" / ")}</p></div>
    </div>
  </article>;
}
