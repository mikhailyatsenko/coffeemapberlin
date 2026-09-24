# 01: Navbar imports the AuthModal widget

Status: needs-triage

- **Rule:** `boundaries/element-types` (slices on one layer never import each other).
- **File:** `src/widgets/Navbar/ui/Navbar.tsx` imports `AuthModal` from `widgets/AuthModal`. The import is suppressed with a next-line disable that links this note.
- **Why it wasn't fixed in place:** the fix is a design question, not a local edit. Where does the AuthModal live? `AuthModal` is an app-wide modal driven by the `shared/stores/modal` store and composed from several features (`SignInWithEmail`, `SignUpWithEmail`, `ContinueWithGoogle`). Navbar only happens to be where it is mounted. Options include mounting it from `app` (next to the router/providers) or turning it into a feature. Each option changes where the modal is rendered and who owns it, which is beyond a boy-scout fix.
- **Found by:** `.scratch/fsd-rules/issues/07-lint-harness-and-boundaries.md`.
