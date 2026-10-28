# Sean Villanueva — Portfolio

A responsive, animated portfolio for Sean Villanueva, Junior Web Developer and fourth-year Information Systems student in Santa Maria, Bulacan, Philippines.

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

`npm test` builds the site and checks its production response, real project content and link, document assets, navigation, contact details, removed example routes, missing-page response, and icon. Browser interaction and visual checks are separate.

## Stack

React 19, strict TypeScript, Tailwind CSS 4, and scoped CSS. Vinext provides Next.js-compatible routing on Vite and a Cloudflare-compatible production bundle. The shared component structure is shadcn-compatible. No database or paid animation service is needed.

The animated hero uses three personal sections: Sean, Code, and Work. They introduce Sean, his confirmed technologies, and his ongoing Pharxmaco project. Its GPU scene is loaded after the page HTML, caps resolution and star density, skips bloom on touch/low-core devices, and reduces quality if sustained slow frames are detected. The scene stops rendering while paused, offscreen, or in a hidden tab. A CSS sky remains when WebGL is unavailable. Pause and reduced-motion preferences disable the animated camera and the rest of the portfolio's parallax.

Scroll parallax adds depth to the hero, project previews, and contact decoration. It uses passive scroll events and one scheduled transform update, with cached layout measurements, smaller offsets on touch devices, and no continuous idle loop or scroll hijacking.

The real project, section headings, education, and about content use one-time scroll entrances. The sticky topbar hides on downward scroll and returns on upward scroll, with a page progress line. Menu-open, keyboard-focus, pause, and reduced-motion states keep navigation visible. `app/lib/scroll-motion.ts` schedules at most one header update per scroll frame and uses finite Web Animations for entrances; `app/use-scroll-motion.ts` handles cleanup. Content stays visible if JavaScript or motion is unavailable.

About pairs a large two-line introduction with a compact horizontal education timeline. The existing profile supplies the degree, school, academic period, current year, and section. A short introduction leads to the résumé download; the original contribution and working-style details continue beneath the toolkit. The role types in once, and the education line draws over 1500ms with timed markers and a current-year count. Biography highlights, the résumé action, and toolkit chips have reveal feedback. Orbital accents and the current-year marker repeat while motion is enabled. The seven toolkit logos remain readable labels grouped as Backend, Database, and Frontend. Narrow screens stack the biography, actions, and toolkit groups. Pause and reduced motion keep all information visible.

The illustrative pharmacy previews replay sample sales, inventory updates, and transaction records. Their scripted sequence advances only for the active, visible chapter; pausing or reducing motion restores the static illustration. Chapter progress follows scrolling in the pinned desktop walkthrough. These previews do not perform real transactions.

`app/ui-motion.css` provides matching interaction feedback: gentle card lifts, staggered tag movement, button presses, filter selection, navigation underlines, mobile/scene menu entrances, project-dialog reveals, and copy confirmation. These finite CSS effects share the scroll easing and respect pause/reduced-motion settings. Individual `translate`/`scale` properties keep hover feedback separate from scroll and magnetic transforms.

## Personalize

- `app/page.tsx`: page composition, navigation, and shared motion controls.
- `components/ui/about-section.tsx`: introduction, education timeline, résumé link, and confirmed contribution details.
- `app/about-editorial.css`: About layout, finite timeline motion, and responsive toolkit treatment.
- `app/lib/about-motion.ts`: education-marker timing and the current-year count, with observer and timer cleanup.
- `components/ui/toolkit.tsx`: seven existing tool logos and accessible category lists.
- `app/lib/portfolio-profile.ts`: confirmed contact details, education, document links, and the Pharxmaco team project's 2025–2026 timeline from the latest supplied documents.
- `components/ui/pharmacy-project.tsx`: Pharxmaco walkthrough, chapter navigation, contribution overview, visible cashier login, and project links.
- `components/ui/pharmacy-preview.tsx`: three non-interactive HTML interface illustrations using sample data.
- `app/work-showcase.css`: responsive Work section with a sticky desktop walkthrough and stacked mobile previews.
- `app/profile-update.css`: profile details and contact additions.
- `public/downloads/`: the latest user-supplied resume and project portfolio, linked as editable Word downloads.
- `app/globals.css`: palette, typography, layouts, breakpoints, and motion.
- `components/ui/horizon-hero-section.tsx`: reusable hero, exported as both `HorizonHeroSection` and `Component`.
- `components/ui/horizon-hero-section.css`: scoped hero styling, responsive layout, and static fallback.
- `components/ui/horizon-scene.ts`: Three.js scene, capped rendering, bloom, camera motion, and GPU cleanup.
- `components/ui/horizon-model.ts`: scene content, camera path, and quality limits.
- `app/lib/frame-loop.ts`: demand-driven animation scheduling.
- `app/use-parallax.ts`: lightweight scroll transforms.
- `app/layout.tsx`: search and social metadata.
- `public/icon.png`: site icon.

