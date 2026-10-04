# 01: Validate Suggest a Place live, with the submit disabled until valid

**What to build:** Suggest a Place validates the way Contact and the Auth forms do. Fields validate as the visitor types, errors show on the field being edited, and "Suggest this Place" stays disabled until the form is valid: a name and an address are given, everything is within the length limits, and a Guest's email, if typed, is a real one. The button's loading state (session check still running, photos still preparing, submit in flight) keeps working as before.

**Blocked by:** None (can start immediately)

**Status:** resolved

- [x] On an empty form "Suggest this Place" is disabled; it enables once name and address are filled, with every optional field (description, Instagram, photos, Guest email) left empty.
- [x] Clearing a typed name shows "Name is required" without any submit click; the same holds for address.
- [x] A whitespace-only name counts as missing: the error shows and the button stays disabled.
- [x] Pasting an over-limit name or description shows that field's length error at once, and the button stays disabled.
- [x] A Guest who types an invalid email sees "Enter a valid email" at once and the button stays disabled; clearing the email enables it again. A User, who has no email field, is never blocked by it.
- [x] Nothing is sent while the button is disabled.
- [x] An invalid form shows a plain disabled button, with no spinner; the spinner still shows while the session check runs, photos prepare or the submit is in flight.
- [x] After a failed submit (the daily limit or any other error) the values are kept and the button is enabled again.
- [x] "Is it one of these?" still shows as the visitor types and never blocks sending.
- [x] The validation rules themselves (required fields, length caps, email format) and the submitted input are unchanged; no backend change.
- [x] The `validation` tests in the Suggest a Place page test are rewritten for this contract: they assert on the button's disabled/enabled state and on errors that appear while typing, with no clicks on an invalid submit. The "Is it one of these?", session-check, Guest-email, submitting and photos tests still pass.

Source: [Suggest a Place polish spec](../spec.md), Implementation Decisions "Item 11" and the validation part of Testing Decisions.
