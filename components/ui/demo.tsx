"use client";

import { Component } from "@/components/ui/horizon-hero-section";
import Link from "next/link";

export function DemoOne() {
  return <><Component ctaHref="#horizon-demo-end" ctaLabel="Finish the journey" /><section id="horizon-demo-end" className="wrap section-space"><h2>Beyond the horizon.</h2><p><Link href="/">Back to Sean’s portfolio ↗</Link></p></section></>;
}
