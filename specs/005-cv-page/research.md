# Phase 0 Research: CV Page

All Technical Context items were resolvable from the existing codebase, the constitution, `design.md`, and the user's plan-time direction. No open `NEEDS CLARIFICATION` remain (the GitHub Pages URL is a deferred value carried as a documented placeholder, not a design unknown).

## Decision 1 — QR code generation (build-time, inline SVG)

- **Decision**: Generate the QR code at build time inside `cv.astro` frontmatter using `qrcode`'s `toString(url, { type: 'svg' })`, and inline the returned SVG markup. Wrap generation in try/catch; on failure, render nothing (hide the image) per FR (image generation failed → hide).
- **Rationale**: The site is static (GitHub Pages). Build-time generation ships zero client JS for the QR (Principle II), guarantees no runtime failure for visitors, and produces crisp, scalable, print-friendly SVG with selectable-free vector output. `qrcode@1.5.4` is already installed.
- **URL source**: `new URL(import.meta.env.BASE_URL + 'cv', Astro.site)` → canonical `site + base + cv`, excluding any `tel` query (FR-013). Requires `site`/`base` configured.
- **Dimensions**: Render the SVG in a fixed-size box (explicit width/height) to avoid CLS.
- **Alternatives considered**: (a) Client-side generation on mount — rejected: adds JS to a reading page and can fail in the visitor's browser. (b) `toDataURL` PNG `<img>` — rejected: raster, larger, less print-crisp than inline SVG. (c) Pre-committed static SVG file — rejected: URL is env/base-dependent and would drift from config.

## Decision 2 — Share behavior (`navigator.share` + clipboard fallback)

- **Decision**: On share confirm, build the target URL (canonical `/cv` absolute URL, plus `?tel=<urlencoded>` when the local number has 9–10 digits) and call `navigator.share({ title, text, url })`. If `navigator.share` is undefined or the call rejects/throws (unsupported or user-environment failure), fall back to `navigator.clipboard.writeText(url)`, show a **transient bottom toast reading "Copied"**, and close the modal.
- **Rationale**: Matches the user's explicit plan direction and Principle IV (interaction genuinely requires JS; scoped to an island). Native share reaches many platforms with one payload; clipboard is a universally available graceful fallback so the flow never dead-ends.
- **Payload**: `title` = "<Name> — CV" (from profile), `text` = short description, `url` = share URL. Only the link (with optional `tel`) is shared — no other PII.
- **Abort handling**: A user-cancelled native share (`AbortError`) is treated as a no-op (do not fall back to copy, do not show "Copied").
- **Alternatives considered**: Always copy — rejected: ignores native share the user asked for. Web Share Level 2 (files) — rejected: only a link is needed.

## Decision 3 — Phone parse / validate / format (shared module)

- **Decision**: A single `src/scripts/cv-phone.ts` exports pure helpers used by both the build-time render and the client island:
  - `parseLocalDigits(raw)` → digits after stripping non-digits and a leading `60`/`+60`.
  - `isValidLocal(digits)` → `digits.length` is 9 or 10.
  - `format(digits)` → `+60` + grouped display like `+6019-123 4567` (group: 2-3-4 / 2-4-4 depending on length).
  - `toTelParam(digits)` → `+60<digits>` (the value that gets URL-encoded into `tel`).
  - `fromTelParam(value)` → decode + parse; returns valid local digits or null.
- **Rationale**: Guarantees the display shown to a URL recipient is identical to what the sharer intended, eliminating format drift. Pure functions, no DOM — safe to import in the island script. **Phone is not stored in profile content**: the page hardcodes the "Upon Request" default and the island resolves any number solely from the URL `tel` parameter.
- **Validation rule (from spec)**: local number must be 9 or 10 digits; otherwise fall back to "Upon Request" (render) or omit `tel` (share).
- **Alternatives considered**: `libphonenumber-js` — rejected: heavy dependency for a fixed `+60` format; not warranted.

## Decision 4 — Contact icons via simple-icons `monoIcon` field

- **Decision**: Each contact entry carries a new **`monoIcon`** field holding a monochrome simple-icons name (e.g. `simple-icons:linkedin`, `simple-icons:github`, a mail glyph for email). The General information page renders `[monoIcon] text` (FR-010a). Add `@iconify-json/simple-icons` (already installed) icon names to the `astro-icon` `include` in `astro.config.mjs`.
- **Rationale**: Spec requires simple-icons specifically and a dedicated field keeps the CV's monochrome icons independent from the existing multicolor `logos` `icon` used elsewhere. Monochrome marks inherit `currentColor` and print cleanly under forced-light.
- **Note**: Confirm exact icon slugs during implementation; email may map to a generic mail glyph if a provider-specific slug is undesired.
- **Alternatives considered**: Mapping `channel` → simple-icons name in code — rejected: a data field (`monoIcon`) is explicit and content-driven (Principle V). Keep `logos` multicolor for contacts — rejected: spec says simple-icons and mono prints cleaner.

## Decision 5 — Print pipeline (A4, forced light, hidden chrome)

- **Decision**: A `@media print` block (scoped to the CV page) that: sets `@page { size: A4; margin: 18mm; }`; forces light theme by re-declaring the light token values under print regardless of `data-theme`; sets `display: none` on nav, the top alert (FR-007b), and the print/share section (FR-029a); collapses to a single column; keeps the QR visible (FR-013b); applies point-based type and `break-inside: avoid` on entries to prevent mid-entry page breaks.
- **Rationale**: Directly satisfies design.md §10.1 and constitution Gate 7; browser-native `window.print()` needs no server-side PDF. Low technical risk (already flagged in spec).
- **Forced light in print**: Because theme is applied via `:root[data-theme="dark"]` custom properties, the print block overrides the relevant color custom properties (or wraps content in a forced `data-theme="light"` scope for print) so dark-mode users still get a light printout.
- **Screen QR breakpoint**: On screen the QR is hidden below the print/A4 width (~794px, aligned to the `md` 768px breakpoint) and shown at/above it; print always shows it (independent rules — resolves the earlier print/breakpoint conflict).

## Decision 6 — GitHub Pages base-path handling

- **Decision**: Set `site` and `base` in `astro.config.mjs`. For a **personal/user** GitHub Pages site, `base: '/'`. Use a clearly-marked placeholder `site` (e.g. `https://USERNAME.github.io`) until the real URL is provided. All internal links (nav, alert `/about`, skip links) and the QR URL derive from `import.meta.env.BASE_URL` / `Astro.site` so they stay correct when the real value lands.
- **Rationale**: Constitution requires correct base-path handling for GitHub Pages. Centralizing on config + `BASE_URL` avoids hardcoded absolute paths breaking under a base prefix.
- **Action item**: Replace the placeholder `site` before production deploy (owner to provide).

## Decision 7 — Reverse ordering & optional-field rendering

- **Decision**: Use `Array.prototype.toReversed()` for experience, certifications, education, and activities (matches the existing pattern already used in `about.astro`). Guard optional fields: no link → plain certification title (no open-in-new icon); empty `achievements` → omit the list; empty `activities` → omit the section.
- **Rationale**: Consistency with existing code; satisfies FR reverse-order and edge-case requirements.

## Deferred / non-blocking

- **Real GitHub Pages URL**: Owner will supply; placeholder documented. Does not block design or build (QR simply encodes the placeholder until updated).
- **`@types/qrcode`**: Not yet installed; add as a dev dependency during implementation for typed build-time QR generation.
- **Exact simple-icons slugs**: Finalized during implementation against the installed pack (`@iconify-json/simple-icons` already installed).
