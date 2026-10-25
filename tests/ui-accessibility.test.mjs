import assert from "node:assert/strict";
import test from "node:test";
import { dismissWhenOutside, openProjectDialog, revealFooterForKeyboard } from "../app/lib/ui-accessibility.ts";

test("pointer focus cannot jump the footer before a click completes", () => {
  let reads = 0, scrolls = 0;
  const root = {
    getBoundingClientRect() { reads++; return { top: 300 }; },
    scrollIntoView(options) { scrolls++; assert.equal(options.behavior, "instant"); },
  };
  revealFooterForKeyboard(root, { matches: () => false }, true);
  assert.equal(reads, 0);
  assert.equal(scrolls, 0);
  revealFooterForKeyboard(root, { matches: () => true }, true);
  assert.equal(scrolls, 1, "keyboard navigation reveals clipped controls");
  revealFooterForKeyboard(root, { matches: () => true }, false);
  assert.equal(scrolls, 1, "normal-flow mobile/reduced-motion layouts do not jump");
});

function withDocument(run) {
  class Element extends EventTarget {
    isConnected = true;
    focus(options) { this.focusOptions = options; this.focused = true; }
  }
  const doc = new EventTarget();
  const replacements = { document: doc, HTMLElement: Element, Node: Element };
  const originals = Object.fromEntries(Object.keys(replacements).map(key => [key, Object.getOwnPropertyDescriptor(globalThis, key)]));
  for (const [key, value] of Object.entries(replacements)) Object.defineProperty(globalThis, key, { value, configurable: true });
  try { run(doc, Element); }
  finally {
    for (const key of Object.keys(replacements)) {
      if (originals[key]) Object.defineProperty(globalThis, key, originals[key]);
      else delete globalThis[key];
    }
  }
}

test("dialog cleanup restores the opener even after React removes the dialog", () => withDocument((doc, Element) => {
  const opener = new Element();
  doc.activeElement = opener;
  doc.body = { style: { overflow: "auto" } };
  const dialog = { connected: true, showModal() { this.open = true; }, close() { this.open = false; } };
  const cleanup = openProjectDialog(dialog);
  assert.equal(dialog.open, true);
  assert.equal(doc.body.style.overflow, "hidden");
  dialog.connected = false;
  cleanup();
  assert.equal(doc.body.style.overflow, "auto");
  assert.equal(opener.focused, true);
  assert.deepEqual(opener.focusOptions, { preventScroll: true });
}));

test("dialog cleanup does not focus a project removed from the document", () => withDocument((doc, Element) => {
  const opener = new Element();
  doc.activeElement = opener;
  doc.body = { style: { overflow: "" } };
  const cleanup = openProjectDialog({ showModal() {}, close() {} });
  opener.isConnected = false;
  cleanup();
  assert.equal(opener.focused, undefined);
  assert.equal(doc.body.style.overflow, "");
}));

test("menus dismiss on outside pointer/focus and release their document listeners", () => withDocument((doc, Element) => {
  const inside = new Element(), outside = new Element();
  let dismissals = 0;
  const cleanup = dismissWhenOutside({ contains: target => target === inside }, () => dismissals++);
  const emit = (type, target) => {
    const event = new Event(type);
    Object.defineProperty(event, "target", { value: target });
    doc.dispatchEvent(event);
  };
  emit("pointerdown", inside);
  assert.equal(dismissals, 0);
  emit("pointerdown", outside);
  emit("focusin", outside);
  assert.equal(dismissals, 2);
  cleanup();
  emit("pointerdown", outside);
  emit("focusin", outside);
  assert.equal(dismissals, 2);
}));
