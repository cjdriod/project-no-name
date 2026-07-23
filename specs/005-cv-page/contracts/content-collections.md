# Contract: Content Collections (extended / new)

Defined in `src/content.config.ts` using `astro:content` + Zod. Changes are additive; existing pages must continue to build.

## profile (extend existing schema)

Add to the `profile` object schema:

```ts
legalName: z.string().min(1),
professionalSummary: z.string().min(1),
languages: z.array(z.string().min(1)).min(1),
```

Add to the **contact** sub-object schema:

```ts
monoIcon: z.string().regex(iconName),   // monochrome simple-icons name for General info page
```

`profile.yaml` gains matching keys; each contact gains `monoIcon`. `description` is retained (used elsewhere). **Phone is intentionally NOT added** to the profile schema/YAML — the CV page hardcodes the "Upon Request" default and only renders a number from the URL `tel` parameter.

## experience (extend)

Add to the `experience` schema:

```ts
achievements: z.array(z.string().min(1)).optional(),
```

## education (extend)

Add to the `education` schema:

```ts
achievements: z.array(z.string().min(1)).optional(),
```

## achievements (extend)

Add to the `achievements` schema:

```ts
keywords: z.array(z.string().min(1)).optional(),
```

`issuer` and `date` already exist in the schema and are **now displayed** on the CV (title, issuer, date, keywords).

## activities (NEW collection)

```ts
const activities = defineCollection({
  loader: file('src/content/activities.yaml'),
  schema: z.object({
    id: z.string().min(1),
    title: z.string().min(1),
    year: z.string().regex(/^\d{4}$/),
  }),
});

export const collections = { profile, experience, skills, education, achievements, projects, activities };
```

New file `src/content/activities.yaml`:

```yaml
- id: 001-example
  title: Example activity
  year: "2025"
```

## Build-time validation guarantee

- Missing/malformed new fields fail `astro build` (Principle V).
- Optional fields (`achievements`, `keywords`, `phone`) may be omitted; the CV renders their absence gracefully (omit list/section, or "Upon Request").

## Config (astro.config.mjs)

- Add `site` (GitHub Pages URL — placeholder until provided) and `base` (`'/'` for a user page).
- Extend `astro-icon` `include` with a `simple-icons` entry listing the contact-channel slugs used by the CV.
