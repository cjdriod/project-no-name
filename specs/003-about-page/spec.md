# Feature Specification: About Page

**Feature Branch**: `003-about-page`

**Created**: 2026-07-14

**Status**: Draft

**Input**: User description: "i wanted to develop a about page with a layout as below 1. Professional Summary, Highlights 2. skills set by category (Skills) 3. work experience 4. Achievement 5. Education. the route should be /about, in the index page bottom navigation bar able to navigate to this page"

## Clarifications

### Session 2026-07-14

- Q: Which design system governs the About page's visual and interaction design? → A: The existing design system in `design.md` (tokens, typography, color, layout, components, motion) — a long-form, reading-optimized single-column page consistent with the rest of the site.
- Q: What fields should each Achievement entry carry? → A: Title, issuer/company, optional date, and optional link; when a link is present it shows an "open in new tab" icon and opens the target in a new browser tab.
- Q: What fields should each Education entry carry? → A: Institution, qualification/field of study, and a period (start–end years).
- Q: How should Work Experience on the About page differ from the home page? → A: Show all roles (not just the latest 3), ordered by index descending (higher index = more recent), each showing the employer, the working period formatted as "{month} {year}", the role/position, and a short summary of the job.
- Q: How to reconcile design.md's extra About content (engineering philosophy, interests, certifications) with the 5-section layout? → A: Keep only the five requested sections; certifications are represented as achievements; engineering philosophy and interests are out of scope for this feature (design.md reconciled to the spec).

### Session 2026-07-15

- Q: Should building the `/cv` page be part of this feature, or only link to it? → A: Only link to `/cv`; building the CV page is a separate future feature (out of scope here).
- Q: How should consecutive Work Experience entries be separated (LinkedIn-style, no timeline UI)? → A: A thin hairline horizontal divider between entries; no vertical timeline spine.
- Q: Should each Work Experience entry still show the employer/company, and what leads the entry? → A: Yes — keep the employer alongside role, dates, and summary, and show the company logo/icon on the left of each entry.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Read a complete professional profile on /about (Priority: P1)

A recruiter or technical reviewer opens the `/about` page and reads, in a single top-to-bottom
flow, the person's professional summary and highlights, skills grouped by category, work
experience, achievements, and education. They form a clear picture of the candidate's
background without leaving the page.

**Why this priority**: The page's entire value is presenting the professional narrative in one
place. Without the readable content, the feature delivers nothing. This is the MVP.

**Independent Test**: Visit `/about` directly and confirm all five sections render in the
specified order with real content, are legible on mobile and desktop, and can be read
comfortably start to finish.

**Acceptance Scenarios**:

1. **Given** a visitor navigates directly to `/about`, **When** the page loads, **Then** the
   sections appear in this order: Professional Summary & Highlights, Skills (by category),
   Work Experience, Achievements, Education.
2. **Given** the About page is open, **When** the visitor reads the Skills section, **Then**
   skills are grouped under named categories rather than shown as one flat list.
3. **Given** the About page is open on a phone, **When** the visitor scrolls the page, **Then**
   every section is fully readable in a single-column layout with no horizontal scrolling.
4. **Given** the About page is open, **When** the visitor reaches the Work Experience section,
   **Then** each role appears as a LinkedIn-style list entry (no timeline UI) — a company
   logo/icon on the left with the employer, position, working period ("{month} {year}"), and a
   short job summary — separated from adjacent entries by a hairline divider and ordered
   most-recent first.
5. **Given** the About page is open, **When** the visitor scrolls past the Education section,
   **Then** a closing call-to-action reading "Looking for more details?" with a
   "View my complete Curriculum Vitae (CV) →" link is shown, and activating it navigates to
   `/cv`.

---

### User Story 2 - Navigate to the About page from the home page (Priority: P1)

A visitor on the home page uses the bottom navigation bar to move to the About page, and can
tell from the navigation which page they are currently viewing.

