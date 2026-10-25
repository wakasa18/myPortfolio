"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactElement, type ReactNode } from "react";
import { ArrowDownToLine, ArrowUpRight, Check, Database } from "lucide-react";
import { pharmacyProject, profile } from "@/app/lib/portfolio-profile";
import "@/app/pharmacy-map.css";

/* ---------------------------------------------------------------------------
   EDIT HERE
   - `screenshot`: put a real screenshot (dummy data only) in /public and fill this in.
     While it is null, no screenshot frame is rendered.
   - `modules`: the text in the detail panel. It is rewritten from what the page already said;
     change any line that is not exactly what you built.
   - `roles`, `saleLines`, `stockLines`, `historyLines`: SAMPLE data for the mini previews only.
   --------------------------------------------------------------------------- */
type Shot = { src: string; alt: string };
const screenshot = null as Shot | null; // e.g. { src: "/images/pharxmaco-pos.png", alt: "Pharxmaco point of sale screen with sample data" }

const roles = ["Admin", "Pharmacist", "Cashier"];
const saleLines = [["Paracetamol 500 mg", "×2", "16.00"], ["Vitamin C 500 mg", "×1", "9.50"], ["Alcohol 70% 250 ml", "×1", "62.00"]];
const stockLines = [["Paracetamol", 86, false], ["Vitamin C", 48, false], ["Alcohol 70%", 17, true]] as const;
const historyLines = [["#0042", "Sale", "87.50", false], ["#0041", "Sale", "35.00", false], ["#0040", "Refund", "−16.00", true]] as const;

type ModuleId = "pos" | "access" | "inventory" | "history";

/* Icons are drawn here (not lucide) so each one can animate its own parts. */
const svgProps = { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true, focusable: false } as const;
const CartIcon = () => <svg {...svgProps}><g className="ic-cart"><path d="M3 5h2.2l1.6 9.2h9.6L18.4 8H6.1" /><circle cx="9" cy="18.6" r="1.3" /><circle cx="16" cy="18.6" r="1.3" /></g></svg>;
const BoxesIcon = () => <svg {...svgProps}><rect x="4" y="13" width="16" height="7" rx="1.5" /><path d="M12 13v3" /><rect className="ic-top" x="7.5" y="4.5" width="9" height="6.5" rx="1.2" /></svg>;
const ShieldIcon = () => <svg {...svgProps}><path d="M12 3.5l7 2.8v5.2c0 4.6-2.9 7.6-7 9-4.1-1.4-7-4.4-7-9V6.3z" /><path className="ic-check" pathLength={1} d="M8.8 12.2l2.2 2.2 4.2-4.4" /></svg>;
const HistoryIcon = () => <svg {...svgProps}><g className="ic-hist"><path d="M3.5 12a8.5 8.5 0 1 0 2.6-6.1" /><path d="M3.5 4.5v4.2h4.2" /><path d="M12 7.5v4.8l3 1.8" /></g></svg>;

type Module = { id: ModuleId; step: number; side: "left" | "right"; row: 1 | 2; title: string; detail: string; summary: string; points: string[]; Icon: () => ReactElement; preview: ReactNode };

const modules: Module[] = [
  {
    id: "pos", step: 1, side: "left", row: 1, title: "Point of sale", detail: "Sales transactions", Icon: CartIcon,
    summary: "The selling side of the system: building a sale and recording the transaction.",
    points: ["Point-of-sale screen", "Sales transactions saved to the MySQL database"],
    preview: <div className="pv pv-pos"><ul>{saleLines.map(([name, qty, price]) => <li key={name}><span>{name}</span><em>{qty}</em><b>{price}</b></li>)}</ul><div className="pv-total"><span>Total</span><b>₱87.50</b></div></div>,
  },
  {
    id: "access", step: 0, side: "right", row: 1, title: "User access", detail: "Authentication & roles", Icon: ShieldIcon,
    summary: "Who can sign in, and which parts of the system each role can open.",
    points: ["Authentication (staff sign-in)", "Role-based access"],
    preview: <div className="pv pv-access">{roles.map((role, index) => <span key={role} className={index === 2 ? "is-on" : undefined}>{role}</span>)}</div>,
  },
  {
    id: "inventory", step: 2, side: "left", row: 2, title: "Inventory", detail: "Automatic stock updates", Icon: BoxesIcon,
    summary: "Keeps stock counts in step with what is sold.",
    points: ["Inventory records", "Automatic stock updates"],
    preview: <div className="pv pv-stock">{stockLines.map(([name, level, low]) => <div key={name}><span>{name}</span><i><u className={low ? "is-low" : undefined} style={{ width: `${level}%` }} /></i>{low ? <small>Low</small> : <small aria-hidden="true" />}</div>)}</div>,
  },
  {
    id: "history", step: 3, side: "right", row: 2, title: "Transaction history", detail: "Returns & refunds", Icon: HistoryIcon,
    summary: "The record of past transactions, including returns and refunds.",
    points: ["Transaction history", "Return and refund processing"],
    preview: <div className="pv pv-history">{historyLines.map(([id, kind, amount, refund]) => <div key={id} className={refund ? "is-refund" : undefined}><span>{id}</span><em>{kind}</em><b>{amount}</b></div>)}</div>,
  },
];

