# Implementation Plan: CV Page

**Branch**: `005-cv-page` | **Date**: 2026-07-22 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/005-cv-page/spec.md`

## Summary

Add a `/cv` route that renders a document-style, print-ready CV built from the existing Astro Content Collections (extended additively). The page presents eight ordered sections (General information → Profile → Professional experience → Certification → Skills → Education → Recent activities → Language), a dismissable "simpler view" alert linking to `/about`, a build-time-generated QR code (via the installed `qrcode` lib, rendered inline as SVG), and a discreet print/share control. Printing uses a dedicated `@media print` stylesheet with A4 geometry, forced light theme, and hidden chrome. Sharing uses `navigator.share` with a copy-to-clipboard fallback. A CV nav entry is inserted as the third item, hidden below `md`. All interactivity is confined to hydrated islands.

## Technical Context

**Language/Version**: TypeScript (per constitution), Node ≥ 22.12; Astro 7.

**Primary Dependencies**: Astro 7 (static output), Tailwind CSS v4 (`@tailwindcss/vite`), `astro-icon` + Iconify (`@iconify-json/logos`, `@iconify-json/material-symbols`, `@iconify-json/simple-icons` — **installed**), `qrcode@1.5.4` (already installed; add `@types/qrcode` dev dep — still pending), Astro Content Collections + Zod.

**Storage**: Flat-file YAML content collections in `src/content/*.yaml`, validated by Zod in `src/content.config.ts`. No database.

**Testing**: No automated unit tests required (constitution). Quality via `astro build`, `astro check` (TypeScript), Zod build-time validation, Lighthouse budgets, and manual print/a11y review.

**Target Platform**: Static site deployed to **GitHub Pages** (personal/user page). `site` and `base` must be set in `astro.config.mjs`; use documented placeholders until the real URL is provided (user page → `base: '/'`).

**Project Type**: Astro static web app (single project, island architecture).

**Performance Goals**: Reading-page budgets from `design.md`/constitution — Performance ≥ 95, Accessibility 100, SEO 100, LCP < 1.5s, CLS < 0.05. Zero client JS except hydrated islands (share modal, print button, alert dismiss).

**Constraints**: WCAG 2.1 AA, mobile-first, no animation on the CV page, no CLS (explicit QR dimensions), print output ATS-friendly + selectable text on A4.

**Scale/Scope**: One new route, ~1 page component, ~4–6 new island/section components, additive schema changes to 5 collections + 1 new collection, 1 print stylesheet, config changes.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Assessment | Status |
|-----------|-----------|--------|
| I. Content-First Reading Experience | Document-style, static, no animation, no eyebrow labels; content from collections. | ✅ Pass |
| II. Performance & Accessibility Baseline | Islands only for share/print/alert; semantic landmarks, one `<h1>`, focus states, AA contrast, explicit QR dimensions (no CLS). | ✅ Pass |
| III. Mobile-First Responsive | Base styles small-viewport; nav CV entry and QR revealed at breakpoints via min-width. | ✅ Pass |
| IV. Minimal, Purposeful Interactivity | JS limited to share (native+copy fallback), print trigger, alert dismiss — each genuinely requires interaction; no gimmicks; CV page has no motion. | ✅ Pass |
| V. Type-Safe Content Model | All new fields added to Zod collections; build fails on malformed content. | ✅ Pass |
| Quality Gate 7 (Print/CV export) | Dedicated `@media print`, A4 geometry, forced light theme, selectable text, chrome hidden. | ✅ Pass |

**Post-Design re-check**: No new violations introduced (see Phase 1). Complexity Tracking left empty — no deviations to justify.

## Project Structure

### Documentation (this feature)

```text
specs/005-cv-page/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
│   ├── cv-route.md          # /cv route + tel query contract
│   ├── share-behavior.md    # navigator.share + copy fallback contract
│   └── content-collections.md # extended/new collection schemas
└── checklists/
    └── requirements.md  # Spec quality checklist (already present)
```

### Source Code (repository root)

```text
src/
├── content/
│   ├── profile.yaml              # + legalName, professionalSummary, languages, contact.monoIcon (no phone)
│   ├── experience.yaml           # + achievements[] per entry
│   ├── education.yaml            # + achievements[] per entry
│   ├── achievements.yaml         # + keywords[] per entry
│   └── activities.yaml           # NEW — recent activities (title, year)
├── content.config.ts             # extend schemas + add `activities` collection
├── pages/
│   └── cv.astro                  # NEW — /cv route, build-time QR, section assembly
├── components/
│   └── cv/
│       ├── CvAlert.astro         # NEW — dismissable "simpler view" alert (island)
│       ├── CvGeneralInfo.astro   # NEW — legal name/role/contacts + QR, tel handling
│       ├── CvSection.astro       # NEW — thick-underline titled section wrapper
│       ├── CvExperience.astro    # NEW — timeline w/ achievements (reversed)
│       ├── CvCertifications.astro# NEW — 2-line list w/ optional link+icon (reversed)
│       ├── CvSkills.astro        # NEW — skills grouped by category
│       ├── CvEducation.astro     # NEW — reversed, achievements list
│       ├── CvActivities.astro    # NEW — reversed, title + year
│       ├── CvLanguages.astro     # NEW — pipe-separated languages
│       └── CvActions.astro       # NEW — discreet print/share control + share modal (island)
├── scripts/
│   ├── cv-share.ts               # NEW — navigator.share + clipboard fallback, tel qs build
│   └── cv-phone.ts               # NEW — phone parse/validate/format helpers (shared client/build)
└── styles/
    └── global.css                # + @media print block for /cv (or scoped in cv.astro)

astro.config.mjs                  # + site/base (GitHub Pages) + simple-icons include
package.json                      # @iconify-json/simple-icons (installed); + @types/qrcode (dev, pending)
```

**Structure Decision**: Single Astro project (Option 1). CV components live under `src/components/cv/` to keep the new surface cohesive and separable from existing home/about/projects components. Shared phone logic is factored into `src/scripts/cv-phone.ts` so build-time render (URL `tel` → display) and client-time share (input → `tel` qs) use identical validation/formatting.

## Complexity Tracking

> No constitution violations. No entries required.
