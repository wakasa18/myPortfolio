"use client";

import { useEffect, useId, useRef, useState, useSyncExternalStore } from "react";
import { cn } from "@/lib/utils";
import { dismissWhenOutside } from "@/app/lib/ui-accessibility";
import { getHorizonSection, horizonSections } from "./horizon-model";
import "./horizon-hero-section.css";

function subscribeMotion(callback: () => void) {
  const media = window.matchMedia("(prefers-reduced-motion: reduce)");
  media.addEventListener("change", callback);
  return () => media.removeEventListener("change", callback);
}
const readMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const serverMotion = () => false;

export interface HorizonHeroSectionProps {
  className?: string;
  eyebrow?: string;
  ctaHref?: string;
  ctaLabel?: string;
  introLines?: readonly string[];
  paused?: boolean;
  onPausedChange?: (paused: boolean) => void;
}

export function HorizonHeroSection({
  className, eyebrow = "SEAN VILLANUEVA / WEB DEVELOPER",
  ctaHref = "#work", ctaLabel = "Explore my project", introLines, paused, onPausedChange,
}: HorizonHeroSectionProps = {}) {
  const instanceId = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const containerRef = useRef<HTMLElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const entranceContext = useRef<{ revert(): void } | null>(null);
  const controller = useRef<{ setMotionEnabled(value: boolean): void } | null>(null);
  const enabledRef = useRef(true);
  const [localPaused, setLocalPaused] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const reducedMotion = useSyncExternalStore(subscribeMotion, readMotion, serverMotion);
  const stopMotion = (paused ?? localPaused) || reducedMotion;

  useEffect(() => {
    if (!menuOpen || !menuRef.current) return;
    return dismissWhenOutside(menuRef.current, () => setMenuOpen(false));
  }, [menuOpen]);

  useEffect(() => {
    enabledRef.current = !stopMotion;
    controller.current?.setMotionEnabled(!stopMotion);
    if (stopMotion) { entranceContext.current?.revert(); entranceContext.current = null; }
  }, [stopMotion]);

  useEffect(() => {
    const root = containerRef.current, viewport = viewportRef.current, canvas = canvasRef.current;
    if (!root || !viewport || !canvas) return;
    let cancelled = false;
    let dispose: (() => void) | undefined;

    // Heavy rendering code is only requested in the browser, after HTML is usable.
    void Promise.all([import("./horizon-scene"), import("gsap"), import("gsap/ScrollTrigger")]).then(([sceneModule, gsapModule, triggerModule]) => {
      if (cancelled) return;
      const { gsap } = gsapModule;
      const { ScrollTrigger } = triggerModule;
      gsap.registerPlugin(ScrollTrigger);
      const scene = sceneModule.createHorizonScene(canvas, viewport, root);
      const resources: { trigger?: ReturnType<typeof ScrollTrigger.create>; observer?: ResizeObserver } = {};
      dispose = () => {
        resources.observer?.disconnect();
        resources.trigger?.kill();
        entranceContext.current?.revert(); entranceContext.current = null;
        controller.current = null;
        scene?.dispose();
      };
      controller.current = scene;
      scene?.setMotionEnabled(enabledRef.current);
      let currentSection = -1;
      const updateProgress = (progress: number) => {
        scene?.setProgress(progress);
        if (fillRef.current) fillRef.current.style.transform = `scaleX(${progress})`;
        progressRef.current?.setAttribute("aria-valuenow", String(Math.round(progress * 100)));
        const section = getHorizonSection(progress);
        if (section !== currentSection) {
          currentSection = section;
          if (counterRef.current) counterRef.current.textContent = String(section + 1).padStart(2, "0");
          root.dataset.section = String(section);
        }
      };
      const trigger = ScrollTrigger.create({
        trigger: root, start: "top top", end: "bottom bottom",
        onUpdate: self => updateProgress(self.progress),
        onRefresh: self => updateProgress(self.progress),
      });
      resources.trigger = trigger;
      updateProgress(trigger.progress);

      if (enabledRef.current && !readMotion()) {
        entranceContext.current = gsap.context(() => {
          root.querySelectorAll<HTMLElement>(".horizon-panel").forEach(panel => {
            const timeline = gsap.timeline({ scrollTrigger: { trigger: panel, start: "top 65%", once: true } });
            timeline.from(panel.querySelectorAll(".horizon-title-char"), { yPercent: 110, opacity: 0, duration: 1.15, stagger: 0.045, ease: "power4.out" });
            timeline.from(panel.querySelectorAll(".horizon-subtitle-line"), { y: 24, opacity: 0, duration: 0.8, stagger: 0.13, ease: "power3.out" }, "-=0.75");
          });
        }, root);
      }
      const onResize = () => trigger?.refresh();
      const resizeObserver = new ResizeObserver(onResize);
      resources.observer = resizeObserver;
      resizeObserver.observe(root);
    }).catch(() => {
      // A readable CSS sky and all section content remain if WebGL/imports fail.
      dispose?.(); dispose = undefined;
      if (!cancelled) root.dataset.scene = "fallback";
    });
    return () => { cancelled = true; dispose?.(); };
  }, []);

  function toggleMotion() {
    const next = !(paused ?? localPaused);
    if (onPausedChange) onPausedChange(next); else setLocalPaused(next);
  }

  return <section ref={containerRef} className={cn("horizon-hero relative isolate", className)} data-scene="fallback" data-motion={stopMotion ? "paused" : "playing"} aria-label="Sean Villanueva portfolio introduction">
    <div ref={viewportRef} className="horizon-viewport">
      <div className="horizon-fallback" aria-hidden="true"><i /><i /><i /></div>
      <canvas ref={canvasRef} className="horizon-canvas" aria-hidden="true" />
      <div className="horizon-vignette" aria-hidden="true" />
      <div className="horizon-meta"><span>WEB DEVELOPMENT</span><span>BULACAN, PHILIPPINES</span></div>
      <div ref={menuRef} className="horizon-side-menu" onKeyDown={event => {
        if (event.key === "Escape" && menuOpen) {
          setMenuOpen(false);
          menuRef.current?.querySelector<HTMLButtonElement>("button")?.focus();
        }
      }}>
        <button type="button" className="horizon-menu-button" aria-label={menuOpen ? "Close scene navigation" : "Open scene navigation"} aria-expanded={menuOpen} aria-controls={`${instanceId}-menu`} onClick={() => setMenuOpen(!menuOpen)}><span /><span /><span /></button>
        <span className="horizon-vertical-text" aria-hidden="true">PORTFOLIO</span>
        <nav id={`${instanceId}-menu`} className="horizon-scene-menu" aria-label="Portfolio sections" hidden={!menuOpen}>
          {horizonSections.map((section, index) => <a key={section.title} href={`#${instanceId}-scene-${index}`} onClick={() => setMenuOpen(false)}><span>0{index + 1}</span>{section.title}<span aria-hidden="true">↗</span></a>)}
        </nav>
      </div>
      <div className="horizon-bottom">
        <div className="horizon-scroll-progress"><span className="horizon-scroll-label">SCROLL TO EXPLORE</span><div ref={progressRef} className="horizon-progress-track" role="progressbar" aria-label="Journey scroll progress" aria-valuemin={0} aria-valuemax={100} aria-valuenow={0}><div ref={fillRef} className="horizon-progress-fill" /></div><span className="horizon-section-counter"><span ref={counterRef}>01</span><span> / 03</span></span></div>
        <button type="button" className="horizon-motion-button" onClick={toggleMotion} disabled={reducedMotion} aria-pressed={stopMotion} aria-label={reducedMotion ? "Animation disabled by your reduced motion preference" : stopMotion ? "Play animation" : "Pause animation"}><span aria-hidden="true">{stopMotion ? "▷" : "Ⅱ"}</span>{stopMotion ? "Motion paused" : "Pause motion"}</button>
      </div>
    </div>
    <div className="horizon-panels">
      {horizonSections.map((section, index) => {
        const Heading = index === 0 ? "h1" : "h2";
        return <section key={section.title} id={`${instanceId}-scene-${index}`} className="horizon-panel" aria-labelledby={`${instanceId}-title-${index}`}>
          <div className="horizon-panel-content">
            <p className="horizon-eyebrow">{index === 0 ? eyebrow : section.eyebrow}</p>
            <div className="horizon-title-mask"><Heading id={`${instanceId}-title-${index}`} className="horizon-title" aria-label={section.title}>{section.title.split("").map((char, i, all) => <span className={i >= Math.ceil(all.length / 2) ? "horizon-title-char is-outline" : "horizon-title-char"} key={i} aria-hidden="true">{char}</span>)}</Heading></div>
            <div className="horizon-subtitle">{(index === 0 && introLines ? introLines : section.lines).map(line => <p className="horizon-subtitle-line" key={line}>{line}</p>)}</div>
            {index === 0 && <a className="horizon-cta" href={ctaHref}>{ctaLabel}<span aria-hidden="true">↗</span></a>}
            {index === 2 && <a className="horizon-cta" href={ctaHref}>View Pharxmaco project<span aria-hidden="true">↓</span></a>}
          </div>
          <span className="horizon-scene-note" aria-hidden="true">0{index + 1} — {section.note}</span>
        </section>;
      })}
    </div>
  </section>;
}

// Retains the existing shared component import.
export const Component = HorizonHeroSection;
