# 07: Add an upfront password-length hint to Sign up

**What to build:** Someone filling in the Sign-up password field sees the 8-character minimum requirement before they type anything, instead of only finding out reactively after a rejected short password.

**Blocked by:** None (can start immediately)

**Status:** resolved

- [x] `FormField` gains an optional `hint` prop, rendered when there's no active `error` for that field.
- [x] When an `error` is present, the error message takes priority over the hint (the hint doesn't show alongside or instead of a real validation error).
- [x] Sign up's password field shows a hint ("At least 8 characters" or equivalent) before any input.
- [x] No other `FormField` call site is changed — the new prop is optional and unused elsewhere.
- [x] Existing password-length and password-match validation behavior (live, disabled-until-valid submit) is unchanged.
- [x] A test (extending `SignUpWithEmail`'s coverage, or modeled on `SignInWithEmail.test.tsx` if none exists) asserts the hint renders before input, and is replaced by the error once validation fails.

Source: [Ten quick UI fixes spec](../spec.md), Implementation Decisions §9.

**Notes:** The field points at whichever message it shows (hint or error) via `aria-describedby`, so every `FormField` with an error now also announces it to screen readers; the test reads the hint and the error as the field's accessible description. The 8-character minimum is a `PASSWORD_MIN_LENGTH` constant shared by the schema and the hint. Boy-scout: the slice root `index.ts` now re-exports `SignUpWithEmail` by name instead of `export *`, and `FormField`'s `errorContainer` is renamed `messageContainer`.
