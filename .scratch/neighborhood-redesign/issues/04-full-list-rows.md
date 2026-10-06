# 04: The full list as rows with Rate it

**What to build:** "All N Places" becomes a dense list of rows where locals rate: a small photo, the name, the Average rating or "No ratings yet — be the first", the street, Favorite, and the one-tap beans right in the row. Frontend only. Spec: [Neighborhood page redesign](../spec.md), "Frontend: cards".

**Blocked by:** 03 (Top rated and Shortlists as shelves of compact cards)

**Status:** ready-for-agent

- [ ] A new presentational row component in the same entity slice as the shelf card, with a contribution slot the page fills with `CardContribution`; not a variant flag on the shelf card
- [ ] The row uses the shelf card's short-address rule; only the name and photo open the Place page; Favorite works as on cards
- [ ] Beans sit beside the name on desktop and under it on a phone
- [ ] Sorting, unrated last, "Show 20 more" and "Suggest it" are unchanged; `neighborhood_card_click` from a row sends `section: 'all'`
- [ ] The page's old generic section of large cards is gone
- [ ] The page's rating tests move from cards to rows: a tap on a row's beans sends `addRating`, shows "Your rating: N · change", doesn't navigate; a failure puts the beans back with the message
- [ ] Checked in the browser through Chrome DevTools MCP at 1280px and 375×812: rows fit, beans are tappable, rating a row works against the local backend
