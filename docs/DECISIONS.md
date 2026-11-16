# Decisions — The Evidence Room

Record of significant architectural and product decisions. Status labels: **Approved**, **Implemented**, **Superseded**.

---

## ADR-001 — Project workspace path

**Date:** 2026-11-14  
**Status:** Approved / Implemented (M0)

**Context:** The master plan examples use folder name `redhanded-evidence-room/`. The authorizing user instructed development to stay in the existing Cursor workspace.

**Decision:** Develop in `C:\dev\Personal\RedHandedTheGame`. Do not create or use `C:\dev\Personal\redhanded-evidence-room`.

**Consequences:** Target `src/` layout still follows the master plan. Only the repository folder name differs. Documented as an approved path deviation from the example path in the master specification.

---

## ADR-002 — Approved technology stack for M0

**Date:** 2026-11-14  
**Status:** Approved / Implemented (M0)

**Decision:** Use React 19, TypeScript (strict), Vite, Tailwind CSS v4 (`@tailwindcss/vite`), React Router, Zustand, Zod, Motion for React, Vitest, Testing Library, Playwright, ESLint, and Prettier. No backend, database, auth, or payments.

**Consequences:** Dependencies are recorded in `package.json` and `package-lock.json`. Zustand/Zod/Motion are installed for later milestones but not used to implement game systems in M0.

---

## ADR-003 — TypeScript 5.9 instead of Vite template TypeScript 7

**Date:** 2026-11-14  
**Status:** Approved / Implemented (M0)

**Context:** `create-vite` scaffolded TypeScript ~7.0.2. `typescript-eslint@8` peer range requires TypeScript `>=4.8.4 <6.1.0`, blocking a clean ESLint install.

**Decision:** Pin TypeScript to `~5.9.0` for compatible stable tooling with ESLint. Aligns with master plan guidance to use compatible stable versions rather than blindly pinning versions from scaffolding.

**Consequences:** Strict mode remains enabled. Revisit when `typescript-eslint` officially supports TypeScript 7+.

---

## ADR-004 — ESLint over Vite template oxlint default

**Date:** 2026-11-14  
**Status:** Approved / Implemented (M0)

**Context:** The Vite React-TS template defaulted to oxlint. The master plan requires ESLint and Prettier.

**Decision:** Remove oxlint; configure ESLint flat config with TypeScript ESLint, React Hooks, React Refresh, and Prettier compatibility.

---

## ADR-005 — M0 delivers shell only; engine starts at M1

**Date:** 2026-11-14  
**Status:** Approved / Implemented (M0)

**Decision:** Milestone 0 includes documentation, tooling, Cursor rules, design tokens, routing, placeholder landing, not-found, and smoke tests. Do not implement game engine, case schemas/content modules, evidence board, interviews, timeline/puzzles, verdict scoring, fan challenges, or the cinematic M2 interface.

**Consequences:** Architecture is documented in `docs/ARCHITECTURE.md` as planned. Code remains a minimal accessible foundation.

---

## ADR-006 — Declarative unlock condition union

**Date:** 2026-11-15
**Status:** Approved / Implemented (M1)

**Decision:** Unlock conditions are a Zod discriminated union: `always`, `evidenceAll`, `evidenceAny`, `puzzlesAll`, `dialogueCompleted`, `actAtLeast`, `all`, `any`. Case validation resolves every referenced ID.

**Consequences:** Progression rules stay data-driven. Nested `all`/`any` cover compound gates without custom code per case.

---

## ADR-007 — Act progression and final-act boundary

**Date:** 2026-11-15
**Status:** Approved / Implemented (M1)

**Decision:** Each act declares `completeWhen`. After a successful mutation, the engine advances `currentAct` while the current act’s condition is met. When the **final** act’s `completeWhen` passes, `currentAct` remains on that final act number and never advances past `acts.length`.

**Consequences:** `currentAct` always names a defined act. Callers treat final-act completion via puzzle/dialogue/verdict state, not a sentinel act index.

---

## ADR-008 — Evidence connections store case connection IDs

**Date:** 2026-11-15
**Status:** Approved / Implemented (M1)

**Decision:** `GameState.evidenceConnections` stores canonical connection definition IDs from case content (for example `CX_LOG_PHOTO`), not free-form pair encodings.

**Consequences:** Save validation can resolve connection IDs against the active case. Pair geometry remains content data.

---

## ADR-009 — Scoring derivation and verdict answers outside GameState

**Date:** 2026-11-15
**Status:** Approved / Implemented (M1)

**Decision:** `calculateScore(state, caseDef, verdictAnswers?)` uses master-plan weights (20/20/20/30/10) and rating bands. Category ratios: scored evidence discovery, contradiction puzzle completion, timeline order match, classification puzzle completion, and verdict answer matches. `GameState` persists only `verdictSubmitted`. Verdict answer maps are session data; the save envelope may optionally carry `verdictAnswers` so resume can score.

**Caller reload flow:** `submitVerdict(answers)` → `serialize()` (envelope includes `verdictAnswers`) → fresh `createGame(case)` → `loadSave(envelope)` restores session answers → `engine.calculateScore()` (uses restored answers by default) or `engine.calculateScore(engine.getVerdictAnswers())`. Scoring with only `getState()` and no answers yields 0 for final conclusions. A rejected `loadSave` leaves both `GameState` and session `verdictAnswers` unchanged.

**Consequences:** The GameState contract stays aligned with the master plan. Scoring remains deterministic and testable without a verdict UI (M8).

---

## ADR-010 — Pure engine API; Zustand optional in M1

**Date:** 2026-11-15
**Status:** Approved / Implemented (M1)

**Decision:** The public M1 surface is `createGame(caseDef)` (pure TypeScript). Persistence uses a `KeyValueStorage` port with an in-memory test double. Zustand is installed but not required for the exit gate; a React store may wrap the engine in later UI milestones.

**Consequences:** Engine tests run headless without rendering. UI milestones can adopt Zustand without rewriting rules.

---

## ADR-011 — Fixture case CASE_FIX_001 for M1

**Date:** 2026-11-15
**Status:** Approved / Implemented (M1)

**Decision:** M1 proves the engine with original fictional fixture `CASE_FIX_001` (“The Empty Locker”), not production `CASE_001` content.

**Consequences:** CASE_001 modules remain Milestone 3. The fixture exercises two acts, evidence unlocks, puzzles, dialogue, connections, timeline, save/load, and scoring.

---

## ADR-012 — M2 routes, registry, and settings preferences

**Date:** 2026-11-15
**Status:** Approved / Implemented (M2)

**Context:** Milestone 2 needs cinematic screens and FR-012 settings without wiring investigation gameplay or Continuable save restore.

**Decision:**

- Routes: `/`, `/cases`, `/cases/:caseId/intro`, `/cases/:caseId/investigate`, `/settings`, `/credits`.
- UI case registry lists playable `CASE_FIX_001` and locked concept `CASE_001` (“Coming soon”).
- Landing primary CTA is **Start investigation** → `/cases`. Continue investigation is deferred until a later milestone can validate save/restore.
- Settings use a Zustand store persisted to localStorage (`evidence-room-settings`) for sound prefs, volumes, reduced motion, and text size. Sound controls store preferences before audio is wired.
- Reset progress is present but disabled in M2 with an explanation (no supported progress clear path yet).
- Investigation workspace is shell-only; M1 engine contracts are unchanged. Zustand does not wrap `createGame` in M2.

**Consequences:** Visual identity and navigation ship without premature save UX. Later milestones can enable Continue/Reset against the existing engine persistence port.
