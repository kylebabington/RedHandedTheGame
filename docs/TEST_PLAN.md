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

## Planned later coverage

- **M1:** Schema validation, unlock rules, save/load, scoring determinism
- **M3–M8:** Case completeness, puzzle solvability, interview unlocks, verdict explanations
- **M10:** Full E2E investigation flows, mobile/keyboard, accessibility gates

## Commands

- `npm run test` — Vitest watch
- `npm run test:run` — Vitest single run
- `npm run test:e2e` — Playwright (builds on preview server after production build for smoke)
