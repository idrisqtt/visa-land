---
name: Visa Land
description: Photographic travel editorial with quiet paper surfaces and restrained red actions
colors:
  paper: "#f7f7f5"
  ink: "#252728"
  muted: "#606363"
  line: "#dededb"
  accent: "#b84330"
  accent-hover: "#973523"
  tile: "#eeeeeb"
  tab: "#e6e6e3"
  white: "#ffffff"
  form-panel: "#252a2bed"
  admin-line: "#d9dcda"
  admin-field-border: "#bfc5c1"
  admin-secondary: "#e9ece7"
  admin-error: "#9b2923"
typography:
  display:
    fontFamily: "Manrope, Arial, sans-serif"
    fontSize: "clamp(44px, 5.8vw, 84px)"
    fontWeight: 500
    lineHeight: 1.06
    letterSpacing: "-0.035em"
  headline:
    fontFamily: "Manrope, Arial, sans-serif"
    fontSize: "clamp(30px, 3.6vw, 54px)"
    fontWeight: 500
    lineHeight: 1.12
    letterSpacing: "-0.035em"
  title:
    fontFamily: "Manrope, Arial, sans-serif"
    fontSize: "clamp(27px, 3vw, 42px)"
    fontWeight: 500
    lineHeight: 1.1
    letterSpacing: "-0.035em"
  body:
    fontFamily: "Manrope, Arial, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.65
  label:
    fontFamily: "Manrope, Arial, sans-serif"
    fontSize: "14px"
    fontWeight: 600
    lineHeight: 1.45
  admin-heading:
    fontFamily: "Manrope, Arial, sans-serif"
    fontSize: "28px"
    fontWeight: 700
    letterSpacing: "-0.03em"
  admin-section:
    fontFamily: "Manrope, Arial, sans-serif"
    fontSize: "26px"
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: "-0.025em"
  admin-field:
    fontFamily: "Manrope, Arial, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.5
rounded:
  tab-edge: "5px"
  control: "6px"
  detail-photo: "8px"
  card: "12px"
  dialog: "14px"
  circle: "50%"
  admin-frame: "10px"
spacing:
  xs: "8px"
  sm: "12px"
  md: "16px"
  rail: "18px"
  grid: "20px"
  lg: "24px"
  panel: "28px"
  xl: "32px"
  section-mobile: "56px"
  section-desktop: "84px"
components:
  button-accent:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.white}"
    typography: "{typography.label}"
    rounded: "{rounded.control}"
    padding: "12px 24px"
    height: "46px"
  button-accent-hover:
    backgroundColor: "{colors.accent-hover}"
  button-outline:
    backgroundColor: "#ffffff14"
    textColor: "{colors.white}"
    typography: "{typography.label}"
    rounded: "{rounded.control}"
    padding: "12px 24px"
  button-form:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.control}"
    padding: "12px 24px"
  tab-selected:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.white}"
    padding: "14px 18px"
  card-format:
    backgroundColor: "{colors.tile}"
    textColor: "{colors.ink}"
    rounded: "{rounded.card}"
  field-dark:
    backgroundColor: "#ffffff0a"
    textColor: "{colors.white}"
    rounded: "{rounded.control}"
    padding: "12px"
  dialog-tour:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.dialog}"
    width: "min(1000px, calc(100% - 48px))"
  admin-button:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.white}"
    rounded: "{rounded.control}"
    padding: "11px 18px"
  admin-field:
    backgroundColor: "{colors.white}"
    textColor: "{colors.ink}"
    typography: "{typography.admin-field}"
    rounded: "{rounded.control}"
    padding: "11px 12px"
---

# Design System: Visa Land

## Overview

**Creative North Star: "The Living Travel Journal"**

Visa Land uses neutral paper, medium-weight Manrope, documentary travel imagery, and restrained red actions. Photography carries the atmosphere; quiet surfaces and compact controls keep the travel decision readable.

The public experience is one continuous page with a founder introduction, split photo/text format tiles, a photographic departure rail, a passport banner, and an image-backed application form. Tour details open in a native dialog.

**Key Characteristics:**

- Neutral paper and dark ink with red reserved for selection and action.
- Medium-weight, tightly tracked headings with readable supporting copy.
- Soft rectangular photographs, flat surfaces, and fine dividers.
- Restrained state feedback and explicit control over hero video.

## Colors

The current palette is neutral paper and ink with a restrained red accent. Frontmatter is normative; public styling comes from `dist/landing.css`, replacing earlier `pages.css` directions.

### Primary

- **Travel Red (accent):** Selected format tabs, primary tour actions, open accordion summaries, hover links, carets, and visible focus.
- **Deep Travel Red (accent-hover):** Primary action hover feedback.

### Neutral

- **Paper:** Page, dialog, footer, and light application submit button.
- **Ink:** Main text and light-surface controls.
- **Muted:** Supporting copy, itinerary text, and metadata.
- **Line:** Fine dividers and quiet control borders.
- **Tile / Tab:** Tonal backing for format tiles and unselected format controls.
- **White:** Text and controls over imagery.
- **Form Panel:** Translucent dark field behind the application inputs.

