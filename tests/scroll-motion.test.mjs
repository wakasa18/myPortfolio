import assert from "node:assert/strict";
import test from "node:test";
import { startScrollHeader, startScrollReveals } from "../app/lib/scroll-motion.ts";

function environment(run) {
  const frames = new Map();
  let nextId = 0;
  const win = Object.assign(new EventTarget(), { scrollY: 0, innerHeight: 800 });
  const doc = Object.assign(new EventTarget(), { hidden: false, activeElement: null, documentElement: { scrollHeight: 3000 } });
  let intersections;
  let disconnected = 0;
  const replacements = {
    window: win, document: doc,
    requestAnimationFrame: callback => { frames.set(++nextId, callback); return nextId; },
    cancelAnimationFrame: id => frames.delete(id),
    ResizeObserver: class { observe() {} disconnect() { disconnected++; } },
    IntersectionObserver: class { constructor(callback) { intersections = callback; } observe() {} unobserve() {} disconnect() { disconnected++; } },
  };
  const originals = Object.fromEntries(Object.keys(replacements).map(key => [key, Object.getOwnPropertyDescriptor(globalThis, key)]));
  for (const [key, value] of Object.entries(replacements)) Object.defineProperty(globalThis, key, { value, configurable: true });
  const tick = () => { const callbacks = [...frames.values()]; frames.clear(); callbacks.forEach(fn => fn()); };
  try { run({ win, doc, frames, tick, intersect: entries => intersections(entries), disconnected: () => disconnected }); }
  finally {
    for (const key of Object.keys(replacements)) {
      if (originals[key]) Object.defineProperty(globalThis, key, originals[key]);
      else delete globalThis[key];
    }
  }
}

test("topbar responds to scroll direction, coalesces frames, and stays visible when motion/menu requires it", () => environment(({ win, doc, frames, tick, disconnected }) => {
  const header = { dataset: {}, querySelector: () => ({ style: { setProperty() {} } }) };
  let dispose = startScrollHeader(header, false);
  tick();
  assert.equal(header.dataset.hidden, "false");
  win.scrollY = 400;
  for (let i = 0; i < 20; i++) win.dispatchEvent(new Event("scroll"));
  assert.equal(frames.size, 1);
  tick();
  assert.equal(header.dataset.hidden, "true");
  assert.equal(header.dataset.scrolled, "true");
  assert.equal(frames.size, 0, "no idle frame loop");
  win.scrollY = 397; win.dispatchEvent(new Event("scroll")); tick();
  assert.equal(header.dataset.hidden, "true", "ignore tiny direction changes");
  win.scrollY = 375; win.dispatchEvent(new Event("scroll")); tick();
  assert.equal(header.dataset.hidden, "false");
  win.dispatchEvent(new Event("scroll"));
  doc.hidden = true; doc.dispatchEvent(new Event("visibilitychange"));
  assert.equal(frames.size, 0);
  dispose();
  assert.equal(disconnected(), 1);
  doc.hidden = false;
  win.dispatchEvent(new Event("scroll"));
  assert.equal(frames.size, 0, "dispose removes listeners");
  dispose = startScrollHeader(header, true);
  win.scrollY = 1000; win.dispatchEvent(new Event("scroll")); tick();
  assert.equal(header.dataset.hidden, "false", "pause/open menu disables hiding");
  dispose();
}));

test("scroll reveals cancel immediately for keyboard focus, hidden tabs, and pause cleanup", () => environment(({ doc, intersect, disconnected }) => {
  const animations = [];
  const element = {
    dataset: {}, classList: { contains: () => true }, contains: () => false, hasAttribute: () => false, querySelectorAll: () => [],
    animate() { const animation = { cancelled: false, cancel() { this.cancelled = true; } }; animations.push(animation); return animation; },
  };
  const root = Object.assign(new EventTarget(), { querySelectorAll: () => [element] });
  const dispose = startScrollReveals(root);
  intersect([{ target: element, isIntersecting: false }]);
  assert.equal(animations.length, 0);
  intersect([{ target: element, isIntersecting: true }]);
  assert.equal(element.dataset.revealed, "true");
  assert.equal(animations.length, 1);
  root.dispatchEvent(new Event("focusin"));
  assert.equal(animations[0].cancelled, true);
  intersect([{ target: element, isIntersecting: true }]);
  doc.hidden = true; doc.dispatchEvent(new Event("visibilitychange"));
  assert.equal(animations[1].cancelled, true);
  intersect([{ target: element, isIntersecting: true }]);
  assert.equal(animations.length, 2, "hidden tabs do not start entrances");
  doc.hidden = false;
  intersect([{ target: element, isIntersecting: true }]);
  dispose();
  assert.equal(animations[2].cancelled, true);
  assert.equal(disconnected(), 1);
}));
