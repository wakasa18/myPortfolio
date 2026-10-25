"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { ArrowDownToLine, ArrowUpRight } from "lucide-react";
import { Component as HorizonHero } from "@/components/ui/horizon-hero-section";
import { CinematicFooter } from "@/components/ui/motion-footer";
import { PharmacyProject } from "@/components/ui/pharmacy-project";
import { ScrollFillText } from "@/components/ui/scroll-fill-text";
import { Starfield } from "@/components/ui/starfield";
import { Toolkit } from "@/components/ui/toolkit";
import { dismissWhenOutside } from "./lib/ui-accessibility";
import { profile } from "./lib/portfolio-profile";
import { startScrollSpy } from "./lib/scroll-spy";
import { startSpotlight } from "./lib/spotlight";
import useParallax from "./use-parallax";
import useScrollMotion from "./use-scroll-motion";

const resumeFormat = profile.resumeHref.split(".").pop()?.toUpperCase() ?? "FILE";

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
      <a href="#top" className="wordmark" aria-label="Sean Villanueva, home">sean<span className="wordmark-star">✳</span></a>
      <nav ref={navRef} className={menuOpen ? "navigation is-open" : "navigation"} aria-label="Main navigation" id="main-navigation">
        <a href="#work" onClick={() => setMenuOpen(false)}>Work</a>
        <a href="#about" onClick={() => setMenuOpen(false)}>About</a>
        <a href="#contact" onClick={() => setMenuOpen(false)}>Contact</a>
        <a href={profile.resumeHref} download onClick={() => setMenuOpen(false)}>Résumé</a>
      </nav>
      <a href={`mailto:${profile.email}`} className="header-contact">
        <span>Email me</span>
        <span className="header-contact-icon" aria-hidden="true"><ArrowUpRight size={16} strokeWidth={1.8} /></span>
      </a>
      <button type="button" className="menu-toggle" aria-label={menuOpen ? "Close navigation" : "Open navigation"} aria-expanded={menuOpen} aria-controls="main-navigation" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? "Close −" : "Menu +"}</button>
      <span className="topbar-progress" aria-hidden="true" />
    </header>

    <HorizonHero paused={stopMotion} onPausedChange={setPaused} />
    <div className="portfolio-content">
      <Starfield paused={stopMotion} />
      <div className="intro-strip wrap" data-scroll-reveal>
        <p>PHP, CodeIgniter 4 & MySQL. <span>Front-end and back-end web development.</span></p>
        <span className="intro-mark" aria-hidden="true">✳</span>
      </div>

      <section id="work" className="work-section wrap section-space">
        <div className="section-heading">
          <div data-scroll-reveal><span className="eyebrow section-eyebrow">MY PROJECT</span><h2>Pharxmaco <span className="serif-word">Drugstore.</span></h2></div>
          <p data-scroll-reveal data-reveal-delay="90">My front-end and back-end contributions<br />to our ongoing pharmacy system.</p>
        </div>
        <PharmacyProject />
      </section>

      <section id="about" className="about-section wrap section-space">
        <div className="about-panel">
          <div className="about-visual education-panel" data-scroll-reveal data-spotlight data-tilt>
            <div className="edu-head">
              {profile.photoSrc && <span className="edu-avatar"><img src={profile.photoSrc} alt={`Portrait of ${profile.name}`} width={72} height={72} /></span>}
              <span className="eyebrow">EDUCATION</span>
            </div>
            <h3>{profile.degree}</h3>
            <p className="edu-school">{profile.school}</p>
            <div className="project-tags edu-tags" aria-label="Section and focus">
              <span>{profile.section}</span>
              {profile.studyFocus.map(topic => <span key={topic}>{topic}</span>)}
            </div>
            <div className="edu-progress">
              <div className="edu-progress-meta">
                <strong>Year {profile.yearOfStudy} of {profile.programYears}</strong>
                <span className="edu-progress-end"><span>Graduating</span> {profile.graduation}</span>
              </div>
              <div className="edu-years" aria-hidden="true" style={{ "--years": profile.programYears } as CSSProperties}>
                {Array.from({ length: profile.programYears }, (_, index) => <span key={index} className={index < profile.yearOfStudy - 1 ? "is-done" : index === profile.yearOfStudy - 1 ? "is-current" : undefined} style={{ "--i": index } as CSSProperties} />)}
              </div>
            </div>
          </div>
          <div className="about-copy" data-scroll-reveal data-reveal-stagger data-reveal-delay="100">
            <span className="eyebrow section-eyebrow" data-reveal-detail>ABOUT ME</span>
            <h2 data-reveal-detail="lines">
              <span className="reveal-line"><span className="reveal-line-inner">Hi, I’m Sean.{" "}</span></span>
              <span className="reveal-line"><span className="reveal-line-inner"><span className="serif-word serif-sweep">Web developer.</span></span></span>
            </h2>
            <span className="availability-pill" data-reveal-detail><i aria-hidden="true" />{profile.availability}</span>
            <ScrollFillText revealDetail active={!stopMotion} text={`I’m a fourth-year Information Systems student based in ${profile.location}, working toward a career as a junior web developer.`} />
            <p data-reveal-detail>For our Pharxmaco Drugstore project, I work on both the front end and back end using PHP, CodeIgniter 4, MySQL, and browser technologies. I contribute to <mark className="hl">sales</mark> and <mark className="hl">inventory</mark> features, <mark className="hl">user access</mark>, database integration, <mark className="hl">debugging</mark>, and interface improvements.</p>
            <p className="profile-skills" data-reveal-detail>Debugging helps me work through technical problems. Working with stock updates, transaction history, and refunds has also taught me to pay close attention to details.</p>
            <a className="resume-cta" href={profile.resumeHref} download data-reveal-detail><span>Download résumé</span><span className="resume-format">{resumeFormat}</span><ArrowDownToLine size={18} aria-hidden="true" /></a>
          </div>
        </div>
        <Toolkit />
      </section>

      <CinematicFooter email={profile.email} phone={profile.phone} phoneHref={profile.phoneHref} location={profile.location} resumeHref={profile.resumeHref} description={`Based in ${profile.location}. Open to junior web development opportunities.`} paused={paused} onPausedChange={setPaused} />
    </div>
  </main>;
}