**The Restrained Red Rule.** Red identifies action, selection, or focus; photography supplies the page's broader color.

## Typography

**Display Font:** Manrope, with Arial and sans-serif fallbacks.
**Body Font:** Manrope, with Arial and sans-serif fallbacks.

Use medium-weight headings with tight tracking; inline heading spans step down to regular weight. Body copy has generous leading. Labels and actions use sentence case without forced uppercase tracking.

- **Display:** Hero statement; mobile uses `clamp(38px, 8.5vw, 58px)`.
- **Headline:** Main section headings; format heading uses `clamp(26px, 3vw, 40px)`, visa banner up to 58px.
- **Title:** Split format tiles; departure titles use 28px and 1.14 line height.
- **Body:** General prose; supporting tile and mobile hero copy use 15px. Format descriptions stop at 74ch; hero copy at 48ch.
- **Label:** Compact actions; navigation uses 14px regular weight, with 13px metadata where appropriate.

## Layout

The page order is hero (`#home`), founder introduction (`#about`), formats (`#trips`), calendar (`#calendar`), visa (`#visas`), application (`#contact`). The header links to the primary travel and application anchors. Program, gallery, inclusions, and tour FAQ belong inside the tour dialog.

The main shell and header cap at 1440px. Desktop sections use 5vw horizontal insets and 84px top spacing; the hero has a 24px outer inset. At 1500px and wider, general sections and hero content use 72px horizontal padding. The full hero uses an automatic height with minimum `max(570px, min(76svh, 820px))`; compact mode uses minimum `max(460px, 58svh)`. Long headings and copy grow the hero instead of being clipped. On mobile, full mode has minimum `max(570px, calc(86svh - 68px))`; compact mode has a 500px minimum.

Format tiles use a `.85fr / 1.4fr` copy/photo split and 20px gaps. The calendar shows three photo cards with 18px gaps, two at 1000px and below. The visa directory and application use two columns. Form fields use a two-column grid with full-width rows for supporting controls.

At 700px and below, navigation becomes a paper dropdown beneath the 68px header; content stacks, format photos move above copy at 230px height, and calendar cards occupy 82% of the rail with 12px gaps. General sections use 20px horizontal insets and 56px top spacing. Hero outer insets become 12px, its content aligns low, and the caption disappears. Forms become one column with 16px input text. The dialog narrows to viewport minus 20px, grows to at most 94svh, and stacks its booking controls. Hero media independently switches mobile sources at 600px.

The admin operation surface shares the 1440px shell, with 36px desktop side padding, 24px at 1000px and below, and 16px at 700px and below. Panels use 32px top padding, two-column field grids with 18px gaps, and three-column media grids (two at 1000px, one at 700px). All field grids stack on mobile. Horizontally scrolling tabs remain available at narrow widths; the dark save bar stays sticky at the bottom and wraps its status above actions.

## Elevation & Depth

Surfaces have no authored box shadows. Depth comes from photography, dark readability overlays, translucent form panels, and the native dialog backdrop. The departure image alone scales gently on hover; the card itself stays in place. The dialog's booking bar remains sticky at the bottom while details scroll.

The admin uses the same flat approach: white media and login panels sit against paper with fine borders. Preview frames and the dark sticky save bar establish working context without shadows.

## Shapes

Use soft rectangles: controls and fields use the control radius, main tiles and image-backed sections the card radius, and dialog photos the detail-photo radius. The hero has 2px top corners and 14px bottom corners. The desktop dialog uses the dialog radius, dropping to the card radius on mobile. Circular calendar arrows and dialog close controls remain compact; segmented tabs round only their outside corners.

## Components

### Admin Typography and Tokens

The operation surface keeps fixed Manrope sizes instead of travel display scaling: page title 28px (23px on mobile), panel heading 26px (24px on mobile), subheading 19px, field text 16px, field labels and actions 14px, and hints 13px. Paper, ink, accent, and muted text are shared with the landing page. Admin-specific line, field-border, secondary-surface, and error tokens support dense editing. Admin controls have at least 44px targets; standard fields have a 46px minimum height. Focus uses the accent outline with a 3px offset. Invalid fields add a red border and pale error background.

### Buttons

Red filled buttons use white text; outline buttons use a translucent white fill and border over hero or visa imagery. The application submit uses paper with ink text. Buttons have a 46px minimum height and 200ms color feedback. Disabled buttons retain their position with 35% opacity. Global keyboard focus is a 3px accent outline offset by 5px.

### Founder Introduction

Immediately after the hero, a paper-backed split introduces Gauhar Bekpayeva with a short bio on the left and a documentary group photograph on the right. Columns are equal, separated by 4%, with a 24px top margin and 5vw outer insets. The heading uses `clamp(38px, 4.3vw, 62px)` at weight 600 and 1.02 line height; the image is 360px tall with card-radius corners. At 700px and below, copy precedes the 280px photograph in one column with a 24px gap and 20px insets. The bio and photo retain their admin content hooks; the default photograph is `assets/media/founder-group.jpg`.

### Format Tabs and Tiles

