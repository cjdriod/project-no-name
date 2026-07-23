# Implementation Plan: Refine Home Page & Navigation

**Branch**: `002-refine-home-page` | **Date**: 2026-07-10 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/002-refine-home-page/spec.md`

## Summary

Refine the home page and shared navigation of the Astro portfolio: remove the Contact tab from the bottom nav; reorder the home page to Hero → Core Expertise → Experience → Contact; replace the flat Skills list with a category-grouped Core Expertise section sourced from a refined `skills.yaml` (per-category page flags, top-3 pills per home-eligible category); add a "Get in Touch" contact section (email/LinkedIn/GitHub as external, new-tab links with icon + text) sourced from a `contacts` list in `profile.yaml`; migrate Experience content to a single YAML array displayed newest-first (reverse of append order); and replace the hero portrait placeholder with a 3D-feel developer illustration SVG.

Technical approach: all changes are static Astro components + Zod-validated content collections. No new runtime JavaScript is introduced. New skill/contact icons are registered in the `astro-icon` allowlist. Only the home page renders the new Core Expertise data; about/cv page flags are authored in data but not rendered by this feature.

## Technical Context

**Language/Version**: TypeScript 5.x on Node ≥ 22.12, Astro 7.0.4

**Primary Dependencies**: Astro (static/islands), `astro-icon` 1.1.5 + Iconify sets (`@iconify-json/simple-icons`, `@iconify-json/material-symbols`), Tailwind CSS 4 (`@tailwindcss/vite`), Zod (via `astro:content`)

**Storage**: Astro Content Collections — YAML (`profile.yaml`, `skills.yaml`, new `experience.yaml`) validated by Zod schemas in `src/content.config.ts`. No database.

**Testing**: No automated unit tests required (constitution). Quality gates: `astro build` succeeds, `astro check`/TypeScript clean, Zod content validation at build, manual a11y/responsive review, Lighthouse budgets.

**Target Platform**: Static site deployed to GitHub Pages via CI.

**Project Type**: Single Astro static site (island architecture); frontend only.

**Performance Goals**: Lighthouse Performance ≥ 95, Accessibility 100, SEO 100, LCP < 1.5s, CLS < 0.05 (per `.skills/design.md`).

**Constraints**: Mobile-first; shared mobile/tablet tier below 1024px `lg`; tap targets ≥ 44px; effectively zero client JS on reading pages; all motion respects `prefers-reduced-motion`; content must be Zod-validated (build fails on malformed content); external links open in a new tab with `rel="noopener noreferrer"`.

**Scale/Scope**: One page (`index.astro`) restructured; shared `NavBar` edited; ~2 new components (Core Expertise section, Contact section); `SkillPill` reused; Hero illustration asset swapped; 3 content files + 1 schema file touched.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Assessment | Status |
|-----------|-----------|--------|
| I. Content-First Reading Experience | Core Expertise, Contact, and Experience content live in collections, not components. Hero illustration is decorative with descriptive `alt`; no text baked into the image. Layout stays single reading flow. | PASS |
| II. Performance & Accessibility | No client JS added; contact links are semantic `<a target="_blank" rel="noopener noreferrer">` with accessible labels; new/updated icons keep explicit media dimensions (no CLS); AA contrast reuses existing tokens. | PASS |
| III. Mobile-First Responsive | Pills wrap via existing flex pattern; sections reuse mobile-first `--space-*` scale; tap targets ≥ 44px on contact links; NavBar simplification keeps small-screen fallbacks. | PASS |
| IV. Minimal, Purposeful Interactivity | No new interactivity. Removing the Contact tab reduces surface. No animation added beyond existing `data-reveal`. | PASS |
| V. Type-Safe Content Model | Refined `skills` (categories + page flags), `profile.contacts`, and new `experience` array all get Zod schemas; malformed content fails the build. | PASS |

**Result**: PASS (initial). No violations → Complexity Tracking not required. Re-evaluated post-design: still PASS (see end of Phase 1).

## Project Structure

### Documentation (this feature)

```text
specs/002-refine-home-page/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output (content schema contracts)
│   └── content-schemas.md
├── checklists/
│   └── requirements.md  # Created by /speckit.specify
├── spec.md
└── tasks.md             # Created by /speckit.tasks (NOT this command)
```

### Source Code (repository root)

```text
src/
├── content.config.ts            # EDIT: skills schema → categories+pages; profile → contacts; experience → YAML array loader
├── content/
│   ├── profile.yaml             # EDIT: add contacts list; update photo/photoAlt for new illustration
│   ├── skills.yaml              # REWRITE: category-grouped structure with per-category page flags
│   ├── experience.yaml          # NEW: single ordered array (replaces experience/*.md)
│   └── experience/*.md          # REMOVE: migrated into experience.yaml
├── components/
│   ├── NavBar.astro             # EDIT: remove Contact tab (+ its responsive rule)
│   ├── Hero.astro               # EDIT (minor): point to new illustration; alt text
│   ├── CoreExpertiseSection.astro  # NEW: renders home-eligible categories, top-3 pills each
│   ├── ContactSection.astro     # NEW: "Get in Touch" external new-tab links (icon + text)
│   ├── ExperienceSection.astro  # EDIT: consume reversed array (drop slice-by-order assumption)
│   ├── SkillPill.astro          # REUSE (already supports optional icon → name-only)
│   └── SkillsSection.astro      # REMOVE (replaced by CoreExpertiseSection)
├── pages/
│   └── index.astro              # EDIT: new section order + data wiring; remove SkillsSection
└── assets/ (or public/images/)  # NEW: developer illustration SVG asset

astro.config.mjs                 # EDIT: add new simple-icons/material-symbols to icon allowlist
```

**Structure Decision**: Single Astro static-site project (existing layout). Changes are localized to `src/content*`, `src/components`, `src/pages/index.astro`, one new SVG asset, and the `astro-icon` config allowlist. No new top-level directories.

## Complexity Tracking

> No constitution violations. Section intentionally empty.
