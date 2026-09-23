# CLAUDE.md

## Agent skills

### Issue tracker

Issues live as local markdown files under `.scratch/<feature>/`. See `docs/agents/issue-tracker.md`.

### Triage labels

Default five roles (`needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`), recorded as a `Status:` line. See `docs/agents/triage-labels.md`.

### Domain docs

Single-context: one `CONTEXT.md` + `docs/adr/` at the repo root. See `docs/agents/domain.md`.

## Backend

The API lives in a separate repo, checked out locally as a sibling directory: `../coffemap-server` (GitHub: `mikhailyatsenko/berlin-coffee-backend`). Express + Apollo Server (GraphQL) + MongoDB. The frontend talks to it via Apollo Client (`src/shared/config/apolloClient.ts`, URL from `VITE_API_URL` / `VITE_API_URL_PROD`). Backend changes go there, not in this repo.
