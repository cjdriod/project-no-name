# Component Contract: Landing Hero Page

Component interfaces (Astro `.astro`). Props are the contract; internal markup is
implementation. All components consume design tokens and are theme-agnostic (colors via CSS
vars). Accessibility notes are binding (Constitution II).

## `Layout.astro`

- **Props**: `title?: string`, `description?: string`.
- **Responsibilities**: `<html lang>`, `<head>` meta, Inter + JetBrains Mono font links,
  no-flash inline theme init script, `no-transition`→`is-ready` toggle on first frame,
  `<slot />`, global styles import.
- **A11y**: sets `lang`; ensures skip-link target exists in page.

## `NavBar.astro`

- **Props**: none (nav list is static per data-model).
- **Responsibilities**: fixed centered bottom bar; 4 icon links (Home `/`, About `/about`,
  Projects `/projects`, Contact me `/contact`); separator; renders `ThemeToggle`. At very
  narrow widths, lower-priority links hide in priority order (Projects first, then Contact me)
  via CSS media queries so the bar never overflows (FR-018) — no JS overflow menu.
- **A11y**: `<nav aria-label="Primary">`; each link icon-only with `aria-label` + visible
  tooltip; `aria-current="page"` on the current-route item (Home on `/`); targets ≥44px;
  keyboard operable; active-state glow/highlight (distinguished by shape + fill + `aria-current`,
  not color alone); no magnify effect. Home, About, and the toggle remain reachable at all widths.

## `ThemeToggle.astro`

- **Props**: none.
- **Responsibilities**: button that flips `data-theme` on `<html>`, persists to
  `localStorage.theme`, swaps sun/moon icon.
- **A11y**: `<button>` with an accessible name (e.g. `aria-label="Toggle light and dark
  theme"`) whose icon reflects the current theme; explicit pressed-state exposure is optional
  (FR-006 — the accessible name communicates the action); focus-visible outline.

## `Hero.astro`

- **Props**: `profile: ProfileEntry` (from `profile` collection).
- **Responsibilities**: render tagline → greeting → `<h1>` name → role → description →
  two CTAs (View Projects → `profile.projectsHref`; View CV → `profile.cvHref`) → portrait
  (placeholder). `data-reveal` with staggered `--reveal-delay`.
- **A11y**: single `<h1 id="hero-title">`; portrait `<img>` has `alt`, explicit
  `width`/`height` (no CLS); CTAs are real links with accessible labels + icons `aria-hidden`.

## `ExperienceSection.astro`

- **Props**: `items: ExperienceEntry[]` (already sorted & capped to 3 by caller, or caps
  internally).
- **Responsibilities**: `<section id="experience">` heading + list of `ExperienceCard`.
- **A11y**: section labelled by its heading; list semantics (`<ul>`/`<li>`).

## `ExperienceCard.astro`

- **Props**: `company: string`, `position: string`, `photo: string`, `photoAlt?: string`,
  `start: string`, `end: string`.
- **Responsibilities**: show only company name, photo, position, and `start — end` period
  (each `{short_month}-{year}`, e.g. "Jan-2023 — Present").
- **A11y**: `<img>` `alt` (default `${company} logo`), explicit dimensions; remains readable
  if the image fails to load (text intact).

## `SkillsSection.astro`

- **Props**: `skills: SkillEntry[]`.
- **Responsibilities**: `<section id="skills">` heading + wrapping flex of `SkillPill`.
- **A11y**: section labelled by heading; pills in a list.

## `SkillPill.astro`

- **Props**: `name: string`, `icon?: string` (iconify id; omit for a text-only pill).
- **Responsibilities**: pill-shaped badge = optional `<Icon name={icon} />` (when provided) +
  `{name}` text; renders text-only when `icon` is omitted, without breaking layout (FR-011).
- **A11y**: icon `aria-hidden` (name text is the accessible label); pill has enough
  contrast in both themes (prefer monochrome brand mark when a multicolor logo fails contrast
  on dark surface).

## `index.astro` (page)

- **Composition**: `Layout` → skip-link → `<main>` (`Hero`, `ExperienceSection`,
  `SkillsSection`) → `NavBar`. Loads collections via `getCollection`/`getEntry`, sorts
  experience by `order`, caps to 3, passes props down. Nav links are cross-route (`/`,
  `/about`, `/projects`, `/contact`); CTAs link to `/projects` and `/cv`.
- **Responsive contract**: `<main>` is full-width with mobile gutters; at `lg`+ it is capped
  to `--container-wide` (1200px, home-sections container per `.skills/design.md` §4.1) and centered.

## Interaction contracts (behavioral)

| Trigger | Expected result | Spec |
|---------|-----------------|------|
| Page load | Content reveals via staggered fade+translate; immediate if reduced-motion | FR-012/013 |
| Click "View Projects" | Navigates to `/projects` | FR-003 |
| Click "View CV" | Navigates to `/cv` | FR-003 (clarified) |
| Click theme toggle | `data-theme` flips; persisted; no flash next load | FR-006/007/008 |
| Click a nav item | Navigates to its route (`/`, `/about`, `/projects`, `/contact`) | FR-004 |
| Keyboard tab | All links, toggle, CTAs reachable with visible focus | FR-014 |
| Narrow viewport | Projects then Contact me hide via CSS; Home/About/toggle stay; no overflow | FR-018 |
