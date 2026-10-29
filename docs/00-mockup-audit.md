# Roamy — Mockup Audit

Discovery date: 2026-10-29
Source folder: `/Users/anais/Desktop/Roamy`
Status: complete — design tokens extracted, ambiguities resolved, build can start.

---

## 1. Inventory of mockups

| # | Folder | Files | What it is | Route |
|---|---|---|---|---|
| 1 | `roamy_landing_page_desktop_da_officielle/` | `code.html` (506 lines), `screen.png` (placeholder text `<FIFE Image failed to fetch>`) | Full desktop landing page: header, hero + polaroid collage, yellow ticker band, "Comment ça marche" (3 cards), roadbook preview, pricing (2 tiers), FAQ, final CTA, footer. | `/` |
| 2 | `cr_er_mon_voyage_questionnaire_desktop_da_officielle/` | `code.html` (326 lines), `screen.png` (2560×2528, valid) | Questionnaire screen: striped pink/cream background, decorative flowers, white 880px card, progress header ("Étape 2 sur 6"), big Anton question, destination autocomplete + "Surprends-moi", 4 trending destination polaroids, date fields, traveler steppers, vibe chips, previous/next buttons. | `/planifier` |
| 3 | `mon_itin_raire_r_sultat_voyage_desktop_da_officielle/` | `code.html` (501 lines), `screen.png` (placeholder text `<FIFE Image failed to fetch>`) | Itinerary result: framboise hero with 5-day Barcelona title, PDF CTA, 4 yellow metric pills, yellow ticker band, day tabs, detailed day cards with polaroid photos/timeline/transport, sidebar map, included checklist, budget bars, packing card, final CTA, footer. | `/itineraire/[id]` + static `/itineraire-demo` |
| 4 | `roamy_solar_pop/` | `DESIGN.md` (250 lines) | Stitch design-system brief: "Solar Pop Flat" movement, full M3 color palette, typography scale, spacing, elevation, shapes, components. | design reference |

Mockup folders were left byte-for-byte untouched and copied to `design/mockups/`. The three HTML files are the primary visual source of truth; `DESIGN.md` supplies intent but its color palette sometimes differs from the actual markup (see §7). **Where they disagree, the HTML and the rendered questionnaire screenshot win.**

Screens expected by the product brief but absent from the mockups (extrapolated from the same design language): payment, confirmation/loading, email, PDF, dashboard, legal pages, 404/error.

---

## 2. Design tokens

### 2.1 Colors (actual values found in the mockup HTML)

| Token | Hex | Usage |
|---|---|---|
| `prune` | `#4A0F2E` | All text, outlines, footer background |
| `prune-dark` | `#3B0322` | Footer inset surfaces, deep text |
| `prune-deep` | `#2D081B` | Darkest accents |
| `framboise` | `#D6336C` | Raspberry: how-it-works band, premium card, active chips, itinerary hero |
| `framboise-deep` | `#C2255C` | Hover / final CTA band |
| `framboise-dark` | `#B71656` | Hover states |
| `hotpink` (mockup `blush` in questionnaire) | `#FF4FA3` | Decorative flowers, sticker accents |
| `orange` | `#FA7443` | Primary CTA, progress bar, active icons |
| `orange-deep` | `#E8592A` | Primary hover |
| `butter` | `#FFE99A` | Pills, inactive chips, secondary cards |
| `sun-yellow` | `#FFD93B` | Ticker band, itinerary metric badges, highlights |
| `cream` | `#FAF8F2` | Main page background, nav background |
| `cream-soft` | `#FFF9F2` | Questionnaire page background, polaroid card base |
| `cream-warm` | `#FFF6E0` | Step-1 card, food callout, warm card surfaces |
| `blush` | `#FFE0EA` | Soft pink surfaces, FAQ band, stripes, borders |
| `rose-soft` | `#FFE8EF` | Sidebar blocks, subtle pink fills |
| `rose-tint` | `#FFD9E5` | Borders, time-slot pills, progress track |
| `coral` | `#FF6F61` | Decorative flower |
| `sky-soft` | `#F8B4D9` | Photo fallback tint |
| `surface-card` | `#FFF0F5` | Card alt surface |
| `white` | `#FFFFFF` | Cards only (mockups do use pure white sheets) |

Supporting colors named in the art-direction brief but not present in mockups: mint `#BFEBE3`, periwinkle `#6F7FD6`, cobalt `#2F3FB0`, lavender `#CDB4DB`, leaf `#A8BF8C`. Used only as light step tints so every form step can have its own background.

