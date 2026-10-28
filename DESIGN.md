---
name: "Sean Villanueva Portfolio"
description: "A cinematic navy portfolio with an editorial introduction, education timeline, and Pharxmaco software walkthrough."
colors:
  paper: "#0b1120"
  ink: "#eef2ff"
  portfolio-muted: "#b2bed6"
  navy: "#101829"
  lavender: "#bec8ff"
  line: "#2d3b59"
  text-bright: "#e4eaff"
  surface-raised: "#192741"
  surface-deep: "#101a2c"
  surface-border: "#455778"
  toolkit-surface: "#101b31"
  resume-fill: "#99a6f8"
  preview-surface: "#0f192c"
  preview-sidebar: "#16223a"
  preview-selected: "#2b3d62"
  preview-row: "#17253d"
  preview-border: "#536a98"
  preview-line: "#30466b"
  preview-positive: "#b7ddcf"
  preview-caution: "#efd1a8"
  focus: "#8288ef"
typography:
  display:
    fontFamily: "Manrope, Arial, sans-serif"
    fontSize: "clamp(48px, 6vw, 92px)"
    fontWeight: 550
    lineHeight: 1.12
    letterSpacing: "-0.04em"
  headline:
    fontFamily: "Manrope, Arial, sans-serif"
    fontSize: "48px"
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: "-1.8px"
  title:
    fontFamily: "Manrope, Arial, sans-serif"
    fontSize: "clamp(42px, 4.7vw, 72px)"
    fontWeight: 600
    lineHeight: 1.12
    letterSpacing: "-0.04em"
  body:
    fontFamily: "DM Sans, Arial, sans-serif"
    fontSize: "16px"
    fontWeight: 400
  label:
    fontFamily: "DM Sans, Arial, sans-serif"
    fontSize: "11px"
    lineHeight: 1.7
    letterSpacing: "0.08em"
  accent:
    fontFamily: "Georgia, Times New Roman, serif"
    fontWeight: 400
  about-display:
    fontFamily: "Manrope, Arial, sans-serif"
    fontSize: "clamp(58px, 6.25vw, 96px)"
    fontWeight: 650
    lineHeight: 1.02
    letterSpacing: "-0.04em"
  about-biography:
    fontFamily: "DM Sans, Arial, sans-serif"
    fontSize: "23px"
    fontWeight: 400
    lineHeight: 1.45
  education-title:
    fontFamily: "Manrope, Arial, sans-serif"
    fontSize: "clamp(26px, 2.08vw, 32px)"
    fontWeight: 550
    lineHeight: 1.12
    letterSpacing: "-0.035em"
  code:
    fontFamily: "ui-monospace, Consolas, monospace"
    fontSize: "13px"
    lineHeight: 1.5
rounded:
  small: "5px"
  row: "6px"
  control: "7px"
  order: "10px"
  preview: "14px"
  card: "16px"
  pill: "999px"
spacing:
  tight: "8px"
  compact: "12px"
  control: "16px"
  content: "24px"
  group: "28px"
  stack: "36px"
  column: "48px"
  section: "clamp(72px, 9vw, 120px)"
components:
  header-email:
    backgroundColor: "#101a2e99"
    textColor: "{colors.text-bright}"
    rounded: "{rounded.pill}"
    padding: "5px 5px 5px 17px"
  header-email-hover:
    backgroundColor: "{colors.lavender}"
    textColor: "{colors.navy}"
  resume-download:
    backgroundColor: "{colors.resume-fill}"
    textColor: "{colors.navy}"
    rounded: "{rounded.pill}"
    padding: "13px 24px"
  resume-download-hover:
    backgroundColor: "{colors.lavender}"
    textColor: "{colors.navy}"
  toolkit-chip:
    backgroundColor: "{colors.toolkit-surface}"
    textColor: "#edf1ff"
    rounded: "{rounded.pill}"
    padding: "10px 20px"
  education-timeline:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    padding: "18px 0 0"
  work-chapter:
    backgroundColor: "transparent"
    textColor: "#aebedb"
    padding: "11px 0 0"
  work-chapter-active:
    textColor: "{colors.ink}"
  work-action:
    textColor: "{colors.lavender}"
  preview-frame:
    backgroundColor: "{colors.preview-surface}"
    textColor: "#e7edff"
    rounded: "{rounded.preview}"
  preview-search:
    backgroundColor: "transparent"
    textColor: "#c2cfeb"
    rounded: "{rounded.control}"
    padding: "10px 12px"
