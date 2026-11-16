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

## Milestone 2 coverage (implemented)

| Area | Tests |
| --- | --- |
| Landing identity | Title, unofficial disclaimer, Start investigation → `/cases`, no Continue |
| Flow | Landing → cases → intro → workspace shell |
| Registry | Playable fixture card; locked CASE_001 labeled Coming soon |
| Settings / Credits | Reachable via primary nav; Reset disabled; sound prefs copy |
| Preferences | Text size and reduced-motion store updates |
| E2E flow | Playwright walkthrough at 1440×900 and 390×844; overflow spot-check at 320px |
| E2E a11y | Skip link, focus after route change, large text on mobile, OS + in-app reduced motion |

## Planned later coverage

- **M3–M8:** Case completeness, puzzle solvability, interview unlocks, verdict explanations
- **M10:** Full E2E investigation flows, broader accessibility gates

## Commands

- `npm run test` — Vitest watch
- `npm run test:run` — Vitest single run
- `npm run test:e2e` — Playwright (builds on preview server after production build for smoke)
