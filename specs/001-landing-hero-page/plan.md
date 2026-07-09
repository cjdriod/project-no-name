# Implementation Plan: Landing Hero Page

**Branch**: `001-landing-hero-page` | **Date**: 2026-07-08 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-landing-hero-page/spec.md`

## Summary

Build the home-route (`/`) landing page as a static, mobile-first Astro page styled with
Tailwind CSS v4 mapped to the `design.md` design tokens. The page has three stacked content
sections — hero (tagline, greeting, identity, description, and two CTAs "View Projects" →
`/projects` and "View CV" → `/cv`), a top-3 work-experience list, and an icon+text skill-pill
section — plus a persistent pill-style bottom navigation bar (Home, About, Projects, Contact
me) with a light/dark theme toggle. Content flows full-width on small viewports and is capped
to a centered `--container-wide` (1200px) container on desktop (home sections, `design.md` §4.1). Content (profile, experience, skills) is modeled as
type-safe Astro Content Collections validated by Zod (Constitution V). Icons use `astro-icon`
(Material Symbols for UI/nav; brand logo sets for skills). A subtle, reduced-motion-aware
enter animation reveals content on load.

## Technical Context

**Language/Version**: TypeScript 5.x, Astro 7 (`.astro` components, static output)

**Primary Dependencies**: Astro 7; Tailwind CSS v4 via `@tailwindcss/vite`; `astro-icon`
1.1.5; Iconify icon-set packages: `@iconify-json/material-symbols` (**installed** `^1.2.83` —
UI/nav/theme/CTA icons) and `@iconify-json/simple-icons` (**installed** `^1.2.89` — monochrome
skill brand marks: JS, Vue, Angular, Java, AWS, Azure, etc.; optionally `@iconify-json/logos`
for multicolor marks). Material Symbols has no brand logos, so the installed brand pack covers
the skills section. Both packs are present — the previously-open icon dependency is resolved.

**Storage**: Static content via Astro Content Collections — `profile` (single YAML entry),
`experience` (Markdown/YAML entries), `skills` (YAML list). No database.

**Testing**: No automated unit tests required (Constitution: Testing policy). Verification via
`astro build` + TypeScript type-check + manual accessibility/responsive review.

**Target Platform**: Static site (GitHub Pages), evergreen browsers, mobile + desktop.

**Project Type**: Single project — Astro static web app.

**Performance Goals**: Per `design.md` / Constitution II — Lighthouse Performance ≥ 95,
Accessibility 100, SEO 100, LCP < 1.5s, CLS < 0.05. Reading page ships effectively zero client
JS except a tiny theme island.

**Constraints**: Mobile-first (base styles target smallest viewport, `min-width` breakpoints
up). Full-width content below `lg`; centered `--container-wide` (1200px) at `lg`+ (home
sections per `design.md` §4.1). Tap targets ≥ 44px. No-flash theme init before first paint.
Honors `prefers-reduced-motion`. AA contrast in both themes. One `<h1>`, landmark regions, and
a "Skip to content" link as the first focusable element (FR-019); descriptive alt text on the
hero portrait and experience photos (FR-020). Bottom navigation is pill-style; the active route
is shown with a highlighted pill + `aria-current="page"` (glow/highlight), NOT a macOS
magnify/scale effect. At very narrow widths the nav degrades by hiding lower-priority items
(Projects, then Contact me) via CSS media queries while Home, About, and the toggle persist
(FR-018) — no JS overflow menu, preserving zero-JS. **Motion is minimal and CSS-only** (no
animation runtime library)
per owner direction — no Motion One dependency is added.

**Scale/Scope**: One page (`/`), ~7 components, 3 content collections, 3 experience entries,
~12–18 skills. Small.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Content-First Reading Experience | PASS | Content is legible first; hero is short-form (prose measure applies to long-form pages). No text baked into images; nothing animates mid-read (single on-load reveal). |
| II. Performance & Accessibility as Baseline | PASS | Static output; only a minimal theme island of JS. Semantic landmarks, one `<h1>`, skip link, visible focus, alt text, AA contrast both themes, explicit media dimensions (no CLS). |
| III. Mobile-First Responsive Design | PASS | Authored mobile-first; full-width small, container at `lg`+; single layout tier below `lg`; >=44px targets. |
| IV. Minimal, Purposeful Interactivity | PASS (owner-approved deviation) | Theme toggle + nav active-state highlight + on-load reveal only; all reduced-motion-aware. Motion is deliberately minimal and implemented in pure CSS (no Motion One) per explicit owner direction (2026-07-08: "minimal motion, CSS is sufficient") — see Complexity Tracking. |
| V. Type-Safe Content Model | PASS | Profile/experience/skills modeled as Content Collections with Zod schemas; build fails on malformed content. No hardcoded content in components. |

**Technology Constraints**: Astro + TypeScript + Tailwind (tokens from `design.md`) + Iconify
via astro-icon — all match the fixed stack. GitHub Pages static output preserved.

**Gate result**: PASS (one justified deviation recorded in Complexity Tracking).

**Design-system note (design.md reconciliation)**: `design.md` §7.1 specifies a sticky *top*
nav bar whose active link is weight-600 + underline ("not a colored pill") and which collapses
to a mobile menu (§7.12). This feature instead uses a **persistent bottom, pill-style navigation
bar** with a highlighted active pill + `aria-current="page"` (owner clarification 2026-07-08:
"modern bottom navigation, glow/highlight active state, no more mac-like"). Per Constitution
governance (the constitution supersedes and `design.md` is reconciled to it) this is an
owner-directed deviation. Styling still reuses `design.md` tokens: pill shape from §7.4
(`--radius-full`), **solid `--surface` fill** + hairline `--border` + `--shadow-sm` (§7.1
"solid fill preferred"), sun/moon toggle per §7.13, and motion within §8 budgets (fade / ≤8px,
no magnify/scale). Follow-up: update `design.md` §7.1/§7.12 to document the bottom pill nav.

## Project Structure

### Documentation (this feature)

```text
specs/001-landing-hero-page/
├── plan.md              # This file (/speckit.plan output)
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
│   ├── content-schema.md
│   └── components.md
├── checklists/
│   └── requirements.md  # from /speckit.specify
└── tasks.md             # Phase 2 output (/speckit.tasks — NOT created here)
```

### Source Code (repository root)

```text
src/
├── content.config.ts            # Zod-validated collections: profile, experience, skills
├── content/
│   ├── profile.yaml             # tagline, greeting, name, role, description, photo, cvHref
│   ├── skills.yaml              # [{ name, icon }] skill list (icon = iconify id)
│   └── experience/
│       ├── company-a.md         # company, position, photo, start (MMM-yyyy), end, order
│       ├── company-b.md
│       └── company-c.md
├── layouts/
│   └── Layout.astro             # <head>, fonts, no-flash theme init, skip link + landmarks, tailwind, is-ready trigger
├── components/
│   ├── NavBar.astro               # bottom pill nav (Home/About/Projects/Contact) + ThemeToggle; narrow-width collapse hides Projects→Contact via CSS
│   ├── ThemeToggle.astro        # sun/moon icon button island
│   ├── Hero.astro               # tagline, greeting, name, role, description, 2 CTAs, photo
│   ├── ExperienceSection.astro  # section wrapper + heading
│   ├── ExperienceCard.astro     # company name, photo, position, start–end year
│   ├── SkillsSection.astro      # section wrapper + heading
│   └── SkillPill.astro          # icon + text pill
├── pages/
│   └── index.astro              # composes Layout + Hero + Experience + Skills + NavBar
└── styles/
    └── global.css               # @import tailwindcss + @theme tokens + reveal/reduced-motion