---

# Design System: Sean Villanueva Portfolio

## Overview

**Creative North Star: "Cinematic navy portfolio"**

The portfolio uses a continuous midnight navy setting with lavender light, large sans-serif headings, and occasional italic serif words. The existing hero, intro, navigation, starfield, and footer establish this identity; the editorial About introduction and Work walkthrough extend it.

Broad section spacing surrounds more compact evidence and interface detail. Hiring teams are the primary audience and instructors the secondary audience, so project status, individual contribution, actions, and clearly labeled illustrative previews remain readable within the cinematic setting.

**Key Characteristics:**
- Midnight navy surfaces with lavender emphasis.
- Manrope headings, DM Sans body text, and Georgia italic accents.
- Thin cool borders, rounded software surfaces, and restrained ambient depth.
- Motion has paused and reduced-motion alternatives.

Captured from the current implementation, including the approved Work and About extensions. Source authority: `app/globals.css`, its ordered overrides in `app/layout.tsx`, `app/profile-update.css`, `app/premium-polish.css`, `app/mobile-polish.css`, `app/header-cta.css`, `app/ui-motion.css`, `app/work-showcase.css`, `app/about-editorial.css`, and their components. The About refresh records the built UI; formal workflow status remains in its surface record. The frontmatter records implemented primitives; the sidecar adds motion, depth, breakpoints, and renderable examples.

## Colors

The palette places pale lavender and cool text over dark navy layers.

The sidecar's eight-step tonal ramps are synthesized panel metadata; they do not add colors to the implemented palette.

### Primary
- **Lavender** supplies emphasis, selected chapter rules, icons, and action fill sweeps. **Résumé lavender** (`resume-fill`) gives the About download action its stronger resting fill.

### Secondary
- **Soft sage** (`preview-positive`) and **warm sand** (`preview-caution`) distinguish stock and transaction states inside illustrative software views.

### Neutral
- **Midnight paper** (`paper`) is the page base; **navy** anchors dark contrast.
- **Cool ink**, **bright text**, and **portfolio muted** separate primary text from supporting copy.
- **Raised navy**, **deep navy**, and **surface border** remain part of the inherited container palette. About uses surface border on the toolkit chips and orbital lines, with raised navy in the chip hover state; its education timeline is open against the page background.
- **Toolkit surface** is the dark fill of the current About skill pills.
- **Preview surface**, **sidebar**, **selected**, **row**, **border**, and **line** form the Work illustration's compact hierarchy. These are surface-specific values, not a replacement palette for the rest of the page.
- **Focus lavender** identifies the shared keyboard outline; individual actions retain their existing focus overrides.

**The Incumbent Identity Rule.** Extend the existing navy, lavender, typography, and atmospheric effects when adding to this portfolio.

## Typography

Manrope is the display family, DM Sans is the body family, and Georgia provides italic accent words. Arial and Times New Roman remain the respective fallbacks. Font sizes respond to the existing media rules rather than a fabricated universal type scale.

