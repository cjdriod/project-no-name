# Design System & UX Specification

> A calm, professional, distraction-free technical portfolio.
> Optimized for recruiters, hiring managers, and technical interviewers who need to evaluate engineering work quickly and comfortably.

---

## 1. Design Vision

This portfolio is a **reading instrument**, not a showcase of visual effects. When a recruiter opens any page, the first impression must be: *"This person is thoughtful, precise, and easy to work with."*

The experience should feel like a well-typeset technical book crossed with the documentation sites of Stripe, Vercel, and Apple — quiet, confident, and content-first.

### Guiding Principles

| Principle | What it means in practice |
| --- | --- |
| **Minimalism over decoration** | Every element earns its place. No ornaments, no filler graphics. |
| **Readability first** | Typography, line length, and spacing are the primary design tools. |
| **Calm visual hierarchy** | Contrast is achieved through space and weight, not color or size extremes. |
| **Generous whitespace** | Whitespace is the layout — it guides the eye and paces the reading. |
| **Fast loading** | Static-first, minimal JS, system-quality fonts. Sub-second perceived load. |
| **Accessibility-first** | WCAG 2.1 AA is a baseline requirement, not a later fix. |
| **Responsive everywhere** | One content model that reflows gracefully from phone to ultra-wide. |
| **Subtle interactions** | Motion confirms intent; it never entertains. |
| **Content-first** | Never animate before content is legible. Never decorate before content is complete. |

### Explicitly Avoided

- ❌ Heavy gradients or gradient text
- ❌ Glassmorphism / blur-heavy panels
- ❌ Parallax, scroll-jacking, bounce, spin
- ❌ Busy backgrounds, noise textures, animated blobs
- ❌ Flashy "portfolio-trend" hero animations
- ❌ Autoplaying media

### Emotional Target

> Calm · Professional · Trustworthy · Mature · Modern · Elegant · Engineering-focused · Content-first

---

## 2. Information Architecture

```
/                → Home
/about           → About
/projects        → Projects (filterable index)
/projects/[slug] → Project detail (case study)
/resume          → Concise résumé (1-page, ATS-friendly) + PDF download
/cv              → Full CV (comprehensive experience timeline) + PDF download
/contact         → Contact
```

### 2.1 Home

| Section | Purpose | Notes |
| --- | --- | --- |
| Hero introduction | Name, headline, one-line value proposition, **single profile picture or illustration** | One image only — a portrait photo or a simple illustration. Text-led layout; image supports, never dominates. No carousel, no animation. |
| Professional summary | 2–3 sentence positioning statement | Prose, generous line height. |
| Current role | Company, title, dates | Compact, factual. |
| Tech stack | Primary technologies | Tag row, muted. |
| Featured projects | 2–3 curated case studies | Project cards. |
| Latest articles *(optional)* | Recent writing | Hidden if empty. |
| Contact CTA | Single, clear call to action | One primary button. |

### 2.2 About

Personal introduction · Career journey · Engineering philosophy · Interests · Education · Certifications.
Long-form, reading-optimized single column.

### 2.3 Projects

Filterable index → detail pages.

**Filters:** `Frontend` · `Backend` · `Full Stack` · `Mobile` · `Open Source` · `AI` · `DevOps`

**Each project detail includes:** Cover image · Description · Tech stack · Architecture overview · Challenges · Solutions · Lessons learned · GitHub link · Live demo · Screenshots.

### 2.4 Résumé

The **concise, recruiter-first** view — targets a single printed page.

Summary · Selected experience (most recent/relevant only) · Core skills · Education · Certifications · Languages · **Download PDF** button · **Print** button.

Content is trimmed for scannability; it links to `/cv` for the full history. This page is the primary **ATS/print target** — see **§10.1 Print & CV Export**.

### 2.5 CV

The **comprehensive** view — the full professional record, no page limit.

Vertical experience timeline. Each entry: **Company · Position · Duration · Responsibilities · Technologies · Key achievements.**
On desktop the spine sits left; below `lg` it collapses to a single left rail.

Also includes: complete education, all certifications, publications/talks *(optional)*, and full skills breakdown · **Download PDF** button · **Print** button.
Print output follows the same rules as the résumé (see §10.1), adapted to multi-page length.

