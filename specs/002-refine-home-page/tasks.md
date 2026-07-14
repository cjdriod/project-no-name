---
description: "Task list for Refine Home Page & Navigation"
---

# Tasks: Refine Home Page & Navigation

**Input**: Design documents from `/specs/002-refine-home-page/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/content-schemas.md, quickstart.md

**Tests**: NOT included. The project constitution states automated unit tests are not required; quality is enforced via `astro build`, type checking, Zod content validation, Lighthouse budgets, and manual review. No test tasks are generated.

**Organization**: Tasks are grouped by user story (priority order) to enable independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependency on incomplete tasks)
- **[Story]**: US1–US5 map to the user stories in spec.md
- Every task includes an exact file path

## Path Conventions

Single Astro static-site project. Source lives under `src/`; shared config at repo root (`astro.config.mjs`). Static assets under `public/`.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Confirm a green baseline before making changes.

- [X] T001 Install dependencies and confirm a clean baseline build by running `npm install` then `npm run build` at repo root `c:\Users\U10113753\test\project-no-name`; resolve any pre-existing failure before proceeding.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Register all new icons so pill/contact icons resolve. This BLOCKS icon rendering in US1 and US2.

**⚠️ CRITICAL**: Must complete before user stories that reference new icons (US1, US2).

- [X] T002 Add the new Iconify ids to the `astro-icon` `include` allowlist in `astro.config.mjs`: under `simple-icons` add `nodedotjs`, `spring`, `react`, `docker`, `githubactions`, `github`, `linkedin` (and `serverless` only if used); keep `material-symbols: mail-outline-rounded` present. Only add ids actually referenced by authored content (see `contracts/content-schemas.md` Contract 4).

**Checkpoint**: Icons available — user stories can begin.

---

## Phase 3: User Story 1 - Discover core expertise at a glance (Priority: P1) 🎯 MVP

**Goal**: Replace the flat Skills list with a category-grouped Core Expertise section sourced from `skills.yaml`, showing top-3 pills per home-eligible category directly after the Hero.

**Independent Test**: Load the home page; confirm Core Expertise is the section after Hero, each `home`-flagged category shows ≤3 pills (first 3 by array order), skills without an icon render as name-only pills, and non-`home` categories are absent.

### Implementation for User Story 1

- [X] T003 [US1] Update the `skills` collection schema in `src/content.config.ts` to an array of category objects: `{ id, name, pages: enum('home','about','cv')[] (min 1), skills: { name, icon? (icon regex) }[] (min 1) }`, per `contracts/content-schemas.md` Contract 1.
- [X] T004 [P] [US1] Rewrite `src/content/skills.yaml` as an ordered category array (Backend Development, Cloud Architecture, Frontend Development, Microservices & APIs, DevOps, Data, others) with per-category `pages` flags; re-home existing flat skills and seed the spec's technologies; omit `icon` for skills with no registered icon (name-only). See `research.md` R2 for seed content.
- [X] T005 [P] [US1] Create `src/components/CoreExpertiseSection.astro` that accepts the skills categories, filters to those whose `pages` includes `home`, renders each category with its first 3 skills (`skills.slice(0, 3)`) as pills reusing `src/components/SkillPill.astro` (icon optional → name-only), using existing section/token styles.
- [X] T006 [US1] Edit `src/pages/index.astro` to load the categories via `getCollection('skills')`, render `<CoreExpertiseSection>` immediately after `<Hero>`, and remove the `SkillsSection` import, its `<SkillsSection>` usage, and the old skills `sort` wiring.
- [X] T007 [US1] Delete the now-unused `src/components/SkillsSection.astro` and confirm no remaining references to it.

**Checkpoint**: `npm run build` passes; Core Expertise renders correctly. US1 is an independently shippable MVP.

---

## Phase 4: User Story 2 - Get in touch from the home page footer (Priority: P1)

**Goal**: Add a "Get in Touch" contact section at the bottom of the home page with email, LinkedIn, and GitHub as external, new-tab links (icon + text), sourced from `profile.yaml`.

**Independent Test**: Scroll to the bottom of the home page; confirm exactly three contact options render with icon + label and each opens in a new tab with `rel="noopener noreferrer"`.

### Implementation for User Story 2

- [X] T008 [US2] Add a `contacts` field to the `profile` schema in `src/content.config.ts`: `contacts: { channel: enum('email','linkedin','github'), label: string, href: string, icon: string(icon regex) }[]` (min 1), per `contracts/content-schemas.md` Contract 2.
- [X] T009 [US2] Add a `contacts` list (email → `mailto:`, LinkedIn → `https://` URL, GitHub → `https://` URL, each with `label` and `icon`) to `src/content/profile.yaml` (placeholder addresses acceptable if real values unknown).
- [X] T010 [P] [US2] Create `src/components/ContactSection.astro` presenting a "Get in Touch" section rendering each contact as `<a href={href} target="_blank" rel="noopener noreferrer" aria-label={label}>` with icon + text, ≥44px tap targets, reusing existing tokens; omit any item with an empty `href`.
- [X] T011 [US2] Edit `src/pages/index.astro` to pass `profile.data.contacts` and render `<ContactSection>` as the final section (after `<ExperienceSection>`).

