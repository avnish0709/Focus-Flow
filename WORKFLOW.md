WORKFLOW: AI Two-Round Feature Drill

Summary
This exercise implements a small settings form twice to compare an intentionally lazy first-pass (round‑1) against a precise, test-driven second pass (round‑2). The goal is to measure correctness, accessibility, edge cases, and reviewer effort when using short vs. precise prompts.

Round 1 (lazy)
- Prompt: a single sentence asking for a settings form.
- Result: `components/settings-form.tsx` — quick to produce, minimal validation (alerts + localStorage), basic labels, and an `aria-label` on the form. This delivered UI fast but left several correctness and accessibility gaps.

Round 2 (precise)
- Prompt: explicit file references, required fields, validation rules, technology constraints (`react-hook-form` + `zod`), and an explicit verification step to write tests and run them.
- Result: `components/settings-form-validated.tsx` plus tests at `__tests__/settings-form.test.tsx`. Round‑2 enforced typed validation, accessible error reporting (`role=alert`), and tests covering validation failure and success persistence.

Correctness
- Round‑1: missed type/format validation (email), numeric coercion, and consistent error handling — correctness relies on later review.
- Round‑2: validation schema (Zod) prevents invalid data at the UI boundary; unit tests ensure behavior remains correct during refactors.

Accessibility
- Round‑1 provided labels but used `alert()` for feedback and lacked explicit `role=alert` or `aria-invalid` on inputs.
- Round‑2 includes inline error messages with `role=alert`, making screen-reader feedback testable and verifiable.

Edge cases
- Round‑1 did not handle non-numeric input for `dailyGoal`, nor did it surface structured validation errors.
- Round‑2 explicitly handles parsing, integer checks, and range boundaries (1–24), and tests these edge cases.

Review effort & time comparison
- Round‑1 was fastest to produce (minutes), but required manual review and follow-up fixes — review+fix time increased overall cycle time.
- Round‑2 took longer to prompt and implement, but end‑to‑end time (including review + fixes) was shorter because tests and clear constraints reduced ambiguity.

AI mistake caught
- The AI in round‑1 used `alert()` and saved raw values to `localStorage` without validation; I corrected this in round‑2 and added tests to catch regressions.

Conclusion
- Use Round‑1 for rapid prototyping, but always follow with a precise, test-first round when correctness, accessibility, and maintainability matter. The two‑round drill demonstrates how a concise spec and test requirements significantly reduce review overhead.
