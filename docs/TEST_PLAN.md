# Test Plan — The Evidence Room

**Source:** Master plan nonfunctional requirements and milestone acceptance criteria.

## Principles

- Tests are mandatory each milestone.
- Do not claim tests passed unless executed.
- Prefer deterministic assertions; no external network services for automated tests.
- Engine logic (M1+) must be unit-testable without rendering UI.

## Milestone 0 coverage (implemented)

| Area | Tests |
| --- | --- |
| Application rendering | Landing title and unofficial disclaimer |
| Routing | Home route renders landing |
| Not-found | Unknown path renders 404 page |
| E2E smoke | Playwright loads `/` and asserts identity copy |

## Milestone 1 coverage (implemented)

| Area | Tests |
| --- | --- |
| Content validation | Invalid unlock refs, duplicates, scoring refs; fixture accepts |
| Progression | Act boundary, locked next step, rejected actions leave state unchanged, final-act stay |
| Save/load | Valid restore; malformed; wrong case; bad schema version; structurally valid unknown IDs; memory storage double; rejected load preserves state + verdict answers |
| Scoring | Master-plan weights; known total/categories; deterministic repeat; ADR-009 save/reload score equality |
| Progression closeout | Final act `currentAct` remains a defined act number |
| Exit gate | `src/engine/exit-gate.test.ts` — discover, puzzle, unlock, save/reload, repeatable score |

## Planned later coverage

- **M3–M8:** Case completeness, puzzle solvability, interview unlocks, verdict explanations
- **M10:** Full E2E investigation flows, mobile/keyboard, accessibility gates

## Commands

- `npm run test` — Vitest watch
- `npm run test:run` — Vitest single run
- `npm run test:e2e` — Playwright (builds on preview server after production build for smoke)
