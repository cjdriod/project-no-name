# Feature Specification: Landing Hero Page

**Feature Branch**: `001-landing-hero-page`

**Created**: 2026-07-08

**Status**: Draft

**Input**: User description: "Develop a landing hero page on home page route. This page will have a mac like bottom tab navigation with theme toggle between light and dark mode. In the bottom tab navigation it should consists of home, about, project, contact me. In the content area, start with greating the audiance, who am I (which i am a full stack developer), and some small description. Next 2 CTA to view project and View CV. In the second section, show top 3 work experience is a simple way where it only mention company name, photo, position and working start and end year. In 3rd section, shows a badges of skills they I have in pill shape. This page will come in a enter animation"

## Clarifications

### Session 2026-07-09

- Q: Should CHK025 block implementation if keyboard operability and visible focus are not required as an extra navigation-checklist concern? → A: No — no additional navigation-specific checklist requirement is added; the existing accessibility baseline remains governed by FR-014 and the constitution.
- Q: Should CHK031 block implementation now? → A: No — ignore it for now; the existing small-phone non-obscuring requirement in FR-015 and Edge Cases remains sufficient for this feature.
- Q: How should SC-001 make "identity + CTAs findable within 10 seconds" objectively testable? → A: On initial `/` render, the role and both CTA labels are visible without scrolling at common mobile and desktop widths.

### Session 2026-07-08

- Q: How should the hero present the professional title/identity? → A: "Full Stack Developer" — keep the simple identity line; senior/technical-lead substance is conveyed in the description copy, not the title.
- Q: What should the "View CV" call-to-action do? → A: Navigate to a dedicated `/cv` page (per `design.md`), keeping the CV selectable and ATS-friendly.
- Q: Should "Passionate about System Design & Sustainable Solutions" be a hero tagline? → A: Yes — use a refined version as the hero eyebrow/tagline above the name.
- Q: Should skill badges reflect the specific stack/domains from the bio? → A: Yes — ground the pills in the bio (AWS, Azure, DevSecOps, CI/CD, observability, etc.).
- Q: What tone should the refined website copy take? → A: Calm, confident, professional — understated and aligned with `design.md`; not sales-oriented.

### Session 2026-07-08 (plan clarifications)

- Q: Which navigation destinations are real routes? → A: Home → `/`, About → `/about`, Contact me → `/contact`, CV → `/cv`. Projects assumed `/projects` (dock destination required by the original request but its route was not stated). Dock links are cross-route navigation, not in-page anchors.
- Q: What format are experience start/end values? → A: `{short_month}-{year}` (e.g. `Jan-2023`); a current role's `end` is the literal `Present`.
- Q: Icon packs installed? → A: `@iconify-json/material-symbols` is installed (covers nav/UI/theme/CTA icons). Skill brand marks (JS, Vue, Angular, Java, AWS, Azure) still require a brand pack (`@iconify-json/simple-icons` recommended) — tracked as an open dependency in the plan.

### Session 2026-07-08 (navigation restyle)

- Q: What style should the bottom navigation use? → A: A modern, pill-style bottom navigation bar (not a macOS magnify dock). No hover magnify; the active/current destination is indicated with a glow/highlight state. Motion is reduced accordingly.

### Session 2026-07-08 (navigation details)

- Q: Confirm the nav destinations and order? → A: Home (`/`), About (`/about`), Projects (`/projects`), Contact me (`/contact`) — in that order. Projects → `/projects` is confirmed (no longer just assumed).
- Q: Where is the nav bar positioned? → A: Fixed to the bottom of the viewport, horizontally centered, and persistent (stays visible while scrolling).
- Q: What does "pill-style" mean concretely? → A: The UI component appearance — a pill shape (fully rounded radius) with a solid surface fill, a hairline border, and a subtle shadow.
- Q: Is the active state driven by scroll position or URL? → A: By the current URL route only (no scroll-spy). The item matching the current page shows a filled/glowing pill; on `/` that is Home. It must have an active effect.
- Q: Must the active state be conveyed by more than color alone? → A: Yes — per `design.md`'s accessibility principle, the active item is distinguished by shape + fill + `aria-current="page"`, not by color alone. (Reconciled 2026-07-08 to follow `design.md` as source of truth.)
- Q: Theme-toggle placement/affordance and accessibility? → A: Lives within the nav bar (separated from the links), with distinct light/dark icon states (sun/moon) and an accessible name; an explicit pressed-state exposure is not required.
- Q: Default theme when no stored preference? → A: Check saved preference → else system preference (`prefers-color-scheme`) → else light.
- Q: Hover/focus/active interaction states, "no magnify", persistence, immediate theme switch, accessible names — confirmed? → A: Yes.
- Q: Behavior at very narrow widths where items do not fit? → A: Degrade gracefully — move lower-priority items into an overflow/dropdown, or hide Projects then Contact me; Home, About, and the theme toggle remain reachable.

