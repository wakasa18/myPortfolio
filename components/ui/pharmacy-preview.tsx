"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState, type RefObject } from "react";
import { ArrowDownLeft, ArrowUpRight, Boxes, Check, ChevronDown, History, Package, Pill, Plus, Search, ShieldCheck, ShoppingCart, SlidersHorizontal } from "lucide-react";

export const projectChapters = [
  { id: "pos", title: "Point of sale", caption: "From cart to recorded sale.", description: "I contributed to the point-of-sale screen and saving sales transactions to the MySQL database." },
  { id: "inventory", title: "Inventory", caption: "Stock that keeps up with sales.", description: "My inventory work includes records and automatic stock updates as items are sold." },
  { id: "history", title: "Transaction history", caption: "A clear record of what happened.", description: "I contributed to transaction history, including return and refund processing." },
] as const;

type Chapter = typeof projectChapters[number]["id"];
const medicines = [
  { name: "Paracetamol", line: "Paracetamol 500 mg", dose: "500 mg", stock: 120, price: "3.50", cents: 350, category: "Pain relief" },
  { name: "Vitamin C", line: "Vitamin C 500 mg", dose: "500 mg", stock: 85, price: "5.00", cents: 500, category: "Vitamins" },
  { name: "Amoxicillin", line: "Amoxicillin 500 mg", dose: "500 mg", stock: 42, price: "12.00", cents: 1200, category: "Antibiotics" },
  { name: "Cetirizine", line: "Cetirizine 10 mg", dose: "10 mg", stock: 60, price: "8.50", cents: 850, category: "Allergy relief" },
  { name: "Mefenamic Acid", line: "Mefenamic Acid", dose: "500 mg", stock: 37, price: "6.00", cents: 600, category: "Pain relief" },
  { name: "Salbutamol", line: "Salbutamol 100 mcg", dose: "100 mcg", stock: 25, price: "180.00", cents: 18000, category: "Respiratory" },
];
const navigation = [
  { id: "pos", label: "Point of sale", Icon: ShoppingCart },
  { id: "inventory", label: "Inventory", Icon: Boxes },
  { id: "history", label: "Transactions", Icon: History },
];

const money = (cents: number) => `₱ ${(cents / 100).toFixed(2)}`;
const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

/* ------------------------------------------------------------------------------------------
   Demo engine. Each chapter is a list of frames. A frame says what the screen looks like and
   how long to hold it. The first render (and the server render) always uses the LAST frame,
   which is the same screen as the original static illustration. So reduced motion, the pause
   button, and no-JS all show exactly what they showed before.
------------------------------------------------------------------------------------------- */
type Frame = { hold: number };
type Demo<F extends Frame> = { index: number; cycle: number; frame: F };

/** index -1 is the resting screen: identical to the original static illustration. */
function useDemo<F extends Frame>(frames: F[], rest: F, play: boolean, hold: boolean): Demo<F> {
  const last = frames.length - 1;
  const [state, setState] = useState({ index: -1, cycle: 0 });

  // Start from the top whenever the chapter becomes active; go back to rest when it stops being active or motion is off.
  useIsoLayoutEffect(() => {
    if (play) setState(previous => ({ index: 0, cycle: previous.cycle + 1 }));
    else setState(previous => (previous.index === -1 ? previous : { index: -1, cycle: previous.cycle }));
  }, [play]);

  useEffect(() => {
    if (!play || hold || state.index < 0) return;
    const timer = window.setTimeout(() => {
      setState(previous => previous.index >= last ? { index: 0, cycle: previous.cycle + 1 } : { index: previous.index + 1, cycle: previous.cycle });
    }, frames[Math.min(state.index, last)].hold);
    return () => window.clearTimeout(timer);
  }, [play, hold, state.index, last, frames]);

  return { index: state.index, cycle: state.cycle, frame: state.index < 0 ? rest : frames[Math.min(state.index, last)] };
}

