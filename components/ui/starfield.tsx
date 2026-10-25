"use client";

import { useEffect, useRef } from "react";
import { createFrameLoop } from "@/app/lib/frame-loop";

interface Star { x: number; y: number; r: number; depth: number; phase: number; tone: string }

const TONES = ["#e4eaff", "#bec8ff", "#9fb0ff"];
const POOL = 130;

function createStars(): Star[] {
  return Array.from({ length: POOL }, () => {
    const depth = Math.random();
    return { x: Math.random(), y: Math.random(), r: 0.5 + depth * 1.1, depth, phase: Math.random() * Math.PI * 2, tone: TONES[Math.floor(Math.random() * TONES.length)] };
  });
}

/**
 * Quiet starfield behind the page content, so the night sky continues after the hero.
 * Deeper stars drift more as you scroll. Static when motion is paused or reduced.
 */
export function Starfield({ paused = false }: { paused?: boolean }) {
  const layerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stars = useRef<Star[]>([]);

  useEffect(() => {
    const layer = layerRef.current;
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!layer || !canvas || !context) return;
    const ctx = context;
    if (!stars.current.length) stars.current = createStars();
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const animate = !paused && !reduced.matches;
    let width = 0, height = 0, count = POOL, time = 0, visible = true;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      const scroll = animate ? window.scrollY : 0;
      for (let i = 0; i < count; i++) {
        const star = stars.current[i];
        const y = (((star.y * height - scroll * (0.02 + star.depth * 0.07)) % height) + height) % height;
        const x = star.x * width + (animate ? Math.sin(time * 0.05 + star.phase) * 3 * star.depth : 0);
        const twinkle = animate ? 0.55 + 0.45 * Math.sin(time * (0.6 + star.depth) + star.phase) : 0.8;
        ctx.globalAlpha = (0.18 + 0.5 * star.depth) * twinkle;
        ctx.fillStyle = star.tone;
        ctx.beginPath();
        ctx.arc(x, y, star.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };
    const resize = () => {
      const nextWidth = canvas.clientWidth, nextHeight = canvas.clientHeight;
      // Mobile browser bars change the height while scrolling; ignore small changes.
      if (nextWidth === width && Math.abs(nextHeight - height) < 120) return;
      const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
      width = nextWidth; height = nextHeight;
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      count = width < 700 ? 55 : width < 1200 ? 90 : POOL;
      draw();
    };

    const loop = createFrameLoop(delta => { time += delta / 1000; draw(); });
    const sync = () => loop.setRunning(animate && visible && !document.hidden);
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); if (visible) draw(); });
    observer.observe(layer);
    window.addEventListener("resize", resize, { passive: true });
    document.addEventListener("visibilitychange", sync);
    resize();
    sync();
    return () => {
      loop.dispose();
      observer.disconnect();
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", sync);
    };
  }, [paused]);

  return <div ref={layerRef} className="starfield-layer" aria-hidden="true"><canvas ref={canvasRef} /></div>;
}