### Session 2026-07-08 (navigation a11y & consistency)

- Q: How is "no flash of the incorrect theme" made observable? → A: The correct theme MUST be applied before first paint (a blocking inline script sets it pre-render).
- Q: How does the nav bar scale responsively? → A: Against the project's single breakpoint (`lg` = 1024px per Constitution III); spacing/size step once between the mobile and desktop tiers.
- Q: Minimum tap-target size for nav items and toggle? → A: At least 44px on all viewports.
- Q: Is the active state conveyed by more than color alone? → A: Yes — follow `design.md`; shape + fill + `aria-current="page"`, not color alone.
- Q: Must the active nav state be exposed to assistive tech? → A: Yes — `aria-current="page"` on the current-route item.
- Q: Contrast for nav text/icons and the active highlight? → A: MUST meet WCAG AA in both light and dark themes.
- Q: Reduced-motion behavior of the active highlight? → A: The highlight MUST remain visible with animation disabled.
- Q: How are the out-of-scope routes handled? → A: Links are preserved and point at the real routes (`/about`, `/projects`, `/contact`, `/cv`); those pages are not built here. Visiting a not-yet-built route returns the site 404 page (yet to be developed) — no test required, only that the link target exists.
- Q: Any remaining `#projects` anchor vs `/projects` route conflict? → A: None — Projects is a `/projects` route only; the pill nav fully replaces the original macOS dock idea with no leftover magnify/anchor language.
- Q: Is `design.md` the source of truth for nav visual/interaction/a11y detail? → A: Yes — `design.md` governs tokens, active-state indication, motion, and contrast; the bottom-center pill placement remains the sole owner-approved deviation (tracked in `plan.md`).

### Session 2026-07-08 (hero, content & a11y detail)

- Q: Does the hero include a portrait, and is its presence/placement specified? → A: Yes — the hero presents a portrait image alongside the identity/description block; a placeholder is allowed until a final image exists.
- Q: Do the CTAs need hover/focus/active states and a tap-target size? → A: Yes — both CTAs expose distinct hover/focus/active states and present ≥44px touch targets.
- Q: What are the enter-animation properties (elements, sequence, direction, duration, easing)? → A: Hero elements fade in and translate slightly upward in a staggered top-to-bottom sequence; ~250ms per element, easing `ease-out` / cubic-bezier(0.16, 1, 0.3, 1) per `design.md` §8, with a short stagger.
- Q: Is a container width defined for the hero/home sections? → A: Yes — full-width on small viewports, centered within `--container-wide` (1200px) on desktop (`design.md` §4.1).
- Q: Are semantic-structure requirements defined (single h1, landmarks, skip link)? → A: Yes — exactly one `<h1>`, landmark regions, and a "Skip to content" link as the first focusable element (`design.md` §9).
- Q: Is AA contrast required in both themes, and alt text for images? → A: Yes — all text/UI meets WCAG AA in light and dark; experience photos and the hero portrait carry descriptive alt text.
- Q: Do skill pills pair an icon with text, and what if no brand icon exists? → A: Pills MAY pair a brand/tech icon with the label; with no suitable brand icon they render text-only without breaking layout (resolves the open brand-icon-pack dependency).
- Q: Behavior for fewer than three experiences or overflowing skills? → A: Render only the available experience entries (no empty placeholders); skill pills wrap onto multiple lines on narrow viewports.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Understand who the person is and reach key actions (Priority: P1)

A recruiter or hiring manager opens the home page and, within seconds, understands who
the person is (a full stack developer), reads a short positioning statement, and can act
on two clear next steps: viewing the projects and viewing the CV.

**Why this priority**: The core value of a portfolio landing page is answering "who is
this and why should I care" instantly, then routing the visitor to deeper content. Without
this, the page has no purpose.

**Independent Test**: Load the home route with no other sections present and confirm the
hero communicates the greeting, identity as a full stack developer, a short description,
and offers two working calls-to-action (View Projects, View CV).

**Acceptance Scenarios**:

1. **Given** a visitor lands on the home route, **When** the page loads, **Then** they see
   a greeting, the person's identity as a full stack developer, and a short descriptive
   statement.
2. **Given** the hero is visible, **When** the visitor looks for next steps, **Then** they
   see exactly two primary actions labelled to view projects and to view the CV.