### 2.6 Contact

Email · GitHub · LinkedIn · Twitter/X *(optional)* · Contact form.
Minimal fields: name, email, message.

---

## 3. Reading Experience *(the core of the design)*

Everything else serves this section. The site is judged on how comfortable it is to read for 5–10 minutes.

| Attribute | Recommendation | Rationale |
| --- | --- | --- |
| **Measure (line length)** | 60–75 characters (`~65ch` target) | Optimal for sustained reading. |
| **Prose container** | `max-width: 680px` (`--container-prose`) | Enforces the measure on any viewport. |
| **Body line height** | `1.7` for prose, `1.5` for UI | Loose enough to breathe, tight enough to group. |
| **Paragraph spacing** | `1em`–`1.25em` between paragraphs | Clear separation without gaps that break flow. |
| **Section spacing** | `4rem`–`6rem` between major sections | Whitespace signals structure. |
| **Page margins (mobile)** | `20px`–`24px` gutters | Never let text touch the edge. |
| **Heading rhythm** | `margin-top` > `margin-bottom` (e.g. `2.5em` / `0.75em`) | Headings attach to the text below them. |
| **Max prose block** | One idea per paragraph, 3–5 sentences | Scannable for busy reviewers. |
| **Focus** | Single-column reading; no sidebars during long-form | Removes competition for attention. |

### Reading Rhythm Checklist
- Body text never exceeds ~75 characters per line.
- Only **one** accent color appears per screen of reading.
- Links are underlined or clearly weighted — never color-only.
- Code blocks and tables are full-measure but visually quiet.
- No element animates while the reader is mid-paragraph.

---

## 4. Layout System

### 4.1 Containers

| Token | Width | Use |
| --- | --- | --- |
| `--container-prose` | `680px` | Long-form reading (About, project bodies). |
| `--container-content` | `960px` | Standard pages, timeline, cards. |
| `--container-wide` | `1200px` | Project grid, home sections. |
| `--container-full` | `100%` (with gutters) | Full-bleed backgrounds only. |

Containers are centered with responsive horizontal padding (the gutter), never flush to the viewport edge.

### 4.2 Grid

- **12-column** fluid grid on desktop for index/gallery layouts.
- **Single column** for all reading contexts.
- Project index: `1` column (mobile **and** tablet, < `lg`) → `3` (desktop). Tablet shares the mobile single-/stacked-column layout rather than an intermediate grid.
- Gap scale uses the spacing tokens (typically `--space-6` / `24px`).

### 4.3 Spacing Scale (4px base)

| Token | px | rem |
| --- | --- | --- |
| `--space-1` | 4 | 0.25 |
| `--space-2` | 8 | 0.5 |
| `--space-3` | 12 | 0.75 |
| `--space-4` | 16 | 1 |
| `--space-6` | 24 | 1.5 |
| `--space-8` | 32 | 2 |
| `--space-12` | 48 | 3 |
| `--space-16` | 64 | 4 |
| `--space-24` | 96 | 6 |
| `--space-32` | 128 | 8 |

### 4.4 Breakpoints

| Name | Min width | Target |
| --- | --- | --- |
| `sm` | 640px | Large phones |
| `md` | 768px | Tablets (portrait) |
| `lg` | 1024px | Tablets (landscape) / small laptops |
| `xl` | 1280px | Desktops |
| `2xl` | 1536px | Large / ultra-wide |

### 4.5 Responsive Behavior Summary

Layout collapses at a **single primary breakpoint**: everything below `lg` (`1024px`) — phones **and** tablets — shares the same single-column layout. `lg` and up is the desktop layout. `sm`/`md` remain available as fine-tuning tokens (gutters, type scale), but they do **not** introduce a distinct layout tier.

| Viewport | Behavior |
| --- | --- |
| **Mobile & Tablet (< 1024px)** | Single column, hamburger menu, timeline as left rail, cards stack, tap targets ≥ 44px. Tablet only widens gutters — it does **not** get its own multi-column layout. |
| **Desktop (1024–1536px)** | Full nav, three-column project grid, timeline spine centered/left. |
| **Ultra-wide (> 1536px)** | Content **capped** by container widths; extra space becomes margin. Never stretch prose. |