- **Display** is the enlarged Work section heading; its mobile size becomes `clamp(40px, 11vw, 62px)`.
- **Headline** records the inherited section heading and its existing desktop/tablet steps.
- **About display** is the large greeting. Its second line uses the lavender Georgia italic accent at the same size, with slightly tighter tracking. At 1000px it becomes `clamp(52px, 8.4vw, 80px)`; at 600px it becomes `clamp(39px, 11vw, 64px)` with a line height of (1.08).
- **Education title** names the degree, with the school beneath in DM Sans. The academic values and labels are a separate, compact reading tier. The labels name real fields in a definition list; they are not decorative eyebrows.
- **Title** records the Work project name; it becomes `clamp(39px, 11vw, 52px)` on phones.
- **Body** is the page base. The Work summary description, contribution, and desktop actions use the body size; preview captions keep their component-specific sizes.
- **About biography** gives the opening profile copy a larger reading tier, bounded at (68ch). It steps to (20px) at 1250px, (18px) at 1000px, and (17px) with a line height of (1.65) on phones. The detailed contribution and working-style copy beneath uses (15px) with a line height of (1.8).
- **Label** records the uppercase Work project status and becomes (10px) on phones. Other small interface labels belong to the illustration and are not a general body-text size.
- **Accent** is italic in use. **Code** displays the visible cashier credentials and grows to (15px) on phones.

## Layout

The shared content container has a maximum width of (1440px), with (56px) desktop side gutters. Gutters become (36px) at 1100px, (22px) at 800px, (18px) at 600px, and (14px) at 360px. General sections use the fluid section spacing token; Work overrides this with (64px), then (55px) on phones.

The header overlays the hero and remains sticky, with a translucent full-width background after scrolling. Work's current-section navigation state holds the header visible during the walkthrough. Work uses a compact summary beside a dominant preview: `minmax(290px, .75fr) minmax(0, 2fr)` with a (48px) gap. At 1000px and below the preview chapters stack; at 600px the summary also becomes a single column and the illustrative sidebar disappears.

About has a narrower maximum width of (1328px) and a large two-line introduction above a ruled education path. On desktop, the degree occupies (44.4%) of the path beside a nested grid of three facts. At 1000px the degree moves above a content-sized three-column fact row; the rule is anchored to that row's top, so wrapping school text cannot move it through the values. The biography and résumé/availability actions share a two-column layout, collapsing at 600px. Toolkit groups use aligned desktop columns with proportions of (1.2 : .65 : 2.2); at 1000px they become horizontal category rows and at 600px stacked groups. The two detailed biography columns also stack at 600px. These are About-specific compositions, not a template for other sections.

Work pinning is eligible only from (1101px) wide and (850px) high, when the full stage plus (136px) fits the viewport and reduced motion is off. The sticky top is (112px); its scroll track adds (1300px) to the viewport height. All desktop chapters share one grid cell, with inactive chapters hidden through visibility so the tallest chapter reserves the stage height. The scroll cue also retains its space. Pausing removes animation while retaining this layout; reduced motion removes the pin.

## Elevation & Depth

The inherited system combines navy tonal layers, thin borders, diffuse shadows, and atmospheric light; the scrolled header uses blur. Existing hero text treatments, starfield, spotlight, and footer portal remain part of the incumbent identity. The Work illustration relies mainly on tonal separation and borders. About's education path and biography are flat against the page, separated by space and thin rules. Its faint orbital outlines sit behind the introduction without adding a card or new shadow.

**The Content Boundary Rule.** Keep ambient stars, light, and gradients behind readable content; preserve the opaque software preview surface.

Exact elevation and motion values are held in `.impeccable/design.json`.

## Shapes

Large inherited containers use the card radius; the Work illustration uses the slightly tighter preview radius. Compact rows, search outlines, and order panels use the smaller radii in the frontmatter. Action pills and toolkit chips are fully rounded. Thin cool rules divide metadata and chapters; the active chapter adds a lavender top rule. About's education path uses circular markers centered on a single fine rule. The logo's asterisk and toolkit marks are inline SVG, preserving their shapes across platforms.

## Components

### Buttons