export function PharmacyProject() {
  const [active, setActive] = useState<ModuleId | null>("pos");
  const systemRef = useRef<HTMLDivElement>(null);
  const detailRef = useRef<HTMLDivElement>(null);
  const current = modules.find(module => module.id === active) ?? null;

  /* One boot-up when the map first scrolls into view; the flow lights only run while it is on screen. */
  useEffect(() => {
    const element = systemRef.current;
    if (!element) return;
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) element.dataset.boot = "pending";
    const observer = new IntersectionObserver(entries => {
      const entry = entries[entries.length - 1];
      element.dataset.live = String(entry.isIntersecting);
      if (entry.isIntersecting && element.dataset.boot === "pending") element.dataset.boot = "on";
    }, { threshold: .3 });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  /* On a phone the detail sits below the whole map: bring it into view only if it is off screen. */
  const select = (id: ModuleId) => {
    const next = active === id ? null : id;
    setActive(next);
    if (!next) return;
    requestAnimationFrame(() => {
      const box = detailRef.current?.getBoundingClientRect();
      if (box && (box.bottom > window.innerHeight || box.top < 0)) detailRef.current?.scrollIntoView({ block: "nearest" });
    });
  };

  return <article className="pharmacy-project" aria-labelledby="pharmacy-title" data-scroll-reveal data-spotlight>
    <div className="pharmacy-summary">
      <div className="pharmacy-kicker"><span className="eyebrow">FEATURED TEAM PROJECT</span><span className="project-status"><i aria-hidden="true" />{pharmacyProject.status}</span></div>
      <h3 id="pharmacy-title">{pharmacyProject.name}<span>Online point of sale & inventory system.</span></h3>
      <p className="pharmacy-project-title">{pharmacyProject.title}</p>
      <dl className="pharmacy-facts"><div><dt>My role</dt><dd>Front-end & back-end web developer</dd></div><div><dt>Development</dt><dd>{pharmacyProject.period} · Ongoing</dd></div></dl>
      <p className="pharmacy-description">I built the point of sale, inventory, user access, and transaction history modules of our pharmacy system, from the interface to the database. My work also includes debugging and improving the interface.</p>
      <div className="pharmacy-actions"><a className="text-link" href={pharmacyProject.liveHref} target="_blank" rel="noopener noreferrer" aria-describedby="pharmacy-live-note">Open live project <ArrowUpRight size={17} aria-hidden="true" /><span className="sr-only"> (opens in a new tab)</span></a><a className="text-link" href={profile.portfolioHref} download>Download project brief <ArrowDownToLine size={17} aria-hidden="true" /></a></div>
      <p id="pharmacy-live-note" className="pharmacy-live-note">The live system opens to the staff sign-in page.</p>
    </div>

    <div className="pharmacy-system" ref={systemRef} aria-label="Pharmacy system map">
      <div className="system-map-heading"><span className="pharmacy-cross" aria-hidden="true" /><div><strong>Pharxmaco</strong><span>POINT OF SALE & INVENTORY</span></div><span className="system-map-label">SYSTEM MAP</span></div>
      <p className="system-map-intro">Modules I built. Select one for details.</p>

      <div className="pmap-board">
        {modules.map(({ id, step, side, row, title, detail, Icon, preview }) => {
          const open = active === id;
          return <button key={id} type="button" className="pmap-card" data-side={side} data-row={row} data-reveal-detail style={{ "--step": step } as CSSProperties}
            aria-expanded={open} aria-controls="pmap-detail" onClick={() => select(id)}>
            <span className="pmap-card-head">
              <span className="pmap-icon"><Icon /></span>
              <span className="pmap-names"><span className="pmap-title" id={`pmap-title-${id}`}>{title}</span><span className="pmap-sub">{detail}</span></span>
            </span>
            <span className="pmap-preview" aria-hidden="true">{preview}</span>
          </button>;
        })}
        <span className="pmap-spine" aria-hidden="true"><i className="pmap-dot" /></span>
        <div className="pmap-foundation">
          <span className="pmap-foundation-label">Built on</span>
          <span className="pmap-stack"><b>PHP / CodeIgniter 4</b><i className="pmap-join" aria-hidden="true" /><span className="sr-only"> with </span><b><Database size={14} strokeWidth={1.7} aria-hidden="true" />MySQL</b></span>
        </div>
      </div>

      <div className="pmap-detail" id="pmap-detail" ref={detailRef} role="region" aria-live="polite" aria-labelledby={current ? `pmap-title-${current.id}` : undefined} hidden={!current}>
        {current && <div className="pmap-detail-body" key={current.id}>
          <span className="pmap-icon pmap-detail-icon" aria-hidden="true"><current.Icon /></span>
          <div><p className="pmap-detail-summary">{current.summary}</p><ul>{current.points.map(point => <li key={point}><Check size={14} strokeWidth={2} aria-hidden="true" />{point}</li>)}</ul></div>
        </div>}
      </div>
      <p className="system-map-caption">Project overview · {pharmacyProject.period} · previews use sample data</p>
    </div>

    {screenshot && <figure className="pmap-shot">
      <div className="pmap-shot-frame"><div className="pmap-shot-bar" aria-hidden="true"><i /><i /><i /><span>Pharxmaco · staff dashboard</span></div><img src={screenshot.src} alt={screenshot.alt} width={1600} height={1000} loading="lazy" decoding="async" /></div>
      <figcaption>Screenshot with sample data. The live system sits behind staff sign-in.</figcaption>
    </figure>}

    <div className="pharmacy-details">
      <div><span className="eyebrow">MY CONTRIBUTION</span><p>I built all four modules: POS and sales transactions, inventory and automatic stock updates, authentication and role-based access, and transaction history with return and refund processing.</p><p className="pharmacy-scope">Sales forecasting is part of the wider project scope.</p></div>
      <div><span className="eyebrow">TECHNOLOGIES USED</span><div className="project-tags">{pharmacyProject.technologies.map(tool => <span key={tool}>{tool}</span>)}</div></div>
    </div>
  </article>;
}
