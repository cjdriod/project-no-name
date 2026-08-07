---

description: "Task list for CV Page implementation"
---

# Tasks: CV Page

**Input**: Design documents from `/specs/005-cv-page/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: Not included — the project constitution states automated unit tests are NOT required; quality is enforced via `astro check`, `astro build`, Zod validation, Lighthouse, and manual review (quickstart.md).

**Organization**: Tasks are grouped by user story (US1–US4) to enable independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies on incomplete tasks)
- **[Story]**: US1 (CV document), US2 (Nav linkage), US3 (Print), US4 (Share)

## Path Conventions

Single Astro project. Source at repository root under `src/`. New CV components under `src/components/cv/`, shared client scripts under `src/scripts/`.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project configuration required before building the page

- [X] T001 Add `@types/qrcode` as a dev dependency and install in `package.json` (typed build-time QR generation)
- [X] T002 Configure `astro.config.mjs`: add `site` (GitHub Pages placeholder, e.g. `https://USERNAME.github.io`) and `base` (`'/'` for a user page), and register the `simple-icons` contact slugs (linkedin, github, mail/gmail) in the `astro-icon` `include` block

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Content model, shared helpers, and the section wrapper that user-story sections depend on

**⚠️ CRITICAL**: US1 and US4 cannot be completed until this phase is done

- [X] T003 Extend Zod schemas in `src/content.config.ts`: profile gains `legalName`, `professionalSummary`, `languages` (min 1) and each contact gains `monoIcon` (regex `iconName`); experience and education each gain optional `achievements: string[]`; achievements gains optional `keywords: string[]`; add a new `activities` collection (`id`, `title`, `year` regex `^\d{4}$`) and export it in `collections`
- [X] T004 [P] Update `src/content/profile.yaml`: add `legalName`, `professionalSummary`, `languages`, and a `monoIcon` on each contact (do NOT add `phone`)
- [X] T005 [P] Add per-entry `achievements` arrays to `src/content/experience.yaml`
- [X] T006 [P] Add per-entry `achievements` arrays to `src/content/education.yaml`
- [X] T007 [P] Add per-entry `keywords` arrays to `src/content/achievements.yaml`
- [X] T008 [P] Create `src/content/activities.yaml` with recent-activity entries (`id`, `title`, `year`)
- [X] T009 [P] Create `src/scripts/cv-phone.ts` with pure helpers `parseLocalDigits`, `isValidLocal` (9–10 digits), `format` (`+6019-123 4567`), `toTelParam` (`+60`+digits), `fromTelParam`
- [X] T010 [P] Create `src/components/cv/CvSection.astro` — titled section wrapper with the thick-underline heading treatment (no eyebrow, no animation)

**Checkpoint**: Content validates, shared phone logic and section wrapper exist — user-story work can begin

---

## Phase 3: User Story 1 - Read a comprehensive CV document (Priority: P1) 🎯 MVP

**Goal**: A document-style `/cv` page rendering all eight sections in fixed order from content, with the dismissable top alert and build-time QR.

**Independent Test**: Navigate to `/cv`; confirm the eight sections render in order, no animations, thick-underline titles, reverse-ordered experience/cert/education/activities, contacts as `[monoIcon] text` without URL protocols, phone "Upon Request" (or `tel` value), QR present at/above `md`, and the top alert links to `/about`.

### Implementation for User Story 1