The header email action and résumé download are rounded links with a lavender fill sweep on hover or focus. The current header action has an availability dot and a circular asterisk mark. About's résumé action starts with a solid résumé-lavender fill and dark type, a DOCX tag, and a divider before its download icon. Its minimum height is (58px) on desktop and (52px) on phones. These retain visible focus and their existing motion-off behavior. The phone menu has a minimum (44px) height.

### Chips

Toolkit chips group seven tools under Backend, Database, and Frontend, with a dark fill, cool outline, lavender logo, and pill shape. They wrap within their group; their minimum height is (54px) on desktop and (44px) on phones. Hover lifts a chip slightly and turns/scales its SVG mark only when motion is playing. The chips remain static list content, with no looping showcase or selection behavior.

### Cards / Containers

The software preview has a preview radius and opaque dark fill, with a sidebar and compact table/order surfaces. Its desktop inner layout has a minimum height of (550px); this minimum is removed on phones. Desktop inventory rows use (7px) vertical padding and inline small metadata; phone metadata returns to a separate line.

### About introduction and education path

The introduction begins directly with the greeting, followed by the italic role. Education is a named subsection with degree and school text beside three academic facts in a semantic definition list. A thin rule and circular markers replace the former oversized education card and segmented progress. Short biography paragraphs lead to the résumé and availability; the original detailed contribution and working-style prose remains below the toolkit.

The two greeting lines reveal once through masks using the shared scroll controller, with the italic role typed character by character. The education rule draws once over (1500ms); measured node delays align the markers and current-year count to its progress. Biography highlights sweep in, the résumé action shines once, and toolkit chips enter through the shared staggered reveal. Orbital accents, the current-year marker, and the inherited availability-dot pulse repeat while motion is enabled. Pausing or reducing motion removes animation and transitions while leaving all profile information visible; keyboard focus cancels running shared reveal animations.

### Navigation

Main navigation uses text links with an underline and lavender current-section state. At 600px it becomes an expandable menu with (48px) link targets, a bounded scroll area, and Escape/outside dismissal. Work uses three numbered native buttons with `aria-pressed` selection, an active top rule, and direct chapter access.

### Work walkthrough

The chapter sequence is point of sale, inventory, then transaction history. Desktop shows one chapter at a time; stacked layouts expose all three. Live-project and brief-download links sit with the project summary, followed by the technology line and openly visible, selectable cashier credentials. The scroll cue names the next chapter and marks the end of the walkthrough on the last chapter. Below the preview, a short caption distinguishes the illustrated behavior from Sean's individual contribution; project notes preserve the wider team scope.

The active, visible preview replays a scripted sample sale, stock adjustment, or transaction record. Its illustrative cursor and changing figures are presentation only. Pausing or reducing motion restores the resting illustration. In the pinned desktop layout, chapter rules fill with scroll progress and chapter changes crossfade.

### Illustrative software controls

Search bars, category chips, table tools, and transaction actions inside the previews are static HTML illustration elements. They are exposed as one described image with internal illustration markup hidden from assistive technology. Keep the visible sample-data captions. The portfolio has no visitor input field in this documented surface; the sidecar search example is an illustration, not a form.

## Do's and Don'ts

### Do:
- **Do** use the existing font stacks and navy/lavender tokens before introducing a new visual treatment.
- **Do** preserve visible keyboard focus and responsive access to every action.
- **Do** keep the Work preview labeled as an illustration using sample data.
- **Do** retain the openly visible cashier username and password in the Work summary: cashier / cashier123.
- **Do** keep motion pause and reduced-motion behavior distinct where the existing layout depends on it.

### Don't:
- **Don't** apply the Work walkthrough composition to unrelated sections as a global template.
- **Don't** turn the illustrative app controls into transaction actions or present them as real application screenshots.
- **Don't** remove the inherited hero, intro, About, or footer identity while extending Work.
- **Don't** make access to project evidence depend on a pinned scroll sequence.
