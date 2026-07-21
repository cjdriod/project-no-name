# Phase 0 Research: Projects Page

All open questions were resolved during `/speckit.clarify` and the plan input. No `NEEDS CLARIFICATION` markers remain. This document records the technical decisions and the reasoning behind them.

## R1. Content model & ordering

- **Decision**: Add a `projects` Content Collection loaded from a single `src/content/projects.yaml` authored as a **top-level YAML array**, ordered **oldest at the lowest index → latest at the highest index**. The page renders the list **reversed** (`.toReversed()`) so the newest project is displayed first.
- **Rationale**: Matches the existing `experience` collection, which is already a top-level YAML array consumed with `.toReversed()` in `index.astro` and `about.astro`. Authoring in chronological order is natural (append new projects to the end); reversing at render keeps "latest first" without reordering the file. Directly satisfies the user's stated structure requirement.
- **Alternatives considered**: (a) Newest-first authoring — rejected, contradicts the requested structure and diverges from the `experience` convention. (b) Per-file entries via `glob()` loader — rejected as heavier than needed for 5 items and inconsistent with the flat-file YAML pattern already in use.

## R2. Image fallback for missing / broken / oversized images

- **Decision**: Ship a static `public/images/project-placeholder.svg`. Render each card image with a fixed aspect-ratio wrapper (lazy-loaded). If the image src is empty at build time, render the placeholder directly. For runtime load failures (broken link / oversized / 404), attach a minimal inline `onerror` handler that swaps `src` to the placeholder and stops further error loops.
- **Rationale**: A pure-CSS solution cannot detect a broken raster image, so a tiny progressive `onerror` is the standard, dependency-free approach. It is not a hydrated island and adds negligible JS, keeping Principle II/IV intact. The fixed aspect ratio guarantees no CLS whether the real image or the placeholder is shown.
- **Alternatives considered**: (a) CSS `background-image` with fallback — loses semantic `<img>`/`alt` and still can't detect broken URLs cleanly. (b) A hydrated island to manage image state — rejected as over-engineering for a one-line fallback.

## R3. External links (source code / website / view more)

- **Decision**: Render external links as anchors with `target="_blank" rel="noopener noreferrer"`, an accessible label ending in "(opens in a new tab)", and a trailing `material-symbols:open-in-new-rounded` icon.
- **Rationale**: This is the exact, proven pattern already used in `ContactSection.astro`. Reusing it guarantees visual and behavioural consistency and satisfies FR-006/FR-007.
- **Alternatives considered**: A shared `<ExternalLink>` component — nice-to-have but out of scope; the inline pattern is small and already idiomatic here.

## R4. "View more" GitHub source

- **Decision**: Resolve the GitHub URL from the existing `profile.contacts` entry where `channel === 'github'`. If no such contact exists, omit the "View more" action.
- **Rationale**: Reuses the single source of truth in `profile.yaml` (FR-009); no new content channel or schema change. Graceful omission satisfies the "GitHub contact absent" edge case.
- **Alternatives considered**: A dedicated field on the projects collection or page — rejected as duplicating data already modelled in profile contacts.

## R5. Responsive layout & grid

- **Decision**: Base layout is a single-column stacked card list. At the `lg` (1024px) breakpoint switch to a multi-column project grid (`--container-wide` shell) per design.md §4 (`--container-wide` = 1200px, 3-column desktop grid). Cards follow design.md §7.3/§7.6 (surface bg, 1px border, `--radius-lg`, `--shadow-sm`, hover lift `-2px`); tech labels are plain-text pill tags per §7.4 (no icons). Card content uses a vertical flex layout so the links sit in a **card action group anchored at the bottom** — cards in a row keep aligned action rows regardless of description length.
- **Rationale**: design.md is explicit that mobile and tablet share one single-column tier and only desktop gets the 3-column grid; constitution Principle III mandates mobile-first authoring.
- **Alternatives considered**: An intermediate tablet grid — explicitly disallowed by design.md §4/§5.

## R6. Bottom-nav Projects tab visibility & active state

- **Decision**: The Projects tab already links to `/projects` and gets `aria-current="page"` + active styling via NavBar's `pathname` check — no change needed for the active state. Change the responsive rule so the Projects `<li>` is hidden below `lg` (1024px) and shown at `lg`+, replacing the current `max-width: 440px` hide rule.
- **Rationale**: The clarify session specified the tab stays hidden on small screens until the large/desktop viewport. The active-state effect already works generically for the current route.
- **Alternatives considered**: Keeping the 440px threshold — rejected; contradicts the clarification.

## R7. Iconography

- **Decision**: Reuse `material-symbols:open-in-new-rounded` (already registered) for external links and `simple-icons:github` (already registered) for the GitHub "View more". Technology labels are **plain text (no icons)**, so no per-technology `logos:*` glyphs are needed. Add only a source-code glyph (e.g. `material-symbols:code-rounded`) to the `astro.config.mjs` `icon()` include list if one is used on the source link.
- **Rationale**: `astro-icon` only bundles explicitly-included glyphs; unregistered names fail to render. Keeping the include list authoritative avoids missing icons.
- **Alternatives considered**: Wildcard icon inclusion — rejected; bloats the bundle and violates the lean-asset goal.
