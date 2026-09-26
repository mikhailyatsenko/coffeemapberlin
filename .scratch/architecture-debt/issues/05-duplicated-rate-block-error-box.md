# 05: The "Been here? Rate it" block repeats its error box style

Status: resolved

- **Rule:** the Duplicated Code smell (code-review baseline); no documented rule in `docs/agents/architecture.md` covers it.
- **Files:** the same `.error` box (`--error` text and border, `--error-light` background, 4px radius) is in
  - `src/features/RateNow/ui/OneTapRating.module.scss`
  - `src/features/RateNow/components/YourMarks/ui/YourMarks.module.scss`
  - `src/features/RateNow/components/CharacteristicQuestions/ui/CharacteristicQuestions.module.scss`
  - `src/features/RateNow/components/AddPhotos/ui/AddPhotos.module.scss`
- **Why it wasn't fixed in place:** one mixin in `shared/styles` (or a small `shared/ui` error line) means editing `shared` and three sub-components the change doesn't touch; that is past the blast radius of `.scratch/photo-without-review-text/issues/03-photo-upload-failures-in-rate-block.md`, which only adds the `AddPhotos` copy.

## Comments

- Fixed within the slice after code review: the four copies became `features/RateNow/components/ErrorAlert`. The note was past-the-blast-radius only on a wrong reading; all four files are in `features/RateNow`, a slice the change already edits, and no public API changes.
