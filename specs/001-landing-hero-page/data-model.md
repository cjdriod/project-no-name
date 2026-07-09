# Phase 1 Data Model: Landing Hero Page

Content is modeled as three Astro Content Collections validated by Zod in
`src/content.config.ts`. All rendered content derives from these entries (Constitution V).

## Entity: Profile (single)

Source: `src/content/profile.yaml` (loaded via `file()` loader; single entry).

| Field | Type | Required | Rules / Notes |
|-------|------|----------|---------------|
| `tagline` | string | ✅ | Hero eyebrow. Default: "System design & sustainable solutions". |
| `greeting` | string | ✅ | e.g. "Hi, I'm". |
| `name` | string | ✅ | Display name (may be placeholder until finalized). |
| `role` | string | ✅ | Identity line. Value: "Full Stack Developer" (per clarification). |
| `description` | string | ✅ | Short positioning paragraph (finalized copy in spec FR-002). |
| `photo` | string | ✅ | Path/URL to hero portrait. **Placeholder allowed** (user has no final image). |
| `photoAlt` | string | ✅ | Alt text for the portrait. |
| `projectsHref` | string | ⬜ | Default `/projects`. |
| `cvHref` | string | ⬜ | Default `/cv` (per clarification). |

**Validation**: all required strings non-empty. `photo` may be a placeholder path (e.g.
`/images/portrait-placeholder.svg`) — build must succeed with the placeholder.

## Entity: Experience (collection, ordered)

Source: `src/content/experience/*.md` (loaded via `glob()` loader). Exactly the **top 3**
most-recent roles are rendered (`order` ascending, capped at 3).

| Field | Type | Required | Rules / Notes |
|-------|------|----------|---------------|
| `company` | string | ✅ | Company name. |
| `position` | string | ✅ | Role/title. |
| `photo` | string | ✅ | Company logo/photo path or URL. |
| `photoAlt` | string | ⬜ | Alt text; defaults to `"{company} logo"`. |
| `start` | string | ✅ | Start period as `{short_month}-{year}`, e.g. `Jan-2019`. Pattern: `^[A-Z][a-z]{2}-\d{4}$`. |
| `end` | string | ✅ | End period as `{short_month}-{year}` (e.g. `Dec-2021`) **or** the literal `Present` for a current role. |
| `order` | number | ✅ | Sort key; `1` = most recent/top. |

**Validation**: `start` matches `^[A-Z][a-z]{2}-\d{4}$` (e.g. `Jan-2019`); `end` matches the
same pattern or equals `Present` (FR-010 ongoing indicator). `order` is a positive integer.
Only fields above are displayed — no summary/achievements/tech on this page (FR-009 "only"
constraint).

**Display rule**: render `start — end` (e.g. "Jan-2023 — Present"). Cap the rendered list to
the first 3 entries by `order`.

## Entity: Skill (collection, list)

Source: `src/content/skills.yaml` (loaded via `file()` loader; array of entries).

| Field | Type | Required | Rules / Notes |
|-------|------|----------|---------------|
| `name` | string | ✅ | Pill label, e.g. "AWS". |
| `icon` | string | ⬜ | Iconify id, e.g. `simple-icons:amazonwebservices`, `material-symbols:database`. Optional — omit for a text-only pill (FR-011). |
| `order` | number | ⬜ | Optional display order; otherwise file order. |

**Validation**: `name` non-empty; `icon` optional and, when present, shaped `set:name`. Rendered
as an icon+text pill, or text-only when `icon` is omitted (FR-011). Skills reflect the real stack/domains (spec Key Entities / FR-011):
AWS, Azure, JavaScript/TypeScript, Vue, Angular, Java, plus system design, DevSecOps, CI/CD,
observability, incident management, QA governance.

## Entity: Theme Preference (runtime, not content)

Not a content collection — a client-side value.

| Field | Type | Values | Notes |
|-------|------|--------|-------|
| `theme` | string (localStorage `theme`) | `light` \| `dark` | Persisted choice. |
| resolved | attribute `data-theme` on `<html>` | `light` \| `dark` | `stored ?? prefers-color-scheme ?? light`. |

**Rules**: set before first paint (no flash, FR-008); toggled by the ThemeToggle island;
persisted to `localStorage` (FR-007).

## Navigation model (bottom nav bar)

Static list rendered by `NavBar.astro`. Destinations are **real cross-page routes** (owner
clarification 2026-07-08).

| Label | Route | Icon | In scope? |
|-------|-------|------|-----------|
| Home | `/` | `material-symbols:home-outline-rounded` | ✅ this feature |
| About | `/about` | `material-symbols:person-outline-rounded` | route out of scope |
| Projects | `/projects` (assumed) | `material-symbols:folder-outline-rounded` | route out of scope |
| Contact me | `/contact` | `material-symbols:mail-outline-rounded` | route out of scope |
| (Theme toggle) | — (button) | sun/moon | ✅ this feature |

`aria-current="page"` is applied to Home on the landing route. This feature only guarantees the
links point to the routes above; building `/about`, `/projects`, `/contact`, `/cv` is out of
scope.

## Relationships

- `Profile` 1 — rendered by `Hero`.
- `Experience` * (top 3 by `order`) — rendered by `ExperienceSection` → `ExperienceCard`.
- `Skill` * — rendered by `SkillsSection` → `SkillPill`.
- `Theme Preference` — cross-cutting; governs token swap for the whole page.
- `Navigation` — static; rendered by `NavBar`, independent of content collections.
