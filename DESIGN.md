---
name: Visa Land
description: Modern travel editorial for small-group journeys from Almaty
colors:
  porcelain: "#F5F3ED"
  matcha-leaf: "#A5B88A"
  graphite: "#292B29"
  tomato-red: "#D85B49"
  muted-graphite: "#656A64"
  night-graphite: "#1B1D1B"
  white: "#FFFFFF"
typography:
  display:
    fontFamily: "Manrope, Arial, sans-serif"
    fontSize: "clamp(58px, 8.8vw, 140px)"
    fontWeight: 800
    lineHeight: 0.78
    letterSpacing: "-0.04em"
  headline:
    fontFamily: "Manrope, Arial, sans-serif"
    fontSize: "clamp(44px, 6.6vw, 104px)"
    fontWeight: 700
    lineHeight: 0.9
    letterSpacing: "-0.04em"
  title:
    fontFamily: "Manrope, Arial, sans-serif"
    fontSize: "34px"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "-0.04em"
  body:
    fontFamily: "Manrope, Arial, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.7
  label:
    fontFamily: "Manrope, Arial, sans-serif"
    fontSize: "11px"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "0.1em"
rounded:
  square: "0px"
spacing:
  xs: "8px"
  sm: "16px"
  md: "20px"
  lg: "28px"
  section-mobile: "84px"
  section-desktop: "130px"
components:
  button-accent:
    backgroundColor: "{colors.tomato-red}"
    textColor: "{colors.graphite}"
    typography: "{typography.label}"
    rounded: "{rounded.square}"
    padding: "17px 22px"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.porcelain}"
    typography: "{typography.label}"
    rounded: "{rounded.square}"
    padding: "12px 18px"
  card-trip:
    backgroundColor: "{colors.porcelain}"
    textColor: "{colors.graphite}"
    rounded: "{rounded.square}"
    padding: "24px"
  field-dark:
    backgroundColor: "transparent"
    textColor: "{colors.porcelain}"
    typography: "{typography.body}"
    rounded: "{rounded.square}"
    padding: "15px"
---

# Design System: Visa Land

## Multipage extension — November 2026

The active public surface is `pages.css`, layered over shared tokens in `styles.css`. It uses independent home, catalog, trip, calendar and about routes. Display type is capped at 96px with 0.98 line height; section titles use `clamp(36px, 5vw, 76px)`. Journey cards are links with 440px desktop photos and a two-column grid, stacking at 600px. Calendar entries link to a trip and keep dates/statuses together. The authenticated editor uses dense labelled fields, collapsible journeys, separate departure rows and a persistent save bar.

Motion now expresses navigation and choice: native cross-document transitions and filter transitions, a 700ms cover reveal, and 180ms editor expansion feedback. No staggered section entrances. Spatial motion respects reduced-motion, and background video pauses when invisible.

## Overview

**Creative North Star: "The Living Travel Journal"**

Visa Land is a calm, code-first travel editorial: large grotesk headlines, documentary trip photography, generous air, and a strict grid of fine rules. It should feel like a contemporary journal made by people who were actually there—not a glossy booking engine or a catalogue of tourism clichés.

The system moves between Porcelain openness, Matcha warmth, and Graphite depth, with Tomato Red reserved for decisive action. Light and bold Manrope weights create the expressive contrast. On mobile, the hierarchy compresses into a direct path from Instagram arrival, through trips and dates, to a WhatsApp conversation.

**Key Characteristics:**

- Oversized, tightly set grotesk display type with light-weight phrases inside bold statements.
- Documentary photography shown at generous scale with factual, compact captions.
- Square forms and one-pixel borders that make the page feel composed rather than decorated.
- Flat color fields in Porcelain, Matcha Leaf, and Graphite; Tomato Red marks action.
- One cinematic hero drift, restrained image motion, and a complete reduced-motion fallback.

## Colors

The palette combines quiet paper, botanical warmth, ink-dark structure, and one human red accent.

### Primary

- **Tomato Red:** Use for the principal conversion action, modal close control, text selection, caret, scrollbar, and light-surface focus outline. Its rarity gives it urgency.

### Secondary

- **Matcha Leaf:** Use for broad editorial bands, emphasized phrases on dark photography, proof strips, and dark-surface focus outlines.

### Neutral

- **Porcelain:** The default page canvas, card surface, caption ground, and text color over Graphite or imagery.
- **Graphite:** The default copy color, structural border, dark editorial section, and primary high-contrast ground.
- **Muted Graphite:** Secondary metadata, routes, and supporting information on Porcelain.
- **Night Graphite:** The footer ground and deepest tonal endpoint.
- **White:** Reserved for legibility over photographic modal imagery and legacy high-contrast text contexts.

### Named Rules

**The Four-Ink Rule.** Build every major composition from Porcelain, Matcha Leaf, Graphite, and Tomato Red; additional neutrals may only support hierarchy.

**The Tomato Means Action Rule.** Do not turn Tomato Red into a decorative field. It identifies an action, focus, or selection.

## Typography

**Display Font:** Manrope (with Arial and sans-serif fallbacks)  
**Body Font:** Manrope (with Arial and sans-serif fallbacks)

**Character:** A single modern grotesk gains range through extreme scale and deliberate weight contrast. Tight bold headlines supply authority; light inset phrases bring softness and human cadence.

