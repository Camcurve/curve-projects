# Curve — Complete Brand System

> Feed this entire document to Google Stitch or any AI design tool to reproduce the Curve brand accurately.

---

## 1. Brand Identity

**Company:** Curve
**Category:** YouTube strategy and creative direction agency
**Positioning:** We help creators and brands become top 1% on YouTube, with strategies that 2x growth before you even press record.
**Tagline options:** "Validated systems for YouTube growth" / "YouTube strategy to make bangers"
**Audience:** YouTube creators (100K–10M subs) and brands investing in YouTube as a growth channel
**Tone:** Operator-level confidence. Direct, no fluff. Sounds like someone who has actually run these plays — not a consultant. Blunt, specific, high-conviction.

---

## 2. Color Tokens

### Core Palette

| Token | Hex | RGB | Usage |
|---|---|---|---|
| `background` | `#131313` | 19, 19, 19 | Page background, dark surfaces |
| `primary` (accent) | `#FF5F00` | 255, 95, 0 | CTAs, eyebrows, underlines, icons, highlights |
| `primary-light` | `#ff8c4a` | 255, 140, 74 | CTA gradients, hover states |
| `foreground` | `#E5E2E1` | 229, 226, 225 | Headings, primary text |
| `foreground-muted` | `rgba(229,226,225,0.6)` | — | Body copy, secondary text |
| `foreground-faint` | `rgba(229,226,225,0.4)` | — | Labels, captions, meta |
| `secondary-text` | `#c8c6c5` | 200, 198, 197 | Subtext, descriptions |

### Surface Palette

| Token | Hex / Value | Usage |
|---|---|---|
| `surface` | `#131313` | Base dark surface |
| `surface-low` | `#1c1b1b` | Slightly elevated surface |
| `surface-container` | `#201f1f` | Cards, panels |
| `surface-high` | `#2a2a2a` | Hover states on cards |
| `surface-highest` | `#353534` | Borders, dividers |
| `surface-bright` | `#3a3939` | Active states |
| `card-surface` | `rgba(255,255,255,0.04)` | Stat boxes, pill backgrounds |
| `card-border` | `rgba(255,255,255,0.09)` | Card and box borders |

### Gradient Recipes

| Name | Value | Usage |
|---|---|---|
| CTA gradient | `linear-gradient(135deg, #FF5F00 0%, #ff8c4a 100%)` | Primary buttons |
| Hero text gradient | `linear-gradient(to bottom right, #ffb599, #ff5f00)` | Gradient text accents |
| Orange circle | `linear-gradient(145deg, #ff8c4a 0%, #FF5F00 45%, #cc3d00 100%)` | Brand illustration orb |
| Page fade top | `linear-gradient(to bottom, #131313 0%, rgba(19,19,19,0) 100%)` | Section bleed edges |
| Page fade bottom | `linear-gradient(to top, #131313 0%, rgba(19,19,19,0) 100%)` | Section bleed edges |
| Ambient glow | `radial-gradient(ellipse 70% 50% at 50% 65%, rgba(255,95,0,0.22) 0%, transparent 70%)` | Behind feature cards |
| Orange glow shadow | `0 0 120px 40px rgba(255,95,0,0.28), 0 0 260px 80px rgba(255,95,0,0.10)` | Brand orb glow |

---

## 3. Typography

### Typefaces

| Role | Family | Source | Weights Used |
|---|---|---|---|
| **Display / Editorial** | Cormorant Garamond | Google Fonts | 400 (regular), 600 (semibold), 600 italic |
| **UI / Body / Labels** | Cabinet Grotesk | Fontshare API | 400, 500, 600, 700, 800 |

### Type Scale

