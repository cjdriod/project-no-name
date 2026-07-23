# Quickstart: Projects Page

Validation guide to confirm the Projects feature works end-to-end. See [data-model.md](./data-model.md) and [contracts/projects-content.md](./contracts/projects-content.md) for field details.

## Prerequisites

- Node + project dependencies installed (`npm install`)
- Working from repo root: `c:\Users\U10113753\test\project-no-name`

## Setup

1. Ensure `src/content/projects.yaml` exists with the 5 projects (oldest→newest), per the content contract.
2. Ensure `public/images/project-placeholder.svg` exists.
3. Ensure `projects` is registered in `src/content.config.ts` and any new icons are added to `astro.config.mjs`.

## Run

```powershell
# Dev server (background mode per project convention)
npx astro dev --background
# Manage with: npx astro dev status | npx astro dev logs | npx astro dev stop
```

Open `http://localhost:4321/projects`.

## Validation scenarios

| # | Action | Expected outcome | Spec ref |
| --- | --- | --- | --- |
| 1 | Load `/projects` | All 5 projects render as cards with image, title, description, plain-text tech labels | FR-001/002/003, US1 |
| 1b | Inspect a card | Source/website links are grouped as an action group at the **bottom** of the card | FR-019 |
| 2 | Inspect order | Latest-authored project (highest yaml index) appears first | Plan input |
| 3 | Resize to mobile/tablet (< 1024px) | Cards stack in a single column; no horizontal scroll; tap targets ≥ 44px | FR-013/015, US1 |
| 4 | Resize to desktop (≥ 1024px) | Cards form the multi-column project grid | FR-013 |
| 5 | Click a card's source link | Repo opens in a **new tab**; link shows external icon | FR-004/006/007, US2 |
| 6 | Click a website link (project with `siteHref`) | Live site opens in a new tab with external icon | FR-005/006/007, US2 |
| 7 | Inspect a project without `siteHref` | No website link is shown | FR-005, US2 |
| 8 | Break/rename an image path in yaml | Card shows the placeholder project SVG, no broken image, no layout shift | FR-016, edge case |
| 9 | Click "View more" | GitHub profile (from `profile.contacts`) opens in a new tab with external icon | FR-008/009, US3 |
| 10 | On `/projects`, view bottom nav | Projects tab shows active/current state | FR-011, US4 |
| 11 | Resize below 1024px | Projects tab is hidden in the bottom nav; reappears at ≥ 1024px | FR-017, clarification |
| 12 | From home hero, click projects CTA | Navigates to `/projects` | FR-012, US4 |
| 13 | Enable `prefers-reduced-motion` | Reveal/hover motion is suppressed | FR-014 |

## Build & quality gates (per constitution)

```powershell
npx astro build      # must succeed; Zod validates projects.yaml at build time
npx astro check      # TypeScript: no errors
```

- Content validation: invalid/missing fields in `projects.yaml` fail the build.
- Accessibility: keyboard nav, visible focus, one `<h1>`, AA contrast in both themes.
- Performance: Lighthouse budgets from .skills/design.md met (no CLS from card images).

## Expected result

A responsive `/projects` page listing the 5 projects latest-first, with working source/website/View-more external links (new tab + icon), placeholder fallback for bad images, and a bottom-nav Projects tab that is active on the page and hidden below the desktop breakpoint.
