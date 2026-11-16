# CASE_001 — The Last Broadcast

**Status:** Approved canonical narrative from `docs/MASTER_PLAN.md` §§5–6.  
**Implementation status:** Implemented in Milestone 3 (`src/content/cases/case-001/`). Public case selector remains **Coming soon**; headless/dev access via `createGame(case001)` / `getCaseDefinition('CASE_001')`.

## Summary

| Field | Value |
| --- | --- |
| ID | `CASE_001` |
| Title | The Last Broadcast |
| Type | Original fictional mystery |
| Playtime | 18–25 minutes |
| Difficulty | Intermediate |
| Setting | Fictional independent radio station in England |

## Premise

At 11:47 p.m., investigative radio presenter Evelyn Cross apparently disappears from a locked recording studio during a live broadcast. Her final recorded words: “If you're listening to this, someone has been lying to you.” Eleven seconds of unexplained silence follow. Four people had access to the building.

## Characters

| Character | Role | Narrative function |
| --- | --- | --- |
| Evelyn Cross | Investigative journalist | Missing person |
| Daniel Mercer | Radio producer | Conceals part of the truth |
| Clara Voss | Station executive | Connected to underlying corruption |
| Marcus Reed | Security guard | Conceals a security-system incident |

All characters and organizations are fictional.

## Canonical solution (spoilers)

Evelyn staged her disappearance to protect an informant and expose evidence tampering. Daniel assisted via a maintenance corridor during a scheduled power interruption. Clara arranged for a contractor to obtain Evelyn's research. Marcus concealed an unauthorized security-system reset.

The disappearance, tampering, and corruption are connected but distinct. Do not reveal this solution in player-facing UI before verdict submission.

## Acts

### Act I — The Disappearance (5–7 min)

Evidence E001–E005. Puzzle 1: The Missing Eleven Seconds. Reward: unlock producer interview.

### Act II — Everyone Has a Version (8–10 min)

Evidence E006–E010. Puzzles: Producer's Timeline, Security Gap, Fact or Theory?

### Act III — The Final Broadcast (5–8 min)

Evidence E011–E014. Final reconstruction puzzle and verdict.

## Evidence register

| ID | Evidence | Purpose |
| --- | --- | --- |
| E001 | Studio photograph | Establishes the scene |
| E002 | Broadcast recording | Reveals audio anomaly |
| E003 | Studio access log | Access history |
| E004 | Handwritten note | Points to original feed |
| E005 | Door mechanism diagram | Challenges locked-room assumption |
| E006 | Producer statement | Inconsistent alibi |
| E007 | Security incident report | System reset |
| E008 | Maintenance schedule | Planned interruption |
| E009 | Executive correspondence | Possible motive |
| E010 | Original recording metadata | Tampering hypothesis |
| E011 | Maintenance corridor diagram | Alternative exit |
| E012 | Recovered audio segment | Confirms coordination |
| E013 | Research transfer record | Corruption subplot |
| E014 | Final timeline comparison | Reconstruction |

## Verdict and scoring

Questions and weighted scoring categories are defined in the master plan. Ratings range from The Master Investigator (90–100) to Back to the Evidence (0–39). Scoring is deterministic and time-independent.

---

## M3 progression map (spoilers)

Development / headless path uses the public `createGame` API. `verdictPrerequisite` requires `P_RECONSTRUCTION` plus E011–E014. `getReveal()` stays null until `isComplete()` (final-act requirements **and** accepted verdict). Premature `verdictSubmitted` flags in saves do not unlock the reveal.

| Gate | Player must | Information source |
| --- | --- | --- |
| Start Act I | Discover E001 | Always unlocked |
| Unlock E002–E005 | Discover prior Act I items | E001 (and E002→E004) |
| Solve `P_ELEVEN_SECONDS` | Submit `recording-altered` | E002 clean silence + E004 original-feed note (+ E001/E003/E005 context) |
| Unlock `D_DANIEL` / Act II | Complete Puzzle 1 | Progression reward |
| Unlock E006–E010 | Reach Act II (E010 also needs E004) | Act advance + E004 |
| Complete interviews | Finish Daniel, Marcus, Clara | Unlocks after P1 / E007 / E009 |
| Solve `P_PRODUCER_TIMELINE` | Submit `daniel-location-contradiction` | E006 “never left glass” vs E008 signed maintenance window + Daniel interview |
| Solve `P_SECURITY_GAP` | Submit `missing-record-not-proof` | E003 quiet gap + E007 reset note + Marcus interview |
| Solve `P_FACT_OR_THEORY` | Classify four statements | Act II evidence + interviews |
| Unlock Act III / E011–E014 | Finish Act II puzzles + interviews | Act `completeWhen` |
| Solve `P_RECONSTRUCTION` | Submit canonical five-event order | E011–E014 (+ prior chain) |
| Timeline scoring | `setTimelineOrder` with **same** player order | Same submission as reconstruction; never substitute the answer key |
| `submitVerdict` | Prerequisite met; option IDs valid | Incorrect options accepted for scoring; unknown IDs rejected |
| Reveal / complete | Accepted verdict + final-act requirements | `getReveal()` / `isComplete()` |

### Canonical reconstruction order

1. `T_THREAT` — Evelyn discovers the threat to her research
2. `T_ASSIST` — Daniel agrees to assist her
3. `T_INTERRUPTION` — The planned interruption occurs
4. `T_EXIT` — Evelyn leaves through the maintenance corridor
5. `T_ALTERED` — The altered broadcast creates a misleading disappearance narrative

### Clue → required answer justification (spoilers)

| Required answer | Visible clues that justify it |
| --- | --- |
| `recording-altered` | E002’s unnatural silence; E004 “pull the ORIGINAL feed”; E010 (Act II) confirms post-mix splice |
| `daniel-location-contradiction` | E006 claims he never left the glass; E008 shows he signed the interruption window; interview hedges about doors/logs |
| `missing-record-not-proof` | E003 gap with no door events; E007 unauthorized reset; Marcus: blank log ≠ entry/exit |
| Classification map | Air silence verified (E002/E010); Daniel’s glass claim is testimony (E006); hatch exit is inference (E005/E011); kidnapping is speculation |
| Reconstruction order | E014 board + E009/E013 threat/theft timing, E008 interruption, E011/E012 exit/coordination, E002/E010 altered narrative |
| Verdict `staged-exit` / `voluntary` / `daniel` | Reconstruction + E012 “Go—now” + hatch path |
| Verdict `broadcast-feed` | E004/E010 splice and generated silence |
| Verdict `research-theft` | E009 contractor email + E013 transfer under Clara’s code |
| Verdict `linked-distinct` | Clara’s separate retrieval vs Daniel’s assistance vs Marcus’s reset |

### Playthrough command

```bash
npx vitest run src/content/cases/case-001/playthrough.test.ts
```
