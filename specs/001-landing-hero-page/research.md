# Phase 0 Research: Landing Hero Page

All Technical Context items were resolvable from the existing stack, `.skills/design.md`, and the
clarified spec. No open `NEEDS CLARIFICATION` markers remain. Findings below.

## 1. Tailwind CSS v4 + design tokens

- **Decision**: Use Tailwind v4 (already wired via `@tailwindcss/vite`). Declare the
  `.skills/design.md` tokens as CSS custom properties in `src/styles/global.css` and expose them to
  Tailwind utilities through the `@theme` block (v4's CSS-first config). Author styles with
  Tailwind utility classes in markup; use CSS variables for theme-swappable colors.
- **Rationale**: v4 has no `tailwind.config.js` by default; `@theme` is the idiomatic way to
  register custom colors/spacing/fonts so classes like `bg-surface`, `text-muted`,
  `max-w-content` resolve to the tokens. Colors reference `var(--…)` so a single
  `[data-theme]` swap re-themes every utility with no class changes.
- **Alternatives considered**: JS config file (not needed in v4); inline hardcoded hex values
  (rejected — violates single-source-of-truth tokens and dual-theme swap).

## 2. Theme toggle (light/dark) with no-flash + persistence

- **Decision**: Drive theme via `data-theme="light|dark"` on `<html>`. A tiny **inline**
  script in `<head>` (runs before paint) reads `localStorage.theme`, falls back to
  `prefers-color-scheme`, else `light`, and sets the attribute. A small `ThemeToggle` island
  flips the attribute and persists to `localStorage`. Suppress color transitions on first
  paint (`no-transition` class removed on `requestAnimationFrame`).
- **Rationale**: Matches `.skills/design.md` §6.3 / §7.13 exactly (attribute-driven, localStorage
  override, prefers-color-scheme default, no flash, no layout shift). Inline head script is
  the standard no-flash pattern; it is the one unavoidable bit of blocking JS.
- **Alternatives considered**: CSS-only `prefers-color-scheme` (rejected — no manual
  override/persistence); cookie + SSR (rejected — static site, unnecessary).

## 3. astro-icon + Iconify icon sets

- **Decision**: Use `astro-icon`'s `<Icon name="set:name" />`. Icon-set packages:
  - `@iconify-json/material-symbols` — **INSTALLED** (`^1.2.83`). Covers UI/nav + theme + CTA
    icons (nav bar, sun/moon, CTAs). Monochrome, themeable via `currentColor`.
  - `@iconify-json/simple-icons` — **INSTALLED** (`^1.2.89`) for skill brand marks (JS, Vue,
    Angular, Java, AWS, Azure, …). Monochrome brand logos that tint with text color (good
    contrast in both themes). Optionally add `@iconify-json/logos` if multicolor marks are preferred.
  - **Resolved**: both packs are installed, so the skills section can render its icons. Skills
    without a suitable brand icon fall back to text-only pills (FR-011).
- **Rationale**: `astro-icon` resolves names from locally installed `@iconify-json/*` packs at
  build time and inlines optimized SVG (no runtime icon fetch → good for performance/CLS).
  Material Symbols covers monochrome UI glyphs (themeable via `currentColor`); `logos`
  provides multicolor brand marks and `simple-icons` provides monochrome brand marks — pick
  per pill for legibility in both themes.
- **Icon mapping (draft)**:
  | Use | Iconify id |
  |-----|-----------|
  | Nav: Home | `material-symbols:home-outline-rounded` |
  | Nav: About | `material-symbols:person-outline-rounded` |
  | Nav: Projects | `material-symbols:folder-outline-rounded` |
  | Nav: Contact me | `material-symbols:mail-outline-rounded` |
  | Theme: light | `material-symbols:light-mode-outline-rounded` |
  | Theme: dark | `material-symbols:dark-mode-outline-rounded` |
  | CTA: View Projects | `material-symbols:grid-view-outline-rounded` |
  | CTA: View CV | `material-symbols:description-outline-rounded` |
  | Skill: JavaScript | `simple-icons:javascript` |
  | Skill: Vue | `simple-icons:vuedotjs` |
  | Skill: Angular | `simple-icons:angular` |
  | Skill: Java | `simple-icons:openjdk` (or `logos:java`) |
  | Skill: AWS | `simple-icons:amazonwebservices` (or `logos:aws`) |
  | Skill: Azure | `simple-icons:microsoftazure` (or `logos:microsoft-azure`) |
- **Note**: Monochrome `simple-icons:*` marks tint with `currentColor` → reliable contrast in
  both themes (preferred). Multicolor `logos:*` marks ignore `currentColor` and may fail
  contrast on the dark surface; use them only where legibility holds.
- **Alternatives considered**: Hand-authored inline SVGs (rejected — Constitution mandates
  Iconify; astro-icon is cleaner and consistent). Runtime Iconify web component (rejected —
  adds client JS and network fetch).

## 4. Mobile-first responsive layout (full-width → container)

- **Decision**: Author base (mobile) styles with full-bleed sections and `20–24px` gutters.
  At `lg` (1024px) and up, cap the content to a centered container (`--container-wide`
  = 1200px, the home-sections container per `.skills/design.md` §4.1) via `max-w-[1200px] mx-auto`.
  Sections stack in a single column at all sizes; experience is a vertical list; skills wrap
  with flex.
- **Rationale**: Directly implements the user's requirement and `.skills/design.md` §4/§10 (single
  layout tier below `lg`; wider screens add margin, not line length; home sections use the
  1200px wide container). Mobile-first ordering (base + `min-width` breakpoints) satisfies
  Constitution III.
