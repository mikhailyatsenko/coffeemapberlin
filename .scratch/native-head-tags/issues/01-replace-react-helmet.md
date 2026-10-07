# 01: Replace react-helmet with React 19's native head tags

**What to build:** Every page sets its `<title>` and meta tags with plain `<title>`, `<meta>` and `<link>` in JSX, which React 19 hoists into `<head>`. `react-helmet` and `@types/react-helmet` are gone from `package.json`. The tab title and the head tags a visitor ends up with on each route are the same as today.

**Blocked by:** None (can start immediately)

**Status:** needs-triage

## Why

`react-helmet` has had no release since 2020 and runs on `react-side-effect` with legacy lifecycles. React 19 does the hoisting natively, so the dependency buys nothing except deduplication, and that is the catch below.

## The catch: no deduplication

Helmet deduplicates: the deepest `<Helmet>` wins. The app relies on that. React 19 does not deduplicate; it hoists every rendered `<title>` and `<meta>` into `<head>`. A one-to-one swap breaks things:

- `src/app/App.tsx` renders a default `<title>` and `<meta name="description">` that pages override. Natively, both the default and the page's tags end up in `<head>`.
- `index.html` also has a static `<title>Berlin Coffee Map</title>` and `<meta name="description">`. The browser takes the first `<title>` in document order, which is likely the static one, so page titles would stop showing (verify in a browser).
- `JournalArticlePage` would end up with three `description` metas: `index.html`, `App` and its own.

## Decisions

- **One owner per tag, per route.** Routes are flat (`AppRouter` renders one page at a time), so each page renders at most one `<title>` and at most one `description`. Remove the `<Helmet>` default from `App.tsx`.
- **Pages without a title of their own** (`MainPage`, `LoginPage`, `ConfirmEmailPage`, `ResetPasswordPage`) render `<title>Berlin Coffee Map</title>`, and `MainPage` also renders the default description, so no route loses what `App` used to give it.
- **`index.html` keeps its static `<title>` and `description`**, because crawlers without JS and social-preview bots see only those. Before the first render, `src/main.tsx` removes them from `<head>` so the tags React renders are the only ones. Do this in `main.tsx`, not in a component effect, so there is never a moment with two titles after React mounts.
- `<title>` children must be a single string: keep template literals (`` {`${name} | …`} ``), never `Text {x} | …`, which becomes an array and triggers a React warning.

## Files using react-helmet

`src/app/App.tsx`, `src/widgets/DetailedPlace/ui/DetailedPlace.tsx`, and these pages' `ui/` components: `AboutPage`, `AccountSettingsPage`, `ContactPage`, `DisclaimerPage`, `JournalArticlePage`, `JournalPage`, `MyReviews`, `NeighborhoodPage`, `NotFoundPage`, `PrivacyPolicyPage`, `SuggestPlacePage`, `SuggestionReviewPage`.

## Acceptance

- [ ] No import of `react-helmet` remains in `src/`; `react-helmet` and `@types/react-helmet` are removed from `package.json` and the lockfile.
- [ ] `App.tsx` renders no head tags.
- [ ] `MainPage`, `LoginPage`, `ConfirmEmailPage` and `ResetPasswordPage` render the default title; `MainPage` also renders the default description.
- [ ] `main.tsx` removes the static `<title>` and `<meta name="description">` from `index.html`'s `<head>` before `createRoot(...).render`; `index.html` itself keeps them.
- [ ] Conditional tags keep their conditions: `JournalArticlePage`'s SEO fields, `NotFoundPage`'s and `SuggestionReviewPage`'s `robots` and `prerender-status-code` metas.
- [ ] A test renders a page (for example `NeighborhoodPage` with a loaded neighborhood) and asserts `document.title`, plus that `document.head` has exactly one `<title>`.
- [ ] Checked in a browser on `/`, a neighborhood page, a Place page, a Journal article and a 404: the tab title is right, and `<head>` has exactly one `<title>` and at most one `description`, including after client-side navigation between them.
- [ ] `npm run lint:ts`, `npm test` and `npm run build` pass.

## Out of scope

- SSR, prerendering or Server Components for SEO; this ticket doesn't change what crawlers without JS see.
- New meta tags (OG for neighborhoods and similar).