Contrast rules observed: white text on `framboise`/`orange`; prune text on butter/cream/blush/sun. Muted text is `prune` at 60–80 % opacity. No grey text.

### 2.2 Typography (the mockups are explicit)

- **Display**: **Anton**, weight 400, always uppercase, letter-spacing `0.01em–0.04em`, line-height `0.95–1.15`. Used for headlines, wordmark, big numbers, day titles. The art-direction brief asked for an ultra-rounded groovy font, but the mockups (and `DESIGN.md`) specify Anton and the rendered screenshot is unmistakably Anton. **Anton wins.**
- **Body / UI**: **Nunito Sans** (mockups import `Nunito`, which is metrically nearly identical; we use Nunito Sans), weights 400/600/700/800/900. No script, no handwritten font anywhere.

Type scale (desktop / mobile):

| Role | Size | Line height | Weight |
|---|---|---|---|
| Hero H1 | 88 / 48 | 1.05 / 1.1 | 400 Anton |
| Section H2 | 56 / 36 | 1.1 / 1.15 | 400 Anton |
| Card H3 | 32 / 24 | 1.15 / 1.2 | 400 Anton |
| Form question | 54 / 38 | 1.05 / 1.1 | 400 Anton |
| Itinerary hero | 72 / 40 | 1.05 | 400 Anton |
| Body large | 20 / 18 | 1.4 | 400 |
| Body | 17 / 16 | 1.5 | 400 |
| Label / button | 16 | 1.2 | 800 |
| Caption | 14 / 13 | 1.3 | 600–700 |
| Eyebrow / micro-label | 12 / 11 | 1.3 | 800, uppercase, tracking 0.08em |

### 2.3 Spacing & layout

- Base unit 4px. Scale used: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 96.
- Container: `max-width: 1200px`, horizontal padding 24px desktop / 20px mobile.
- Header height 80px, fixed, cream 95 % + blur, 1px blush border.
- Section vertical rhythm: 96px desktop / 64px mobile (mockup uses `py-24` = 96px).
- Form card: max-width 880px, padding 48px desktop / 32px mobile, radius 40px.
- Grid: 12 columns desktop, 8 tablet, 4 mobile; gap 24px, 32px between major blocks.

### 2.4 Radii

| Token | Value | Usage |
|---|---|---|
| `sm` | 8px | tiny controls |
| `DEFAULT` | 16px | inputs, photos, mini cards |
| `md` | 24px | polaroid cards |
| `lg` | 32px | cards, day articles |
| `xl` | 40–48px | form card, major panels |
| `full` | 9999px | buttons, chips, pills, inputs, progress bars |

### 2.5 Shadows, outlines, borders

- Flat system: almost no shadows. Soft lift only: `0 2px 12px rgba(74,15,46,.06)`; hover `0 8px 24px rgba(74,15,46,.10)` + `translateY(-2px)`.
- Outlines: **2px** solid prune for secondary buttons and ghost controls; **2px** `#FFE0EA` for input rest state; **2px** orange for input focus (no glow).
- Borders: 1px `rgba(74,15,46,.10)` or `rose-tint`. Section dividers are color blocks, not lines.
- Sticker outline: 6–8px cream `#FFF6E0` around die-cut SVG shapes.

### 2.6 Breakpoints

- Mobile: `< 768px` — 20px page padding, single column, stacked CTAs, form card full width.
- Tablet: `768px–1023px` — 32px padding, 2-column where relevant.
- Desktop: `≥ 1024px` — 1200px container; landing hero 7/5 split; itinerary 7/5 split.
- Wide: `≥ 1280px` — same container, larger type.

### 2.7 Motion

- 150–300ms ease. Hover: color shift and/or -2px lift. Press: scale .98.
- Day tabs, accordion, stickers rotate on hover.
- The mockups include an infinite marquee. The brief explicitly forbids marquee; the band is kept but **static** (repeated items, no animation).
- No confetti/parallax. All animation disabled under `prefers-reduced-motion: reduce` (except the confirmation sun spin, reduced to a slow opacity pulse).

---

## 3. Reusable components identified

**Brand / chrome**
- `Logo` — lowercase Anton "roamy" + sun icon.
- `Header` — fixed, desktop nav, FR/EN pill, CTA, avatar, mobile drawer.
- `Footer` — prune, 4 link columns, social circles, giant wordmark.
- `SunIcon`, `FlowerIcon`, `StarIcon` and 10 sticker SVGs.