**Why this priority**: The user explicitly requires reaching `/about` from the home page's
bottom navigation. Discoverability of the page is essential to it being used at all.

**Independent Test**: From the home page, activate the "About" control in the bottom navigation
and confirm it lands on `/about`, with the About item shown as the current page.

**Acceptance Scenarios**:

1. **Given** a visitor is on the home page, **When** they look at the bottom navigation bar,
   **Then** an "About" destination is present.
2. **Given** a visitor is on the home page, **When** they activate the "About" navigation item,
   **Then** they are taken to `/about`.
3. **Given** a visitor is on `/about`, **When** they view the bottom navigation, **Then** the
   "About" item is indicated as the current page.
4. **Given** a keyboard-only visitor is on the home page, **When** they tab to the "About"
   navigation item and activate it, **Then** they reach `/about` without needing a pointer.

---

### Edge Cases

- **Empty optional section**: If a person has no recorded achievements or no formal education,
  the corresponding section is omitted entirely rather than shown empty.
- **Long content**: When a summary, role description, or achievement is long, the text stays
  within the readable measure and reflows without breaking layout or overflowing horizontally.
- **Present/ongoing roles**: A current role with no end date is presented as ongoing (e.g.,
  "Present") rather than showing a blank or invalid period.
- **Reduced motion**: A visitor who prefers reduced motion sees the page without any entrance
  animation or movement.
- **Deep link**: A visitor arriving at `/about` from an external link (not via the home page)
  sees the same complete page and can navigate back to the home page from the bottom navigation.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The site MUST provide a page reachable at the route `/about`.
- **FR-002**: The About page MUST present five content sections in this fixed order:
  (1) Professional Summary & Highlights, (2) Skills grouped by category, (3) Work Experience,
  (4) Achievements, (5) Education.
- **FR-003**: The Professional Summary & Highlights section MUST present a narrative summary of
  the person plus a short set of highlight statements.
- **FR-004**: The Skills section MUST group individual skills under named categories, with each
  category and its member skills clearly associated.
- **FR-005**: The Work Experience section MUST list all roles (not limited to the most recent
  three), ordered by index descending so the most recent employment appears first, presented as a
  LinkedIn-style vertical list and NOT as a timeline UI (no timeline spine/rail). Consecutive
  entries MUST be separated by a thin hairline horizontal divider. Each entry MUST show a company
  logo/icon on the left and, alongside it, the employer, the working period formatted as
  "{month} {year}" (with an ongoing role shown as "Present"), the position/role, and a short
  summary of the role/achievements.
- **FR-006**: The Achievements section MUST list notable accomplishments as distinct, readable
  items, ordered by index descending (the latest achievement is authored last in content and
  displayed first). Each achievement MUST show its title/name; it MAY show an issuer/company, a
  date, and a link; when a link is present the item MUST display an "open in new tab" affordance
  and open the target in a new browser tab.
- **FR-007**: The Education section MUST list educational qualifications following the same visual
  format as Work Experience entries, each showing an institution image/logo, the institution
  (school) name, the qualification/field of study (course), and the period (start–end years).
- **FR-008**: The home page's bottom navigation MUST include an "About" destination that links
  to `/about`.
- **FR-009**: The bottom navigation MUST indicate when the visitor is currently on the `/about`
  page.
- **FR-010**: The About page and its navigation entry point MUST be operable by keyboard alone
  and expose accessible names/labels for assistive technology.
- **FR-011**: An optional section (Achievements or Education) with no content MUST be omitted
  from the page rather than rendered empty.
- **FR-012**: All About page content MUST be sourced from the site's structured content model
  (not hardcoded into the page), consistent with the existing profile, skills, and experience
  content.
- **FR-013**: The About page MUST reuse the site's existing shared layout, bottom navigation, and
  theme (light/dark) and MUST follow the design system defined in `design.md` (design tokens,
  typography, color, spacing, components, and motion) as a long-form, reading-optimized
  single-column page, so it is visually consistent with the rest of the site.
