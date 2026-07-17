---
description: "Task list for About Page feature implementation"
---

# Tasks: About Page

**Input**: Design documents from `/specs/003-about-page/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/content-schemas.md

**Tests**: None. Per the project Constitution, automated tests are NOT required; quality gates are
type-check + `astro build` + Zod content validation + Lighthouse + manual review. No test tasks are
generated.

**Organization**: Tasks are grouped by user story. Both stories are Priority P1. The content-model
foundation (Phase 2) blocks all rendering.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies on incomplete tasks)
- **[Story]**: US1 or US2 (setup/foundational/polish carry no story label)

## Path Conventions

Single Astro project at repository root: content schema in `src/content.config.ts`, content in
`src/content/*.yaml`, components in `src/components/`, pages in `src/pages/`, static assets in
`public/`.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Prepare assets and icon registration needed before authoring content/components.

- [X] T001 [P] Create `public/images/education/` directory and add placeholder institution
  logo/image SVG assets (one per intended education entry) for use by `education.yaml`.
- [X] T002 [P] Verify the `astro-icon` allowlist in `astro.config.mjs` includes
  `material-symbols:open-in-new-rounded` (used by achievement links); add it if missing.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Extend and add the type-safe content model. **No user story rendering can begin until
this phase is complete**, because `/about` reads all of these collections.

**âš ï¸ CRITICAL**: Schema edits (T003, T004) touch the same file `src/content.config.ts` and must be
done sequentially, before the content-authoring tasks that they validate.

- [X] T003 Extend `src/content.config.ts`: add `highlights: z.array(z.string().min(1)).min(1)` to
  the `profile` schema and `summary: z.string().min(1)` to the `experience` schema.
- [X] T004 Extend `src/content.config.ts`: add a `year = /^\d{4}$/` pattern; define a new
  `education` collection (`file('src/content/education.yaml')`) with fields `id, photo, photoAlt?,
  school, course, start(year), end(year|"Present")`; define a new `achievements` collection
  (`file('src/content/achievements.yaml')`) with fields `id, title, issuer?, date?, link?`; and
  register both in the exported `collections` object (depends on T003).
- [X] T005 [P] Add a non-empty `highlights` point-form array to `profile.yaml`
  (`src/content/profile.yaml`) per contracts/content-schemas.md (depends on T003).
- [X] T006 [P] Add a required `summary` field to every entry in `src/content/experience.yaml`
  (depends on T003).
- [X] T007 [P] Create `src/content/education.yaml` as an ordered array of education entries
  (id, photo, school, course, start, end), newest appended last (depends on T004).
- [X] T008 [P] Create `src/content/achievements.yaml` as an ordered array of achievements
  (id, title, optional issuer/date/link), newest appended last (depends on T004).

**Checkpoint**: `npm run build` passes with the extended/added collections; content validates.

---

## Phase 3: User Story 1 - Read a complete professional profile on /about (Priority: P1) ðŸŽ¯ MVP

**Goal**: A visitor at `/about` reads all five sections in fixed order â€” Professional Summary &
Highlights, Skills by category, Work Experience, Achievements, Education â€” plus a closing "Looking
for more details?" CTA linking to `/cv`.

**Independent Test**: Visit `/about` directly; confirm the five sections render in order with real
content (Work Experience as a LinkedIn-style hairline list with left logos + summary; Achievements
name-first, latest first; Education in experience format), the CTA appears after Education, and the
page is legible single-column on mobile and desktop.

### Implementation for User Story 1

- [X] T009 [P] [US1] Create `src/components/AboutSummary.astro` rendering `profile.description` as
  the narrative summary followed by `profile.highlights` as a point-form bulleted list.
- [X] T010 [P] [US1] Create `src/components/AboutSkills.astro` that filters `skills` to categories
  whose `pages` include `about` and renders **all** skills per category as pills via the existing
  `SkillPill` component.
- [X] T011 [P] [US1] Create `src/components/WorkExperienceList.astro` rendering a LinkedIn-style,
  hairline-separated list (no timeline): company logo (`photo`) on the left; `company`, `position`,
  period `start` â€“ `end` (`end` may be "Present"), and `summary` on the right. Images carry explicit
  `width`/`height` and alt text.
- [X] T012 [P] [US1] Create `src/components/EducationList.astro` using the same visual format as
  `WorkExperienceList` (image left; `school`, `course`, and year range `start` â€“ `end` right).
- [X] T013 [P] [US1] Create `src/components/AchievementList.astro` rendering each `title` name-first;
  when `issuer`/`date` are present show them, and when `link` is present render an "open in new tab"
  affordance (`material-symbols:open-in-new-rounded`) with `target="_blank" rel="noopener noreferrer"`
  and an accessible new-tab label.
- [X] T014 [P] [US1] Create `src/components/CvCallout.astro` rendering the prompt "Looking for more
  details?" and an accent primary link/button labeled "View my complete Curriculum Vitae (CV) â†’"
  pointing to `/cv`, per design.md CTA styling.
- [X] T015 [US1] Create `src/pages/about.astro`: wrap in the shared `Layout`, include `NavBar`, add a
  single page `<h1>`, load the collections and derive display data â€” `profile` (summary +
  highlights), `skills` filtered by `pages` includes `about`, `experience`/`education`/`achievements`
  reversed to latest-first â€” and compose the sections in the fixed order followed by `CvCallout`
  (depends on T009â€“T014).
- [X] T016 [US1] In `src/pages/about.astro`, omit the Achievements and/or Education sections entirely
  (no empty heading) when their collections are empty (FR-011) (depends on T015).

**Checkpoint**: `/about` renders all five sections in order plus the CTA; `npm run build` passes.

---

## Phase 4: User Story 2 - Navigate to the About page from the home page (Priority: P1)

**Goal**: A visitor reaches `/about` from the bottom navigation, and the "About" item is marked as
the current page when on `/about`.

**Independent Test**: From the home page, activate the bottom-nav "About" control and confirm it
lands on `/about` with the About item indicated as current; verify keyboard-only activation works.

### Implementation for User Story 2

- [X] T017 [US2] Verify in `src/components/NavBar.astro` that the "About" item links to `/about`,
  exposes an accessible label, and receives `aria-current="page"` on the `/about` route; adjust the
  current-path matching if `/about` is not correctly marked (depends on T015 so the route exists).

**Checkpoint**: About is reachable and correctly highlighted from the bottom navigation on `/about`.

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Verify the Constitution quality gates across the new page.

- [X] T018 [P] Accessibility pass on `/about`: exactly one `<h1>`, section headings are `<h2>`,
  visible focus on the CTA and any achievement links, AA contrast in light and dark themes.
- [X] T019 [P] Layout-stability pass: every new image (company + institution logos) has explicit
  `width`/`height` and alt text; confirm no CLS and single-column reflow with no horizontal scroll
  at the smallest supported viewport.
- [X] T020 [P] Motion pass: entrance `data-reveal` animation on `/about` sections degrades to no
  motion under `prefers-reduced-motion`.
- [X] T021 Run `npm run build` (TypeScript + Zod validation) and resolve any errors.
- [X] T022 Execute the quickstart.md validation scenarios and a manual Lighthouse check on `/about`
  (Performance â‰¥ 95, Accessibility 100, LCP < 1.5s, CLS < 0.05).

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies â€” can start immediately.
- **Foundational (Phase 2)**: Depends on Setup â€” **blocks both user stories**.
- **User Story 1 (Phase 3)**: Depends on Foundational.
- **User Story 2 (Phase 4)**: Depends on Foundational; T017 depends on T015 (route must exist).
- **Polish (Phase 5)**: Depends on US1 (and US2) being complete.

### Story Dependencies

- **US1 (P1)** is the MVP and can be built and tested on its own.
- **US2 (P1)** relies on the `/about` route created in US1 (T015) but is otherwise independent; the
  navigation entry already exists and only needs verification.

### Within User Story 1

- Component tasks T009â€“T014 are independent (different files) â†’ parallelizable.
- Page assembly T015 depends on all component tasks; empty-section handling T016 depends on T015.

### Parallel Opportunities

- Setup: T001, T002 in parallel.
- Foundational: schema edits T003 â†’ T004 (same file, sequential); then content authoring T005, T006,
  T007, T008 in parallel.
- US1: T009, T010, T011, T012, T013, T014 in parallel; then T015 â†’ T016.
- Polish: T018, T019, T020 in parallel; then T021 â†’ T022.

---

## Parallel Example: User Story 1 components

```bash
# After Phase 2 completes, build all five section components + CTA together:
Task: "Create src/components/AboutSummary.astro"
Task: "Create src/components/AboutSkills.astro"
Task: "Create src/components/WorkExperienceList.astro"
Task: "Create src/components/EducationList.astro"
Task: "Create src/components/AchievementList.astro"
Task: "Create src/components/CvCallout.astro"
# Then assemble: src/pages/about.astro (T015), then empty-section handling (T016)
```

---

## Implementation Strategy

### MVP First (User Story 1)

1. Complete Phase 1 (Setup) and Phase 2 (Foundational content model).
2. Complete Phase 3 (US1): build components, assemble `/about`, handle empty sections.
3. **STOP and VALIDATE**: visit `/about`, confirm section order/content and a passing build.
4. This is a demoable MVP â€” the full readable About page.

### Incremental Delivery

1. Setup + Foundational â†’ content model ready.
2. US1 â†’ `/about` renders â†’ validate â†’ demo (MVP).
3. US2 â†’ verify bottom-nav reachability/current-state â†’ validate.
4. Polish â†’ accessibility, CLS, motion, build, quickstart + Lighthouse.

---

## Notes

- [P] = different files, no dependency on incomplete tasks.
- Schema tasks T003/T004 share `src/content.config.ts` and are intentionally sequential.
- Reuse existing components/tokens: `SkillPill`, `NavBar`, `Layout`, `design.md` tokens, and the
  `data-reveal` motion pattern â€” do not introduce new client JavaScript.
- Experience/Education/Achievements all display **index-descending** (latest first) via reversal.
- Commit after each task or logical group; run `npm run build` at each checkpoint.