**Marketing**
- `EyebrowPill` — butter/blush pill with icon.
- `Button` — primary (orange), raspberry, outline, ghost, sizes.
- `Polaroid` — photo + caption, slight rotation, cream frame.
- `ArchPhoto` — arch-masked destination photo.
- `StepCard` — numbered colored card (cream / butter).
- `TickerBand` — static repeated uppercase band + sun.
- `PricingCard` — white or framboise highlighted, sticker badge.
- `Accordion` — Radix, prune/butter, orange plus icon rotates.
- `TestimonialCard` — polaroid-style placeholder.
- `PhoneMockup` — device frame + mini itinerary.
- `Sticker` — die-cut frame with cream stroke, rotation.

**Form**
- `SegmentedProgress` — 6 segments, aria progressbar.
- `StepShell` — per-step background tint, huge question, sticker, microcopy.
- `DestinationCombobox` — ARIA combobox + listbox, 60 curated destinations, free text, keyboard.
- `TrendingDestinationCard` — 4 seasonal polaroids.
- `DateRangePicker` — popover calendar, range, French locale, min today, max 30 days.
- `Counter` — adults / children / babies stepper, min/max, aria-live.
- `BudgetSlider` — range input + 3 preset chips.
- `InterestChip` — multi-select sticker chip.
- `RhythmCard` — radio card with sticker.
- `TextField` / `Textarea` / `Checkbox` — pill inputs, 2px blush outline.
- `FormNav` — Retour + Suivant, sticky on mobile.

**Commerce**
- `BoardingPass` — ticket card with perforation, stub, edit links.
- `PriceSticker` — round rotated sticker.
- `TrustBadgeRow`.
- `CheckoutButton`.

**Itinerary**
- `DayTabs` — pill tabs, ARIA tablist.
- `DayCard` — header, polaroid, period timeline, tip callout.
- `PeriodSlot` — colored time pill + title + description.
- `MapPanel` — stylized map placeholder + Google Maps link.
- `IncludedChecklist`.
- `BudgetBars`.
- `PackingCard`.
- `MetricPill`.
- `Disclaimer`.

**Feedback / system**
- `Toast` (inline notices), `Spinner` / `SpinningSun`, `EmptyState`, `ErrorState`, `NotFound`.
- `LegalPageLayout`.

---

## 4. Assets

### 4.1 Photos found (remote AIDA URLs inside mockups)
All 10 were reachable at audit time and are downloaded into `public/images/` by the build setup:

| File | Subject | Used in |
|---|---|---|
| `hero-calanque.jpg` | turquoise calanque, cliffs | landing hero polaroid 1 |
| `hero-apero.jpg` | two cocktails at sunset | landing hero polaroid 2 |
| `hero-roadtrip.jpg` | friends in a convertible | landing hero polaroid 3 |
| `roadbook-costa-brava.jpg` | whitewashed Catalan village | landing roadbook preview |
| `dest-seville.jpg` | Plaza de España | trending cards + destinations grid |
| `dest-santorini.jpg` | Oia blue domes | trending cards + destinations grid |
| `dest-bali.jpg` | rice terraces | trending cards + destinations grid |
| `dest-split.jpg` | Split harbour | trending cards + destinations grid |
| `day-born.jpg` | El Born alley, Barcelona | itinerary day 1 |
| `day-bogatell.jpg` | Bogatell beach | itinerary day 2 |

No fonts, brand logos, or vector files were supplied. Fonts are downloaded self-hosted (Anton + Nunito Sans) and served through `next/font/local`.

### 4.2 Stickers / illustrations
Present as inline SVG in mockups: 8-ray sun, 4-petal flower, organic hibiscus flower, orange sun with rays. All others must be recreated.

Recreated in `components/stickers/`: sun-with-spiral, sun, palm, fish, hibiscus, lemon, wave, star, shell, shaka hand, surfboard, flower, squiggle. All flat, thick cream outline, slightly rotated, no copyrighted references.

### 4.3 Patterns
- Questionnaire background: vertical stripes, `repeating-linear-gradient(90deg, #FFE0EA 0 48px, #FFF6E0 48px 50px)` — wide blush bands separated by 2px cream lines. Reproduced exactly.
- Itinerary ticker band: flat sun-yellow with 2px border.
- No checkerboard/zigzag used in mockups; only stripes are used.

