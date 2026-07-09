# Navigation & Theme-Toggle Requirements Quality Checklist: Landing Hero Page

**Purpose**: Validate that the requirements for the bottom pill-style navigation bar and its
embedded theme toggle are complete, clear, consistent, and measurable — before implementation.
**Created**: 2026-07-08
**Feature**: [spec.md](../spec.md)
**Focus**: Bottom Navigation (pill style, active state) · Theme Toggle · Navigation Accessibility
**Depth**: Standard · **Audience**: Author (pre-implementation)

> This is a "unit test for the requirements." Each item questions the quality of what is
> *written* in the spec/plan — not whether the built navigation works.

## Requirement Completeness — Navigation Structure

- [x] CHK001 - Are the exact navigation destinations and their order (Home, About, Projects, Contact me) specified? [Completeness, Spec §FR-004]
- [x] CHK002 - Is the navigation's persistence and screen position (fixed, bottom, centered) specified rather than left to interpretation? [Completeness, Spec §FR-004]
- [x] CHK003 - Is the pill-style appearance defined with concrete attributes (pill shape/radius, surface fill, border, shadow) instead of only the label "pill-style"? [Clarity, Spec §FR-004, plan.md design-system note]
- [x] CHK004 - Are requirements defined for the navigation's behavior while scrolling and across all three content sections (does it stay fixed/visible)? [Gap]
- [x] CHK005 - Is the presence and placement of the theme toggle *within* the nav bar specified (including any separator between links and toggle)? [Completeness, Spec §FR-006]
- [x] CHK006 - Is the route target of each navigation item explicitly stated, including the assumed `/projects` route? [Completeness, Spec §FR-004, Assumptions]

## Requirement Completeness — Active State & Interaction

- [x] CHK007 - Is the active/current-route indication requirement defined (which item is highlighted on the landing route)? [Completeness, Spec §FR-017]
- [x] CHK008 - Are the visual properties of the active "glow/highlight" state specified enough to build (e.g. highlighted pill fill, ring/glow) rather than named only? [Clarity, Spec §FR-017]
- [x] CHK009 - Is it explicitly required that the active state is conveyed by more than color alone? [Completeness, Spec §FR-017]
- [x] CHK010 - Are hover, focus, and active interaction states defined for the navigation items and the theme toggle? [Gap]
- [x] CHK011 - Is it stated that the navigation must NOT use a macOS magnify/scale effect (so the prior dock behavior is not reintroduced)? [Clarity, Spec §FR-017]

## Requirement Completeness — Theme Toggle

- [x] CHK012 - Is the theme toggle's affordance specified (distinct icon states for light vs dark)? [Completeness, Spec §FR-006]
- [x] CHK013 - Is theme persistence across reloads and return visits required and unambiguous? [Completeness, Spec §FR-007]
- [x] CHK014 - Is the first-load system-preference behavior (honor `prefers-color-scheme` when no stored choice) specified? [Completeness, Spec §FR-008]
- [x] CHK015 - Is the default appearance defined when neither a stored choice nor a system preference exists? [Edge Case, Spec Edge Cases]

## Requirement Clarity & Measurability

- [x] CHK016 - Is "takes effect immediately" for the theme switch defined with an observable threshold? [Measurability, Spec §SC-003]
- [x] CHK017 - Is "no flash of the incorrect theme" defined in an observable way (correct theme applied before first paint)? [Measurability, Spec §FR-008, §SC-007]
- [x] CHK018 - Is the nav bar's responsive behavior (spacing/size from mobile to desktop) expressed against a specific breakpoint or container rule? [Clarity, Spec §FR-015]
- [x] CHK019 - Are tap-target size requirements (≥44px) stated for the nav items and toggle on small viewports? [Measurability, Spec §FR-015, design.md §9]

## Requirement Consistency

- [x] CHK020 - Do the navigation destinations in FR-004 align with the route list in Assumptions and the CTA targets in FR-003 (no `/projects` vs `#projects` conflict)? [Consistency, Spec §FR-003, §FR-004]
- [x] CHK021 - Are FR-004 (pill nav) and FR-017 (active-state highlight, no magnify) consistent with one another and free of leftover macOS "dock/magnify" language? [Consistency, Spec §FR-004, §FR-017]
- [x] CHK022 - Is the "Projects" destination handled consistently as a route (`/projects`), with no contradictory on-page-anchor statement? [Conflict, Spec §FR-004]
- [x] CHK023 - Are the nav/theme motion requirements consistent between FR-017 (glow, no scale), FR-012/013 (enter animation + reduced-motion), and design.md §8 motion budgets? [Consistency, Spec §FR-012, §FR-013, §FR-017]
- [x] CHK024 - Is the deviation from design.md §7.1 (top bar, underlined active, "not a colored pill") explicitly reconciled so plan and design system do not silently conflict? [Conflict, plan.md design-system note, design.md §7.1]

## Accessibility Requirement Coverage

- [x] CHK025 - Are keyboard operability and visible focus requirements defined for every nav link and the theme toggle? [Coverage, Spec §FR-014]
- [x] CHK026 - Are accessible-name requirements specified for the icon-only nav items and the theme toggle? [Gap]
- [x] CHK027 - Is the active navigation state required to be exposed to assistive tech (e.g. `aria-current="page"`), not signalled by highlight alone? [Coverage, Spec §FR-017]
- [x] CHK028 - Is the theme toggle's state exposure specified (e.g. pressed/label reflecting current theme) for screen-reader users? [Gap, Spec §FR-006]
- [x] CHK029 - Is AA color contrast required for the nav text/icons and the active-pill highlight in *both* light and dark themes? [Coverage, Spec §FR-014, design.md §9]
- [x] CHK030 - Are reduced-motion requirements defined for the nav/toggle so the active highlight stays visible with animation disabled? [Coverage, Spec §FR-013, §FR-017]

## Edge Case & Scenario Coverage

- [x] CHK031 - Are requirements defined for how the fixed bottom nav avoids obscuring the CTAs/content on small phones? [Edge Case, Spec §FR-015, Edge Cases]
- [x] CHK032 - Is behavior specified when the visitor is on a route whose page is out of scope (`/about`, `/projects`, `/contact`) — i.e. the link target's validity is testable? [Assumption, Spec Assumptions]
- [x] CHK033 - Is behavior specified for the nav bar at very narrow widths (labels/tooltips, wrapping, or no overflow) so items remain reachable? [Edge Case, Gap]

## Ambiguities, Conflicts & Assumptions

- [x] CHK034 - Are all out-of-scope route dependencies (`/about`, `/projects`, `/contact`, `/cv`) explicitly recorded so the links' validity is testable? [Assumption, Spec Assumptions]
- [x] CHK035 - Are there remaining `[NEEDS CLARIFICATION]` or unresolved nav/theme decisions (e.g. tooltip behavior, separator styling) that should block implementation? [Ambiguity]

## Notes

- Check items off as the spec/plan is confirmed to satisfy each question: `[x]`.
- An unchecked item means the *requirement* needs tightening — not that code is wrong.
- Items marked `[Gap]` point to requirements that appear missing from the current spec/plan.
- This checklist reflects the 2026-07-08 navigation restyle (pill nav + glow/highlight active
  state, FR-017); it supersedes the macOS-dock framing still present in `ux.md`.
