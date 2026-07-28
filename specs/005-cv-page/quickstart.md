# Quickstart: CV Page Validation

Runnable validation scenarios proving the `/cv` feature works end-to-end. References: [spec.md](./spec.md), [data-model.md](./data-model.md), [contracts/](./contracts/).

## Prerequisites

- Node ≥ 22.12, dependencies installed.
- New dev deps: `@iconify-json/simple-icons` (**installed**), `@types/qrcode` (add during implementation).
- `astro.config.mjs` has `site` (placeholder OK) + `base`, plus the `simple-icons` include.
- Content files updated per [contracts/content-collections.md](./contracts/content-collections.md) (incl. new `src/content/activities.yaml`).

## Setup

```powershell
npm install
npm run astro -- check   # TypeScript + content schema validation
astro dev --background    # per project convention; manage via `astro dev status|logs|stop`
```

## Build & type gates (must pass)

```powershell
npm run astro -- check    # zero TS errors; Zod schemas validate all content
npm run build             # static build succeeds, /cv emitted
```

Expected: build completes; `dist/cv/index.html` exists; no schema errors from the extended/new collections.

## Scenario A — Document renders in order (US1)

1. Open `/cv`.
2. Verify sections appear in order: General information → Profile → Professional experience → Certification → Skills → Education → Recent activities → Language.
3. Verify no animations play and no eyebrow labels appear; every section title except General info has a thick underline.
4. General info left: `legalName` largest, `role` smaller, contacts normal text as `[monoIcon] text` (monochrome simple-icons); LinkedIn/GitHub shown without `http(s)://`. Phone shows "Upon Request" (page default, not from YAML).
5. Experience, Certification, Education, Recent activities render **last array item first**; each certification shows title, issuer, date, keywords.

**Pass**: all true; content matches YAML sources.

## Scenario B — Navigation linkage (US2)

1. Load any page at narrow width (< 768px): CV nav entry hidden; order otherwise Home, About, (Projects at its own breakpoint).
2. Widen to ≥ 768px (`md`): CV entry visible as the third item, followed by Projects.
3. On `/cv`, the CV nav entry shows current-page state.

**Pass**: breakpoint visibility and ordering correct.

## Scenario C — Phone via `tel` query (US1/US4)

1. Open `/cv` (no query): phone shows **"Upon Request"**.
2. Open `/cv?tel=%2B60191234567` (10 local digits): phone shows **`+6019-123 4567`**.
3. Open `/cv?tel=%2B601912` (< 9 local digits): phone falls back to **"Upon Request"**.
4. QR code (inspect): encodes canonical `/cv` URL **without** any `tel`.

**Pass**: rendering matches [contracts/cv-route.md](./contracts/cv-route.md).

## Scenario D — QR visibility + generation failure

1. Screen < ~794px (`md`): QR hidden; left column still complete.
2. Screen ≥ ~794px: QR visible with fixed dimensions (no layout shift).
3. Simulate generation failure (temporarily break the QR URL/build path): image is hidden, page still renders.

**Pass**: breakpoint + graceful-hide behavior correct.

## Scenario E — Print (US3)

1. From `/cv`, trigger print (or `Ctrl/Cmd+P`).
2. In preview: page size A4; entire CV content present across pages without clipping.
3. Nav, top alert, and print/share control are **absent** from print.
4. Output uses **light theme** even if the browser is in dark mode.
5. QR **is** present in print.
6. Select-all in the resulting PDF → all text is selectable/copyable.

**Pass**: matches print contract + .skills/design.md §10.1.

## Scenario F — Share (US4)

1. Activate share → modal opens, input pre-filled `+60`, numeric keypad, button reads **"Skip"**.
2. Type digits → button becomes **"Share"**; cannot exceed 10 local digits; non-digits rejected.
3. Enter 9–10 digits, confirm:
   - Browser with `navigator.share`: native share sheet opens with `{title, text, url}`, `url` includes URL-encoded `tel`.
   - Browser without support (or forced failure): URL copied, a transient **"Copied" toast rises from the bottom** and auto-dismisses, modal closes.
4. Enter < 9 digits, confirm: shared URL has **no** `tel`.
5. Open a shared URL with `tel` on another device: `/cv` shows the shared phone number.

**Pass**: matches [contracts/share-behavior.md](./contracts/share-behavior.md).

## Scenario G — Alert (US1)

1. Top of `/cv` shows "Looking for a simpler view? click here."; **click here** → navigates to `/about`.
2. Dismiss the alert → it disappears.
3. In print preview → alert absent.

**Pass**: alert behavior + print hiding correct.

## Accessibility spot-check

- Keyboard: skip link, alert dismiss, print/share, modal (Esc closes, focus trap/return) all reachable with visible focus; tap targets ≥ 44px.
- One `<h1>`; landmarks present; QR has an accessible name or is `aria-hidden` with visible URL nearby.
- AA contrast in light and dark themes.

## Deploy note

- Replace the placeholder `site` in `astro.config.mjs` with the real personal GitHub Pages URL before production; re-verify the QR encodes the live `/cv` URL.
