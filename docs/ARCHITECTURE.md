# Architecture — The Evidence Room

**Status legend**

- **Approved:** Required by `docs/MASTER_PLAN.md`
- **Planned:** Designed for later milestones; not implemented yet
- **Implemented (M0/M1/M2):** Present in the current codebase
- **Future proposal:** Pitch-era ideas pending later authorization

## Overview

**Approved / Planned:** The application separates an app shell and UI system from a pure game engine and a data-driven content engine. Narrative content must not be hardcoded into React components. Game rules must not depend on presentation components.

**Implemented (M0):** Application entry, React Router shell, global styles with design tokens, accessible page structure, landing page, and not-found route.

**Implemented (M1):** Zod case/evidence/puzzle/dialogue schemas, pure `createGame` engine, unlock/act progression, versioned save/load with case-aware validation, deterministic scoring foundation, fixture case `CASE_FIX_001`, headless Vitest coverage.

**Implemented (M2):** Cinematic screens and navigation (`/`, `/cases`, `/cases/:caseId/intro`, `/cases/:caseId/investigate`, `/settings`, `/credits`), atmospheric shell, original textures, case-file transition, settings preferences store (Zustand + localStorage). Investigation UI remains shell-level; engine is not wrapped for gameplay.

**Implemented (M3):** Full `CASE_001` content package; optional case fields for interview beats, verdict options, verdict prerequisite, and reveal; `isComplete()` / `getReveal()`; headless playthrough proof. Public selector still labels CASE_001 Coming soon.

## High-level architecture

```
APP SHELL
   |
   +-- UI SYSTEM (screens, components)       [Implemented — M2 cinematic foundation]
   |
   +-- GAME ENGINE (state, rules, scoring)   [Implemented — M1]
   |
   +-- CONTENT ENGINE (case data, assets)    [Fixture M1; UI registry M2; CASE_001 content M3]
           |
           +-- VALIDATION (Zod)              [Implemented — M1]
           |
           +-- PERSISTENCE (storage port)    [Implemented — M1; settings prefs M2]
```

## Routes (M2)

| Path | Screen |
| --- | --- |
| `/` | Landing |
| `/cases` | Case selection |
| `/cases/:caseId/intro` | Case introduction |
| `/cases/:caseId/investigate` | Investigation workspace shell |
| `/settings` | Settings |
| `/credits` | Credits |
| `*` | Not found |

## Case content schemas (M1)

Zod schemas validate case packages before use:

- Case metadata (id, title, acts, difficulty, playtime)
- Characters
- Evidence (`EvidenceType`: document | photograph | audio | diagram | record | physical)
- Puzzles (`PuzzleType`: evidence-comparison | timeline-ordering | contradiction | classification | evidence-connection | final-verdict)
- Dialogue entries with unlock conditions
- Verdict questions and answer keys (scoring config)
- Unlock / progression rules (`UnlockCondition` union — ADR-006)

Public entry: `validateCase` / `parseCase` in `src/engine/schemas/`.

## Game state (M1)

Contract from the master plan (implemented as Zod `gameStateSchema`, `schemaVersion` literal `1`):

```ts
interface GameState {
  schemaVersion: number
  caseId: string
  currentAct: number
  discoveredEvidence: string[]
  inspectedEvidence: string[]
  completedPuzzles: string[]
  unlockedDialogue: string[]
  completedDialogue: string[]
  evidenceConnections: string[]
  timelineOrder: string[]
  verdictSubmitted: boolean
}
```

Verdict answer maps are outside this contract (ADR-009).

## Progression rules (M1)

- Evidence discovery and puzzle completion drive unlocks via declarative conditions.
- Rejected actions throw `EngineError` and leave state unchanged.
- Acts advance when `completeWhen` is satisfied; the final act does not advance past the last act number (ADR-007).
- Incorrect puzzle answers do not mutate progression state.

## Puzzle engine (M1 foundation)

Structured puzzle definitions with solution kinds `exact` | `order` | `map`. UI presentation is later; engine validates answers and updates progression.

## Evidence system (M1 foundation)

Definitions include unlock conditions, related evidence, asset refs, and accessibility descriptions. Discovery/inspection are engine actions.

## Dialogue system (M1 foundation)

Dialogue entries unlock from conditions and can be completed. Optional `beats` carry interview lines for content packages. Full branching interview trees remain later milestones.

## Completion and reveal (M3)

Optional `verdictPrerequisite` uses the unlock-condition system to gate `submitVerdict` (fixture omits it and stays open). `isComplete()` requires final-act `completeWhen`, prerequisite satisfaction, and `verdictSubmitted`. `getReveal()` returns reveal steps only when complete—so a premature verdict flag in a save cannot unlock the reveal.

## Verdict scoring (M1 foundation)

Deterministic weighted scoring:

| Category | Weight |
| --- | --- |
| Evidence discovery | 20% |
| Contradiction identification | 20% |
| Timeline reconstruction | 20% |
| Final conclusions | 30% |
| Distinguishing fact from speculation | 10% |

Ratings: Master Investigator, Skeptic, Detective, Amateur Sleuth, Back to the Evidence.

## Persistence (M1)

Versioned save envelope `{ schemaVersion, caseId, state, verdictAnswers? }`. Validated structurally and against the active case (act + entity IDs). Invalid saves fail without mutating active state. `KeyValueStorage` port supports memory doubles and `localStorage`. Settings preferences persist separately via Zustand localStorage (`evidence-room-settings`); game save/restore UI remains for later milestones.

## Adding a new case without rewriting the app

1. Add `src/content/cases/case-00N/` with validated content and assets under `public/`.
2. Register the case in the UI registry (`src/content/registry.ts`) and add content modules.
3. Engine and UI remain case-agnostic; only content and assets change.

M1/M2 ship fixture `CASE_FIX_001` as the playable preview. M3 ships `CASE_001` engine content while the public selector keeps it **Coming soon**; `getCaseDefinition` loads definitions for development without flipping UI playability.

## Testing strategy

| Layer | Focus | Status |
| --- | --- | --- |
| Unit | Engine rules, scoring, validation without UI | Implemented M1; M3 adds CASE_001 playthrough + completion/reveal gates |
| Component | Routing, pages, interactive UI | Implemented M0/M2 |
| E2E | Critical player flows | M2 flow + a11y smoke; full investigation flows M10 |

## Stack notes

Compatible stables installed: React 19, Vite, Tailwind CSS v4 (`@tailwindcss/vite`), React Router, Zustand, Zod, Motion, Vitest, Testing Library, Playwright, ESLint, Prettier.

TypeScript pinned to 5.9 for compatibility with `typescript-eslint` (see `docs/DECISIONS.md`).