**Checkpoint**: `npm run build` passes; both US1 and US2 work independently.

---

## Phase 5: User Story 3 - Simplified bottom navigation (Priority: P2)

**Goal**: Remove the Contact tab from the bottom navigation with no dead markup or CSS.

**Independent Test**: View the bottom nav on any page; confirm no Contact tab, remaining tabs navigate correctly, and small-screen layout is intact.

### Implementation for User Story 3

- [X] T012 [P] [US3] In `src/components/NavBar.astro`, remove the `Contact me` entry from the `items` array and delete the now-dead `@media (max-width: 360px)` rule that hides `.bottom-nav__item--contact`; verify remaining tabs (Home, About, Projects) and their responsive rules still work.

**Checkpoint**: Contact tab absent everywhere; nav fully functional.

---

## Phase 6: User Story 4 - Experience listed newest-first (Priority: P2)

**Goal**: Migrate experience content to a single YAML array (array index = order, newest appended last) and display it reversed so the latest role is on top.

**Independent Test**: Confirm Experience renders newest-first; append a new entry as the last array element, rebuild, and verify it appears at the top with no `order` field used.

### Implementation for User Story 4

- [X] T013 [US4] In `src/content.config.ts`, change the `experience` loader from `glob(...)` to `file('src/content/experience.yaml')`, remove the required numeric `order` field, and add `id: z.string().min(1)` (keep `company`, `position`, `photo`, `photoAlt?`, `start`, `end` validation), per `contracts/content-schemas.md` Contract 3.
- [X] T014 [US4] Create `src/content/experience.yaml` as an ordered array migrating the existing entries from `src/content/experience/company-a.md`, `company-b.md`, `company-c.md` (append newest last), then delete those three Markdown files.
- [X] T015 [US4] Edit `src/pages/index.astro` to load `getCollection('experience')` in source array order and reverse it for display (remove the `order`-based `sort`; keep any max-count `slice` if desired) before passing to `<ExperienceSection>`.
- [X] T016 [US4] Verify `src/components/ExperienceSection.astro` renders the provided (already-reversed) list correctly and its `slice(0, 3)` no longer relies on the removed `order` field; adjust if needed.

**Checkpoint**: Experience displays newest-first; append-to-end → top behavior confirmed.

---

## Phase 7: User Story 5 - Engaging hero illustration (Priority: P3)

**Goal**: Replace the hero portrait placeholder with a 3D-feel SVG of a happy developer at a laptop with a blurred code/system-diagram background.

**Independent Test**: Load the home page; confirm the Hero shows the developer illustration (not the old placeholder) with descriptive alt text and no layout shift.

### Implementation for User Story 5

- [X] T017 [P] [US5] Create the illustration asset at `public/images/developer-illustration.svg` — a self-contained SVG (no external fonts/scripts) of a happy developer at a laptop with a blurred lines-of-code / system-diagram background in a 3D-feel style, legible in both light and dark themes.
- [X] T018 [US5] Update `photo` and `photoAlt` in `src/content/profile.yaml` to reference `/images/developer-illustration.svg` with descriptive alt text; confirm `src/components/Hero.astro` renders it with existing explicit `width`/`height` (no CLS).

**Checkpoint**: Hero illustration displayed with accessible alt text.

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Final validation and cleanup across all stories.

