# Progress — The Evidence Room

## Current milestone

**M1 — Game Engine**

**Status:** PASS (pending human GO for Milestone 2)

## Completed work (M1)

- Defined Zod schemas for case, evidence, puzzle, dialogue, unlock conditions, GameState, and save envelopes
- Cross-reference validation with path-aware errors for unlocks, scoring refs, and related IDs
- Added fictional fixture case `CASE_FIX_001` (`The Empty Locker`) under `src/content/cases/case-fix-001/`
- Implemented pure `createGame` engine API (discover/inspect evidence, puzzles, dialogue, connections, timeline, verdict)
- Unlock evaluation and act progression inside the engine; rejected actions leave state unchanged
- Final act `completeWhen` success keeps `currentAct` on the last defined act
- Versioned save/load with semantic validation against the active case; rejected loads leave state unchanged
- Deterministic scoring foundation using master-plan weights and rating bands
- Headless exit-gate test plus focused tests for invalid content, locked actions, and invalid saves
- Storage port with in-memory test double (no browser rendering required for engine tests)

## Verification results (executed)

| Check | Result |
| --- | --- |
| `npm run typecheck` | PASS |
| `npm run lint` | PASS |
| `npm run test:run` | PASS (23 tests across 6 files) |
| `npm run build` | PASS |
| `npm run test:e2e` | PASS (1 Chromium smoke test) |
| `git diff --check` | PASS (after stripping ADR date trailing whitespace) |

Exit-gate test: `src/engine/exit-gate.test.ts` — `M1 exit gate: fixture case progresses, persists, and scores deterministically`

### M1 closeout review (2026-11-15)

- Confirmed ADR-009 reload scoring: full `ScoreResult` equal before/after save → fresh engine → `loadSave`
- Confirmed rejected `loadSave` preserves `GameState` and session `verdictAnswers`
- Confirmed final-act completion keeps `currentAct` on a defined act
- No engine contract bugs found; added/strengthened regressions only
- ADR-009 updated with explicit caller reload flow

## Prior milestone (M0)

**Status:** PASS (verified baseline commit `f3d7da4` on `main`)

### Completed work (M0)

- Verified workspace `C:\dev\Personal\RedHandedTheGame`
- Initialized Git repository; M0 baseline committed as `f3d7da4`
- Scaffolded Vite + React 19 + TypeScript app in place
- Installed approved dependencies; retained `package-lock.json`
- Configured Tailwind CSS v4, React Router, strict TypeScript, ESLint, Prettier, Vitest, Playwright
- Preserved complete Version 1.0 master specification in `docs/MASTER_PLAN.md`
- Created supporting source-of-truth documents
- Added `.cursor/rules/evidence-room.mdc` (`alwaysApply: true`)
- Built minimal accessible application shell (landing + 404) with design tokens
- Documented planned game architecture
- Added unit tests and Playwright smoke test
- Verified isolated `npm ci` reproducibility

### M0 verification (historical)

| Check | Result |
| --- | --- |
| `npm run typecheck` | PASS |
| `npm run lint` | PASS |
| `npm run test:run` | PASS (3 tests at M0) |
| `npm run build` | PASS |
| `npm run test:e2e` | PASS (1 Chromium smoke test) |
| `npm run dev` | PASS (server ready; HTTP 200) |
| Isolated `npm ci` | PASS (`EXIT_NPM_CI=0`) |

## Known issues

- Full `npm audit` previously reported moderate severity issues in the dependency tree; `npm audit --omit=dev` reports 0 vulnerabilities. No force-fix applied during M0.
- Vite template TypeScript 7 was incompatible with `typescript-eslint@8`; project pinned to TypeScript 5.9 (ADR-003).
- Zustand remains optional for M1; no React store wired to the UI yet (ADR-010).

## Next milestone

**M2 — Cinematic Visual Foundation** — not started. Requires explicit GO after M1 review.
