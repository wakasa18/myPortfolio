"use client";

import { useEffect, type RefObject } from "react";
import { startScrollHeader, startScrollReveals } from "./lib/scroll-motion";

export default function useScrollMotion(root: RefObject<HTMLElement | null>, header: RefObject<HTMLElement | null>, paused: boolean, menuOpen: boolean, layoutKey: string) {
  useEffect(() => {
    if (!root.current || paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    return startScrollReveals(root.current);
  }, [root, paused, layoutKey]);

  useEffect(() => {
    if (!header.current) return;
    return startScrollHeader(header.current, paused || menuOpen || window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, [header, paused, menuOpen]);
}
