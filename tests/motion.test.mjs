import assert from "node:assert/strict";
import test from "node:test";
import { createKnotMesh, createSculptureRenderer } from "../app/lib/sculpture-renderer.ts";
import { createFrameLoop } from "../app/lib/frame-loop.ts";
import { startParallax } from "../app/lib/parallax.ts";

function scheduler() {
  const callbacks = new Map();
  let id = 0;
  return {
    callbacks,
    request(callback) { callbacks.set(++id, callback); return id; },
    cancel(key) { callbacks.delete(key); },
    step(now) { const queued = [...callbacks.values()]; callbacks.clear(); queued.forEach(callback => callback(now)); },
  };
}

test("animation stops scheduling while paused/offscreen, resumes without a time jump, and cleans up", () => {
  const clock = scheduler();
  const deltas = [];
  const loop = createFrameLoop(delta => deltas.push(delta), clock.request, clock.cancel);
  loop.setRunning(true);
  loop.requestDraw();
  loop.requestDraw();
  assert.equal(clock.callbacks.size, 1, "updates must coalesce into one frame");
  clock.step(0);
  clock.step(16);
  clock.step(32);
  assert.deepEqual(deltas, [0, 16, 16], "60fps callbacks must not be throttled to 25fps");
  loop.setRunning(false);
  assert.equal(clock.callbacks.size, 0);
  clock.step(10000);
  assert.equal(deltas.length, 3);
  loop.requestDraw();
  clock.step(10016);
  assert.equal(deltas.at(-1), 0, "paused resize draws only a still frame");
  assert.equal(clock.callbacks.size, 0);
  loop.setRunning(true);
  clock.step(20000);
  assert.equal(deltas.at(-1), 0, "returning to the tab must not jump the rotation");
  clock.step(21000);
  assert.equal(deltas.at(-1), 50, "long frames must have bounded animation steps");
  loop.dispose();
  loop.setRunning(true);
  loop.requestDraw();
  assert.equal(clock.callbacks.size, 0);
});

test("knot mesh is closed, indexed, finite, and has unit normals", () => {
  const rings = 128, sides = 16;
  const { vertices, indices } = createKnotMesh(rings, sides);
  assert.equal(vertices.length, rings * sides * 6);
  assert.equal(indices.length, rings * sides * 6);
  assert.ok(vertices.every(Number.isFinite));
  assert.ok(indices.every(index => index < rings * sides));
  for (let i = 0; i < vertices.length; i += 6) {
    assert.ok(Math.abs(Math.hypot(...vertices.slice(i + 3, i + 6)) - 1) < 0.00001);
  }
  const edges = new Map();
  for (let i = 0; i < indices.length; i += 3) {
    const triangle = indices.slice(i, i + 3);
    for (let j = 0; j < 3; j++) {
      const a = triangle[j], b = triangle[(j + 1) % 3];
      const key = `${Math.min(a, b)}:${Math.max(a, b)}`;
      edges.set(key, (edges.get(key) || 0) + 1);
    }
  }
  assert.ok([...edges.values()].every(count => count === 2), "seams must join without gaps");
});

function fakeCanvas({ compile = true, available = true } = {}) {
  const calls = [];
  const gl = new Proxy({}, {
    get(_, name) {
      if (String(name).toUpperCase() === name) return name;
      if (name === "getShaderParameter" || name === "getProgramParameter") return () => compile;
      if (name.startsWith("create")) return () => ({});
      if (name === "getAttribLocation") return (_, attr) => attr === "aPosition" ? 0 : 1;
      if (name === "getUniformLocation") return (_, uniform) => uniform;
      return (...args) => calls.push({ name, args });
    },
  });
  return { calls, canvas: { width: 0, height: 0, getContext: () => available ? gl : null } };
}