---

## 5. Typography

### 5.1 Font Choices

| Role | Recommended | Alternatives | Why |
| --- | --- | --- | --- |
| **Primary (UI + prose)** | **Inter** | Geist, Manrope, IBM Plex Sans, Source Sans | Neutral, highly legible, excellent at text sizes, ships variable weights. |
| **Monospace (code, metadata)** | **JetBrains Mono** | Geist Mono, IBM Plex Mono | Clear code rendering, distinguishes `0/O`, `1/l/I`; signals engineering craft. |

Load only the weights used (400/500/600/700) as a **variable font**, `font-display: swap`, self-hosted or via a subsetted provider.

### 5.2 Type Scale (Major Third · 1.25, fluid via `clamp`)

| Token | Size (rem) | Typical use | Line height | Weight | Letter spacing |
| --- | --- | --- | --- | --- | --- |
| `--text-xs` | 0.75 | Captions, meta | 1.5 | 400/500 | 0.01em |
| `--text-sm` | 0.875 | Secondary, tags | 1.5 | 400/500 | 0 |
| `--text-base` | 1.0 (16px) | Body | 1.7 | 400 | 0 |
| `--text-lg` | 1.125 | Lead paragraph | 1.7 | 400 | 0 |
| `--text-xl` | 1.25 | H4 | 1.4 | 600 | -0.005em |
| `--text-2xl` | 1.5 | H3 | 1.35 | 600 | -0.01em |
| `--text-3xl` | 1.953 | H2 | 1.25 | 700 | -0.015em |
| `--text-4xl` | 2.441 | H1 | 1.15 | 700 | -0.02em |
| `--text-5xl` | 3.052 | Hero | 1.1 | 700 | -0.02em |

**Fluid example**

```css
--text-4xl: clamp(2rem, 1.6rem + 1.8vw, 2.441rem);
```

### 5.3 Heading Hierarchy Rules
- One `<h1>` per page (the page title / hero).
- Headings scale by weight and space, not color.
- Body copy stays at 16–18px; never below 16px for reading content.
- Negative letter-spacing tightens large headings; body stays at `0`.

---

## 6. Color System

Two carefully tuned themes. Both prioritize **soft contrast** and muted accents. Never pure black on pure white.

### 6.1 Light Mode — "high-quality paper"

| Role | Token | Value | Notes |
| --- | --- | --- | --- |
| Background | `--bg` | `#FAF9F6` | Warm off-white. |
| Surface | `--surface` | `#FFFFFF` | Cards, code blocks. |
| Surface (subtle) | `--surface-muted` | `#F3F1EC` | Alt rows, tags. |
| Border | `--border` | `#E5E2DA` | Hairline dividers. |
| Text primary | `--text` | `#2B2B2B` | Dark gray, not black. |
| Text secondary | `--text-muted` | `#6B6B6B` | Meta, captions. |
| Text faint | `--text-faint` | `#9A9A9A` | Disabled, timestamps. |
| Accent | `--accent` | `#3B5BA5` | Muted indigo/blue. |
| Accent hover | `--accent-hover` | `#2F4A8A` | |
| Success | `--success` | `#3F7A57` | Muted green. |
| Warning | `--warning` | `#B7791F` | Muted amber. |
| Danger | `--danger` | `#A94442` | Muted red. |

### 6.2 Dark Mode — "reading at night"

| Role | Token | Value | Notes |
| --- | --- | --- | --- |
| Background | `--bg` | `#16181D` | Soft charcoal, not `#000`. |
| Surface | `--surface` | `#1D2026` | Cards, code blocks. |
| Surface (subtle) | `--surface-muted` | `#24272E` | Alt rows, tags. |
| Border | `--border` | `#2E323A` | Low-contrast dividers. |
| Text primary | `--text` | `#E4E4E7` | Soft off-white. |
| Text secondary | `--text-muted` | `#A1A1AA` | Meta, captions. |
| Text faint | `--text-faint` | `#71717A` | Disabled. |
| Accent | `--accent` | `#8FA8DE` | Lighter muted blue for contrast. |
| Accent hover | `--accent-hover` | `#A9BEE8` | |
| Success | `--success` | `#7FB89A` | |
| Warning | `--warning` | `#D9A441` | |
| Danger | `--danger` | `#D98C8A` | |

