---
name: Roamy Solar Pop
colors:
  surface: '#fff8f8'
  surface-dim: '#ffcddf'
  surface-bright: '#fff8f8'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#fff0f3'
  surface-container: '#ffe8ef'
  surface-container-high: '#ffe0ea'
  surface-container-highest: '#ffd9e5'
  on-surface: '#3b0322'
  on-surface-variant: '#58423a'
  inverse-surface: '#561938'
  inverse-on-surface: '#ffecf1'
  outline: '#8c7169'
  outline-variant: '#dfc0b6'
  surface-tint: '#a83909'
  primary: '#a83909'
  on-primary: '#ffffff'
  primary-container: '#fa7443'
  on-primary-container: '#621b00'
  inverse-primary: '#ffb59c'
  secondary: '#b71656'
  on-secondary: '#ffffff'
  secondary-container: '#ff538a'
  on-secondary-container: '#5e0027'
  tertiary: '#705d00'
  on-tertiary: '#ffffff'
  tertiary-container: '#caa900'
  on-tertiary-container: '#4c3e00'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdbcf'
  primary-fixed-dim: '#ffb59c'
  on-primary-fixed: '#390c00'
  on-primary-fixed-variant: '#822700'
  secondary-fixed: '#ffd9df'
  secondary-fixed-dim: '#ffb1c2'
  on-secondary-fixed: '#3f0018'
  on-secondary-fixed-variant: '#8f0040'
  tertiary-fixed: '#ffe173'
  tertiary-fixed-dim: '#e8c423'
  on-tertiary-fixed: '#221b00'
  on-tertiary-fixed-variant: '#554600'
  background: '#fff8f8'
  on-background: '#3b0322'
  surface-variant: '#ffd9e5'
typography:
  headline-xl:
    fontFamily: Anton
    fontSize: 56px
    fontWeight: '400'
    lineHeight: 64px
    letterSpacing: 0.04em
  headline-xl-mobile:
    fontFamily: Anton
    fontSize: 38px
    fontWeight: '400'
    lineHeight: 44px
    letterSpacing: 0.03em
  headline-lg:
    fontFamily: Anton
    fontSize: 40px
    fontWeight: '400'
    lineHeight: 48px
    letterSpacing: 0.03em
  headline-lg-mobile:
    fontFamily: Anton
    fontSize: 30px
    fontWeight: '400'
    lineHeight: 36px
    letterSpacing: 0.02em
  headline-md:
    fontFamily: Anton
    fontSize: 28px
    fontWeight: '400'
    lineHeight: 34px
    letterSpacing: 0.02em
  headline-sm:
    fontFamily: Anton
    fontSize: 22px
    fontWeight: '400'
    lineHeight: 28px
    letterSpacing: 0.02em
  title-md:
    fontFamily: Nunito Sans
    fontSize: 18px
    fontWeight: '700'
    lineHeight: 26px
  title-sm:
    fontFamily: Nunito Sans
    fontSize: 16px
    fontWeight: '700'
    lineHeight: 24px
  body-lg:
    fontFamily: Nunito Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Nunito Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Nunito Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-lg:
    fontFamily: Nunito Sans
    fontSize: 14px
    fontWeight: '800'
    lineHeight: 20px
    letterSpacing: 0.02em
  label-md:
    fontFamily: Nunito Sans
    fontSize: 12px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Nunito Sans
    fontSize: 10px
    fontWeight: '800'
    lineHeight: 14px
    letterSpacing: 0.04em
rounded:
  sm: 0.5rem
  DEFAULT: 1rem
  md: 1.5rem
  lg: 2rem
  xl: 3rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-sm: 1rem
  margin: 2rem
  margin-sm: 1.25rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

This design system channels an effervescent, sun-drenched European summer holiday. It is built around high-energy optimism, convivial gatherings, and effortless warmth. Balancing the structural punch of retro poster display typography with pillowy, organic soft curves, the aesthetic creates a welcoming, vibrant atmosphere without tipping into chaotic excess.

