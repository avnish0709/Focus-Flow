Project rules (CLAUDE rules)

1) Forms: use `react-hook-form` for state and `zod` for validation
- Rationale: consistent validation, typed schemas, and predictable error handling.
- Testable: PRs introducing forms must include a `zod` schema file or inline schema and at least one unit test verifying validation rejects invalid input.

2) No uncontrolled inputs for feature forms
- Rationale: uncontrolled inputs lead to inconsistent state and make validation harder.
- Testable: code reviews should flag uncontrolled inputs; automated linting should alert when forms use `useState` with uncontrolled refs instead of RHF.

3) Tests required for UI features affecting behavior or persistence
- Rationale: tests document expected behavior and reduce reviewer guessing.
- Testable: every PR that adds UI behavior or persistence must include tests covering validation, success path, and one accessibility assertion (`role=alert` or `aria-invalid`). CI must run `pnpm test` and pass before merge.

PR checklist (enforcement)
- Includes tests for new behaviors.  
- Forms use `react-hook-form` + `zod`.  
- Accessibility: visible error messages use `role=alert` and inputs have `aria-invalid` when invalid.
