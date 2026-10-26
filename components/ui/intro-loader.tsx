"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { profile } from "@/app/lib/portfolio-profile";
import "./intro-loader.css";

/* Intro sequence shown before the portfolio.
   init     server-rendered cover; waits for fonts so nothing swaps typeface mid-animation
   greet    "hello" cycles through languages and lands on Kumusta, with the logo asterisk turning beside it
   name     the greeting lifts away; "sean" rises in, the asterisk draws itself, the role line appears
   leaving  content fades, the cover lifts with a curved horizon edge, and "intro:reveal" starts the hero entrance
   done     removed from the page
   The counter runs the whole time in chunky steps, and waits at 94% until fonts and the page have loaded. */
const GREETINGS = [
  { word: "Hello", lang: "en", ms: 440 },
  { word: "Hola", lang: "es", ms: 160 },
  { word: "Bonjour", lang: "fr", ms: 160 },
  { word: "こんにちは", lang: "ja", ms: 160 },
  { word: "안녕하세요", lang: "ko", ms: 160 },
  { word: "Ciao", lang: "it", ms: 160 },
  { word: "Kumusta", lang: "fil", ms: 600 },
] as const;
const GREET_MS = GREETINGS.reduce((total, item) => total + item.ms, 0);
const NAME_MS = 900;       // how long the wordmark stays after the greetings
const COUNT_MS = GREET_MS + NAME_MS;
const COUNT_STEPS = 20;    // the counter moves in 5% jumps instead of sliding
const HOLD_MS = 220;       // pause on 100 before the cover lifts
const LIFT_DELAY_MS = 220; // must match the transition-delay on .intro[data-state="leaving"]
const LIFT_MS = 1000;      // must match the transition-duration there
const MAX_WAIT_MS = 4500;  // never hold visitors longer than this on a slow connection

type Phase = "init" | "greet" | "name" | "leaving" | "done";

const [roleLast = "", ...roleFirst] = profile.role.split(" ").reverse();
const roleLead = roleFirst.reverse().join(" ");
const place = profile.location.split(",").slice(-2).map(part => part.trim()).join(", ");
const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const ASTERISK_PATHS = ["M12 2v20", "M2 12h20", "M4.93 4.93l14.14 14.14", "M19.07 4.93L4.93 19.07"];

export function IntroLoader() {
  const [phase, setPhase] = useState<Phase>("init");
  const [greeting, setGreeting] = useState(0);
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
      const stepped = progress >= 1 ? 1 : Math.floor(progress * COUNT_STEPS) / COUNT_STEPS;
      rootRef.current?.style.setProperty("--p", String(stepped));
      if (countRef.current) countRef.current.textContent = String(Math.round(stepped * 100)).padStart(3, "0");
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
      go("greet");
      let at = 0;
      GREETINGS.forEach((item, index) => { const from = at; later(() => setGreeting(index), from); at += item.ms; });
      later(() => { if (current === "greet") go("name"); }, GREET_MS);
      const t0 = performance.now();
      const tick = (now: number) => {
        const eased = easeInOutCubic(Math.max(0, Math.min((now - t0) / COUNT_MS, 1)));
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

  const greet = GREETINGS[greeting] ?? GREETINGS[0];

  return <div ref={rootRef} className="intro" data-state={phase} role="status" aria-label="Loading portfolio" onClick={() => skipRef.current()}>
    <div className="intro-dots" aria-hidden="true" />
    <div className="intro-glow" aria-hidden="true" />
    <div className="intro-frame" aria-hidden="true" />
    <div className="intro-ui">
      <div className="intro-top" aria-hidden="true"><span>Portfolio 2026</span><span>{place}</span></div>
      <div className="intro-center">
        <p className="intro-greet" aria-hidden="true">
          <svg className="intro-greet-mark" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" focusable="false"><path d={ASTERISK_PATHS.join("")} /></svg>
          <span className="intro-greet-clip"><span className="intro-greet-word" key={greeting} lang={greet.lang}>{greet.word}</span></span>
        </p>
        <div className="intro-name">
          <div className="intro-lockup" aria-hidden="true">
            <span className="intro-word">{"sean".split("").map((letter, index) => <span className="intro-clip" key={index}><span className="intro-char" style={{ "--i": index } as CSSProperties}>{letter}</span></span>)}</span>
            <svg className="intro-star" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" focusable="false">
              {ASTERISK_PATHS.map((d, index) => <path key={d} d={d} pathLength={1} style={{ "--k": index } as CSSProperties} />)}
            </svg>
          </div>
          <p className="intro-role" aria-hidden="true">{roleLead} <em>{roleLast}.</em></p>
        </div>
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
