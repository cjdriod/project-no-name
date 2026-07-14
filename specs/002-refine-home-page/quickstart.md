# Quickstart: Validating Refine Home Page & Navigation

This guide verifies the feature end-to-end against the spec's acceptance scenarios and success criteria. It is a run/validation guide — implementation details live in `data-model.md`, `contracts/`, and (once generated) `tasks.md`.

## Prerequisites

- Node ≥ 22.12 and repository dependencies installed:
  ```powershell
  npm install
  ```
- Content authored per `contracts/content-schemas.md`:
  - `src/content/skills.yaml` restructured into categories with `pages` flags.
  - `src/content/profile.yaml` has a `contacts` list and points `photo` at the new developer illustration SVG.
  - `src/content/experience.yaml` created (array); `src/content/experience/*.md` removed.
  - New icon ids registered in `astro.config.mjs`.

## Build & type validation (Constitution gates 1–2)

```powershell
npm run build
```

Expected:
- Build succeeds with no TypeScript/Astro errors.
- Zod validation passes for `skills`, `profile` (incl. `contacts`), and `experience`.
- Negative check: temporarily set a category `pages: []` or an invalid `channel` → build FAILS (proves the contract). Revert after.

## Preview the site

```powershell
npm run preview
```

Open the served URL and load the home page.

## Acceptance validation

### US1 — Core Expertise (P1)
1. Scroll past the Hero → **Core Expertise** is the next section. *(FR-003, FR-005)*
2. Each category flagged `home` is shown with **at most 3 pills** (first 3 by array order). *(FR-006b, SC-007)*
3. A skill authored without an `icon` renders as a **name-only pill** (no broken icon). *(FR-006c)*
4. A category NOT flagged `home` does **not** appear. *(data-model selection rule)*

### US2 — Get in Touch (P1)
1. At the page bottom, the **Contact** section shows exactly three options (email, LinkedIn, GitHub), each with **icon + text**. *(FR-007, FR-008)*
2. Activating each opens in a **new tab** (LinkedIn/GitHub URLs; email opens mail handler); links carry `rel="noopener noreferrer"`. *(FR-009)*

### US3 — Simplified navigation (P2)
1. Bottom nav shows **no Contact tab** on the home page (and any page). *(FR-001, SC-004)*
2. Remaining tabs (Home, About, Projects) still navigate correctly. *(FR-002)*
3. No dead markup/CSS references the removed tab. *(FR-011)*

### US4 — Experience newest-first (P2)
1. Experience entries render **newest at top** (reverse of `experience.yaml` array order). *(FR-012)*
2. Append a new entry as the **last** array element, rebuild → it appears **at the top**, no `order` field used. *(SC-006)*

### US5 — Hero illustration (P3)
1. Hero shows the **developer illustration** (happy developer at laptop, blurred code/diagram background, 3D feel) instead of the portrait placeholder. *(FR-013)*
2. The illustration exposes **descriptive alt text**; no layout shift (explicit dimensions). *(FR-013, Principle II)*

## Non-functional checks (Constitution gates 3–6)

- **Accessibility**: keyboard-tab through Core Expertise, Contact links, and nav; visible focus; contact links have accessible names; run through both light/dark themes; AA contrast. Contact/nav tap targets ≥ 44px.
- **Responsive**: verify from smallest viewport up through desktop; pills wrap; sections reflow; nav remains usable at narrow widths.
- **Performance**: Lighthouse on the home page meets budgets (Perf ≥ 95, A11y 100, SEO 100, LCP < 1.5s, CLS < 0.05).
- **Motion**: with `prefers-reduced-motion` enabled, `data-reveal` animations degrade gracefully.

## Success criteria mapping

| Criterion | Verified by |
|-----------|-------------|
| SC-001 (section order, no Skills) | US1 steps 1–2; visual order Hero→Core Expertise→Experience→Contact |
| SC-002 (identify categories/pills < 15s) | US1 review |
| SC-003 (contact < 10s, new tab) | US2 |
| SC-004 (no Contact tab) | US3 |
| SC-005 (renders across viewports) | Responsive checks |
| SC-006 (append → top) | US4 step 2 |
| SC-007 (≤ 3 pills, name-only fallback) | US1 steps 2–3 |

## Done when

- `npm run build` passes (types + Zod content validation).
- All acceptance steps above pass in preview.
- Lighthouse budgets met; a11y and responsive checks pass in both themes.
