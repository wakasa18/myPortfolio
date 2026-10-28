"use client";

import { useEffect, useRef, useState } from "react";
import { Component as HorizonHero } from "@/components/ui/horizon-hero-section";
import { CinematicFooter } from "@/components/ui/motion-footer";
import { PharmacyProject } from "@/components/ui/pharmacy-project";
import { AboutSection } from "@/components/ui/about-section";
import { Starfield } from "@/components/ui/starfield";
import { dismissWhenOutside } from "./lib/ui-accessibility";
import { profile } from "./lib/portfolio-profile";
import { getGmailComposeHref } from "./lib/contact-links";
import { startScrollSpy } from "./lib/scroll-spy";
import { startSpotlight } from "./lib/spotlight";
import useParallax from "./use-parallax";
import useScrollMotion from "./use-scroll-motion";

/* Drawn as SVG on purpose: the "✳" character is not in the display font, so iOS swaps in its colour emoji (a green box). */
function Asterisk({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true" focusable="false"><path d="M12 2v20M2 12h20M4.93 4.93l14.14 14.14M19.07 4.93L4.93 19.07" /></svg>;
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const mainRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!menuOpen || !headerRef.current) return;
    const mobile = window.matchMedia("(max-width: 600px)");
    const onResize = () => { if (!mobile.matches) setMenuOpen(false); };
    const cleanup = dismissWhenOutside(headerRef.current, () => setMenuOpen(false));
    mobile.addEventListener("change", onResize);
    return () => { cleanup(); mobile.removeEventListener("change", onResize); };
  }, [menuOpen]);

  const stopMotion = paused || reducedMotion;
  useEffect(() => (navRef.current ? startScrollSpy(navRef.current) : undefined), []);
  useEffect(() => (!stopMotion && mainRef.current ? startSpotlight(mainRef.current) : undefined), [stopMotion]);

  useParallax(mainRef, stopMotion, "profile");
  useScrollMotion(mainRef, headerRef, stopMotion, menuOpen, "profile");

  return <main ref={mainRef} id="top" tabIndex={-1} data-ui-motion={stopMotion ? "paused" : "playing"} data-motion={stopMotion ? "paused" : "playing"}>
    <a className="skip-link" href="#work">Skip to work</a>
    <header ref={headerRef} className="site-header wrap" data-menu-open={menuOpen} onKeyDown={event => {
      if (event.key === "Escape" && menuOpen) {
        setMenuOpen(false);
        headerRef.current?.querySelector<HTMLButtonElement>(".menu-toggle")?.focus();
      }
    }}>
      <a href="#top" className="wordmark" aria-label="Sean Villanueva, home">sean<span className="wordmark-star"><Asterisk /></span></a>
      <nav ref={navRef} className={menuOpen ? "navigation is-open" : "navigation"} aria-label="Main navigation" id="main-navigation">
        <a href="#work" onClick={() => setMenuOpen(false)}>Work</a>
        <a href="#about" onClick={() => setMenuOpen(false)}>About</a>
        <a href="#contact" onClick={() => setMenuOpen(false)}>Contact</a>
        <a href={profile.resumeHref} download onClick={() => setMenuOpen(false)}>Résumé</a>
      </nav>
      <a href={getGmailComposeHref(profile.email)} target="_blank" rel="noopener noreferrer" title="Compose an email in Gmail" className="header-contact"><i className="header-contact-dot" aria-hidden="true" /><span className="header-contact-label">Email me</span><span className="sr-only"> via Gmail (opens in a new tab)</span><span className="header-contact-mark" aria-hidden="true"><Asterisk /></span></a>
      <button type="button" className="menu-toggle" aria-label={menuOpen ? "Close navigation" : "Open navigation"} aria-expanded={menuOpen} aria-controls="main-navigation" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? "Close −" : "Menu +"}</button>
      <span className="topbar-progress" aria-hidden="true" />
    </header>

    <HorizonHero paused={stopMotion} onPausedChange={setPaused} />
    <div className="portfolio-content">
      <Starfield paused={stopMotion} />
      <div className="intro-strip wrap" data-scroll-reveal>
        <p>PHP, CodeIgniter 4 & MySQL. <span>Front-end and back-end web development.</span></p>
        <Asterisk className="intro-mark" />
      </div>

      <section id="work" className="work-section wrap section-space">
        <div className="section-heading work-heading">
          <h2 data-scroll-reveal>Selected <span className="serif-word">work</span></h2>
          <p data-scroll-reveal data-reveal-delay="90">My front-end and back-end contributions to our ongoing pharmacy system.</p>
        </div>
        <PharmacyProject paused={stopMotion} />
      </section>

      <AboutSection paused={stopMotion} />

      <CinematicFooter email={profile.email} phone={profile.phone} phoneHref={profile.phoneHref} location={profile.location} resumeHref={profile.resumeHref} description={`Based in ${profile.location}. Open to junior web development opportunities.`} paused={paused} onPausedChange={setPaused} />
    </div>
  </main>;
}
