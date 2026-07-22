# Feature Specification: CV Page

**Feature Branch**: `005-cv-page`

**Created**: 2026-07-21

**Status**: Draft

**Input**: User description: "Develop a `/cv` page route that looks like a proper CV document (no animation, no eyebrow labels, includes share + print). Improve navigation linkage to the page. The page contains eight ordered sections: General information → Profile → Professional experience → Certification → Skills → Education → Recent activities → Language."

## Clarifications

### Session 2026-07-22

- Q: Does the "Profile" section equal the paragraph of professional summary? → A: Yes — the Profile section renders the professional-summary paragraph.
- Q: What order does the Certification list render in? → A: Reverse array order — the last item in the source array renders first.
- Q: What keyboard should the share modal's phone input use? → A: A numeric keypad layout.
- Q: What happens to the General-info QR code below the `xl` breakpoint? → A: (superseded — see next entry) originally hidden below `xl`.
- Q: Should the QR appear on the printed CV, and how should it behave across viewports? → A: The QR is required in print output. On screen it is hidden on viewports narrower than the print/A4 layout width (~A4 ≈ 794px, aligned with the `md` breakpoint) and shown at or above that width; in print it is always visible regardless of the screen rule. The General-info left area MUST be sized so the legal name (estimated 13–15 characters) always displays on a single line without wrapping.
- Q: Should the top-of-page "simpler view" alert appear in print? → A: No — it MUST be hidden (`display:none`) in the printed output.
- Q: How should contact options in the General-info left area be presented? → A: As "[icon] text", using a simple-icons icon for each contact channel.
- Q: Should the print/share action controls appear in print? → A: No — the print/share section MUST NOT render in print view.
- Q: Is the phone stored in profile content? → A: No — phone is not a profile.yaml attribute; the "Upon Request" default is implemented directly in the page, and only the URL `tel` parameter supplies a number.
- Q: How is the General-info contact icon defined? → A: Via a new `monoIcon` field on each contact (monochrome simple-icons name), used specifically by the General information page.
- Q: Should certification issuer and date be displayed? → A: Yes — issuer and date are important and MUST be shown alongside the title and keywords.
- Q: How is a URL-supplied phone rendered when the local number is more than 10 or fewer than 9 digits? → A: Show the fallback ("Upon Request") instead of the supplied value.
- Q: How is the phone number displayed when shown? → A: Formatted like `+6019-123 4567`.
- Q: What input does the phone field accept? → A: Digits only.
- Q: How is the phone value attached to the URL? → A: URL-encoded, as the `tel` query parameter.
- Q: What is the text-size hierarchy in the General information section? → A: legal name > role > contact (contact is normal text).
- Q: Where does the legal name come from? → A: A new `legalName` attribute in the profile content (profile.yaml).
- Q: Should the page show a top-of-page alert? → A: Yes — a dismissable alert reading "Looking for a simpler view? click here." where "click here" links to `/about`.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Read a comprehensive CV document (Priority: P1)

A visitor opens `/cv` and reads a single, document-style page that presents the full professional record in a fixed order: General information, Profile, Professional experience, Certification, Skills, Education, Recent activities, and Language. The page reads like a printed CV — calm, static, no animations, and no decorative "eyebrow" labels above section headings.

**Why this priority**: The CV document itself is the entire value of the feature. Without it there is nothing to link to, print, or share. It is independently usable via its direct URL.

**Independent Test**: Navigate directly to `/cv` and confirm all eight sections render in the specified order with content sourced from the existing content collections, that no animations play, and that section headings use a thick underline rather than eyebrow labels.

**Acceptance Scenarios**:

