# Sean Villanueva — Portfolio

A responsive, animated portfolio for Sean Villanueva, Web Developer.

## Run locally

Requires Node.js 22.13 or newer.

```sh
npm ci
npm run dev
```

Open the local URL printed by the server (normally http://localhost:3000).

## Build and check

```sh
npm run build
npm run typecheck
npm run lint
npm test
```

`npm test` builds the site and checks its production server response, navigation, contact details, concept labels, missing-page response, and icon. Browser interaction and visual checks are separate.

## Stack

React 19, strict TypeScript, Tailwind CSS 4, and scoped CSS. Vinext provides Next.js-compatible routing on Vite and a Cloudflare-compatible production bundle. The shared component structure is shadcn-compatible. No database or paid animation service is needed.

The Horizon hero integrates the supplied Three.js/GSAP component as three scroll scenes: Horizon, Cosmos, and Infinity. Its GPU scene is loaded after the page HTML, caps resolution and star density, skips bloom on touch/low-core devices, and reduces quality if sustained slow frames are detected. The scene stops rendering while paused, offscreen, or in a hidden tab. A CSS sky remains when WebGL is unavailable. Pause and reduced-motion preferences disable the animated camera and the rest of the portfolio's parallax.

Scroll parallax adds depth to the hero, project previews, about artwork, and contact decoration. It uses passive scroll events and one scheduled transform update, with cached layout measurements, smaller offsets on touch devices, and no continuous idle loop or scroll hijacking.

## Personalize

- `app/page.tsx`: contact email, introduction, about text, project data, project previews, filtering, and dialogs.
- `app/globals.css`: palette, typography, layouts, breakpoints, and motion.
- `components/ui/horizon-hero-section.tsx`: reusable hero, exported as both `HorizonHeroSection` and `Component`.
- `components/ui/horizon-hero-section.css`: scoped hero styling, responsive layout, and static fallback.
- `components/ui/horizon-scene.ts`: Three.js scene, capped rendering, bloom, camera motion, and GPU cleanup.
- `components/ui/horizon-model.ts`: scene content, camera path, and quality limits.
- `app/lib/frame-loop.ts`: demand-driven animation scheduling.
- `app/use-parallax.ts`: lightweight scroll transforms.
- `app/layout.tsx`: search and social metadata.
- `public/icon.png`: site icon.

Relay, Forma, Orbit, and Grove are **sample visual concepts**, not Sean's verified client projects. Replace the sample projects and review the draft first-person biography before using this as a professional public portfolio. Project previews are decorative interface illustrations, not functional embedded apps. Contact actions open the visitor's email client; the copy button copies the email address.

Typography uses Manrope and DM Sans from Google Fonts with local system fallbacks. No external images are required.

## Component and style setup

Before integration, route-specific components lived in `app/`; there was no shared UI folder or shadcn configuration. The reusable component path is now **`components/ui`**, configured by `aliases.ui` in `components.json`. Keeping shared components here makes imports predictable and lets the shadcn CLI place future components in the right directory. Application routes remain under `app/`.

- Shared styles: `app/globals.css`.
- Tailwind/shadcn theme tokens: `app/shadcn-theme.css`.
- Component-specific styles: `components/ui/horizon-hero-section.css`.
- Class-name utility: `lib/utils.ts` (`cn` combines `clsx` and `tailwind-merge`).
- TypeScript aliases: `@/*` points to the project root in `tsconfig.json`.

TypeScript and Tailwind's PostCSS plugin were already installed. Tailwind theme and utility layers are now imported into the shared stylesheet; global preflight is omitted to preserve the existing portfolio's CSS. `components.json` uses a blank Tailwind config path for Tailwind v4. These follow the [shadcn configuration conventions](https://ui.shadcn.com/docs/components-json).

Everything is configured in this project; **do not rerun initialization here**. After `npm ci`, add a future shadcn component with:

```sh
npx shadcn@latest add button
```

For a separate, unconfigured React/TypeScript project, the [shadcn CLI](https://ui.shadcn.com/docs/cli) provides `npx shadcn@latest init`. The [manual setup guide](https://ui.shadcn.com/docs/installation/manual) covers Tailwind, aliases, and shared theme styles.

The requested dependencies `three` and `gsap`, plus `@types/three`, are installed. The adapted component fixes the source snippet's untyped refs, repeated heading refs, missing CSS, off-by-one scene counter, document-wide scroll math, and incomplete animation/GPU cleanup. Progress updates use DOM refs instead of triggering React renders on every scroll.

## Horizon demo

The main portfolio renders the component with Sean's name. A standalone `DemoOne` is available at **`/horizon-demo`**. The original import works:

```tsx
import { Component } from "@/components/ui/horizon-hero-section";

export function Example() {
  return <Component eyebrow="SEAN VILLANUEVA / WEB DEVELOPER" ctaHref="#work" />;
}
```

Optional props: `className`, `eyebrow`, `ctaHref`, `ctaLabel`, `paused`, and `onPausedChange`. For standalone use, point `ctaHref` at an existing destination. `DemoOne` includes its own destination.

## Deployment

`npm run build` emits the Worker entrypoint in `dist/server/index.js`, assets in `dist/client`, and Sites metadata in `dist/.openai`. The Sites workflow tracks hosting in `.openai/hosting.json`. No database or runtime secrets are needed.