3. **Given** the two calls-to-action, **When** the visitor activates "View Projects",
   **Then** they are taken to the projects content; **When** they activate "View CV",
   **Then** they are able to access the CV.

---

### User Story 2 - Navigate the site from a persistent bottom tab bar with theme control (Priority: P2)

A visitor uses a persistent, pill-style bottom navigation bar to move between the primary
areas (Home, About, Projects, Contact me) and to switch between light and dark appearance
according to their preference.

**Why this priority**: Navigation and appearance control frame the whole experience and are
used on every visit, but they support the content rather than being the content itself.

**Independent Test**: With the navigation present, confirm all four destinations are
reachable and the theme toggle switches between light and dark and persists across reloads.

**Acceptance Scenarios**:

1. **Given** the page is loaded on any viewport, **When** the visitor looks at the bottom of
   the screen, **Then** a persistent tab navigation shows Home, About, Projects, and
   Contact me.
2. **Given** the navigation is visible, **When** the visitor selects a destination, **Then**
   they are moved to the corresponding area.
3. **Given** the theme toggle, **When** the visitor activates it, **Then** the page switches
   between light and dark appearance.
4. **Given** the visitor has chosen a theme, **When** they reload or return to the page,
   **Then** their chosen theme is remembered.
5. **Given** a first-time visitor with a system appearance preference, **When** the page
   first loads, **Then** it opens in the appearance matching that system preference without a
   visible flash of the wrong theme.
6. **Given** the visitor is on a given route, **When** the navigation is displayed, **Then** the
   item for the current route shows a glow/highlight active state that is distinguishable without
   relying on color alone.

---

### User Story 3 - Skim recent experience and skills at a glance (Priority: P3)

A visitor scrolls past the hero to quickly gauge the person's recent background: the three
most recent roles shown simply (company name, photo, position, and the start–end period) and
a set of skill badges shown as pills.

**Why this priority**: This adds credibility and depth, but the page still delivers its core
value (identity + calls-to-action) without it.

**Independent Test**: Below the hero, confirm exactly three experience entries render with
company name, photo, position, and start–end period (each `{short_month}-{year}`), and that a
set of skills renders as pill-shaped badges.

**Acceptance Scenarios**:

1. **Given** the visitor scrolls below the hero, **When** the experience section appears,
   **Then** exactly three roles are shown, each with company name, a photo, a position, and
   a working start and end period (each formatted `{short_month}-{year}`).
2. **Given** a role that is current, **When** it is displayed, **Then** its end period is
   presented as ongoing (e.g. "Present") rather than a past year.
3. **Given** the visitor continues to the skills section, **When** it appears, **Then** the
   person's skills are displayed as pill-shaped badges.

---

### Edge Cases

- The page loads before content is fully painted: the enter animation MUST NOT hide or delay
  legibility of content for visitors, and content MUST be fully usable if animation is
  disabled.
- A visitor has "reduce motion" enabled: the enter animation MUST be suppressed and all
  content shown immediately in its final position.
- A visitor has no stored theme preference and no detectable system preference: the page MUST
  fall back to a sensible default appearance (light).
- An experience photo fails to load: the entry MUST remain readable with its company name,
  position, and years intact.
- The hero portrait fails to load or is a placeholder: the hero MUST remain fully legible and
  usable, with the portrait's alternative text available.
- Fewer than three experience entries exist: the section MUST render only the available entries,
  with no empty placeholder slots.
- The skill set is wider than the available space: pills MUST wrap onto multiple lines and stay
  readable on narrow viewports.
- The page is viewed on a small phone: the bottom navigation and its labels MUST remain
  reachable with tap targets of at least 44px and MUST NOT obscure the primary actions.
- The viewport is too narrow for all navigation items to fit: lower-priority destinations
  (Projects, then Contact me) MUST move into an overflow/dropdown or be hidden so the bar still
  fits without overflow, while Home, About, and the theme toggle stay reachable (see FR-018).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The home route MUST present a landing hero as the first content a visitor sees.
