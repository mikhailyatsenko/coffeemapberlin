# 04: reCAPTCHA on password reset and resend confirmation

Status: ready-for-agent
Blocked by: backend coffemap-server `.scratch/backend-hardening/issues/14-abuse-limits.md` (both deploy the same day)

## Problem

The backend now requires a reCAPTCHA v3 token (fail-closed) on `requestPasswordReset` and `resendConfirmationEmail`, always answers `success` on resend (it no longer says "does not exist" / "already confirmed"), and answers `RATE_LIMITED` when a form is used too often. Without this ticket, both forms fail with `CAPTCHA_FAILED` once the backend is live.

## Current behaviour

- `RequestPasswordReset` (`src/widgets/AuthModal/components/RequestPasswordReset/ui/RequestPasswordReset.tsx`) and `ResendConfirmEmail` (`.../ResendConfirmEmail/ui/ResendConfirmEmail.tsx`) send only `email`; the mutations in `src/shared/query/auth/mutations.ts` take no `captchaToken`.
- The resend success toast says "Confirmation email sent successfully!".
- Both forms toast `error.message` on failure; `SignInWithEmail` shows its error through `setError`.

## Expected behaviour

- Both mutations take `$captchaToken: String`; both forms call `executeRecaptcha` before sending, with actions `request_password_reset` and `resend_confirmation_email` (the same pattern as `SignUpWithEmail` / `register_user`). A blocked reCAPTCHA shows the same "verification was blocked" message the other captcha forms use.
- The resend success toast is neutral: "If an account needs confirming, we've sent an email."
- `RATE_LIMITED` shows the server's message on the sign-in, reset and resend forms (reset/resend already toast `error.message`; check sign-in does and doesn't replace it with a generic text).
- Regenerate GraphQL types against the backend schema.

## Acceptance criteria

- [ ] Test: submitting each form sends `captchaToken` with the right action.
- [ ] Test: a reCAPTCHA failure shows the blocked-verification message and sends no mutation.
- [ ] Test: resend success shows the neutral text.
- [ ] Test: a `RATE_LIMITED` answer shows its message on sign-in, reset and resend.
- [ ] Codegen, lint, type-check and tests pass.
