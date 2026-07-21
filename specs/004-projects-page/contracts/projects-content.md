# Content Contract: `projects` Collection

This is the authoring contract for the `projects` Content Collection. It is the "interface" the Projects page exposes to content authors. Entries that violate this contract MUST fail the build (Zod validation), never degrade silently.

## File

- Path: `src/content/projects.yaml`
- Shape: a single top-level YAML **array** of project objects
- Order: **oldest first** (lowest index) → **latest last** (highest index). The page renders reversed.

## Entry fields

| Field | Type | Required | Constraint |
| --- | --- | --- | --- |
| `id` | string | yes | non-empty, unique |
| `title` | string | yes | non-empty |
| `description` | string | yes | non-empty, one short sentence |
| `image` | string | yes | non-empty path under `public/` |
| `imageAlt` | string | yes | non-empty |
| `technologies` | list | yes | ≥ 1 item; each item a plain-text string label (no icons) |
| `sourceHref` | string | yes | valid absolute URL |
| `siteHref` | string | no | valid absolute URL when present |

`icon` fields are not used for technologies — technologies are plain text.

## Valid fixture (illustrative, 2 of 5)

```yaml
- id: 001-task-forge
  title: Task Forge
  description: A collaborative task board with real-time updates and role-based access.
  image: /images/projects/task-forge.png
  imageAlt: Task Forge kanban board interface with columns of task cards
  technologies:
    - TypeScript
    - React
    - Node.js
  sourceHref: https://github.com/alex-carter-dev/task-forge
  siteHref: https://task-forge.example.com

- id: 002-harvest-insights
  title: Harvest Insights
  description: An agriculture analytics dashboard turning sensor data into yield forecasts.
  image: /images/projects/harvest-insights.png
  imageAlt: Harvest Insights dashboard showing charts of crop yield metrics
  technologies:
    - Vue
    - AWS
  sourceHref: https://github.com/alex-carter-dev/harvest-insights
  # no siteHref — website link is omitted for this project
```

## Rendering contract (page behaviour)

Given a valid `projects.yaml`, the `/projects` page MUST:

1. Render the array **reversed** — highest-index (latest) project first.
2. Render one card per entry with image, title, description, and plain-text technology labels.
3. Group the card's links (source code, and website when present) as a **card action group anchored at the bottom of the card**.
4. Show a source-code link (new tab, external icon) on every card.
5. Show a website link only when `siteHref` is present (new tab, external icon).
6. Substitute `public/images/project-placeholder.svg` whenever an entry's image is missing, fails to load, is a broken link, or is oversized — with no layout shift.
7. Render a "View more" action linking to the GitHub URL from `profile.contacts` (new tab, external icon), or omit it if no GitHub contact exists.

## Negative cases (MUST fail the build)

- Missing any required field (`id`, `title`, `description`, `image`, `imageAlt`, `technologies`, `sourceHref`).
- `technologies` empty.
- `sourceHref` or `siteHref` not a valid URL.
