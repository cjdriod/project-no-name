# Feature Specification: Projects Page

**Feature Branch**: `004-projects-page`

**Created**: 2026-07-17

**Status**: Draft

**Input**: User description: "I want to develop a project page. This page will mainly show a list of projects that I previously worked with. The projects will be displayed in card view UI presentation. In the card, it should include an image, title, simple description, technology used and some link where it navigates to source code. Some projects will have a link to the website itself. Lastly a 'view more' button at the end of the section navigates to GitHub (the link can be gotten from profile contacts). So far only have 5 projects. Same as usual, when they click on the source code tab or website tab, it will open a new tab and the external page icon will be there. Next, in the bottom navigator, the project tab links to this new page (/projects), and the index page hero section project CTA will navigate to this page. The design of the page must be consistent and comply with the .skills/design.md file."

## Clarifications

### Session 2026-07-17

- Q: Does this feature include per-project detail pages, or is it a list/index view only? → A: List/index view only — no detail page is designed or built at this stage.
- Q: How should a project card behave when its image is oversized, fails to load, is a broken link, or is missing? → A: Show a placeholder project SVG in place of the image.
- Q: What state should the bottom navigator show while the visitor is on the Projects page? → A: The Projects tab shows an active/current-page state effect.
- Q: How should the Projects tab in the bottom navigator behave on small screens? → A: It stays hidden on small screens and only appears once the viewport reaches the large (desktop) breakpoint.
- Q: How should the technologies used be presented on a project card? → A: Plain text labels only — no technology icons.
- Q: How should the card's links be arranged in the card layout? → A: Grouped together as a card action group anchored at the bottom of the card.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Browse the project showcase (Priority: P1)

A recruiter or hiring manager visits the portfolio and wants to quickly evaluate the author's engineering work. They open the Projects page and see a clean, scannable grid of project cards. Each card presents a representative image, the project title, a short description, and the technologies used, so the visitor can understand the breadth and depth of the work at a glance.

**Why this priority**: This is the core purpose of the page — presenting the project portfolio. Without it there is nothing to view; every other capability builds on this content being visible and legible.

**Independent Test**: Navigate directly to `/projects` and confirm that all five project cards render with image, title, description, and technology tags, laid out as a card grid consistent with the design system. Delivers value on its own as a viewable portfolio.

**Acceptance Scenarios**:

1. **Given** the visitor is on any page, **When** they navigate to `/projects`, **Then** the page displays all five projects as cards, each showing an image, title, short description, and the technologies used.
2. **Given** the visitor is on a narrow (mobile/tablet) viewport, **When** they view `/projects`, **Then** the cards stack in a single column and remain fully legible with adequate tap targets.
3. **Given** the visitor is on a desktop viewport, **When** they view `/projects`, **Then** the cards are arranged in the multi-column project grid defined by the design system.

---

### User Story 2 - Open a project's source code or live website (Priority: P1)

While reviewing a project card, the visitor wants to inspect the source code or try the live product. They click the source code link (present on every card) or the website link (present only on projects that have a live site). The destination opens in a new browser tab, and each external link is clearly marked with an external-page icon so the visitor knows it leaves the portfolio.

**Why this priority**: Linking out to source and live demos is the primary conversion action of a technical portfolio — it lets reviewers verify the work. It is as essential as displaying the cards themselves.

**Independent Test**: On each card, click the source code link and, where present, the website link; confirm each opens the correct destination in a new tab and displays an external-link indicator icon.

**Acceptance Scenarios**:

1. **Given** a project card, **When** the visitor activates the source code link, **Then** the project's source repository opens in a new browser tab.
2. **Given** a project that has a live website, **When** the visitor activates the website link, **Then** the live site opens in a new browser tab.
3. **Given** a project that has no live website, **When** the visitor views its card, **Then** no website link is shown (only the source code link appears).
4. **Given** any external link on the page, **When** it is rendered, **Then** it displays an external-page icon indicating it opens in a new tab.

