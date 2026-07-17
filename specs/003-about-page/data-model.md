# Phase 1 Data Model: About Page

All content lives in Astro Content Collections validated by Zod in `src/content.config.ts`.
Malformed or missing fields fail the build (Constitution Principle V). This feature **reuses**
`skills` unchanged, **extends** `profile` and `experience`, and **adds** `education` and
`achievements`.

## Reused: Skill Category (`skills` collection) — no schema change

Source: `src/content/skills.yaml` (ordered array of categories; see feature 002 data model).

**About display rules**:

- Render only categories whose `pages` array includes `about`.
- For each rendered category, show **all** skills as pills (not the home page's first-3 subset),
  in array order, using the existing `SkillPill` component (icon optional; name-only when no icon).

## Extended: Profile (`profile` collection)

Source: `src/content/profile.yaml`. Existing fields unchanged; **add**:

| Field | Type | Required | Rules |
|-------|------|----------|-------|
| `highlights` | array of string | yes | Non-empty; each item a short point-form statement. Rendered as a bulleted list under the summary. |

**About display rules**: The Professional Summary section reuses `profile.description` as the
narrative and renders `profile.highlights` as a point-form list.

## Extended: Experience Entry (`experience` collection)

Source: `src/content/experience.yaml`. Existing fields unchanged (`id`, `company`, `position`,
`photo`, `photoAlt?`, `start`, `end`); **add**:

| Field | Type | Required | Rules |
|-------|------|----------|-------|
| `summary` | string | yes | Non-empty. Short description of the role/achievements. Shown on About; ignored by the home page card. |

**About display rules**: Load the collection, reverse deterministic id order (latest first), and
render a LinkedIn-style hairline-separated list — company logo (`photo`) on the left; employer
(`company`), position, period (`start` – `end`, `end` may be `Present`), and `summary` on the
right. No timeline UI.

## New: Education Entry (`education` collection)

Source: new `src/content/education.yaml` — an ordered array (newest appended last; displayed
reversed, latest first).

| Field | Type | Required | Rules |
|-------|------|----------|-------|
| `id` | string | yes | Unique sequence-prefixed slug (e.g., `002-state-university`) for deterministic ordering. Kebab-case. |
| `photo` | string | yes | Non-empty asset path to the institution image/logo (e.g., `/images/education/...svg`). |
| `photoAlt` | string | no | Defaults to `"{school} logo"` in the component. |
| `school` | string | yes | Non-empty. Institution name. |
| `course` | string | yes | Non-empty. Qualification / field of study. |
| `start` | string | yes | 4-digit year, pattern `^\d{4}$` (e.g., `2011`). |
| `end` | string | yes | 4-digit year pattern **or** the literal `Present`. |

**Display rules**: Same visual format as Work Experience entries (image left; `school`, `course`,
and period `start` – `end` right), ordered index-descending (latest first).

## New: Achievement (`achievements` collection)

Source: new `src/content/achievements.yaml` — an ordered array (latest appended last; displayed
reversed, latest first).

| Field | Type | Required | Rules |
|-------|------|----------|-------|
| `id` | string | yes | Unique sequence-prefixed slug for deterministic ordering. Kebab-case. |
| `title` | string | yes | Non-empty. The achievement name — the displayed field. |
| `issuer` | string | no | Issuing organization/company. Rendered when present. |
| `date` | string | no | Free-form date/year label. Rendered when present. |
| `link` | string | no | Absolute URL. When present, the item shows an "open in new tab" affordance and opens `target="_blank" rel="noopener noreferrer"`. |

**Display rules**: Render `title` for every item; render `issuer`/`date`/`link` only when present.
Ordered index-descending (latest first). An empty collection omits the section entirely (FR-011).

## Schema change summary (`src/content.config.ts`)

- `profile`: add `highlights: z.array(z.string().min(1)).min(1)`.
- `experience`: add `summary: z.string().min(1)`.
- **New** `education` collection: `file('src/content/education.yaml')` with the schema above; add a
  `year = /^\d{4}$/` pattern; `end` is `z.union([z.string().regex(year), z.literal('Present')])`.
- **New** `achievements` collection: `file('src/content/achievements.yaml')` with the schema above
  (`link` optional; icon/affordance handled in the component).
- Register both new collections in the exported `collections` object.

## Ordering conventions (site-wide)

Experience, Education, and Achievements all use **index-descending** display: content is authored
oldest→newest (newest appended at the bottom of the YAML array), and the component reverses for
display so the latest entry appears first. Sequence-prefixed `id`s keep Astro's collection
ordering deterministic.

## Relationships

- `/about` (`about.astro`) reads: `profile` (summary + highlights), `skills` (filtered by `pages`
  includes `about`), `experience` (reversed), `achievements` (reversed), `education` (reversed).
- The closing CTA links to `/cv` (matches `profile.cvHref`); the `/cv` page itself is out of scope.
- The bottom navigation already routes "About" → `/about` and marks it current on that page.
