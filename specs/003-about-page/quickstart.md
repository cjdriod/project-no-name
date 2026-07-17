# Quickstart & Validation: About Page

This guide proves the `/about` feature works end-to-end. It references the content contracts in
[contracts/content-schemas.md](./contracts/content-schemas.md) and the entities in
[data-model.md](./data-model.md) rather than duplicating them.

## Prerequisites

- Node + project dependencies installed (`npm install`).
- Existing content present: `profile.yaml`, `skills.yaml` (with categories flagged `about`),
  `experience.yaml`.

## Build & type validation (primary gate)

```powershell
npm run build
```

Expected: build succeeds with no TypeScript or Zod errors. Zod validates the extended `profile`
(`highlights`), extended `experience` (`summary`), and the new `education` and `achievements`
collections. Malformed content must fail here (see the negative check below).

## Dev preview

```powershell
npx astro dev --background
# then open http://localhost:4321/about
```

## Validation scenarios (map to spec acceptance criteria)

1. **Section order (FR-002)** — On `/about`, confirm the blocks appear in order: Professional
   Summary & Highlights → Skills (by category) → Work Experience → Achievements → Education → CTA.
2. **Summary & highlights (FR-003)** — The summary narrative shows, followed by a point-form
   highlights list sourced from `profile.highlights`.
3. **Skills by category (FR-004)** — Only categories whose `pages` include `about` render, each
   showing all its skills as pills.
4. **Work Experience — LinkedIn style (FR-005)** — Entries render as a hairline-separated list
   with a company logo on the left and employer, position, period (`{month} {year}`, ongoing →
   "Present"), and summary on the right; most recent first; no timeline spine is present.
5. **Achievements (FR-006)** — Each item shows its name; items with a `link` show an "open in new
   tab" affordance and open a new tab; latest item appears first.
6. **Education (FR-007)** — Each entry shows an institution image, school, course, and year range,
   in the same format as experience; latest first.
7. **Empty optional section (FR-011)** — Temporarily empty `achievements.yaml` (or `education.yaml`)
   and confirm the corresponding section is omitted entirely (no empty heading). Restore after.
8. **CTA (FR-014)** — Below Education, a "Looking for more details?" prompt with a
   "View my complete Curriculum Vitae (CV) →" link navigates to `/cv`.
9. **Navigation (FR-008/009)** — From the home page, the bottom-nav "About" item opens `/about`
   and is marked current there.
10. **Accessibility (FR-010)** — Tab through the page: the CTA and any achievement links are
    keyboard-focusable with visible focus; images have alt text; there is a single `<h1>`.
11. **Responsive & motion** — At the smallest supported width there is no horizontal scroll;
    entrance motion respects `prefers-reduced-motion` (reduced → no animation).

## Negative check (type-safe content contract)

Introduce a deliberate error (e.g., remove `summary` from one experience entry, or `school` from an
education entry) and run `npm run build`. Expected: the build fails with a Zod error naming the
collection/field. Revert the change afterward.

## Done criteria

- `npm run build` passes with the new content and page.
- All validation scenarios above hold.
- Lighthouse (manual): Performance ≥ 95, Accessibility 100, LCP < 1.5s, CLS < 0.05 on `/about`.
