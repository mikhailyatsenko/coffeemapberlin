# Spec: One-tap contributions on the Place page

Status: ready-for-agent
Map: [Engagement: what to build so people interact more with the site](../engagement/map.md). Decision: [What one-tap contributions should the Place page offer?](../engagement/issues/03-micro-contributions.md). Rank: #1 in [Rank the candidates into the final list](../engagement/issues/07-rank-candidates.md).

## Problem Statement

People land on a Place page from search, have often been to that Place, and almost never leave anything behind: about 1–2 Ratings a month from ~30–40 visitors a day. The way to a Rating is short (three taps) but hidden. It hides behind a "Rate place" button that opens a modal. On mobile it sits below the hero image. The modal offers all eight Characteristics as a grid of chips, with no hint which ones are worth an answer. A Rating waits for a server round trip before anything happens, and the first tap from a Guest also waits for reCAPTCHA. Nothing on the page asks a question that fits a visitor who has just said "yes, I've been here". And nobody can tell whether any of it works: GA sees only the click on "Rate place", not whether a Rating was saved or failed.

## Solution

An inline "Been here? Rate it" block right under the Place header, visible without opening anything. It replaces the "Rate place" modal.

1. Five beans. A tap saves the Rating at once and the block answers straight away: "Thanks!" and "Your rating: 4 · change".
2. Only once a Rating exists, the block asks short Yes / Skip questions, up to three at a time, about the five opinion Characteristics: delicious filter coffee, pleasant atmosphere, friendly staff, affordable prices, yummy eats. "More questions?" reveals the rest.
3. When the questions run out, a link scrolls to the Review text form: "Add a few words or a photo".

Every answer goes into the visitor's one Review for the Place. Guests contribute exactly as Users do: the first tap runs the invisible reCAPTCHA and creates the Guest identity (ADR 0001). A failure rolls the answer back and says why. Unlike Review text, no "Create account" modal follows a one-tap answer.

The feature ships with GA events for every step, a baseline and a success threshold (see Further Notes), so that after eight weeks it is clear whether it worked.

## User Stories

1. As a Guest who arrived from search, I want to see "Been here? Rate it" right under the Place's name and Average rating, so that I notice I can rate without hunting for a button.
2. As a mobile visitor, I want the block to come right after the Place's name and Average rating and before Place info, so that I reach it with little scrolling.
3. As a visitor who has been to the Place, I want to rate it with one tap on a bean, so that contributing takes a second.
4. As a visitor who has not been there, I want the block to ask me nothing beyond "Been here?", so that I'm not asked opinions I don't have.
5. As a Guest, I want my first tap to work without signing up or solving a visible captcha, so that there is no barrier to a Rating.
6. As a visitor, I want the block to confirm my Rating the moment I tap, so that I know it counted even while the server is still saving it.
7. As a visitor, I want to see "Your rating: 4 · change" after rating, so that I know what I gave and can correct it.
8. As a visitor, I want "change" to show the beans again with my current Rating selected, so that I can pick a different one.
9. As a visitor whose Rating failed to save, I want my Rating removed from the block again and a clear message, so that I don't believe it was saved.
10. As a Guest whose reCAPTCHA is blocked by an ad blocker, I want the message to say so and suggest allowing it or signing in, so that I know how to fix it.
11. As a visitor on a flaky connection, I want a failed save to say "check your connection and try again", so that I can simply retry.
12. As a visitor who just rated, I want a few quick Yes / Skip questions such as "Friendly staff?", so that I can add more with no typing.
13. As a visitor, I want at most three questions at a time, so that the block doesn't look like a survey.
14. As a visitor who answered the first questions, I want "More questions?" to reveal the rest, so that I decide how much I give.
15. As a visitor, I want "Yes" to mark that Characteristic in my Review at once, so that my opinion counts.
16. As a visitor, I want "Skip" to just move on and store nothing, so that I'm never forced to judge something I didn't notice.
17. As a visitor, I want questions I've already answered "Yes" to never come back, so that I'm not asked twice.
18. As a visitor, I want a question I skipped not to come back while I'm on the page, so that the block doesn't nag.
19. As a visitor whose "Yes" failed to save, I want that question back with a message, so that I can try again.
20. As a visitor, I want to see which Characteristics I've marked for this Place and remove one, so that I can take back a mistaken "Yes" now that the chip grid is gone.
21. As a visitor who has answered everything, I want a link "Add a few words or a photo" that scrolls to the Review text form, so that I can go further if I want.
22. As a visitor who already has Review text for this Place, I want no such link, so that I'm not asked to write what I already wrote.
23. As a returning visitor with a Rating already, I want the block to show "Your rating: 4 · change" and the questions I haven't answered, so that I can pick up where I left off.
24. As a Guest, I want no "Create account" modal after a Rating or a Yes, so that one-tap stays one tap.
25. As a Guest who writes Review text, I want the "Create account" offer to stay where it is today, so that I can still keep my Reviews through an account.
26. As a keyboard user, I want to reach the beans and the Yes / Skip buttons with Tab and choose with Enter or Space, so that I can contribute without a mouse.
27. As a screen-reader user, I want the confirmation and errors announced, so that I know the result of a tap.
28. As a touch user, I want the selected bean to stay visibly selected, so that I can see what I tapped.
29. As a visitor, I want the "Rate place" button in the header to take me to the block, so that the old entry point still works.
30. As a visitor on a Place with no Reviews, I want "Be first to write one" to take me to the Review text form, so that the link does what it says.
31. As a visitor, I want the Place's Average rating and Characteristic counts to reflect my answer after it saves, so that the page is consistent.
32. As a User, I want my Rating and Characteristics to land in my one Review for the Place exactly as they did through the modal, so that My Reviews and my Review card show them.
33. As a Guest who later signs in, I want my one-tap Rating and Characteristics claimed with my other Reviews, so that nothing is lost.
34. As the owner, I want a GA event when the block is seen, when a Rating is saved (first or changed), when a Characteristic is answered Yes or Skip, when a contribution fails and why, and when the Review text link is used, so that I can see the funnel and where it breaks.
35. As the owner, I want no GA events sent from development, so that my own testing doesn't pollute the numbers.
36. As the owner, I want a written baseline and a success threshold for eight weeks after release, so that I can decide whether to keep going or move to the next feature.
37. As a developer building Shortlists or the Quiz next, I want the one-tap Rating (beans, save, Guest identity, rollback, messages) available as its own component from this feature, so that a Place card can use it without the questions.
38. As a developer building Visits next, I want the thank-you in the block to be a single spot other content can join, so that "That's 4 of 41 in Mitte" can be added without restructuring the block.

