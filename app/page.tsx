"use client";

import { useEffect, useRef, useState } from "react";
import Sculpture from "./sculpture";
import useParallax from "./use-parallax";

const email = "villanuevasean0918@gmail.com";
const projects = [
  { name: "Relay", category: "Development", type: "A calmer space to get things done", theme: "relay", tags: ["React", "Dashboard", "UI development"], description: "A concept for a focused project workspace. Clear priorities, a simple overview, and just enough detail to help a team keep moving.", challenge: "Turn a busy project dashboard into a quiet, useful starting point for the day.", approach: "A compact sidebar gives the content room to breathe. Color connects project status across the overview, and a consistent spacing system keeps the interface easy to scan." },
  { name: "Forma", category: "Design", type: "An architectural point of view", theme: "forma", tags: ["Web design", "Art direction", "Responsive"], description: "An editorial website concept for an independent architecture studio. Generous space and strong typography let the work tell the story.", challenge: "Create a digital identity that feels as considered as the spaces it presents.", approach: "An earthy palette, oversized type, and architectural compositions establish a clear visual rhythm. The layout adapts from an expansive desktop canvas to a focused mobile experience." },
  { name: "Orbit", category: "Development", type: "Find your next favorite sound", theme: "orbit", tags: ["React", "Interaction", "Music discovery"], description: "A music discovery interface concept built around the feeling of finding something new. Album artwork leads, with simple controls close at hand.", challenge: "Make browsing music feel exploratory without making the interface harder to use.", approach: "A dark listening room, bold album colors, and a persistent player make a cohesive visual system. Large interaction targets work equally well with a pointer or touch." },
  { name: "Grove", category: "Design", type: "Good things, thoughtfully made", theme: "grove", tags: ["E-commerce", "Web design", "Visual identity"], description: "A storefront concept for everyday objects with a lighter footprint. A fresh identity pairs approachable product cards with a simple shopping journey.", challenge: "Give a small collection a distinct identity while keeping product discovery effortless.", approach: "Soft green, natural forms, and concise product information make the collection inviting. A restrained grid keeps the focus on the objects themselves." },
];
type Project = (typeof projects)[number];
function Arrow() { return <span aria-hidden="true" className="arrow">↗</span>; }