| Element | Font | Size | Weight | Letter-spacing | Line-height | Color |
|---|---|---|---|---|---|---|
| H1 hero | Cormorant Garamond | `clamp(2.4rem, 7vw, 5.5rem)` | 400 | `-0.02em` | 1.1 | `#E5E2E1` |
| H2 section | Cormorant Garamond | `clamp(1.9rem, 2.8vw, 2.65rem)` | 600 | `-0.02em` | 1.12 | `#E5E2E1` |
| H2 large | Cormorant Garamond | `clamp(2.2rem, 4.5vw, 4rem)` | 600 | `-0.02em` | 1.08 | `#E5E2E1` |
| H2 statement | Cormorant Garamond | `clamp(2.8rem, 5.5vw, 5rem)` | 600 | `-0.025em` | 1.08 | `#E5E2E1` |
| Body | Cabinet Grotesk | `0.97rem` | 400 | normal | 1.78 | `rgba(229,226,225,0.6)` |
| Body large | Cabinet Grotesk | `1.2rem` | 400 | normal | relaxed | `#c8c6c5` |
| Eyebrow / Label | Cabinet Grotesk | `0.62rem` | 600 | `0.18em` | — | `#FF5F00` |
| Caption / Meta | Cabinet Grotesk | `0.58rem–0.7rem` | 600 | `0.11–0.2em` | — | `rgba(229,226,225,0.4)` |
| Stat numeral | Cormorant Garamond | `2.2rem` | 600 | normal | 1 | `#E5E2E1` |
| Nav link | Cabinet Grotesk | `0.875rem` | 500 | normal | — | `#E5E2E1` |

### Typography Rules
- All uppercase text uses Cabinet Grotesk, never Cormorant
- Cormorant Garamond is exclusively for headings, display, stat numerals
- Negative letter-spacing (`-0.02em`) on all Cormorant headings
- Eyebrows are always: uppercase · Cabinet Grotesk 600 · `0.18em` tracking · orange (`#FF5F00`)
- Body copy line-height is always `1.78` for readability at small sizes

---

## 4. Spacing System

| Token | Value | Usage |
|---|---|---|
| Section padding vertical | `8rem 0 7rem` | Standard section top/bottom |
| Section padding large | `clamp(1rem,3vw,2rem) 0 85vh` | Extended sections with scroll room |
| Content max-width | `860px` | Centered text content |
| Content max-width wide | `1200px` | Full-width sections |
| Card padding | `1rem 1.2rem` | Stat boxes, small cards |
| Card gap | `0.6rem` | Stat grid gap |
| Pill gap | `0.45rem` | Tag/skill pill gap |
| Section margin-bottom (H2) | `1.4rem` | Below headings |
| Body paragraph margin | `0.9rem` | Between body paragraphs |
| Final paragraph margin | `2.2rem` | Last paragraph before next element |

---

## 5. Border Radius

| Context | Value |
|---|---|
| Cards (testimonials, feature) | `18px–24px` |
| Stat boxes | `14px` |
| Buttons (pill) | `9999px` (fully rounded) |
| Skill/tag pills | `9999px` (fully rounded) |
| Avatar circles | `50%` |
| Client circles | `50%` |

---

## 6. Elevation & Shadows

| Element | Shadow |
|---|---|
| Primary CTA (rest) | `0 0 0 0 rgba(255,95,0,0.5)` |
| Primary CTA (hover) | `0 0 32px 8px rgba(255,95,0,0.35), 0 4px 20px rgba(255,95,0,0.3)` |
| Testimonial card (front) | `0 32px 80px rgba(0,0,0,0.55), 0 8px 24px rgba(0,0,0,0.35)` |
| Testimonial card (mid) | `0 24px 60px rgba(0,0,0,0.45), 0 6px 18px rgba(0,0,0,0.3)` |
| Testimonial card (back) | `0 16px 40px rgba(0,0,0,0.35), 0 4px 12px rgba(0,0,0,0.25)` |
| Orange orb ambient | `0 0 120px 40px rgba(255,95,0,0.28), 0 0 260px 80px rgba(255,95,0,0.10)` |

---

## 7. Component Patterns

### Primary Button
- Shape: pill (`border-radius: 9999px`)
- Background: `linear-gradient(135deg, #FF5F00 0%, #ff8c4a 100%)`
- Text: white, Cabinet Grotesk 700, `0.95rem`, `-0.01em` tracking
- Padding: `px-7 py-3.5` (28px / 14px)
- Hover: `scale(1.03)` + orange glow shadow
- Active: `scale(0.97)`

