"use client";

import { useEffect, type RefObject } from "react";
import { startParallax } from "./lib/parallax";

export default function useParallax(root: RefObject<HTMLElement | null>, paused: boolean, layoutKey: string) {
  useEffect(() => {
    const container = root.current;
    if (!container || paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    return startParallax(container);
  }, [root, paused, layoutKey]);
}
