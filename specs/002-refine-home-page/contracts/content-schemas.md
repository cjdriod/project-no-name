# Content Schema Contracts

This project is a static Astro site; its "interfaces" are the **content collection schemas** (Zod) that author-facing YAML must satisfy, plus the **icon allowlist** contract. These schemas are the build-time contract: violations fail `astro build`.

## Contract 1: `skills` collection (`src/content/skills.yaml`)

```ts
// src/content.config.ts
const pageFlag = z.enum(['home', 'about', 'cv']);
const iconName = /^[a-z0-9-]+:[a-z0-9-]+$/;

const skillCategory = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  pages: z.array(pageFlag).min(1),
  skills: z.array(z.object({
    name: z.string().min(1),
    icon: z.string().regex(iconName).optional(),
  })).min(1),
});

const skills = defineCollection({
  loader: file('src/content/skills.yaml'),
  schema: skillCategory,
});
```

Authoring shape (YAML array; each item is one category entry):

```yaml
- id: backend-development
  name: Backend Development
  pages: [home, cv]
  skills:
    - { name: Java, icon: simple-icons:openjdk }
    - { name: Spring Boot, icon: simple-icons:spring }
    - { name: Node.js, icon: simple-icons:nodedotjs }
- id: microservices-apis
  name: Microservices & APIs
  pages: [home]
  skills:
    - { name: RESTful services }        # no icon -> name-only pill
    - { name: Event-driven systems }
```

**Consumer rule (home page)**: keep categories where `pages` includes `home`; per category render `skills.slice(0, 3)`.

## Contract 2: `profile.contacts` (`src/content/profile.yaml`)

```ts
const contactChannel = z.enum(['email', 'linkedin', 'github']);

const profile = defineCollection({
  loader: file('src/content/profile.yaml'),
  schema: z.object({
    // ...existing fields unchanged...
    contacts: z.array(z.object({
      channel: contactChannel,
      label: z.string().min(1),
      href: z.string().min(1),
      icon: z.string().regex(iconName),
    })).min(1),
  }),
});
```

Authoring shape:

```yaml
contacts:
  - { channel: email,    label: Email,    href: "mailto:alex@example.com",           icon: material-symbols:mail-outline-rounded }
  - { channel: linkedin, label: LinkedIn, href: "https://www.linkedin.com/in/alex",   icon: simple-icons:linkedin }
  - { channel: github,   label: GitHub,   href: "https://github.com/alex",            icon: simple-icons:github }
```

**Rendering contract**: each item → `<a href={href} target="_blank" rel="noopener noreferrer" aria-label={label}>` with icon + label; ≥ 44px tap target.

## Contract 3: `experience` collection (`src/content/experience.yaml`)

```ts
const period = /^[A-Z][a-z]{2}-\d{4}$/;

const experienceEntry = z.object({
  id: z.string().min(1),
  company: z.string().min(1),
  position: z.string().min(1),
  photo: z.string().min(1),
  photoAlt: z.string().optional(),
  start: z.string().regex(period),
  end: z.union([z.string().regex(period), z.literal('Present')]),
});

const experience = defineCollection({
  loader: file('src/content/experience.yaml'),
  schema: experienceEntry,
});
```

Authoring shape (append newest at the **end**):

```yaml
- id: 001-company-c
  company: Company C
  position: Backend Engineer
  photo: /images/logos/company-c.svg
  start: Jan-2019
  end: Dec-2021
- id: 003-aurora-systems      # newest — appended last
  company: Aurora Systems
  position: Platform Engineering Lead
  photo: /images/logos/company-a.svg
  start: Jan-2023
  end: Present
```

**Consumer rule**: use sequence-prefixed ids to mirror array append order, then reverse for display (latest-appended first). No separate `order` field.

## Contract 4: Icon allowlist (`astro.config.mjs`)

Every `icon` id referenced by skills/contacts MUST be present in the `astro-icon` `include` map, or the build fails. New ids introduced by this feature (superset — trim to what the authored content actually references):

- `simple-icons`: `nodedotjs`, `spring`, `react`, `docker`, `githubactions`, `github`, `linkedin` (+ existing: `openjdk`, `amazonwebservices`, `microsoftazure`, `vuedotjs`, ...).
- `material-symbols`: `mail-outline-rounded` (already present).

**Contract**: unmatched-icon skills must OMIT the `icon` field (name-only pill) rather than reference an unregistered icon.

## Validation contract

- `astro build` (or `astro check`) MUST pass with the above schemas.
- Any YAML entry missing a required field, using an invalid enum value, or referencing a malformed icon id MUST fail the build (no silent runtime degradation).
