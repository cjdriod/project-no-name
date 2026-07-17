# Content Contracts: About Page

For a static content-first site, the "interface" exposed to the outside is the **content shape**
that authors must satisfy. These contracts are enforced at build time by Zod schemas in
`src/content.config.ts`; a violation fails `astro build` rather than degrading at runtime
(Constitution Principle V). Shared patterns: `iconName = ^[a-z0-9-]+:[a-z0-9-]+$`,
`period = ^[A-Z][a-z]{2}-\d{4}$` (month-year), `year = ^\d{4}$`.

## Contract: `profile.yaml` (extended)

```yaml
profile:
  # ...existing fields (tagline, greeting, name, role, description, photo, photoAlt,
  #    projectsHref, cvHref, contacts[]) unchanged...
  highlights:            # REQUIRED, non-empty array of non-empty strings (point form)
    - "10+ years building cloud-native platforms on AWS and Azure"
    - "Led engineering teams shipping high-traffic e-commerce systems"
    - "DevSecOps and reliability advocate"
```

- `highlights`: `array(string.min(1)).min(1)`. Rendered as a bulleted list beneath the summary
  narrative (which reuses `description`).

## Contract: `experience.yaml` (extended)

Each array item adds a required `summary`:

```yaml
- id: 003-aurora-systems           # REQUIRED unique, sequence-prefixed, kebab-case
  company: Aurora Systems           # REQUIRED
  position: Platform Engineering Lead
  photo: /images/logos/company-a.svg
  photoAlt: Aurora Systems logo     # optional
  start: Jan-2023                   # REQUIRED, month-year pattern
  end: Present                      # REQUIRED, month-year pattern OR "Present"
  summary: >-                       # REQUIRED (NEW), non-empty short role summary
    Led platform engineering across reliability, CI/CD, and developer experience.
```

- `summary`: `string.min(1)`. Displayed only on `/about`; the home card ignores it.

## Contract: `education.yaml` (new)

Ordered array; newest appended last (displayed reversed → latest first).

```yaml
- id: 001-metro-college            # REQUIRED unique, sequence-prefixed, kebab-case
  photo: /images/education/metro-college.svg   # REQUIRED image/logo path
  photoAlt: Metro College logo     # optional (defaults to "{school} logo")
  school: Metro College            # REQUIRED institution name
  course: Diploma in Software Engineering       # REQUIRED qualification/field
  start: "2011"                    # REQUIRED, 4-digit year
  end: "2013"                      # REQUIRED, 4-digit year OR "Present"
- id: 002-state-university
  photo: /images/education/state-university.svg
  school: State University
  course: BSc Computer Science
  start: "2013"
  end: "2016"
```

- Same visual format as experience entries (image left; school, course, period right).
- Empty/absent collection → the Education section is omitted (FR-011).

## Contract: `achievements.yaml` (new)

Ordered array; newest appended last (displayed reversed → latest first).

```yaml
- id: 001-aws-hackathon           # REQUIRED unique, sequence-prefixed, kebab-case
  title: AWS Regional Hackathon Winner          # REQUIRED — the displayed name
- id: 002-speaker-devcon
  title: Featured Speaker, DevCon 2024
  issuer: DevCon                    # optional
  date: "2024"                     # optional
  link: https://example.com/devcon  # optional; when present → opens in new tab with affordance
```

- `title` is the only required/displayed field. `issuer`, `date`, `link` are optional and render
  only when present.
- When `link` is present the item MUST render an "open in new tab" affordance
  (`material-symbols:open-in-new-rounded`) and open via `target="_blank" rel="noopener noreferrer"`.
- Empty/absent collection → the Achievements section is omitted (FR-011).

## Contract: page composition (`/about`)

The page MUST render these blocks in this fixed order, then the CTA:

1. Professional Summary & Highlights (`profile.description` + `profile.highlights`)
2. Skills by category (`skills` where `pages` includes `about`; all skills per category)
3. Work Experience (`experience`, reversed; LinkedIn-style hairline list, logo left, + summary)
4. Achievements (`achievements`, reversed; name-first) — omitted if empty
5. Education (`education`, reversed; experience-style format) — omitted if empty
6. CTA: "Looking for more details?" + link "View my complete Curriculum Vitae (CV) →" → `/cv`

## Failure behavior (all contracts)

- Missing required field, wrong type, or pattern mismatch → **build fails** with a Zod error
  naming the collection, entry, and field.
- Icon ids referenced by components must be registered in the `astro-icon` allowlist in
  `astro.config.mjs`, or the build fails.