- **FR-002**: The hero MUST present, in order: a refined tagline ("System design &
  sustainable solutions"), a greeting, the person's identity as a **Full Stack Developer**,
  and a short descriptive statement. The finalized hero description copy is: "I design and
  build secure, scalable cloud-native platforms on AWS and Azure, and lead engineering teams
  to ship high-traffic systems across e-commerce and agriculture. My focus is DevSecOps,
  reliable services, and mentoring the engineers around me — building software that keeps
  delivering long after launch." The hero MUST also present a portrait image alongside this
  content; the portrait MAY be a placeholder until a final image is supplied.
- **FR-003**: The hero MUST present exactly two primary calls-to-action: one to view projects
  and one to view the CV. "View Projects" MUST navigate to `/projects`; "View CV" MUST navigate
  to a dedicated `/cv` page. Both calls-to-action MUST expose distinct hover, focus, and active
  states and present tap targets of at least 44px.
- **FR-004**: The page MUST provide a persistent, pill-style bottom navigation bar (a modern
  mobile-style nav bar, NOT a macOS magnify dock) containing four destinations, in order, that
  each navigate to their real route and are reachable by the visitor: Home (`/`), About
  (`/about`), Projects (`/projects`), and Contact me (`/contact`). The bar MUST be fixed to the
  bottom of the viewport, horizontally centered, and remain visible while the page scrolls. It
  MUST be rendered as a pill-shaped component: a fully rounded radius with a solid surface fill,
  a hairline border, and a subtle shadow (design tokens per `design.md`).
- **FR-006**: The bottom navigation MUST include a control to toggle between light and dark
  appearance. The toggle lives within the nav bar, visually separated from the destination
  links, uses distinct light/dark icon states (e.g. sun/moon), and has an accessible name. An
  explicit pressed-state exposure is not required — the accessible name communicates the action.
- **FR-007**: The visitor's chosen appearance MUST persist across page reloads and return
  visits.
- **FR-008**: On first load, the page MUST honor the visitor's system appearance preference
  when no explicit choice has been stored, without showing a flash of the incorrect theme. The
  correct theme MUST be applied before the first paint (via a blocking inline script). The
  resolution order MUST be: stored choice → system preference (`prefers-color-scheme`) → light
  as the final fallback.
- **FR-009**: A second section MUST display the top three most recent work experiences, each
  showing only the company name, a photo, the position, and the working start and end period.
  Start and end periods MUST be formatted as `{short_month}-{year}` (e.g. `Jan-2023`).
- **FR-010**: A current role's end period MUST be presented as the literal `Present` rather
  than a fixed past date.
- **FR-011**: A third section MUST display the person's skills as pill-shaped badges. The
  skills MUST reflect the person's actual stack and domains, including cloud-native
  architecture on AWS and Azure, system design, DevSecOps, CI/CD, monitoring/observability,
  incident management, QA governance, and core full-stack web technologies. Each skill pill MAY
  pair a brand/technology icon with its label; when no suitable brand icon is available, the pill
  MUST render as text-only without breaking the layout.
- **FR-012**: The page MUST present its content with an enter animation on load: the hero's
  elements MUST fade in and translate slightly upward into place in a staggered, top-to-bottom
  sequence. Per-element entrance duration and easing MUST follow `design.md` §8 (~250ms, easing
  `ease-out` / cubic-bezier(0.16, 1, 0.3, 1)) with a short stagger between elements; the
  animation MUST NOT block legibility or interaction.
- **FR-013**: The enter animation MUST be suppressed for visitors who prefer reduced motion,
  and all content MUST remain fully usable with motion disabled.
- **FR-014**: All interactive elements (navigation destinations, theme toggle, and
  calls-to-action) MUST be reachable and operable by keyboard, with visible focus states. All
  text and interactive UI MUST meet WCAG AA color contrast in both light and dark themes
  (`design.md` §9).
- **FR-015**: The layout MUST adapt from small mobile viewports up through desktop, keeping
  navigation, calls-to-action, and content legible and usable at every size. The navigation
  bar's spacing and sizing MUST scale against the project's single breakpoint (`lg` = 1024px per
  Constitution III), stepping once between the mobile and desktop tiers; every nav item and the
  theme toggle MUST present a tap target of at least 44px on all viewports. Hero and home
  sections MUST sit full-width on small viewports and center within the design system's
  `--container-wide` (1200px) on desktop, per `design.md` §4.1.
- **FR-016**: All page copy MUST use a calm, confident, professional tone consistent with
  `design.md` (Calm · Professional · Trustworthy · Mature). Copy MUST avoid hype,
  superlatives, and sales-oriented language, and MUST NOT be redundant.
- **FR-017**: The bottom navigation MUST indicate the active/current destination based on the
  current URL route (not scroll position). The item whose route matches the current page MUST be
  shown with a filled/glowing pill highlight together with `aria-current="page"`; on the landing
  route (`/`) the Home item is the active item. This active highlight — a distinct pill fill plus
  a subtle glow/ring, not a color change alone — is the interaction cue: the navigation MUST NOT
  use a macOS-style magnify/scale effect, and the highlight MUST remain visible under reduced
  motion. The nav text/icons and the active-pill highlight MUST meet WCAG AA contrast in both
  light and dark themes (per `design.md` §9).
- **FR-018**: On very narrow viewports where the four destinations plus the theme toggle cannot
  all fit, the navigation MUST degrade gracefully: lower-priority destinations MUST collapse into
  an overflow/dropdown control, or be hidden in priority order (Projects first, then Contact me),
  while Home, About, and the theme toggle remain directly reachable. No destination may become
  unreachable and the bar MUST NOT overflow the viewport.
- **FR-019**: The page MUST use a sound semantic structure: exactly one `<h1>`, landmark regions
  for navigation and main content, and a "Skip to content" link as the first focusable element
  (`design.md` §9).
- **FR-020**: Every experience photo and the hero portrait MUST provide descriptive alternative
  text (or an equivalent non-visual fallback) so the content stays meaningful without images.

### Key Entities *(include if feature involves data)*

- **Work Experience**: A single recent role. Attributes shown: company name, company photo,
  position/title, working start period, and working end period. Start/end use
  `{short_month}-{year}` (e.g. `Jan-2023`); a current role's end is the literal `Present`.
- **Skill**: A single competency the person has, presented as a pill-shaped badge with a
  label. Skills are grounded in the person's real stack and domains (e.g. AWS, Azure, system
  design, DevSecOps, CI/CD, observability, incident management, QA governance, and full-stack
  web technologies).
