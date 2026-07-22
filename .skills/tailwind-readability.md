# Skill: Tailwind CSS Readability & Maintainability

## Purpose

Apply this skill whenever modifying React, Next.js, Vue, Svelte, or any project using Tailwind CSS.

The objective is to produce code that is easy to read, easy to maintain, and consistent across the codebase while preserving existing behavior.

---

# Core Principles

Always optimize for:

1. Readability
2. Consistency
3. Maintainability
4. Simplicity

Never optimize solely for reducing the number of lines or characters.

---

# Class Ordering

Always arrange Tailwind utilities in logical groups.

Preferred order:

## 1. Layout

- block
- inline-block
- flex
- inline-flex
- grid
- hidden

## 2. Flex & Grid

- flex-*
- items-*
- justify-*
- content-*
- place-*
- gap-*

## 3. Position

- static
- relative
- absolute
- fixed
- sticky
- top/right/bottom/left
- z-index

## 4. Spacing

- m-*
- mx-*
- my-*
- mt-*
- mb-*
- p-*
- px-*
- py-*

## 5. Sizing

- w-*
- h-*
- min-*
- max-*

## 6. Typography

- text-*
- font-*
- leading-*
- tracking-*
- whitespace-*

## 7. Background & Colors

- bg-*
- text-color
- fill
- stroke

## 8. Borders

- border-*
- rounded-*

## 9. Effects

- shadow-*
- opacity-*
- ring-*
- blur-*

## 10. Animation

- transition-*
- duration-*
- ease-*
- animate-*

## 11. State Modifiers

- hover:
- focus:
- active:
- disabled:

## 12. Responsive Modifiers

- sm:
- md:
- lg:
- xl:
- 2xl:

---

# Formatting

## Short Classes

Keep inline.

Example:

```tsx
className="flex items-center gap-2"
```

---

## Long Classes

When a class list exceeds roughly 8–10 utilities, split it across multiple lines and group related utilities together.

Example:

```tsx
className="
  flex items-center justify-between
  gap-4

  p-6

  bg-white

  border border-gray-200
  rounded-xl

  shadow-sm

  transition
  hover:shadow-md
"
```

Do not wrap every class onto its own line.

Group by purpose.

---

# Repeated Styles

If the same Tailwind utility string appears three or more times:

- Extract a reusable component if it represents a UI pattern.
- Otherwise extract a shared constant.
- If the project already uses `cn`, `clsx`, `tailwind-merge`, or `class-variance-authority (cva)`, follow the existing convention.

Do not create abstractions for one-off usage.

---

# Conditional Classes

Prefer:

```tsx
cn(
  "base classes",
  active && "active styles",
  disabled && "disabled styles"
)
```

Avoid:

- nested ternaries
- string concatenation
- unreadable template literals

---

# CSS Extraction

Avoid creating CSS classes that simply wrap Tailwind utilities.

Do not use:

```css
.button {
    @apply px-4 py-2 rounded-lg;
}
```

Only create CSS when necessary for:

- third-party components
- complex animations
- global typography
- CSS variables
- browser-specific behavior

---

# Components

Prefer reusable components over duplicated Tailwind.

Good:

```tsx
<Button />
<Card />
<Badge />
```

Avoid replacing reusable UI primitives with raw HTML.

---

# Arbitrary Values

Avoid arbitrary values when an equivalent Tailwind token exists.

Prefer:

```
w-64
```

instead of

```
w-[256px]
```

**Do not use Tailwind's bracket arbitrary-value syntax (`w-[256px]`, `shadow-[var(--shadow-lg)]`, `size-[0.95rem]`) as a substitute for a missing token.**
When a value has no equivalent Tailwind token (custom design tokens, fluid `clamp()` values, one-off pixel sizes, `color-mix()`, etc.), keep that declaration in scoped CSS instead. This keeps the class list scannable and keeps truly custom values next to a documented reason, rather than hidden inline in bracket syntax.

```astro
<!-- Avoid -->
<div class="shadow-[var(--shadow-lg)] px-[var(--gutter)]">

<!-- Prefer -->
<div class="cv-alert">
<style>
  /* --gutter is a responsive clamp() token with no Tailwind equivalent. */
  .cv-alert { padding-inline: var(--gutter); }
</style>
```

---

# Migrating Scoped CSS to Tailwind (CSS-variable-driven design systems)