### Design Movement: Solar Pop Flat
- **Flat Graphic Clarity**: No heavy dropshadows, hyper-realistic skeuomorphism, or artificial blurred glows. Hierarchy is defined purely through saturated tonal blocks, intentional spacing, and crisp contrast.
- **Organic Pill Geometry**: Hyper-curved containers, generous internal paddings, and friendly pill structures soften dense travel and booking interfaces.
- **Sun-Soaked Vibrancy**: Warm cream canvases punctuated by vibrant vitamin orange, crisp raspberry punch, and sunbeam yellow, anchored by deep plum text rather than harsh neutral black.

## Colors

The palette radiates summer sunshine, using warm pastry tones as canvas foundations and fruit-punch saturated highlights for actionable focal points. 

### Palette Architecture
- **Primary (`#FA7443`)**: Sunkissed Vitamin Orange. Used for primary calls to action, high-energy interactive touchpoints, and active selection indicators.
- **Secondary (`#D6336C`)**: Raspberry Pink. Used for secondary actions, celebratory badges, tags, and vibrant contrasting elements against warm surfaces.
- **Tertiary (`#FFD93B`)**: Radiant Sun Yellow. Used for rating markers, highlight chips, active warning accents, and playful background fills.
- **Neutral Deep Plum (`#4A0F2E`)**: Replaces standard black/dark charcoal across all typographic weights, iconography, and structural line dividers. Retains softness while providing accessible contrast.
- **Supporting Surface Tones**:
  - Warm Butter Cream (`#FFF6E0`): Primary application canvas and base card backgrounds.
  - Soft Milk Cream (`#FAF8F2`): Elevated sub-surfaces and input fields.
  - Raspberry Blush (`#FFE0EA`): Subtle tinted pill containers, active indicator trackfills, and secondary pill chips.
  - Soft Sun Butter (`#FFE99A`): Tertiary interactive states and highlight card layers.

### Contrast & State Rules
- Text over primary (`#FA7443`) and secondary (`#D6336C`) surfaces must be clean white (`#FFFFFF`) or off-white (`#FFF6E0`).
- Text over tertiary yellow (`#FFD93B`) and all cream tints must utilize Plum (`#4A0F2E`).
- Dividers and borders rely on 10% opacity plum overlays or explicit blush fills rather than cold grays.

## Typography

Typography establishes an energetic dialogue between two complementary extremes: commanding, high-impact condensed headlines and rounded, humanistic body copy.

### Display Roles (Anton)
- Render all headlines using **Anton** in uppercase (`text-transform: uppercase`) to preserve a rhythmic, posterized festival layout.
- Apply a slight positive letter-spacing (`0.02em` to `0.04em`) to display sizes to ensure character separation at condensed widths.
- Never use Anton for interactive buttons or paragraphs; restrict it exclusively to punchy section headers and billboard numbers.

### Content & Functional Roles (Nunito Sans)
- All structural reading copy, forms, button labels, and captions use **Nunito Sans**.
- Use weight `700` and `800` for compact labels and button text to mirror the visual weight of the headlines without compromising legibility.
- Line heights for body typography are tuned to `1.5x` to ensure open, breathy text blocks against warm cream backgrounds.

## Layout & Spacing

Layouts are spacious, sunny, and rhythmic, prioritizing generous negative space to let bold colors breathe without overwhelming the eye.

### Grid & Breakpoints
- **Mobile (< 768px)**: 4-column fluid layout with `margin-sm` (1.25rem / 20px) outer edge padding and `gutter-sm` (1rem / 16px) column gaps.
- **Tablet (768px - 1024px)**: 8-column layout with 1.5rem margins and 1.25rem gutters.
- **Desktop (> 1024px)**: 12-column layout with a maximum container boundary of `1200px`, centered with `margin` (2rem / 32px) margins and `gutter` (1.5rem / 24px) column spacing.

### Rhythm & Component Spacing
- Structural containers use generous inner padding (`space-lg` to `space-xl`) to accommodate the heavy corner curvature.
- Stacked form fields and list items maintain a baseline rhythm using `space-md` (16px) or `space-sm` (8px) for tightly grouped child items.

## Elevation & Depth

This system operates entirely under a **flat, tonal-layering philosophy**. Diffused drop shadows and blurred skeuomorphic elevations are strictly avoided in favor of colored surfaces, high contrast, and structural nesting.

