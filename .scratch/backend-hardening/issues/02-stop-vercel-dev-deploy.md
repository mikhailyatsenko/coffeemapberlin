# 02: Stop deploying the `dev` branch to `dev.3welle.com`

Status: ready-for-agent
Blocked by: backend coffemap-server `.scratch/backend-hardening/issues/03-config-module.md`

## Problem

Vercel builds the `dev` branch (last touched 2025-11-25) to `dev.3welle.com`, which talks to the production API. The backend config module drops `dev.3welle.com` from its allowed origins, so that site stops working anyway; it should not keep being deployed.

## Current behaviour

`vercel.json`: `git.deploymentEnabled` is `{ "main": true, "dev": true, "**": false }`.

## Expected behaviour

- `"dev": true` is removed (or set to `false`), so only `main` deploys.
- Taking the `dev.3welle.com` domain down in the Vercel dashboard is a human step: the ticket's Comments list it (Vercel → project → Settings → Domains → remove `dev.3welle.com`; optionally delete the `dev` branch's deployments).

## Acceptance criteria

- [ ] `vercel.json` enables deployments for `main` only; the JSON stays valid.
- [ ] `grep -r "dev.3welle.com" .` (excluding `node_modules`) finds nothing in code or config.
- [ ] The human dashboard step is written in Comments.
