# 11: Disable hygiene

**What to build:** A sloppy or stale `eslint-disable` can't be committed. `@eslint-community/eslint-plugin-eslint-comments` rejects a disable without a description (`require-description`) and a disable that names no rule (`no-unlimited-disable`). `reportUnusedDisableDirectives` reports a disable that no longer suppresses anything, and lint-staged's `--max-warnings=0` blocks the commit on it. The existing disables on Navbar and AddToFavButton already comply.

See [spec](../spec.md): "ESLint configuration" (disable hygiene) and "One-off fixes".

**Blocked by:** 07 (Lint test harness and layer boundaries through boundaries) and 09 (No data access in presentational layers). Their disables must already comply.

**Status:** resolved

- [x] The plugin is added as a devDependency, with `require-description` and `no-unlimited-disable` turned on.
- [x] `reportUnusedDisableDirectives` is on.
- [x] The test covers:
  - a disable without a description, which is reported;
  - a bare `eslint-disable-next-line`, which is reported;
  - an unused disable, which is reported;
  - a named, described disable that suppresses a real violation, which passes.
- [x] Every existing disable in `src/` passes the new rules.
- [x] `npm run lint:ts` reports 0 errors, and `npm test` passes.