### 4.4 Missing photos
Testimonial portraits, phone mockup interiors and confirmation illustrations are built from existing photos, gradients and stickers. Anything not sourced is listed in `docs/assets-todo.md` with recommended shot descriptions.

---

## 5. Screen-by-screen notes

### Landing (`/`)
- Header fixed 80px: logo, 4 nav links, FR/EN pill, orange CTA, raspberry avatar.
- Hero 7/5: butter eyebrow pill ("Ton copilote vacances 100% sur-mesure"), Anton H1 **"Ton voyage, planifié pour toi."**, 20px body, orange CTA + prune outline CTA, avatar stack + 5 orange stars + "4.9/5 par plus de 1 200 explorateurs".
- Right: 3 absolutely positioned rotated polaroids (widths 240/256/224), captions lowercase, sun/flower SVGs around.
- Static yellow band: "PACK LIGHT ☀ TRAVEL HAPPY ☀ ROAM FREE".
- Framboise "Comment ça marche": eyebrow "Simplicité totale", 3 cream/butter cards, 14×14 numbered circles, Material-like icons, 360px min height, emoji micro-pills.
- Cream roadbook section: eyebrow, H2, checklist of 3 blush rows with butter icon circles, prune CTA, tilted white PDF card (rotate 2deg) with header, title "Costa Brava Sauvage", photo, 3 day rows.
- Cream-warm pricing: centered heading, 2 cards (Essentiel 9€ white, Premium 19€ framboise with orange "Le plus aimé" sticker).
- FAQ on blush: 4 accordions with framboise/20 dividers, orange plus.
- Final CTA framboise-deep: big sun motif, butter icon circle, Anton H2, trust row.
- Footer prune: 5-column grid, cream text, butter headings, social circles.
- Additions required by the brief that the mockup lacks: destinations arch grid, phone mockup, testimonials. Built in the same visual system.
- The brief's suggested headline "ton voyage, sur mesure." is **not** used; mockup copy wins.

### Questionnaire (`/planifier`)
- Page: `cream-soft` + vertical stripes, 3 decorative SVG flowers/sun at corners.
- White card max 880, radius 40, padding 32/48.
- Header: orange dot + "ÉTAPE X SUR 6 • LABEL" (12px, 800, uppercase, tracking), butter "NN% complété" pill.
- Progress: 16px tall, butter track, orange fill, rounded.
- H1 Anton 54/38 uppercase. Subtitle 18/16.
- Inputs: 56px tall pill, white, 2px blush outline, orange focus, icon left.
- "Surprends-moi !" butter pill with ✨.
- Trending: 4 polaroids, cream-soft, rotate -2/2/-1/3deg, photo radius 16, caption row with name + colored tag.
- Dates: two 56px pill date inputs; flexible checkbox.
- Travelers: two cream-soft pills with label + sublabel and − / + circles.
- Chips: pill 56px tall, butter default, framboise + butter text selected with ★.
- Footer buttons: outline prune "Étape précédente" and orange "Étape suivante : …" with arrow.
- Screenshot shows perfect flat design, no shadow on card, 40px radius, body text at prune/80.
- We split the mockup's combined scroll into focused steps per the brief, preserving these exact controls.

### Itinerary (`/itineraire/[id]`)
- Fixed cream header, active nav in framboise.
- Hero framboise, white H1 with sun-yellow span, rose-soft subtitle, orange PDF button, 4 yellow rounded metric pills with icons.
- Static yellow ticker.
- Cream body, 7/5 grid.
- Left: "SÉLECTIONNER UN JOUR" + date, pill tabs (active framboise), white day cards radius 32, date + theme badges, Anton H2, tilted polaroid, timeline with colored time pills (rose tint morning, orange lunch, framboise evening), butter "Astuce Roamy" callout with orange left border, rose-soft transport block with yellow pill.
- Right: map card (stylized placeholder, address pill + button), included checklist, budget card with 4 colored progress bars and percentages, butter packing card with prune "Pack light !" sticker, final framboise CTA band.
- Footer same as landing but 4px framboise top border.

### Missing screens (designed from the system)
- Payment: boarding-pass/luggage-tag recap on cream/blush, round price sticker, trust badges, Stripe button.
- Confirmation: pink→peach gradient, spinning sun sticker, floating fish/waves, rotating French messages, polling states.
- Email: 600px table, cream body, pink header band, day cards, budget, PDF CTA, disclaimer.
- PDF: A4, framboise cover, Anton headings.
- Dashboard: polaroid cards, magic-link auth.
- Legal/404/error: cream + big Anton, clearly marked placeholder text.

