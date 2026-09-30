# 07: Add an upfront password-length hint to Sign up

**What to build:** Someone filling in the Sign-up password field sees the 8-character minimum requirement before they type anything, instead of only finding out reactively after a rejected short password.

**Blocked by:** None (can start immediately)

**Status:** ready-for-agent

- [ ] `FormField` gains an optional `hint` prop, rendered when there's no active `error` for that field.
- [ ] When an `error` is present, the error message takes priority over the hint (the hint doesn't show alongside or instead of a real validation error).
- [ ] Sign up's password field shows a hint ("At least 8 characters" or equivalent) before any input.
- [ ] No other `FormField` call site is changed — the new prop is optional and unused elsewhere.
- [ ] Existing password-length and password-match validation behavior (live, disabled-until-valid submit) is unchanged.
- [ ] A test (extending `SignUpWithEmail`'s coverage, or modeled on `SignInWithEmail.test.tsx` if none exists) asserts the hint renders before input, and is replaced by the error once validation fails.

Source: [Ten quick UI fixes spec](../spec.md), Implementation Decisions §9.
