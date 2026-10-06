Status: ready-for-agent

# Loader split: full screen for a page's first load, a spinner in place for everything else (item 12 of the ui-ux-audit map)

Source: [Rank every improvement decided on this map](../ui-ux-audit/issues/09-rank-candidates.md), Tier 2 item 12. Decision drawn from [Loading, empty states and microcopy](../ui-ux-audit/issues/08-loading-empty-states-microcopy.md) (decision 1; `ImgWithLoader` is already a scoped inline spinner and stays as it is), plus the choices confirmed with the user while writing this spec: after Apply in the Filters modal the loading shows on the funnel button, and the test seams in Testing Decisions. Frontend only.

## Problem Statement

The site has one loading treatment, the full-screen `Loader`: a fixed overlay that dims the whole viewport, header included, with the coffee-pour animation in the middle. Thirteen files render it, fifteen renders in all (the table below splits MainPage's one render by cause), and they mean two very different things.

Some are a page's first load: the map before any Place has arrived, the reset-password link being checked, the confirm-email link being processed, an admin's suggestion being fetched. There is nothing to show yet, so covering the page is honest.

Most are small actions on a page that is already there: sending the Contact form, sending a report about an inaccurate Place, signing in or up, saving profile details or a new password, uploading or deleting an avatar, finishing a Google sign-in, re-applying Filters. Each of them blacks out the whole site for a second or two, so a visitor who pressed one button loses sight of the form they just filled, the map they were looking at, and the header. Several make it worse:

- **Avatar upload and delete show two overlays at once**: the Account settings feature and the avatar form inside it both render the `Loader` for the same `isUploading`.
- **Saving profile details or a password** blacks out both settings forms, not just the one that was saved.
- **The header's avatar menu** renders the full-screen `Loader` every time the session is re-checked while a User is signed in (`isAuthLoading`), which happens after sign-in, after a profile save, after an avatar change. So a single action can trigger the overlay twice in a row, once from the form and once from the header.
- **Contact and Report inaccuracy** show the overlay only while the mutation runs, not while the reCAPTCHA token is being minted before it, so the button stays live and silent for the first part of the wait.
- **Finishing a Google sign-in** swaps the whole auth modal for the full-screen overlay.

Meanwhile the site already has the light treatment it needs: `RegularButton` takes `loading` and shows its own spinner with `aria-busy`, and Suggest a Place and the admin's Publish form use it for their submits. The rest of the site just doesn't. The one exception is the Contact form, whose submit is a `WhiteButton` (its only user), which has no busy state at all.

### Every place that renders the full-screen Loader today

| # | Where | When it shows | Kind | Target |
|---|---|---|---|---|
| 1 | MainPage | the first page of Places is loading | heavy | keep the full-screen `Loader` |
| 2 | MainPage | Filters' results load on arrival (MainPage opens with Filters already set, e.g. a Shortlist's "See all on the map") | heavy | keep the full-screen `Loader` |
| 3 | MainPage | Filters' results load after Apply in the Filters modal | light | spinner on the funnel button; map and list stay as they are until the results arrive |
| 4 | ResetPasswordPage | logging out the current session before the reset | heavy | keep |
| 5 | ResetPasswordPage | validating the reset link | heavy | keep |
| 6 | ResetPasswordPage | default state before either of the above starts | heavy | keep |
| 7 | ConfirmEmailPage | confirming the email, then redirecting | heavy | keep |
| 8 | SuggestionReviewPage | the suggestion is loading | heavy | keep |
| 9 | Contact form | sending | light | "Send message" button busy for the whole submit (reCAPTCHA + mutation) |
| 10 | Report inaccuracy form | sending | light | "Send report" button `loading` for the whole submit (reCAPTCHA + mutation) |
| 11 | Sign in with email | signing in, re-checking the session | light | "Sign in" button `loading` |
| 12 | Sign up with email | creating the account (reCAPTCHA + mutation) | light | "Sign up" button `loading` |
| 13 | Account settings | saving profile details or a password | light | only the saved form's "Save changes" button `loading`, for the whole save including the session re-check |
| 14 | Account settings' avatar feature | uploading or deleting an avatar | light | removed; #15 covers it |
| 15 | Avatar form | uploading or deleting an avatar | light | spinner over the avatar picture, avatar buttons disabled |
| 16 | Header avatar menu | session re-check while signed in | light | removed, no indicator; the action that caused the re-check shows its own |
| 17 | Auth modal | finishing a Google sign-in | light | the modal stays; its content becomes a centred `Spinner` |

