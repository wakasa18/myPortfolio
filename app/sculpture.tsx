"use client";

import { useEffect, useRef } from "react";
import { createFrameLoop } from "./lib/frame-loop";
import { createSculptureRenderer } from "./lib/sculpture-renderer";

export default function Sculpture({ paused }: { paused: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const controls = useRef<{ setPaused(value: boolean): void } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const stage = stageRef.current;
    if (!canvas || !stage) return;
    let renderer = createSculptureRenderer(canvas);
    stage.dataset.renderer = renderer ? "webgl" : "fallback";
    let visible = false;
    let stopped = false;
    let contextLost = false;
    let time = 0;
    let width = 1, height = 1;
    let pointerX = 0, pointerY = 0, currentX = 0, currentY = 0;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");

    const loop = createFrameLoop(delta => {
      if (!renderer || contextLost) return;
      time += delta * 0.00013;
      const smoothing = 1 - Math.exp(-delta / 160);
      currentX += (pointerX - currentX) * smoothing;
      currentY += (pointerY - currentY) * smoothing;
      renderer.render(0.66 + Math.sin(time * 0.7) * 0.18 + currentY * 0.6, time + currentX * 0.75, -0.35);
    });

    function sync() {
      const canDraw = Boolean(renderer) && visible && !document.hidden && !contextLost;
      loop.setRunning(canDraw && !stopped && !preference.matches);
      if (canDraw) loop.requestDraw();
    }
    function resize() {
      // ResizeObserver runs on layout changes, never in the animation loop.
      width = Math.max(canvas!.clientWidth, 1);
      height = Math.max(canvas!.clientHeight, 1);
      renderer?.resize(width, height, window.devicePixelRatio || 1);
      sync();
    }
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    const visibilityObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      sync();
    });
    visibilityObserver.observe(stage);

    function move(event: PointerEvent) {
      if (stopped || preference.matches || event.pointerType === "touch") return;
      // offset coordinates avoid forcing layout during pointer movement.
      pointerX = event.offsetX / width - 0.5;
      pointerY = event.offsetY / height - 0.5;
    }
    function leave() { pointerX = 0; pointerY = 0; }
    function loseContext(event: Event) {
      event.preventDefault();
      contextLost = true;
      stage!.dataset.renderer = "fallback";
      loop.setRunning(false);
    }
    function restoreContext() {
      renderer?.destroy();
      renderer = createSculptureRenderer(canvas!);
      contextLost = false;
      stage!.dataset.renderer = renderer ? "webgl" : "fallback";
      resize();
    }
    canvas.addEventListener("pointermove", move, { passive: true });
    canvas.addEventListener("pointerleave", leave);
    canvas.addEventListener("webglcontextlost", loseContext);
    canvas.addEventListener("webglcontextrestored", restoreContext);
    document.addEventListener("visibilitychange", sync);
    preference.addEventListener("change", sync);
    controls.current = { setPaused(value) { stopped = value; sync(); } };
    resize();

    return () => {
      controls.current = null;
      loop.dispose();
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
      canvas.removeEventListener("pointermove", move);
      canvas.removeEventListener("pointerleave", leave);
      canvas.removeEventListener("webglcontextlost", loseContext);
      canvas.removeEventListener("webglcontextrestored", restoreContext);
      document.removeEventListener("visibilitychange", sync);
      preference.removeEventListener("change", sync);
      renderer?.destroy();
    };
  }, []);

  useEffect(() => { controls.current?.setPaused(paused); }, [paused]);

  return <div ref={stageRef} className="sculpture-stage" data-renderer="fallback" role="img" aria-label="A sculptural knot in brushed blue metal">
    <canvas className="sculpture" ref={canvasRef} aria-hidden="true" />
    <div className="sculpture-fallback" aria-hidden="true"><i /><i /><i /></div>
  </div>;
}