---

### User Story 3 - See more work on GitHub (Priority: P2)

After reviewing the curated projects, the visitor wants to explore the author's full body of work. A "View more" action at the end of the projects section takes them to the author's GitHub profile (sourced from the profile contact information), opening in a new tab.

**Why this priority**: Valuable for deeper evaluation, but secondary to seeing the curated cards and their links. The page is still useful without it.

**Independent Test**: Scroll to the end of the projects section, activate the "View more" button, and confirm it opens the GitHub profile URL from the profile contacts in a new tab with an external-link indicator.

**Acceptance Scenarios**:

1. **Given** the visitor has scrolled to the end of the projects section, **When** they activate the "View more" button, **Then** the author's GitHub profile opens in a new browser tab.
2. **Given** the GitHub URL is maintained in the profile contact information, **When** that contact value changes, **Then** the "View more" destination reflects the updated URL without further edits to the page.

---

### User Story 4 - Reach the page from primary navigation (Priority: P2)

A visitor anywhere on the site can reach the projects page through the persistent bottom navigator's Projects tab, and a first-time visitor on the home page can reach it through the hero section's projects call-to-action. Both entry points lead to `/projects`, and the Projects tab is shown as the active/current item when on the page.

**Why this priority**: Discoverability matters, but the existing navigation and hero CTA already point at `/projects`; this story ensures those entry points resolve to the real page rather than a missing route.

**Independent Test**: From the home page, activate the hero projects CTA and confirm it lands on `/projects`; from any page, activate the bottom navigator Projects tab and confirm it lands on `/projects` and is marked current.

**Acceptance Scenarios**:

1. **Given** the visitor is on the home page, **When** they activate the hero section's projects call-to-action, **Then** they are taken to `/projects`.
2. **Given** the visitor is on any page, **When** they activate the Projects tab in the bottom navigator, **Then** they are taken to `/projects`.
3. **Given** the visitor is on `/projects`, **When** the bottom navigator renders, **Then** the Projects tab is indicated as the current page.

---

### Edge Cases

- **Missing website link**: Projects without a live site omit the website link entirely rather than showing a disabled or dead link.
- **Missing, oversized, or broken image**: When a project's image is missing, fails to load, is a broken link, or is too large to display correctly, the card shows a placeholder project SVG in its place. Each card reserves a fixed image aspect ratio so the layout does not shift while images load, and the placeholder occupies the same reserved space so the card stays well-formed.
- **Long titles or descriptions**: Titles and descriptions remain readable and do not overflow or break the card grid on any viewport.
- **Many technologies listed**: The technology tags wrap gracefully within the card without distorting its height relative to neighbours.
- **GitHub contact absent**: If the GitHub profile URL cannot be resolved from the profile contacts, the "View more" action is not rendered rather than linking to an empty destination.
- **Reduced motion preference**: Any hover or reveal motion respects the visitor's reduced-motion preference.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST provide a Projects page accessible at the route `/projects`.
- **FR-002**: The Projects page MUST display the author's previously worked-on projects as a set of cards in a card-grid layout.
- **FR-003**: Each project card MUST display a representative image, a title, a short description, and the technologies used for that project. Technologies MUST be presented as plain text labels (no technology icons).
- **FR-004**: Each project card MUST provide a link to the project's source code.
- **FR-005**: A project card MUST provide a link to the project's live website only when such a website exists for that project; cards without a live website MUST omit the website link.
- **FR-006**: All external links (source code, website, and "View more") MUST open in a new browser tab.
- **FR-007**: Every external link MUST display an external-page icon indicating that it navigates away in a new tab.
- **FR-008**: The Projects page MUST present a "View more" action at the end of the projects section that navigates to the author's GitHub profile.
- **FR-009**: The "View more" GitHub destination MUST be sourced from the profile contact information rather than hard-coded on the page.
- **FR-010**: The system MUST support the current set of five projects and MUST allow the number of projects to grow or shrink without redesigning the page.
- **FR-011**: The bottom navigator's Projects tab MUST link to `/projects` and MUST indicate the Projects item as current (active state) when the visitor is on that page.
- **FR-016**: When a project's image is missing, fails to load, is a broken link, or is too large to render correctly, the card MUST display a placeholder project SVG in the image's reserved space instead of a broken image.
- **FR-017**: The Projects tab in the bottom navigator MUST remain hidden on small screens and MUST only become visible once the viewport reaches the large (desktop) breakpoint.
- **FR-018**: This feature MUST NOT include per-project detail pages; the Projects page is a single list/index view only.
- **FR-019**: Each project card's links (source code and, when present, website) MUST be grouped together as a card action group anchored at the bottom of the card.
- **FR-012**: The home page hero section's projects call-to-action MUST navigate to `/projects`.
- **FR-013**: The Projects page layout, spacing, typography, cards, tags, colors, and interactions MUST comply with the project's design system (.skills/design.md), including the single-column layout below the desktop breakpoint and the multi-column project grid on desktop.
- **FR-014**: Project card and page interactions (hover, reveal, motion) MUST respect the visitor's reduced-motion preference.
- **FR-015**: The Projects page MUST be responsive and remain legible and usable across mobile, tablet, and desktop viewports, with touch targets of at least 44px.

