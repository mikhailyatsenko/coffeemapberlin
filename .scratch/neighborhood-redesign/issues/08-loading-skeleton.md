# 08: Loading skeleton

**What to build:** While the page loads, it shows its shape in grey (the header's lines and two shelves of card placeholders) instead of a spinner, so nothing jumps when the data arrives. Frontend only. Spec: [Neighborhood page redesign](../spec.md), "Frontend: page structure".

**Blocked by:** 03 (shelves), 06 (Neighborhood header)

**Status:** ready-for-agent

- [ ] The skeleton replaces the spinner and "Loading places..."; it matches the header and shelf sizes at desktop and phone widths
- [ ] It is hidden from screen readers except one status message saying the Places are loading
- [ ] The error, Not found and "Shortlists fail to load" behavior is unchanged
- [ ] A page test shows the loading state while queries are pending
- [ ] Checked in the browser through Chrome DevTools MCP with network throttling: no layout jump when the data arrives
