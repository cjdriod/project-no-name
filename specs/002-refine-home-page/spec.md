# Feature Specification: Refine Home Page & Navigation

**Feature Branch**: `002-refine-home-page`

**Created**: 2026-07-10

**Status**: Draft

**Input**: User description: "Refine the bottom navigation bar (remove Contact tab) and restructure the home page: keep Hero, add a new Core Expertise section, keep Experience, add a new Contact footer section, and remove the existing Skills section."

## Clarifications

### Session 2026-07-10

- Q: Is the category-driven "toolkit" section (from skills.yaml) the same as the "Core Expertise" section, replacing the fixed 5-area content? → A: Yes — same section. The category-driven skills section replaces the hardcoded Core Expertise content and is sourced entirely from skills.yaml.
- Q: At what level should the page-visibility flag live in the refined skills.yaml? → A: Per-category. Each category declares which pages (home/about/cv) it appears on; all skills in that category follow the category's page eligibility.
- Q: How should the Experience section's ordering be restructured? → A: Migrate experience entries into a single YAML array file; array index is the order; newest is appended as the last element; the section displays the array reversed so the latest appears at the top.
- Q: What is the scope regarding the about and cv pages referenced by the flags? → A: Home page only. Define the refined skills.yaml structure with per-category page flags (including about/cv values so data is ready), but only implement rendering on the home page in this feature; do not build or modify about/cv pages.
- Q: Where should the contact destination values (email, LinkedIn, GitHub) be stored? → A: Extend profile.yaml with a contacts list, each item having a channel type, display label, destination href, and icon.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Discover core expertise at a glance (Priority: P1)

A visitor lands on the home page and, after the hero introduction, sees a clearly organized "Core Expertise" section that groups the professional's skills into competency categories (each shown as a set of pills), so they can quickly gauge fit without scrolling through detailed history.

**Why this priority**: The expertise summary is the primary new value of this change — it gives visitors an immediate, scannable understanding of what the professional does. It replaces the removed flat Skills list with meaningful, category-grouped content.

**Independent Test**: Load the home page and confirm the Core Expertise section appears directly after the Hero and shows each home-eligible category with up to its top 3 skills rendered as pills. Delivers value on its own by improving how visitors understand the professional's strengths.

**Acceptance Scenarios**:

1. **Given** a visitor is on the home page, **When** they scroll past the Hero, **Then** the Core Expertise section is the next section displayed.
2. **Given** the Core Expertise section is visible, **When** the visitor reads it, **Then** it shows each category flagged for the home page (e.g., Backend Development, Cloud Architecture, Frontend Development, Microservices & APIs, DevOps, Data, others), with at most the first 3 skills of each category (by array index) rendered as pills.
3. **Given** a skill has no matching icon, **When** its pill renders, **Then** the pill shows the skill name only (no icon), without appearing broken.
4. **Given** the visitor continues scrolling, **When** they move past Core Expertise, **Then** the Experience section is shown next.

---

### User Story 2 - Get in touch from the home page footer (Priority: P1)

A visitor who is interested in reaching out finds a "Get in Touch" contact section at the bottom of the home page offering three clear ways to make contact: email, LinkedIn, and GitHub.

**Why this priority**: Providing an obvious, direct path to contact is a core conversion goal of the page. With the Contact navigation tab removed, the home page footer becomes the primary place visitors reach out.

**Independent Test**: Load the home page, scroll to the bottom, and confirm a contact section labeled "Get in Touch" presents three actionable options (email, LinkedIn, GitHub), each of which activates the corresponding contact channel.

**Acceptance Scenarios**:

1. **Given** a visitor reaches the bottom of the home page, **When** they view the contact section, **Then** three options are shown, each with an icon and text label: email, LinkedIn, and GitHub.
2. **Given** the contact section is visible, **When** the visitor activates any option, **Then** it opens as an external link in a new browser tab (email opens the mail channel; LinkedIn and GitHub open the respective profiles).
3. **Given** the visitor is on the home page, **When** the page renders, **Then** the Contact section appears after the Experience section and before the end of the page.

---

### User Story 3 - Simplified bottom navigation (Priority: P2)

A visitor using the bottom navigation bar sees a streamlined set of navigation options without a "Contact" tab, reducing redundancy now that contact options are presented directly in the home page footer.

**Why this priority**: Removing the redundant Contact tab simplifies navigation, but it is secondary to delivering the new expertise and contact content that visitors act on.