function ProjectArt({ theme }: { theme: string }) {
  if (theme === "relay") return <div className="art relay-art" aria-hidden="true">
    <div className="relay-window"><aside><strong><i />relay</strong><span className="mock-active">▦ &nbsp; Overview</span><span>◫ &nbsp; My projects</span><span>▤ &nbsp; Tasks</span><span>◷ &nbsp; Calendar</span><small>WORKSPACE</small><span>● &nbsp; Studio team</span><span>＋ &nbsp; New workspace</span><div className="mock-avatar">S<span>Sean’s workspace<br /><small>Personal account</small></span></div></aside>
      <div className="relay-content"><div className="mock-top">Workspace / Overview <span>⌕ &nbsp; ◉</span></div><div className="mock-greeting"><div><small>MONDAY, SEPTEMBER 21</small><h4>Make room for good work.</h4><p>Here’s what’s happening with your projects.</p></div><b>＋ New project</b></div><div className="mock-stats"><div><small>Active projects</small><strong>12 <em>↗ 2 this month</em></strong></div><div><small>Tasks completed</small><strong>28 <em>↗ 8 this week</em></strong></div><div><small>In progress</small><strong>08 <em>Right on track</em></strong></div></div><div className="mock-project-heading">Your projects <span>View all ↗</span></div><div className="mock-projects"><div><i className="mock-icon lavender">F</i><h5>Website refresh</h5><p>A new chapter for Forma</p><div className="mock-progress"><i /></div><small>8 of 12 tasks <span>67%</span></small></div><div><i className="mock-icon peach">O</i><h5>Orbit design system</h5><p>Building a common language</p><div className="mock-progress second"><i /></div><small>5 of 14 tasks <span>36%</span></small></div></div></div></div>
  </div>;
  if (theme === "forma") return <div className="art forma-art" aria-hidden="true"><div className="forma-window"><div className="forma-nav"><strong>forma<span>®</span></strong><span>Studio &nbsp; Projects &nbsp; Contact ↗</span></div><div className="forma-title">Spaces for<br /><em>being.</em><small>ARCHITECTURE FOR THE EVERYDAY.</small></div><div className="architecture"><div className="building-back" /><div className="building-front"><i /><i /><i /></div><div className="building-wall" /><div className="building-shadow" /><div className="arch-tree" /></div><div className="forma-caption">Considered spaces. Lasting impressions.<span>EST. 2024</span></div></div></div>;
  if (theme === "orbit") return <div className="art orbit-art" aria-hidden="true"><div className="orbit-window"><div className="orbit-nav"><strong>◎ orbit</strong><span>Discover &nbsp; Your library &nbsp; ⌕</span><i>S</i></div><small className="orbit-eyebrow">A LITTLE OUTSIDE YOUR ORBIT</small><h4>Less scrolling.<br />More <em>feeling.</em></h4><div className="albums"><div className="album album-one"><span>AFTER<br />HOURS</span><i /></div><div className="album album-two"><i /><span>slow<br />mornings.</span></div><div className="album album-three"><span>OTHER<br />WORLDS</span><i /></div></div><div className="orbit-player"><span>♫ &nbsp; A place between <small>Night swimming</small></span><b>ⅠⅠ</b><div /><span>2:34</span></div></div></div>;
  return <div className="art grove-art" aria-hidden="true"><div className="grove-window"><div className="grove-nav"><strong>grove.</strong><span>The collection &nbsp; Our story</span><span>Bag (0)</span></div><div className="grove-body"><small>LESS, BUT LOVELIER.</small><h4>Everyday objects.<br /><em>A little more soul.</em></h4><div className="grove-products"><div><div className="vase vase-one"><i /></div><span>The Sunday vase <b>₱ 890</b></span></div><div><div className="lamp"><i /><b /></div><span>The little glow <b>₱ 1,490</b></span></div><div><div className="vase vase-two"><i /></div><span>The everyday cup <b>₱ 490</b></span></div></div></div><div className="grove-bottom">Made with care. Kept for longer. <span>Explore the collection ↗</span></div></div></div>;
}