- [X] T019 [P] Run `npm run build` (and `npx astro check` if available) at repo root; fix any TypeScript or Zod content-validation errors.
- [X] T020 [P] Execute `specs/002-refine-home-page/quickstart.md` acceptance steps and non-functional checks (keyboard a11y and focus in light+dark themes, responsive from smallest viewport up, Lighthouse budgets Perf ≥95 / A11y 100 / SEO 100 / LCP <1.5s / CLS <0.05, `prefers-reduced-motion`).
- [X] T021 Final cleanup in `src/` — remove any dead imports/markup/CSS referencing the removed Skills section or Contact tab, and confirm no broken in-page links or unused assets remain.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies.
- **Foundational (Phase 2)**: Depends on Setup. Blocks icon rendering in US1 and US2.
- **User Stories (Phase 3–7)**: Depend on Foundational (US1/US2 for icons). US3, US4, US5 have no icon dependency and may start after Setup.
- **Polish (Phase 8)**: Depends on all included stories.

### User Story Dependencies

- **US1 (P1)**: Independent. Delivers the MVP.
- **US2 (P1)**: Independent of US1's rendering, but shares `src/pages/index.astro` and `src/content.config.ts` (see shared-file note).
- **US3 (P2)**: Fully independent (only `NavBar.astro`).
- **US4 (P2)**: Independent behavior; shares `src/pages/index.astro` and `src/content.config.ts`.
- **US5 (P3)**: Independent; shares `src/content/profile.yaml` with US2.

### Shared-file ordering (NOT parallel across stories)

- `src/content.config.ts`: edited by T003 (US1), T008 (US2), T013 (US4) — different schema blocks, but same file → run sequentially.
- `src/pages/index.astro`: edited by T006 (US1), T011 (US2), T015 (US4) — same file → run sequentially.
- `src/content/profile.yaml`: edited by T009 (US2) and T018 (US5) — same file → run sequentially (US2 before US5 in priority order).

### Within Each User Story

- Schema change → content authoring → component → page wiring → cleanup.
- Story complete (build green) before moving to next priority.

### Parallel Opportunities

- T004 and T005 (US1) touch different files and can run in parallel; T003 must land with them for a green build.
- T010 (US2 component) is parallelizable with its schema/content tasks (different file).
- Entire stories US3 and US5 are independent and can be done in parallel with the P1 work by another developer (they touch `NavBar.astro` and the SVG asset / `profile.yaml`).
- T019 and T020 (polish) can run in parallel.

---

## Parallel Example: User Story 1

```bash
# After T003 schema is in place, author content and component in parallel:
Task: "Rewrite src/content/skills.yaml as category array with pages flags"   # T004 [P]
Task: "Create src/components/CoreExpertiseSection.astro"                       # T005 [P]
```

## Parallel Example: Cross-story (with capacity)

```bash
# Independent stories that can proceed alongside P1 work:
Task: "Remove Contact tab from src/components/NavBar.astro"                    # T012 [P] [US3]
Task: "Create public/images/developer-illustration.svg"                        # T017 [P] [US5]
```

---

## Implementation Strategy

### MVP First (User Story 1 only)

1. Complete Phase 1 (Setup) and Phase 2 (Foundational — icons).
2. Complete Phase 3 (US1: Core Expertise).
3. **STOP and VALIDATE**: verify US1 independently against its acceptance scenarios.
4. Deploy/demo if ready.

### Incremental Delivery

1. Setup + Foundational → baseline ready.
2. US1 (Core Expertise) → validate → demo (MVP).
3. US2 (Contact) → validate → demo.
4. US3 (Nav) → US4 (Experience) → US5 (Hero illustration), each validated independently.
5. Polish (Phase 8) → final build, quickstart, and Lighthouse validation.

### Parallel Team Strategy

- One developer drives the P1 chain (US1 → US2) which shares `index.astro`/`content.config.ts`.
- A second developer takes US3 (NavBar) and US5 (SVG asset + profile) in parallel.
- Reconcile at Polish.

---

## Notes

- No automated tests per constitution; the build + Zod validation + Lighthouse + manual review are the gates.
- [P] = different files, no dependency on incomplete tasks; same-file tasks across stories are intentionally sequential.
- Keep `npm run build` green at each story checkpoint (each story pairs its schema change with matching content so validation passes).
- Commit after each task or logical group; stop at any checkpoint to validate independently.