### Hierarchy

- **Display:** Extra bold, tightly tracked, compressed line height. Use only for the opening statement; embedded phrases may drop to light weight and take Matcha Leaf.
- **Headline:** Bold, tightly tracked, near-solid line height. Use for section theses rather than descriptive labels.
- **Title:** Bold and compact. Use for tour names and other card-level destinations.
- **Body:** Regular weight with open leading. Keep explanatory copy in compact columns, generally no wider than about 680px.
- **Label:** Small, bold, widely tracked, and usually uppercase. Use for metadata, captions, statuses, and navigation cues.

### Named Rules

**The Weight-Shift Rule.** Create expression inside a headline by changing weight before introducing another font, effect, or ornament.

**The Scale Before Decoration Rule.** Headlines earn presence through size, line breaks, and contrast—not shadows, outlines, or gradients on type.

## Layout

Desktop sections use broad vertical spacing and a 4vw horizontal inset. The editorial grid alternates asymmetrical two-column stories, three-card travel grids, ruled calendar rows, and image-led splits. One-pixel borders and narrow gaps make related elements read as a system.

At 900px, major two-column stories stack, trip cards move to two columns, and navigation becomes a full-screen Graphite menu. At 600px, sections use a 20px inset and 84px vertical padding; trip cards become an 85vw horizontal snap rail, decorative hero annotations disappear, galleries reduce to the strongest image, and forms become one column. The mobile sequence must keep trips, dates, and the WhatsApp handoff easy to scan after an Instagram visit.

**The Border-Led Grid Rule.** Use fine rules and alignment—not floating rounded containers—to define groups, rows, and transitions.

## Elevation & Depth

The system is flat by default and uses no box shadows. Depth comes from full-bleed documentary photography, tonal field changes, overlays on imagery, and physical hover movement. The hero alone receives a layered cinematic shade to protect typography over video.

**The Flat-by-Default Rule.** Do not add ambient shadows to cards, navigation, fields, or modals; use borders, color, and overlap instead.

## Shapes

Forms are square and architectural. Buttons, fields, cards, tabs, labels, and the modal use zero-radius corners. Fine one-pixel borders create the recurring silhouette, while photographs remain rectangular and crop edge-to-edge.

**The No Soft Corners Rule.** Rounded pills and generic soft cards do not belong in this system; a status may be compact, but its geometry remains square.

## Components

### Buttons

- **Shape:** Square, horizontally composed, and wide enough to pair a label with the custom line-arrow.
- **Primary:** Tomato Red field with Graphite text, label typography, and 17px × 22px padding. On mobile it spans the available width.
- **Hover / Focus:** Lift by 3px on hover; use a 3px Tomato Red outline on light surfaces and Matcha Leaf on dark surfaces, offset by 4px.
- **Outline:** Transparent with a one-pixel current-color border, used for the compact desktop WhatsApp action.

### Tabs and Status Labels

- **Style:** Tabs sit directly on the Matcha field above a Graphite rule. Inactive tabs use reduced opacity; the active tab becomes fully opaque and bold.
- **Status:** A small uppercase label sits directly on photography using a Porcelain rectangular backing.

### Cards / Containers

- **Corner Style:** Square.
- **Background:** Trip cards use Porcelain inside the Matcha travel section.
- **Shadow Strategy:** No shadow; hover lifts the whole card by 8px.
- **Border:** Internal price metadata is separated by a fine muted rule.
- **Internal Padding:** Card content uses 24px.

### Inputs / Fields

- **Style:** Transparent fields on Graphite with a one-pixel translucent Porcelain border and 15px padding.
- **Focus:** Border shifts to Matcha Leaf, supported by the global visible focus outline.
- **Structure:** Labels are compact uppercase metadata; related fields form a two-column grid on desktop and one column on mobile.

### Navigation

The fixed desktop header is transparent and Porcelain over the hero, then condenses onto an almost-opaque Porcelain field with Graphite text after scrolling. Links use a fine animated underline. Below 900px, a two-line menu control opens a full-screen Graphite navigation panel with large text.

### Trip Calendar

Months and departures form a ruled editorial ledger. Each row aligns date, trip name, status, and arrow; hover introduces a white tonal shift rather than a shadow. On small screens, status is omitted to preserve the date-and-trip decision path.

### Hero Media

The hero uses real trip video with a documentary poster fallback and a slow 18-second drift. A left-to-right and bottom-up Graphite shade protects the display statement. All authored animation is disabled under `prefers-reduced-motion`.

## Do's and Don'ts

### Do:

- **Do** use real Visa Land trip photography and factual captions.
- **Do** preserve strong light/bold contrast inside oversized headlines.
- **Do** organize content with one-pixel borders, alignment, and decisive color fields.
- **Do** keep the mobile journey short: understand the offer, choose a trip or date, continue in WhatsApp.
- **Do** reserve cinematic movement for the hero and keep all other motion subordinate.

### Don't:

- **Don't** introduce rounded cards, pill buttons, soft shadows, glassmorphism, or generic booking-widget styling.
- **Don't** use Tomato Red as ambient decoration or on large background areas.
- **Don't** replace documentary imagery with stock travel clichés or invented social proof.
- **Don't** add competing display fonts, illustrative icons, or ornamental gradients.
- **Don't** let desktop-only annotations or dense metadata obstruct the mobile conversion path.