Many projects define design tokens as CSS custom properties (`--space-4`, `--text-lg`, `--radius-md`, `--tracking-tight`, etc.) instead of a Tailwind config/`@theme` mapping for every scale. When converting existing scoped `<style>` blocks to Tailwind utilities in this kind of project, verify equivalence before converting — do not assume a utility with a matching name produces the same value.

## Rules for deciding what converts safely

1. **Color/background tokens mapped in `@theme` are always safe to convert.**
   If `--color-text: var(--text)` (etc.) is declared in `@theme`, then `text-text`, `bg-surface`, `border-border`, `text-accent`, `hover:bg-accent-hover` etc. reference the CSS variable directly with no numeric approximation — convert these unconditionally.

2. **Spacing, sizing, radius, border-width, and standard font-size utilities convert only if the token's numeric value exactly matches Tailwind's default scale.**
   Check the token's real value against Tailwind's default (e.g. project `--space-4: 1rem` vs Tailwind `p-4 = 1rem`, project `--radius-md: 8px` vs Tailwind `rounded-lg = 0.5rem`). If they match exactly, convert (`gap-4`, `rounded-lg`, `min-h-11` for 44px, `text-lg` for 1.125rem). If they don't match (e.g. a custom `--text-3xl` or a fluid `clamp()` value), do not force a same-named Tailwind class — keep the declaration in scoped CSS.

3. **`letter-spacing`, `line-height`, and `tracking-*`/`leading-*` tokens frequently do NOT match Tailwind's defaults even when the name looks equivalent.**
   Always compare the actual numeric value (e.g. project `--tracking-tight: -0.02em` vs Tailwind's `tracking-tight: -0.025em`, project `--leading-relaxed: 1.7` vs Tailwind's `1.625`). Mismatches must stay as scoped CSS rather than being approximated by the similarly-named utility.

4. **When most declarations on a selector are mismatched/custom, keep the whole rule together in scoped CSS** rather than splitting a couple of matching properties out to utilities. Don't fragment one conceptual style (e.g. a heading's typography) across both systems if it hurts readability — only split out the individual mismatched properties when the rest of the selector clearly benefits from being utility-first (e.g. one custom icon size sitting inside an otherwise simple flex/color rule).

5. **Always keep the following in scoped CSS, regardless of value:**
   - Fixed/absolute positioning combined with z-index layering (modals, toasts, dropdowns) and `[hidden]`/display-toggle logic.
   - Non-standard `grid-template-columns`/`grid-template-rows` tracks (e.g. `1fr auto`) and other declarations tied to the same responsive/print breakpoints.
   - `color-mix()`, `clamp()`, custom cubic-beziers, and other computed/functional values.
   - Selectors targeting markup you don't control the class attribute of — e.g. `:global(svg)` inside a third-party icon/slot, or elements injected via `set:html`/`innerHTML`.
   - Print-only rules that pair a modern utility-equivalent property with a legacy fallback (e.g. `break-inside` + `page-break-inside`) — keep the pair together for clarity.

6. **Verify after converting.** Run the project's build after each file, and spot check generated CSS (e.g. `grep` the compiled stylesheet for the expected computed value) to confirm a utility class actually produced the same value as the original scoped declaration, not just a same-looking value.

---

# Responsive Utilities

Group responsive classes together.

Example:

```tsx
className="
  grid
  grid-cols-1
  gap-6

  md:grid-cols-2

  lg:grid-cols-4
"
```

---

# Refactoring Rules

When editing existing files:

- Preserve functionality.
- Preserve accessibility.
- Preserve responsive behavior.
- Preserve animations.
- Preserve component APIs.

Do not introduce breaking changes.

Avoid unnecessary refactors unrelated to the task.

---

# Code Review Checklist

Before completing any task, verify:

- Utilities are consistently ordered.
- Long class lists are readable.
- No duplicated utility strings remain.
- Components are reused appropriately.
- Conditional classes are clean.
- No unnecessary CSS was introduced.
- No visual regressions were introduced.
- No bracket arbitrary-value utilities (`[...]`) were used as a stand-in for a missing token — those values live in scoped CSS instead.
- Every converted numeric utility (spacing/radius/font-size/line-height/letter-spacing) was checked against the project's actual token value, not assumed equivalent by name.
- Genuinely complex rules (positioning/z-index layering, non-standard grid tracks, `:global()`/injected-markup selectors, print fallback pairs) remain grouped in scoped CSS rather than fragmented.

If there is uncertainty between two approaches, choose the option that makes the code easier for another developer to read six months later.