### Key Entities *(include if data involved)*

- **Project**: A single portfolio item the author worked on. Attributes: image (with alternative text), title, short description, list of technologies used (plain text labels), source code link, and an optional live website link. Card links are grouped as an action group at the bottom of the card.
- **Project Collection**: The ordered set of projects shown on the page (currently five). Determines display order and which projects appear.
- **Profile Contact (GitHub)**: The author's GitHub profile reference held in the existing profile contact information, used as the destination for the "View more" action.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A visitor can view all five projects — each with image, title, description, and technologies — within 3 seconds of the page becoming visible on a typical connection.
- **SC-002**: 100% of project cards expose a working source code link, and every project that has a live website exposes a working website link.
- **SC-003**: 100% of external links on the page open in a new tab and display an external-page icon.
- **SC-004**: A visitor can reach `/projects` from both the home hero projects call-to-action and the bottom navigator Projects tab in a single interaction from those entry points.
- **SC-005**: The "View more" action navigates to the author's GitHub profile for 100% of page loads where a GitHub contact is available, and matches the profile contact value.
- **SC-006**: The page renders without horizontal scrolling or layout shift on mobile, tablet, and desktop viewports, meeting the design system's responsive and accessibility (WCAG 2.1 AA) baselines.
- **SC-007**: 100% of cards whose image is missing, broken, or oversized display the placeholder project SVG with no broken-image artifact and no layout shift.
- **SC-008**: The Projects tab is hidden on small screens and becomes visible at the large (desktop) breakpoint, and it shows the active/current-page state on 100% of `/projects` page loads.

## Assumptions

- The Projects page is a single list/index view only. Per-project detail pages (`/projects/[slug]` case studies) are explicitly **not** designed or built in this feature, and the project filter controls described in .skills/design.md are also out of scope; both may be addressed separately later.
- Project content (image, title, description, technologies, source link, optional website link) is maintained as structured content consistent with the existing content-collection approach used elsewhere in the site.
- The bottom navigator already includes a Projects tab pointing at `/projects`, and the hero projects call-to-action already targets `/projects`; this feature makes those entry points resolve to a real page and verifies their behavior.
- The GitHub URL for the "View more" action reuses the existing GitHub entry in the profile contacts; no new contact channel is introduced.
- Standard, project-appropriate defaults apply for image aspect ratio, lazy loading, and hover/reveal motion, as defined by .skills/design.md.
- Exactly five projects exist today; the design accommodates a modest, curated set rather than a large paginated catalogue.
