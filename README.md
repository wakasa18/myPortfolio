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

React 19, TypeScript, and plain CSS. Vinext provides Next.js-compatible routing on Vite and a Cloudflare-compatible production bundle. There is no database, paid animation service, or UI component framework. The sculpture is a custom Canvas 2D rendering of a 3D torus knot, with pointer response, offscreen rendering suspension, reduced-motion support, and a pause control.

## Personalize

- `app/page.tsx`: contact email, introduction, about text, project data, project previews, filtering, and dialogs.
- `app/globals.css`: palette, typography, layouts, breakpoints, and motion.
- `app/sculpture.tsx`: the interactive hero sculpture.
- `app/layout.tsx`: search and social metadata.
- `public/icon.png`: site icon.

Relay, Forma, Orbit, and Grove are **sample visual concepts**, not Sean's verified client projects. Replace the sample projects and review the draft first-person biography before using this as a professional public portfolio. Project previews are decorative interface illustrations, not functional embedded apps. Contact actions open the visitor's email client; the copy button copies the email address.

Typography uses Manrope and DM Sans from Google Fonts with local system fallbacks. No external images are required.

## Deployment

`npm run build` emits the Worker entrypoint in `dist/server/index.js`, assets in `dist/client`, and Sites metadata in `dist/.openai`. The Sites workflow tracks hosting in `.openai/hosting.json`. No database or runtime secrets are needed.
