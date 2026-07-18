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

# Focus Flow

Focus Flow is a lightweight Next.js productivity app for managing focused study sessions, simple task lists, and user-configurable settings.

Built with TypeScript and modern React patterns, Focus Flow combines a study timer, ambient experience, and task manager into a compact web app that helps users stay on track without unnecessary complexity.

## Features

- **Study Timer**: start, pause, and reset focused work sessions.
- **Task Manager**: add, complete, and filter tasks with quick persistence.
- **Ambient Experience**: nature background and optional music help maintain concentration.
- **Settings**: configurable preferences with validated forms using `react-hook-form` and `zod`.
- **Accessibility**: inline error messages, semantic labels, and explicit ARIA feedback.
- **Tested UI**: core form behavior is covered by Vitest and Testing Library.

## Tech Stack

- Next.js
- React
- TypeScript
- `react-hook-form` + `zod`
- Vitest
- pnpm

## Quick Start

```bash
pnpm install
pnpm dev
```

Then open `http://localhost:3000`.

## Testing

```bash
pnpm test
```

## Project Structure

- `app/` — Next.js routes and global styles
- `components/` — UI components and feature forms
- `hooks/` — custom hooks
- `lib/` — shared types and utilities
- `__tests__/` — test coverage for feature behavior

Conclusion
- Use Round‑1 for rapid prototyping, but always follow with a precise, test-first round when correctness, accessibility, and maintainability matter. The two‑round drill demonstrates how a concise spec and test requirements significantly reduce review overhead.

## Notes

This repo includes a two-round feature workflow for settings form development: a rapid first pass and a validated second pass with explicit tests and accessibility improvements.