- **FR-014**: The About page MUST end with a closing call-to-action, placed after the Education
  section, that presents the prompt "Looking for more details?" and a link/button labeled
  "View my complete Curriculum Vitae (CV) →" that navigates to the `/cv` route. Building the
  `/cv` page itself is out of scope for this feature; this requirement only covers the prompt,
  label, and link target.

### Key Entities *(include if feature involves data)*

- **Professional Summary**: The person's narrative summary and a set of highlight statements;
  drawn from the existing profile content.
- **Skill Category**: A named grouping (e.g., "Languages", "Tools") containing one or more
  skills; skills belong to a category and may carry an optional icon. Reuses the existing skills
  content, filtered to those flagged for the About page.
- **Work Experience Entry**: A single role with employer, position/role, start/end period (end
  may be "Present"; displayed as "{month} {year}"), a short job summary, and a company logo/icon
  shown at the entry's left. Entries are presented as a LinkedIn-style hairline-separated list
  (not a timeline) ordered by index descending (higher index = more recent). Extends the existing
  experience content with a summary field.
- **Achievement**: A single notable accomplishment identified by its title/name (the required,
  displayed field), with an optional issuing organization/company, an optional date, and an
  optional link (rendered with an "open in new tab" affordance that opens in a new browser tab).
  Achievements are ordered by index descending (latest authored last, shown first).
- **Education Entry**: A single qualification with an institution image/logo, institution (school)
  name, qualification/field of study (course), and a period (start–end years). Presented using the
  same format as Work Experience entries.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: From the home page, a visitor can reach the About page in a single action via the
  bottom navigation, 100% of the time.
- **SC-002**: The `/about` page presents all five required sections in the specified order in
  100% of loads where content exists.
- **SC-003**: A first-time visitor can locate any one of the five sections (e.g., Education)
  within 15 seconds of the page loading.
- **SC-004**: The About page is fully readable with no horizontal scrolling across viewports
  from the smallest supported phone width through desktop.
- **SC-005**: The About page and its navigation entry are fully operable by keyboard alone, with
  the current page clearly indicated.
- **SC-006**: 90% of reviewers can, after reading the page once, correctly recall the person's
  role and at least two skill categories.

## Assumptions

- The existing content model is reused where it already exists: the profile entry supplies the
  professional summary/highlights, the skills collection (entries flagged for the `about` page)
  supplies the categorized skills, and the experience collection supplies work experience. This
  matches the current `about` page flag already present in the skills schema.
- Achievements and Education are new content types not yet present in the content model and will
  be added as structured content following the same type-safe, build-validated pattern.
- The bottom navigation already lists an "About" item pointing at `/about`; this feature ensures
  that destination resolves to a real, complete page.
- "Highlights" refers to a short list of standout statements accompanying the summary, not a
  separate long-form section.
- The About page is limited to the five requested sections. Certifications are represented within
  the Achievements section (an achievement carries title, issuer/company, optional date, optional
  link). Engineering philosophy and interests (listed in design.md's About IA) are out of scope
  for this feature; design.md's About information architecture is reconciled to this spec.
- The page is a static, content-first reading page consistent with the site constitution: no
  required client-side interactivity beyond the shared theme toggle and navigation.
- design.md prescribes a vertical experience timeline (§5, §7.5) for the About page; per the
  2026-07-15 clarification this is superseded here by a LinkedIn-style, hairline-separated list
  with a left-aligned company logo, and no timeline UI is built.
- A closing "Looking for more details?" call-to-action links to `/cv`. The `/cv` page is a
  separate future feature; this feature only guarantees the CTA prompt, label, and link target.
- Mobile-first, single-column reading layout is used, with wider viewports adding margin rather
  than line length, per the project's design rules.
