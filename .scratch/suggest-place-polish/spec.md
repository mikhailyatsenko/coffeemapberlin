Status: resolved

# Suggest a Place polish: live validation and the Contact photo look (items 11 and 18 of the ui-ux-audit map)

Source: [Rank every improvement decided on this map](../ui-ux-audit/issues/09-rank-candidates.md), Tier 2 item 11 and Tier 3 item 18. Decisions drawn from [Forms UX](../ui-ux-audit/issues/07-forms-ux.md) (decisions 1 and 2), plus three choices confirmed with the user while writing this spec (photo asset, mobile layout, test seam — see Implementation Decisions).

## Problem Statement

Suggest a Place is the one form on the site that behaves and looks unlike the others:

- **Validation triggers differently.** Contact and both Auth forms (Sign in, Sign up) start with the submit button disabled and validate as you type; the button enables the moment the form is valid. Suggest a Place keeps "Suggest this Place" always enabled and only reveals "Name is required" / "Address is required" after a click. A visitor who learned the site's forms elsewhere gets a different contract here, and a visitor who clicks too early is greeted by a wall of red instead of a button that simply isn't ready yet.
- **It looks like a different site.** Contact greets the visitor with an atmospheric photo, a white heading and subtext on it, and the form beside it. Suggest a Place is a bare, centered column with a grey heading on white — the page that asks a visitor for the most effort (a Place, an address, photos) is the least inviting one.

The underline-input style itself (label above field, red underline plus message for errors) is already shared by all three forms; that part is not a problem.

## Solution

1. Bring Suggest a Place to the Contact/Auth validation pattern: fields validate live as the visitor types, "Suggest this Place" stays disabled until the form is valid, and errors appear on the field being edited rather than all at once on submit.
2. Give Suggest a Place Contact's atmospheric-photo treatment: on desktop/tablet a split layout — photo panel with the white heading and subtext on one side, the form on the other; on mobile the photo becomes a banner at the top carrying the heading and subtext, and the form sits below it on the normal page background.

No backend change, no new dependencies, no change to what gets submitted.

## User Stories

1. As a visitor on Suggest a Place, I want the "Suggest this Place" button to be disabled until I've given a name and an address, so that I can see the form isn't ready without having to click and be scolded.
2. As a visitor, I want the button to enable as soon as the required fields are filled and everything I typed is within limits, so that I know the moment I can send.
3. As a visitor, I want an error to appear on the field I'm editing while I type (e.g. "Name is required" after I clear the name), so that I fix it where I am rather than after a failed submit.
4. As a visitor, I want a name made only of spaces to count as missing, so that I can't send an empty suggestion by accident, and the button to stay disabled while it does.
5. As a visitor who pastes a too-long description or name, I want the length error to show right away on that field and the button to stay disabled, so that I can trim it before trying to send.
6. As a Guest who types an email, I want "Enter a valid email" to show live if it isn't one, and the button to stay disabled until I fix or clear it, so that I don't lose my one chance to hear back.
7. As a Guest who leaves the optional email empty, I want the form to still count as valid, so that the email stays truly optional.
8. As a visitor who leaves every optional field (description, Instagram, photos, email) empty, I want the button enabled once name and address are in, so that optional means optional.
9. As a visitor who has seen the site's Contact or Auth forms, I want Suggest a Place to behave the same way, so that the site's forms feel like one product.
10. As a visitor whose name matches existing Places, I want the "Is it one of these?" hint to keep showing as I type and to never block sending, so that the live validation doesn't change that behavior.
11. As a visitor whose browser is still checking whether I'm signed in, I want the button to keep showing its loading state, so that nobody can submit before it's known who is suggesting.
12. As a visitor whose photos are still being prepared, I want the button to keep showing its loading state, so that I can't send before the picked photos are ready.
13. As a visitor whose submit failed (daily limit or any other error), I want my values kept and the button enabled again, so that I can retry without retyping.
14. As a desktop visitor, I want Suggest a Place to open with the same atmospheric photo panel as Contact — heading "Suggest a Place" and its subtext in white on the photo, the form beside it — so that the page feels inviting and part of the same site.
15. As a tablet visitor, I want the photo panel and form to split the width the same way Contact does at that size, so that the form gets enough room.
16. As a mobile visitor, I want a photo banner at the top carrying the heading and subtext, and the form below it on the normal background, so that the page has the same atmosphere but the long form — the "Is it one of these?" box, photo previews, grey captions — stays readable.
17. As a visitor who just sent a suggestion, I want the heading to stay on the photo panel/banner while the thank-you replaces the form, so that the page doesn't jump to a different layout after submitting.
18. As a screen-reader user, I want the page to keep exactly one `h1` ("Suggest a Place"), and the disabled button to be announced as unavailable, so that the restructured layout doesn't cost me orientation.
19. As a maintainer, I want Suggest a Place's photo to be its own asset file, starting as a copy of Contact's photo, so that the photo can be swapped later by replacing one file without touching Contact or any styles.

## Implementation Decisions

### Item 11 — live validation (`pages/SuggestPlacePage/components/SuggestPlaceForm`)

