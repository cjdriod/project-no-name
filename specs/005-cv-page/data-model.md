# Phase 1 Data Model: CV Page

All content lives in Astro Content Collections validated by Zod in `src/content.config.ts`. Changes below are **additive** to existing schemas except `activities`, which is new. Existing fields are unchanged unless noted.

## Entity: Profile (extended)

Source: `src/content/profile.yaml` (single entry `profile`).

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| name | string | yes | Existing (display name). |
| legalName | string | **new, yes** | Full legal name for CV general info. ~13–15 chars typical (single-line target). |
| role | string | yes | Existing. |
| professionalSummary | string | **new, yes** | Paragraph for the Profile section (FR-014). May reuse/rename intent of `description`; keep `description` for other pages. |
| languages | string[] | **new, yes (min 1)** | Rendered pipe-separated (FR-028). |
| contacts | Contact[] | yes | Existing array; drives icon+text contact lines (FR-010/010a). Each contact gains `monoIcon`. |
| ... existing fields (tagline, greeting, description, photo, highlights, cvHref, projectsHref) | — | — | Unchanged. |

> **Phone is NOT stored in profile content.** The "Upon Request" default is implemented directly in the CV page; a number only appears when supplied via the URL `tel` parameter (FR-011).

**Contact** (existing sub-object): `{ channel, label, description, href, icon, monoIcon }`. The CV General information page renders `[monoIcon] text`, where **`monoIcon` is a new field** holding a monochrome simple-icons name (e.g. `simple-icons:linkedin`). The existing multicolor `logos` `icon` is retained for other pages. LinkedIn/GitHub `href` displayed without protocol (FR-012).

**Validation additions**:
- `legalName: z.string().min(1)`
- `professionalSummary: z.string().min(1)`
- `languages: z.array(z.string().min(1)).min(1)`
- Contact sub-object: `monoIcon: z.string().regex(iconName)`
- (No `phone` field added.)

## Entity: Experience entry (extended)

Source: `src/content/experience.yaml`. Rendered reverse-array order (FR-016), timeline layout (FR-015).

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| id, company, position, photo, photoAlt, start, end, summary | — | — | Existing (unchanged). |
| achievements | string[] | **new, optional** | Ordered key-achievement list (FR-017/018). Rendered as `<ol>`. Omitted when empty. |

**Validation addition**: `achievements: z.array(z.string().min(1)).optional()`.

## Entity: Education entry (extended)

Source: `src/content/education.yaml`. Rendered reverse-array order (FR-024).

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| id, photo, photoAlt, school, course, start, end | — | — | Existing (unchanged). |
| achievements | string[] | **new, optional** | Ordered key-achievement list (FR-025). Rendered as `<ol>`. Omitted when empty. |

**Validation addition**: `achievements: z.array(z.string().min(1)).optional()`.

## Entity: Certification / Achievement entry (extended)

Source: `src/content/achievements.yaml`. Rendered reverse-array order (FR-019). Displays title, issuer, date, and keywords (FR-020/020a/022).

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| id, title | — | — | Existing. Title line 1. |
| link | string(url) | optional | Existing. When present → title is a new-tab link + trailing open-in-new icon (FR-021). |
| keywords | string[] | **new, optional** | Keyword set line. Rendered joined/as chips. When absent, keyword line omitted. |
| issuer | string | optional | Existing — **now displayed** on CV (FR-020a). |
| date | string | optional | Existing — **now displayed** on CV (FR-020a). |

**Validation addition**: `keywords: z.array(z.string().min(1)).optional()` (issuer/date already in schema).

## Entity: Recent Activity entry (NEW collection)

Source: `src/content/activities.yaml` (new). Rendered reverse-array order (FR-026). Only title + year (FR-027).

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| id | string | yes | Stable id (consistency with other collections). |
| title | string | yes | Activity title. |
| year | string | yes | 4-digit year (matches existing `year` regex `^\d{4}$`). |

**New collection definition**:
```ts
const activities = defineCollection({
  loader: file('src/content/activities.yaml'),
  schema: z.object({
    id: z.string().min(1),
    title: z.string().min(1),
    year: z.string().regex(/^\d{4}$/),
  }),
});
// add `activities` to `export const collections = { ... }`
```

## Entity: Skill category (unchanged)

Source: `src/content/skills.yaml`. CV renders **all** categories and their skills grouped by category (FR-023). The existing `pages` flag already includes `cv`; the CV page renders all categories regardless (or filters `pages.includes('cv')` — implementation to confirm; spec says "all skills by category"). No schema change.

## Derived / runtime (not stored)

| Item | Derivation | Where |
|------|-----------|-------|
| Displayed phone | URL `tel` param → `fromTelParam` → valid ? `format(digits)` : "Upon Request" (default hardcoded in page, not from YAML) | client island in `CvGeneralInfo` |
| Share URL | canonical `/cv` absolute URL (+ `?tel=` when 9–10 digits) | client island `cv-share.ts` |
| QR SVG | build-time `qrcode.toString(canonicalCvUrl, {type:'svg'})`; hide on error | build/SSG in `cv.astro` |
| Contact display href | strip `https?://` for linkedin/github | build/SSG |

## Ordering summary

| Collection | Order on CV |
|-----------|-------------|
| experience | reversed (last array item first) |
| achievements (certs) | reversed |
| education | reversed |
| activities | reversed |
| skills | source order, grouped by category |
| languages | source order, pipe-separated |
