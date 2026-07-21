---

description: "Task list for Projects Page implementation"
---

# Tasks: Projects Page

**Input**: Design documents from `/specs/004-projects-page/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/projects-content.md, quickstart.md

**Tests**: Not included. Per the project constitution, automated unit tests are NOT required; quality is enforced via `astro build`, TypeScript checks, Zod content validation, and manual review.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1–US4)
- All paths are relative to the repository root `c:\Users\U10113753\test\project-no-name`

## Path Conventions

Single static Astro project: content in `src/content/`, schema in `src/content.config.ts`, components in `src/components/`, routes in `src/pages/`, static assets in `public/`.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Static assets and content scaffolding shared by all stories

- [X] T001 [P] Create the fallback SVG at `src/assets/images/project-placeholder.svg` (migrated from `public/images/`) — a calm, low-saturation "project" placeholder (e.g. framed-image/folder glyph) using design.md-consistent muted tones, with a fixed viewBox that matches the card image aspect ratio.
- [X] T002 [P] Create the projects cover-image folder `src/assets/images/projects/` and add the 5 project cover images referenced by `projects.yaml` as optimized SVG assets processed through Astro's `image()`/`<Image>` pipeline (superseding the earlier `public/images/projects/` + `<img>`/`onerror` fallback approach).

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Type-safe content model and seed content that every user story depends on

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T003 Register the `projects` collection in `src/content.config.ts`: add a `defineCollection` with `loader: file('src/content/projects.yaml')` and a Zod schema `{ id: string.min(1), title: string.min(1), description: string.min(1), image: image(), imageAlt: string.min(1), technologies: array(string.min(1)).min(1), sourceHref: string.url(), siteHref: string.url().optional() }` (updated to use the `image()` schema helper for build-time-validated, optimized cover images), then add `projects` to the exported `collections` object.
- [X] T004 Create `src/content/projects.yaml` as a top-level YAML **array** of exactly 5 projects ordered **oldest → newest** (oldest at lowest index), matching the schema in T003 and the contract in `contracts/projects-content.md`. Include at least one project **without** `siteHref` to exercise the optional website link. Use plain-text `technologies` (no icons).

**Checkpoint**: Content collection compiles and `astro build` validates `projects.yaml` — user story implementation can now begin.

---

## Phase 3: User Story 1 - Browse the project showcase (Priority: P1) 🎯 MVP

**Goal**: `/projects` renders all 5 projects as responsive cards showing image (with placeholder fallback), title, short description, and plain-text technology labels — latest first.

**Independent Test**: Navigate to `/projects`; confirm 5 cards render with image/title/description/tech labels, newest first, single column on mobile/tablet and multi-column grid on desktop, with the placeholder shown for any broken/missing image.

### Implementation for User Story 1

- [X] T005 [US1] Create `src/components/ProjectCard.astro` accepting a project's fields as props. Render a fixed-aspect-ratio image wrapper using Astro's `<Image>` component (`astro:assets`) with `src={image}` (an `ImageMetadata` resolved via the `image()` content-collection schema) and `alt={imageAlt}`, lazy-loaded — the `image()` schema guarantees a valid file at build time, so no runtime placeholder/`onerror` fallback is needed for the cover image. Below the image render the title, short description, and the `technologies` as plain-text pill tags (design.md §7.4, no icons). Use a vertical flex layout so a bottom slot is reserved for the action group (added in US2). Apply card styling per design.md §7.3/§7.6 (surface bg, 1px border, `--radius-lg`, `--shadow-sm`, hover lift `-2px`, respecting reduced motion).
- [X] T006 [US1] Create `src/components/ProjectsSection.astro` accepting `projects` items; render a semantic `<section>` with an intro heading and a `<ul>` grid of `ProjectCard`s, iterating the list **reversed** (`items.toReversed()`) so the latest project appears first. Style the grid single-column by default and multi-column at the `lg` (1024px) breakpoint within the `--container-wide` shell (design.md §4/§5); reuse the existing `data-reveal` reveal pattern with staggered `--reveal-delay`.
- [X] T007 [US1] Create `src/pages/projects.astro` route mirroring `src/pages/about.astro`: import `Layout`, `NavBar`, `ProjectsSection`, and the profile entry; load `await getCollection('projects')`; render a skip-link, a `<main class="projects-shell">` with an `<h1>`, the `ProjectsSection`, and `<NavBar />`. Set an appropriate `<title>`/description on `Layout`.

**Checkpoint**: `/projects` displays the 5 project cards (latest first) with images/placeholder, titles, descriptions, and tech labels — responsive across breakpoints. MVP viewable.

---

## Phase 4: User Story 2 - Open a project's source code or live website (Priority: P1)

**Goal**: Each card exposes a source-code link (always) and a website link (only when `siteHref` exists), grouped as a card action group at the bottom of the card, opening in a new tab with an external-link icon.

**Independent Test**: On each card, activate the source link and (where present) the website link; confirm each opens the correct URL in a new tab and shows an external icon; confirm cards without `siteHref` show no website link.

### Implementation for User Story 2

- [X] T008 [US2] In `src/components/ProjectCard.astro`, add the bottom **card action group**: a link row containing a source-code link (`href={sourceHref}`) always, and a website link (`href={siteHref}`) rendered only when `siteHref` is present. Give each anchor `target="_blank" rel="noopener noreferrer"`, an accessible label ending in "(opens in a new tab)", and a trailing `material-symbols:open-in-new-rounded` icon — reusing the external-link pattern from `src/components/ContactSection.astro`. Anchor the group to the bottom of the card's flex column so action rows align across cards in a row.
- [X] T009 [US2] If a source-code glyph is used on the source link, add it (e.g. `material-symbols:code-rounded`) to the `material-symbols` include list in `astro.config.mjs`; confirm `material-symbols:open-in-new-rounded` is already registered (it is).

**Checkpoint**: All cards have working source/website external links in a bottom action group; website link correctly omitted when absent.

---

## Phase 5: User Story 3 - See more work on GitHub (Priority: P2)

**Goal**: A "View more" action at the end of the projects section links to the author's GitHub profile (from `profile.contacts`), opening in a new tab; omitted if no GitHub contact exists.

**Independent Test**: Scroll to the end of the section, activate "View more", and confirm the GitHub profile opens in a new tab with an external icon; verify the URL matches the `github` entry in `profile.yaml`.

### Implementation for User Story 3

- [X] T010 [US3] In `src/components/ProjectsSection.astro`, accept the profile contacts (or the resolved GitHub href) as a prop, resolve the `channel === 'github'` contact's `href`, and render a "View more" link at the end of the section when present: `target="_blank" rel="noopener noreferrer"`, accessible label "(opens in a new tab)", `simple-icons:github` + `material-symbols:open-in-new-rounded` icons, styled as a secondary/ghost button per design.md §7.1. Omit the action entirely when no GitHub contact is found.
- [X] T011 [US3] In `src/pages/projects.astro`, pass the profile contacts (or GitHub href) from the loaded profile entry into `ProjectsSection` so the "View more" target is sourced from `profile.contacts` (no hard-coded URL).

**Checkpoint**: "View more" navigates to the GitHub profile from profile contacts in a new tab, or is absent when no GitHub contact exists.

---

## Phase 6: User Story 4 - Reach the page from primary navigation (Priority: P2)

**Goal**: The bottom-nav Projects tab links to `/projects`, shows active state on the page, and stays hidden below the `lg` breakpoint; the home hero projects CTA reaches `/projects`.

**Independent Test**: From home, activate the hero projects CTA → lands on `/projects`; from any page, activate the bottom-nav Projects tab → lands on `/projects` and is marked current; resize below 1024px → Projects tab hidden, reappears at ≥ 1024px.

### Implementation for User Story 4

- [X] T012 [US4] In `src/components/NavBar.astro`, change the responsive rule so the Projects nav item is hidden below `lg` (1024px) and shown at `lg`+: replace the current `@media (max-width: 440px) { .bottom-nav__item--projects { display: none; } }` with a rule that keeps `.bottom-nav__item--projects` hidden below 1024px and visible at `min-width: 1024px`. Confirm the existing `aria-current="page"` active-state logic already marks Projects current on `/projects` (no change needed).
- [X] T013 [US4] Verify the home hero projects CTA reaches `/projects`: confirm `src/content/profile.yaml` `projectsHref` is `/projects` and `src/components/Hero.astro` renders it — adjust only if it does not resolve to the new route.

**Checkpoint**: Both nav entry points resolve to `/projects`; Projects tab active on page and hidden below desktop breakpoint.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Final validation and quality gates across all stories

- [X] T014 Run `npx astro build` and `npx astro check`; fix any TypeScript errors and Zod content-validation failures from `projects.yaml`.
- [X] T015 [P] Verify accessibility: one `<h1>` on `/projects`, keyboard navigation and visible focus on all card links and "View more", descriptive `alt`/labels, and AA contrast in both light and dark themes.
- [X] T016 [P] Verify no layout shift (CLS): card image wrapper holds a fixed aspect ratio and the placeholder occupies the same space for broken/missing/oversized images; confirm reduced-motion suppresses reveal/hover motion.
- [X] T017 Execute the `quickstart.md` validation scenarios (1–13) against the running dev server and confirm all pass.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately.
- **Foundational (Phase 2)**: Depends on Setup — BLOCKS all user stories.
- **User Stories (Phase 3–6)**: All depend on Foundational completion.
  - US1 (P1) is the MVP and should be implemented first.
  - US2 (P1) extends the `ProjectCard` produced in US1 → depends on US1 (same file).
  - US3 (P2) extends `ProjectsSection`/`projects.astro` from US1 → depends on US1; independent of US2.
  - US4 (P2) touches `NavBar`/`Hero`/`profile.yaml` only → independent of US1–US3, can run in parallel once Setup is done.
- **Polish (Phase 7)**: Depends on all targeted user stories being complete.

### User Story Dependencies

- **US1 (P1)**: After Foundational. No dependency on other stories.
- **US2 (P1)**: After US1 (edits the same `ProjectCard.astro`).
- **US3 (P2)**: After US1 (edits `ProjectsSection.astro`/`projects.astro`). Independent of US2.
- **US4 (P2)**: Independent of US1–US3; only needs Setup. Can start any time.

### Within Each User Story

- Components before the page that composes them.
- `ProjectCard` display (US1) before its action group (US2).
- Section "View more" (US3) before wiring the profile prop from the page.

### Parallel Opportunities

- T001 and T002 (Setup) can run in parallel.
- T015 and T016 (Polish verification) can run in parallel.
- US4 (T012–T013) can proceed in parallel with US1–US3 since it touches different files.

---

## Parallel Example: Setup Phase

```bash
# Launch both setup tasks together:
Task: "Create public/images/project-placeholder.svg"
Task: "Create public/images/projects/ with the 5 cover images"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup.
2. Complete Phase 2: Foundational (collection + seed content).
3. Complete Phase 3: User Story 1 (card grid renders, latest first).
4. **STOP and VALIDATE**: view `/projects` independently.
5. Demo the readable project showcase.

### Incremental Delivery

1. Setup + Foundational → content model ready.
2. US1 → cards visible (MVP) → demo.
3. US2 → source/website action group works → demo.
4. US3 → "View more" to GitHub → demo.
5. US4 → nav entry points + responsive tab → demo.
6. Polish → build/a11y/CLS/quickstart validation.

### Parallel Team Strategy

- After Setup + Foundational: one developer takes US1→US2→US3 (shared card/section files), another takes US4 (nav/hero) in parallel.

---

## Notes

- [P] tasks = different files, no dependencies.
- [Story] labels map tasks to user stories for traceability.
- No automated tests per constitution; rely on build, type-check, Zod validation, and manual quickstart checks.
- Commit after each task or logical group.
- Reuse existing patterns: `ContactSection.astro` (external links), `ExperienceSection`/`ExperienceCard` (section/card), `about.astro` (page shell), `.toReversed()` (latest-first ordering).