NeighborhoodPage is not in the table: its first load already shows a page-level `Spinner`, not the `Loader`.

## Solution

Keep the full-screen `Loader` for exactly one situation: a page's first load, when the page has nothing to show yet (rows 1, 2, 4–8). Everywhere a visitor acts on a page that is already there, show the wait where the action happened and leave the rest of the page visible and usable: the submit button turns busy, the avatar shows a spinner over itself, the funnel button shows a spinner while Filters' results load, the auth modal shows a spinner inside itself. Fix the double overlays on the way.

No new component: the light treatments are `RegularButton`'s existing `loading`, the existing `Spinner`, and the same `loading` added to `WhiteButton` for the Contact form.

## User Stories

1. As a visitor sending the Contact form, I want the "Send message" button to show it is working while my message is sent, so that I know my click registered without losing sight of the page.
2. As a visitor sending the Contact form, I want the button busy from the moment I click until the result shows, including the reCAPTCHA check, so that there is no silent gap where I might click again.
3. As a visitor sending the Contact form, I want to be unable to send it twice while it is in flight, so that I don't send duplicates.
4. As a visitor reporting an inaccurate Place, I want the "Send report" button to show it is working for the whole submit, so that I know the report is on its way.
5. As a visitor reporting an inaccurate Place, I want the Place page to stay visible while the report sends, so that I don't lose my place.
6. As a visitor signing in with email, I want the "Sign in" button to show it is working, so that I know my credentials are being checked.
7. As a visitor signing in, I want the auth modal to stay in view until sign-in finishes, so that an error message appears where I was looking.
8. As a visitor signing up, I want the "Sign up" button to show it is working while the account is created, so that I don't click it again.
9. As a visitor finishing a Google sign-in, I want a spinner inside the auth modal rather than a blacked-out screen, so that I can tell the sign-in is finishing in the same place I started it.
10. As a visitor whose Google sign-in fails, I want the modal's content and the error to come back in the same modal, so that I can try again or choose another way in.
11. As a signed-in User saving my profile details, I want only that form's "Save changes" button to show it is working, so that the password form next to it stays untouched.
12. As a signed-in User saving a new password, I want only the password form's button to show it is working, so that I can see which save is in progress.
13. As a signed-in User saving settings, I want the button busy until my profile is re-read from the server, so that the form doesn't look finished before the header and the form show the new details.
14. As a signed-in User uploading an avatar, I want a spinner over my avatar picture while it uploads, so that I see the progress where the result will appear.
15. As a signed-in User uploading or deleting an avatar, I want the avatar buttons disabled until it finishes, so that I can't start a second upload or delete midway.
16. As a signed-in User uploading an avatar, I want exactly one loading indicator, not two overlays stacked, so that the page doesn't flicker.
17. As a signed-in User, I want the header not to black out the screen whenever my session is re-checked in the background, so that a single action doesn't flash the overlay twice.
18. As a visitor applying Filters from the Filters modal, I want the map and the list to stay usable while the results load, so that I'm not blocked from looking at the map for a second.
19. As a visitor applying Filters, I want a spinner on the funnel button while the results load, so that I know new results are coming.
20. As a visitor applying Filters a second time, I want the previous results to stay in place until the new ones arrive, so that the map doesn't jump to every Place in between.
21. As a screen-reader user applying Filters, I want the funnel button to say it is loading results, so that I get the same cue sighted visitors get.
22. As a visitor opening the map, I want the full-screen loading animation while the first Places load, so that I don't see an empty map and think it's broken.
23. As a visitor arriving on the map from a Shortlist's "See all on the map", I want the full-screen loading animation until the filtered Places arrive, so that I never see the unfiltered map flash first.
24. As a visitor opening a password-reset link, I want the full-screen loading state while the link is checked, so that I don't see a form I can't use yet.
25. As a visitor opening an email-confirmation link, I want the full-screen loading state until I'm redirected, so that the page doesn't look empty.
26. As an admin opening a suggestion's review link, I want the full-screen loading state while the suggestion loads, so that I don't act on a half-loaded page.
27. As a screen-reader user, I want the full-screen loading state announced as loading, so that I know the page is not empty but still loading.
28. As a screen-reader user, I want every busy button to report itself as busy, so that I know my action is in progress.
29. As a visitor setting a new password from a reset link, I want the "Reset password" button to show it is working, the same way every other form's submit does, so that the site behaves consistently.
30. As a visitor suggesting a Place, I want the submit to keep behaving exactly as it does today, so that the recently finished Suggest a Place work isn't undone.
31. As a visitor using the Filters modal, I want the live result count inside it to keep working as it does today, so that the recently finished Filters modal work isn't undone.

