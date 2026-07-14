# Content Schema Contract: Landing Hero Page

Authoritative shapes for `src/content.config.ts`. Build MUST fail if any entry violates these
schemas (Constitution V). Types below are expressed as Zod intent, not final code.

## `profile` collection (file loader → single YAML)

```text
profile: {
  tagline:      string (min 1)
  greeting:     string (min 1)
  name:         string (min 1)
  role:         string (min 1)            // "Full Stack Developer"
  description:  string (min 1)
  photo:        string (min 1)            // placeholder path allowed
  photoAlt:     string (min 1)
  projectsHref: string  default "/projects"
  cvHref:       string  default "/cv"
}
```

## `experience` collection (glob loader → src/content/experience/*.md)

```text
experience[]: {
  company:   string (min 1)
  position:  string (min 1)
  photo:     string (min 1)
  photoAlt:  string optional              // default `${company} logo`
  start:     string matching /^[A-Z][a-z]{2}-\d{4}$/     // e.g. Jan-2019
  end:       string matching /^[A-Z][a-z]{2}-\d{4}$/  OR  literal "Present"
  order:     number int positive
}
```

Consumer rule: sort by `order` asc, render first 3 only.

## `skills` collection (file loader → src/content/skills.yaml)

```text
skills[]: {
  name:  string (min 1)
  icon:  string matching /^[a-z0-9-]+:[a-z0-9-]+$/  optional   // iconify "set:name"; omit for text-only pill
  order: number optional
}
```

## Sample content (for authoring)

`src/content/profile.yaml`
```yaml
tagline: System design & sustainable solutions
greeting: Hi, I'm
name: Alex Carter
role: Full Stack Developer
description: >-
  I design and build secure, scalable cloud-native platforms on AWS and Azure,
  and lead engineering teams to ship high-traffic systems across e-commerce and
  agriculture. My focus is DevSecOps, reliable services, and mentoring the
  engineers around me — building software that keeps delivering long after launch.
photo: /images/portrait-placeholder.svg
photoAlt: Portrait placeholder
projectsHref: /projects
cvHref: /cv
```

`src/content/experience/company-a.md`
```md
---
company: Aurora Systems
position: Technical Lead
photo: /images/logos/aurora.svg
start: "Jan-2023"
end: Present
order: 1
---
```

`src/content/skills.yaml`
```yaml
- { name: JavaScript, icon: simple-icons:javascript }
- { name: TypeScript, icon: simple-icons:typescript }
- { name: Vue, icon: simple-icons:vuedotjs }
- { name: Angular, icon: simple-icons:angular }
- { name: Java, icon: simple-icons:openjdk }
- { name: AWS, icon: simple-icons:amazonwebservices }
- { name: Azure, icon: simple-icons:microsoftazure }
```

## Validation acceptance

- Missing any required field → build error (not a broken runtime page).
- `end` other than `{short_month}-{year}` (e.g. `Dec-2021`) or `Present` → build error.
- `icon`, when present, not shaped `set:name` → build error (a skill MAY omit `icon` for a
  text-only pill, per FR-011).
- Placeholder `photo` value → build succeeds (image is intentionally provisional).
