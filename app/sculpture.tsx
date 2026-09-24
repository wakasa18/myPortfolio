"use client";

import { useEffect, useRef } from "react";

type Vec = [number, number, number];
const normalize = (v: Vec): Vec => { const length = Math.hypot(...v) || 1; return v.map(n => n / length) as Vec; };
const cross = (a: Vec, b: Vec): Vec => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const center = (t: number): Vec => [(2 + 0.66 * Math.cos(3 * t)) * Math.cos(2 * t), (2 + 0.66 * Math.cos(3 * t)) * Math.sin(2 * t), 0.8 * Math.sin(3 * t)];

export default function Sculpture({ paused }: { paused: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const pausedRef = useRef(paused);
  useEffect(() => { pausedRef.current = paused; }, [paused]);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d", { alpha: true });
    if (!canvas || !ctx) return;
    const rings = 180, sides = 18;
    const vertices: { p: Vec; n: Vec }[] = [];
    for (let i = 0; i < rings; i++) {
      const t = i / rings * Math.PI * 2, c = center(t), next = center(t + 0.001);
      const tangent = normalize(next.map((v, j) => v - c[j]) as Vec);
      const binormal = normalize(cross(tangent, normalize([c[0], c[1], 0])));
      const normal = normalize(cross(binormal, tangent));
      for (let j = 0; j < sides; j++) {
        const a = j / sides * Math.PI * 2;
        const n = normal.map((v, k) => v * Math.cos(a) + binormal[k] * Math.sin(a)) as Vec;
        vertices.push({ p: c.map((v, k) => v + n[k] * 0.43) as Vec, n });
      }
    }
    let size = 1, width = 1, height = 1, frame = 0, lastTime = 0, time = 0;
    let visible = true, dirty = true;
    const pointer = { x: 0, y: 0 }, current = { x: 0, y: 0 };
    const resize = () => { const rect = canvas.getBoundingClientRect(); width = rect.width; height = rect.height; size = Math.min(width, height); const dpr = Math.min(window.devicePixelRatio || 1, 2); canvas.width = width * dpr; canvas.height = height * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); dirty = true; };
    const resizeObserver = new ResizeObserver(resize); resizeObserver.observe(canvas); resize();
    const visibilityObserver = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; }); visibilityObserver.observe(canvas);
    const move = (event: PointerEvent) => { const rect = canvas.getBoundingClientRect(); pointer.x = (event.clientX - rect.left) / rect.width - 0.5; pointer.y = (event.clientY - rect.top) / rect.height - 0.5; };
    const leave = () => { pointer.x = 0; pointer.y = 0; };
    canvas.addEventListener("pointermove", move); canvas.addEventListener("pointerleave", leave);

    function render(now: number) {
      frame = requestAnimationFrame(render);
      if (now - lastTime < 40) return;
      const delta = Math.min(now - lastTime, 70); lastTime = now;
      if (!visible || document.hidden || (pausedRef.current && !dirty)) return;
      dirty = false;
      if (!pausedRef.current) { time += delta * 0.00013; current.x += (pointer.x - current.x) * 0.055; current.y += (pointer.y - current.y) * 0.055; }
      const ax = 0.66 + Math.sin(time * 0.7) * 0.18 + current.y * 0.6;
      const ay = time + current.x * 0.75;
      const az = -0.35;
      const rotate = ([x, y, z]: Vec): Vec => {
        const y1 = y * Math.cos(ax) - z * Math.sin(ax), z1 = y * Math.sin(ax) + z * Math.cos(ax);
        const x2 = x * Math.cos(ay) + z1 * Math.sin(ay), z2 = -x * Math.sin(ay) + z1 * Math.cos(ay);
        return [x2 * Math.cos(az) - y1 * Math.sin(az), x2 * Math.sin(az) + y1 * Math.cos(az), z2];
      };
      const transformed = vertices.map(v => { const p = rotate(v.p); const scale = size * 0.158 * (8 / (8 - p[2])); return { x: width / 2 + p[0] * scale, y: height / 2 + p[1] * scale, z: p[2], n: rotate(v.n) }; });
      const faces: { ids: number[]; depth: number }[] = [];
      for (let i = 0; i < rings; i++) for (let j = 0; j < sides; j++) {
        const ids = [i * sides + j, ((i + 1) % rings) * sides + j, ((i + 1) % rings) * sides + (j + 1) % sides, i * sides + (j + 1) % sides];
        faces.push({ ids, depth: ids.reduce((sum, id) => sum + transformed[id].z, 0) / 4 });
      }
      faces.sort((a, b) => a.depth - b.depth);
      ctx!.clearRect(0, 0, width, height);
      for (const face of faces) {
        const points = face.ids.map(id => transformed[id]);
        const normal = normalize(points.reduce((acc, p) => acc.map((v, k) => v + p.n[k]) as Vec, [0, 0, 0] as Vec));
        const light = Math.max(0, normal[0] * -0.38 + normal[1] * -0.58 + normal[2] * 0.72);
        const specular = Math.pow(Math.max(0, normal[0] * -0.18 + normal[1] * -0.32 + normal[2] * 0.93), 28);
        const rim = Math.pow(1 - Math.abs(normal[2]), 3) * 30;
        const band = Math.pow(Math.max(0, Math.cos(normal[1] * 5 + normal[0] * 2)), 12) * light * 45;
        const r = Math.min(255, 43 + light * 105 + specular * 120 + rim + band);
        const g = Math.min(255, 57 + light * 108 + specular * 115 + rim + band);
        const b = Math.min(255, 96 + light * 116 + specular * 85 + rim + band);
        ctx!.beginPath(); ctx!.moveTo(points[0].x, points[0].y); points.slice(1).forEach(p => ctx!.lineTo(p.x, p.y)); ctx!.closePath();
        ctx!.fillStyle = `rgb(${r | 0},${g | 0},${b | 0})`; ctx!.strokeStyle = ctx!.fillStyle; ctx!.lineWidth = 0.6; ctx!.fill(); ctx!.stroke();
      }
    }
    frame = requestAnimationFrame(render);
    return () => { cancelAnimationFrame(frame); resizeObserver.disconnect(); visibilityObserver.disconnect(); canvas.removeEventListener("pointermove", move); canvas.removeEventListener("pointerleave", leave); };
  }, []);

  return <canvas className="sculpture" ref={ref} aria-label="A slowly rotating sculptural knot in brushed blue metal" role="img" />;
}
