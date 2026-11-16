# Progress — The Evidence Room

## Current milestone

**M3 — Case 001 Content Engine**

**Status:** PASS (pending human review; uncommitted; do not start M4 without GO)

## Completed work (M3)

- Authored full `CASE_001` package under `src/content/cases/case-001/` (metadata, 4 characters, 3 acts, E001–E014, 3 interviews with beats, 5 puzzles, unlocks, verdict options, reveal sequence)
- Extended schemas/engine with optional `summary`, dialogue `beats`, puzzle `prompt`, verdict `options`, `verdictPrerequisite`, `reveal`, plus `isComplete()` / `getReveal()`
- Gated `submitVerdict` when `verdictPrerequisite` is set; unknown option IDs rejected; valid incorrect options accepted for scoring; rejected submissions preserve state and prior answers
- Reveal unlocks only on case completion (final-act requirements + accepted verdict); premature `verdictSubmitted` in a loaded save cannot unlock reveal
- Reconstruction and timeline scoring share one canonical order; playthrough passes the same player-submitted order to `completePuzzle` and `setTimelineOrder`
- Headless playthrough covers early gates, perfect and imperfect verdicts, save round-trip, and premature-verdict reveal blocking
- Public registry keeps `CASE_001` as **Coming soon**; `getCaseDefinition` loads engine content for development
- Kept `CASE_FIX_001` and M1 exit-gate behavior for cases that omit the new optional fields

## Verification results (executed)

| Check | Result |
| --- | --- |
| `npm run typecheck` | PASS |
| `npm run lint` | PASS |
| `npm run test:run` | PASS (42 tests across 8 files) |
| `npm run build` | PASS |
| `npm run test:e2e` | PASS (3 Chromium tests) |
| `git diff --check` | PASS |

### CASE_001 playthrough

```bash
npx vitest run src/content/cases/case-001/playthrough.test.ts
```

## Prior milestone (M2)

**Status:** PASS (verified baseline commit `8903a02` on `main`)

### Completed work (M2)

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
- CASE_001 remains Coming soon in the public selector until a later UI milestone deliberately enables it.

## Next milestone

**M4 — Evidence Investigation System** — not started. Requires explicit GO after M3 review and commit authorization.
