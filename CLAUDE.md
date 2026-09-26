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

When a frontend task turns out to need a backend change, don't make it on your own. Ask the user whether to do it in the current session or to file it as a separate ticket in the backend repo (its local tracker: `../coffemap-server/.scratch/<feature>/issues/NN-<slug>.md`, see `../coffemap-server/docs/agents/issue-tracker.md`).