export default function Home() {
  const [filter, setFilter] = useState("All projects");
  const [selected, setSelected] = useState<Project | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const mainRef = useRef<HTMLElement>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(media.matches);
    update();
    media.addEventListener("change", update);
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add("is-visible"); observer.unobserve(entry.target); } });
    }, { threshold: 0.08 });
    document.querySelectorAll(".reveal").forEach(el => observer.observe(el));
    return () => { observer.disconnect(); media.removeEventListener("change", update); if (toastTimer.current) clearTimeout(toastTimer.current); };
  }, []);

  useEffect(() => {
    if (!selected) return;
    const dialog = dialogRef.current;
    dialog?.showModal();
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { dialog?.close(); document.body.style.overflow = previous; };
  }, [selected]);

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true); setCopyError(false);
      if (toastTimer.current) clearTimeout(toastTimer.current);
      toastTimer.current = setTimeout(() => setCopied(false), 3000);
    } catch { setCopyError(true); }
  }

  const stopMotion = paused || reducedMotion;
  useParallax(mainRef, stopMotion || Boolean(selected), filter);
  const visibleProjects = projects.filter(project => filter === "All projects" || project.category === filter);

  return <main ref={mainRef} id="top" data-motion={stopMotion || selected ? "paused" : "playing"}>
    <a className="skip-link" href="#work">Skip to work</a>
    <header className="site-header wrap">
      <a href="#top" className="wordmark" aria-label="Sean Villanueva, home">sean<span className="wordmark-star">✳</span></a>
      <nav className={menuOpen ? "navigation is-open" : "navigation"} aria-label="Main navigation" id="main-navigation">
        <a href="#work" onClick={() => setMenuOpen(false)}>Work</a><a href="#about" onClick={() => setMenuOpen(false)}>About</a><a href="#contact" onClick={() => setMenuOpen(false)}>Contact</a>
      </nav>
      <a href={`mailto:${email}`} className="header-contact">Let’s talk <Arrow /></a>
      <button type="button" className="menu-toggle" aria-label={menuOpen ? "Close navigation" : "Open navigation"} aria-expanded={menuOpen} aria-controls="main-navigation" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? "Close −" : "Menu +"}</button>
    </header>
    <section className="hero wrap" aria-labelledby="hero-heading"><div className="hero-surface">
      <div className="hero-grid" data-parallax="0.1" data-parallax-origin="top" />
      <div className="hero-copy" data-parallax="0.08" data-parallax-origin="top"><div className="eyebrow hero-eyebrow"><span className="status-dot" /> HELLO, I’M SEAN VILLANUEVA</div><h1 id="hero-heading">A little logic.<br />A lot of<br /><span>possibility.</span></h1><p>I’m a web developer turning thoughtful ideas<br className="desktop-break" /> into digital experiences that feel just right.</p><a href="#work" className="button button-light">Explore my work <span aria-hidden="true">↓</span></a></div>
      <div className="hero-visual" data-parallax="0.2" data-parallax-origin="top"><Sculpture paused={stopMotion || Boolean(selected)} /><div className="visual-caption"><span className="caption-line" /> CODE MEETS CURIOSITY</div></div>
      <div className="hero-bottom"><span>WEB DEVELOPER <i /> CREATIVE THINKER</span><button className="motion-control" type="button" onClick={() => setPaused(!paused)} disabled={reducedMotion} aria-pressed={stopMotion} aria-label={reducedMotion ? "Animation disabled by your reduced motion preference" : paused ? "Play animation" : "Pause animation"}><span aria-hidden="true">{stopMotion ? "▷" : "Ⅱ"}</span> {stopMotion ? "Motion paused" : "Pause motion"}</button><a href="#work">SCROLL TO EXPLORE <span aria-hidden="true">↓</span></a></div>
    </div></section>
    <div className="intro-strip wrap"><p>Thoughtful design. Clean code. <span>A little unexpected.</span></p><span className="intro-mark" aria-hidden="true">✳</span></div>

    <section id="work" className="work-section wrap section-space">
      <div className="section-heading reveal"><div><span className="eyebrow section-eyebrow">THE PROJECT FILES</span><h2>Ideas into <span className="serif-word">interfaces.</span></h2></div><p>A few explorations in design and development.<br />Built around the details that make a difference.</p></div>
      <div className="work-toolbar"><div className="filters" role="group" aria-label="Filter projects">{["All projects", "Development", "Design"].map(item => <button key={item} type="button" aria-pressed={filter === item} onClick={() => setFilter(item)}>{item}{item === "All projects" && <sup>04</sup>}</button>)}</div><span className="concept-note">CONCEPT COLLECTION / 2026</span></div>
      <div className="project-grid" aria-live="polite">{visibleProjects.map(project => <button type="button" key={project.name} className={`project-card ${project.theme}`} onClick={() => setSelected(project)} aria-label={`View ${project.name} concept project`}><div className="project-image"><div className="project-parallax" data-parallax="-0.055"><ProjectArt theme={project.theme} /></div><span className="project-open">Explore concept <Arrow /></span></div><div className="project-info"><div><h3>{project.name} <span>CONCEPT</span></h3><p>{project.type}</p></div><span className="project-arrow"><Arrow /></span></div><div className="project-tags">{project.tags.map(tag => <span key={tag}>{tag}</span>)}</div></button>)}</div>
      <p className="work-note">Sample interface concepts for this portfolio. Replace these with your own projects.</p>
    </section>

    <section id="about" className="about-section wrap section-space">
      <div className="about-panel reveal"><div className="about-visual" aria-hidden="true"><span className="about-small-label">A LITTLE ABOUT ME</span><div className="code-card" data-parallax="-0.08"><div className="code-dots"><i /><i /><i /><span>sean.ts</span></div><div className="code-lines"><p><b>const</b> sean = &#123;</p><p>&nbsp; role: <em>&quot;web developer&quot;</em>,</p><p>&nbsp; approach: [</p><p>&nbsp; &nbsp; <em>&quot;stay curious&quot;</em>,</p><p>&nbsp; &nbsp; <em>&quot;make it thoughtful&quot;</em>,</p><p>&nbsp; &nbsp; <em>&quot;keep building&quot;</em></p><p>&nbsp; ],</p><p>&nbsp; possibilities: <b>Infinity</b></p><p>&#125;;</p></div><div className="code-footer"><span>● Always a work in progress</span><span>TypeScript</span></div></div><div className="about-sticker" data-parallax="0.11">made with<br /><strong>curiosity.</strong><span>↗</span></div><div className="about-orbit" /></div><div className="about-copy"><span className="eyebrow section-eyebrow">THE PERSON BEHIND THE PIXELS</span><h2>Hi, I’m Sean.<br />I build for <span className="serif-word">people.</span></h2><p>I’m a web developer who cares about how things work—and how they feel. I enjoy bringing structure to an idea, finding its personality, and turning it into something you can click, explore, and use.</p><p>My sweet spot? Where clean, practical code meets a thoughtful visual experience. Always learning. Always making room for a better idea.</p><a className="text-link" href={`mailto:${email}`}>A good project starts with a conversation <Arrow /></a></div></div>
      <div className="toolkit reveal"><span className="eyebrow">THIS SITE’S BUILDING BLOCKS</span><div><span><b>⚛</b> React</span><span><b className="ts-icon">TS</b> TypeScript</span><span><b>◈</b> HTML & CSS</span><span><b>⌘</b> Responsive design</span><span><b>↝</b> Web animation</span></div></div>
    </section>

    <section id="contact" className="contact-section wrap section-space"><div className="contact-panel reveal"><span className="contact-spark" data-parallax="0.12" aria-hidden="true">✳</span><div className="eyebrow"><span className="status-dot" /> OPEN TO CONVERSATIONS</div><h2>Have something<br />in <span className="serif-word">mind?</span></h2><p>Let’s turn that “what if” into something real.</p><a href={`mailto:${email}`} className="button button-dark">Let’s make it happen <Arrow /></a><div className="email-row"><a href={`mailto:${email}`}>{email}</a><button onClick={copyEmail} type="button" aria-label="Copy email address" title="Copy email address">{copied ? "✓" : "⧉"}</button></div><span className="copy-feedback" role="status">{copied ? "Email copied. Talk soon!" : copyError ? "Please select and copy the email address above." : ""}</span></div></section>
    <footer className="site-footer wrap"><a href="#top" className="wordmark" aria-label="Back to top">sean<span className="wordmark-star">✳</span></a><p>© {new Date().getFullYear()} Sean Villanueva <span>Built with intention.</span></p><a href="#top" className="back-top">BACK TO TOP <span aria-hidden="true">↑</span></a></footer>

    {selected && <dialog ref={dialogRef} className={`project-dialog ${selected.theme}`} aria-labelledby="project-title" onCancel={() => setSelected(null)} onClick={event => { if (event.target === event.currentTarget) setSelected(null); }}><button type="button" className="dialog-close" onClick={() => setSelected(null)} aria-label="Close project details" autoFocus>×</button><ProjectArt theme={selected.theme} /><div className="dialog-content"><div className="eyebrow">SAMPLE CONCEPT / {selected.category.toUpperCase()}</div><h2 id="project-title">{selected.name}<span>↗</span></h2><p className="dialog-intro">{selected.description}</p><div className="dialog-details"><div><h3>The idea</h3><p>{selected.challenge}</p></div><div><h3>The approach</h3><p>{selected.approach}</p></div></div><div className="project-tags">{selected.tags.map(tag => <span key={tag}>{tag}</span>)}</div><p className="dialog-note">This is a sample visual concept, not a live client product.</p><a className="text-link" href={`mailto:${email}?subject=${encodeURIComponent(`Let’s build something like ${selected.name}`)}`}>Have a similar idea? Let’s talk <Arrow /></a></div></dialog>}
  </main>;
}
