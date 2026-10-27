---
name: "Sean Villanueva Portfolio"
description: "A cinematic navy portfolio with a software walkthrough for the ongoing Pharxmaco project."
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
  toolkit-surface: "#13203a"
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
    backgroundColor: "#14203bba"
    textColor: "{colors.text-bright}"
    rounded: "{rounded.pill}"
    padding: "12px 16px 12px 24px"
  resume-download-hover:
    backgroundColor: "{colors.lavender}"
    textColor: "{colors.navy}"
  toolkit-chip:
    backgroundColor: "{colors.toolkit-surface}"
    textColor: "#d3dcf2"
    rounded: "{rounded.pill}"
    padding: "8px 15px 8px 12px"
  education-card:
    textColor: "{colors.ink}"
    rounded: "{rounded.card}"
    padding: "clamp(26px, 3vw, 44px)"
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

The portfolio uses a continuous midnight navy setting with lavender light, large sans-serif headings, and occasional italic serif words. The existing hero, intro, About, navigation, starfield, and footer establish this identity; the Work walkthrough extends it.

Broad section spacing surrounds more compact evidence and interface detail. Hiring teams are the primary audience and instructors the secondary audience, so project status, individual contribution, actions, and clearly labeled illustrative previews remain readable within the cinematic setting.

**Key Characteristics:**
- Midnight navy surfaces with lavender emphasis.
- Manrope headings, DM Sans body text, and Georgia italic accents.
- Thin cool borders, rounded software surfaces, and restrained ambient depth.
- Motion has paused and reduced-motion alternatives.

Captured from the current implementation, including the approved Work extension. Source authority: `app/globals.css`, its ordered overrides in `app/layout.tsx`, `app/profile-update.css`, `app/premium-polish.css`, `app/mobile-polish.css`, `app/header-cta.css`, `app/ui-motion.css`, `app/work-showcase.css`, and the Work components. The frontmatter records implemented primitives; the sidecar adds motion, depth, breakpoints, and renderable examples.

## Colors

The palette places pale lavender and cool text over dark navy layers.

The sidecar's eight-step tonal ramps are synthesized panel metadata; they do not add colors to the implemented palette.

### Primary
- **Lavender** supplies emphasis, selected chapter rules, icons, and action fills.

### Secondary
- **Soft sage** (`preview-positive`) and **warm sand** (`preview-caution`) distinguish stock and transaction states inside illustrative software views.

### Neutral
- **Midnight paper** (`paper`) is the page base; **navy** anchors dark contrast.
- **Cool ink**, **bright text**, and **portfolio muted** separate primary text from supporting copy.
- **Raised navy**, **deep navy**, and **surface border** define the inherited education card.
- **Preview surface**, **sidebar**, **selected**, **row**, **border**, and **line** form the Work illustration's compact hierarchy. These are surface-specific values, not a replacement palette for the rest of the page.
- **Focus lavender** identifies the shared keyboard outline; individual actions retain their existing focus overrides.

**The Incumbent Identity Rule.** Extend the existing navy, lavender, typography, and atmospheric effects when adding to this portfolio.

## Typography

Manrope is the display family, DM Sans is the body family, and Georgia provides italic accent words. Arial and Times New Roman remain the respective fallbacks. Font sizes respond to the existing media rules rather than a fabricated universal type scale.

- **Display** is the enlarged Work section heading; its mobile size becomes `clamp(40px, 11vw, 62px)`.
- **Headline** records the inherited section heading. It steps down at the existing desktop/tablet breakpoints; the About heading reaches (40px) on phones.
- **Title** records the Work project name; it becomes `clamp(39px, 11vw, 52px)` on phones.
- **Body** is the page base. About copy uses a reading line height of (1.75) and a maximum width of (560px). The Work summary description, contribution, and desktop actions use the body size; preview captions keep their component-specific sizes.
- **Label** records the uppercase Work project status and becomes (10px) on phones. Other small interface labels belong to the illustration and are not a general body-text size.
- **Accent** is italic in use. **Code** displays the visible cashier credentials and grows to (15px) on phones.

