import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";
import { getCameraPosition, getHorizonSection, getHorizonQuality, horizonSections } from "../components/ui/horizon-model.ts";

test("the portfolio journey has three reachable scenes and no counter overflow", () => {
  assert.deepEqual(horizonSections.map(section => section.title), ["SEAN", "CODE", "WORK"]);
  assert.equal(getHorizonSection(0), 0);
  assert.equal(getHorizonSection(0.5), 1);
  assert.equal(getHorizonSection(1), 2);
  assert.equal(getHorizonSection(5), 2);
  assert.equal(getHorizonSection(-1), 0);
});

test("camera interpolation stays continuous through all portfolio scenes", () => {
  assert.deepEqual(getCameraPosition(0), { x: 0, y: 30, z: 300 });
  assert.deepEqual(getCameraPosition(0.5), { x: 0, y: 40, z: -50 });
  assert.deepEqual(getCameraPosition(1), { x: 0, y: 50, z: -700 });
  assert.ok(Math.abs(getCameraPosition(0.49999).z - getCameraPosition(0.50001).z) < 0.1);
  assert.deepEqual(getCameraPosition(Infinity), getCameraPosition(0));
  assert.deepEqual(getCameraPosition(2), getCameraPosition(1));
});

test("render quality caps pixels and stars, with no mobile bloom", () => {
  const phone = getHorizonQuality(390, 844, 3, true, 8);
  assert.equal(phone.starCount * phone.starLayers, 1000);
  assert.equal(phone.pixelRatio, 1);
  assert.equal(phone.bloom, false);
  const desktop = getHorizonQuality(3840, 2160, 2, false, 8);
  assert.ok(3840 * desktop.pixelRatio <= 1600);
  assert.ok(2160 * desktop.pixelRatio <= 1000);
  assert.equal(desktop.starCount * desktop.starLayers, 3000);
  assert.equal(getHorizonQuality(1440, 900, 1, false, 4).bloom, false);
});

test("shadcn aliases, shared styles, and TypeScript agree with the installed component", async () => {
  const config = JSON.parse(await readFile(new URL("../components.json", import.meta.url), "utf8"));
  assert.equal(config.aliases.ui, "@/components/ui");
  assert.equal(config.tailwind.css, "app/globals.css");
  assert.equal(config.tailwind.config, "");
  assert.equal(config.tsx, true);
  const css = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");
  assert.match(css, /tailwindcss\/utilities.css/);
  assert.match(css, /shadcn-theme.css/);
});