### 6.3 Color Usage Rules
- Accent color is reserved for **links, focus, and one primary CTA**. Nothing else.
- Never convey meaning by color alone (pair with icon/text/underline).
- Verify every text/background pair meets contrast targets (§10).
- Theme is driven by `[data-theme="light|dark"]` on `<html>`; tokens swap via CSS variables. Default follows `prefers-color-scheme`, with a manual override persisted in `localStorage`.

---

## 7. Components

All components use the shared tokens. Styling stays quiet; interaction is subtle.

### 7.1 Navigation
- Sticky top bar, `--surface` background, hairline bottom border, subtle blur *disabled* (solid fill preferred).
- Left: name/monogram. Right: page links + theme switcher.
- Active link: weight `600` + subtle underline, not a colored pill.
- Collapses to mobile menu below `md`.

### 7.2 Buttons

| Variant | Appearance | Use |
| --- | --- | --- |
| Primary | Accent fill, `--surface` text, `--radius-md` | The single main CTA per view. |
| Secondary | Transparent, `--border` outline | Supporting actions. |
| Ghost | No border, text only, hover tint | Tertiary / inline. |

Height ≥ 40px (44px on touch), `--space-3`/`--space-6` padding, `150ms` transition on background/border only.

### 7.3 Cards
- `--surface` background, `1px` `--border`, `--radius-lg`, `--shadow-sm`.
- Hover: `--shadow-md` + `translateY(-2px)` (respecting reduced motion). No scale, no glow.
- Internal padding `--space-6`.

### 7.4 Tags / Badges
- Small pill, `--surface-muted` background, `--text-muted` text, `--radius-full`.
- `--text-sm`, no borders, used for tech stack and filters.
- Badge = same shape with semantic color for status (e.g. "Open Source").

### 7.5 Timeline
- Single vertical spine (`1px` `--border`), nodes as small `--accent` dots.
- Each item: date (mono, `--text-muted`) · company/title · summary · tech tags.
- Optional "draw" animation on first reveal (opacity + short translate), skipped under reduced motion.

### 7.6 Project Cards
- Cover image (lazy, fixed aspect ratio to prevent CLS) · title · one-line description · tech tags · links (GitHub / demo).
- Whole card is a link; nested links stop propagation.

### 7.7 Code Blocks
- Mono font, `--surface` (light) / `--surface-muted` (dark), `--radius-md`, `--space-4` padding.
- Subtle syntax theme tuned to the palette (muted, low-saturation).
- Horizontal scroll on overflow; optional filename header + copy button (ghost).

### 7.8 Tables
- Full measure, `--border` row dividers only (no vertical lines).
- Header row `--text-muted`, `--text-sm`, uppercase optional with `0.05em` tracking.
- Zebra striping via `--surface-muted` at low opacity; comfortable cell padding (`--space-3`).

### 7.9 Links
- Body links: `--accent` + underline (`text-underline-offset: 2px`).
- Hover: `--accent-hover`, underline persists.
- External links may carry a small ↗ glyph.

### 7.10 Tooltips
- Small `--surface` bubble, `--border`, `--shadow-sm`, `--text-sm`.
- Appear on hover **and** focus; `~120ms` fade; dismissible with `Esc`.

### 7.11 Footer
- Quiet: name, short tagline, social links, copyright, theme switcher (secondary).
- `--text-muted`, top hairline border, generous vertical padding.

### 7.12 Mobile Menu
- Full-height panel or simple dropdown, `--surface`, focus-trapped.
- Opens from hamburger; closes on link tap, `Esc`, or outside click.
- Body scroll locked while open.

### 7.13 Theme Switcher
- Icon button (sun/moon), toggles `data-theme`, persists to `localStorage`.
- No layout shift; transition limited to color tokens (`~200ms`), and suppressed on initial load to avoid a flash.

---

## 8. Motion Design

Motion is **functional and quiet**. It confirms actions and eases transitions — never performs.

| Allowed | Detail |
| --- | --- |
| Fade | Opacity `0 → 1`, `200–300ms`. |
| Small translate | `≤ 8px` (e.g. card lift `-2px`, reveal `+8px`). |
| Page transitions | Cross-fade via Astro View Transitions, `≤ 300ms`. |
| Hover effects | Shadow/border/background over `150ms`. |