## Implementation Decisions

**Modules**

- The `RateNow` feature is reshaped from a button + modal into the inline block. Its public API exports two components:
  - the **block** ("Been here? Rate it" + questions + thank-you + Review text link), used by the Place page;
  - the **one-tap Rating** (beans + save + Guest identity + optimistic state + rollback + messages), used inside the block and later by Shortlist and Quiz cards. It takes the Place id and the person's current Rating, and reports a saved Rating to its caller. It must not depend on the Place page's queries being loaded.
- The `RatePlace` entity's `RatePlaceWidget` and `ToggleCharacteristic` chip grid stop being used by `RateNow`. Remove whatever has no other consumer; keep the shared `RatingWidget` (already a keyboard-accessible radio group) as the beans.
- The `DetailedPlace` widget renders the block as its own full-width section between the header and the reviews/Place info layout, so on mobile it comes after the hero image, name and Average rating and before Place info. The header's "Rate place" action becomes a plain button that scrolls to the block and focuses its beans. When the person has a Rating it reads "Your rating: 4". The modal state in `DetailedPlace` goes away.
- `ReviewsBlock` / `ReviewList`: "Be first to write one" keeps focusing the Review text form. It must work whenever the form is shown.
- A new `trackEvent(name, params)` in `shared/lib` wraps `window.gtag` and drops events outside production. It is the single seam for analytics. The existing `rate_place_click` and `add_to_favorites_click` calls move onto it.

**Data and API** (no backend change, no model change, no new domain term)

- Rating: the existing `addRating` mutation with Guest credentials from `ensureGuestIdentity` when there is no User. The block shows the Rating optimistically. It refetches the Place and Place reviews in the background and does not wait for them. On error it reverts to the previous Rating (or none) and shows the message.
- Characteristic "Yes": the existing `toggleCharacteristic` through `useToggleCharacteristic`, which already applies an optimistic cache update and drops it on failure. "Yes" is only sent for a Characteristic that is not already marked, so it never un-marks by accident.
- Removing a mark from the "Your marks" row is the same toggle on a marked Characteristic.
- "Skip" sends nothing and is remembered only in component state for the current page view.
- Deleting a Rating is no longer offered in the block. Users keep deleting through their own Review card, as today.
- Which Characteristics are marked comes from the Place's Characteristic counts (`pressed`). The current Rating and whether Review text exists come from the own Review in Place reviews.

**Block states**

1. No Rating: heading "Been here? Rate it", beans. No questions.
2. Saving or saved Rating: "Thanks!" (on the save just made) and "Your rating: N · change". The thank-you is one container, so Visits can later add its progress line there.
3. Questions, shown only once a Rating exists. The pool is the five opinion Characteristics, in the fixed order delicious filter coffee, pleasant atmosphere, yummy eats, friendly staff, affordable prices, minus those already marked and those skipped in this page view. Up to three are shown at once, each with Yes / Skip. When the visible ones are answered and more remain, "More questions?" shows the next batch. Free Wi-Fi, outdoor seating and pet friendly are never asked here: Amenities cover them.
4. "Your marks": chips of every Characteristic the person has marked (all eight, including those not asked here), each removable.
5. Questions exhausted and no Review text: "Add a few words or a photo", which scrolls to the Review text form and focuses it. With Review text: nothing further.
6. Error: an alert under the part that failed, with the text from the existing save-error mapping (reCAPTCHA blocked vs. network). It clears on the next successful action.