## Implementation Decisions

### Heavy: the full-screen Loader stays, with an accessible name

- The full-screen `Loader` keeps its look (fixed, dimmed, coffee-pour animation) and becomes reachable by assistive technology and by tests: it gets `role="status"` and the accessible name "Loading". The decorative animation stays hidden from assistive technology.
- It stays at rows 1, 2, 4–8 and nowhere else. `LoaderJustIcon` is unused today and stays as it is.

### MainPage: first load vs. Apply

- MainPage shows the full-screen `Loader` while the first page of Places loads, and while Filters' results load **on arrival** (the apply that runs once on mount when MainPage opens with Filters set). It does not show it while Filters' results load after Apply in the Filters modal.
- MainPage tells the two apart by where the apply came from, not by whether earlier results exist: the first Apply from the modal also starts with no filtered results, and it is still light. Keep the arrival/modal distinction inside MainPage's own logic (its `model/` or `hooks/`), not as a new store flag.
- After Apply in the modal, the map and the list keep showing what they showed before until the new results arrive. This is already how the filtered results behave on a re-apply (`filteredPlaces` is not cleared on Apply), so nothing changes there; only the overlay goes. On the very first Apply that means every Place stays on the map until the filtered ones arrive. The live count in the modal has already told the visitor how many to expect.
- `FloatingFilterButton` gains a `loading` prop. While it is true, a small `Spinner` replaces the active-filter count badge, the button gets `aria-busy`, and its accessible name becomes "Open filters, loading results". It stays clickable. When loading ends, the badge returns with the new count. MainPage passes Filters' loading-after-Apply into it. The existing `activeFilterCount` contract does not change.

### Light: busy buttons for form submits

- The light treatment for a form submit is `RegularButton`'s existing `loading` prop (spinner inside the button, disabled, `aria-busy`), as Suggest a Place and the Publish form already use it. No new button API.
- The button is busy for **the whole action as the visitor experiences it**, from click until the result shows: including minting the reCAPTCHA token before the mutation and re-checking the session after it. The mutation's own `loading` flag is not enough wherever the handler does work before or after it.
- **Contact and Report inaccuracy**: their submit handlers in the features already await the whole action, so the form entities read react-hook-form's `isSubmitting` and pass it to the submit button's `loading`. The features stop rendering the `Loader`. The success and error result screens that replace the form stay as they are.
- **`WhiteButton` gains `loading`**, mirroring `RegularButton`'s: while true the button is disabled, has `aria-busy`, and shows a small spinner before its label, styled to read on the white button over Contact's photo. The Contact form is its only user, so nothing else changes.
- **Sign in / Sign up with email**: they already keep their own `isLoading` across the whole handler; pass it to the submit button's `loading` and drop the `Loader`. Sign-in still closes the modal only after the session check, as today.
- **Account settings**: each form's "Save changes" button gets `loading` from its own form's `isSubmitting`. The submit handlers already await the session re-check after the mutation, so this covers it. The feature drops the shared `Loader`. The two forms no longer share a busy state.
- **Reset password** (the form on ResetPasswordPage, not a `Loader` call site): its "Reset password" button gets `loading` from the reset mutation's loading, for consistency with every other submit. The page's three heavy states stay as they are.

### Light: the avatar

- Only the avatar form (the entity) renders the upload/delete wait; the avatar feature stops rendering its own `Loader`, which ends the double overlay.
- While `isUploading`, the avatar form shows a `Spinner` centred over the avatar picture, and its "Upload new picture" and "Delete" buttons are disabled. The avatar picture stays visible under the spinner so the User sees where the result will appear.
- The avatar form's props don't change: it already receives `isUploading`.

### Light: the header and the auth modal

