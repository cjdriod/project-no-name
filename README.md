# Personal Portfolio

> A calm, reading-first personal portfolio — built to be read comfortably for ten minutes, printed to A4 without a hiccup, and shared with a single tap.

This is a static, content-driven portfolio built with **Astro** and **Tailwind CSS v4**. It favours legibility over decoration: near-zero client JavaScript, semantic HTML, mobile-first layouts, and a type-safe content model that fails the build before it ever ships a half-populated page.

---

## ✨ Highlights

- **Reading-first by design** — content is legible and complete before any decoration is added; no animation while you read.
- **Document-style `/cv`** — a print-ready CV with A4 geometry, forced light theme in print, selectable (ATS-friendly) text, a build-time QR code, and a discreet **print / share** control.
- **Share with an optional phone** — native `navigator.share` with a copy-to-clipboard fallback; the phone number rides along as a URL-encoded `tel` parameter.
- **Type-safe content** — every page is assembled from Astro Content Collections (YAML + Zod). Malformed content breaks the build, not the page.
- **Accessible & fast** — WCAG 2.1 AA, one `<h1>` per page, visible focus, ≥44px tap targets, explicit media dimensions (no layout shift), Lighthouse budgets as an entry requirement.
- **Light & dark themes** — driven by CSS variables and `prefers-color-scheme`, with a persisted manual override.

## 🗺️ Pages

| Route       | What it is                                                        |
| :---------- | :--------------------------------------------------------------- |
| `/`         | Landing / hero — the first impression and quick highlights        |
| `/about`    | Long-form, reading-optimized "about me"                           |
| `/projects` | Project index with cards and links                                |
| `/cv`       | Document-style CV — print to A4, share, build-time QR             |

## 🧰 Tech Stack

- **Framework:** [Astro](https://astro.build) 7 (static-first, island architecture)
- **Language:** TypeScript
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com) via `@tailwindcss/vite`, mapped to design tokens
- **Icons:** [Iconify](https://iconify.design) through `astro-icon` (Simple Icons, Material Symbols, Logos)
- **Content:** Astro Content Collections (YAML) validated by [Zod](https://zod.dev)
- **QR:** [`qrcode`](https://www.npmjs.com/package/qrcode) rendered inline as SVG at build time
- **Deploy:** GitHub Pages (static output, base-path aware)

## 🚀 Getting Started

```sh
# 1. Install dependencies (Node >= 22.12)
npm install

# 2. Start the dev server at http://localhost:4321
npm run dev

# 3. Type-check + build the production site to ./dist/
npm run astro -- check
npm run build
```

## 🧞 Commands

All commands are run from the root of the project:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts the local dev server at `localhost:4321`  |
| `npm run build`           | Builds the production site to `./dist/`          |
| `npm run preview`         | Previews the build locally before deploying      |
| `npm run astro -- check`  | Runs TypeScript / content validation             |
| `npm run astro -- --help` | Gets help using the Astro CLI                    |

## 🏗️ Project Structure

```text
/
├── public/                 # Static assets served as-is (favicon, etc.)
├── src/
│   ├── assets/             # Images, logos, illustrations (optimized at build)
│   ├── components/         # Astro components (incl. cv/ for the CV page)
│   ├── content/            # YAML content collections (the site's data)
│   ├── layouts/            # Shared page shells
│   ├── pages/              # File-based routes: /, /about, /projects, /cv
│   ├── scripts/            # Small client/build helpers (share, phone)
│   └── styles/             # global.css — design tokens + print rules
├── .skills/                # Project design & authoring standards (see below)
├── specs/                  # Feature specs, plans, and tasks (spec-kit)
├── astro.config.mjs        # Astro + integrations config (set site/base here)
└── package.json
```

## 🎨 Design & Authoring Standards

This project keeps its design and code-style guidance under [`.skills/`](./.skills):

- **`design.md`** — the authoritative source for visual and interaction design: tokens, typography, color, layout, motion, and the print/CV rules.
- **`tailwind-readability.md`** — the mandatory Tailwind authoring standard: logical utility ordering, readable grouping for long class lists, extraction of repeated utilities, and keeping genuinely custom values in scoped CSS instead of bracket arbitrary-value utilities.

Project principles and quality gates live in [`.specify/memory/constitution.md`](./.specify/memory/constitution.md).

## 🚢 Deployment

The site builds to fully static output for **GitHub Pages**. Before deploying, set your real values in `astro.config.mjs`:

```js
export default defineConfig({
  site: 'https://USERNAME.github.io', // ← your GitHub Pages URL
  base: '/',                          // '/' for a user/personal page
});
```

Then `npm run build` and publish the `./dist/` folder via your Pages workflow.

## ⚖️ License

The source code in this repository is licensed under the MIT License.

The following content is excluded from the MIT License and remains © 2026–present Lim Chun Jie. All rights reserved:

- Personal photographs
- Resume/CV
- Logos and branding
- Personal information
- Written content (unless otherwise stated)
- Project screenshots and other media

You may use the source code in accordance with the MIT License, but you may not copy, redistribute, or use the excluded content without prior permission.