- **Alternatives considered**: Desktop-first with `max-width` overrides (rejected — violates
  mobile-first principle); multi-column tablet tier (rejected — design mandates one tier
  below `lg`).

## 5. Enter animation (reduced-motion aware)

- **Decision**: CSS-only staggered reveal — elements carry `data-reveal` (start
  `opacity:0; translateY(12px)`); adding `.is-ready` on `<html>` (next frame) transitions
  them to visible with a per-element `--reveal-delay`. Under
  `@media (prefers-reduced-motion: reduce)`, `data-reveal` is shown immediately with no
  transform/transition.
- **Rationale**: Satisfies FR-012/FR-013 and `.skills/design.md` §8 (fade + `<=8px` translate,
  `250ms`, `ease-out`) with zero animation-runtime JS, preserving the performance budget.
  **Confirmed by owner (2026-07-08): motion is minimal and CSS is sufficient** — no Motion One
  is added. Documented as a justified deviation from Principle IV's Motion One default (see
  plan Complexity Tracking).
- **Alternatives considered**: Motion One (rejected — owner scoped motion to minimal CSS;
  extra JS for no benefit); IntersectionObserver scroll reveals (rejected — content is above
  the fold; on-load reveal is sufficient and simpler).

## 6. Pill-style bottom navigation bar

- **Decision**: Fixed, centered **bottom** bar (`position: fixed; bottom; left-1/2; -translate-x`)
  rendered as a **pill** (`--radius-full`, §7.4) with a **solid `--surface` fill** + hairline
  `--border` + `--shadow-sm` (§7.1 "solid fill preferred"). Four nav links (Home/About/Projects/
  Contact me) as **cross-route links** (`/`, `/about`, `/projects`, `/contact`) plus a separator
  and the theme toggle. The **active/current route** is shown as a **highlighted pill** (filled
  `--surface-muted`/accent tint + soft ring) together with `aria-current="page"` — i.e. a
  glow/highlight, **not** a macOS magnify/scale. Icon-only links carry an accessible `aria-label`
  + tooltip; each item is a >=44px tap target. Motion stays within §8 (color/opacity <=200ms),
  and the active highlight remains visible under `prefers-reduced-motion`.
- **Narrow-width collapse (FR-018)**: Handled in pure CSS — below a small threshold the
  lower-priority links hide in priority order (Projects first, then Contact me) via
  `@media (max-width: …)`, so the bar never overflows while Home, About, and the theme toggle
  stay reachable. No JS overflow/dropdown menu is introduced (keeps the reading page zero-JS);
  hidden destinations remain reachable via the hero CTAs and their real routes.
- **Rationale**: Meets FR-004/006/017/018 and keeps ≥44px targets (Constitution III). A pill-shaped
  bottom bar is a modern, thumb-reachable mobile pattern (primary audience is on phones). This
  deviates from `.skills/design.md` §7.1 (top bar, underlined active, "not a colored pill") — an
  owner-directed change documented in plan.md; tokens (§7.4 pill, §7.13 toggle, §8 motion) are
  otherwise reused. Per owner
  clarification (2026-07-08) the destinations are real routes, so the nav bar is a persistent
  cross-page navigator rather than in-page anchors.
- **Route map (owner-specified)**: Home → `/`, About → `/about`, Contact me → `/contact`,
  CV (CTA) → `/cv`. Projects → `/projects` is **owner-confirmed** (2026-07-08). `/about`,
  `/projects`, `/contact`, `/cv` are out of this feature's build scope — this feature only
  guarantees the links target them; a not-yet-built route falls through to the site 404 page
  (out of scope, to be developed). Use `aria-current="page"` on Home for the landing route.

## 7. Content collections in Astro 7 (Zod)

- **Decision**: Define collections in `src/content.config.ts` using the Content Layer API:
  `experience` via the `glob()` loader over `src/content/experience/*.md`; `profile` and
  `skills` via the `file()` loader over single YAML files. Each has a Zod `schema`.
- **Rationale**: Astro 5+/7 moved collection config to `src/content.config.ts` with loader
  APIs; Zod schemas give build-time validation per Constitution V (build fails on missing/
  malformed fields). Keeps content out of components.
- **Alternatives considered**: Hardcoded TS data module (rejected — violates Constitution V);
  legacy `src/content/config.ts` folder-typed collections (superseded in Astro 7).

## Dependencies to add

Both icon packs are already installed (`@iconify-json/material-symbols` `^1.2.83`,
`@iconify-json/simple-icons` `^1.2.89`). Optional only:

```text
# optional, only if multicolor marks are wanted:
npm i -D @iconify-json/logos
```

No other new runtime dependencies (motion is CSS-only — no Motion One). Google Fonts (Inter,
JetBrains Mono) loaded via `<link>` in `Layout.astro` per `.skills/design.md` §5 (or self-hosted
later).
