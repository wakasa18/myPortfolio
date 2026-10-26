"use client";

import * as React from "react";
import { ArrowUp, ArrowUpRight, Check, Copy, FileText, Heart, Mail, MapPin, Pause, Phone, Play, Sparkle, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { revealFooterForKeyboard } from "@/app/lib/ui-accessibility";
import { getGmailComposeHref } from "@/app/lib/contact-links";
import "./motion-footer.css";

export type MagneticButtonProps =
  | (React.AnchorHTMLAttributes<HTMLAnchorElement> & { as: "a" })
  | (React.ButtonHTMLAttributes<HTMLButtonElement> & { as?: "button" });

// Keep native link/button semantics, keyboard behavior, and correctly typed refs.
export const MagneticButton = React.forwardRef<HTMLElement, MagneticButtonProps>(function MagneticButton(props, forwardedRef) {
  const ref = (node: HTMLElement | null) => {
    if (typeof forwardedRef === "function") return forwardedRef(node);
    if (forwardedRef) forwardedRef.current = node;
  };
  if (props.as === "a") {
    const { as: Tag, className, children, ...rest } = props;
    return <Tag ref={ref} className={cn("footer-glass-pill", className)} data-magnetic {...rest}>{children}</Tag>;
  }
  const { as: Tag = "button", className, children, type = "button", ...rest } = props;
  return <Tag ref={ref} type={type} className={cn("footer-glass-pill", className)} data-magnetic {...rest}>{children}</Tag>;
});

function subscribeMotion(callback: () => void) {
  const media = window.matchMedia("(prefers-reduced-motion: reduce)");
  media.addEventListener("change", callback);
  return () => media.removeEventListener("change", callback);
}
const readMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const serverMotion = () => false;
const specialties = ["PHP & CodeIgniter", "MySQL", "Front-end development", "Back-end development"];

export interface CinematicFooterProps {
  className?: string;
  id?: string;
  name?: string;
  email?: string;
  phone?: string;
  phoneHref?: string;
  location?: string;
  resumeHref?: string;
  description?: string;
  workHref?: string;
  aboutHref?: string;
  topHref?: string;
  paused?: boolean;
  onPausedChange?: (paused: boolean) => void;
}

export function CinematicFooter({ className, id = "contact", name = "Sean Villanueva", email = "villanuevasean0918@gmail.com", phone, phoneHref, location, resumeHref, description = "Let’s turn that “what if” into something real.", workHref = "#work", aboutHref = "#about", topHref = "#top", paused, onPausedChange }: CinematicFooterProps = {}) {
  const wrapperRef = React.useRef<HTMLDivElement>(null);
  const headingId = React.useId();
  const [localPaused, setLocalPaused] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  const [copyError, setCopyError] = React.useState(false);
  const copyTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const mounted = React.useRef(false);
  const reducedMotion = React.useSyncExternalStore(subscribeMotion, readMotion, serverMotion);
  const stopMotion = (paused ?? localPaused) || reducedMotion;
  // Decorative only: the real contact links stay in the footer below.
  const orbitIcons = [Mail, phone ? Phone : null, resumeHref ? FileText : null, location ? MapPin : null].filter((Icon): Icon is LucideIcon => Icon !== null);

  React.useEffect(() => {
    mounted.current = true;
    return () => { mounted.current = false; if (copyTimer.current) clearTimeout(copyTimer.current); };
  }, []);

  React.useEffect(() => {
    const container = wrapperRef.current;
    if (!container || stopMotion) return;
    const root = container;
    let disposed = false;
    let initialized = false;
    let cleanup: (() => void) | undefined;
    let visible = false;
    const syncVisibility = () => { root.dataset.active = String(visible && !document.hidden); };

    async function initialize() {
      if (initialized) return;
      initialized = true;
      try {
        const [{ gsap }, { ScrollTrigger }] = await Promise.all([import("gsap"), import("gsap/ScrollTrigger")]);
        if (disposed) return;
        gsap.registerPlugin(ScrollTrigger);
        const listeners: (() => void)[] = [];
        const context = gsap.context(() => {
          const media = gsap.matchMedia();
          media.add("(min-width: 801px) and (min-height: 871px) and (prefers-reduced-motion: no-preference)", () => {
            gsap.fromTo(root.querySelector(".footer-giant-bg-text"), { y: 70, scale: .92 }, {
              y: 0, scale: 1, ease: "none",
              scrollTrigger: { trigger: root, start: "top bottom", end: "bottom bottom", scrub: true },
            });
            // Content never becomes transparent: direct contact links remain usable mid-scroll.
            gsap.from(root.querySelector(".footer-center"), {
              y: 36, ease: "none",
              scrollTrigger: { trigger: root, start: "top bottom", end: "top 20%", scrub: true },
            });
          });
          media.add("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)", () => {
            const remove: (() => void)[] = [];
            root.querySelectorAll<HTMLElement>("[data-magnetic]").forEach(element => {
              const moveX = gsap.quickTo(element, "x", { duration: .3, ease: "power2.out" });
              const moveY = gsap.quickTo(element, "y", { duration: .3, ease: "power2.out" });
              let bounds: DOMRect | undefined;
              const enter = () => { bounds = element.getBoundingClientRect(); };
              const move = (event: PointerEvent) => {
                if (!bounds || event.pointerType !== "mouse") return;
                moveX(Math.max(-8, Math.min(8, (event.clientX - bounds.left - bounds.width / 2) * .12)));
                moveY(Math.max(-6, Math.min(6, (event.clientY - bounds.top - bounds.height / 2) * .12)));
              };
              const leave = () => { if (!bounds) return; bounds = undefined; moveX(0); moveY(0); };
              element.addEventListener("pointerenter", enter);
              element.addEventListener("pointermove", move);
              element.addEventListener("pointerleave", leave);
              element.addEventListener("focus", leave);
              window.addEventListener("scroll", leave, { passive: true });
              remove.push(() => {
                element.removeEventListener("pointerenter", enter);
                element.removeEventListener("pointermove", move);
                element.removeEventListener("pointerleave", leave);
                element.removeEventListener("focus", leave);
                window.removeEventListener("scroll", leave);
              });
            });
            return () => remove.forEach(fn => fn());
          });
          listeners.push(() => media.revert());
        }, root);
        cleanup = () => { listeners.forEach(fn => fn()); context.revert(); };
      } catch {
        cleanup?.();
        // Static content, native links, and contact actions need no animation library.
      }
    }

    const observer = new IntersectionObserver(entries => {
      visible = entries[0]?.isIntersecting ?? false;
      syncVisibility();
      if (visible) void initialize();
    });
    observer.observe(root);
    document.addEventListener("visibilitychange", syncVisibility);
    return () => {
      disposed = true;
      root.dataset.active = "false";
      observer.disconnect();
      document.removeEventListener("visibilitychange", syncVisibility);
      cleanup?.();
    };
  }, [stopMotion]);

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(email);
      if (!mounted.current) return;
      setCopied(true); setCopyError(false);
      if (copyTimer.current) clearTimeout(copyTimer.current);
      copyTimer.current = setTimeout(() => setCopied(false), 3000);
    } catch {
      if (mounted.current) { setCopied(false); setCopyError(true); }
    }
  }

  function toggleMotion() {
    const next = !(paused ?? localPaused);
    if (onPausedChange) onPausedChange(next); else setLocalPaused(next);
  }

  return <div ref={wrapperRef} id={id} className={cn("cinematic-footer-wrapper", (phone || location) && "has-profile-details", className)} data-motion={stopMotion ? "paused" : "playing"} data-active="false" onFocusCapture={event => {
    // Fixed descendants cannot scroll themselves out of the curtain's clip.
    const root = wrapperRef.current;
    if (root) revealFooterForKeyboard(root, event.target, !reducedMotion && window.matchMedia("(min-width: 801px) and (min-height: 871px)").matches);
  }}>
    <footer className="cinematic-footer" aria-labelledby={headingId}>
      <div className="footer-aurora" aria-hidden="true" />
      <div className="footer-bg-grid" aria-hidden="true" />
      <div className="footer-giant-bg-text" aria-hidden="true">{name.split(" ")[0].toUpperCase()}</div>
      <div className="footer-marquee" aria-hidden="true"><div className="footer-marquee-track">{[0, 1].map(copy => <div className="footer-marquee-group" key={copy}>{specialties.map(item => <React.Fragment key={item}><span>{item}</span><Sparkle className="footer-marquee-star" size={18} fill="currentColor" strokeWidth={0} aria-hidden="true" focusable="false" /></React.Fragment>)}</div>)}</div></div>

      <div className="footer-center">
        <div className="footer-headline">
          <div className="footer-portal" aria-hidden="true">
            <span className="portal-halo" />
            <span className="portal-ring" />
            <span className="portal-core" />
            <span className="portal-orbit">
              {orbitIcons.map((Icon, index) => <span className="portal-chip" key={index} style={{ "--a": `${Math.round(35 + (index * 360) / orbitIcons.length)}deg` } as React.CSSProperties}><span><Icon size={18} /></span></span>)}
            </span>
          </div>
          <p className="footer-eyebrow"><span /> OPEN TO CONVERSATIONS</p>
          <h2 id={headingId} className="footer-text-glow">Have something<br />in <em>mind?</em></h2>
        </div>
        <p className="footer-description">{description}</p>
        <div className="footer-primary-links">
          <MagneticButton as="a" href={getGmailComposeHref(email)} target="_blank" rel="noopener noreferrer" className="footer-primary">Email me in Gmail <ArrowUpRight size={21} aria-hidden="true" /><span className="sr-only"> (opens in a new tab)</span></MagneticButton>
          <MagneticButton as="a" href={workHref}>Explore my work <ArrowUpRight size={19} aria-hidden="true" /></MagneticButton>
        </div>
        <div className="footer-email-row"><a className="footer-email-link" href={getGmailComposeHref(email)} target="_blank" rel="noopener noreferrer" title="Compose an email in Gmail">{email}<span className="sr-only"> (opens Gmail in a new tab)</span></a><button type="button" onClick={copyEmail} aria-label="Copy email address" title="Copy email address">{copied ? <Check size={18} aria-hidden="true" /> : <Copy size={18} aria-hidden="true" />}</button></div>
        <p className="footer-copy-status" role="status">{copied ? "Email copied. Talk soon!" : copyError ? "Please select and copy the email address above." : ""}</p>
        {(phone || location) && <div className="footer-contact-details">{phone && <a href={phoneHref ?? `tel:${phone}`}><Phone size={14} aria-hidden="true" />{phone}</a>}{location && <span><MapPin size={14} aria-hidden="true" />{location}</span>}</div>}
        <nav className="footer-secondary-links" aria-label="Footer navigation">
          <MagneticButton as="a" href={`mailto:${email}`}>Use email app</MagneticButton>
          <MagneticButton as="a" href={aboutHref}>About me</MagneticButton>
          {resumeHref && <MagneticButton as="a" href={resumeHref} download>Download résumé</MagneticButton>}
          <MagneticButton onClick={toggleMotion} disabled={reducedMotion} aria-pressed={stopMotion} aria-label={reducedMotion ? "Animation disabled by your reduced motion preference" : stopMotion ? "Resume site motion" : "Pause site motion"}>{stopMotion ? <Play size={14} aria-hidden="true" /> : <Pause size={14} aria-hidden="true" />}{stopMotion ? "Motion paused" : "Pause motion"}</MagneticButton>
        </nav>
      </div>

      <div className="footer-credits">
        <p>© {new Date().getFullYear()} {name}<span>Web developer. Always curious.</span></p>
        <div className="footer-crafted">Crafted with <Heart size={15} className="footer-heart" aria-hidden="true" /><span className="sr-only">care</span> by <strong>{name.split(" ")[0]}</strong></div>
        <MagneticButton as="a" href={topHref} className="footer-back-top" aria-label="Back to top" onClick={event => {
          if (topHref !== "#top" || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
          const top = document.getElementById("top");
          top?.focus({ preventScroll: true });
          // Let native anchor navigation update the URL and preserve modified clicks.
        }}><ArrowUp size={21} aria-hidden="true" /></MagneticButton>
      </div>
    </footer>
  </div>;
}
