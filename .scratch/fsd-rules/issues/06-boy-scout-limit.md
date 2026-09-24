# Where does the boy-scout rule stop?

Type: grilling
Status: resolved
Blocked by: 04

## Question

The rules apply to new code and to code a change touches. Lint-staged already forces `warn` rules (whole-store subscription, root `index.ts` exports) to be fixed in every touched file, and design-level violations carry an `eslint-disable` with a reason (see [Which rules does the linter enforce, and which stay as text for review?](04-lint-vs-text.md)). Decide what the document tells an agent for the text-only rules: when touching a file that breaks one (wrong segment content, pages-first, a SOLID heuristic), how far does the agent reshape it within the ticket, and when does it stop and note a separate refactor instead (and where that note goes)? Also: may an agent add a new `eslint-disable`, and on what condition?

## Answer

Fact found while resolving: nude-app has no boy-scout or `eslint-disable` guidance, so none of this is modelled on it.

**Principle: don't make it worse, and improve within a limit.**
- *Don't make it worse* (always, no exceptions): new code and the lines the diff changes break no text-only rule. Example: a diff adding a third flag prop to `ReviewCard` moves it to composition or a `variant` within the ticket. Writing a note instead is not enough.
- *Improve* (required, within the limit below): existing violations in touched code are fixed when the fix stays inside the limit. Anything past the limit gets a note instead.

**The limit is the blast radius, not the diff size.** There are no numeric thresholds (see ticket 03).

A fix is in the ticket when it stays **inside a slice the diff already changes** and **doesn't change that slice's public API**:
- `export *` → named re-exports in that slice's `index.ts`;
- moving a file into the right segment of the same slice;
- moving logic from `ui/` into a slice hook (SOLID 1), only for a component the diff changes;
- narrowing props (SOLID 3) when every caller is in the same slice.

A fix is outside the ticket (write a note) when it:
- moves code across slices or layers (pages-first extraction, relocating AuthModal);
- changes a public API that other slices consume;
- is a SOLID refactor of a component the diff doesn't change, even if it sits in a touched file or slice.

SOLID 2 (flag props) only ever applies as *don't make it worse*: existing flags are left alone unless the diff adds one.

**Where the note goes.** A local issue file at `.scratch/architecture-debt/issues/NN-<slug>.md` with `Status: needs-triage`. It records the rule broken, the file, and why the fix wasn't done in the ticket. The agent's final report links it. Notes never go in `// TODO` comments on their own (`src/` has 3 stale ones today). A TODO is allowed only next to an `eslint-disable`, where it links the issue file.

**New `eslint-disable`: allowed only when all of these hold:**
1. The rule is an `error` rule ((a)/(b)/(c)/(f)), and the fix sits past the limit above, so it is a design change. Never for `warn` rules ((g), root `index.ts` exports), because those fixes are local by definition.
2. The form is `eslint-disable-next-line <rule> -- <reason>`: scoped, with the rule named and a reason given. No file-level disables.
3. The reason links the architecture-debt issue file.
4. The final report mentions the new disable.

This is enforced by adding `@eslint-community/eslint-plugin-eslint-comments` (`require-description`, `no-unlimited-disable`) and `reportUnusedDisableDirectives`, so a stale disable surfaces once its violation is fixed. This extends the tooling from [Which rules does the linter enforce, and which stay as text for review?](04-lint-vs-text.md). The existing file-level disable on `AddToFavButton` from ticket 04 stays as the one exception; it must name its rule(s) and carry a reason.

**Review (`code-review`):**
- A diff line that breaks *don't make it worse* is a normal finding.
- An existing violation inside the limit that was left unfixed is a non-blocking finding: "boy-scout: fixable within this ticket".
- An existing violation past the limit is not a finding if an architecture-debt issue exists for it. If none exists, review suggests filing one.

`CONTEXT.md` doesn't change: these are code terms, not domain terms.