### Tonal Hierarchy
1. **Base Surface (Ground 0)**: Warm Butter Cream (`#FFF6E0`) represents the canvas background of screens and large pages.
2. **Elevated Containers (Ground 1)**: White (`#FFFFFF`) or Soft Cream (`#FAF8F2`) sheets layered atop Ground 0. Depth is communicated strictly by the color step between cream and white.
3. **Accent Framing & Tonal Islands**: Tinted surfaces like Raspberry Blush (`#FFE0EA`) and Sun Butter (`#FFE99A`) are used to group metadata and sub-cards inside parent sheets.
4. **Interactive Hover & Press**: Interactive elements convey depth through crisp state color changes (e.g., orange shifting to vibrant punch, or subtle plum tint overlays) or distinct 2px solid plum hairline offsets rather than drop shadows.

## Shapes

The shape vocabulary is defined by **Pill-shaped (level 3)** roundedness, maximizing friendliness and tactile comfort.

### Radius Conventions
- **Buttons, Tags, Chips, and Form Inputs**: Fully rounded pill shapes (`border-radius: 9999px`).
- **Cards & Surface Sheets**: Large rounded corners (`rounded-lg: 2rem` / 32px; `rounded-xl: 3rem` / 48px). This dramatic curvature counterbalances Anton's rigid vertical letterforms.
- **Modals & Drawers**: Upper-edge radiuses use `rounded-xl` (48px) to establish a distinct, organic sheet appearance.

## Components

### Buttons
- **Primary Button**: Solid Sunkissed Orange (`#FA7443`) background, `#FFFFFF` text in uppercase Nunito Sans (`weight: 800`), pill radius (`9999px`). Padding: `14px 28px`. Hover: Raspberry Pink (`#D6336C`). No drop shadows.
- **Secondary Button**: Solid Raspberry Pink (`#D6336C`) background with white text, or Raspberry Blush (`#FFE0EA`) with Deep Plum (`#4A0F2E`) text.
- **Ghost/Tertiary Button**: Transparent background, Deep Plum (`#4A0F2E`) bold text, subtle cream hover fill (`#FAF8F2`).

### Chips & Badges
- **Status & Filter Chips**: Fully pill-shaped with `6px 14px` padding. Default state uses Soft Milk Cream (`#FAF8F2`) with plum text. Active state transitions to Sun Yellow (`#FFD93B`) or Sunkissed Orange (`#FA7443`) with plum or white text.
- **Notification Badges**: Tiny circular or pill tags filled with Raspberry Pink (`#D6336C`) and crisp white typography.

### Form Inputs & Selectors
- **Input Fields**: Cream background (`#FAF8F2`), Deep Plum text (`#4A0F2E`), enclosed by a pill radius (`9999px`) with generous horizontal padding (`20px`). Placeholder text set in 50% opacity plum.
- **Focused State**: Solid 2px outline in Sunkissed Orange (`#FA7443`). No blurred glow.

### Checkboxes & Radio Buttons
- **Checkboxes**: Squircle design (`radius: 8px`), Deep Plum border (2px) on soft cream base. Checked state fills with Sunkissed Orange (`#FA7443`) with a clean white check icon.
- **Radio Controls**: Outer pill circle, inside indicator fills with a concentric dot in Raspberry Pink (`#D6336C`).

### Cards & Tiles
- **Base Cards**: White or Soft Cream containers with large `2rem` (32px) corner radii. Padding is `space-lg` (24px).
- **Hero/Highlight Cards**: Sunkissed Orange or Sun Butter backgrounds paired with Anton uppercase headlines, creating a poster-style block.
- **Dividers**: Replaced by background color shifts or subtle 1px rules in 8% opacity Plum (`#4A0F2E`).

### Navigation & Tab Bars
- **Bottom Navigation / Floating Island**: Floating pill container centered on screen with Soft Milk Cream (`#FAF8F2`) background and a 2px Plum border or high-contrast edge. Active items highlighted with a solid Raspberry Blush (`#FFE0EA`) or Sun Yellow (`#FFD93B`) pill capsule.