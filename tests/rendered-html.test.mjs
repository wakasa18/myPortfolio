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
  assert.match(html, /aria-label="SEAN"/);
  assert.match(html, /aria-label="CODE"/);
  assert.match(html, /aria-label="WORK"/);
  assert.equal((html.match(/<h1\b/g) || []).length, 1);
  assert.match(html, /aria-label="Journey scroll progress"/);
  assert.match(html, /SEAN VILLANUEVA \/ WEB DEVELOPER/);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton|Your site is taking shape/);
});

test("only the real pharmacy project is shown with its live link and confirmed profile", async () => {
  const html = await (await render()).text();
  assert.doesNotMatch(html, /Relay|Forma|Orbit|Grove|Interface explorations|SAMPLE CONCEPT|Filter projects|sean\.php/);
  assert.match(html, /id="pharmacy-title"/);
  assert.equal((html.match(/<article\b/g) || []).length, 1);
  assert.match(html, /href="https:\/\/silver-fly-191014\.hostingersite\.com\/" target="_blank" rel="noopener noreferrer"/);
  assert.match(html, /The live system opens to the staff sign-in page/);
  assert.match(html, /BSIS 4-1/);
  assert.match(html, /tel:\+639472401814/);
  assert.match(html, /aria-controls="main-navigation"/);
  for (const file of ["Sean_Villanueva_Resume.docx", "Sean_Villanueva_Portfolio.docx"]) {
    assert.ok(html.includes(`/downloads/${file}`));
    await access(new URL(`../dist/client/downloads/${file}`, import.meta.url));
  }
});

test("primary email actions open Gmail compose with the correct recipient and retain an email-app alternative", async () => {
  const html = await (await render()).text();
  for (const className of ["header-contact", "footer-primary", "footer-email-link"]) {
    const anchor = html.match(new RegExp(`<a\\b(?=[^>]*class="[^"]*\\b${className}\\b)[^>]*>`))?.[0];
    assert.ok(anchor, `${className} link is rendered`);
    const href = anchor.match(/href="([^"]+)"/)?.[1].replaceAll("&amp;", "&");
    const url = new URL(href);
    assert.equal(url.origin, "https://mail.google.com");
    assert.equal(url.pathname, "/mail/");
    assert.equal(url.searchParams.get("view"), "cm");
    assert.equal(url.searchParams.get("to"), "villanuevasean0918@gmail.com");
    assert.match(anchor, /target="_blank"/);
    assert.match(anchor, /rel="noopener noreferrer"/);
  }
  assert.match(html, /href="mailto:villanuevasean0918@gmail.com"/);
  assert.match(html, /Use email app/);
});

test("project walkthrough retains the visible cashier login and labels every preview as illustrative", async () => {
  const html = await (await render()).text();
  assert.match(html, /aria-label="Pharxmaco project walkthrough"/);
  for (const chapter of ["pos", "inventory", "history"]) {
    assert.match(html, new RegExp(`aria-controls="work-preview-${chapter}"`));
    assert.match(html, new RegExp(`id="work-preview-${chapter}"`));
  }
  const login = html.match(/<div class="work-cashier-login">([\s\S]*?)<\/dl><\/div>/)?.[1];
  assert.ok(login, "cashier details render directly in the project summary");
  assert.match(login, /Cashier login/);
  assert.match(login, /<dt>Username<\/dt><dd><code>cashier<\/code>/);
  assert.match(login, /<dt>Password<\/dt><dd><code>cashier123<\/code>/);
  assert.doesNotMatch(login, /hidden|<details/);
  assert.equal((html.match(/Illustrative preview · Sample data/g) || []).length, 3);
  assert.doesNotMatch(html, /Pharmacy system map/);
});

test("unknown routes return 404 and the production icon exists", async () => {
  assert.equal((await render("/not-a-page")).status, 404);
  await access(new URL("../dist/client/icon.png", import.meta.url));
});

test("removed demo routes no longer expose example pages", async () => {
  assert.equal((await render("/horizon-demo")).status, 404);
  assert.equal((await render("/footer-demo")).status, 404);
});

test("cinematic footer replaces the contact section with working portfolio actions", async () => {
  const html = await (await render()).text();
  assert.equal((html.match(/id="contact"/g) || []).length, 1);
  assert.equal((html.match(/<footer\b/g) || []).length, 1);
  assert.match(html, /class="cinematic-footer"/);
  assert.match(html, /aria-label="Footer navigation"/);
  assert.match(html, /aria-label="Pause site motion"/);
  assert.match(html, /aria-label="Back to top"/);
  assert.doesNotMatch(html, /SOBERS|Volvox|Download iOS|Download Android|href="#"/);
});
