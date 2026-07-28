# Phase 0 Research: About Page

The stack is fixed by the Constitution (Astro + TypeScript + Tailwind + Iconify + Motion One +
Content Collections), so no technology research is required. This document records the design
decisions this feature introduces and the rationale for each. No `NEEDS CLARIFICATION` markers
remain.

## D1. Work Experience presentation — LinkedIn-style list (no timeline)

- **Decision**: Render Work Experience as a vertical, LinkedIn-style list. Each entry shows a
  company logo on the left and, to its right, the employer, position, working period
  (`{month} {year}`, ongoing → "Present"), and a short summary. Consecutive entries are separated
  by a thin hairline divider. No timeline spine/rail is drawn.
- **Rationale**: The 2026-07-15 clarification supersedes `.skills/design.md` §5/§7.5 (which specified a
  vertical timeline). A hairline-separated list matches the calm/minimal pattern already used by
  Core Expertise and keeps the reading flow single-column and legible on mobile.
- **Alternatives considered**: (a) Vertical timeline with spine — rejected per clarification;
  (b) bordered cards per entry — rejected as heavier than the site's hairline aesthetic.

## D2. Experience ordering — index descending, latest first

- **Decision**: Reuse the existing `experience` collection and display order: entries authored in
  index order (newest appended last), reversed for display so the latest appears first — identical
  to the home page.
- **Rationale**: Consistency with the home page (`.toReversed()` over sequence-prefixed ids) and
  the user's explicit direction ("same as previous, sort descending based on index").
- **Alternatives considered**: An explicit `order` field — rejected earlier in feature 002 in
  favor of sequence-prefixed ids for deterministic collection ordering.

## D3. Experience `summary` field

- **Decision**: Extend the `experience` schema with a required `summary` string (a short
  role/achievement description). The home page's `ExperienceCard` ignores it; the About list
  renders it.
- **Rationale**: FR-005 requires a short job summary on About. Making it required enforces content
  completeness at build time (Principle V) without affecting the home page.
- **Alternatives considered**: Optional `summary` — rejected; About would silently render empty
  summaries, weakening the type-safe contract.

## D4. Skills on About — categories flagged `about`, all skills shown

- **Decision**: Reuse the `skills` collection. Render every category whose `pages` array includes
  `about`, showing **all** skills in each category as pills (via the existing `SkillPill`), not the
  home page's top-3 subset.
- **Rationale**: FR-004 groups skills by category with no "top 3" cap for About; the user asked to
  "follow the pages flag for about page". Reusing `SkillPill` keeps visual consistency.
- **Alternatives considered**: Reuse the top-3 slice from home — rejected; About is the
  comprehensive reading view and should show the full skill set per category.

## D5. Education — new collection, experience-style format

- **Decision**: Add an `education` collection (YAML array) with fields: `id`, `photo`
  (institution image/logo), optional `photoAlt`, `school` (institution), `course`
  (qualification/field of study), `start`, `end` (4-digit years). Render with the same visual
  format as Work Experience (image left; details right), ordered index-descending (latest first).
- **Rationale**: The user asked education to "follow exactly the format in experience" and to carry
  an image, duration, course name, and school name. Years-only period matches FR-007 ("start–end
  years").
- **Alternatives considered**: Reuse the `Mmm-YYYY` period pattern from experience — rejected;
  education is conventionally year-granular, and FR-007 specifies years.

## D6. Achievements — new collection, name-first display

- **Decision**: Add an `achievements` collection (YAML array) with required `title` (the displayed
  name) and optional `issuer`, `date`, and `link`. The About list shows the title; when present,
  optional fields render (a `link` shows an "open in new tab" affordance and opens a new tab).
  Ordered index-descending (latest authored last, shown first).
- **Rationale**: The user asked the Achievements section to "just show the name" with reverse
  ordering. Keeping `issuer`/`date`/`link` optional (per FR-006's MAY clauses) preserves
  forward-compatibility without forcing authors to supply them now.
- **Alternatives considered**: A bare `string[]` of names — rejected; an object with optional
  metadata keeps the schema extensible and satisfies FR-006's optional link affordance.

## D7. Professional Summary & Highlights — reuse `profile.yaml`

- **Decision**: Reuse the existing `profile.description` as the narrative summary and add a new
  required `highlights` array (point-form strings) to `profile.yaml`, rendered as a bulleted list.
- **Rationale**: The user asked to reuse `profile.yaml` and make highlights an array/point form.
  Reusing `description` avoids duplicating the professional narrative already authored for the hero.
- **Alternatives considered**: A separate about-only `summary` field — deferred; `description` is
  already an accurate professional summary, so a second field would duplicate content.

## D8. "Looking for more details?" CTA → `/cv`

- **Decision**: End the page with a CTA section: the prompt "Looking for more details?" and a
  link/button labeled "View my complete Curriculum Vitae (CV) →" pointing at `/cv`. Styled as an
  accent primary link/button per `.skills/design.md` (accent reserved for CTAs/links). Building `/cv` is
  out of scope (2026-07-15 clarification).
- **Rationale**: Matches the user's request and the design system's CTA guidance. `/cv` already
  exists as the profile's `cvHref` default, so the target is the canonical CV route.
- **Alternatives considered**: Plain inline text link — acceptable but a primary CTA reads as a
  clearer next step; hiding until `/cv` exists — rejected per clarification (link now).

## D9. Accessibility, motion, and layout stability

- **Decision**: Reuse the shared `Layout`, `NavBar`, and `data-reveal` entrance motion. All images
  (company/institution logos) carry explicit `width`/`height`. Sections use semantic headings; the
  page has a single `<h1>`. External links use `target="_blank" rel="noopener noreferrer"` with an
  accessible name indicating a new tab.
- **Rationale**: Preserves the Constitution's performance/accessibility baseline (no CLS, AA
  contrast, keyboard operability, reduced-motion support) with no new client JavaScript.