**Guest flow:** unchanged from ADR 0001. The first one-tap action calls `ensureGuestIdentity` (invisible reCAPTCHA v3), and later ones reuse the identity. No "Create account" modal after a one-tap action. The existing modal after Review text stays.

**Analytics:** all events go through `trackEvent` and carry `place_id` and `actor` (`guest` or `user`).

| Event | When | Extra params |
|-------|------|--------------|
| `rate_block_view` | block first enters the viewport, once per page view | `has_rating` |
| `rating_saved` | the server confirms a Rating | `rating`, `is_change` |
| `characteristic_answered` | Yes confirmed by the server, or Skip tapped | `characteristic`, `answer` (`yes` / `skip`) |
| `characteristic_removed` | a mark removed from "Your marks" | `characteristic` |
| `contribution_failed` | a Rating or Yes fails | `kind` (`rating` / `characteristic`), `reason` (`recaptcha` / `network`) |
| `review_text_link_click` | "Add a few words or a photo" tapped | none |
| `rate_place_click` | the header button tapped (kept for continuity) | `item_id`, `item_name`, `category`: the params it carried before, so older GA reports still match |

## Testing Decisions

- Good tests drive the block the way a person does and assert what the person sees and what reaches the network. They don't assert component state, hooks or cache internals.
- **Main seam: the block.** Render it with Apollo's `MockedProvider` and a harness that reads the Place from the cache, as `RateNow.test.tsx` does today (that file is rewritten, not kept alongside). Mock `ensureGuestIdentity` and `trackEvent`. Cover:
  - a tap on a bean sends `addRating` with the Guest credentials and immediately shows "Thanks!" and "Your rating: N";
  - a failed Rating reverts, shows the reCAPTCHA or network message, and sends `contribution_failed` with the right reason;
  - no questions before a Rating; three after; "More questions?" reveals the rest; Wi-Fi, outdoor seating and pet friendly are never asked;
  - Yes sends `toggleCharacteristic`, and the question doesn't return; Skip sends nothing, and the question doesn't return; an already marked Characteristic is not asked;
  - a failed Yes brings the question back with a message;
  - removing a mark from "Your marks" sends the toggle;
  - once questions run out, the Review text link appears only when there is no Review text;
  - `change` shows the beans with the current Rating selected, and saving sends `rating_saved` with `is_change: true`;
  - each event in the table fires once with the documented params, and `rate_block_view` only when the viewport check reports the block visible (mock `IntersectionObserver`).
- **One-tap Rating on its own:** a short test that it saves and rolls back with no Place query in the cache, which proves Shortlist and Quiz cards can use it.
- **`trackEvent`:** a unit test that it calls `gtag` in production and does nothing otherwise.
- **Not automated:** the scroll from the header "Rate place" button and from "Be first to write one", and the mobile position of the block. Check them by hand in the browser on a phone-width viewport. `ReviewsBlock.test.tsx` stays green.

## Out of Scope

- Photo without Review text (ranked #4 on its own). Here the link only points to the existing Review text form.
- Confirming or disputing Amenities ("Google says Wi-Fi, right?"): that's an Inaccuracy report, not a Review.
- Three-valued Characteristics (a stored "no").
- Contributions on the Neighborhood page or on cards: Shortlists and Quiz reuse the one-tap Rating later.
- The Visit progress line in the thank-you (Visits).
- Any backend change.
- Removing the "Create account" modal after Review text.

## Further Notes

**How success is measured** (the map's open question, decided here).

- **Ground truth is the database, not GA.** GA misses visitors with ad blockers, which is the same group whose reCAPTCHA may fail. Count Reviews by Users and Guests with a Rating created per month, and Reviews that gained a Characteristic, with a read-only query against production.
- **Baseline:** that query over the six months before release. The research put it at ~1–2 Ratings a month (~0.1–0.2% of visits).
- **Check date:** eight weeks after release. At this traffic weekly numbers are noise, so judge the eight-week total only.
- **It works** when, over those eight weeks:
  - Ratings are at least 3× the baseline monthly rate (≈ 5 or more a month, ≈ 0.5% of Place page visits);
  - at least one Characteristic "Yes" arrives for every two Ratings;
  - `contribution_failed` is under 10% of Rating attempts (`rating_saved` + failed ratings).
- **Where it breaks, from the GA funnel:**
  - `rate_block_view` → `rating_saved` below ~1%: the block is seen but not used; the wording or placement is the issue;
  - many failures with `reason: recaptcha`: the Guest path is the issue, and a sign-in prompt in the error matters more;
  - Ratings up but Characteristics flat: the questions are the issue.
- Below 2× the baseline after eight weeks: stop and rethink before building Shortlists on top of the same one-tap Rating.

**Dependencies:** the Shortlists (#2) and Quiz (#5) reuse the one-tap Rating; Visits (#3) adds a line to the thank-you container; Photo without Review text (#4) adds "Add a photo" to the block after a Rating. None of them is built here, but the two public components and the single thank-you container are shaped for them.

**Rough cost:** ~5–7 days, frontend only (from the decision): inline block and question queue, optimistic/rollback/thank-you states, one-tap Rating as its own component, `trackEvent` and events, rewiring the header button, tests.
