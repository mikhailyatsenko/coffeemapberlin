# CLAUDE.md

## Agent skills

### Issue tracker

Issues live as local markdown files under `.scratch/<feature>/`. See `docs/agents/issue-tracker.md`.

### Triage labels

Default five roles (`needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`), recorded as a `Status:` line. See `docs/agents/triage-labels.md`.

### Domain docs

Single-context: one `CONTEXT.md` + `docs/adr/` at the repo root. See `docs/agents/domain.md`.

## Architecture

@docs/agents/architecture.md

## Backend

The API lives in a separate repo, checked out locally as a sibling directory: `../coffemap-server` (GitHub: `mikhailyatsenko/berlin-coffee-backend`). Express + Apollo Server (GraphQL) + MongoDB. The frontend talks to it via Apollo Client (`src/shared/config/apolloClient.ts`, URL from `VITE_API_URL` / `VITE_API_URL_PROD`). Backend changes go there, not in this repo.

Before the first edit in `../coffemap-server` from a session started in this repo, ask the user whether to make the change in the current session or to hand it to a separate backend session. This holds even when the task, ticket or prompt itself says the work is on the backend: that tells you where the change goes, not that this session should make it. Ask once per session, and don't edit the backend until the user answers.

When the user hands it off, write it into the backend's local tracker (`../coffemap-server/.scratch/<feature>/`, see `../coffemap-server/docs/agents/issue-tracker.md`) in the form that fits how clear the work is; choose it yourself and say which you chose:
- the work is fully decided (schema, rules, tests known, e.g. from a frontend spec): a ready-for-agent ticket, `issues/NN-<slug>.md`, that `/mattpocock-skills:implement` can take as is;
- open questions remain (design, data, scope): a short `problem.md` with what the frontend needs and why, links to the frontend spec and ticket, and the open questions listed, no solution design. The user takes it to tickets in the backend session.
