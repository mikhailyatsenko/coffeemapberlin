# Anyone can suggest a missing Place; the admin approves in one click

Status: needs-triage

## Problem

Places can only be added by hand. Visitors who know a Place that isn't on the map have no way to add it, and every contribution counts at today's traffic.

## Expected behaviour

- A User or Guest can submit a Place suggestion through one convenient form: all the fields a Place has, plus up to 10 photos.
- A Place suggestion is not shown on the map until approved.
- The admin approves in one click, e.g. from a link in an email (MailerSend is already used for admin emails; there are no admin roles or admin UI today).

## Open questions (for the spec)

- Which fields are required; can the form prefill from Google Places without a paid call?
- Guest spam protection: Guest identity (ADR 0001) is enough, or extra limits?
- Reject path, duplicates of existing Places, and whether the suggester is told the outcome.
