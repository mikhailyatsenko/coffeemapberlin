# 04: Show avatar upload in place, and stop the header's overlay on session re-checks

**What to build:** Uploading or deleting an avatar in Account settings shows one spinner over the avatar picture, with the avatar buttons disabled until it finishes, instead of two full-screen overlays stacked. The header's avatar menu no longer blacks out the site whenever the session is re-checked while a User is signed in; the action that triggered the re-check shows its own busy state. See [spec](../spec.md), rows 14–16 of the table and Implementation Decisions (Light: the avatar; Light: the header and the auth modal).

**Blocked by:** 01 (Keep the full-screen Loader for MainPage's first load only…).

**Status:** ready-for-agent

- [ ] The avatar feature no longer renders the full-screen `Loader`; only the avatar form shows the upload/delete wait.
- [ ] While `isUploading`, the avatar form shows a `Spinner` centred over the avatar picture (picture still visible beneath it), and "Upload new picture" and "Delete" are disabled. Its props are unchanged.
- [ ] The header's avatar menu renders no loading indicator on `isAuthLoading` and keeps showing the current User during the re-check.
- [ ] Browser check by hand at 1440×900 and 390×844 (no automated test, per the spec): upload and delete an avatar, save profile details, sign in; no full-screen overlay at any point, exactly one spinner on the avatar.
- [ ] `npm test`, `npm run lint:ts`, the type check and stylelint on changed stylesheets pass.