### Secondary Button (Ghost)
- Shape: pill
- Background: `rgba(255,255,255,0.06)`
- Border: `1px solid rgba(255,255,255,0.12)`
- Text: `#E5E2E1`, Cabinet Grotesk 600
- Hover: `rgba(255,255,255,0.1)` background

### Eyebrow Label
- Pattern: `● TEXT IN CAPS`
- Orange dot (`#FF5F00`) + uppercase text
- Cabinet Grotesk 600, `0.62rem`, `0.18em` tracking
- Always precedes a section heading

### Stat Box
- Background: `rgba(255,255,255,0.04)`
- Border: `1px solid rgba(255,255,255,0.09)`
- Border-radius: `14px`
- Numeral: Cormorant Garamond 600, `2.2rem`, `#E5E2E1`
- Label: Cabinet Grotesk 600, `0.58rem`, uppercase, `0.11em` tracking, `rgba(229,226,225,0.4)`

### Skill / Tag Pill
- Background: `rgba(255,255,255,0.06)`
- Border: `1px solid rgba(255,255,255,0.1)`
- Border-radius: `9999px`
- Text: Cabinet Grotesk 500, `0.78rem`, `#E5E2E1`
- Padding: `0.35rem 0.9rem`

### Testimonial Card
- Background: white (`#ffffff`)
- Border-radius: `20–24px`
- Aspect ratio: portrait, ~320×420px
- Contains: thumbnail image (full bleed top), creator name, video title, view count, channel avatar
- Stack: 4 cards fanned with GSAP scroll-driven animation

### Client Avatar Circle
- Shape: perfect circle, `50%` border-radius
- Sizes: `clamp(80px,10vw,130px)`
- Presented in a horizontal row, centered
- Bottom feather: gradient fade into page background

### Navigation Bar
- Background: `rgba(19,19,19,0.85)` + `backdrop-filter: blur(12px)`
- Border-bottom: `1px solid rgba(255,255,255,0.07)`
- Logo: "curve" wordmark, white, Cabinet Grotesk 800 or custom
- Links: Cabinet Grotesk 500, `0.875rem`
- CTA: orange pill button (same as Primary Button)

---

## 8. Iconography & Illustration

### Brand Mark
- Name: **curve** (always lowercase)
- Wordmark only — no icon mark

### Decorative Elements
- **Orange circle orb:** Large (up to `680px`), bleeds off left edge of sections. Represents energy, warmth, the brand's "sun." Always uses the orange gradient + ambient glow.
- **Hand-drawn orange underline/circle:** SVG path stroked in `#FF5F00`, `stroke-width: 5`, `stroke-linecap: round`. Used on key words in headings to draw attention.
- **Green arrow icons:** Circle-arrow SVG (`fill: #4ADE80`), used as floating bubble elements in the hero. Represent YouTube/growth direction.
- **Monogram "C":** Inside the brand orb as a watermark — Cormorant Garamond 600, `rgba(255,255,255,0.14)`, large scale.

### Photography / Imagery Style
- YouTube thumbnail style: bold, high-contrast, face-forward
- Real client work — no stock photography
- Thumbnails are shown inside white polaroid-style cards
- Client avatars: real faces, circular crop

---

## 9. Motion & Animation

### Core Principles
- **Scroll-driven only** (GSAP ScrollTrigger + Lenis smooth scroll)
- No decorative looping animations except hero background elements
- Everything reveals on scroll — nothing auto-plays in a distracting way
- Smooth, deliberate, premium feel — never bouncy or playful

### Reveal Pattern (standard)
```
from: { y: 20–40, opacity: 0 }
to:   { y: 0, opacity: 1 }
ease: 'none' (on scrubbed timelines)
scrub: 1.2–1.8
```

### Interaction Responses
```
hover scale:  1.03
active scale: 0.97
ease: expo.out
duration: 0.6–0.75s
```