| Forbidden |
| --- |
| Large movement, bounce/elastic easing, spin, parallax, scroll-jacking, infinite loops. |

**Easing:** `ease-out` / `cubic-bezier(0.16, 1, 0.3, 1)` for entrances.
**Durations:** UI `150ms`, entrances `250ms`, page `300ms`.

### Reduced Motion (required)
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.001ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.001ms !important;
    scroll-behavior: auto !important;
  }
}
```
Content must be fully usable with all motion disabled.

---

## 9. Accessibility

Target: **WCAG 2.1 AA** across the site.

- **Semantic HTML**: `header`, `nav`, `main`, `article`, `section`, `footer`; headings in order; one `<h1>` per page.
- **Keyboard**: every interactive element reachable and operable; logical tab order; no traps (except intentional modal focus-trap).
- **Focus indicators**: visible `2px` `--accent` outline with offset — never removed, only restyled.
- **Skip link**: "Skip to content" as the first focusable element.
- **Screen readers**: descriptive `alt` text; `aria-label` on icon-only buttons; `aria-current="page"` on active nav; live region for form status.
- **Color contrast**: body ≥ 4.5:1, large text/UI ≥ 3:1 (verify both themes).
- **Forms**: `<label>` for every field, inline error text tied via `aria-describedby`.
- **Targets**: ≥ 44×44px on touch.
- **Motion**: honor `prefers-reduced-motion`.

```css
:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
  border-radius: var(--radius-sm);
}
```

---

## 10. Responsive Design Behavior

Mobile and tablet **share a single layout breakpoint** (everything below `lg` / `1024px`). Tablets do not receive their own multi-column layout — they use the mobile single-column layout with wider gutters.

| Device | Layout notes |
| --- | --- |
| **Mobile & Tablet (< 1024px)** | Single column; hamburger nav; timeline as left rail; cards stack; `20–24px` gutters (tablet may widen); sticky CTA optional. One shared layout — no distinct tablet grid. |
| **Desktop** | Full inline nav; 3-column project grid; reading content still capped to prose width. |
| **Ultra-wide** | Containers cap layout; excess width becomes margin; prose never exceeds its measure; no full-width text. |

Golden rule: **wider screens add margin, not line length.**

### 10.1 Print & CV Export

Both the `/resume` and `/cv` pages are first-class **print targets**. Users can print (or "Save as PDF" via the browser) directly from either page, and the printed output must be recruiter- and ATS-friendly. A dedicated print stylesheet (`@media print`) governs this — the on-screen layout is never sent to the printer unchanged. The résumé targets a single page; the CV may run to multiple pages but follows the same rules.

**Two print intents, shared across both pages:**

| Mode | When | Goal |
| --- | --- | --- |
| **Design-faithful print** | Default browser print of `/resume` or `/cv` | Reproduce the on-screen layout as closely as the page allows — same hierarchy, spacing rhythm, and typographic tone, adapted to paper. |
| **ATS / plain export** | Downloaded/generated PDF (and an optional "ATS-friendly" print variant) | Single-column, machine-parseable, no visual decoration. Prioritizes text extraction over aesthetics. |

**Print stylesheet rules (`@media print`):**
- Force **light theme** tokens regardless of `data-theme`; background becomes white, text near-black for maximum contrast and ink economy.
- Hide all non-content chrome: header nav, hamburger, footer, theme switch, "Download"/"Print" buttons, contact form, back-to-top, sticky CTAs.
- Collapse to a **single column** and remove the viewport container caps — content flows to the printable page width with sane margins (`~18–20mm`).
- Set page geometry via `@page { size: A4; margin: 18mm; }` (Letter acceptable); avoid headers/footers with URLs where the browser allows.
- **Avoid awkward breaks:** `break-inside: avoid` on experience entries, project blocks, education rows, and skill groups; `break-after: avoid` on headings so a heading never orphans at a page bottom.
- Use **point-based type** for print (`~10.5–11pt` body, `~9.5pt` meta) and tighten line-height slightly (`~1.4`) to fit more without crowding.
- Show link targets inline where useful (`a[href]::after { content: " (" attr(href) ")"; }`) for GitHub/LinkedIn/live-demo links, but suppress it for internal `#`/relative links.
- Remove shadows, rounded-corner emphasis, and background fills; keep only hairline rules where they aid scanning.
- Images/logos: print at reduced density or hide purely decorative imagery; never rely on background images (they may be dropped by the browser).

