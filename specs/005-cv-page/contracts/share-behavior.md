# Contract: Share Behavior

Client-only behavior, hydrated island in `CvActions.astro` using `src/scripts/cv-share.ts` and `src/scripts/cv-phone.ts`.

## Share modal

| Element | Contract |
|---------|----------|
| Trigger | Discreet share control opens a modal (focus moves into modal; Esc closes; focus returns to trigger). |
| Phone input | Pre-filled `+60` country code; `inputmode="numeric"` (numeric keypad); accepts digits only; max 10 local digits (input beyond rejected). |
| Action button label | "Skip" when no local digits entered; "Share" when ≥ 1 local digit entered. |
| Country code | `+60` is fixed prefix; only local digits are user-editable. |

## Share URL construction

```
base = <canonical absolute /cv URL>   // site + base + 'cv', no tel
localDigits = parseLocalDigits(input)
if (isValidLocal(localDigits))        // length 9 or 10
    url = base + '?tel=' + encodeURIComponent(toTelParam(localDigits))  // toTelParam => "+60" + digits
else
    url = base                        // no tel attribute
```

- Fewer than 9 local digits → **no** `tel` attribute (even though button may read "Share").
- 9 or 10 local digits → `tel` included, URL-encoded.

## Share invocation & fallback

```
payload = { title: "<Name> — CV", text: "<short description>", url }
if (navigator.share) {
    try { await navigator.share(payload); closeModal(); }
    catch (e) {
        if (e.name === 'AbortError') return;   // user cancelled → no-op, keep modal or close per UX
        await copyFallback(url);
    }
} else {
    await copyFallback(url);
}

copyFallback(url):
    await navigator.clipboard.writeText(url)
    show transient bottom toast "Copied"   // slides up from bottom, auto-dismisses
    closeModal()
```

- **Success (native share)**: platform share sheet handles delivery; modal closes.
- **Unsupported / failure (non-abort)**: copy URL to clipboard, show a transient **bottom toast "Copied"**, close modal.
- **User abort**: treated as no-op (no copy, no "Copied").

## Guarantees

- Only the link (optionally with `tel`) is shared — no other personal data in the payload.
- Behavior is identical to how a recipient's `/cv` renders the phone (shared `cv-phone.ts` logic).
- Entire feature degrades gracefully with no JS-capable share API present.