1. **Given** the CV page, **When** it loads, **Then** the eight sections appear in the exact order: General information, Profile, Professional experience, Certification, Skills, Education, Recent activities, Language.
2. **Given** the General information section, **When** it renders, **Then** the left area shows legal name, role, then a contact line of email and phone, then a line of LinkedIn and GitHub, and the right area shows a QR code encoding the CV page URL.
3. **Given** no valid phone value is supplied via the URL, **When** the General information section renders, **Then** the phone field displays "Upon Request".
4. **Given** a valid phone value (9–10 local digits) is supplied via the `tel` query parameter, **When** the section renders, **Then** the supplied phone value is displayed (formatted like `+6019-123 4567`) instead of "Upon Request".
5. **Given** LinkedIn and GitHub contacts exist, **When** they render, **Then** their URLs are shown without the `http(s)://` protocol prefix.
6. **Given** the Professional experience, Certification, Education, and Recent activities data, **When** they render, **Then** the last item in each source array appears first (reverse array order).
7. **Given** each remaining section (Profile, Certification, Skills, Education, Recent activities, Language), **When** it renders, **Then** its section title is shown with a thick underline.
8. **Given** the General information section, **When** the left area renders, **Then** the legal name is the largest text, the role is smaller than the legal name, and the contact lines are normal body text.
9. **Given** a viewport narrower than the print/A4 layout width, **When** the General information section renders on screen, **Then** the QR code is hidden.
10. **Given** any supported viewport and a legal name of ~13–15 characters, **When** the left area renders, **Then** the legal name displays on a single line without wrapping.
11. **Given** the top of the CV page, **When** it renders, **Then** a dismissable alert reading "Looking for a simpler view? click here." is shown, and activating "click here" navigates to `/about`.
12. **Given** the top-of-page alert, **When** the visitor dismisses it, **Then** it is removed from view.

---

### User Story 2 - Discover the CV from the navigation bar (Priority: P2)

A visitor sees a CV entry in the primary navigation bar so they can reach the CV without knowing the direct URL. The CV entry is the third item; when the smallest viewport cannot fit every item, the CV entry stays hidden until the `md` breakpoint, after which it appears, followed by the Projects entry.

**Why this priority**: Discoverability drives traffic to the CV, but the page is still reachable by direct URL without it, so it ranks below the document itself.

**Independent Test**: Load any page at a narrow viewport and confirm the CV entry is hidden; widen to the `md` breakpoint and confirm the CV entry appears as the third item, followed by Projects.

**Acceptance Scenarios**:

1. **Given** the navigation bar, **When** it renders on a wide viewport, **Then** the order is Home, About, CV, Projects.
2. **Given** a viewport below the `md` breakpoint, **When** the navigation bar renders, **Then** the CV entry is hidden.
3. **Given** a viewport at or above the `md` breakpoint, **When** the navigation bar renders, **Then** the CV entry is visible, followed by the Projects entry.
4. **Given** the visitor is on `/cv`, **When** the navigation bar renders, **Then** the CV entry is shown as the current page.

---

### User Story 3 - Print the CV as an A4 document (Priority: P2)

A visitor triggers a print action from the CV page and the browser's print view produces the entire CV content laid out on A4 pages, suitable for printing or "Save as PDF".

**Why this priority**: Printing/exporting is a primary reason recruiters visit a CV, but it depends on the document existing first.

**Independent Test**: Trigger the print action, open the browser print preview, and confirm the full CV content is laid out on A4 pages with page chrome (navigation, action controls) omitted from the printed output.

**Acceptance Scenarios**:

1. **Given** the CV page, **When** the visitor activates the print action, **Then** the browser print dialog/preview opens.
2. **Given** the print preview, **When** it renders, **Then** the entire CV content is presented on A4-sized pages.
3. **Given** the print preview, **When** it renders, **Then** navigation, the top-of-page alert, and the print/share action controls are excluded from the printed output.
4. **Given** the print preview, **When** content exceeds one page, **Then** content flows across multiple A4 pages without clipping.
5. **Given** the print preview, **When** it renders, **Then** the output uses the light theme regardless of the visitor's active theme.

---

### User Story 4 - Share the CV with an optional phone number (Priority: P3)

A visitor activates a share action. A modal asks for a phone number, pre-filled with the `+60` country code, presenting a numeric keypad layout and accepting digits only, limited to a 10-digit local number. If the input has no local digits the action button reads "Skip"; once a value is entered it reads "Share". When the entered local number has 9 or 10 digits, the shared URL includes the phone number as a URL-encoded `tel` query parameter so the recipient's view of the CV renders that phone number; otherwise the CV URL is shared without it.

**Why this priority**: Sharing is a convenience enhancement layered on top of the core document and can ship after the CV and print.

**Independent Test**: Activate share, confirm the modal appears pre-filled with `+60` and a numeric keypad, verify the button label toggles between "Skip" and "Share" based on input, verify digit limits, and confirm the shared URL contains the URL-encoded `tel` attribute only when the local number has 9 or 10 digits.

**Acceptance Scenarios**:

1. **Given** the visitor activates share, **When** the modal opens, **Then** the phone input is pre-filled with the `+60` country code, presents a numeric keypad layout, accepts digits only, and the action button reads "Skip".
2. **Given** the phone input has no local digits, **When** the visitor confirms, **Then** the CV URL is shared without a phone attribute.
3. **Given** the visitor types into the phone input, **When** the value is non-empty, **Then** the action button label changes to "Share".
4. **Given** the visitor types more than the allowed number of digits, **When** entering the phone number, **Then** input beyond 10 local digits is rejected.
5. **Given** the entered local number has 9 or 10 digits, **When** the visitor confirms share, **Then** the shared URL includes the phone number as a URL-encoded `tel` query parameter.
6. **Given** the entered local number has fewer than 9 digits, **When** the visitor confirms share, **Then** the shared URL does not include the phone attribute.
7. **Given** a shared URL that includes a valid `tel` attribute is opened, **When** the CV loads, **Then** the General information section renders the shared phone number (formatted like `+6019-123 4567`) instead of "Upon Request".

---

### Edge Cases

- **Missing optional content**: If a certification has no external link, its title renders as plain (non-clickable) text with no "open in new tab" icon. If an experience or education entry has no key achievements, its achievement list is omitted rather than shown empty.
- **Recent activities empty**: If the recent-activities source has no entries, the Recent activities section is omitted (or shows nothing) rather than rendering an empty heading.
- **Phone value in URL is malformed/oversized**: The rendered phone falls back to "Upon Request" if the supplied `tel` value's local number is fewer than 9 or more than 10 digits, or is otherwise not a plausible phone number.
- **QR across viewports & print**: On screen the QR code is hidden on viewports narrower than the print/A4 layout width (~A4 ≈ 794px, aligned with the `md` breakpoint) and shown at or above it; in printed output the QR is always included, forced visible by the print stylesheet independently of the screen rule.
- **Alert in print**: The top-of-page "simpler view" alert MUST be hidden (`display:none`) in printed output.
- **Long legal name**: The left area is sized for a ~13–15 character legal name on one line; names beyond that range are an out-of-scope edge (may reduce type size but single-line intent is tuned for this range).
- **Alert already dismissed**: Dismissing the top-of-page alert removes it for the current view; persistence of the dismissed state across visits is an implementation detail.
- **Web Share unavailable**: If the environment cannot present a native share sheet, the share action still surfaces the resulting URL to the visitor (e.g., copy) so the interaction never dead-ends. *(Exact fallback is an implementation detail.)*
- **Very long content in print**: Content that exceeds a page must break cleanly across A4 pages without cutting text mid-line.
- **QR code target**: The QR code encodes the canonical CV URL (page domain + `/cv`) without any phone query attribute.

## Requirements *(mandatory)*

### Functional Requirements

#### Navigation

- **FR-001**: The primary navigation bar MUST include a CV entry linking to `/cv` as the third item, ordered Home, About, CV, Projects.
- **FR-002**: The CV navigation entry MUST be hidden below the `md` breakpoint and visible at or above it, with the Projects entry following it.
- **FR-003**: When the visitor is on the CV page, the CV navigation entry MUST be indicated as the current page.

#### Page & structure

- **FR-004**: The system MUST serve a CV page at the `/cv` route styled to resemble a proper CV document.
- **FR-005**: The CV page MUST NOT use animations and MUST NOT show decorative "eyebrow" labels above section headings.
- **FR-006**: The CV page MUST present exactly these sections in this order: General information, Profile, Professional experience, Certification, Skills, Education, Recent activities, Language.
- **FR-007**: Every section except General information MUST display its section title with a thick underline treatment.
- **FR-007a**: The CV page MUST show, at the very top, a dismissable alert reading "Looking for a simpler view? click here." whose "click here" link navigates to `/about`; the alert is shown on screen at all viewport sizes (including small viewports), and dismissing it MUST remove it from view.
- **FR-007b**: The top-of-page alert MUST be hidden (`display:none`) in printed/PDF output, regardless of viewport size.

#### General information section