**ATS-format guarantees:**
- Real, selectable text — never text baked into images.
- Logical single-column reading order that matches the DOM source order.
- Standard section headings (`Summary`, `Experience`, `Skills`, `Education`, `Certifications`, `Languages`) so parsers map them reliably.
- No multi-column tables for core content, no icon-only labels, no text inside SVG paths for anything an ATS must read.
- Dates and roles as plain text next to each entry.

**Checklist addition:** print output verified on both A4 and Letter, in Chrome/Firefox/Safari "Save as PDF", with the resulting PDF passing a text-copy test (all content selectable) and an ATS parse spot-check.

---

## 11. Technical Recommendations

This repository is an **Astro + TypeScript** project — an excellent fit for a content-heavy, reading-first portfolio. The stack below reflects that, and maps the requested ecosystem (Next.js/React/etc.) to Astro equivalents where relevant.

| Technology | Role | Why it fits |
| --- | --- | --- |
| **Astro** | Framework / SSG | Ships zero JS by default → fastest possible reads; island architecture adds interactivity only where needed. Ideal for content-first sites. |
| **TypeScript** | Language | Type-safe content schemas and components; fewer runtime surprises; better long-term maintainability. |
| **Tailwind CSS** | Styling | Utility-first with design tokens mapped to CSS variables; consistent spacing/type scale; tiny production CSS. |
| **Astro Content Collections + Zod** | Content model | Type-safe Markdown/YAML for experience, projects, certs; build-time validation catches missing fields. |
| **MDX** | Rich content | Lets project case studies mix prose with components (callouts, code, diagrams) while staying in Markdown. |
| **Motion One** *(or minimal Framer Motion in React islands)* | Animation | Lightweight, respects reduced motion; only for the subtle fades/lifts specified. |
| **shadcn/ui** *(optional, React islands)* | UI primitives | Accessible, unstyled-by-default components (dialog, tooltip) if interactive islands grow. |
| **Astro View Transitions** | Page transitions | Native cross-fade navigation without a heavy SPA framework. |

> **On Next.js/React:** For an equally static, reading-first result Next.js (App Router + RSC) is a valid alternative, and React is available inside Astro islands. Given this project's content-heavy nature and zero-JS goals, **Astro is the primary recommendation**; React/shadcn are reserved for the few interactive islands (theme switch, project filter, contact form).

---

## 12. Performance Goals

| Metric | Target |
| --- | --- |
| Lighthouse Performance | ≥ 95 |
| Lighthouse Accessibility | 100 |
| Lighthouse Best Practices | ≥ 95 |
| Lighthouse SEO | 100 |
| Largest Contentful Paint | < 1.5s (fast 4G) |
| Cumulative Layout Shift | < 0.05 |
| Total Blocking Time | < 150ms |
| JS shipped (reading pages) | ≈ 0 KB (islands only) |

### Tactics
- **Static generation** for all pages; no client rendering for reading content.
- **Images**: Astro `<Image>` with responsive `srcset`, AVIF/WebP, explicit dimensions (no CLS), `loading="lazy"` below the fold.
- **Fonts**: self-hosted variable subset, `font-display: swap`, preload the primary weight, `size-adjust` to reduce layout shift.
- **Lazy loading**: images, non-critical islands (`client:visible`), heavy embeds.
- **SEO**: per-page `<title>`/meta description, Open Graph + Twitter cards, `sitemap.xml`, `robots.txt`, JSON-LD `Person` schema.
- **Caching**: hashed asset filenames, long-lived immutable cache headers.

---

## 13. Design Tokens

Reference implementation (CSS custom properties). Tailwind maps to these.

