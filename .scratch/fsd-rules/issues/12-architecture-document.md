# 12: Architecture document for agents

**What to build:** Every Claude Code session loads the architecture rules automatically, and `code-review` uses them as a standards source. The rules live in `docs/agents/architecture.md`. `CLAUDE.md` pulls that file in with an `@docs/agents/architecture.md` import, in a short section of its own. The document holds only what lint can't check. `.cursorrules` is deleted in the same change.

Write the document with the `writing-for-agents` skill. The content is decided in the map's tickets, gisted in [spec](../spec.md) "The document": FSD in ticket 01, SOLID in 03, lint vs text in 04, boy-scout in 06, shape in 05. Take the tone and scope from the nude-app reference: `/Users/mykhailoyatsenko/nude-app/CLAUDE.md`, "Architecture — FSD".

**Blocked by:**
- 09 (No data access in presentational layers)
- 10 (Warn rules for whole-store subscriptions and root index exports)
- 11 (Disable hygiene)

These gate the ticket so that the document's "Enforced by ESLint" line is true when it lands.

**Status:** ready-for-agent

- [ ] The document is written with the `writing-for-agents` skill, in English and imperative mood, one rule per bullet.
- [ ] It is at most 120 lines.
- [ ] The sections appear in this order: Scope, Enforced by ESLint, FSD, SOLID heuristics, Boy-scout and debt, Review.
- [ ] "Enforced by ESLint" is one line, and the document doesn't restate the linted rules.
- [ ] The FSD section covers:
  - layer purposes;
  - segment purposes, including `components/X` as a mini-slice that never nests `components/`;
  - the `shared/` layout as it is today;
  - pages-first;
  - named re-exports over `export *`;
  - `@x` on entities only, with its intent.
- [ ] The SOLID section covers:
  - heuristics 1–3 in `**Name** (letter): what it is → how to fix` format, each with its line on the nearest baseline smell;
  - a note that they are judgement calls flagged as "possible …";
  - the Middle Man override;
  - the "don't wrap a generated hook for DIP's sake" line.
- [ ] There is no whole-store heuristic, because lint covers it.
- [ ] The Boy-scout and debt section covers:
  - don't make it worse (absolute);
  - the blast-radius limit with its in/out lists;
  - SOLID 2 only as don't-make-it-worse;
  - the debt note: `.scratch/architecture-debt/issues/`, `needs-triage`, what it records, linked from the final report, no standalone `// TODO`;
  - the four `eslint-disable` conditions.
- [ ] The Review section holds the three `code-review` rules.
- [ ] There are at most two code examples, each 6 lines or fewer: named re-export vs `export *`, and flag props vs `variant`/composition.
- [ ] There are no references to files in `src/`.
- [ ] `CLAUDE.md` has the `@` import, and `.cursorrules` is deleted.