- **FR-008**: The General information section MUST have a left area and a right area.
- **FR-009**: The left area MUST display, in order: the legal name, the role, a contact line combining email and phone, and a line combining the LinkedIn URL and GitHub URL.
- **FR-009a**: The left area MUST source the legal name from a dedicated `legalName` attribute in the profile content.
- **FR-009b**: The left area text sizing MUST follow the hierarchy legal name > role > contact, where the contact lines are normal body text.
- **FR-009c**: The left area MUST size the legal name so it always renders on a single line without wrapping for names of approximately 13–15 characters.
- **FR-010**: The contact details in the left area MUST be produced by iterating over the available contacts in the profile content (only rendering channels that are present).
- **FR-010a**: Each contact option MUST be presented as "[icon] text", using the contact's `monoIcon` field — a monochrome simple-icons icon dedicated to the General information page.
- **FR-011**: The phone field MUST display "Upon Request" by default (this default is implemented directly in the page, not sourced from profile content), and MUST display the phone value provided via the `tel` URL query parameter only when its local number has 9 or 10 digits; otherwise it MUST fall back to "Upon Request".
- **FR-011a**: When a phone number is displayed, it MUST be formatted like `+6019-123 4567`.
- **FR-012**: LinkedIn and GitHub URLs MUST be displayed without their `http(s)://` protocol prefix.
- **FR-013**: The right area MUST display a QR code that encodes the CV page URL (page domain + `/cv`), excluding any phone query attribute.
- **FR-013a**: On screen, the QR code MUST be hidden on viewports narrower than the print/A4 layout width (~A4 ≈ 794px, aligned with the `md` breakpoint) and shown at or above that width.
- **FR-013b**: The QR code MUST be included in the printed/PDF output; the print stylesheet MUST force it visible independently of the screen-breakpoint rule.

#### Profile section

- **FR-014**: The Profile section MUST display a professional summary paragraph sourced from the profile content's professional-summary field.

#### Professional experience section

- **FR-015**: The Professional experience section MUST render entries in a timeline format.
- **FR-016**: Experience entries MUST render in reverse array order (last array item first).
- **FR-017**: Each experience entry MUST show company name, role, working duration, and a key-achievements ordered list.
- **FR-018**: Key achievements MUST come from a dedicated per-employment field stored as an array.

#### Certification section

- **FR-019**: The Certification section MUST render a list sourced from the achievements content, in reverse array order (last array item first).
- **FR-020**: Each certification entry MUST render the certification title on the first line and a set of keywords as a separate line.
- **FR-020a**: Each certification entry MUST also display its issuer and date.
- **FR-021**: When a certification has an external link, its title MUST be clickable, open in a new browser tab, and show a trailing "open in new tab" icon; when it has no link, the title MUST render as plain text with no icon.
- **FR-022**: Certification entries MUST display only the title (with optional link/icon), issuer, date, and keywords — no other data.

#### Skills section

- **FR-023**: The Skills section MUST render all skills grouped by their category.

#### Education section

- **FR-024**: Education entries MUST render in reverse array order (last array item first).
- **FR-025**: Each education entry MUST show school name, course, study duration, and a key-achievements ordered list.

#### Recent activities section

- **FR-026**: The Recent activities section MUST be sourced from a new dedicated content source and render entries in reverse array order (last array item first).
- **FR-027**: Each recent-activity entry MUST show only a title and a year.

#### Language section

- **FR-028**: The Language section MUST render the list of languages from the profile content, separated by a `|` delimiter.

#### Print & share actions

- **FR-029**: The CV page MUST provide print and share actions presented as a discreet, non-obvious UI element (not a prominent call to action).
- **FR-029a**: The print/share action section MUST NOT render in print/PDF output.
- **FR-029b**: Printed/PDF output MUST use the light theme, forced regardless of the visitor's active theme.
- **FR-030**: Activating print MUST open the browser print view and produce the entire CV content laid out on A4 pages, excluding navigation, the top-of-page alert, and action controls from the printed output.
- **FR-031**: Activating share MUST open a modal that requests a phone number, pre-filled with the `+60` country code.
- **FR-032**: The share phone input MUST accept digits only, present a numeric keypad layout on devices that support it, and allow up to 10 local digits.
- **FR-033**: The share modal's action button MUST read "Skip" when the phone input has no local digits and "Share" when it is non-empty.
- **FR-034**: When the entered local number has 9 or 10 digits, the shared URL MUST include the phone number as a URL-encoded `tel` query parameter; otherwise the shared URL MUST NOT include it.
- **FR-035**: A CV URL containing a valid `tel` query attribute, when opened, MUST cause the General information phone field to display the supplied value (formatted per FR-011a).

