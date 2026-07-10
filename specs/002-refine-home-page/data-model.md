# Phase 1 Data Model: Refine Home Page & Navigation

All entities are Astro Content Collections validated by Zod in `src/content.config.ts`. Malformed content fails the build (Constitution Principle V).

## Entity: Skill Category (`skills` collection)

Source: `src/content/skills.yaml` — an **ordered array** of category objects. Loaded via `file()`; category array order is significant (drives display order); skill array order within a category drives the "top 3" selection.

| Field | Type | Required | Rules |
|-------|------|----------|-------|
| `id` | string | yes | Unique slug (e.g., `backend-development`). Kebab-case. |
| `name` | string | yes | Display name (e.g., `Backend Development`). Non-empty. |
| `pages` | array of enum | yes | Subset of `home` \| `about` \| `cv`. Non-empty. Declares page eligibility for the whole category. |
| `skills` | array of Skill | yes | Non-empty. Ordered; first 3 shown on home page. |

### Sub-entity: Skill (item of `category.skills`)

| Field | Type | Required | Rules |
|-------|------|----------|-------|
| `name` | string | yes | Non-empty. Rendered as pill text. |
| `icon` | string | no | Iconify id matching `^[a-z0-9-]+:[a-z0-9-]+$`. Omit when no icon → pill shows name only. Icon id must be registered in the `astro-icon` allowlist. |

**Selection rules**:
- Home page renders only categories whose `pages` includes `home`.
- For each rendered category, show at most the first **3** skills by array index.
- A category with fewer than 3 skills shows all it has (no placeholder pills).

**Category set** (fixed, authoritative): Backend Development, Cloud Architecture, Frontend Development, Microservices & APIs, DevOps, Data, others.

## Entity: Contact Option (`profile.contacts[]`)

Source: new `contacts` array added to `src/content/profile.yaml`.

| Field | Type | Required | Rules |
|-------|------|----------|-------|
| `channel` | enum | yes | `email` \| `linkedin` \| `github`. |
| `label` | string | yes | Non-empty display text (e.g., `Email`, `LinkedIn`, `GitHub`). |
| `href` | string | yes | Destination. `email` → `mailto:...`; `linkedin`/`github` → absolute `https://` URL. Non-empty. |
| `icon` | string | yes | Iconify id (matches icon regex); registered in allowlist. |

**Rules**: Exactly three items expected on the home page (email, LinkedIn, GitHub). Each renders as an external link opening in a new tab (`target="_blank" rel="noopener noreferrer"`) with icon + label. Unconfigured/empty `href` items are omitted rather than rendered broken.

## Entity: Experience Entry (`experience` collection)

Source: new `src/content/experience.yaml` — an **ordered array** replacing `src/content/experience/*.md`. Array position is the order; newest is appended last; display is reversed (latest first). The previous required numeric `order` field is removed.

| Field | Type | Required | Rules |
|-------|------|----------|-------|
| `id` | string | yes | Unique sequence-prefixed slug (e.g., `003-aurora-systems`) so Astro's collection entry ordering remains deterministic without a separate `order` field. |
| `company` | string | yes | Non-empty. |
| `position` | string | yes | Non-empty. |
| `photo` | string | yes | Non-empty asset path. |
| `photoAlt` | string | no | Defaults to `"{company} logo"` in the card. |
| `start` | string | yes | Matches `^[A-Z][a-z]{2}-\d{4}$` (e.g., `Jan-2023`). |
| `end` | string | yes | Same period pattern **or** the literal `Present`. |

**Display rule**: `index.astro` loads the collection entries, reverses their deterministic id order, and passes them to `ExperienceSection`. IDs are sequence-prefixed to mirror array append order because Astro returns collection entries by id; no separate `order` field is read.

## Entity: Profile (`profile` collection) — updated

Existing fields unchanged except:

| Field | Change |
|-------|--------|
| `photo` | Points to the new developer illustration SVG (e.g., `/images/developer-illustration.svg`). |
| `photoAlt` | Updated to describe the developer illustration. |
| `contacts` | **New** array field (see Contact Option above). |

## Schema change summary (`src/content.config.ts`)

- `skills`: from `{ name, icon?, order? }` (flat, `file()` object map) → array of `{ id, name, pages: enum[], skills: { name, icon? }[] }`.
- `profile`: add `contacts: { channel, label, href, icon }[]`.
- `experience`: loader `glob(...)` → `file('src/content/experience.yaml')`; schema drops `order`, adds/keeps `id`; keep `company`, `position`, `photo`, `photoAlt?`, `start`, `end` with existing regex/union validation.

## Relationships

- Home page (`index.astro`) reads: `profile` (Hero + Contact), `skills` (Core Expertise, filtered by `pages` includes `home`), `experience` (reversed array).
- `about`/`cv` page flags are stored on categories but **not** consumed by this feature.
