# Progress — The Evidence Room

## Current milestone

**M2 — Cinematic Visual Foundation**

**Status:** PASS (pending human review; uncommitted; do not start M3 without GO)

## Completed work (M2)

- Built six cinematic screens: Landing, Case selection, Case introduction, Investigation workspace shell, Settings, Credits
- Extended AppShell with atmospheric background, original grain texture, and shared primary navigation
- Added original paper/grain textures under `public/textures/`
- Added shared `Button`, `CaseFileTransition` (Motion), focus-on-route-change, and settings document sync
- Case registry UI lists playable fixture `CASE_FIX_001` and locked concept `CASE_001` (“Coming soon”)
- Landing CTA labeled **Start investigation** routes to `/cases` (no Continue control in M2)
- Workspace kept at shell level; M1 engine / save / scoring contracts untouched
- Settings implements FR-012 controls; sound prefs persist before audio is wired; Reset progress disabled with explanation
- Reduced motion honors OS `prefers-reduced-motion` and in-app preference; large text size via `data-text-size`
- Expanded Vitest and Playwright coverage for flow, overflow, keyboard focus, text size, and reduced motion

## Verification results (executed)

| Check | Result |
| --- | --- |
| `npm run typecheck` | PASS |
| `npm run lint` | PASS |
| `npm run test:run` | PASS (28 tests across 6 files) |
| `npm run build` | PASS |
| `npm run test:e2e` | PASS (3 Chromium tests) |
| `git diff --check` | PASS |

### Browser observations (Playwright Chromium)

| Viewport | Result |
| --- | --- |
| 1440×900 | PASS — all six screens, flow, Settings/Credits, no horizontal overflow, no console errors |
| 390×844 | PASS — same path; large text size keeps nav/actions usable; no overflow |
| 320px width | PASS — overflow spot-check on all six routes |
| Keyboard | PASS — skip link, Tab to Start investigation, focus moves to `#main-content` after route change, visible focus |
| Reduced motion | PASS — in-app preference sets `data-reduced-motion`; OS `prefers-reduced-motion: reduce` exercised on case intro |

## Prior milestone (M1)

**Status:** PASS (baseline commit `020e5d0` on `main`)

### Completed work (M1)

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

## Prior milestone (M0)

**Status:** PASS (verified baseline commit `f3d7da4` on `main`)

## Known issues

- Full `npm audit` previously reported moderate severity issues in the dependency tree; `npm audit --omit=dev` reports 0 vulnerabilities. No force-fix applied during M0.
- Vite template TypeScript 7 was incompatible with `typescript-eslint@8`; project pinned to TypeScript 5.9 (ADR-003).
- Sound settings persist preferences only; no audio playback is wired yet (intentional for M2).
- Reset progress is disabled until save/restore UI exists in a later milestone.
- Continue investigation remains deferred until save detection/restore can be validated.

## Next milestone

**M3 — Case 001 Content Engine** — not started. Requires explicit GO after M2 review and commit authorization.
