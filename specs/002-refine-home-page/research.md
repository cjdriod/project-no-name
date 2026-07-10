# Phase 0 Research: Refine Home Page & Navigation

All spec `[NEEDS CLARIFICATION]` items were resolved during `/speckit.clarify` (see spec Clarifications, Session 2026-07-10). This document records the technical decisions needed to implement those clarified requirements within the existing Astro + Iconify + Tailwind stack.

## R1. Refined skills.yaml data shape (categories + page flags)

- **Decision**: Represent skills as an ordered **array of category objects** in `skills.yaml`, each with `id`, `name`, `pages` (array of `home` | `about` | `cv`), and `skills` (ordered array of `{ name, icon? }`). Loaded via Astro's `file()` loader; each category is one collection entry keyed by `id`.
- **Rationale**: An array preserves author-controlled order for both categories and the "top 3 by array index" rule (FR-006b). Per-category `pages` flag matches the clarified decision (flag lives at the category level; skills inherit). `file()` loader supports an array of objects when each has an `id`.
- **Alternatives considered**:
  - *Per-skill page flags* — rejected in clarify (more verbose, harder to reason about eligibility).
  - *Keyed object map (current flat style)* — rejected: object keys do not guarantee stable display order, and "top 3 by array index" needs a real array.
  - *Separate file per category* — rejected: over-engineered for ~7 small categories; harder to reorder.

## R2. Category set and content mapping

- **Decision**: Fixed category set: `Backend Development`, `Cloud Architecture`, `Frontend Development`, `Microservices & APIs`, `DevOps`, `Data`, `others`. Seed skills from the spec's expertise examples and re-home the existing flat skills into these categories.
- **Rationale**: Matches the clarified authoritative set. Reuses existing skill entries (JavaScript, TypeScript, Vue, Angular, Java, AWS, Azure, System Design, DevSecOps, CI/CD, Observability, Incident Management, QA Governance, Cloud-native) rather than discarding them.
- **Seed content** (initial, author-editable; only home-flagged categories render this feature):
  - Backend Development — Java, Spring Boot, Node.js
  - Cloud Architecture — AWS, Azure, Serverless
  - Frontend Development — React, Vue
  - Microservices & APIs — RESTful services, event-driven systems
  - DevOps — Docker, CI/CD, GitHub Actions
  - Data — (author-provided; may be flagged for cv/about only)
  - others — (author-provided; catch-all)
- **Alternatives considered**: Dropping the old flat skills entirely — rejected; migrate to avoid content loss.

## R3. Icon registration (astro-icon allowlist)

- **Decision**: Add the new icons required by seed skills and contacts to the `include` allowlist in `astro.config.mjs`. `SkillPill` already renders name-only when `icon` is omitted, so any skill without a suitable icon simply omits the `icon` field.
- **Rationale**: `astro-icon` only bundles icons explicitly listed in `include`; referencing an unlisted icon fails the build. Registering avoids broken builds while honoring the "no icon → name only" fallback (FR-006c).
- **New `simple-icons` to add**: `nodedotjs`, `spring` (Spring Boot), `react`, `docker`, `githubactions`, `github`, `linkedin`. (`serverless` exists in simple-icons if used, else name-only.)
- **New `material-symbols` to add**: `mail-outline-rounded` is already listed (used for the email contact). `api` or existing `account-tree-outline-rounded` can represent RESTful/event-driven, or leave those name-only.
- **Alternatives considered**: Importing full Iconify sets — rejected; inflates bundle and violates the lean, explicit allowlist already in the repo. Name-only pills for unmatched skills is an accepted, spec-sanctioned fallback.

## R4. Contact data + external new-tab links

- **Decision**: Add a `contacts` array to `profile.yaml`, each item `{ channel: 'email'|'linkedin'|'github', label, href, icon }`. Render in a new `ContactSection.astro` as `<a href target="_blank" rel="noopener noreferrer">` with icon + text. Email uses a `mailto:` href (opens the mail client); LinkedIn/GitHub use profile URLs.
- **Rationale**: Clarified storage decision (profile.yaml contacts list). `rel="noopener noreferrer"` is the security/accessibility standard for `target="_blank"`. Keeps contact metadata type-safe and out of the component (Principle V).
- **Note**: `mailto:` links open the OS mail handler rather than a browser tab; `target="_blank"` is harmless there. Actual address/URLs may be placeholders until provided.
- **Alternatives considered**: Dedicated contact collection (rejected in clarify); hardcoding links (violates Principle V).

## R5. Experience migration to YAML array, newest-first display

- **Decision**: Replace the `experience/*.md` glob collection with a single `experience.yaml` array. Change the `experience` loader in `content.config.ts` from `glob(...)` to `file('src/content/experience.yaml')`; drop the required numeric `order` field; assign each entry a stable `id`. In `index.astro`, sort by the collection's array/source order and **reverse** it for display (latest-appended first).
- **Rationale**: Matches clarified decision (array index is order; append newest last; display reversed). Removing `order` avoids manual renumbering. `ExperienceSection` currently `slice(0,3)`s an already-sorted list; it will instead receive the reversed array (slice retained if a max count is desired).
- **Ordering mechanism**: Astro's `file()` loader preserves array order; capture index at load and reverse. Because `end: 'Present'` roles are appended last, reversing places the current role on top.
- **Alternatives considered**: Keep Markdown + reverse by `order` (rejected in clarify — user wants YAML array, no explicit order field); sort by parsed dates (rejected — `Mon-YYYY` strings and `Present` complicate parsing; array index is simpler and author-controlled).

## R6. Hero developer illustration (3D-feel SVG)

- **Decision**: Create a static SVG illustration of a happy developer at a laptop with a blurred code/system-diagram background rendered in a 3D-feel style, stored as an asset (e.g., `public/images/developer-illustration.svg`), and reference it from `profile.yaml` (`photo`/`photoAlt`). No code text baked as selectable content; decorative background only.
- **Rationale**: Swapping the `photo` field keeps the Hero component largely unchanged (it already renders `data.photo`/`data.photoAlt` with explicit `width`/`height`), preserving zero-CLS and Principle I (no meaningful text in images; descriptive alt).
- **Constraints**: Keep explicit dimensions to avoid layout shift; ensure sufficient contrast in both themes; SVG must be self-contained (no external fonts/scripts).
- **Alternatives considered**: Raster (PNG/WebP) — rejected; SVG scales crisply and stays lightweight for the "3D-feel" line-art. Inline SVG component — optional, but file asset keeps Hero simple.

## R7. NavBar Contact tab removal

- **Decision**: Remove the `Contact me` item from the `items` array in `NavBar.astro` and delete the now-dead `@media (max-width: 360px)` rule that hides `.bottom-nav__item--contact`.
- **Rationale**: Fulfills FR-001/FR-011 (no broken/empty references). Remaining tabs (Home, About, Projects) keep their existing responsive behavior.
- **Alternatives considered**: Hiding via CSS only — rejected; leaves dead markup and a phantom tab in the DOM/a11y tree.

## Open items

None. All requirements are implementable with the existing stack; no new dependencies are introduced.
