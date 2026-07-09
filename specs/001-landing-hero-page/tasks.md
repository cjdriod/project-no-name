---
description: "Task list for Landing Hero Page implementation"
---

# Tasks: Landing Hero Page

**Input**: Design documents from `/specs/001-landing-hero-page/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: Not included. Automated unit tests are NOT required for this project (Constitution
testing policy) and none were requested. Verification is via `astro build` + type-check +
manual accessibility/responsive review (see quickstart.md).

**Organization**: Tasks are grouped by user story (P1 â†’ P2 â†’ P3) so each story is an
independently implementable, testable increment.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies on incomplete tasks)
- **[Story]**: US1 / US2 / US3 (Setup/Foundational/Polish have no story label)
- All paths are repository-relative (single Astro project per plan.md)

## Path Conventions

Single Astro project. Source under `src/`, static assets under `public/`.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Dependencies and project scaffolding needed before anything else.

- [X] T001 Confirm skill/UI icon packs are installed: `@iconify-json/material-symbols` and `@iconify-json/simple-icons` are both present in package.json (both installed as of 2026-07-09) â€” run `npm install` if a fresh checkout lacks them
- [X] T002 Verify `astro-icon` integration is enabled in astro.config.mjs (`integrations: [icon()]`) so `<Icon>` resolves local Iconify packs; add if missing
- [X] T003 [P] Create asset directory and hero portrait placeholder at public/images/portrait-placeholder.svg (referenced by profile.photo)
- [X] T004 [P] Create company logo placeholders public/images/logos/company-a.svg, company-b.svg, company-c.svg (referenced by experience photos)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Design tokens, content schema, layout shell, and page container that ALL user
stories depend on.

**âš ï¸ CRITICAL**: No user story work can begin until this phase is complete.

- [X] T005 Implement design tokens + base styles in src/styles/global.css: import Tailwind v4; declare `design.md` tokens (colors for light `[data-theme="light"]`/dark `[data-theme="dark"]`, spacing, radii, type scale, fonts, easing) and expose them to Tailwind via `@theme`; add `.no-transition`, `:focus-visible`, and the `[data-reveal]` / `.is-ready` reveal rules with a `prefers-reduced-motion` block (FR-012/013)
- [X] T006 Define type-safe content collections in src/content.config.ts using Zod schemas for `profile`, `experience`, and `skills` per contracts/content-schema.md (experience `start`/`end` regex `^[A-Z][a-z]{2}-\d{4}$` or `Present`; skill `icon` **optional**, shaped `set:name` when present) (Constitution V, FR-011)
- [X] T007 Implement src/layouts/Layout.astro: `<html lang>`, head meta + `<title>`/description props, Inter + JetBrains Mono `<link>`s, inline no-flash theme init script (localStorage â†’ prefers-color-scheme â†’ light, set `data-theme` before paint), `no-transition`â†’`is-ready` toggle on first `requestAnimationFrame`, global.css import, `<slot/>` (FR-008)
- [X] T008 Create home page shell src/pages/index.astro: use Layout, add "Skip to content" link, a `<main id="home">` container that is full-width with gutters on mobile and centered at `--container-wide` (1200px, home-sections container per design.md Â§4.1) from `lg` up (FR-015); leave slots to compose Hero/Experience/Skills/NavBar in later phases

**Checkpoint**: Tokens, theme, content schema, and responsive page shell exist â€” user stories can begin.

---

## Phase 3: User Story 1 - Understand who the person is and reach key actions (Priority: P1) ðŸŽ¯ MVP

**Goal**: A visitor lands on `/` and immediately sees the tagline, greeting, identity (Full
Stack Developer), a short description, and two CTAs (View Projects â†’ `/projects`, View CV â†’
`/cv`).

**Independent Test**: Load `/`; confirm the hero shows tagline, greeting, `<h1>` name, role,
description, and exactly two working CTAs with the correct targets.

### Implementation for User Story 1

- [X] T009 [US1] Author profile content src/content/profile.yaml with finalized copy from spec FR-002 (tagline "System design & sustainable solutions", greeting, name, role "Full Stack Developer", description, photo `/images/portrait-placeholder.svg`, photoAlt, projectsHref `/projects`, cvHref `/cv`) validating against the `profile` schema
- [X] T010 [US1] Implement src/components/Hero.astro (props: profile entry) rendering, in order, tagline â†’ greeting â†’ `<h1 id="hero-title">` name â†’ role â†’ description â†’ two CTAs â†’ placeholder portrait `<img>` with explicit width/height + descriptive alt (FR-020); CTA icons via `<Icon name="material-symbols:...">` marked `aria-hidden`; each CTA a â‰¥44px target with distinct hover/focus/active states (FR-003); apply `data-reveal` with staggered `--reveal-delay` (FR-001/002/003/012); style CTAs as primary/secondary per design.md Â§7.2
- [X] T011 [US1] Load the `profile` entry in src/pages/index.astro (`getEntry`) and render `<Hero>` as the first child of `<main>` (FR-001)

**Checkpoint**: Home page delivers the MVP â€” identity + both CTAs â€” independently testable.

---

## Phase 4: User Story 2 - Persistent bottom nav bar navigation with theme toggle (Priority: P2)

**Goal**: A persistent pill-style bottom navigation bar provides Home/About/Projects/Contact me route
links plus a light/dark theme toggle that persists and avoids a flash.

**Independent Test**: Nav bar is visible on all viewports; the four items link to `/`, `/about`,
`/projects`, `/contact`; the toggle switches theme, persists across reload, and honors system
preference with no flash.

### Implementation for User Story 2

- [X] T012 [P] [US2] Implement src/components/ThemeToggle.astro: `<button>` with an accessible name that flips `data-theme` on `<html>`, persists to `localStorage.theme`, and swaps sun/moon `material-symbols` icons; the icon reflects the current theme (explicit `aria-pressed` exposure is optional per FR-006) (FR-006/007)
- [X] T013 [US2] Implement src/components/NavBar.astro: fixed, centered bottom `<nav aria-label="Primary">` with four icon links (Home `/`, About `/about`, Projects `/projects`, Contact me `/contact`) using `material-symbols` icons + `aria-label` + tooltip, `aria-current="page"` on Home, â‰¥44px targets, separator, and embedded `<ThemeToggle/>`; active route shown as a highlighted pill (glow/highlight) + `aria-current="page"` â€” distinguished by shape + fill + `aria-current`, not color alone â€” NOT a magnify/scale effect (motion minimal, reduced-motion-safe); pill shape `--radius-full` (design.md Â§7.4) on a solid `--surface` fill + hairline border + shadow (Â§7.1 "solid fill preferred"); at very narrow widths hide lower-priority links in order (Projects, then Contact me) via CSS media queries so the bar never overflows while Home/About/toggle stay reachable â€” no JS overflow menu (FR-004/017/018/014)
- [X] T014 [US2] Render `<NavBar/>` in src/pages/index.astro (after `<main>`) so it is present on the landing route; ensure `<main>` has bottom padding so the fixed nav bar never obscures content/CTAs on small phones (FR-004, Edge Cases)

**Checkpoint**: Navigation + theming work end to end alongside the hero.

---

## Phase 5: User Story 3 - Skim recent experience and skills at a glance (Priority: P3)

**Goal**: Below the hero, show exactly three recent roles (company, photo, position,
`{short_month}-{year}` startâ€“end) and a set of icon+text skill pills.

**Independent Test**: Experience section shows exactly three entries with all four fields and
`Present` for a current role; skills render as pill-shaped icon+text badges.

### Implementation for User Story 3

- [X] T015 [P] [US3] Author three experience entries src/content/experience/company-a.md, company-b.md, company-c.md (frontmatter: company, position, photo, start `MMM-yyyy`, end `MMM-yyyy`|`Present`, order 1â€“3) validating against the `experience` schema (FR-009/010)
- [X] T016 [P] [US3] Author src/content/skills.yaml as an icon+text list grounded in the real stack/domains (e.g. `simple-icons:javascript`, `:typescript`, `:vuedotjs`, `:angular`, `:openjdk`, `:amazonwebservices`, `:microsoftazure`, plus system design/DevSecOps/CI-CD/observability using suitable `material-symbols` glyphs) validating against the `skills` schema (FR-011)
- [X] T017 [P] [US3] Implement src/components/ExperienceCard.astro (props: company, position, photo, photoAlt?, start, end) showing only those fields, rendering `start â€” end`, with `<img>` alt (default `${company} logo`) + explicit dimensions so text stays readable if the image fails (FR-009, Edge Cases)
- [X] T018 [US3] Implement src/components/ExperienceSection.astro (`<section id="experience">` + heading, `<ul>`/`<li>` of `ExperienceCard`) accepting the pre-sorted, capped-to-3 items; apply `data-reveal` stagger
- [X] T019 [P] [US3] Implement src/components/SkillPill.astro (props: name, icon?) rendering a pill = optional `<Icon name={icon} aria-hidden>` + `{name}` text; when no suitable brand icon is provided it MUST render text-only without breaking layout (FR-011); pill shape per design.md Â§7.4, legible in both themes
- [X] T020 [US3] Implement src/components/SkillsSection.astro (`<section id="skills">` + heading, wrapping flex of `SkillPill`) accepting the skills list; apply `data-reveal`
- [X] T021 [US3] In src/pages/index.astro, load `experience` (`getCollection`, sort by `order`, cap to first 3) and `skills`, then render `<ExperienceSection>` and `<SkillsSection>` inside `<main>` after the hero (FR-009/011)

**Checkpoint**: All three sections render; every user story is independently functional.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Verification and refinements spanning all stories.

- [X] T022 [P] Accessibility pass: verify single `<h1>`, landmark regions, skip link, keyboard reachability + visible focus for all nav links/toggle/CTAs, `aria` on icon-only controls, `aria-current="page"` on the active route, and descriptive alt text on the portrait + experience photos (FR-014/017/019/020, quickstart Â§13)
- [X] T023 [P] Contrast + theme pass: confirm AA text/UI contrast in BOTH light and dark themes, including skill brand marks, and no theme flash on first load (FR-008, SC-007, quickstart Â§8/Â§15)
- [X] T024 [P] Responsive pass: verify no horizontal scroll and correct full-widthâ†’`--container-wide` (1200px) behavior from 320px through 1536px+, that the nav bar never obscures actions, and that at very narrow widths Projects then Contact me collapse out while Home/About/toggle stay reachable and the bar does not overflow (FR-015/018, SC-006, quickstart Â§8a/Â§14)
- [X] T025 [P] Reduced-motion pass: with `prefers-reduced-motion`, confirm all content is immediately visible and no reveal animation runs (FR-013, SC-005, quickstart Â§12)
- [X] T026 Copy/tone review: verify all authored content (profile, experience, skills) reads calm, confident, and professional, avoids hype/superlatives/sales language, and has no redundancy, consistent with design.md and FR-016
- [X] T027 Remove leftover starter file src/components/Welcome.astro if present, and confirm no unused imports remain
- [X] T028 Run `npm run build` (must succeed â€” validates Zod content + icon names + types), then `npm run preview` and execute the quickstart.md validation scenarios end to end
- [X] T029 [P] Performance & SEO pass: run Lighthouse against the built `/` page and confirm the Constitution II / design.md budgets are met â€” Performance â‰¥ 95, SEO 100, LCP < 1.5s, CLS < 0.05 (explicit media dimensions on portrait + logos), and effectively zero client JS beyond the theme island (Constitution II, Quality Gate 5)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies â€” start immediately.
- **Foundational (Phase 2)**: Depends on Setup â€” BLOCKS all user stories.
- **User Stories (Phase 3â€“5)**: All depend on Foundational. US1 (P1) is the MVP; US2 and US3
  can then proceed in priority order or in parallel by different people.
- **Polish (Phase 6)**: Depends on all targeted stories being complete.

### User Story Dependencies

- **US1 (P1)**: Depends only on Foundational. No dependency on US2/US3.
- **US2 (P2)**: Depends only on Foundational (theme init already provided by Layout in T007).
  Independent of US1/US3.
- **US3 (P3)**: Depends only on Foundational. Independent of US1/US2.

### Shared-file note (affects parallelism)

`src/pages/index.astro` is edited by T011 (US1), T014 (US2), and T021 (US3). These composition
tasks touch the same file, so they must run **sequentially** relative to each other (not `[P]`),
even though the rest of each story is independent. Each story's *components/content* can be
built in parallel; only the final wire-in serializes.

### Within Each User Story

- Content/data (yaml/md) and leaf components can be built in parallel `[P]`.
- Section wrappers depend on their leaf components (e.g. T018 after T017; T020 after T019).
- The `index.astro` wire-in is last within each story.

---

## Parallel Opportunities

- **Setup**: T003 and T004 (`[P]`) run together; T001 before T002.
- **Foundational**: mostly sequential ownership, but T005 (styles) is independent of T006
  (schema); T007 (Layout) and T008 (page shell) follow.
- **US3 leaf work**: T015, T016, T017, T019 are all `[P]` (distinct files) â€” build them
  together, then T018 â†’ T020 â†’ T021.
- **Polish**: T022â€“T025 and T029 are all `[P]` (independent verification passes).
- **Across stories**: once Foundational is done, US1/US2/US3 component+content work proceeds in
  parallel; only the three `index.astro` wire-ins serialize.

### Parallel Example: User Story 3

```text
# After Foundational, launch US3 leaf tasks together:
Task: "Author src/content/experience/*.md"                     (T015)
Task: "Author src/content/skills.yaml"                          (T016)
Task: "Implement src/components/ExperienceCard.astro"          (T017)
Task: "Implement src/components/SkillPill.astro"               (T019)
# then sequentially:
Task: "Implement ExperienceSection.astro"  (T018, needs T017)
Task: "Implement SkillsSection.astro"      (T020, needs T019)
Task: "Wire sections into index.astro"     (T021, needs T018/T020)
```

---

## Implementation Strategy

### MVP First (User Story 1 only)

1. Phase 1: Setup â†’ 2. Phase 2: Foundational â†’ 3. Phase 3: US1.
4. **STOP and VALIDATE**: load `/`, confirm identity + both CTAs (Independent Test for US1).
5. Deploy/demo â€” this is the MVP.

### Incremental Delivery

1. Setup + Foundational â†’ foundation ready.
2. US1 â†’ validate â†’ demo (MVP).
3. US2 â†’ validate nav bar + theme â†’ demo.
4. US3 â†’ validate experience + skills â†’ demo.
5. Polish (T022â€“T029) â†’ final build + quickstart validation.

### Parallel Team Strategy

After Foundational: Dev A â†’ US1, Dev B â†’ US2, Dev C â†’ US3. Coordinate only on the shared
`index.astro` wire-in tasks (T011/T014/T021), which must be serialized.

---

## Notes

- `[P]` = different files, no incomplete dependencies.
- `[Story]` labels map tasks to US1/US2/US3 for traceability.
- No automated tests per Constitution; the quality gate is `npm run build` + quickstart.md.
- Hero portrait intentionally remains a placeholder (owner has no final image yet).
- `/about`, `/projects`, `/contact`, `/cv` routes are out of scope â€” tasks only ensure the
  links/CTAs point to them.
- Commit after each task or logical group; stop at any checkpoint to validate a story.


