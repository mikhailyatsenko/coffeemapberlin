# 06: `EMAIL_TAKEN` on email confirmation shows a toast

Status: ready-for-agent
Blocked by: backend coffemap-server `.scratch/backend-hardening/issues/15-email-change-collisions.md` (deployed)

## Problem

If a User changes their email and, before they confirm, someone else takes that address (registers or signs in with Google and confirms), the backend answers `confirmEmail` with `EMAIL_TAKEN` and cancels the pending change. The client treats every unknown error as an expired link and opens the resend modal, which can only fail again.

## Current behaviour

`src/shared/hooks/useEmailConfirmation.ts`: `EMAIL_ALREADY_CONFIRMED` → toast; any other error → `showResendConfirmationEmail(tokenExpired)`.

## Expected behaviour

- `EMAIL_TAKEN` → `toast.error('This email now belongs to another account', { position: 'top-center' })`, no resend modal, then `checkAuth()` so the profile shows the unchanged current email.
- Other codes keep today's behaviour.
- Regenerate GraphQL types if the error catalogue is typed there.

## Acceptance criteria

- [ ] Test: `confirmEmail` answering `EMAIL_TAKEN` shows the toast, doesn't open the resend modal, and refreshes the User.
- [ ] Test: `TOKEN_EXPIRED` still opens the resend modal.
- [ ] Lint, type-check and tests pass.
