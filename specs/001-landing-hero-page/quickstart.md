# Quickstart: Landing Hero Page

A validation/run guide for the home landing page. Implementation details live in
`tasks.md` and the components themselves; this guide proves the feature works end to end.

## Prerequisites

- Node.js ≥ 22.12.0 (see `package.json` engines).
- Dependencies installed, including the Iconify packs used by `astro-icon`. Material Symbols
  is already installed; add a brand pack for the skill icons:

```powershell
npm install
# @iconify-json/material-symbols already installed
npm install -D @iconify-json/simple-icons   # required for skill brand marks
# optional (multicolor marks): npm install -D @iconify-json/logos
```

## Run (development)

Per project convention, use background mode:

```powershell
astro dev --background
# manage with: astro dev status | astro dev logs | astro dev stop
```

Open http://localhost:4321/ .

## Build & verify (primary quality gate)

```powershell
npm run build      # must succeed; Zod content validation runs here
npm run preview    # serve the static output for a final check
```

A successful `npm run build` confirms: TypeScript is clean, all content collection entries
pass their Zod schemas, and all `astro-icon` names resolve from installed packs.

## Validation scenarios

Map to spec user stories / FRs. Check each manually.

### US1 — Hero identity + CTAs (P1)

1. Load `/`. **Expect**: tagline, greeting, name (`<h1>`), role "Full Stack Developer", and a
   short description are visible. (FR-002)
2. **Expect**: exactly two CTAs — "View Projects" and "View CV". (FR-003)
3. Click "View Projects" → navigates to `/projects`.
   Click "View CV" → navigates to `/cv`. (FR-003, clarified)

### US2 — Nav bar + theme toggle (P2)

4. **Expect**: a persistent pill-style bottom navigation bar with Home, About, Projects, Contact me.
   (FR-004)
5. Activate each nav item → navigates to its route (`/`, `/about`, `/projects`, `/contact`).
   Home shows `aria-current="page"` on the landing route. (FR-004, FR-017)
6. Click the theme toggle → appearance switches light↔dark immediately. (FR-006)
7. Reload → chosen theme persists. (FR-007)
8. Clear `localStorage`, set OS to dark, reload → page opens dark with **no flash** of light.
   (FR-008)
8a. Shrink to a very narrow width (~320px) → Projects, then Contact me, hide from the bar
    while Home, About, and the theme toggle stay reachable and the bar does not overflow.
    (FR-018)

### US3 — Experience + skills (P3)

9. Scroll below hero. **Expect**: exactly three experience entries, each showing company
   name, photo, position, and `start — end` as `{short_month}-{year}` (e.g. "Jan-2023 —
   Present") — nothing else. (FR-009)
10. **Expect**: a current role shows "Present" as its end. (FR-010)
11. **Expect**: skills render as icon+text pills in pill shape. (FR-011)

### Cross-cutting

12. Enable OS "reduce motion", reload → all content is immediately visible, no reveal
    animation, everything usable. (FR-012/013)
13. Keyboard-only: Tab reaches all nav links, theme toggle, and both CTAs with a visible
    focus ring; Enter/Space activates them. The first Tab focuses a "Skip to content" link.
    (FR-014, FR-019)
14. Resize from 320px → 1536px+: no horizontal scroll; below `lg` content is full-width with
    gutters; at `lg`+ content is centered within the `--container-wide` (1200px) container; the
    nav bar never obscures the CTAs. (FR-015, SC-006)
15. Toggle both themes and confirm text/background contrast is comfortable (AA) in each. Skill
    brand marks (`simple-icons:*`, tinted via `currentColor`) stay legible in both themes.

## Expected outcomes (success criteria)

- Identity + both CTAs findable within ~10s (SC-001).
- 100% of nav destinations + CTAs keyboard-operable (SC-002).
- Theme switch instant and persisted across reloads (SC-003).
- Exactly three experience entries, all four fields present (SC-004).
- Reduced-motion: 100% content visible, no animation (SC-005).
- Usable 320px–1536px+ with no obscured actions (SC-006).
- No theme flash on first load (SC-007).

## References

- Data shapes: [data-model.md](./data-model.md)
- Content schema: [contracts/content-schema.md](./contracts/content-schema.md)
- Component props/a11y: [contracts/components.md](./contracts/components.md)
- Design tokens & rules: `.skills/design.md`
