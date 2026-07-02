<!--
Sync Impact Report
==================
Version change: (template) → 1.0.0
Rationale: Initial ratification of the project constitution (MAJOR baseline).

Modified principles: N/A (initial creation from template)
Added sections:
  - Core Principles (5 principles):
      I. Content-First Reading Experience
      II. Performance & Accessibility as Baseline
      III. Mobile-First Responsive Design
      IV. Minimal, Purposeful Interactivity
      V. Type-Safe Content Model
  - Technology Constraints
  - Development Workflow & Quality Gates
  - Governance
Removed sections: N/A

Templates requiring updates:
  ✅ .specify/templates/plan-template.md — reviewed; generic "Constitution Check"
     gate references this file, no principle-specific edits required.
  ✅ .specify/templates/spec-template.md — reviewed; no constitution/testing
     coupling, no changes required.
  ✅ .specify/templates/tasks-template.md — reviewed; no constitution/testing
     coupling, no changes required.
  ✅ design.md — aligned; constitution references it as the design source of truth.

Follow-up TODOs: None. Ratification date set to initial adoption date (today).
-->

# Personal Portfolio Constitution

## Core Principles

### I. Content-First Reading Experience

The site is a reading instrument, not a visual showcase. Content MUST be legible and
complete before any decoration is added. Every page MUST honor the reading rules in
`design.md`: prose capped to its measure (`~65ch` / `--container-prose`), a single-column
reading flow for long-form content, and generous whitespace as the primary layout tool.
Text MUST NOT be baked into images, and no element may animate while a reader is
mid-paragraph.

Rationale: Recruiters and technical reviewers judge the portfolio on how comfortable it
is to read for 5–10 minutes; calm, content-first pages are the entire value proposition.

### II. Performance & Accessibility as Baseline

Performance and accessibility are entry requirements, not later fixes. Reading pages MUST
ship effectively zero client JavaScript (interactivity lives in islands only). WCAG 2.1 AA
is the minimum accessibility bar: semantic HTML landmarks, one `<h1>` per page, visible
focus states, skip links, descriptive `alt` text, and AA color contrast in both themes.
Layout stability MUST be preserved (explicit media dimensions, no CLS). Lighthouse budgets
from `design.md` (Performance ≥ 95, Accessibility 100, SEO 100, LCP < 1.5s, CLS < 0.05)
MUST be met before a page is considered done.

Rationale: A fast, accessible site is both an ethical baseline and a direct signal of
engineering quality to the audience being courted.

### III. Mobile-First Responsive Design

Layout MUST be authored mobile-first: base styles target small viewports, and larger
layouts are added progressively via min-width breakpoints. Mobile and tablet SHARE a
single layout tier below the `lg` (1024px) breakpoint per `design.md`; distinct
multi-column layouts appear only at desktop and above. Wider screens add margin, never
line length. Tap targets MUST be ≥ 44px.

Rationale: The primary audience frequently opens links on phones; designing up from the
smallest viewport guarantees the constrained case is always first-class.

### IV. Minimal, Purposeful Interactivity

Motion and interactivity MUST confirm intent, never entertain. Animation is limited to the
subtle fades and lifts described in `design.md`, implemented with Motion One, and MUST
respect `prefers-reduced-motion`. Explicitly avoided: parallax, scroll-jacking, autoplaying
media, gradient/glassmorphism effects, and hero animation gimmicks. JavaScript is added
only where an interaction genuinely requires it (theme switch, project filter, contact
form, mobile menu) and MUST be scoped to hydrated islands.

Rationale: Restraint keeps the site fast, calm, and trustworthy; every interactive byte
must earn its cost.

### V. Type-Safe Content Model

All portfolio content (hero, projects, résumé, CV, contact metadata) MUST live in Astro
Content Collections as Markdown + YAML, validated by Zod schemas. Content MUST NOT be
hardcoded into components where a collection entry is appropriate. Build-time validation is
the contract: missing or malformed fields MUST fail the build rather than degrade silently
at runtime.

Rationale: Type-safe, build-validated content keeps the site maintainable and prevents
broken or half-populated pages from shipping.

## Technology Constraints

The stack is fixed and MUST be used as the default for all work:

- **Framework**: Astro (static-first, island architecture).
- **Language**: TypeScript as the primary language for components, config, and content
  schemas.
- **Styling**: Tailwind CSS, mapped to the design tokens defined in `design.md`.
- **Icons**: Iconify for all iconography.
- **Animation**: Motion One for all motion (subject to Principle IV).
- **Content**: Astro Content Collections (Markdown + YAML) with Zod validation.
- **Deployment**: GitHub Pages via the repository's CI workflow. Builds MUST produce a
  static output deployable to GitHub Pages, including correct base-path handling.

Site scope is fixed to these pages: landing/hero, résumé, CV, projects (index + details),
and contact. `design.md` is the authoritative source for visual and interaction design;
where this constitution and `design.md` disagree, this constitution governs and `design.md`
MUST be reconciled.

Testing policy: automated unit tests are NOT required for this project. Quality is enforced
through type checking, successful production builds, Lighthouse budgets, and manual review
(see Quality Gates). Contributors MAY add tests, but their absence MUST NOT block delivery.

## Development Workflow & Quality Gates

Before any page or feature is considered complete, it MUST pass these gates:

1. **Build & types**: `astro build` succeeds and TypeScript reports no errors.
2. **Content validation**: all Content Collection entries pass their Zod schemas at build
   time.
3. **Accessibility**: keyboard navigation, focus visibility, semantic structure, and AA
   contrast verified in both light and dark themes.
4. **Responsive**: layout verified mobile-first from the smallest supported viewport up
   through desktop and ultra-wide, respecting the shared mobile/tablet tier.
5. **Performance**: Lighthouse budgets from `design.md` met on reading pages.
6. **Motion**: all animation degrades correctly under `prefers-reduced-motion`.
7. **Print/CV export**: `/resume` and `/cv` produce ATS-friendly, selectable-text output
   per `design.md` §10.1.

Development uses the Astro dev server in background mode (`astro dev --background`).

## Governance

This constitution supersedes ad-hoc practices and other project conventions. When guidance
conflicts, this document governs and dependent artifacts (`design.md`, spec-kit templates)
MUST be reconciled to it.

Amendments MUST be proposed as a documented change describing the motivation and impact,
and MUST update the version and dates below. Versioning follows semantic versioning:

- **MAJOR**: backward-incompatible governance changes or removal/redefinition of a
  principle.
- **MINOR**: a new principle or section, or materially expanded guidance.
- **PATCH**: clarifications, wording, or non-semantic refinements.

Compliance is reviewed at each feature's planning stage via the plan template's
"Constitution Check" gate and again before merge. Any deviation MUST be justified in the
plan's Complexity Tracking section or corrected before delivery.

**Version**: 1.0.0 | **Ratified**: 2026-07-02 | **Last Amended**: 2026-07-02