### Key Entities *(include if feature involves data)*

- **Profile**: The person's identity and contact metadata. For this feature it must also carry a legal name (`legalName`), a professional summary, and a list of languages, in addition to the existing name, role, and contact channels (email, LinkedIn, GitHub). The phone number is NOT stored in profile content — the page renders "Upon Request" by default and only shows a number supplied via the URL `tel` parameter. Each contact gains a `monoIcon` field (monochrome simple-icons name) used by the General information page.
- **Experience entry**: A single employment record with company, role, duration (start/end), and a new ordered list of key achievements.
- **Education entry**: A single study record with school, course, duration (start/end), and a new ordered list of key achievements.
- **Certification/Achievement entry**: A record with a title, an optional external link, issuer, date, and a new set of keywords. The CV displays title, issuer, date, and keywords.
- **Recent activity entry**: A new record type with only a title and a year.
- **Skill category**: A named group of skills; the CV renders all categories and their skills.
- **Shared CV URL**: The CV page URL, optionally carrying a phone-number query attribute that changes how the phone field renders.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: All eight sections render in the specified order for 100% of visits, with content matching the source content files.
- **SC-002**: A visitor can reach the CV from the navigation bar in a single tap at the `md` breakpoint and above, and the CV entry is absent below that breakpoint on 100% of loads.
- **SC-003**: Printing the CV produces A4-sized output containing 100% of the CV content with no navigation or action controls, and all text remains selectable/copyable in the resulting PDF.
- **SC-004**: When no phone is supplied, the phone field reads "Upon Request" on 100% of loads; when a valid phone attribute is present in the URL, the supplied value is shown on 100% of loads.
- **SC-005**: The share flow shares a URL that includes the phone attribute only when the entered local number has at least 9 digits, and never accepts more than 10 local digits, in 100% of attempts.
- **SC-006**: Experience, Education, and Recent activities render with the last source-array item first on 100% of loads.
- **SC-007**: A recipient who opens a shared URL containing the phone attribute sees the shared phone number in the General information section on 100% of loads.
- **SC-008**: The top-of-page "simpler view" alert appears on 100% of screen loads until dismissed and "click here" navigates to `/about`; the alert is absent from printed output; the QR code is hidden on screens narrower than the print/A4 width and present at/above it and in printed output; and a ~13–15 character legal name stays on a single line on 100% of loads.

## Assumptions

- **Content model extensions**: The profile content will be extended with a `legalName` attribute, professional summary, languages, and a per-contact `monoIcon` field; phone is intentionally NOT stored in profile content. Experience and education entries will gain a key-achievements array; achievement/certification entries will gain a keywords field (and continue to carry issuer/date, which the CV now displays); and a new content source will be added for recent activities. These are additive changes to the existing type-safe content collections.
- **Query attribute name (confirmed)**: The phone number is carried in the URL as a URL-encoded `tel` query parameter (e.g., `/cv?tel=%2B60191234567`), matching the value the share flow appends.
- **Phone validation (confirmed)**: The local number (after the `+60` country code) must be 9 or 10 digits to be shared or rendered; values with fewer than 9 or more than 10 local digits fall back to "Upon Request". Displayed numbers use the format `+6019-123 4567`.
- **Share transport**: Sharing uses the platform's native share capability where available, with a graceful fallback (e.g., copy the URL) when it is not. The exact transport is an implementation detail to be finalized in planning.
- **QR generation**: The QR code is generated for the canonical `/cv` URL and does not encode the phone attribute; generation approach (build-time vs. client) is an implementation detail.
- **Print approach**: Printing uses the browser's native print view driven by a print stylesheet with A4 page geometry; no server-side PDF generation is required for this feature. This is considered low technical risk.
- **Non-obvious placement**: The print/share controls are placed discreetly (e.g., a subtle affordance rather than prominent buttons) while still being reachable via keyboard for accessibility.
- **Reverse ordering**: "Higher in the array renders higher" is interpreted as reverse iteration of the existing source arrays, leaving the underlying files unchanged.
- **Print/light theme**: Printed output follows the project's existing print rules (forced light theme, single readable column) from the design guidance; the print/share controls, top-of-page alert, and navigation are omitted from the printed page. This is a confirmed decision.