- [X] T011 [US1] Create `src/pages/cv.astro` route shell: `Layout`, skip link, `<main>` + single `<h1>`, `NavBar`; load collections via `getEntry`/`getCollection`; build canonical CV URL from `Astro.site` + `import.meta.env.BASE_URL`; generate inline QR SVG with `qrcode.toString(url, { type: 'svg' })` in a try/catch (hide on failure)
- [X] T012 [P] [US1] Create `src/components/cv/CvGeneralInfo.astro`: left area with `legalName` (largest) > `role` (smaller) > contact lines (normal) rendered as `[monoIcon] text` looping available contacts (email+phone line; linkedin+github line with `https?://` stripped); right area rendering the QR SVG slot; phone defaults to "Upon Request" with a small inline island reading `tel` from `location.search` via `cv-phone.ts`
- [X] T013 [P] [US1] Create `src/components/cv/CvExperience.astro`: reversed timeline entries (company, role, duration, `achievements` `<ol>`, omit list when empty) using `CvSection`
- [X] T014 [P] [US1] Create `src/components/cv/CvCertifications.astro`: reversed list showing title (link + `open-in-new` icon when `link` present, else plain), issuer, and date; using `CvSection` (keywords omitted — no longer part of the design)
- [X] T015 [P] [US1] Create `src/components/cv/CvSkills.astro`: all skill categories grouped with their skills, rendered as plain text names separated by a lightweight bullet separator (no icons, no pill design), using `CvSection`
- [X] T016 [P] [US1] Create `src/components/cv/CvEducation.astro`: reversed list (school, course, duration, `achievements` `<ol>`), using `CvSection`
- [X] T017 [P] [US1] Create `src/components/cv/CvActivities.astro`: reversed list (title, year); omit the section when there are no entries; using `CvSection`
- [X] T018 [P] [US1] Create `src/components/cv/CvLanguages.astro`: languages rendered pipe-separated (`|`), using `CvSection`
- [X] T019 [P] [US1] Create `src/components/cv/CvAlert.astro`: dismissable top alert "Looking for a simpler view? click here." where "click here" links to `/about`; small island for dismiss; shown on all screen sizes
- [X] T020 [US1] Wire the alert + all sections into `src/pages/cv.astro` in the fixed order (General info → Profile[summary] → Experience → Certification → Skills → Education → Recent activities → Language), passing reversed collections via `toReversed()` (depends on T011–T019)
- [X] T021 [US1] Add CV document styling scoped in `src/pages/cv.astro`/components: document look, general-info two-column layout at ≥ `md` (single column below), QR hidden on screen below ~794px/`md`, no animation, legal name never wraps to two lines (~13–15 chars)

**Checkpoint**: `/cv` is a complete, static, readable CV document (MVP)

---

## Phase 4: User Story 2 - Discover the CV from the navigation bar (Priority: P2)

**Goal**: CV entry as the third nav item, hidden below `md`, followed by Projects.

**Independent Test**: At narrow width the CV entry is hidden; at `md`+ it appears third, then Projects; on `/cv` it shows current-page state.

### Implementation for User Story 2

- [X] T022 [US2] Insert a CV entry as the third item in the `items` array of `src/components/NavBar.astro` (Home, About, CV, Projects) with an icon and `priority: 'cv'`
- [X] T023 [US2] Add responsive CSS in `src/components/NavBar.astro`: hide `.bottom-nav__item--cv` below `768px` (`md`) and show it at/above, ensuring order CV → Projects; verify `aria-current` current-page state on `/cv` (depends on T022)

**Checkpoint**: CV is reachable from the nav at `md`+ and hidden below it

---

## Phase 5: User Story 3 - Print the CV as an A4 document (Priority: P2)

**Goal**: A discreet print control plus a print stylesheet producing full A4 output with chrome hidden and forced light theme.

**Independent Test**: Trigger print; preview shows all CV content on A4, nav/alert/actions omitted, light theme, QR present, content flows across pages without clipping.

### Implementation for User Story 3

- [X] T024 [US3] Create `src/components/cv/CvActions.astro` — a discreet, non-obvious actions container with a keyboard-accessible Print control (≥44px, visible focus) that calls `window.print()`; include it in `src/pages/cv.astro` (depends on T011)
- [X] T025 [US3] Add the `@media print` stylesheet for `/cv` (scoped in `cv.astro` and/or `src/styles/global.css`): `@page { size: A4; margin: 18mm; }`, force light theme regardless of `data-theme`, single column, `display:none` for `NavBar`/`CvAlert`/`CvActions`, keep the QR visible, `break-inside: avoid` on experience/education/certification entries; ensure text stays selectable

**Checkpoint**: Printing yields an A4, ATS-friendly, chrome-free CV

---

## Phase 6: User Story 4 - Share the CV with an optional phone number (Priority: P3)

**Goal**: Share control + modal that builds a `tel`-carrying URL and shares via `navigator.share` with a clipboard + bottom-toast fallback.

**Independent Test**: Open share; modal pre-filled `+60`, numeric keypad, digits-only, max 10 local; button toggles Skip↔Share; 9–10 digits → URL-encoded `tel` in shared URL, else omitted; unsupported/failed share → copy + bottom "Copied" toast + modal closes; recipient opening a `tel` URL sees the number.

### Implementation for User Story 4

