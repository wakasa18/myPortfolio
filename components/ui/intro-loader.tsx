"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { profile } from "@/app/lib/portfolio-profile";
import "./intro-loader.css";

/* Intro sequence shown before the portfolio.
   init     server-rendered cover; waits for fonts so the wordmark never swaps typefaces mid-animation
   playing  wordmark rises in, the asterisk draws itself, the counter runs to 100
   leaving  content fades, the curtain lifts, and "intro:reveal" tells the hero to start its entrance
   done     removed from the page */
const COUNT_MS = 2100;   // how long the 000 to 100 counter takes (it waits at 94% until fonts and the page have loaded)
const HOLD_MS = 280;     // pause on 100 before the curtain moves
const LIFT_DELAY_MS = 220; // must match the transition-delay on .intro[data-state="leaving"]
const LIFT_MS = 950;     // must match the transition-duration there
const MAX_WAIT_MS = 4500; // never hold visitors longer than this on a slow connection

type Phase = "init" | "playing" | "leaving" | "done";

const [roleLast = "", ...roleFirst] = profile.role.split(" ").reverse();
const roleLead = roleFirst.reverse().join(" ");
const place = profile.location.split(",").slice(-2).map(part => part.trim()).join(", ");
const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

export function IntroLoader() {
  const [phase, setPhase] = useState<Phase>("init");
  const rootRef = useRef<HTMLDivElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);
  const skipRef = useRef<() => void>(() => {});

  useEffect(() => {
    // Reduced motion: CSS already hides the cover, so there is nothing to wait for.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const frame = requestAnimationFrame(() => setPhase("done"));
      return () => cancelAnimationFrame(frame);
    }

    const html = document.documentElement;
    const main = document.querySelector("main");
    const timers: number[] = [];
    let raf = 0, cancelled = false, ready = false, current: Phase = "init";
    const go = (next: Phase) => { current = next; setPhase(next); };
    const later = (fn: () => void, ms: number) => { timers.push(window.setTimeout(fn, ms)); };

    html.classList.add("is-intro");
    main?.setAttribute("inert", "");
    if (!window.location.hash) window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });

    const paint = (progress: number) => {
      rootRef.current?.style.setProperty("--p", String(progress));
      if (countRef.current) countRef.current.textContent = String(Math.round(progress * 100)).padStart(3, "0");
    };

    const leave = () => {
      if (current === "leaving" || current === "done" || cancelled) return;
      cancelAnimationFrame(raf);
      paint(1);
      go("leaving");
      later(() => {
        html.classList.remove("is-intro");
        main?.removeAttribute("inert");
        window.dispatchEvent(new Event("intro:reveal"));
      }, LIFT_DELAY_MS);
      later(() => go("done"), LIFT_DELAY_MS + LIFT_MS + 80);
    };
    skipRef.current = leave;

    const start = () => {
      if (cancelled || current !== "init") return;
      go("playing");
      const t0 = performance.now();
      const tick = (now: number) => {
        const eased = easeInOutCubic(Math.min((now - t0) / COUNT_MS, 1));
        const progress = ready ? eased : Math.min(eased, 0.94);
        paint(progress);
        if (progress >= 1) later(leave, HOLD_MS); else raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    };

    const fontsReady = (document.fonts?.ready ?? Promise.resolve()).then(() => undefined, () => undefined);
    const pageLoaded = document.readyState === "complete" ? Promise.resolve() : new Promise<void>(resolve => window.addEventListener("load", () => resolve(), { once: true }));
    const wait = (ms: number) => new Promise<void>(resolve => later(resolve, ms));
    void Promise.race([fontsReady, wait(700)]).then(start);
    void Promise.race([Promise.all([fontsReady, pageLoaded]), wait(MAX_WAIT_MS)]).then(() => { ready = true; });

    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") leave(); };
    window.addEventListener("keydown", onKey);

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      timers.forEach(window.clearTimeout);
      window.removeEventListener("keydown", onKey);
      html.classList.remove("is-intro");
      main?.removeAttribute("inert");
    };
  }, []);

  if (phase === "done") return null;

  return <div ref={rootRef} className="intro" data-state={phase} role="status" aria-label="Loading portfolio" onClick={() => skipRef.current()}>
    <div className="intro-dots" aria-hidden="true" />
    <div className="intro-glow" aria-hidden="true" />
    <div className="intro-ui">
      <div className="intro-top" aria-hidden="true"><span>Portfolio 2026</span><span>{place}</span></div>
      <div className="intro-center">
        <div className="intro-lockup" aria-hidden="true">
          <span className="intro-word">{"sean".split("").map((letter, index) => <span className="intro-clip" key={index}><span className="intro-char" style={{ "--i": index } as CSSProperties}>{letter}</span></span>)}</span>
          <svg className="intro-star" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" focusable="false">
            {["M12 2v20", "M2 12h20", "M4.93 4.93l14.14 14.14", "M19.07 4.93L4.93 19.07"].map((d, index) => <path key={d} d={d} pathLength={1} style={{ "--k": index } as CSSProperties} />)}
          </svg>
        </div>
        <p className="intro-role" aria-hidden="true">{roleLead} <em>{roleLast}.</em></p>
      </div>
      <div className="intro-bottom">
        <span className="intro-bar" aria-hidden="true"><i /></span>
        <div className="intro-meta">
          <span className="intro-count" aria-hidden="true"><span ref={countRef}>000</span><small>%</small></span>
          <button type="button" className="intro-skip">Skip</button>
        </div>
      </div>
    </div>
  </div>;
}
