"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { ArrowDownToLine } from "lucide-react";
import { profile } from "@/app/lib/portfolio-profile";
import { startAboutMotion } from "@/app/lib/about-motion";
import { Toolkit } from "./toolkit";

const resumeFormat = profile.resumeHref.split(".").pop()?.toUpperCase() ?? "FILE";
const [degreeName, degreeField] = profile.degree.split(" in ");

/**
 * "Web developer." typed one character at a time, with a caret that trails the last letter.
 * Screen readers get the plain text; the per-character spans are hidden from them.
 * Spaces sit between inline-block words, so the line can still wrap without splitting a word.
 */
function TypedRole({ text }: { text: string }) {
  const words = text.split(" ");
  const total = text.length;
  let index = 0;
  return <>
    <span className="sr-only">{text}</span>
    <span className="role-typed" aria-hidden="true" style={{ "--n": total } as CSSProperties}>
      {words.map((word, w) => <span key={w}>
        <span className="role-word">
          {[...word].map(char => {
            const i = index++;
            return <span key={i} className={i === total - 1 ? "role-char is-last" : "role-char"} style={{ "--i": i } as CSSProperties}>{char}</span>;
          })}
        </span>
        {w < words.length - 1 ? (index++, " ") : ""}
      </span>)}
    </span>
  </>;
}

/** A highlighted phrase; the marker sweeps in after the paragraph reveals, one phrase after another. */
function Key({ order, children }: { order: number; children: ReactNode }) {
  return <mark style={{ "--k": order } as CSSProperties}>{children}</mark>;
}

export function AboutSection({ paused = false }: { paused?: boolean }) {
  const sectionRef = useRef<HTMLElement>(null);

  // Timeline timing and the year counter need measurements, so they run here once motion is allowed.
  useEffect(() => {
    if (paused || !sectionRef.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    return startAboutMotion(sectionRef.current);
  }, [paused]);

  return <section ref={sectionRef} id="about" className="about-section about-editorial wrap section-space" aria-labelledby="about-title" data-paused={paused}>
    <div className="about-orbital-lines" aria-hidden="true"><span /><span /></div>

    <div className="about-introduction" data-scroll-reveal data-reveal-stagger>
      <h2 id="about-title" data-reveal-detail="lines">
        <span className="reveal-line"><span className="reveal-line-inner">Hi, I’m Sean.</span></span>
        <span className="reveal-line"><span className="reveal-line-inner about-role"><TypedRole text="Web developer." /></span></span>
      </h2>
    </div>

    <div className="about-education" aria-labelledby="education-title" data-scroll-reveal data-reveal-stagger>
      <h3 id="education-title" className="about-section-label" data-reveal-detail>Education</h3>
      <div className="education-path">
        <div className="education-study">
          <h4>{degreeName}<br />in {degreeField}</h4>
          <p>{profile.school}</p>
        </div>
        <dl className="education-facts">
          <div className="education-fact">
            <dt>Academic period</dt><dd>{profile.educationPeriod}</dd>
          </div>
          <div className="education-fact is-current">
            <dt>Current year</dt><dd>Year <span data-count-to={profile.yearOfStudy}>{profile.yearOfStudy}</span> of {profile.programYears}</dd>
          </div>
          <div className="education-fact">
            <dt>Section</dt><dd>{profile.section}</dd>
          </div>
        </dl>
      </div>
    </div>

    <div className="about-biography" data-scroll-reveal data-reveal-stagger>
      <div className="about-bio-text">
        <p data-reveal-detail>I’m {profile.fullName}, a fourth-year <Key order={0}>Information Systems</Key> student based in {profile.location}.</p>
        <p data-reveal-detail>I work on front-end and back-end features for our ongoing<br className="about-desktop-break" /> <Key order={1}>Pharxmaco Drugstore</Key> team project, using <Key order={2}>PHP</Key>, <Key order={3}>CodeIgniter 4</Key><br className="about-desktop-break" /> and <Key order={4}>MySQL</Key>.</p>
      </div>
      <div className="about-bio-actions" data-reveal-detail>
        <a className="resume-cta about-resume" href={profile.resumeHref} download><span>Download résumé</span><span className="resume-format">{resumeFormat}</span><ArrowDownToLine size={21} aria-hidden="true" /></a>
        <p className="availability-pill"><i aria-hidden="true" />{profile.availability}</p>
      </div>
    </div>

    <Toolkit />

    <div className="about-details" data-scroll-reveal data-reveal-stagger>
      <div data-reveal-detail>
        <h3>On our team project</h3>
        <p>For our Pharxmaco Drugstore project, I work on both the front end and back end using PHP, CodeIgniter 4, MySQL, and browser technologies. I contribute to sales and inventory features, user access, database integration, debugging, and interface improvements. My technical work includes SQL queries and CRUD operations.</p>
      </div>
      <div data-reveal-detail>
        <h3>How I work</h3>
        <p>Debugging helps me work through technical problems. Working with stock updates, transaction history, and refunds has also taught me to pay close attention to details. I collaborate with my project team and am willing to learn new technologies and improve my skills.</p>
        <ul className="about-study-focus" aria-label="Study focus">{profile.studyFocus.map(topic => <li key={topic}>{topic}</li>)}</ul>
      </div>
    </div>
  </section>;
}