- Switch the form's `useForm` mode from `'onTouched'` to `'onChange'`, the mode `ContactForm` and both Auth forms use, and read `isValid` from `formState`.
- Keep the existing Yup `validationSchema` as is — its rules (required trimmed name and address, the server's length caps, optional valid email) are already right; only the trigger changes. Default values stay all empty strings, so the optional fields are valid from the start.
- "Suggest this Place" (`RegularButton`) gets `disabled={!isValid}` in addition to its current `loading={isSubmitting || suggester === 'unknown' || photoUpload.isPreparing}`. `RegularButton` already treats `disabled || loading` as disabled, and only `loading` shows its spinner, so an invalid form shows a plain disabled button and a busy one keeps the spinner. Keep both props separate rather than folding validity into `loading`.
- The email field is rendered for Guests only; when it isn't rendered its empty default stays valid, so a User's form validity depends on name and address alone. No schema change needed.
- `SimilarPlaces`, the photo picker and the server-error message (`role="alert"`) keep their current behavior; photos are not part of form validity.
- Keep `noValidate` on the form.

### Item 18 — Contact's atmospheric-photo look (`pages/SuggestPlacePage/ui`)

- **Photo asset (confirmed with the user):** add `src/shared/assets/suggest-place.jpg`, a byte-for-byte copy of `contacts.jpg` for now. Suggest a Place references only its own file, so a different photo later is a file swap with no code change.
- **Desktop/tablet layout:** mirror `ContactPage`'s structure — a page-level flex row with a photo panel (`suggest-place.jpg` as a cover background, white centered text holding the page's `h1` "Suggest a Place" and the subtext "Know a good Place that isn't on the map yet? Tell us about it.") and a form panel. Use the same proportions and breakpoints as Contact: 50/50 above 1023px, 40/60 from 768px to 1023px. The form keeps a readable max width inside its panel (today's column is 560px); the form panel scrolls with the page, since this form is taller than Contact's.
- **Mobile layout (≤767px, confirmed with the user):** the photo panel becomes a full-width banner at the top — same photo, the dark gradient Contact uses on mobile (`linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.3))` over the photo) so the white heading and subtext stay legible — and the form sits below it on the normal page background. Unlike Contact, the form is **not** laid over the photo, and its fields, `SimilarPlaces`, the photo picker, captions and the thank-you keep their current dark-on-light colors.
- **Heading and subtext placement:** the `h1` moves from above the form into the photo panel/banner and is rendered in both states (form and thank-you). The subtext stays rendered only before submitting, as today. The old grey centered `.title`/`.subtitle` styles go.
- **No shared layout component.** Contact's look is page CSS, not a component, and the two pages diverge on mobile (Contact lays its form over a full-screen photo; Suggest a Place uses a banner), so the shared part is a handful of rules. Write Suggest a Place's own styles in its page module rather than extracting a widget or shared UI; don't touch `ContactPage` or `ContactForm`.
- Use the existing theme tokens for any colors introduced (e.g. `--text-inverse` for white text on the photo where it fits) instead of new hardcoded values; existing hardcoded colors elsewhere in these files stay out of scope.
- Keep the `<main>` landmark and the `Helmet` title as they are.

## Testing Decisions

Good tests here assert on what the visitor sees and can do — field values, error text, the button's enabled/disabled state, accessible roles and names — not on form mode, internal state or CSS classes. The seam is the existing page-level test, `SuggestPlacePage.test.tsx` (RTL + `MockedProvider` + `userEvent`), confirmed with the user; no new test files.

- **Rewrite the `validation` block** for the new contract. Clicking a disabled button does nothing in `userEvent`, so tests that click submit on an invalid form become assertions on the button and on live errors:
  - The button is disabled on an empty form and enables once name and address are filled; nothing is sent while it's disabled.
  - Clearing a typed name shows "Name is required" without any submit click; same for address.
  - A whitespace-only name shows "Name is required" and keeps the button disabled.
  - Pasting 201 characters into name and 501 into the description shows both length errors live and keeps the button disabled.
  - A Guest typing "not-an-email" sees "Enter a valid email" live and the button stays disabled; clearing the email enables it again.
- **Keep, unchanged in intent:** the "Is it one of these?" tests (including "does not block submitting"), "lets nobody submit while the session check is still running", the Guest-email visibility tests, every `submitting` test (they fill the required fields first, so they still pass through an enabled button — verify), and the `photos` tests.
- **Heading:** add one assertion that the `h1` "Suggest a Place" is present both before submitting and on the thank-you, and the subtext only before. Prior art: `ContactPage.test.tsx` checks its heading and subtext by role and text.
- **Visual layout and photo:** CSS-only, not meaningfully assertable in jsdom; check it in the browser at desktop (1440×900), tablet (~900px) and mobile (390×844) widths, in both the form and the thank-you state, with a Guest and with a User.

## Out of Scope

- Any backend change; the submitted input and the validation rules stay the same.
- Changing `ContactPage`, `ContactForm` or the Auth forms — they are the reference, not the target.
- Extracting a shared "photo panel" layout component for Contact and Suggest a Place (see Implementation Decisions).
- Picking a new, Suggest-specific photo; this spec ships a copy of `contacts.jpg` under its own name.
- Recoloring `SimilarPlaces`, the photo picker, captions or the thank-you for a dark background — the mobile banner layout exists to avoid that.
- Replacing hardcoded colors already in the touched style files with tokens beyond what new rules need (that's the `style-tokens` effort's job).
- The other Forms UX decisions — Contact's mobile heading and the Sign-up password hint — already shipped with [ui-quick-fixes](../ui-quick-fixes/spec.md).

## Further Notes

- Items 11 and 18 are independent: the validation change touches the form component and the tests, the visual change touches the page component, its styles and one new asset. They can ship as two tickets in either order; the only overlap is the heading test, which belongs with item 18.
- `FormField` already shows the error message in place of a hint and wires `aria-describedby`, so live errors need no `FormField` change.
