## Focus Flow
Focus Flow is a lightweight Next.js productivity app that helps users run focused study sessions, manage simple task lists, and customize session settings. It bundles a study timer, ambient background and music player, and a task manager into a minimal, accessible UI built with TypeScript and modern React patterns.

---

## Key Features
- Study Timer: configurable Pomodoro-style timer with start/pause/reset and session history.
- Task Manager: add, edit, complete, and filter tasks; lightweight persistence via localStorage.
- Ambient Experience: nature background and optional ambient music to aid focus.
- Settings: user-configurable preferences (display name, email, daily goals) with validated forms using react-hook-form + zod.
- Accessibility: visible error messages with role="alert", proper ARIA attributes on interactive controls.
- Tests: component-level tests using Vitest and Testing Library to enforce behavior and validation.

---

## Tech Stack
- Framework: Next.js (App Router)
- Language: TypeScript
- UI: React + Tailwind CSS (utility-first)
- Forms & Validation: react-hook-form + zod
- Testing: Vitest, @testing-library/react, @testing-library/user-event
- Package manager: pnpm

---

## Quick Start
Install dependencies:
```bash
pnpm install
```
- Run the development server :
```bash
pnpm dev
#or
pnpm run dev
```
- Build for production :
```bash
pnpm build
pnpm start
```
- Run tests :
```bash
pnpm test
# watch mode
pnpm test:watch
```

---

## Usage Overview
- Open the app and start a study session using the timer control in the header.
- Use the task manager to create focus-aligned tasks; mark tasks complete to track progress.
- Visit Settings to personalize your display name, contact email, and daily goal. Settings persist locally.

---

## Project Structure
- app — Next.js App Router pages and global styles.
- components — Reusable React components (timer, task manager, music player, settings forms).
- ui/ — Small UI primitives (buttons, inputs).
- hooks — Custom hooks (e.g., drag-and-drop).
- lib — Types and shared utilities.
- __tests__ — Unit and integration tests.

---

## Development Notes & Conventions 
- Forms must use react-hook-form along with zod schemas for validation.
- No uncontrolled inputs for feature forms; prefer controlled inputs wrapped by RHF.
- New UI behavior features require tests covering validation, success path, and an accessibility assertion (role="alert" or aria-invalid).
- Keep components small and focused; prefer composition over large monolithic components.

---

## Contributing
- Fork the repo and create a feature branch: feature/your-feature.
- Run tests and lint before opening a PR.
- Follow the project's form and testing conventions outlined above.

---

## License
Specify your license here (e.g., MIT). Add LICENSE file at repository root.