Pharxmaco is Sean's ongoing **team project**, with front-end and back-end contributions described in the supplied resume and portfolio. Its project title includes sales forecasting; the site limits Sean's personal contribution to the features he confirmed. The Work section illustrates POS, inventory, and transaction history with clearly labeled sample data. These HTML previews are not actual application screenshots and cannot perform transactions. On a tall desktop, scrolling advances the preview while the summary stays visible; chapter buttons also allow direct selection. Mobile stacks all three previews, and reduced motion removes the pinned scroll sequence. The cashier username `cashier` and password `cashier123` remain visible beside the live project link. The latest supplied documents date the project **2025–2026**.

The current document sources are the three `TNR_12.docx` files supplied from Downloads on October 26, 2026. The website's resume and project-brief downloads are exact copies of those versions. All three documents, including the application letter, are also kept in `outputs/en3b-prefinals/`; see its `START_HERE.md` for the source filenames. The About section uses Sean Warren M. Villanueva's full name and the resume's 2023–present education dates, SQL/CRUD experience, teamwork, and willingness to learn.

The site contains only Sean's confirmed information and real project. The fictional project collection, category filters, project dialogs, code illustration, and component demo pages have been removed. The education timeline contains his actual program, school, section, and current year of study.

The project links to https://silver-fly-191014.hostingersite.com/, the Pharxmaco staff sign-in page supplied by Sean. This is the pharmacy project's live URL, separate from the personal portfolio's address. Primary email actions open Gmail compose in a new tab with Sean's address filled in; visitors may need to sign in to Gmail. The footer also offers a native email-app link and a copy-address action. The phone link opens a dialer, and document links download the supplied Word files. Publication remains on hold at Sean's request.

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

## Cinematic footer

The contact section now uses `CinematicFooter` from `components/ui/motion-footer.tsx`, adapted from the supplied component. Scoped styles live in `components/ui/motion-footer.css`, using the existing navy/lavender shadcn tokens and Manrope/DM Sans typography. No context provider, stock imagery, or additional font download is needed. GSAP was already installed; Lucide React supplies the icons.

The diagonal marquee, oversized name backdrop, desktop curtain reveal, and magnetic links remain. Sean's email, project/about links, copy action, and site-wide motion toggle replace the sample app downloads and legal links. Animation imports are deferred until the footer enters view, magnetic movement uses reusable transform tweens on fine pointers, and ambient effects stop offscreen or in hidden tabs. Reduced motion and the existing pause control stop footer motion. Short viewports and mobile use normal document flow; keyboard focus reveals the clipped desktop footer. Effects and event listeners are cleaned up when the component unmounts.

Optional props: `className`, `id`, `name`, `email`, `workHref`, `aboutHref`, `topHref`, `paused`, and `onPausedChange`. Without controlled motion props the footer manages its own pause state. Use valid anchors for your page when changing the defaults.

The standalone demonstration routes have been removed. TypeScript, Tailwind, `@/*` aliases, and the `/components/ui` shadcn path remain configured.

## Deployment output

`npm run build` emits the Worker entrypoint in `dist/server/index.js`, assets in `dist/client`, and Sites metadata in `dist/.openai`. The Sites workflow tracks hosting in `.openai/hosting.json`. No database or runtime secrets are needed.

## Deploy with GitHub and Vercel

Import this repository into Vercel with the Next.js framework preset and the repository root as the root directory. `vercel.json` selects `npx next build` for Vercel, while local `npm run build` keeps the existing Vinext workflow. Leave the output directory at the Next.js default. The portfolio does not require environment variables.

After deployment, update `metadataBase` in `app/layout.tsx` to the portfolio's actual Vercel URL. The Pharxmaco URL is a project link, separate from the portfolio's hosting address.