### 13.1 Colors
```css
:root[data-theme="light"] {
  --bg: #FAF9F6;
  --surface: #FFFFFF;
  --surface-muted: #F3F1EC;
  --border: #E5E2DA;
  --text: #2B2B2B;
  --text-muted: #6B6B6B;
  --text-faint: #9A9A9A;
  --accent: #3B5BA5;
  --accent-hover: #2F4A8A;
  --success: #3F7A57;
  --warning: #B7791F;
  --danger: #A94442;
}

:root[data-theme="dark"] {
  --bg: #16181D;
  --surface: #1D2026;
  --surface-muted: #24272E;
  --border: #2E323A;
  --text: #E4E4E7;
  --text-muted: #A1A1AA;
  --text-faint: #71717A;
  --accent: #8FA8DE;
  --accent-hover: #A9BEE8;
  --success: #7FB89A;
  --warning: #D9A441;
  --danger: #D98C8A;
}
```

### 13.2 Typography
```css
:root {
  --font-sans: "Inter", ui-sans-serif, system-ui, -apple-system, sans-serif;
  --font-mono: "JetBrains Mono", ui-monospace, "SFMono-Regular", monospace;

  --text-xs: 0.75rem;
  --text-sm: 0.875rem;
  --text-base: 1rem;
  --text-lg: 1.125rem;
  --text-xl: 1.25rem;
  --text-2xl: 1.5rem;
  --text-3xl: 1.953rem;
  --text-4xl: 2.441rem;
  --text-5xl: 3.052rem;

  --leading-tight: 1.15;
  --leading-snug: 1.35;
  --leading-normal: 1.5;
  --leading-relaxed: 1.7;

  --tracking-tight: -0.02em;
  --tracking-normal: 0;
  --tracking-wide: 0.05em;

  --weight-regular: 400;
  --weight-medium: 500;
  --weight-semibold: 600;
  --weight-bold: 700;
}
```

### 13.3 Radius
```css
:root {
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
  --radius-full: 9999px;
}
```

### 13.4 Shadows *(soft, low-opacity)*
```css
:root {
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.08);
  --shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.10);
}
:root[data-theme="dark"] {
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.40);
  --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.45);
  --shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.50);
}
```

### 13.5 Spacing
```css
:root {
  --space-1: 0.25rem;  --space-2: 0.5rem;  --space-3: 0.75rem;
  --space-4: 1rem;     --space-6: 1.5rem;  --space-8: 2rem;
  --space-12: 3rem;    --space-16: 4rem;   --space-24: 6rem;
  --space-32: 8rem;
}
```

### 13.6 Border Widths
```css
:root {
  --border-thin: 1px;
  --border-medium: 1.5px;
  --border-thick: 2px;
}
```

### 13.7 Z-index
```css
:root {
  --z-base: 0;
  --z-dropdown: 100;
  --z-sticky: 200;
  --z-header: 300;
  --z-overlay: 400;
  --z-modal: 500;
  --z-tooltip: 600;
}
```

### 13.8 Transition Durations
```css
:root {
  --duration-fast: 150ms;
  --duration-base: 200ms;
  --duration-slow: 300ms;
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
}
```

### 13.9 Layout Tokens
```css
:root {
  --container-prose: 680px;
  --container-content: 960px;
  --container-wide: 1200px;
  --gutter: clamp(1.25rem, 5vw, 2rem);
}
```

---

## 14. Implementation Checklist

- [ ] Tokens defined in `global.css`; Tailwind theme maps to CSS variables.
- [ ] Theme switch: `data-theme` + `localStorage`, no flash on load, no CLS.
- [ ] Prose wrapper enforces `--container-prose` and `1.7` line height.
- [ ] Fonts self-hosted, variable, subset, preloaded.
- [ ] Content Collections + Zod schemas for experience, projects, certs, education.
- [ ] Images via Astro `<Image>` with fixed aspect ratios.
- [ ] `prefers-reduced-motion` handled globally.
- [ ] Skip link + visible focus states + semantic landmarks.
- [ ] Contrast verified in both themes (AA).
- [ ] Lighthouse: Perf ≥ 95, A11y 100, SEO 100.
- [ ] Print stylesheet for `/resume` **and** `/cv`: design-faithful print + ATS/plain PDF export, forced light theme, single column, page-break control, selectable text (see §10.1).

---

*This document is the single source of truth for the portfolio's visual and interaction design. When in doubt, choose the calmer, quieter, more readable option.*
