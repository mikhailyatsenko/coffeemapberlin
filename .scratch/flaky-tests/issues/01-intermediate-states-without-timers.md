# 01: Tests of intermediate states without timed mocks

**Status:** ready-for-agent

**What to build:** Some tests check a state that lasts only while a mocked request is in flight ("Reviews still loading", "upload in progress"). The mock holds that state for real time (`delay: 30`/`50` on a `MockedResponse`), and the test has to see it before the time runs out. On a busy machine the response comes first, the state is never seen, and the test fails, though the code is fine. Make the test decide when the mocked response arrives, so the intermediate state lasts until the test has checked it. Tests only; no product code changes.

**Background (2026-10-06):** three full `vitest run`s at once on an already loaded machine (load average ~16 on 8 cores) took ~245s each instead of ~21s. Timeouts are handled already (`2adee4e`: `testTimeout` 15s, `asyncUtilTimeout` 3s); after that these still failed now and then:

- `src/widgets/DetailedPlace/ui/DetailedPlace.test.tsx` › "waits for the next Place’s own Review and opens with its Rating" (`reviewsMock('b', { ownRating: 4, delay: 50 })`, then asserts no "change" button and no beans while the Reviews load)
- `src/pages/SuggestionReviewPage/ui/SuggestionReviewPage.test.tsx` › "shows each upload in progress, keeps Publish disabled until it settles" (`adminUploadMock({ path, delay: 50 })`, then `findByRole('progressbar', …)`)
- `src/pages/SuggestPlacePage/ui/SuggestPlacePage.test.tsx` › "uploads them one by one after the suggestion is created, each showing its own state" (`uploadMock({ delay: 30 })` ×2, then the progress bars)

Before the timeout fix, `AddTextReviewForm.test.tsx` (Photos: "counts the Review's existing Photos in the limit", "marks an unreadable file…") and `ResendConfirmEmail.test.tsx` failed too; they were 5s timeouts, check they no longer fail under the stress run below.

**How:**
- Find every test that asserts a state while a timed mock is pending: `delay: <n>` with n > 0 in `MockedResponse`s, and `setTimeout` in test files (at least `DetailedPlace`, `SuggestionReviewPage`, `SuggestPlacePage`, `RateBlock`, `OneTapRating`, `AddTextReviewForm`). A timed mock whose pending state no assertion depends on can stay.
- Replace the timer with a response the test releases: e.g. a small shared helper in `src/shared/config/tests/` that returns a deferred (`{ promise, release }`) and is used from the mock's `result`/a custom link, or Apollo's `MockLink` with a pending observable. Pick one approach and use it in all of them; keep it small.
- Each test: assert the intermediate state, release the response, assert the settled state. The asserted behaviour and test names stay the same.
- Don't use fake timers for this (they fight `userEvent` and Apollo's scheduling).

**Acceptance:**
- [ ] No test asserts a state that depends on a mock's real-time `delay` still running
- [ ] The listed tests keep their names and what they check; full suite green
- [ ] Stress check passes: three `npx vitest run` at once, twice in a row, with no failures (record durations and load average in the comment)
- [ ] Single-run duration of the suite not noticeably worse than ~21s
