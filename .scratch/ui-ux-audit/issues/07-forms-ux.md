Type: grilling
Status: resolved

## Question

How convenient and modern do the site's forms feel — Suggest a Place, Contact, and Auth (sign in / sign up)? Cover validation feedback, field layout, error states, and consistency of style between them. Walk each on the live site before deciding what to change.

## Answer

Tested all three forms live on https://3welle.com (desktop 1440×900 and mobile 390×844) — submitted empty, typed invalid data, watched real validation behavior rather than reading static screenshots.

**Key fact**: the underline-input visual style (label above field, red-underline-plus-message errors) is already consistent across all three — a real strength, not a gap. The actual inconsistency is in validation *triggering*: Suggest a Place's submit button stays always-enabled and only reveals errors after a click, while Contact and both Auth forms (Sign in, Sign up) start their submit button disabled and validate live as-you-type.

Decisions:

1. **Validation trigger**: bring Suggest a Place to the Contact/Auth pattern (disabled-until-valid, live validation) — it already won 2 of 3 forms and Suggest a Place has no structural reason (like an unusual mix of optional fields) to behave differently.
2. **Suggest a Place's visual treatment**: bring it to Contact's resolved look — the same atmospheric photo background, heading, and subtext treatment — as a concrete target, not a vague "make it prettier." Exact layout is left to implementation.
3. **Contact's mobile heading**: add "Let's get in touch!" and its subtext back on mobile — confirmed via the a11y tree it's fully removed from the DOM at 390px, not just scrolled past, leaving mobile visitors on a bare form with no page context.
4. **Sign up password hint**: add upfront helper text for the 8-character minimum, instead of only showing it reactively after a too-short attempt.
5. **Auth as a modal**: confirmed fine as-is, explicit sign-off — a modal for quick sign-in/sign-up without losing the current page's context is a normal, deliberate pattern, not a consistency gap to fix.
6. Checked `CONTEXT.md`'s User/Guest glossary entries against this ticket's findings: unrelated to form validation-style findings, no glossary change.
