# Phase 1 Data Model: Projects Page

## Collection: `projects`

- **Source**: `src/content/projects.yaml` (single top-level YAML array)
- **Loader**: Astro `file('src/content/projects.yaml')`
- **Ordering (authoring)**: oldest at the lowest index → latest at the highest index
- **Ordering (render)**: reversed (`.toReversed()`) so the latest project appears first
- **Validation**: Zod schema in `src/content.config.ts`; malformed/missing required fields fail the build

### Entity: Project

| Field | Type | Required | Rules / Notes |
| --- | --- | --- | --- |
| `id` | string | Yes | Non-empty; stable unique key (e.g. `001-task-forge`). Used as the collection entry id and React/Astro list key. |
| `title` | string | Yes | Non-empty; project display name. |
| `description` | string | Yes | Non-empty; one short sentence (scannable, ~1–2 lines). |
| `image` | string | Yes | Path to cover image under `public/` (e.g. `/images/projects/task-forge.png`). May resolve to a broken/missing file at runtime → placeholder fallback applies. |
| `imageAlt` | string | Yes | Non-empty; descriptive alt text for the cover image (accessibility). |
| `technologies` | array | Yes | `min(1)`. Each item is a plain-text label string (`min 1`). Rendered as plain-text pill tags — **no** technology icons. |
| `sourceHref` | string (url) | Yes | Absolute URL to the source-code repository. Opens in a new tab. |
| `siteHref` | string (url) | No | Absolute URL to the live website. When present, a website link is shown; when absent, no website link renders. |

### Zod schema (to add in `content.config.ts`)

```ts
const projects = defineCollection({
  loader: file('src/content/projects.yaml'),
  schema: z.object({
    id: z.string().min(1),
    title: z.string().min(1),
    description: z.string().min(1),
    image: z.string().min(1),
    imageAlt: z.string().min(1),
    technologies: z.array(z.string().min(1)).min(1),
    sourceHref: z.string().url(),
    siteHref: z.string().url().optional(),
  }),
});
// register in: export const collections = { ..., projects };
```

> `iconName` (`/^[a-z0-9-]+:[a-z0-9-]+$/`) already exists in `content.config.ts` but is **not** needed for `projects` — technologies are plain text.

## Derived / referenced data (no new schema)

### GitHub "View more" target

- Source: existing `profile.contacts[]` entry where `channel === 'github'`; use its `href`.
- Behaviour: if no GitHub contact is found, the "View more" action is not rendered.
- No change to the `profile` schema.

## Validation & edge-case mapping

| Rule | Enforced by | Spec ref |
| --- | --- | --- |
| At least one technology per project | Zod `.min(1)` | FR-003 |
| Source link always present & valid URL | Zod `z.string().url()` (required) | FR-004 |
| Website link optional; omitted → no link | `siteHref` optional + conditional render | FR-005 |
| Missing/broken/oversized image → placeholder SVG | Fixed-ratio wrapper + inline `onerror` swap | FR-016 |
| Latest project shown first | `.toReversed()` at render | Plan input |
| Grows without redesign | Array-driven grid, no fixed count | FR-010 |
