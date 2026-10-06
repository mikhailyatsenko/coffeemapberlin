# 05: Keep the auth modal open with a spinner while Google sign-in finishes

**What to build:** After the visitor picks their Google account, the auth modal stays open and its content becomes a centred spinner with a "Signing in" status, instead of the modal being swapped for the full-screen overlay. When sign-in finishes the modal closes as today; when it fails, the modal's content and the error come back in the same modal. See [spec](../spec.md), row 17 of the table and Implementation Decisions (Light: the header and the auth modal).

**Blocked by:** 01 (Keep the full-screen Loader for MainPage's first load only…), which gives the `Loader` the "Loading" status the test asserts is absent.

**Status:** ready-for-agent

- [ ] While Google sign-in finishes, the auth modal stays rendered and shows a centred `Spinner` with an accessible "Signing in" status in place of its content; no full-screen `Loader`.
- [ ] On success the modal closes as today; on failure its previous content returns with the error message.
- [ ] A new widget-level auth modal test, with the Google sign-in hook's loading state mocked: the modal is present with the "Signing in" status inside it and no "Loading" status.
- [ ] Browser check of Google sign-in at 1440×900 and 390×844.
- [ ] `npm test`, `npm run lint:ts` and the type check pass.