test("GPU renderer uploads geometry once and submits only one draw call per frame", () => {
  const { canvas, calls } = fakeCanvas();
  const renderer = createSculptureRenderer(canvas);
  assert.ok(renderer);
  renderer.resize(600, 500, 3);
  assert.equal(canvas.width, 900, "high-DPI drawing is capped at 1.5x");
  assert.equal(canvas.height, 750);
  for (let i = 0; i < 120; i++) renderer.render(0.66, i / 100, -0.35);
  assert.equal(calls.filter(call => call.name === "bufferData").length, 2, "no geometry uploads in the render loop");
  assert.equal(calls.filter(call => call.name === "drawElements").length, 120);
  renderer.destroy();
  assert.equal(calls.filter(call => call.name === "deleteBuffer").length, 2);
  assert.equal(calls.filter(call => call.name === "deleteShader").length, 2);
  assert.equal(calls.filter(call => call.name === "deleteProgram").length, 1);
});

test("unsupported WebGL or failed shader compilation selects the static fallback", () => {
  assert.equal(createSculptureRenderer(fakeCanvas({ available: false }).canvas), null);
  const failed = fakeCanvas({ compile: false });
  assert.equal(createSculptureRenderer(failed.canvas), null);
  assert.equal(failed.calls.filter(call => call.name === "deleteShader").length, 1);
  assert.equal(failed.calls.filter(call => call.name === "deleteProgram").length, 1);
});

test("parallax coalesces scroll events without layout reads and releases all work on pause", () => {
  const clock = scheduler();
  let reads = 0, coarse = false, disconnected = false;
  const fakeWindow = Object.assign(new EventTarget(), {
    innerHeight: 800, scrollY: 0, matchMedia: () => ({ get matches() { return coarse; } }),
  });
  const fakeDocument = Object.assign(new EventTarget(), { hidden: false });
  const layer = {
    dataset: { parallax: "0.1" }, style: {},
    parentElement: { getBoundingClientRect() { reads++; return { top: 300 - fakeWindow.scrollY, height: 200 }; } },
  };
  const replacements = {
    window: fakeWindow, document: fakeDocument,
    requestAnimationFrame: clock.request, cancelAnimationFrame: clock.cancel,
    ResizeObserver: class { observe() {} disconnect() { disconnected = true; } },
  };
  const originals = Object.fromEntries(Object.keys(replacements).map(key => [key, Object.getOwnPropertyDescriptor(globalThis, key)]));
  for (const [key, value] of Object.entries(replacements)) Object.defineProperty(globalThis, key, { value, configurable: true });
  try {
    const dispose = startParallax({ querySelectorAll: () => [layer] });
    clock.step(0);
    assert.equal(layer.style.translate, "0 0.00px");
    assert.equal(clock.callbacks.size, 0, "no idle parallax loop");
    const initialReads = reads;
    fakeWindow.scrollY = 200;
    for (let i = 0; i < 20; i++) fakeWindow.dispatchEvent(new Event("scroll"));
    assert.equal(clock.callbacks.size, 1);
    clock.step(16);
    assert.equal(layer.style.translate, "0 20.00px");
    assert.equal(reads, initialReads, "scrolling must only use cached geometry");
    fakeWindow.scrollY = 500;
    fakeWindow.dispatchEvent(new Event("scroll"));
    clock.step(32);
    assert.equal(layer.style.translate, "0 30.00px", "offset must remain within the preview's overscan");
    coarse = true;
    fakeWindow.scrollY = 200;
    fakeWindow.dispatchEvent(new Event("scroll"));
    clock.step(48);
    assert.equal(layer.style.translate, "0 10.00px", "touch devices use gentler motion");
    fakeWindow.dispatchEvent(new Event("scroll"));
    fakeDocument.hidden = true;
    fakeDocument.dispatchEvent(new Event("visibilitychange"));
    assert.equal(clock.callbacks.size, 0);
    fakeDocument.hidden = false;
    fakeDocument.dispatchEvent(new Event("visibilitychange"));
    assert.equal(clock.callbacks.size, 1);
    dispose();
    assert.equal(clock.callbacks.size, 0);
    assert.equal(layer.style.translate, "");
    assert.equal(layer.style.willChange, "");
    assert.equal(disconnected, true);
    fakeWindow.dispatchEvent(new Event("scroll"));
    assert.equal(clock.callbacks.size, 0, "cleanup must remove the scroll listener");
  } finally {
    for (const key of Object.keys(replacements)) {
      if (originals[key]) Object.defineProperty(globalThis, key, originals[key]);
      else delete globalThis[key];
    }
  }
});
