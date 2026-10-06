# 02: Show Contact and Report inaccuracy as busy on their send buttons

**What to build:** Sending the Contact form or a report about an inaccurate Place no longer blacks out the site. The "Send message" and "Send report" buttons turn busy (spinner, disabled, `aria-busy`) from the click until the result screen replaces the form, including the reCAPTCHA step before the request, so there is no silent gap to click twice in. The page around the form stays visible. See [spec](../spec.md), rows 9–10 of the table and Implementation Decisions (Light: busy buttons for form submits).

**Blocked by:** 01 (Keep the full-screen Loader for MainPage's first load only…), which gives the `Loader` the "Loading" status the tests assert is absent.

**Status:** ready-for-agent

- [ ] `WhiteButton` gains `loading`, mirroring `RegularButton`'s: disabled, `aria-busy`, a small spinner before the label that reads on the white button over Contact's photo. Its other behaviour is unchanged.
- [ ] The Contact form's "Send message" and the Report inaccuracy form's "Send report" are busy for the whole submit, taken from react-hook-form's `isSubmitting` in the form entities; the features' submit handlers keep awaiting the whole action.
- [ ] Neither feature renders the full-screen `Loader` any more. Success and error result screens are unchanged.
- [ ] New feature-level tests for Contact and Report inaccuracy (`MockedProvider`, reCAPTCHA helper mocked): the button is busy already during the reCAPTCHA step and until the result screen shows; no "Loading" status at any point.
- [ ] Browser check of both forms at 1440×900 and 390×844 against the prod API, including Contact's button over the photo.
- [ ] `npm test`, `npm run lint:ts`, the type check and stylelint on changed stylesheets pass.