**Independent Test**: View the bottom navigation on any page and confirm the Contact tab is no longer present while the remaining navigation options continue to work.

**Acceptance Scenarios**:

1. **Given** a visitor views any page, **When** they look at the bottom navigation bar, **Then** no "Contact" tab is present.
2. **Given** the Contact tab has been removed, **When** the visitor uses the remaining navigation options, **Then** each still navigates to its destination correctly.
3. **Given** the navigation bar is displayed on small screens, **When** the layout adapts, **Then** the remaining options remain accessible and legible.

---

### User Story 4 - Experience listed newest-first (Priority: P2)

A visitor reading the Experience section sees roles ordered from most recent at the top to oldest at the bottom, so the professional's current position is seen first. Content is authored as a single YAML array where new entries are appended at the end, and the display reverses that order.

**Why this priority**: Correct chronological presentation improves comprehension of career progression, but it refines existing content rather than adding a new section.

**Independent Test**: Add a new experience entry as the last element of the YAML array and confirm it renders at the top of the Experience section, with previously-authored entries following in reverse-append order.

**Acceptance Scenarios**:

1. **Given** experience entries authored in a YAML array, **When** the Experience section renders, **Then** entries appear in reverse of their array order (latest-appended first).
2. **Given** a new entry is appended as the last array element, **When** the page rebuilds, **Then** that entry appears at the top of the Experience section without any manual order value.

---

### User Story 5 - Engaging hero illustration (Priority: P3)

A visitor sees a hero illustration of a happy developer working at a laptop, with blurred lines of code and system diagrams in the background, rendered with a 3D-feel design, replacing the current generic portrait placeholder.

**Why this priority**: The illustration improves first impression and personality but is decorative; the page functions and communicates value without it.

**Independent Test**: Load the home page and confirm the hero shows the developer illustration (not the old portrait placeholder), with appropriate alt text and no layout shift.

**Acceptance Scenarios**:

1. **Given** a visitor lands on the home page, **When** the Hero renders, **Then** the illustration of a happy developer at a laptop (with blurred code/diagram background, 3D-feel style) is displayed in place of the previous portrait placeholder.
2. **Given** the illustration is displayed, **When** a screen reader encounters it, **Then** it exposes descriptive alt text.

---

### Edge Cases

- What happens when a contact channel value (email, LinkedIn, or GitHub) is not configured? The corresponding option should not be shown or should be visibly inactive rather than presenting a broken link.
- What happens when a category flagged for the home page has fewer than 3 skills? The section shows all available skills for that category (up to 3) without empty pill placeholders.
- What happens when a category is not flagged for the home page? It is omitted from the home page Core Expertise section entirely.
- What happens when a skill has no matching icon? The pill renders with the name text only, without a broken or missing-icon graphic.
- How does the page behave on narrow mobile viewports where the Core Expertise and Contact sections must reflow? Content must remain readable and options must remain tappable (≥44px targets).
- What happens to any in-page links or anchors that previously pointed to the Skills section? They must not produce broken references after removal.
- How does the streamlined navigation behave at the smallest breakpoints previously used to hide the Contact tab? Remaining items must stay accessible.
- What happens if the experience YAML array is empty? The Experience section renders no entries without error.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The bottom navigation bar MUST NOT include a "Contact" tab on any page.
- **FR-002**: The bottom navigation bar MUST continue to provide its remaining navigation options, each functioning correctly.
- **FR-003**: The home page MUST present its sections in this order: Hero, Core Expertise, Experience, Contact.
- **FR-004**: The home page MUST NOT display the previously existing Skills section.
- **FR-005**: The Core Expertise section MUST appear immediately after the Hero section and MUST be sourced from the refined skills.yaml content (not hardcoded in the component).
- **FR-006**: The refined skills.yaml MUST organize skills into categories from this set: Backend Development, Cloud Architecture, Frontend Development, Microservices & APIs, DevOps, Data, others.
- **FR-006a**: Each category MUST declare which pages it appears on via a per-category page flag supporting the values home, about, and cv; all skills within a category inherit the category's page eligibility.
- **FR-006b**: On the home page, the Core Expertise section MUST display only categories flagged for home, and for each such category MUST show at most the first 3 skills by array index ("top 3").
- **FR-006c**: Each skill MUST be presented using the existing pill design (icon + text). When a skill has no matching icon, its pill MUST display the name only, with no icon and no broken-icon artifact.
- **FR-006d**: The refined skills.yaml structure MUST be validated at build time (Zod schema) consistent with the project's type-safe content model.
- **FR-007**: The Contact section MUST appear after the Experience section as the final section of the home page.
- **FR-008**: The Contact section MUST be presented as a "Get in Touch" area offering exactly three contact options: email, LinkedIn, and GitHub, each rendered with an icon and a text label.
- **FR-009**: Each contact option MUST be an external link that opens in a new browser tab; contact destination values MUST be sourced from a contacts list in profile.yaml (channel, label, href, icon), not hardcoded in the component.
- **FR-010**: The restructured home page and navigation MUST remain accessible (keyboard operable, screen-reader labeled, ≥44px tap targets) and responsive across the viewport sizes the site already supports.
- **FR-011**: Removing the flat Skills section and Contact tab MUST NOT leave broken links, empty containers, or references to the removed elements.
- **FR-012**: Experience content MUST be authored as a single YAML array where array position is the order and new entries are appended as the last element; the Experience section MUST display entries in reversed array order (latest-appended first), without relying on an explicit numeric order field.
- **FR-013**: The Hero MUST display an illustration of a happy developer working at a laptop with a blurred background of code lines and system diagrams, in a 3D-feel style, replacing the current portrait placeholder, with descriptive alt text and no layout shift.
- **FR-014**: This feature MUST implement Core Expertise rendering on the home page only. The refined skills.yaml MAY include about/cv page flag values for future use, but about and cv pages MUST NOT be built or modified by this feature.