/** Counts up to a value; going down (a reset) jumps instead of counting backwards. */
function useCountUp(target: number, animate: boolean, duration = 520) {
  const [shown, setShown] = useState(target);
  const shownRef = useRef(target);
  useEffect(() => {
    if (!animate || target <= shownRef.current) { shownRef.current = target; setShown(target); return; }
    const from = shownRef.current;
    const start = performance.now();
    let frame = 0;
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const value = Math.round(from + (target - from) * (1 - Math.pow(1 - t, 3)));
      shownRef.current = value;
      setShown(value);
      if (t < 1) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [target, animate, duration]);
  return shown;
}

/** A pointer that glides to named targets inside the preview. */
function useCursor(innerRef: RefObject<HTMLDivElement | null>, target: string | null, step: number) {
  const targets = useRef(new Map<string, HTMLElement>());
  const [cursor, setCursor] = useState<{ x: number; y: number; visible: boolean; instant: boolean }>({ x: 0, y: 0, visible: false, instant: true });
  const seen = useRef(false);
  const register = useCallback((id: string) => (node: HTMLElement | null) => { if (node) targets.current.set(id, node); else targets.current.delete(id); }, []);

  useIsoLayoutEffect(() => {
    const inner = innerRef.current;
    const node = target ? targets.current.get(target) : undefined;
    if (!inner || !node) { setCursor(previous => ({ ...previous, visible: false, instant: false })); return; }
    const box = node.getBoundingClientRect();
    if (box.width === 0) { setCursor(previous => ({ ...previous, visible: false, instant: false })); return; }
    const base = inner.getBoundingClientRect();
    const x = box.left - base.left + box.width * .55;
    const y = box.top - base.top + box.height * .55;
    if (!seen.current) {
      // First appearance: start a little way off so the pointer visibly travels in.
      seen.current = true;
      setCursor({ x: x + 70, y: y + 90, visible: false, instant: true });
      const frame = requestAnimationFrame(() => setCursor({ x, y, visible: true, instant: false }));
      return () => cancelAnimationFrame(frame);
    }
    setCursor({ x, y, visible: true, instant: false });
  }, [innerRef, target, step]);

  return { register, cursor };
}

function Cursor({ cursor, pressing }: { cursor: { x: number; y: number; visible: boolean; instant: boolean }; pressing: number }) {
  return <span className="app-cursor" data-visible={cursor.visible} data-instant={cursor.instant} style={{ transform: `translate3d(${cursor.x}px, ${cursor.y}px, 0)` }} aria-hidden="true">
    {pressing > 0 && <i className="app-cursor-ring" key={pressing} />}
    <svg width="17" height="21" viewBox="0 0 17 21"><path d="M1.5 1.2 1.5 16.2 5.4 12.6 8.1 19.2 11 18 8.3 11.5 13.8 11.3Z" /></svg>
  </span>;
}

/* ------------------------------------------------------------------------------------------ */
/* Point of sale                                                                               */
/* ------------------------------------------------------------------------------------------ */
type PosFrame = Frame & { qty: number[]; order: number[]; target: string | null; press: number; phase: "shopping" | "recording" | "done" };

const posScript: { target?: string | null; add?: number; phase?: PosFrame["phase"]; hold: number }[] = [
  { hold: 1000 },                                                        // empty order
  { target: "add-0", hold: 800 },                                        // pointer arrives
  { target: "add-0", add: 0, hold: 850 },                                // Paracetamol
  { target: "add-0", add: 0, hold: 850 },                                // Paracetamol again
  { target: "add-1", hold: 800 },
  { target: "add-1", add: 1, hold: 850 },                                // Vitamin C
  { target: "add-4", hold: 800 },
  { target: "add-4", add: 4, hold: 1000 },                               // Mefenamic Acid
  { target: "complete", hold: 850 },
  { target: "complete", phase: "recording", hold: 1000 },
  { target: null, phase: "done", hold: 3600 },                           // recorded, stock updated
];
const posFrames: PosFrame[] = (() => {
  const frames: PosFrame[] = [];
  let qty = [0, 0, 0, 0, 0, 0], order: number[] = [], press = 0, phase: PosFrame["phase"] = "shopping";
  for (const step of posScript) {
    if (step.add !== undefined) { qty = qty.map((value, i) => i === step.add ? value + 1 : value); if (!order.includes(step.add)) order = [...order, step.add]; press += 1; }
    if (step.target === "complete" && step.phase) press += 1;
    if (step.phase) phase = step.phase;
    frames.push({ hold: step.hold, qty, order, target: step.target ?? null, press, phase });
  }
  return frames;
})();
const posRest: PosFrame = { ...posFrames[posFrames.length - 2], hold: 0, target: null, press: 0, phase: "shopping" };

function PointOfSale({ frame, register, motion }: { frame: PosFrame; register: (id: string) => (node: HTMLElement | null) => void; motion: boolean }) {
  const { qty, order, phase } = frame;
  const total = qty.reduce((sum, count, i) => sum + count * medicines[i].cents, 0);
  const shownTotal = useCountUp(total, motion);
  const units = qty.reduce((sum, count) => sum + count, 0);
  const items = order.length;
  const sold = phase === "done";
  return <div className="app-pos-layout">
    <div className="app-catalog">
      <h5>Products <span>Sample catalogue</span></h5>
      <div className="app-category-list"><span className="is-selected">All</span><span>Pain relief</span><span>Vitamins</span><span>Other</span></div>
      <div className="app-products">{medicines.map((medicine, index) => {
        const stock = medicine.stock - (sold ? qty[index] : 0);
        const hot = motion && isPressFrame(frame, index);
        return <div className="app-product-row" key={medicine.name} data-hot={hot || undefined}>
          <span className="app-medicine-mark"><Pill size={19} strokeWidth={1.4} /></span>
          <div className="app-product-name"><strong>{medicine.name}</strong><span>{medicine.dose}</span></div>
          <span className="app-stock">In stock: <span className={sold && qty[index] > 0 ? "app-stock-num is-changed" : "app-stock-num"} key={stock}>{stock}</span></span>
          <b className="app-price">₱ {medicine.price}</b>
          <span className="app-add" ref={register(`add-${index}`)} data-hot={hot || undefined}><span className="app-add-label">Add</span><span className="app-add-label is-done"><Check size={11} strokeWidth={2.4} /> Added</span></span>
        </div>;
      })}</div>
    </div>
    <div className="app-order">
      <h5>Current order <span className="app-cart-icon"><ShoppingCart size={15} />{units > 0 && <b key={units}>{units}</b>}</span></h5>
      <div className="app-order-lines">
        {order.length === 0 && <p className="app-empty">Tap Add to start an order</p>}
        {order.map(index => {
          const medicine = medicines[index];
          return <div key={medicine.name} className="app-order-line"><span>{medicine.line}<small>{qty[index]} × ₱{medicine.price}</small></span><b key={qty[index]} className="app-tick">{money(qty[index] * medicine.cents)}</b></div>;
        })}
      </div>
      <div className="app-order-total"><span>Total <small>{items} {items === 1 ? "item" : "items"} · {units} {units === 1 ? "unit" : "units"}</small></span><strong data-counting={motion && shownTotal !== total || undefined}>{money(shownTotal)}</strong></div>
      <span className="app-complete" ref={register("complete")} data-phase={phase} data-empty={items === 0 || undefined}>
        <span className="app-complete-label">Complete transaction <ArrowUpRight size={16} /></span>
        <span className="app-complete-label is-recording"><i className="app-spinner" /> Recording sale…</span>
        <span className="app-complete-label is-done"><Check size={15} strokeWidth={2.4} /> Sale #0048 recorded</span>
      </span>
      <p className="app-preview-only">Interface preview only</p>
    </div>
  </div>;
}

// A row is "hot" only on the frame where its Add button is actually pressed.
function isPressFrame(frame: PosFrame, index: number) {
  const at = posFrames.indexOf(frame);
  return at > 0 && frame.qty[index] > posFrames[at - 1].qty[index];
}

/* ------------------------------------------------------------------------------------------ */
/* Inventory: the same sale arrives and the stock levels move.                                 */
/* ------------------------------------------------------------------------------------------ */
const sale = { 0: 2, 1: 1, 4: 1 } as Record<number, number>;
type InvFrame = Frame & { applied: number; banner: boolean };
const invRest: InvFrame = { hold: 0, applied: 4, banner: false };
const invFrames: InvFrame[] = [
  { hold: 1100, applied: 0, banner: false },
  { hold: 900, applied: 1, banner: true },
  { hold: 900, applied: 2, banner: true },
  { hold: 1300, applied: 3, banner: true },
  { hold: 3400, applied: 4, banner: true },
];
const saleRows = [0, 1, 4];

function Inventory({ frame, motion }: { frame: InvFrame; motion: boolean }) {
  const settled = !motion ? 4 : frame.applied;
  const applied = (index: number) => { const at = saleRows.indexOf(index); return at !== -1 && at < Math.min(settled, 3); };
  const finished = settled >= 4;
  return <div className="app-ledger">
    <div className="app-ledger-title"><div><span>Stock management</span><h5>Inventory</h5></div><span className="app-outline-action"><Plus size={14} /> Product</span></div>
    <div className="app-ledger-tools"><span className="app-filter"><SlidersHorizontal size={14} /> All products</span><span className="app-ledger-status">{motion && frame.banner ? <span className="app-sale-chip" key="chip"><i /> Sale #0048 · 4 units</span> : <span>Sample stock records</span>}</span></div>
    <div className="app-table-wrap"><table className="app-table"><thead><tr><th>Product</th><th>Category</th><th>In stock</th><th>Status</th></tr></thead><tbody>{medicines.map((medicine, index) => {
      const low = index === 5;
      const sold = sale[index] ?? 0;
      const value = low ? 8 : motion && !applied(index) && sold ? medicine.stock + sold : medicine.stock;
      const justApplied = motion && applied(index) && saleRows.indexOf(index) === Math.min(settled, 3) - 1 && settled <= 3;
      return <tr key={medicine.name} data-flash={justApplied || undefined} data-low={low || undefined}>
        <td><strong>{medicine.name}</strong><small>{medicine.dose}</small></td><td>{medicine.category}</td>
        <td><span className="app-stock-cell"><span className={justApplied ? "app-stock-num is-changed" : "app-stock-num"} key={value}>{value}</span> <small>units</small>{justApplied && <em className="app-delta" key={`d${settled}`}>−{sold}</em>}</span></td>
        <td><span className={low ? "app-state is-low" : "app-state"}>{low ? "Low stock" : "In stock"}</span></td></tr>;
    })}</tbody></table></div>
    <div className="app-ledger-note" data-lit={motion && finished || undefined}><Check size={15} /><span>Stock levels update with each recorded sale.</span></div>
  </div>;
}

/* ------------------------------------------------------------------------------------------ */
/* Transaction history: the sale lands in the record; a refund row gets picked out.             */
/* ------------------------------------------------------------------------------------------ */
type HisFrame = Frame & { settled: boolean; target: string | null; selected: number | null; press: number };
const hisRest: HisFrame = { hold: 0, settled: true, target: null, selected: null, press: 0 };
const hisFrames: HisFrame[] = [
  { hold: 1200, settled: false, target: null, selected: null, press: 0 },
  { hold: 1400, settled: true, target: null, selected: null, press: 0 },
  { hold: 900, settled: true, target: "row-2", selected: null, press: 0 },
  { hold: 3400, settled: true, target: "row-2", selected: 2, press: 1 },
];
const transactions = [
  ["#0048", "10:42 AM", "Sale", "₱ 18.00"], ["#0047", "10:31 AM", "Sale", "₱ 87.50"], ["#0046", "10:18 AM", "Refund", "−₱ 16.00"], ["#0045", "09:56 AM", "Sale", "₱ 35.00"], ["#0044", "09:35 AM", "Sale", "₱ 62.00"],
];

function TransactionHistory({ frame, register, motion }: { frame: HisFrame; register: (id: string) => (node: HTMLElement | null) => void; motion: boolean }) {
  const pending = motion && !frame.settled;
  return <div className="app-ledger">
    <div className="app-ledger-title"><div><span>Sales & returns</span><h5>Transaction history</h5></div><span className="app-outline-action"><History size={14} /> Records</span></div>
    <div className="app-ledger-tools"><span className="app-filter"><SlidersHorizontal size={14} /> All transactions</span><span>Sample transactions</span></div>
    <div className="app-table-wrap"><table className="app-table app-history-table"><thead><tr><th>Transaction</th><th>Time</th><th>Type</th><th>Amount</th></tr></thead><tbody>{transactions.map(([id, time, type, amount], index) => {
      const isNew = index === 0;
      const waiting = isNew && pending;
      const label = waiting ? "Saving" : type;
      return <tr key={id} ref={register(`row-${index}`)} data-pending={waiting || undefined} data-new={(isNew && motion && frame.settled && frame.target === null) || undefined} data-selected={(motion && frame.selected === index) || undefined}>
        <td><span className="app-transaction-id">{type === "Refund" ? <ArrowDownLeft size={15} /> : <ArrowUpRight size={15} />}<strong>{id}</strong></span></td><td>{time}</td>
        <td><span className={type === "Refund" ? "app-state is-refund" : waiting ? "app-state is-pending" : "app-state"} key={label}>{label}</span></td><td>{amount}</td></tr>;
    })}</tbody></table></div>
    <div className="app-ledger-note"><ShieldCheck size={16} /><span>Sales, returns and refunds in one transaction record.</span></div>
  </div>;
}

/** An illustration built with HTML. It replays a short, scripted sale; the labels never perform real transactions. */
export function PharmacyPreview({ chapter, active = false, still = false, hold = false }: { chapter: Chapter; active?: boolean; still?: boolean; hold?: boolean }) {
  const title = projectChapters.find(item => item.id === chapter)!.title;
  const innerRef = useRef<HTMLDivElement>(null);
  const motion = active && !still;
  const paused = hold;

  const pos = useDemo(posFrames, posRest, motion && chapter === "pos", paused);
  const inv = useDemo(invFrames, invRest, motion && chapter === "inventory", paused);
  const his = useDemo(hisFrames, hisRest, motion && chapter === "history", paused);
  const run = chapter === "pos" ? pos : chapter === "inventory" ? inv : his;

  const target = chapter === "pos" ? pos.frame.target : chapter === "history" ? his.frame.target : null;
  const pressing = chapter === "pos" ? pos.frame.press : his.frame.press;
  const { register, cursor } = useCursor(innerRef, motion ? target : null, run.index + run.cycle * 100);

  return <div className="work-app-preview" role="img" aria-label={`Illustrative Pharxmaco ${title.toLowerCase()} interface using sample data, not an actual application screenshot.`}>
    <div className="app-preview-inner" aria-hidden="true" ref={innerRef} data-live={motion || undefined}>
      <aside className="app-sidebar">
        <div className="app-brand"><Plus size={29} strokeWidth={4} /><div><strong>Pharxmaco</strong><span>Point of sale & inventory</span></div></div>
        <div className="app-sidebar-nav">{navigation.map(({ id, label, Icon }) => <span key={id} className={chapter === id ? "is-selected" : undefined}><Icon size={17} strokeWidth={1.6} /><span>{label}</span></span>)}<span><Package size={17} strokeWidth={1.6} /><span>Products</span></span></div>
        <div className="app-staff"><span>C</span><div><strong>Cashier</strong><small>Staff workspace</small></div><ChevronDown size={13} /></div>
      </aside>
      <div className="app-workspace">
        <div className="app-toolbar"><div className="app-search"><Search size={15} /><span>{chapter === "history" ? "Search transactions" : "Search medicine, brand or barcode"}</span></div><span className="app-sample-label">Sample data</span></div>
        <div className="app-screen" key={run.cycle}>{chapter === "pos" ? <PointOfSale frame={pos.frame} register={register} motion={motion} /> : chapter === "inventory" ? <Inventory frame={inv.frame} motion={motion} /> : <TransactionHistory frame={his.frame} register={register} motion={motion} />}</div>
      </div>
      {chapter !== "inventory" && <Cursor cursor={motion ? cursor : { ...cursor, visible: false }} pressing={motion ? pressing : 0} />}
    </div>
  </div>;
}
