import type { Metadata } from "next";
import { DemoOne } from "@/components/ui/demo";

export const metadata: Metadata = {
  title: "Horizon — Component Demo",
  description: "An immersive Three.js and GSAP hero with a journey through Horizon, Cosmos, and Infinity.",
};

export default function HorizonDemoPage() { return <DemoOne />; }
