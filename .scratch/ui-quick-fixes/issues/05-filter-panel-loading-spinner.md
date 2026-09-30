# 05: Style the Filters panel's tag-loading state with the site's spinner

**What to build:** Opening the Filters panel while the Features tag list is still loading shows the site's existing themed spinner, not bare unstyled "Loading features..." text.

**Blocked by:** None (can start immediately)

**Status:** ready-for-agent

- [ ] The bare loading string is replaced with the existing `Spinner` component (`shared/ui/Loader`), the same one `ImgWithLoader` already uses.
- [ ] The loading state doesn't visibly collapse or jump in height compared to the Features section once it renders — spacing matches the section's normal wrapper.
- [ ] Once the tags load, the spinner is replaced by the existing `TagsFilter` content exactly as it is today — no other behavior change.
- [ ] A render test asserts the spinner appears while the tags query is loading and disappears once it resolves.

Source: [Ten quick UI fixes spec](../spec.md), Implementation Decisions §6.
