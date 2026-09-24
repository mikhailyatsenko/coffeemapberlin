# 03: Inline "Been here? Rate it" block

**What to build:** the inline block from [the spec](../spec.md) on the Place page, as its own full-width section between the header and the reviews / Place info layout. On mobile it comes after the hero image, name and Average rating and before Place info. With no Rating: heading "Been here? Rate it" and the one-tap Rating. After a save: "Thanks!" and "Your rating: N · change". "change" shows the beans again with the current Rating selected. The thank-you is one container, so Visits can later add its progress line there. A returning visitor with a Rating sees "Your rating: N · change" straight away. The block is exported from the RateNow feature. For now the header's "Rate place" button and its modal stay.

**Blocked by:** 02 (One-tap Rating as its own component).

**Status:** ready-for-agent

- [ ] The block renders on the Place page in the position above, on desktop and on a phone-width viewport
- [ ] Rating from the block shows "Thanks!" and "Your rating: N · change" at once; a failure shows the message and returns to the beans
- [ ] "change" reopens the beans with the current Rating selected; saving a new one sends `rating_saved` with `is_change: true`
- [ ] With an existing own Rating the block opens in the "Your rating: N · change" state, without "Thanks!"
- [ ] `rate_block_view` fires once per page view when the block enters the viewport, with `has_rating` (tested with a mocked `IntersectionObserver`)
- [ ] The confirmation and errors are announced (status / alert roles)
