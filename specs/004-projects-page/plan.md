# Implementation Plan: Projects Page

**Branch**: `004-projects-page` | **Date**: 2026-07-17 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/004-projects-page/spec.md`

## Summary

Add a static `/projects` index page that renders the author's curated projects as a responsive card grid. Each card shows an image (with an SVG placeholder fallback for missing/broken/oversized images), title, short description, plain-text technology labels (no icons), and a **card action group anchored at the bottom** containing a source-code link and an optional live-website link — external links open in a new tab with an "open in new" icon. A "View more" action at the end of the section links to the GitHub profile sourced from the existing profile contacts. Project content lives in a new type-safe `projects` Content Collection backed by `src/content/projects.yaml`, authored as an **array ordered oldest → newest**; the page renders it **reversed** so the latest project appears first. The bottom-nav Projects tab and the home hero CTA (both already targeting `/projects`) resolve to this page; the Projects tab shows its active state on `/projects` and stays hidden below the `lg` (1024px) breakpoint.

## Technical Context

**Language/Version**: TypeScript 5.x, Astro 5.x (static output)

**Primary Dependencies**: Astro, Astro Content Collections + Zod, `astro-icon` (Iconify), Tailwind CSS v4 (`@tailwindcss/vite`), Motion One (existing reveal utility via `data-reveal`)

**Storage**: Flat-file content — new `src/content/projects.yaml` (YAML array), loaded with Astro's `file()` loader

**Testing**: No automated unit tests required (per constitution). Verification via `astro build` + TypeScript, Zod content validation at build, manual responsive/a11y review, Lighthouse budgets

**Target Platform**: Static site deployed to GitHub Pages; modern evergreen browsers, mobile-first

**Project Type**: Single static Astro web project (frontend only)

**Performance Goals**: design.md Lighthouse budgets — Performance ≥ 95, Accessibility 100, SEO 100, LCP < 1.5s, CLS < 0.05

**Constraints**: Effectively zero client JS on the reading page (only a minimal inline image `onerror` fallback); no layout shift (fixed card image aspect ratio); WCAG 2.1 AA; `prefers-reduced-motion` respected; touch targets ≥ 44px

**Scale/Scope**: One new page, two new components, one new content collection, 5 projects today (grows without redesign); minor NavBar breakpoint adjustment

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Compliance |
| --- | --- |
| **I. Content-First Reading Experience** | PASS — card grid uses design.md tokens/spacing; descriptions are short prose; no text baked into images; no animation mid-read. |
| **II. Performance & Accessibility as Baseline** | PASS — static page, near-zero JS; images lazy with fixed aspect ratio (no CLS); semantic list/landmarks, one `<h1>`, external links labelled "opens in a new tab", AA contrast via tokens. The only JS is a tiny inline `onerror` that swaps to the placeholder SVG — progressive, not an island, negligible cost. |
| **III. Mobile-First Responsive Design** | PASS — base is single column; multi-column grid added at `lg`+ per design.md §4/§5; Projects nav tab hidden below `lg`; tap targets ≥ 44px. |
| **IV. Minimal, Purposeful Interactivity** | PASS — reuses existing `data-reveal` fade/lift + card hover lift only; reduced-motion respected; no new island, no gimmicks. |
| **V. Type-Safe Content Model** | PASS — new `projects` collection with Zod schema; missing/invalid fields fail the build; nothing hardcoded in components. |
| **Technology Constraints** | PASS — Astro + TS + Tailwind tokens + Iconify + YAML/Zod; `projects (index + details)` scope respected (index only this feature, details explicitly deferred per spec). |

**Result**: PASS — no violations. Complexity Tracking not required.

## Project Structure

### Documentation (this feature)

```text
specs/004-projects-page/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/
│   └── projects-content.md   # Content-collection contract (schema + fixtures)
└── checklists/
    └── requirements.md  # Spec quality checklist (from /speckit.specify)
```

### Source Code (repository root)

```text
src/
├── content/
│   └── projects.yaml            # NEW — array of projects, oldest→newest
├── content.config.ts            # EDIT — register `projects` collection + Zod schema
├── components/
│   ├── ProjectsSection.astro    # NEW — section wrapper, reverse-render + "View more"
│   ├── ProjectCard.astro        # NEW — single card: image/placeholder, title, desc, plain-text tech labels, bottom action group
│   └── NavBar.astro             # EDIT — hide Projects tab below lg (1024px)
└── pages/
    └── projects.astro           # NEW — /projects route, Layout + NavBar

public/
└── images/
    └── project-placeholder.svg  # NEW — fallback project SVG

astro.config.mjs                 # EDIT — add any new Iconify glyphs (e.g. code icon, tech logos)
```

**Structure Decision**: Single static Astro project. Follow existing page conventions exactly: `projects.astro` mirrors `about.astro` (Layout + skip-link + `.*-shell` container + `<NavBar />`), a `ProjectsSection` mirrors `ExperienceSection`, and `ProjectCard` mirrors `ExperienceCard`. Reverse ordering uses `.toReversed()` exactly as `index.astro`/`about.astro` already do for experience.

## Complexity Tracking

No constitution violations — section intentionally empty.