- **Theme Preference**: The visitor's chosen appearance (light or dark), remembered between
  visits, with a system-preference fallback.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: On initial `/` render at common mobile and desktop widths, a first-time visitor
  can see the **Full Stack Developer** role and both call-to-action labels without scrolling.
- **SC-002**: 100% of the four navigation destinations (Home, About, Projects, Contact me)
  and both calls-to-action are reachable and operable using only a keyboard.
- **SC-003**: Switching between light and dark appearance takes effect immediately, and the
  chosen appearance is retained on 100% of subsequent reloads within the same browser.
- **SC-004**: The experience section shows exactly three roles, each displaying all four
  required details (company name, photo, position, start–end year) with no missing fields.
- **SC-005**: With reduced-motion enabled, 100% of page content is visible and usable with no
  animation, and no content is hidden waiting on animation.
- **SC-006**: The page is usable without horizontal scrolling or obscured actions on viewport
  widths from 320px through 1536px and above.
- **SC-007**: On first load, visitors do not perceive a flash of the incorrect theme — the
  correct appearance is applied before the first paint.

## Assumptions

- The primary audience is recruiters, hiring managers, and technical reviewers evaluating the
  person quickly, often on mobile devices.
- "View Projects" navigates to the `/projects` route; "View CV" navigates to the `/cv` route
  (see FR-003), which itself may offer a downloadable/ATS-friendly export per `design.md`. The
  bottom navigation links are cross-route (Home `/`, About `/about`, Projects `/projects`,
  Contact me `/contact`), not in-page anchors. `/about`, `/projects`, `/contact`, and `/cv` are
  separate routes outside this feature's build scope; this feature only guarantees the links
  point to them.
- The Projects destination is confirmed to be the `/projects` route (owner-confirmed 2026-07-08),
  no longer merely assumed.
- The "top three" work experiences are the three most recent roles; ordering is by recency.
- Skills, experience entries, and profile copy are supplied as content and can be updated
  without redesigning the page.
- Default appearance when neither a stored choice nor a system preference is available is
  light mode, consistent with the project's "high-quality paper" light theme.
- Iconography, colors, spacing, typography, and motion follow the tokens and rules defined in
  the project's design system (`design.md`). `design.md` is the source of truth for the
  navigation's visual, interaction, and accessibility detail (active-state indication, motion,
  and contrast); the fixed bottom-center pill placement is the sole owner-approved deviation
  from `design.md` §7.1, tracked in `plan.md`.
- The hero portrait MAY be a placeholder image until a final photo is supplied; the layout and
  its alternative text MUST hold regardless.
- Skill brand icons are provided via an icon pack where available; skills without a suitable
  brand icon degrade to text-only pills, so the absence of a brand-icon pack is not a hard
  blocker.
- The bottom-navigation links point at real routes that are not built in this feature
  (`/about`, `/projects`, `/contact`, `/cv`); the links are preserved as-is so their targets
  exist. Visiting a route whose page is not yet built returns the site's 404 page, which is
  itself out of scope here and yet to be developed. Only the presence of the link target is
  guaranteed — no route test is required.