### Pinned Scroll Sections
- Long-form content (e.g. founders bio) uses GSAP pin — section stays fixed while content reveals beat-by-beat
- One scroll beat = one content reveal
- `end: '+=220%'` for 3-beat reveals

### Card Fan Animation
- Cards start stacked, fan out on scroll
- Click any card to bring to front
- `scrub: 1.8`, `ease: 'none'` on all fromTo tweens
- `pos = ((dataIndex - active) % total + total) % total` — active card always fans to front position

---

## 10. Layout Patterns

### Hero Section
- Full viewport height
- Centered text layout (max-width ~900px, centered)
- Eyebrow → H1 → subtitle → CTA row
- Background: dark base with ambient orange radial glow
- Floating SVG arrow elements behind all content (z-index: 0)

### Split Section (Founders)
- Left: large decorative element (orange orb, bleeds off edge)
- Right: text content pushed past center (`margin-left: ~50%`)
- Text column: `max-width: 580px`
- Eyebrow → H2 → body paragraphs (pinned scroll reveal) → stats grid → skill pills

### Centered Section (Testimonials, Clients)
- Max-width centered container
- Eyebrow → H2 → primary content
- `text-align: center` for headings
- Content below can be left-aligned or card-based

### Feature Row (Frameworks / Process)
- Wheel/radial visual centered
- Supporting text below
- Fades in on scroll

### Section Bleeds
- Top feather: `linear-gradient(to bottom, #131313, transparent)` — `height: 120px`
- Bottom feather: `linear-gradient(to top, #131313, transparent)` — `height: 120px`
- Used on any section that needs to melt into adjacent dark sections

---

## 11. Voice & Copy Patterns

### Sentence Structures
- Short. Direct. No throat-clearing.
- Lead with the outcome, not the process
- Use "you" and "your channel" — always client-facing
- Numbers and specifics over vague claims: "40,000 to one million" not "massive growth"

### Eyebrow Labels (ALL CAPS)
Examples from the site:
- `YOUTUBE STRATEGY TO MAKE BANGERS.`
- `CAMERON & AYLA`
- `OUR SKILL SETS`
- `TRUSTED BY`

### Heading Style
- Cormorant Garamond gives an editorial, magazine-quality feel
- Headings end with a period for finality
- Mix of question and statement forms

### CTA Copy
- Primary: "Work with us →"
- Secondary: "See the results"
- Avoid: "Learn more", "Get started", "Sign up"

---

## 12. Do / Don't

| Do | Don't |
|---|---|
| Dark backgrounds only | Light mode or white backgrounds |
| Cormorant for headings | System fonts or sans-serif headings |
| Orange (`#FF5F00`) as the sole accent | Multiple accent colors |
| Real client thumbnails | Generic stock imagery |
| Specific numbers and outcomes | Vague social proof |
| Scroll-driven reveals | Auto-playing carousels |
| Blunt, direct copy | Buzzword-heavy marketing speak |
| Pill-shaped buttons | Square or slightly-rounded buttons |
| Muted body text at 60% opacity | Full-white body text (too harsh on dark bg) |
| Orange dot eyebrows | Plain text section labels |

---

## 13. Quick-Reference Cheat Sheet

```
BRAND:        Curve — YouTube strategy agency
DARK BG:      #131313
ACCENT:       #FF5F00
HEADING:      Cormorant Garamond 600, -0.02em tracking
BODY:         Cabinet Grotesk 400, 1.78 line-height
BODY COLOR:   rgba(229,226,225,0.6)
HEADING COLOR:#E5E2E1
EYEBROW:      Cabinet Grotesk 600 / uppercase / 0.18em tracking / #FF5F00
BUTTON:       Pill shape / linear-gradient(135deg, #FF5F00, #ff8c4a) / white text
CARD:         White bg / 20-24px radius / real thumbnail imagery
MOTION:       GSAP + Lenis / scroll-scrubbed / ease:none / reveal on scroll
VIBE:         Premium editorial. Dark. Confident. No fluff.
```
