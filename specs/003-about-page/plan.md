# Implementation Plan: About Page

**Branch**: `003-about-page` | **Date**: 2026-07-15 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/003-about-page/spec.md`

## Summary

Add a static, reading-optimized `/about` page that presents, top-to-bottom, five content
sections plus a closing call-to-action: (1) Professional Summary & Highlights, (2) Skills by
category, (3) Work Experience, (4) Achievements, (5) Education, then a "Looking for more details?"
CTA linking to `/cv`. All content is sourced from type-safe Astro Content Collections. The page
reuses the existing shared layout, bottom navigation (which already lists "About"), theme, and
`design.md` design tokens. Work Experience is rendered LinkedIn-style (no timeline UI): a
hairline-separated list with a company logo on the left. The content model is extended by reusing
`profile` (add `highlights`), reusing `skills` (filtered by the `about` page flag), extending
`experience` (add `summary`), and adding two new collections: `education` and `achievements`.

## Technical Context

**Language/Version**: TypeScript 5.x on Astro 5 (static output).

**Primary Dependencies**: Astro, Tailwind CSS v4 (`@tailwindcss/vite`), `astro-icon` (Iconify:
`@iconify-json/logos`, `simple-icons`, `material-symbols`), Motion One (for the existing
`data-reveal` entrance motion). No new runtime dependencies required.

**Storage**: Astro Content Collections (YAML) validated by Zod in `src/content.config.ts`.
Collections: `profile`, `skills`, `experience` (extended), plus new `education`, `achievements`.

**Testing**: No automated tests required (Constitution: type-check + `astro build` + Zod
validation + Lighthouse + manual review are the gates).

**Target Platform**: Static site deployed to GitHub Pages.

**Project Type**: Single static web application (Astro), single project structure.

**Performance Goals**: Lighthouse Performance ≥ 95, Accessibility 100, SEO 100; LCP < 1.5s;
CLS < 0.05 (per `design.md` / Constitution Principle II).

**Constraints**: Zero client JavaScript on the reading page beyond the existing theme-toggle and
navigation islands. Explicit media dimensions on all images to preserve no-CLS. WCAG 2.1 AA in
both themes. Single-column, mobile-first reading layout; wider viewports add margin, not line
length.

**Scale/Scope**: One new route (`/about`), five content sections + one CTA, two new content
collections, four/five new presentational components, two schema extensions. Content volume is
small (a handful of experience/education/achievement entries).

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Assessment | Status |
|-----------|------------|--------|
| I. Content-First Reading Experience | Long-form single-column `/about`; prose within `--container-prose`; no text baked into images; no mid-paragraph motion. | PASS |
| II. Performance & Accessibility | No new client JS; images carry explicit `width`/`height`; semantic landmarks + single `<h1>`; AA contrast via existing tokens; CTA is a plain link. | PASS |
| III. Mobile-First Responsive | Base styles target mobile single column; `min-width` breakpoints only add margin; tap targets ≥ 44px (CTA/link). | PASS |
| IV. Minimal, Purposeful Interactivity | Reuses existing `data-reveal` fades honoring `prefers-reduced-motion`; adds no new interactivity. | PASS |
| V. Type-Safe Content Model | All new content in Content Collections with Zod; new `education`/`achievements` collections and `profile`/`experience` extensions fail the build if malformed. | PASS |

**Result**: PASS (initial). No violations → Complexity Tracking omitted.

## Project Structure

### Documentation (this feature)

```text
specs/003-about-page/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/
│   └── content-schemas.md   # Phase 1 output (content-shape contracts)
├── checklists/
│   └── requirements.md  # Existing spec-quality checklist
└── tasks.md             # Phase 2 output (/speckit.tasks — NOT created here)
```

### Source Code (repository root)

```text
src/
├── content.config.ts               # Extend: experience(+summary), profile(+highlights);
│                                   #   add education, achievements collections
├── content/
│   ├── profile.yaml                # Add highlights[] (point-form array)
│   ├── skills.yaml                 # Reused as-is (filter by pages includes 'about')
│   ├── experience.yaml             # Add summary to each entry
│   ├── education.yaml              # NEW — array of education entries
│   └── achievements.yaml           # NEW — array of achievement entries
├── components/
│   ├── AboutSummary.astro          # NEW — professional summary + highlights list
│   ├── AboutSkills.astro           # NEW — categories (about flag) → all skills as pills
│   ├── WorkExperienceList.astro    # NEW — LinkedIn-style hairline list, logo left, +summary
│   ├── EducationList.astro         # NEW — same visual format as experience entries
│   ├── AchievementList.astro       # NEW — name-first list (optional issuer/date/link)
│   ├── CvCallout.astro             # NEW — "Looking for more details?" + /cv link
│   ├── SkillPill.astro             # Reused
│   └── NavBar.astro                # Reused (already links About → /about)
└── pages/
    └── about.astro                 # NEW — assembles the five sections + CTA in fixed order

public/images/
├── logos/                          # Existing company logos (experience)
└── education/                      # NEW — institution logos/images (optional dir)
```

**Structure Decision**: Single Astro project (Option 1). The About page is one new route that
composes new presentational components over the existing Content Collections; no backend or
additional project boundaries are introduced.

## Phase 0 — Research

See [research.md](./research.md). All Technical Context items are known (stack fixed by the
Constitution); research focuses on the small set of design decisions this feature introduces
(experience presentation, skills display scope, education/achievement modeling, CTA styling,
ordering). No `NEEDS CLARIFICATION` markers remain.

## Phase 1 — Design & Contracts

- [data-model.md](./data-model.md): entity definitions and schema changes for `profile`
  (+`highlights`), `experience` (+`summary`), and the new `education` and `achievements`
  collections; ordering and display rules.
- [contracts/content-schemas.md](./contracts/content-schemas.md): the content-shape contracts
  (the "interface" this static site exposes to content authors) — required/optional fields,
  validation patterns, and failure behavior.
- [quickstart.md](./quickstart.md): runnable validation steps proving `/about` renders all five
  sections in order plus the CTA, and that malformed content fails the build.

**Post-Design Constitution Re-check**: PASS — the design adds only static content + presentational
components, keeps zero new client JS, and stays within the type-safe content contract.