- The header's avatar menu stops rendering the `Loader` on `isAuthLoading`, and shows no indicator of its own: the session re-check always follows an action whose own busy state already covers it (rows 11, 13, 15), and the header keeps showing the current User until the re-check returns.
- The auth modal, while a Google sign-in finishes, keeps the modal open and replaces its content with a centred `Spinner` (with an accessible "Signing in" status). When it finishes it closes as today; when it fails, the content and the error come back in the same modal.

### What stays as it is

- Suggest a Place's submit (`loading` already covers the session check, photo preparation and the submit) and its thank-you screen's "Uploading your photos…".
- The Filters modal's live result count and its own loading treatment.
- `FilterPanel`'s Features loading spinner, NeighborhoodPage's first-load `Spinner`, `ImgWithLoader`.

## Testing Decisions

- Tests check what a visitor or a screen reader can observe, not which component renders what: the full-screen state is found by its `status` role and "Loading" name, a busy button by `aria-busy` (or its disabled state) and its name, the funnel's state by its accessible name. No snapshot tests, no class-name assertions.
- **MainPage** (extend the existing `MainPage.test.tsx`, which mocks the map and the list and drives Filters through the store and `MockedProvider`):
  - the full-screen loading state shows while the first Places load and is gone once they arrive;
  - when MainPage opens with Filters already set, the full-screen loading state shows until the filtered Places arrive, and the unfiltered Places are never listed in between (alongside the existing "shows the filtered Places at once…" case);
  - applying Filters from the modal on a loaded map does not show the full-screen loading state; the funnel button's name says it is loading results until the filtered Places arrive, then shows the count again;
  - the Places shown before Apply stay listed until the filtered ones arrive.
- **Sign in / Sign up** (extend `SignInWithEmail.test.tsx` and `SignUpWithEmail.test.tsx`): with a mutation mock that hasn't resolved yet, the submit button is busy and no full-screen loading state is present; once it resolves, the button is no longer busy. For sign-up, the button is already busy while the reCAPTCHA token is being minted (the reCAPTCHA helper is mocked to a pending promise).
- **Contact and Report inaccuracy** (new tests at the feature level, `SendContactForm` and `SendReportInaccuracyForm`, with `MockedProvider` and the reCAPTCHA helper mocked): the submit button is busy from the click, already during the reCAPTCHA step, until the result screen replaces the form; no full-screen loading state at any point.
- **Account settings** (new test at the feature level, with `MockedProvider` and the auth store seeded with a User): saving profile details makes only that form's "Save changes" busy, not the password form's; the button stays busy until the session re-check resolves.
- **Auth modal** (new test at the widget level): while a Google sign-in finishes, the modal is still in the document with a "Signing in" status inside it, and no full-screen loading state. Mock the `useWithGoogle` hook's loading state rather than driving Google's popup.
- **Verified by hand, not by tests** (no existing tests and little logic): the avatar spinner and disabled buttons on upload and delete, and the header no longer flashing an overlay after a profile save. Check them on desktop and on mobile.
- Existing tests must stay green, in particular Suggest a Place's and the Filters panel's, as the regression check for the two recently finished specs.

## Out of Scope

- Changing how the full-screen `Loader` looks, or what ResetPasswordPage shows under it in its logging-out and validating states.
- Loading states that never used the `Loader`: forms with no busy state today besides the reset-password button (e.g. request password reset, resend confirmation) are not reworked here.
- NeighborhoodPage's and PlacePage's first-load treatments.
- `ImgWithLoader` and per-image loading.
- Skeleton screens or any new loading pattern beyond `RegularButton`'s `loading` and `Spinner`.
- Merging `WhiteButton` into `RegularButton`, or re-styling `Spinner` (its hard-coded colors are a style-tokens concern, see `.scratch/style-tokens/problem.md`).
- What Apollo's `resetStore` refetches after sign-in, and whether that refetch shows anything.

## Further Notes

- The audit's decision named NeighborhoodPage's first fetch as one of the heavy loads to keep full-screen. Since then NeighborhoodPage moved to its own page-level `Spinner` (the Neighborhood shortlists work), so it no longer uses the `Loader` and this spec leaves it alone.
- The audit counted about 15 call sites; there are 15 renders across 13 files (ResetPasswordPage renders it in three states), 17 rows once MainPage's single render is split by cause. The table in the Problem Statement is the full list as of this spec.
- Rows 9–13 and 15 can ship as one ticket per form family or together; rows 1–3 (MainPage and the funnel button) and row 17 (auth modal) are each self-contained.
