"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { startScrollFill } from "@/app/lib/scroll-fill";

/** Paragraph whose words light up as it scrolls into view. Fully lit when `active` is false. */
export function ScrollFillText({ text, active = true, className, revealDetail }: { text: string; active?: boolean; className?: string; revealDetail?: boolean }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const words = text.split(" ");

  useEffect(() => {
    if (!ref.current || !active) return;
    return startScrollFill(ref.current);
  }, [active]);

  return <p ref={ref} className={className ? `scroll-fill ${className}` : "scroll-fill"} data-reveal-detail={revealDetail ? "" : undefined} style={{ "--words": words.length } as CSSProperties}>
    {words.map((word, index) => <span key={index} className="scroll-fill-word" style={{ "--i": index } as CSSProperties}>{word}{index < words.length - 1 ? " " : ""}</span>)}
  </p>;
}
