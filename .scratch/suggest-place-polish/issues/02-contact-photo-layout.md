# 02: Give Suggest a Place Contact's atmospheric-photo look

**What to build:** Suggest a Place opens the way Contact does. On desktop and tablet the page is split: a photo panel carries the "Suggest a Place" heading and its subtext in white, and the form sits beside it. On mobile the photo becomes a banner at the top carrying the heading and subtext, and the form follows below it on the normal page background, so the long form stays readable. The heading stays on the photo after submitting, while the thank-you takes the form's place.

**Blocked by:** None (can start immediately)

**Status:** resolved

- [x] Suggest a Place uses its own photo asset, which starts as an exact copy of Contact's photo. Swapping the photo later means replacing that one file, with no code change, and Contact is unaffected.
- [x] Desktop (above 1023px): a split layout, 50/50 photo panel and form, the same as Contact. The photo is a cover background; the heading and subtext are white and centered on it.
- [x] Tablet (768–1023px): a 40/60 split, the same as Contact.
- [x] The form keeps a readable max width inside its panel and scrolls with the page, since it is taller than Contact's.
- [x] Mobile (≤767px): a full-width photo banner at the top under Contact's mobile dark gradient, with the heading and subtext in white on it, and the form below on the normal background. Form fields, "Is it one of these?", the photo picker, captions and the thank-you keep their current dark-on-light colors.
- [x] The page keeps exactly one `h1`, "Suggest a Place". It appears on the photo in both the form state and the thank-you state; the subtext appears only before submitting.
- [x] The old grey, centered heading and subtext styling above the form is gone.
- [x] Contact, its form and the Auth forms are not changed, and no shared layout component is extracted.
- [x] Any new color uses an existing theme token (e.g. the inverse text token for white on the photo), not a new hardcoded value.
- [x] The `<main>` landmark and the page title stay as they are.
- [x] The Suggest a Place page test gains an assertion that the `h1` is present before and after submitting, and that the subtext is present only before. Prior art for the heading check: the Contact page test.
- [x] The layout is checked by eye in the browser at 1440×900, about 900px wide and 390×844, in both the form and the thank-you state, as a Guest and as a User.

Source: [Suggest a Place polish spec](../spec.md), Implementation Decisions "Item 18" and the heading/visual part of Testing Decisions.

**Notes:** Independent of [01](01-live-validation.md), but both tickets edit the same page test file. If they run in parallel, expect a trivial merge in that file.
