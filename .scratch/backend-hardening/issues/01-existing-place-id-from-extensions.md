# 01: Read the existing Place id from `extensions.existingPlaceId`

Status: ready-for-agent
Blocked by: backend coffemap-server `.scratch/backend-hardening/issues/01-error-contract-foundation.md` (deployed)
Priority: low

## Problem

On the Place suggestion review page, a `DUPLICATE_GOOGLE_PLACE_ID` error links the admin to the Place that already has that Google id. The id is regex-parsed out of the error message, which breaks the moment the message wording changes. The backend now sends it as `extensions.existingPlaceId` (error contract, backend ticket 01).

## Current behaviour

`src/pages/SuggestionReviewPage/lib/reviewErrors.ts`: `existingPlaceIdOf` takes the last 24-hex word of `graphQLErrors[0].message` (comment: "The server can only pass it in the message").

## Expected behaviour

- `existingPlaceIdOf` reads `graphQLErrors[0].extensions.existingPlaceId` (a string) and returns `null` when it is missing or not a string. The message regex and its comment go.
- The backend keeps the message text, so no coordination is needed beyond the backend being deployed first.

## Acceptance criteria

- [ ] `existingPlaceIdOf` no longer parses the message.
- [ ] Test: an `ApolloError` with `extensions: { code: 'DUPLICATE_GOOGLE_PLACE_ID', existingPlaceId: '<id>' }` and a message without the id → returns `<id>`; without the extension → `null`.
- [ ] Existing SuggestionReviewPage tests updated to the new error shape and passing; lint and type-check pass.