---

## 6. French copy / tone

Casual "tu", short sentences, light humour, no corporate speak. Examples kept from mockups: "Oublie les 42 onglets ouverts", "Zéro piège à touriste", "On goûte les pizzas pour toi…", "Garantie sourire". Buttons are action-first ("Créer mon planning", "Surprends-moi !", "Étape suivante : …"). Errors are friendly, never technical.

---

## 7. Inconsistencies found between mockups

1. **`blush` means two different colors.** Landing: `#FFE0EA` (soft surface). Questionnaire: `#FF4FA3` (hot pink flower). Resolution: two tokens, `blush` = `#FFE0EA`, `hotpink` = `#FF4FA3`. The questionnaire's flower uses hotpink; surfaces use blush.
2. **Cream varies**: `#FAF8F2` (landing), `#FFF9F2` (questionnaire), `#FFF8F8` (design doc). Resolution: `cream` = `#FAF8F2` page, `cream-soft` = `#FFF9F2` form page, `cream-warm` = `#FFF6E0` warm cards.
3. **Orange deep varies**: `#E8592A` vs `#A83909`. Resolution: hover `#E8592A`; deep text/icon `#A83909` if needed.
4. **Radius scale varies** (`lg` = 32px vs 40px; `xl` = 48 vs 40). Resolution: cards 32, major form card 40, hero stickers 48.
5. **Two pricing tiers in mockup, brief says single offer.** Mockup wins: keep Essentiel 9€ and Premium 19€, both selectable. Price constants centralised; checkout supports both.
6. **"3 colored cards" vs brief "4 colored cards".** Mockup wins: 3 cards matching steps.
7. **Marquee in mockup vs "no marquee" animation rule.** Keep the band as a static repeating strip. Documented.
8. **Anton vs brief's "ultra-rounded groovy font".** Mockups and DESIGN.md are explicit: Anton. Use Anton; guarantee no script font.
9. **Questionnaire combined step vs brief's one-question-per-screen.** Use 6 focused steps (destination / dates+travelers / budget / interests / rhythm / identity) inside the same visual shell. This keeps the 6-step progress shown in the mockup and satisfies the brief's app-like flow.
10. **Landing headline differs from brief.** Use "Ton voyage, planifié pour toi." from the mockup.
11. **Dashboard implied but not mocked.** "Retour à mes voyages" and the avatar imply it. Build a minimal `/mes-voyages` with email magic link, flagged as extrapolated.
12. **Landing missing destination grid/phone/testimonials required by brief.** Add them using the existing photos and tokens, clearly in the same style.

---

## 8. Assumptions

- **A1** Target is a marketing site + funnel, fully in French, single locale. The FR/EN pill is decorative for now (FR active); EN is out of scope, documented.
- **A2** Itinerary page is reachable at an unguessable `/itineraire/[id]` (cuid). Email and PDF link to the same id. A static `/itineraire-demo` uses the fixture for landing previews.
- **A3** Photos embedded as remote AIDA URLs are licensed for this project context; we download and self-host them. If the client lacks rights, replace with the shots listed in `docs/assets-todo.md`.
- **A4** Pricing is a product config, not Stripe Prices: 9€ (Essentiel) and 19€ (Premium) per itinerary, shown in EUR. Stripe price IDs can override via env.
- **A5** Budget is entered **per person**; total budget = per-person × travelers. The AI prompt and budget breakdown use the total.
- **A6** Currency is EUR; all generated price estimates are EUR.
- **A7** No real map provider key is supplied. The map card is a stylish static panel with a “Ouvrir dans Google Maps” search link; the data model leaves room for coordinates.
- **A8** Emails are sent from a verified domain in production; in mock mode they are rendered and stored in `EmailLog.previewHtml`, viewable from the confirmation screen.
- **A9** PDFs are stored in the DB as bytes and served from `/api/itineraries/[id]/pdf` so the flow works on serverless hosts without persistent disk.
- **A10** Dashboard authentication uses a single-use magic-link token stored in the DB and a signed HttpOnly cookie; no passwords.
- **A11** Legal text is placeholder and marked "À COMPLÉTER" — not legal advice.
- **A12** Rate limiting is in-memory (per instance). Documented as sufficient for local/small deployments, to be swapped for Upstash/Redis in production.
