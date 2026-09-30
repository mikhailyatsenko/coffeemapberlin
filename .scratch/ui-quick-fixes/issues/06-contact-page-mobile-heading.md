# 06: Restore the Contact page's heading on mobile

**What to build:** A mobile visitor to the Contact page sees the "Let's get in touch!" heading and its subtext above the form, instead of landing on a bare form with no page context.

**Blocked by:** None (can start immediately)

**Status:** ready-for-agent

- [ ] At mobile widths (≤767px), the heading and subtext render in the DOM (not `display: none`) — verifiable via `getByRole('heading', ...)` / `getByText(...)` without changing viewport-dependent visibility logic in a way RTL can't assert.
- [ ] The heading/subtext's own background-photo layer is removed at mobile widths, so the photo renders once (from the page's existing mobile background), not doubled.
- [ ] Text stays legible (white, per the existing style) against the page's dark-gradient photo background.
- [ ] The form itself and its behavior are unchanged; only the heading/subtext's visibility and the duplicate background are fixed.
- [ ] Desktop layout (the 50/50 split with its own photo panel) is unchanged.
- [ ] A new `ContactPage.test.tsx` (or extension) asserts the heading and subtext text nodes exist in the rendered DOM.

Source: [Ten quick UI fixes spec](../spec.md), Implementation Decisions §7–8.
