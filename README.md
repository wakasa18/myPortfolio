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

React 19, TypeScript, and plain CSS. Vinext provides Next.js-compatible routing on Vite and a Cloudflare-compatible production bundle. There is no database, paid animation service, or UI component framework. The sculpture uses native WebGL with a precomputed mesh and one GPU draw call per frame. Its animation loop stops when paused, offscreen, or in a hidden tab. Pixel density is capped at 1.5, and a static CSS sculpture is shown if WebGL is unavailable. Reduced-motion preferences and the pause control disable both the animation and parallax.

Scroll parallax adds depth to the hero, project previews, about artwork, and contact decoration. It uses passive scroll events and one scheduled transform update, with cached layout measurements, smaller offsets on touch devices, and no continuous idle loop or scroll hijacking.

## Personalize

- `app/page.tsx`: contact email, introduction, about text, project data, project previews, filtering, and dialogs.
- `app/globals.css`: palette, typography, layouts, breakpoints, and motion.
- `app/sculpture.tsx`: the interactive hero sculpture.
- `app/lib/sculpture-renderer.ts`: static mesh and GPU shaders.
- `app/lib/frame-loop.ts`: demand-driven animation scheduling.
- `app/use-parallax.ts`: lightweight scroll transforms.
- `app/layout.tsx`: search and social metadata.
- `public/icon.png`: site icon.

Relay, Forma, Orbit, and Grove are **sample visual concepts**, not Sean's verified client projects. Replace the sample projects and review the draft first-person biography before using this as a professional public portfolio. Project previews are decorative interface illustrations, not functional embedded apps. Contact actions open the visitor's email client; the copy button copies the email address.

Typography uses Manrope and DM Sans from Google Fonts with local system fallbacks. No external images are required.

## Deployment

`npm run build` emits the Worker entrypoint in `dist/server/index.js`, assets in `dist/client`, and Sites metadata in `dist/.openai`. The Sites workflow tracks hosting in `.openai/hosting.json`. No database or runtime secrets are needed.
