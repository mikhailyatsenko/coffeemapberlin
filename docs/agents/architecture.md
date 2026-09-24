# Architecture

## Scope

These rules apply to new code and to the code a change touches.

## Enforced by ESLint

ESLint checks layer order, same-layer slice imports, public-API entry points, segment names, data imports in `shared/ui` and `entities/*/{ui,components}`, store subscriptions, slice root `index.ts` exports and `eslint-disable` descriptions; this document doesn't restate those rules, so fix a violation the way its lint message says.

## FSD

Layers, top to bottom:

```
app/        providers, router, global setup
pages/      one route each; composes the layers below
widgets/    large self-contained UI blocks
features/   user interactions: data access, mutations, business logic
entities/   business-domain objects and their presentational UI
shared/     infrastructure, design system, app-wide data access
```

Segments of a slice. Lint checks the names only, so pick the segment by its purpose:

```
Slice/
├── ui/          the slice's main component(s): rendering
├── components/  private sub-components, one folder X/ each
├── types/       TypeScript types
├── constants/   static values and enums
├── lib/         pure functions
├── model/       Zustand state and hooks holding the slice's logic
├── api/         hooks that wrap generated Apollo hooks and add logic
├── hooks/       React hooks not tied to server data
├── mappers/     data → view-shape transforms
└── index.ts     public API: re-exports from ./ui only
```

- Treat `components/X/` as a mini-slice: the same segments, its own `index.ts`, and no `components/` of its own. Put a sub-component's sub-component beside it, in the slice's `components/`.
- Keep `shared/` in its current layout: `ui/` (design-system primitives), `stores/` (global Zustand stores), `query/` (GraphQL documents by domain), `generated/` (codegen output; change it with `npm run codegen`), `api/` (hooks over generated hooks), `config/` (Apollo and Strapi clients), `hooks/`, `lib/`, `constants/`, `types/`, `assets/`, `styles/`. Add code to the folder that matches.
- Build pages-first: UI used by one page lives in that page's `components/`. Move it down to widgets, features or entities once a second slice needs it.
- Re-export each public symbol by name in a slice's `index.ts`, so the public API stays explicit:

```ts
export { Foo } from './ui/Foo';         // ✅ named
export type { FooProps } from './ui/Foo';
export * from './ui';                   // ❌ exposes whatever ui/ adds later
```

- To couple two entities, use `@x`: entity A exposes `entities/A/@x/B.ts` with just what entity B needs, and B imports that file. The file makes the coupling explicit and reviewable, which is why only entities get it.

## SOLID heuristics

Judgement calls: in review, flag each as "possible <name>", never as a certain violation.

- **Component doing several jobs** (S): one `ui/` file holds data access or mutations, non-trivial logic (effects, derivations, error handling) and substantial markup together; a hook that fetches data and also shapes it for display counts too → move the logic into a hook in the slice's `model/` or `hooks/` and keep `ui/` for rendering. *Divergent Change* sees a file edited for several reasons in the diff; this sees one unit holding several jobs, whatever the diff touches.
- **Flag props for variants** (O): a boolean prop switches *what* renders (another variant), not one attribute such as `disabled` or `isFavorite` → use composition (`children`, slots, separate components) or a discriminated-union `variant`. It fires only when the diff adds a second such flag or a new branch to an existing one; that keeps it clear of *Speculative Generality*.

```tsx
<Card isCompact isHighlighted />      // ❌ two flags pick the variant
<Card variant="compact" />            // ✅ one discriminated union
<CompactCard><Badge /></CompactCard>  // ✅ or composition
```

- **Wide props** (I): a component or hook receives a wide object (a generated GraphQL type, a whole `Place`) but uses 1–2 fields unrelated to what the object is → pass those fields, or narrow the type with `Pick<>` or its own props type. A component that renders a whole domain concept (a place card renders `Place`) takes it whole; that is the balance against *Data Clumps*.
- Call generated Apollo hooks directly from a feature's or page's `ui/`; DIP calls for no wrapper. A wrapper with no logic of its own is *Middle Man*. Override: a hook in `api/` or `model/` that wraps a generated hook and adds `onCompleted`, a cache `update` or mapping is not *Middle Man*; keep it. Every other baseline smell stands.

## Boy-scout and debt

- Don't make it worse, without exception: new code and changed lines follow every rule here. Fix what your diff introduces within the ticket; a debt note never replaces that fix.
- Fix existing violations in touched code when the fix stays inside the blast radius: inside a slice the diff already changes, with that slice's public API unchanged.
  - In: `export *` → named re-exports in that slice's `index.ts`; moving a file into the right segment of the same slice; moving logic from `ui/` into a slice hook for a component the diff changes; narrowing props when every caller is in the same slice.
  - Out, write a debt note: moving code across slices or layers (a pages-first extraction included); changing a public API that other slices consume; a SOLID refactor of a component the diff doesn't change, even in a touched file or slice.
- Apply Flag props for variants only as don't-make-it-worse: leave existing flags as they are unless the diff adds one.
- Record debt as `.scratch/architecture-debt/issues/NN-<slug>.md` with `Status: needs-triage`: the rule broken, the file, and why the fix is past the blast radius. Link the note from your final report. A `// TODO` appears only next to an `eslint-disable`, linking its note.
- Add a new `eslint-disable` only when all four hold:
  1. The rule is an `error` rule whose fix is past the blast radius, i.e. a design change (in practice: layers, public API, data imports). `warn` rules always get the local fix.
  2. It takes the form `// eslint-disable-next-line <rule> -- <reason>`.
  3. The reason links the debt note.
  4. Your final report mentions the new disable.

## Review

- A diff line that breaks a rule in this document is a normal finding.
- An existing violation inside the blast radius that the diff left unfixed is a non-blocking finding: "boy-scout: fixable within this ticket".
- An existing violation past the blast radius is covered by its note in `.scratch/architecture-debt/issues/` and needs nothing more; without a note, suggest filing one.
