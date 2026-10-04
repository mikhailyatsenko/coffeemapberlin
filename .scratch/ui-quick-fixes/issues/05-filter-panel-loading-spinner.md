# 05: Style the Filters panel's tag-loading state with the site's spinner

**What to build:** Opening the Filters panel while the Features tag list is still loading shows the site's existing themed spinner, not bare unstyled "Loading features..." text.

**Blocked by:** None (can start immediately)

**Status:** resolved

- [x] The bare loading string is replaced with the existing `Spinner` component (`shared/ui/Loader`), the same one `ImgWithLoader` already uses.
- [x] The loading state doesn't visibly collapse or jump in height compared to the Features section once it renders — spacing matches the section's normal wrapper.
- [x] Once the tags load, the spinner is replaced by the existing `TagsFilter` content exactly as it is today — no other behavior change.
- [x] A render test asserts the spinner appears while the tags query is loading and disappears once it resolves.

Source: [Ten quick UI fixes spec](../spec.md), Implementation Decisions §6.

**Notes:** `ImgWithLoader` doesn't actually use `Spinner` (only `NeighborhoodPage` does), so there was no existing usage to copy; the default `md` size is used. The spinner sits in a `role="status"` wrapper named "Loading features", which the test queries. With real data the Features section is ~1,570px tall, so its height can't be matched; the wrapper's `min-height: 64px` covers the section title plus one row of tags so the section doesn't collapse while loading.
