# 03: Reset the auth store to signed-out on `UNAUTHENTICATED`

Status: ready-for-agent
Blocked by: backend coffemap-server `.scratch/backend-hardening/issues/11-session-revocation.md`
Priority: low

## Problem

When a Session ends on the server (7 days passed, password changed or reset on another device, account deleted), the next request that needs a User gets `UNAUTHENTICATED`, but the app still believes it is signed in: the header shows the User, and every account action fails with "Authentication required". Session revocation (backend ticket 11) makes this more frequent.

## Current behaviour

- `src/shared/config/apolloClient.ts` has an `onError` link that reacts only to `GUEST_IDENTITY_INVALID`.
- The auth store (`src/shared/stores/auth`) is only reset by `clearAuth` (which also calls the `logout` mutation) or by a failed `checkAuth`.

## Expected behaviour

- The Apollo error link, on any GraphQL error with `extensions.code === 'UNAUTHENTICATED'`, sets the auth store to signed-out (`user: null`, not loading) **without** calling `logout` (the server already dropped the Session and cleared the cookies).
- It does nothing when the store is already signed-out (anonymous calls to guarded operations must not loop or flicker).
- Avoid a circular import: `apolloClient.ts` is imported by the auth actions, so reset the store through `useAuthStore.setState` or an injected callback, not by importing `clearAuth`.
- No toast needed; showing the sign-in entry point is enough.

## Acceptance criteria

- [ ] Test: with a signed-in store, a mocked operation answering `UNAUTHENTICATED` leaves the store signed-out and sends no `logout` mutation.
- [ ] Test: other error codes don't touch the auth store.
- [ ] No circular import between `shared/config/apolloClient` and `shared/stores/auth`.
- [ ] Lint, type-check and tests pass.