## Layout

The shared content container has a maximum width of (1440px), with (56px) desktop side gutters. Gutters become (36px) at 1100px, (22px) at 800px, (18px) at 600px, and (14px) at 360px. General sections use the fluid section spacing token; Work overrides this with (64px), then (55px) on phones.

The header overlays the hero and remains sticky, with a translucent full-width background after scrolling. Work's current-section navigation state holds the header visible during the walkthrough. The existing About section pairs education and copy, stacking at 900px. Work uses a compact summary beside a dominant preview: `minmax(290px, .75fr) minmax(0, 2fr)` with a (48px) gap. At 1000px and below the preview chapters stack; at 600px the summary also becomes a single column and the illustrative sidebar disappears.

Work pinning is eligible only from (1101px) wide and (850px) high, when the full stage plus (136px) fits the viewport and reduced motion is off. The sticky top is (112px); its scroll track adds (1300px) to the viewport height. All desktop chapters share one grid cell, with inactive chapters hidden through visibility so the tallest chapter reserves the stage height. The scroll cue also retains its space. Pausing removes animation while retaining this layout; reduced motion removes the pin.

## Elevation & Depth

The inherited system combines navy tonal layers, thin borders, diffuse shadows, and atmospheric light. The education card uses a subtle inset highlight and a long soft shadow; the scrolled header uses blur. Existing hero text treatments, starfield, spotlight, and footer portal remain part of the incumbent identity. The Work illustration relies mainly on tonal separation and borders rather than a new dramatic shadow.

**The Content Boundary Rule.** Keep ambient stars, light, and gradients behind readable content; preserve the opaque software preview surface.

Exact elevation and motion values are held in `.impeccable/design.json`.

## Shapes

Large inherited cards use the card radius; the Work illustration uses the slightly tighter preview radius. Compact rows, search outlines, and order panels use the smaller radii in the frontmatter. Action pills and toolkit chips are fully rounded. Thin cool rules divide metadata and chapters; the active chapter adds a lavender top rule. The logo's asterisk is an inline SVG, preserving its shape across platforms.

## Components

### Buttons

The header email action and résumé download are rounded links with a lavender fill sweep on hover or focus. The current header action has an availability dot and a circular asterisk mark. These retain visible focus and their existing motion-off behavior. The phone menu has a minimum (44px) height; the résumé action has a minimum (48px) height.

### Chips

Toolkit chips group skills by role with a dark fill, cool outline, lavender icon, and pill shape. They wrap within the available width; their mobile minimum height is (40px). Education tags use the existing smaller tag treatment.

### Cards / Containers

The education card uses a navy gradient, card radius, cool border, and diffuse depth. Its segmented degree progress remains distinct from the Work walkthrough. The software preview has a preview radius and opaque dark fill, with a sidebar and compact table/order surfaces. Its desktop inner layout has a minimum height of (550px); this minimum is removed on phones. Desktop inventory rows use (7px) vertical padding and inline small metadata; phone metadata returns to a separate line.

### Navigation

Main navigation uses text links with an underline and lavender current-section state. At 600px it becomes an expandable menu with (48px) link targets, a bounded scroll area, and Escape/outside dismissal. Work uses three numbered native buttons with `aria-pressed` selection, an active top rule, and direct chapter access.

### Work walkthrough

The chapter sequence is point of sale, inventory, then transaction history. Desktop shows one chapter at a time; stacked layouts expose all three. Live-project and brief-download links sit with the project summary, followed by the technology line and openly visible, selectable cashier credentials. The scroll cue names the next chapter and marks the end of the walkthrough on the last chapter. Below the preview, a short caption distinguishes the illustrated behavior from Sean's individual contribution; project notes preserve the wider team scope.

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
