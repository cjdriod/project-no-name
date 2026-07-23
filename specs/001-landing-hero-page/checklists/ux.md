# UX, Accessibility & Content Requirements Quality Checklist: Landing Hero Page

**Purpose**: Validate that the hero, content, animation, and general accessibility requirements
in the spec are complete, clear, consistent, and measurable — before implementation.
**Created**: 2026-07-08 · **Refined**: 2026-07-08 (navigation & theme-toggle items moved to
`navigation.md` after the pill-nav restyle)
**Feature**: [spec.md](../spec.md)
**Focus**: Hero & CTAs · Enter Animation · Content & Copy · Experience & Skills · General A11y
**Depth**: Standard · **Audience**: Author (pre-implementation)

> This is a "unit test for the requirements." Each item questions the quality of what is
> *written* in the spec — not whether the built page works. Bottom-navigation and theme-toggle
> requirement quality is now covered separately in [`navigation.md`](./navigation.md).

## Requirement Completeness — Hero, CTAs & Content Structure

- [x] CHK001 - Are requirements defined for the ordering and presence of every hero element (tagline, greeting, identity, description, CTAs, portrait)? [Completeness, Spec §FR-001, §FR-002]
- [x] CHK002 - Are the two hero CTAs fully specified — labels ("View Projects", "View CV"), explicit targets (`/projects`, `/cv`), and hover/focus/active interaction states? [Completeness, Spec §FR-003]
- [x] CHK003 - Are the enter-animation properties (which elements animate, sequence/stagger, direction, duration) specified rather than just "an enter animation"? [Completeness, Spec §FR-012]

## Requirement Clarity & Measurability

- [x] CHK004 - Is "enter animation" quantified (duration, offset, easing) so it is objectively verifiable? [Measurability, Spec §FR-012]
- [x] CHK005 - Is "within 10 seconds" (identity + CTAs findable) tied to a testable condition/state rather than a subjective judgement? [Measurability, Spec §SC-001]
- [x] CHK006 - Is the "full-width on small viewport, container on desktop" behavior expressed with a specific breakpoint and container width? [Clarity, Spec §FR-015]

## Requirement Consistency

- [x] CHK007 - Are the section order (hero → experience → skills) and section labels consistent between the User Stories, FRs, and references across the spec? [Consistency]
- [x] CHK008 - Are motion requirements consistent between FR-012 (enter animation) and FR-013 (reduced-motion suppression), with no gap on hover/interaction motion? [Consistency, Spec §FR-012, §FR-013]

## Accessibility Requirement Coverage

- [x] CHK009 - Are keyboard operability, visible focus, and touch-target size (≥44px) required for both hero CTAs? [Coverage, Spec §FR-014, .skills/design.md §9]
- [x] CHK010 - Is a color-contrast requirement stated for text and UI in *both* light and dark themes (not just one)? [Completeness, Spec §FR-014, .skills/design.md §9]
- [x] CHK011 - Are requirements defined for reduced-motion users so content is fully usable with all animation disabled? [Coverage, Spec §FR-013]
- [x] CHK012 - Are semantic-structure requirements (single `<h1>`, landmark regions, skip link) specified for the page? [Gap]
- [x] CHK013 - Is alternative-text / non-visual fallback specified for the experience photos and hero portrait? [Coverage, Spec Edge Cases]

## Content & Copy Requirement Quality

- [x] CHK014 - Is the finalized hero copy (tagline, greeting, identity, description) captured in the spec so it needs no further editing? [Completeness, Spec §FR-002]
- [x] CHK015 - Is the copy tone requirement ("calm, confident, professional; no hype") defined in a way a reviewer could objectively judge? [Measurability, Spec §FR-016]
- [x] CHK016 - Are the exact fields shown per experience entry (only company, photo, position, start–end) specified, including what is intentionally excluded? [Clarity, Spec §FR-009]
- [x] CHK017 - Is the experience date format (`{short_month}-{year}`, and `Present` for current roles) specified unambiguously? [Clarity, Spec §FR-009, §FR-010]
- [x] CHK018 - Are the skill labels required to reflect the person's real stack/domains, with clear scope of which skills belong? [Completeness, Spec §FR-011]
- [x] CHK019 - Is the "icon + text" requirement for skill pills specified, including what happens when a suitable brand icon is unavailable? [Coverage, Gap]
- [x] CHK020 - Is the hero portrait explicitly allowed to be a placeholder, with a requirement for how it behaves until a final image exists? [Assumption, Spec Assumptions]

## Edge Case & Scenario Coverage

- [x] CHK021 - Is the fallback behavior specified when an experience photo (or the portrait) fails to load? [Edge Case, Spec Edge Cases]
- [x] CHK022 - Are requirements defined for the case where fewer than three experience entries exist? [Coverage, Gap]
- [x] CHK023 - Is behavior specified for skill sets that overflow (wrapping/quantity limits) on narrow viewports? [Edge Case, Gap]

## Ambiguities, Conflicts & Assumptions

- [x] CHK024 - Is the assumption that "top three" means the three most recent roles stated, with the ordering rule defined? [Assumption, Spec Assumptions]
- [x] CHK025 - Are there any remaining `[NEEDS CLARIFICATION]` or unresolved decisions (e.g. skill brand-icon pack availability) that should block implementation? [Ambiguity]

## Notes

- Check items off as the spec is confirmed to satisfy each question: `[x]`.
- An unchecked item means the *requirement* needs tightening — not that code is wrong.
- Items marked `[Gap]` point to requirements that appear missing from the current spec.
- Navigation bar (pill style, active state) and theme-toggle requirement quality live in
  [`navigation.md`](./navigation.md); this file no longer duplicates them.
