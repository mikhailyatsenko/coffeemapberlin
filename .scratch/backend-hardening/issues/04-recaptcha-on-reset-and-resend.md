# 04: reCAPTCHA on password reset and resend confirmation

Status: done
Blocked by: backend coffemap-server `.scratch/backend-hardening/issues/14-abuse-limits.md` (both deploy the same day) — done

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

- [x] Test: submitting each form sends `captchaToken` with the right action.
- [x] Test: a reCAPTCHA failure shows the blocked-verification message and sends no mutation.
- [x] Test: resend success shows the neutral text.
- [x] Test: a `RATE_LIMITED` answer shows its message on sign-in, reset and resend.
- [x] Codegen, lint, type-check and tests pass.

## Comments

2026-09-30 (implement): Done on `feat/recaptcha-reset-resend`.

- `shared/lib/recaptcha/executeRecaptcha.ts`: added `request_password_reset` and `resend_confirmation_email` to `RecaptchaAction`.
- `shared/query/auth/mutations.ts`: both mutations take `$captchaToken: String` now, matching the backend schema on `main` (ticket 14 already merged there).
- `RequestPasswordReset.tsx` / `ResendConfirmEmail.tsx`: mint a token with `executeRecaptcha` right before submitting; a blocked reCAPTCHA (`RecaptchaUnavailableError`) shows `SAVE_ERROR_MESSAGES.recaptcha` — the same message `RateNow` and `SuggestPlacePage` use — and sends no mutation.
- Resend's success toast is now "If an account needs confirming, we've sent an email."; `RATE_LIMITED` already surfaced `error.message` on both forms via their existing `onError`, so that only needed a test.
- `SignInWithEmail.tsx`: unchanged — its catch block already forwards `err.message` as-is, so a `RATE_LIMITED` `ApolloError` was never replaced with generic text; added a test to lock that in.
- Regenerated `shared/generated/graphql.ts` against the backend's typeDefs (local server wasn't running; pointed codegen's schema at `../coffemap-server/src/graphql/typeDefs/*.graphql` for one run, then reverted `codegen.ts`). Most of the diff is unrelated codegen-version drift (`interface X {}` → `type X = {}`, `T[]` → `Array<T>`) that a plain regenerate would have picked up regardless of who ran it next.

`/code-review` (medium) found 7 real issues in the first pass, all fixed:
- Both forms rethrew a non-`RecaptchaUnavailableError` (e.g. a misconfigured site key) out of an unawaited async `onSubmit`, which react-hook-form's `handleSubmit` doesn't catch — an unhandled rejection with no toast and no mutation. Fixed by switching both catch blocks to the codebase's existing `getSaveErrorMessage`/`getSaveErrorReason` helpers (`shared/lib/saveError`, already used by `RateNow`), which handle every error type and never rethrow. This also removed the inline `RecaptchaUnavailableError` check that duplicated those helpers.
- Both submit buttons stayed enabled through the `executeRecaptcha` await (Apollo's `loading` only flips once the mutation itself is sent), so a fast double click could mint two tokens and fire two mutations. Fixed with a local `isMintingToken` state, set synchronously before the await and included in `disabled`, matching the guard `SignUpWithEmail` already has.
- `executeRecaptcha.ts`'s `loader` cache was never reset on two of its three failure paths (missing site key; an existing script tag with `window.grecaptcha` still undefined) — only `script.onerror` reset it, so those two failures broke reCAPTCHA for the rest of the page session, including the two callers this ticket adds. Restructured `loadRecaptcha` to reset `loader` in one place, after any rejection, instead of per branch.
- Added regression tests for all three: a rejected non-`RecaptchaUnavailableError` from `executeRecaptcha`, the double-submit race, and `executeRecaptcha.test.ts` for the loader-cache retry (verified it fails against the pre-fix code before keeping it).

Not actioned, out of scope for this ticket: centralizing reCAPTCHA-unavailable handling across all five callers (`SendContactForm`/`SendReportInaccuracyForm` have no try/catch at all around `executeRecaptcha`) — those two files are untouched by this diff; extracting the submit handler's token+error logic out of `ui/` into `model/`/`hooks/` — `SignUpWithEmail`/`SignInWithEmail` keep the same shape, so this would be inconsistent with the rest of the slice family rather than a fix; deduping the `vi.mock` boilerplate between the two new test files — two call sites, not worth an abstraction yet.
