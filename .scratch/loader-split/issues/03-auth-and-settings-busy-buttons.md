# 03: Show sign-in, sign-up, password reset and Account settings as busy on their submit buttons

**What to build:** Signing in or up with email, setting a new password from a reset link, and saving profile details or a password in Account settings no longer black out the site. Each form's submit button turns busy for the whole action: the auth modal stays in view while signing in or up, and in Account settings only the form being saved shows it is working, until the session has been re-read. See [spec](../spec.md), rows 11–13 of the table, the Reset password note, and Implementation Decisions (Light: busy buttons for form submits).

**Blocked by:** 01 (Keep the full-screen Loader for MainPage's first load only…), which gives the `Loader` the "Loading" status the tests assert is absent.

**Status:** ready-for-agent

- [ ] "Sign in" and "Sign up" pass their existing whole-handler loading state to `RegularButton`'s `loading`; the features stop rendering the full-screen `Loader`. Sign-in still closes the modal only after the session check.
- [ ] ResetPasswordPage's "Reset password" button gets `loading` from the reset mutation; the page's three full-screen states are unchanged.
- [ ] Account settings: each "Save changes" button is busy from its own form's `isSubmitting`, covering the mutation and the session re-check; the feature drops its shared `Loader`; saving one form leaves the other untouched.
- [ ] `SignInWithEmail.test.tsx` and `SignUpWithEmail.test.tsx` gain a case: with a pending mutation the submit button is busy and no "Loading" status is present; for sign-up the button is already busy while reCAPTCHA is pending. Existing cases pass.
- [ ] A new feature-level Account settings test (auth store seeded with a User, `MockedProvider`): saving profile details makes only that form's button busy, until the session re-check resolves.
- [ ] Browser check at 1440×900 and 390×844: sign in, sign up, both settings saves.
- [ ] `npm test`, `npm run lint:ts` and the type check pass.
