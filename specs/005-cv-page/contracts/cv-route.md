# Contract: `/cv` Route

## Route

- **Path**: `/cv` (served under GitHub Pages `base`; effective URL = `site + base + cv`).
- **Method**: static GET (SSG). No server runtime.
- **Rendering**: fully static HTML + inline QR SVG. Islands hydrate for alert dismiss, print trigger, and share modal only.

## Query parameters

| Param | Type | Values | Effect |
|-------|------|--------|--------|
| `tel` | string (URL-encoded) | `+60` + 9–10 local digits, e.g. `%2B60191234567` | When present and valid → General-info phone renders the formatted value (`+6019-123 4567`). When absent/invalid (local digits < 9 or > 10, or unparseable) → phone renders "Upon Request". |

- The `tel` value is **never** encoded into the QR code (QR = canonical `/cv` only).
- Query handling is read at render for the recipient's view. Because the phone default is not stored in content, the page renders "Upon Request" and the island resolves the phone from `location.search` on load, upgrading it when a valid `tel` is present.

## Page structure contract (order is fixed)

1. Dismissable alert — "Looking for a simpler view? click here." → `click here` links to `/about`. Hidden in print.
2. `<h1>` CV title / General information section:
   - Left: `legalName` (largest) > `role` (smaller) > contact lines (normal). Contacts as `[monoIcon] text` (monochrome simple-icons), looped over available `contacts`. Email + phone line; LinkedIn + GitHub line (URLs without protocol). **Phone** defaults to "Upon Request" (hardcoded in page) and shows the URL `tel` value when valid.
   - Right: QR SVG (hidden on screen < ~794px/`md`; always shown in print; hidden entirely if generation failed).
3. Profile — thick-underline title + `professionalSummary` paragraph.
4. Professional experience — thick-underline title + reversed timeline (company, role, duration, `achievements` `<ol>`).
5. Certification — thick-underline title + reversed list (title[+link+new-tab icon], issuer, date, keywords).
6. Skills — thick-underline title + all categories grouped.
7. Education — thick-underline title + reversed list (school, course, duration, `achievements` `<ol>`).
8. Recent activities — thick-underline title + reversed list (title, year). Section omitted when empty.
9. Language — thick-underline title + pipe-separated `languages`.
10. Discreet print/share control (non-obvious UI). Hidden in print.

## Accessibility contract

- One `<h1>`; sections use `<section>` + heading; thick underline is decorative (not conveyed by color alone).
- Skip link to main content (consistent with other pages).
- QR SVG has an accessible name (e.g. `role="img"` + title "QR code linking to this CV") or `aria-hidden` if purely decorative alongside a visible URL.
- Print/share controls and alert dismiss are keyboard-operable with visible focus; tap targets ≥ 44px.

## Print contract (`@media print`)

- `@page { size: A4; margin: 18mm; }`.
- Forced light theme regardless of `data-theme`.
- `display: none`: primary nav, top alert, print/share control.
- Single column; QR visible; `break-inside: avoid` on experience/education/cert entries.
- All text selectable/copyable; no content inside raster images that an ATS must read.