### Key Entities *(include if feature involves data)*

- **Skill Category**: A named grouping of skills shown in the Core Expertise section. Attributes: category name (one of Backend Development, Cloud Architecture, Frontend Development, Microservices & APIs, DevOps, Data, others), a page-visibility flag listing the pages it appears on (home/about/cv), and an ordered list of skills.
- **Skill**: An individual competency rendered as a pill. Attributes: name (required), icon (optional; omitted display when absent). Position within its category's array determines "top 3" selection.
- **Contact Option**: An external contact link. Attributes: channel type (email, LinkedIn, GitHub), display label, icon, and destination href. Stored in the profile.yaml contacts list; opens in a new tab.
- **Experience Entry**: A role in the Experience section, authored as an element of a YAML array. Array position defines order (newest appended last); display is reversed so the latest appears first.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of home page loads display the sections in the exact order Hero → Core Expertise → Experience → Contact, with no Skills section present.
- **SC-002**: A visitor can identify the home-page skill categories and their top-3 pills within 15 seconds of reaching the Core Expertise section, without additional interaction.
- **SC-003**: A visitor can locate and activate any of the three contact options (email, LinkedIn, GitHub) from the home page in under 10 seconds, and activation opens the target in a new tab.
- **SC-004**: The Contact navigation tab is absent from the bottom navigation on 100% of pages, and all remaining navigation options reach their destinations successfully.
- **SC-005**: The home page renders correctly with all new sections readable and all contact options tappable across supported desktop and mobile viewport widths, with no layout overflow or broken references.
- **SC-006**: Appending a new experience entry as the last element of the YAML array causes it to render at the top of the Experience section on the next build, with no manual order value required.
- **SC-007**: For every category flagged for the home page, no more than 3 skill pills are shown; skills without an icon render as name-only pills with no broken-icon artifact.

## Assumptions

- The Core Expertise section replaces the removed flat Skills list; its content is sourced from the refined, category-grouped skills.yaml and is the authoritative capability summary for this release.
- The category set is fixed to: Backend Development, Cloud Architecture, Frontend Development, Microservices & APIs, DevOps, Data, others. Existing flat skills in skills.yaml will be reorganized under these categories during implementation.
- "Top 3" means the first three skills of a category by their position in the array (author-controlled ordering).
- Contact destination values (email address, LinkedIn profile, GitHub profile) live in a contacts list in profile.yaml; if actual values are not yet known, placeholders consistent with current content practices are acceptable for this feature.
- "Contact me" refers to the existing bottom-navigation Contact tab; removing it does not require removing any separate standalone contact page unless one exists solely for that tab.
- The visual style of the new Core Expertise and Contact sections follows the site's existing design tokens and pill component pattern; no new design language is introduced.
- The section reordering and new sections apply to the home page only; other pages are unaffected except for the shared navigation bar change. About/CV page flag values may be authored in the data now but are not rendered by this feature.
- The hero developer illustration is a static SVG asset created to convey a 3D feel; exact artistic execution is finalized during implementation within the site's design constraints.