```

**Structure Decision**: Single Astro project (default). This is a content-driven static site,
so all work lives under `src/`. Content is separated from UI via Content Collections
(`src/content/` + `src/content.config.ts`); presentation is small, reusable `.astro`
components; design tokens live in `src/styles/global.css` and are exposed to Tailwind v4 via
`@theme`. No backend/tests trees are introduced (none required).

## Complexity Tracking

> Filled because Constitution Principle IV specifies Motion One for animation and this plan
> uses CSS-only motion instead. This is an explicit, owner-approved decision (2026-07-08:
> "minimal motion, CSS is sufficient").

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|--------------------------------------|
| All motion (on-load reveal, nav active-state highlight, theme/hover transitions) implemented in pure CSS instead of Motion One | The owner has scoped motion to a minimal set — a subtle staggered fade+translate reveal on load plus small hover/focus lifts. CSS transitions with a tiny `requestAnimationFrame` class toggle fully cover this and keep the reading page effectively zero-JS, serving Principle II (performance/zero-JS) and the design goal "never animate before legible." Owner explicitly confirmed CSS is sufficient. | Adding the Motion One runtime (JS bundle + hydration) to drive one-shot fades and hover lifts contradicts Principle II's zero-JS reading-page rule and adds weight for no user-visible benefit. CSS honors `prefers-reduced-motion` identically. |

> **Governance note**: This CSS-only motion approach diverges from the letter of Constitution
> IV (which names Motion One). If it becomes the standing rule for the project, reconcile the
> constitution via `/speckit.constitution` (e.g. "CSS-first motion; Motion One only when an
> effect genuinely exceeds CSS"). Until then it is tracked here as a justified deviation.
