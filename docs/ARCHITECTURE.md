# Architecture — The Evidence Room

**Status legend**

- **Approved:** Required by `docs/MASTER_PLAN.md`
- **Planned:** Designed for later milestones; not implemented yet
- **Implemented (M0):** Present in the current foundation
- **Future proposal:** Pitch-era ideas pending later authorization

## Overview

**Approved / Planned:** The application separates an app shell and UI system from a pure game engine and a data-driven content engine. Narrative content must not be hardcoded into React components. Game rules must not depend on presentation components.

**Implemented (M0):** Application entry, React Router shell, global styles with design tokens, accessible page structure, landing page, and not-found route.

**Not implemented in M0:** Engine modules, Zod case schemas, Zustand game store, persistence, scoring, and case content modules.

## High-level architecture

```
APP SHELL
   |
   +-- UI SYSTEM (screens, components)
   |
   +-- GAME ENGINE (state, rules, scoring)   [Planned — M1+]
   |
   +-- CONTENT ENGINE (case data, assets)    [Planned — M1/M3]
           |
           +-- VALIDATION (Zod)              [Planned — M1]
           |
           +-- PERSISTENCE (localStorage)    [Planned — M1]
```

## Planned case content schemas (M1)

Zod schemas will validate case packages before use. Expected domains:

- Case metadata (id, title, acts, difficulty, playtime)
- Characters
- Evidence (`EvidenceType`: document | photograph | audio | diagram | record | physical)
- Puzzles (`PuzzleType`: evidence-comparison | timeline-ordering | contradiction | classification | evidence-connection | final-verdict)
- Dialogue / interview trees with evidence-dependent unlocks
- Verdict questions and answer keys
- Unlock / progression rules

## Planned game state (M1)

Initial contract from the master plan:

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

Implementation may introduce more precise types and normalized structures while preserving the contract intent.

## Planned progression rules

- Evidence discovery and puzzle completion drive unlocks.
- Players can revisit evidence, interviews, and timeline without dead ends from incorrect answers.
- Solution content must not appear in player-facing UI before verdict submission.

## Planned puzzle engine

Structured puzzle definitions evaluated by pure functions. UI presents puzzles; engine validates answers and updates progression.

## Planned evidence system

Inventory, inspection, related evidence, unlock conditions, accessibility descriptions, and optional media with graceful degradation when assets are missing.

## Planned dialogue system

Branching interviews with evidence-dependent questions, contradiction challenges, and persistent progress.

## Planned verdict scoring

Deterministic weighted scoring:

| Category | Weight |
| --- | --- |
| Evidence discovery | 20% |
| Contradiction identification | 20% |
| Timeline reconstruction | 20% |
| Final conclusions | 30% |
| Distinguishing fact from speculation | 10% |

Ratings: Master Investigator, Skeptic, Detective, Amateur Sleuth, Back to the Evidence.

## Planned persistence

Versioned localStorage saves for case progress and settings. Invalid saves fail safely. No auth for the pitch prototype.

## Adding a new case without rewriting the app

**Planned model:**

1. Add `src/content/cases/case-00N/` with validated JSON/TS content and assets under `public/`.
2. Register the case in a case registry consumed by the content engine.
3. Engine and UI remain case-agnostic; only content and assets change.

## Testing strategy

| Layer | Focus | Status |
| --- | --- | --- |
| Unit | Engine rules, scoring, validation without UI | Planned M1+ |
| Component | Routing, pages, interactive UI | Implemented M0 smoke |
| E2E | Critical player flows | M0 smoke; full flows M10 |

## Stack notes (M0)

Compatible stables installed: React 19, Vite, Tailwind CSS v4 (`@tailwindcss/vite`), React Router, Zustand, Zod, Motion, Vitest, Testing Library, Playwright, ESLint, Prettier.

TypeScript pinned to 5.9 for compatibility with `typescript-eslint` (see `docs/DECISIONS.md`).
