# Which SOLID heuristics go into the rules, and how are they worded for React/TS?

Type: grilling
Status: resolved

## Question

Which SOLID principles translate into useful, checkable heuristics for this React 19 + TypeScript + Apollo + Zustand codebase (e.g. SRP for components vs. hooks, OCP through composition/props instead of flags, ISP for narrow props, DIP through hooks/context instead of importing Apollo directly in UI), which don't earn a place, and how is each worded so a review agent can flag it as a judgement call? How do they sit next to `code-review`'s built-in Fowler smell baseline without duplicating it?

## Answer

Four heuristics go into `docs/agents/architecture.md`, SOLID section. They use the `code-review` smell-baseline format (`**Name**: what it is → how to fix`) with React names and the SOLID letter in brackets. They are always judgement calls, flagged in review as "possible …". The document is in English. Each heuristic has one line saying how it differs from the nearest baseline smell, so review doesn't report the same spot twice.

1. **Component doing several jobs (SRP)**: in one `ui/` file, data access or mutations, non-trivial logic (effects, derivations, error handling) and substantial markup all meet. Fix: move the logic into a hook in the slice's `model/` or `hooks/` and keep `ui/` for rendering. It also covers hooks that fetch data and shape it for display. No numeric thresholds. Differs from *Divergent Change*, which only sees a file edited for several reasons in the diff. This one sees one unit holding several jobs, whatever the diff touches.
2. **Flag props for variants (OCP)**: a boolean prop switches *what* renders (another variant), not a single attribute (`disabled`, `isFavorite`). Fix: composition (`children`/slots, separate components) or a discriminated-union `variant`. It fires only when the diff adds a **second** such flag or a new branch to an existing one. That is how it stays clear of *Speculative Generality*: no abstracting ahead of need. Example today: `ReviewCard` (`isGoogleReview`, `isOwnReview`, `canDelete`).
3. **Wide props (ISP)**: a component or hook receives a wide object (a generated GraphQL type, a whole `Place`) but uses 1–2 fields unrelated to what the object is. Fix: pass the fields, or narrow the type (`Pick<>` or its own props type). Exception: when the object is a whole domain concept the component renders (a place card renders `Place`), passing it whole is fine. This is the stated balance against *Data Clumps*.
4. **Whole-store subscription (ISP)**: a component calls `useXStore()` with no selector but needs a slice of the store. Fix: a selector. It also causes extra re-renders. 16 sites today versus 25 with selectors.

Ruled out:
- **DIP as its own heuristic**: no. A generated Apollo hook is already an abstraction, and wrapping each one in `useX()` is *Middle Man*. Calling generated hooks directly from a feature's or page's `ui/` is allowed (~20 sites today). The useful parts land elsewhere. "Move data logic into a hook" is part of heuristic 1. "`shared/ui` and `entities/*/ui` know nothing about data (Apollo, stores) and get everything through props" is an FSD rule, not SOLID (see tickets 01/04). The text says outright: "a thin wrapper over a generated hook with no logic of its own is Middle Man; don't write one for DIP's sake."
- **LSP**: no. There is almost no inheritance, and *Refused Bequest* already covers it. "Wrappers over native elements pass their props and `ref` through" belongs, if anywhere, in the `shared/ui` section, not in review heuristics.

Baseline override, one only: a hook in `api/`/`model/` that wraps a generated hook **and adds** `onCompleted`, a cache `update` or mapping is not *Middle Man*. All other baseline smells stand as they are.

`CONTEXT.md` doesn't change: these terms are about code, not the domain.
