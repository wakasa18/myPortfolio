import assert from "node:assert/strict";
import { access } from "node:fs/promises";
import test from "node:test";

async function render(path = "/") {
  const { default: worker } = await import("../dist/server/index.js");
  return worker.fetch(
    new Request(`https://portfolio.example${path}`, { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("production worker renders Sean's portfolio, navigation, and contact links", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html/);
  const html = await response.text();
  assert.match(html, /<title>Sean Villanueva — Web Developer<\/title>/);
  for (const anchor of ["work", "about", "contact"]) {
    assert.match(html, new RegExp(`id="${anchor}"`));
    assert.match(html, new RegExp(`href="#${anchor}"`));
  }
  assert.match(html, /href="mailto:villanuevasean0918@gmail.com"/);
  assert.match(html, /aria-label="Copy email address"/);
  assert.match(html, /aria-label="Pause animation"/);
  assert.match(html, /aria-label="HORIZON"/);
  assert.match(html, /aria-label="COSMOS"/);
  assert.match(html, /aria-label="INFINITY"/);
  assert.equal((html.match(/<h1\b/g) || []).length, 1);
  assert.match(html, /aria-label="Journey scroll progress"/);
  assert.match(html, /SEAN VILLANUEVA \/ WEB DEVELOPER/);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton|Your site is taking shape/);
});

test("concepts are clearly labeled and have accessible project controls", async () => {
  const html = await (await render()).text();
  for (const name of ["Relay", "Forma", "Orbit", "Grove"]) {
    assert.match(html, new RegExp(`aria-label="View ${name} concept project"`));
  }
  assert.match(html, /Sample interface concepts for this portfolio/);
  assert.match(html, /aria-label="Filter projects"/);
  assert.match(html, /aria-pressed="true">All projects/);
  assert.match(html, /aria-controls="main-navigation"/);
});

test("unknown routes return 404 and the production icon exists", async () => {
  assert.equal((await render("/not-a-page")).status, 404);
  await access(new URL("../dist/client/icon.png", import.meta.url));
});

test("standalone Horizon demo renders with a working end-of-journey anchor", async () => {
  const response = await render("/horizon-demo");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /<title>Horizon — Component Demo<\/title>/);
  assert.match(html, /href="#horizon-demo-end"/);
  assert.match(html, /id="horizon-demo-end"/);
});