- [X] T026 [P] [US4] Create `src/scripts/cv-share.ts`: build the canonical `/cv` URL, append URL-encoded `tel` when local digits are 9–10 (via `cv-phone.ts`), call `navigator.share({ title, text, url })`, fall back to `navigator.clipboard.writeText` + a transient bottom "Copied" toast on unsupported/failure, and treat `AbortError` as a no-op (depends on T009)
- [X] T027 [US4] Extend `src/components/cv/CvActions.astro` with a Share control + modal (phone input pre-filled `+60`, `inputmode="numeric"`, digits-only, max 10 local digits; action button label "Skip" when empty / "Share" when non-empty; Esc closes; focus trap/return) wired to `cv-share.ts`, plus the bottom-toast element (depends on T024, T026)

**Checkpoint**: Sharing works with native share and graceful copy fallback

- [X] T032 [US4] Persist the recipient's phone number in `sessionStorage` (key `cv:tel`) within the General-info island in `src/components/cv/CvGeneralInfo.astro`: a fresh `tel` query value takes precedence and refreshes the store; when the query string is absent, fall back to the stored value so the number survives navigating away from and back to `/cv`; store the canonical `toTelParam` value and guard all storage access in try/catch (progressive enhancement for private mode / disabled storage)

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Validation and finishing

- [X] T028 Run `npm run astro -- check` and `npm run build`; fix any TypeScript/Zod/content errors introduced across the feature
- [X] T029 [P] Accessibility pass on `/cv`: single `<h1>`, landmarks, visible focus, ≥44px tap targets, QR accessible name (or `aria-hidden` with visible URL), AA contrast in light and dark (quickstart a11y spot-check)
- [X] T030 Execute quickstart.md scenarios A–G and record results
- [X] T031 [P] Add a deploy reminder note to replace the placeholder `site` in `astro.config.mjs` with the real personal GitHub Pages URL and re-verify the QR encodes the live `/cv` URL

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: no dependencies
- **Foundational (Phase 2)**: depends on Setup; blocks US1 and US4
- **US1 (Phase 3)**: depends on Foundational (T003–T010)
- **US2 (Phase 4)**: depends only on Setup (independent of content model) — may proceed in parallel with US1
- **US3 (Phase 5)**: depends on US1's `cv.astro` (T011) for the actions container + print styles
- **US4 (Phase 6)**: depends on `cv-phone.ts` (T009) and US3's `CvActions.astro` (T024)
- **Polish (Phase 7)**: depends on all targeted stories being complete

### User Story Dependencies

- **US1 (P1)**: independent once Foundational is done — the MVP
- **US2 (P2)**: fully independent (NavBar only); testable alone
- **US3 (P2)**: builds on US1 (needs the page)
- **US4 (P3)**: builds on US3's actions container + shared phone logic

### Within User Story 1

- T011 (page shell) before T020 (wiring)
- T012–T019 (section/alert components) can run in parallel, then T020 wires them, then T021 styles

### Parallel Opportunities

- Setup: T001 and T002 are small; T001 is independent of T002
- Foundational: T004–T010 are all `[P]` (distinct files) after/with T003's schema
- US1: T012–T019 are all `[P]` (distinct component files)
- US4: T026 `[P]` (own file) alongside earlier work
- Polish: T029 and T031 `[P]`
- US2 can be developed in parallel with the entire US1 effort

---

## Parallel Example: User Story 1 components

```bash
# After T011 (page shell) exists, build all section components together:
Task: "Create src/components/cv/CvGeneralInfo.astro"
Task: "Create src/components/cv/CvExperience.astro"
Task: "Create src/components/cv/CvCertifications.astro"
Task: "Create src/components/cv/CvSkills.astro"
Task: "Create src/components/cv/CvEducation.astro"
Task: "Create src/components/cv/CvActivities.astro"
Task: "Create src/components/cv/CvLanguages.astro"
Task: "Create src/components/cv/CvAlert.astro"
```

---

## Implementation Strategy

### MVP First (User Story 1 only)

1. Phase 1: Setup → 2. Phase 2: Foundational → 3. Phase 3: US1
4. **STOP and VALIDATE**: `/cv` renders all sections correctly (quickstart Scenario A, C, D, G)
5. Deploy/demo the reading CV

### Incremental Delivery

1. Setup + Foundational → foundation ready
2. US1 → validate → demo (MVP: readable CV)
3. US2 → validate → demo (discoverable via nav) — can land alongside US1
4. US3 → validate → demo (A4 print)
5. US4 → validate → demo (share with optional phone)

### Parallel Team Strategy

- Developer A: Foundational → US1 (page + sections)
- Developer B: US2 (nav) in parallel from the start
- After US1's page shell lands: Developer C picks up US3 (print) then US4 (share)