Three equal-width tabs form a centered segmented control, up to 850px wide. Selected tabs are red; inactive tabs are neutral gray and darken on hover. Arrow keys, Home, and End move selection. Below them, a category description precedes split copy/photo tiles; each tile's detail action opens the tour dialog.

### Departure Calendar

Photographic buttons carry date, trip name, duration, and availability over a bottom gradient. Cards have a 420px desktop minimum height and 380px mobile minimum height. Horizontal snapping and circular previous/next controls support browsing; arrows disable at rail boundaries. Photo hover scales to 1.035 over 500ms.

### Inputs / Fields

Visible labels sit above translucent dark fields with white text, fine white borders, and control-radius corners. Fields have a 46px minimum height. Consent uses a native checkbox with the red accent. Submission reports pending, success, or error inline and offers WhatsApp after a failure.

### Navigation

The header sits in normal flow above the hero on paper. The wordmark is bold; navigation is compact and dark. Links become red on hover. The desktop WhatsApp action disappears at 1000px; the mobile menu toggles at 700px, closes after anchor navigation, and supports Escape.

### Visa Banner and Accordions

A passport photograph sits beneath a directional dark overlay and white copy. Below, introductory text pairs with ruled country accordions. Open summaries turn red and their plus mark becomes a minus. Fine rules organize service details.

### Tour Dialog

A native modal dialog contains an image cover, facts, day-by-day program, gallery, inclusions, exclusions, FAQ, and sticky booking action. It caps at 1000px width and 90svh on desktop. Close button, Escape, and backdrop clicks dismiss it; focus returns to the trigger. Booking selects the tour and departure in the application before closing the dialog.

### Hero Media

Default video is `assets/media/torii-loop.mp4`; the real-trip poster is `assets/media/hero-group-japan.jpg`. Saved admin desktop/mobile media and positioning override defaults. The top-right pause/resume control is visible for video unless reduced motion applies. Playback pauses when offscreen, when the document is hidden, on manual pause, and under reduced motion. Photo mode and failed playback retain the poster. No authored cinematic drift is applied. Reduced motion also disables CSS transitions, smooth scrolling, and departure-image hover scaling.

### Admin Workspace

The authenticated editor exposes eight working sections in order: hero, texts and links, photographs, tours, calendar, tour FAQ, draft preview, and leads. Tabs use selected state, a red bottom rule, roving keyboard focus, and Arrow/Home/End navigation. Open content groups use native disclosure rows with plus/minus markers. Tour editors group program days, gallery, inclusions, and publication controls; calendar entries are separate records associated with a tour. Tour FAQ appears in public tour dialogs.

Text and attribute editing follows the explicit shared `dist/site-content.js` schema (180 fields and seven media slots), grouped by page section and searchable by labels and current values. Heading fields accept Enter for line breaks; rendering preserves only safe rich content. Preview editing targets durable field keys and declared media bindings, never positional `nth-child` selectors. Alt-click in the desktop preview locates the matching editor field; mobile users work through the editor sections.

### Admin Hero and Media

Photo/video mode, hero text, shade, and full/compact height are shared across devices. Desktop and mobile photo/video sources and horizontal/vertical crop coordinates are independent. Missing mobile media falls back to the desktop source for that media type. Media cards show a local preview, URL field, file chooser, status, and reset/fallback action. JPEG, PNG, and WebP images accept up to 5 MB; MP4 and WebM videos accept up to 40 MB. Hero uploads validate format, size, and browser decoding before replacing the staged selection.

### Draft Preview and Publication

Preview iframes render the actual landing page with draft content and working tour interactions; draft application forms do not send leads. Desktop preview uses an internal viewport at least 1200px wide and mobile uses 390px. `fitPreviewFrame` scales either viewport to the host width, preserving true desktop composition even when the editor runs on a phone. The hero preview shares this fitting behavior and allows content height to grow.

The sticky save bar reports unsaved, pending, failed, and confirmed states. Files are staged locally until publication; copying or deleting a tour preserves staged media while another tour still references it. Validation opens the relevant editor section and focuses its field. Publication success requires a server-confirmed save, then updates previews and the published-page signal. Authentication or initial-load failures prevent saving defaults over published data. Failed publication retains the current editor draft and file selections for retry; this is an in-session draft, not a promise of persistence after closing the page. Reset uses a confirmation dialog. Existing authentication and storage policies remain the authority for writes.

## Do's and Don'ts

### Do:

- Do use the current neutral paper palette and restrained red actions.
- Do keep the six-section sequence and open tour details in the dialog.
- Do retain readable photographic overlays and visible keyboard focus.
- Do honor saved hero media, pause controls, and reduced-motion preferences.
- Do preserve legible 16px admin fields, 44px minimum control targets, and visible save status.
- Do keep device-specific hero media separate from shared text, shade, and height settings.

### Don't:

- Don't restore obsolete green, terracotta, slate-blue, or multipage styling rules.
- Don't add ambient card shadows, oversized pill controls, or competing display fonts.
- Don't move tour program, gallery, inclusions, or FAQ into separate main-page sections.
- Don't force video playback when reduced motion, manual pause, or page visibility stops it.
- Don't substitute a narrow layout for desktop preview or discard drafts after failed publication.
