# REDHANDED: THE EVIDENCE ROOM

## Master Product Specification & Development Roadmap

**Version:** 1.0  
**Status:** Approved development baseline  
**Date:** November 14, 2026  
**Project type:** Interactive narrative mystery game  
**Primary objective:** Build a professional, playable prototype to pitch to the RedHanded podcast team.  
**Development environment:** Cursor + Windows + React + TypeScript

---

## 1. PROJECT SOURCE OF TRUTH

This document is the authoritative product specification for The Evidence Room.

All future Cursor prompts, development decisions, features, architecture changes, and acceptance tests must follow this specification.

We will maintain a permanent copy inside the project repository:

`docs/MASTER_PLAN.md`

Cursor must read this file before implementing each milestone.

### Source-of-truth hierarchy

When information conflicts, use this order:

1. `docs/MASTER_PLAN.md` — Product requirements and approved scope.
2. `docs/ARCHITECTURE.md` — Technical architecture.
3. `docs/CASE_001.md` — Canonical first-case narrative and puzzle specification.
4. `docs/DESIGN_SYSTEM.md` — Visual and interaction standards.
5. `docs/DECISIONS.md` — Approved architectural and product decisions.
6. Existing implementation — Actual code and tests.
7. Cursor prompts — Individual implementation instructions.

**Important:** Cursor prompts cannot silently override the master plan.

If a proposed implementation conflicts with the specification, Cursor must identify the conflict before making the change.

### Change-control policy

The plan can evolve, but changes must be deliberate.

Every approved change must include:

- What is changing.
- Why the change is necessary.
- Which requirements are affected.
- Whether the change affects scope, timeline, or architecture.
- Which documentation and tests need updating.

This prevents the project from gradually turning into something different from what we intended.

---

## 2. PRODUCT VISION

### Working title

**REDHANDED**  
**THE EVIDENCE ROOM**

**Tagline:** Every story has a second version.

This is a working, unofficial product concept. The pitch prototype must clearly state that it is not affiliated with or endorsed by RedHanded.

### The elevator pitch

The Evidence Room is an immersive interactive mystery experience inspired by the investigative storytelling, dark humor, and skeptical analysis associated with RedHanded.

Players examine evidence, question witnesses, reconstruct timelines, challenge assumptions, and uncover the truth behind original fictional mysteries.

The experience combines:

Detective investigation + interactive storytelling + podcast-inspired challenges.

The long-term vision is a game that RedHanded could adopt as an official interactive entertainment product.

### The pitch objective

We are not trying to prove that we can build a game.

We are trying to demonstrate that RedHanded could have a commercially viable, visually distinctive interactive product.

The prototype must communicate:

- This feels like a premium entertainment experience.
- The gameplay is genuinely enjoyable.
- The product fits the RedHanded audience.
- New content can be added without rebuilding the application.
- The technology is maintainable.
- The experience could eventually support monetization.
- The game respects the ethical responsibilities associated with true crime.

---

## 3. PRODUCT POSITIONING

### Target audience

**Primary**

Existing RedHanded listeners who enjoy:

- True crime.
- Mystery and investigative storytelling.
- Dark humor.
- Psychological analysis.
- Questioning conventional explanations.
- Discussing cases and competing theories.

**Secondary**

People who enjoy detective games, escape rooms, interactive fiction, and narrative puzzles.

**Tertiary**

Podcast listeners who might discover RedHanded through the game.

### Product differentiation

Most trivia games reward remembering information.

Most detective games focus exclusively on solving a fictional crime.

The Evidence Room rewards investigative reasoning.

Players must distinguish:

- Facts from assumptions.
- Evidence from testimony.
- Correlation from causation.
- Credible explanations from attractive theories.
- Actual wrongdoing from misleading appearances.

That distinction should be reflected in every case.

---

## 4. CORE GAME DESIGN

### The central gameplay loop

```
RECEIVE CASE
     |
     v
EXPLORE EVIDENCE
     |
     v
IDENTIFY CONTRADICTIONS
     |
     v
INTERVIEW WITNESSES
     |
     v
CONNECT CLUES
     |
     v
RECONSTRUCT TIMELINE
     |
     v
FORM HYPOTHESIS
     |
     v
SUBMIT VERDICT
     |
     v
RECEIVE CASE ANALYSIS
     |
     v
UNLOCK BONUS CONTENT
```

Players can move between evidence, interviews, and the timeline as the investigation progresses.

The experience should feel exploratory without becoming confusing.

### Three gameplay pillars

#### Pillar 1 — Investigation

The player acts as an investigator.

Features include:

- Evidence examination.
- Document inspection.
- Audio playback.
- Timeline reconstruction.
- Witness interviews.
- Evidence connections.
- Hypothesis testing.
- Final verdict.

#### Pillar 2 — Narrative entertainment

The player experiences a cinematic mystery.

Features include:

- Dramatic introductions.
- Environmental storytelling.
- Branching dialogue.
- Discoveries that change the interpretation of earlier events.
- Original narration.
- Carefully placed humor.
- Multiple possible investigative paths.

#### Pillar 3 — RedHanded fan experiences

The player engages with podcast-inspired content.

Features include:

- Investigative reasoning quizzes.
- Case-related knowledge challenges.
- Achievement titles.
- Bonus commentary concepts.
- Optional podcast trivia.
- Potential host integration after licensing.

**Critical distinction:** The first prototype must not depend on actual podcast recordings, official artwork, or copyrighted episode material.

---

## 5. FIRST CASE — THE LAST BROADCAST

### Case identifier

`CASE_001`

### Case title

The Last Broadcast

### Case type

Original fictional mystery.

### Target playtime

18–25 minutes.

### Difficulty

Intermediate.

### Setting

A fictional independent radio station in England.

### Central mystery

At 11:47 p.m., investigative radio presenter Evelyn Cross apparently disappears from a locked recording studio during a live broadcast.

Her final recorded words:

> If you're listening to this, someone has been lying to you.

The station loses power.

When emergency lighting activates, Evelyn is missing.

Her phone remains on the desk.

The studio door is locked.

The recording contains eleven seconds of unexplained silence.

Four people had access to the building.

### Canonical characters

| Character | Role | Narrative function |
| --- | --- | --- |
| Evelyn Cross | Investigative journalist | Missing person |
| Daniel Mercer | Radio producer | Conceals part of the truth |
| Clara Voss | Station executive | Connected to the underlying corruption |
| Marcus Reed | Security guard | Conceals a security-system incident |

All characters and organizations are fictional.

### Canonical solution

Evelyn staged her disappearance to protect an informant and expose evidence tampering.

Daniel assisted her departure through a maintenance corridor during a scheduled power interruption.

Clara had independently arranged for a contractor to obtain Evelyn's research.

Marcus concealed an unauthorized security-system reset.

The disappearance, the evidence tampering, and the underlying corruption are connected but distinct events.

The player must establish these distinctions through evidence.

### Narrative design constraint

The game must not reveal this solution before the player submits a verdict.

The solution must be represented in protected game logic or answer data, not casually exposed through visible interface text.

Client-side code cannot provide genuine secrecy against determined inspection, so this is a gameplay safeguard rather than a security guarantee.

---

## 6. CASE 001 — COMPLETE CONTENT STRUCTURE

The case will contain three acts.

### ACT I — THE DISAPPEARANCE

**Target duration:** 5–7 minutes.

#### Opening sequence

- A dark screen.
- Subtle radio static.
- A red recording indicator illuminates.
- The player hears an original fictional broadcast.
- Evelyn delivers her final statement.
- A power interruption occurs.
- The screen goes black.
- The case file opens.

#### Player objectives

- Understand the disappearance.
- Examine the studio.
- Identify the initial timeline.
- Discover inconsistencies.
- Unlock the first interview.

#### Evidence

| ID | Evidence | Gameplay purpose |
| --- | --- | --- |
| E001 | Studio photograph | Establishes the scene |
| E002 | Broadcast recording | Reveals audio anomaly |
| E003 | Studio access log | Establishes access history |
| E004 | Handwritten note | Directs attention to original feed |
| E005 | Door mechanism diagram | Challenges locked-room assumption |

#### Puzzle 1 — The Missing Eleven Seconds

Players compare the broadcast recording with the equipment log.

They discover that the eleven-second gap is inconsistent with the claimed equipment failure.

**Success condition:** Identify the recording as potentially altered.

**Reward:** Unlock the producer interview.

### ACT II — EVERYONE HAS A VERSION

**Target duration:** 8–10 minutes.

#### Player objectives

- Interview available witnesses.
- Compare statements.
- Discover contradictions.
- Reconstruct the timeline.
- Determine which evidence can be trusted.

#### Additional evidence

| ID | Evidence | Gameplay purpose |
| --- | --- | --- |
| E006 | Producer statement | Introduces an inconsistent alibi |
| E007 | Security incident report | Reveals a system reset |
| E008 | Maintenance schedule | Establishes the planned interruption |
| E009 | Executive correspondence | Establishes a possible motive |
| E010 | Original recording metadata | Supports the tampering hypothesis |

#### Puzzle 2 — The Producer's Timeline

Players compare Daniel's account with the equipment log and maintenance schedule.

**Success condition:** Identify the contradiction between his claimed location and the recorded sequence.

#### Puzzle 3 — The Security Gap

Players examine access logs and the security report.

**Success condition:** Determine that a missing access record does not prove someone entered or exited the building.

#### Puzzle 4 — Fact or Theory?

Players classify statements as:

- Verified evidence.
- Witness claim.
- Reasonable inference.
- Unsupported speculation.

This puzzle reinforces the game's core identity.

### ACT III — THE FINAL BROADCAST

**Target duration:** 5–8 minutes.

#### Player objectives

- Recover the meaning of the altered recording.
- Connect the major evidence.
- Reconstruct the disappearance.
- Identify separate acts of wrongdoing.
- Submit a final verdict.

#### Final evidence

| ID | Evidence | Gameplay purpose |
| --- | --- | --- |
| E011 | Maintenance corridor diagram | Establishes an alternative exit |
| E012 | Recovered audio segment | Confirms coordination |
| E013 | Research transfer record | Supports the corruption subplot |
| E014 | Final timeline comparison | Enables reconstruction |

#### Final puzzle — The Reconstruction

Players arrange five key events in chronological order.

The correct reconstruction establishes:

1. Evelyn discovers the threat to her research.
2. Daniel agrees to assist her.
3. The planned interruption occurs.
4. Evelyn leaves through the maintenance corridor.
5. The altered broadcast creates a misleading disappearance narrative.

#### Verdict questions

The player must answer:

- What happened to Evelyn?
- Was the disappearance voluntary?
- Who assisted her?
- Which evidence was manipulated?
- What separate wrongdoing occurred?
- Which conclusions are supported by evidence?

#### Verdict scoring

| Category | Weight |
| --- | --- |
| Evidence discovery | 20% |
| Contradiction identification | 20% |
| Timeline reconstruction | 20% |
| Final conclusions | 30% |
| Distinguishing fact from speculation | 10% |
| **Total** | **100%** |

No score should depend on how quickly the player completes the case.

Players must be able to finish the narrative even after making incorrect choices.

#### Investigator ratings

| Score | Rating |
| --- | --- |
| 90–100 | The Master Investigator |
| 75–89 | The Skeptic |
| 60–74 | The Detective |
| 40–59 | The Amateur Sleuth |
| 0–39 | Back to the Evidence |

The scoring engine must use deterministic rules and provide an explanation for each result.

---

## 7. FUNCTIONAL REQUIREMENTS

### FR-001 — Cinematic landing screen

The game must provide:

- A polished title screen.
- Animated visual elements.
- Start investigation button.
- Continue investigation button when applicable.
- Settings.
- Credits.
- Unofficial prototype disclaimer.

### FR-002 — Case selection

The game must support multiple cases through a data-driven case registry.

The pitch prototype will contain one playable case.

Additional cases may appear as clearly labeled future concepts, but not as misleading playable content.

### FR-003 — Investigation workspace

The investigation workspace must provide:

- Current objective.
- Evidence inventory.
- Case progress.
- Navigation between investigative tools.
- Access to previously discovered clues.
- Save/resume behavior.

### FR-004 — Evidence viewer

Each evidence item must support:

- Unique identifier.
- Title.
- Description.
- Asset reference.
- Discovery state.
- Inspection state.
- Related evidence.
- Unlock conditions.
- Accessibility description.

Evidence types:

```ts
type EvidenceType =
  | "document"
  | "photograph"
  | "audio"
  | "diagram"
  | "record"
  | "physical";
```

### FR-005 — Evidence board

Players must be able to connect related evidence.

The board must support:

- Selecting evidence.
- Creating connections.
- Validating relationships.
- Displaying discoveries.
- Removing connections.
- Keyboard-accessible alternatives.

Drag-and-drop may enhance the interface, but must not be required to complete the game.

### FR-006 — Interview system

Interviews must support:

- Branching dialogue.
- Evidence-dependent questions.
- Conditional responses.
- Contradiction challenges.
- Persistent interview progress.

### FR-007 — Timeline system

Players must be able to:

- Review discovered events.
- Arrange events chronologically.
- Submit a reconstruction.
- Receive feedback.
- Revise their reconstruction.

### FR-008 — Puzzle engine

Puzzles must be defined through structured content.

Supported puzzle types:

```ts
type PuzzleType =
  | "evidence-comparison"
  | "timeline-ordering"
  | "contradiction"
  | "classification"
  | "evidence-connection"
  | "final-verdict";
```

### FR-009 — Progress persistence

The game must save:

- Current case.
- Current act.
- Discovered evidence.
- Completed puzzles.
- Interview progress.
- Evidence connections.
- Timeline state.
- Settings.

The initial implementation will use browser storage.

No authentication is required for the pitch prototype.

### FR-010 — Verdict system

The verdict engine must:

- Evaluate answers deterministically.
- Calculate a score.
- Explain the score.
- Identify missed evidence.
- Award an investigator rating.
- Support replay.

### FR-011 — Fan challenge

The prototype must include one short optional challenge demonstrating how podcast-related gameplay could work.

It must use original fictional material or general investigative reasoning questions.

Official RedHanded episode trivia is reserved for a licensed version.

### FR-012 — Settings

Required settings:

- Sound enabled/disabled.
- Music volume.
- Effects volume.
- Reduced motion.
- Text size preference.
- Reset progress with confirmation.

### FR-013 — Accessibility

Required:

- Keyboard navigation.
- Visible focus states.
- Screen-reader labels.
- Captions/transcripts.
- Reduced-motion support.
- Sufficient color contrast.
- Touch-friendly controls.

### FR-014 — Error handling

The game must recover gracefully from:

- Missing optional assets.
- Invalid saved state.
- Unsupported audio playback.
- Interrupted sessions.
- Corrupted case data.

### FR-015 — Demo presentation mode

A pitch-only presentation mode may allow the developer to jump to selected scenes.

It must be clearly separated from normal gameplay.

The pitch must not imply that presentation shortcuts are part of the player experience.

---

## 8. NONFUNCTIONAL REQUIREMENTS

| Area | Requirement |
| --- | --- |
| Type safety | TypeScript strict mode |
| Content validation | Zod schemas |
| Testing | Unit, integration, and end-to-end |
| Responsiveness | Desktop, tablet, mobile |
| Performance | Smooth interactions on typical modern devices |
| Accessibility | WCAG 2.2 AA target |
| Security | No unnecessary secrets or sensitive user data |
| Persistence | Versioned saved-game schema |
| Maintainability | Data-driven case engine |
| Deployment | HTTPS production preview |
| Reliability | No known progression-blocking defects |
| Privacy | No tracking by default |

Performance targets for the deployed demo:

- Lighthouse Performance: 90+ on the agreed test profile.
- Lighthouse Accessibility: 95+.
- No major layout shifts.
- No uncaught runtime errors during the full case.
- No unnecessary network requests during gameplay.

These are acceptance targets, not claims about current performance.

---

## 9. VISUAL DESIGN SYSTEM

### Design philosophy

Premium editorial true crime meets cinematic detective interface.

The game should feel more like an interactive investigative documentary than a dashboard.

### Primary palette

| Token | Color | Usage |
| --- | --- | --- |
| Background | `#0B0B0D` | Main background |
| Surface | `#17171B` | Panels |
| Elevated | `#232329` | Dialogs and overlays |
| Crimson | `#B91C2B` | Primary accent |
| Crimson Bright | `#E33445` | Interactive highlights |
| Paper | `#E9E1D2` | Evidence documents |
| White | `#F5F3EF` | Primary text |
| Muted | `#A5A2A3` | Secondary text |
| Border | `#39373C` | Dividers |
| Success | `#79A88C` | Confirmed findings |
| Warning | `#D6A45B` | Unresolved findings |

These are proposed game colors, not verified official RedHanded brand specifications.

### Typography

| Role | Font |
| --- | --- |
| Display | Fraunces |
| Interface | DM Sans |
| Metadata | IBM Plex Mono |

Fonts must be loaded through approved distribution methods and checked for appropriate licenses.

### Spacing

Use an 8px-based spacing system.

- 4px
- 8px
- 12px
- 16px
- 24px
- 32px
- 48px
- 64px
- 96px

### Border radius

- Small: 4px
- Medium: 8px
- Large: 12px

Avoid excessive rounded corners.

The interface should feel precise, serious, and editorial.

### Animation principles

Animations must communicate something.

Examples:

- A case file opening.
- A clue being discovered.
- A document sliding into view.
- A connection forming between evidence.
- A contradiction being revealed.
- A final verdict being stamped.

Avoid:

- Constant background movement.
- Unnecessary spinning.
- Long unskippable sequences.
- Excessive particle effects.
- Animation that delays interaction.

### Audio direction

Use original audio assets.

Required categories:

- Ambient atmosphere.
- UI interaction sounds.
- Evidence discovery.
- Puzzle success.
- Dramatic transitions.
- Original fictional broadcast.

No unauthorized host voice imitation or copyrighted podcast recordings.

---

## 10. TECHNICAL ARCHITECTURE

### Approved stack

| Layer | Technology |
| --- | --- |
| Frontend | React 19 |
| Language | TypeScript |
| Build | Vite |
| Styling | Tailwind CSS v4 |
| Routing | React Router |
| State | Zustand |
| Validation | Zod |
| Animation | Motion for React |
| Unit testing | Vitest |
| Component testing | Testing Library |
| E2E testing | Playwright |
| Deployment | Vercel |
| Persistence | Local storage initially |

Use current compatible stable versions rather than blindly pinning every dependency to a version in this document.

### Architecture

```
                    APP SHELL
                        |
           +------------+------------+
           |                         |
       UI SYSTEM                 GAME ENGINE
           |                         |
     +-----+-----+          +--------+--------+
     |           |          |        |        |
  SCREENS    COMPONENTS   STATE   RULES   SCORING
     |           |          |        |        |
     +-----------+----------+--------+--------+
                            |
                       CONTENT ENGINE
                            |
                    +-------+-------+
                    |               |
                CASE DATA        ASSETS
                    |
                 VALIDATION
                    |
                 PERSISTENCE
```

### Architectural rules

- Narrative content must not be hardcoded into React components.
- Game rules must not depend on presentation components.
- Scoring must be deterministic.
- Case data must be validated before use.
- State changes must occur through defined actions.
- Save data must be versioned.
- Game logic must be testable without rendering the UI.
- Components must not import private implementation details from unrelated modules.
- Accessibility must be part of the initial component design.
- The game must work without a backend for the first release.

---

## 11. PROJECT DIRECTORY STRUCTURE

Target structure:

```
redhanded-evidence-room/
│
├── docs/
│   ├── MASTER_PLAN.md
│   ├── ARCHITECTURE.md
│   ├── DESIGN_SYSTEM.md
│   ├── CASE_001.md
│   ├── ROADMAP.md
│   ├── DECISIONS.md
│   ├── TEST_PLAN.md
│   ├── PITCH_STRATEGY.md
│   └── PROGRESS.md
│
├── public/
│   ├── images/
│   ├── audio/
│   └── textures/
│
├── src/
│   ├── app/
│   ├── components/
│   │   ├── common/
│   │   ├── evidence/
│   │   ├── interviews/
│   │   ├── puzzles/
│   │   └── layout/
│   │
│   ├── features/
│   │   ├── investigation/
│   │   ├── evidence-board/
│   │   ├── interviews/
│   │   ├── timeline/
│   │   ├── puzzles/
│   │   ├── verdict/
│   │   └── fan-challenge/
│   │
│   ├── engine/
│   │   ├── schemas/
│   │   ├── rules/
│   │   ├── scoring/
│   │   ├── progression/
│   │   └── persistence/
│   │
│   ├── content/
│   │   └── cases/
│   │       └── case-001/
│   │
│   ├── hooks/
│   ├── stores/
│   ├── styles/
│   ├── types/
│   └── test/
│
├── e2e/
├── scripts/
├── package.json
├── vite.config.ts
└── README.md
```

This is the target architecture, not a requirement to create every empty folder immediately.

---

## 12. COMPLETE DEVELOPMENT ROADMAP

We will use 12 milestones.

Each milestone must pass its acceptance criteria before proceeding.

| Milestone | Deliverable | Priority |
| --- | --- | --- |
| M0 | Repository and source-of-truth setup | Critical |
| M1 | Application foundation and game engine | Critical |
| M2 | Cinematic visual foundation | Critical |
| M3 | Case content and narrative engine | Critical |
| M4 | Evidence investigation system | Critical |
| M5 | Interactive evidence board | Critical |
| M6 | Interviews and branching dialogue | Critical |
| M7 | Timeline and puzzles | Critical |
| M8 | Final verdict and scoring | Critical |
| M9 | Fan experience and polish | High |
| M10 | Testing, accessibility, and deployment | Critical |
| M11 | Professional pitch package | Critical |

Estimated development: Approximately 5–8 weeks of focused part-time work. This is a planning estimate, not a deadline.

### MILESTONE 0 — PROJECT FOUNDATION

**Goal**

Establish the repository, permanent specifications, and development safeguards.

**Tasks**

- Inspect the selected project directory.
- Initialize Git if necessary.
- Create the React/Vite project.
- Install the approved dependencies.
- Configure strict TypeScript.
- Configure linting and formatting.
- Configure Vitest.
- Configure Playwright.
- Create the documentation structure.
- Save the master plan.
- Establish project-specific Cursor rules.
- Add an initial README.

**Deliverables**

- Working development server
- Git repository
- Master specification
- Architecture documentation
- Design documentation
- Roadmap
- Testing configuration
- Cursor project rules

**Acceptance criteria**

- `npm run dev` starts successfully.
- TypeScript checks pass.
- Linting passes.
- Unit tests run.
- Playwright is configured.
- Production build succeeds.
- Source-of-truth documents exist.
- Cursor rules reference the master plan.
- No protected RedHanded assets are included.

**Exit gate**

GO only when the project is reproducible from a clean installation.

### MILESTONE 1 — GAME ENGINE

**Goal**

Build the foundation that will power every future case.

**Tasks**

Implement:

- Case schemas.
- Evidence schemas.
- Puzzle schemas.
- Dialogue schemas.
- Progression rules.
- Unlock conditions.
- Game state.
- Save/load.
- Scoring foundation.
- Content validation.

**Required game state**

```ts
interface GameState {
  schemaVersion: number;
  caseId: string;
  currentAct: number;
  discoveredEvidence: string[];
  inspectedEvidence: string[];
  completedPuzzles: string[];
  unlockedDialogue: string[];
  completedDialogue: string[];
  evidenceConnections: string[];
  timelineOrder: string[];
  verdictSubmitted: boolean;
}
```

This is an initial contract. The implementation may introduce more precise types, identifiers, and normalized structures.

**Acceptance criteria**

- Invalid case data is rejected.
- Unlock conditions work.
- Evidence discovery persists.
- Puzzle completion updates progression.
- Save/load restores valid state.
- Invalid saved state fails safely.
- Scoring produces repeatable results.
- Unit tests cover critical rules.

**Exit gate**

The engine can run a small test case without requiring the final UI.

### MILESTONE 2 — CINEMATIC VISUAL FOUNDATION

**Goal**

Make the game immediately recognizable as a premium entertainment product.

**Screens**

- Landing screen.
- Case selection.
- Case introduction.
- Investigation workspace shell.
- Settings.
- Credits.

**Visual elements**

- Dramatic typography.
- Crimson accents.
- Atmospheric background.
- Animated case-file transition.
- Original textures.
- Responsive layouts.
- Custom buttons.
- Consistent navigation.

**Acceptance criteria**

- The landing screen looks polished at desktop and mobile sizes.
- Navigation works.
- Motion respects reduced-motion settings.
- Text is readable.
- No layout overflow at common viewport sizes.
- No placeholder branding is presented as official.
- No major console errors.

**Exit gate**

A visitor can open the prototype and immediately understand its visual identity and purpose.

### MILESTONE 3 — CASE 001 CONTENT ENGINE

**Goal**

Implement the complete narrative structure for The Last Broadcast.

**Tasks**

Create:

- Case metadata.
- Character profiles.
- Three acts.
- Fourteen evidence records.
- Interview dialogue.
- Puzzle definitions.
- Unlock conditions.
- Final verdict data.
- Narrative reveal sequence.
- Case completion state.

**Content validation**

Verify:

- Every referenced evidence ID exists.
- Every dialogue reference resolves.
- Every required clue is reachable.
- Every puzzle has a valid solution.
- The case can be completed.
- No required progression path is circular.
- No solution is displayed prematurely.

**Exit gate**

The complete case is structurally playable using simple development interfaces.

### MILESTONE 4 — EVIDENCE INVESTIGATION

**Goal**

Build the primary investigative experience.

**Features**

- Evidence inventory.
- Document viewer.
- Image inspection.
- Audio evidence player.
- Evidence discovery notifications.
- Evidence details.
- Related evidence.
- Inspection progress.

**Acceptance criteria**

- All fourteen evidence items can be discovered through intended gameplay.
- Documents display correctly.
- Audio has transcripts.
- Discovery state persists.
- Evidence cannot be unlocked incorrectly.
- Missing optional media does not break progression.

**Exit gate**

Players can investigate and understand evidence without developer assistance.

### MILESTONE 5 — EVIDENCE BOARD

**Goal**

Create the signature interactive feature.

**Features**

- Evidence cards.
- Connection lines.
- Connection validation.
- Discovery feedback.
- Evidence grouping.
- Keyboard interaction.
- Touch interaction.
- Connection persistence.

**Visual direction**

The board should resemble a modern digital investigation wall rather than a generic diagram editor.

**Acceptance criteria**

- Valid connections trigger discoveries.
- Invalid connections provide useful feedback.
- Players can revise connections.
- Connections persist.
- Keyboard and touch alternatives work.
- No progression depends on drag-and-drop.

**Exit gate**

The evidence board is enjoyable, understandable, and accessible.

### MILESTONE 6 — INTERVIEWS

**Goal**

Introduce character-driven investigation.

**Features**

- Character portraits.
- Dialogue presentation.
- Question selection.
- Evidence-dependent responses.
- Contradiction challenges.
- Interview completion tracking.
- Transcript history.

**Acceptance criteria**

- All required interviews work.
- Questions unlock correctly.
- Evidence challenges produce appropriate responses.
- Dialogue state persists.
- Players cannot access locked dialogue through normal navigation.
- Interview content is consistent with the canonical case solution.

**Exit gate**

The player can uncover meaningful contradictions through conversation.

### MILESTONE 7 — TIMELINE AND PUZZLES

**Goal**

Complete the investigative gameplay.

**Features**

- Timeline reconstruction.
- Evidence comparison.
- Classification puzzle.
- Contradiction puzzle.
- Final reconstruction puzzle.
- Feedback.
- Retry behavior.

**Acceptance criteria**

- All required puzzles are solvable.
- Incorrect answers do not create dead ends.
- Puzzle state persists.
- Feedback does not reveal unrelated future solutions.
- Timeline interactions work without drag-and-drop.
- All puzzle logic has unit tests.

**Exit gate**

The entire investigative portion of Case 001 is playable.

### MILESTONE 8 — VERDICT AND ENDING

**Goal**

Deliver a satisfying conclusion.

**Features**

- Final verdict interface.
- Evidence-based scoring.
- Investigator rating.
- Case explanation.
- Missed evidence report.
- Final cinematic reveal.
- Replay option.
- Case completion summary.

**Acceptance criteria**

- Every verdict question can be answered.
- Scoring is deterministic.
- Scores remain within 0–100.
- The explanation matches the submitted answers.
- Incorrect conclusions receive meaningful feedback.
- The canonical solution is revealed only at the appropriate time.
- Replay resets the intended state.

**Exit gate**

Case 001 can be completed from beginning to end.

### MILESTONE 9 — FAN EXPERIENCE AND POLISH

**Goal**

Demonstrate the game's potential as a RedHanded product.

**Features**

- Optional investigative challenge.
- Achievement titles.
- Bonus case commentary concept.
- Refined transitions.
- Original sound design.
- Atmospheric effects.
- Better loading states.
- Improved visual assets.
- Credits and attribution.

**Important**

The fan challenge must not require official RedHanded intellectual property.

Host recordings, official episode material, and branded bonus content remain proposed features pending permission.

**Exit gate**

The experience feels intentionally designed rather than assembled from disconnected features.

### MILESTONE 10 — QUALITY ASSURANCE AND DEPLOYMENT

**Goal**

Prepare a reliable private demo.

**Testing requirements**

Unit tests:

- Case validation.
- Unlock rules.
- Evidence discovery.
- Puzzle validation.
- Scoring.
- Save/load.
- State migration.

Integration tests:

- Evidence discovery updates UI.
- Puzzle completion unlocks content.
- Interviews react to evidence.
- Timeline completion updates progression.
- Verdict submission displays correct results.

End-to-end tests:

- New game.
- Save/resume.
- Full successful investigation.
- Incorrect-answer recovery.
- Mobile navigation.
- Keyboard navigation.
- Reset progress.
- Case completion.

**Deployment**

Deploy to a private or access-controlled preview environment.

A hidden URL alone is not adequate access control.

**Acceptance criteria**

- All critical tests pass.
- No known progression blockers.
- No critical accessibility failures.
- No major responsive layout defects.
- Production build succeeds.
- Deployed experience matches local behavior.
- Private demo access is verified.
- All included assets have documented provenance and usage rights.

**Exit gate**

PITCH DEMO READY.

### MILESTONE 11 — PROFESSIONAL PITCH PACKAGE

**Goal**

Present The Evidence Room as a credible product opportunity.

**Deliverables**

1. **Private playable demo** — A stable, polished version of Case 001.
2. **Pitch deck** — Approximately 10–12 slides covering:
   - The opportunity.
   - The product.
   - Why RedHanded.
   - The gameplay experience.
   - The visual identity.
   - The first case.
   - Audience engagement.
   - Potential monetization.
   - Technical scalability.
   - Collaboration requirements.
   - Proposed next steps.
   - Live demo invitation.
3. **Promotional trailer** — Target length: 60–90 seconds. Show actual gameplay wherever possible. Do not misrepresent mockups as implemented features.
4. **Product one-pager** — A concise summary of the game and the proposed partnership.
5. **Commercial proposal** — Outline possible collaboration models:
   - Licensed game development.
   - Commissioned development.
   - Revenue sharing.
   - Prototype acquisition.
   - Ongoing development partnership.

These are negotiation options, not predetermined commercial terms.

6. **Technical documentation** — Include architecture, technology stack, content expansion model, testing results, hosting requirements, maintenance considerations.
7. **Outreach email** — A short, professional introduction with a private demo link and clear request for a conversation.

**Exit gate**

READY FOR REDHANDED OUTREACH.

---

## 13. DEVELOPMENT RULES FOR CURSOR

These rules apply to every milestone.

### Rule 1 — One milestone at a time

Cursor must not implement future milestones without authorization.

### Rule 2 — Inspect before editing

Cursor must inspect:

- Repository status.
- Relevant source files.
- Existing tests.
- Master plan.
- Architecture.
- Progress documentation.

### Rule 3 — No unnecessary rewrites

Do not replace working systems merely because another approach seems cleaner.

### Rule 4 — No silent scope expansion

New features must be approved before implementation.

### Rule 5 — Tests are mandatory

Every milestone must include appropriate tests.

### Rule 6 — No fabricated verification

Cursor must distinguish:

- Tests actually executed.
- Tests not executed.
- Tests that failed.
- Tests blocked by the environment.

### Rule 7 — No unauthorized destructive actions

Do not:

- Delete unrelated files.
- Reset Git history.
- Force-push.
- Remove existing projects.
- Overwrite uncommitted changes.
- Modify unrelated system configuration.

### Rule 8 — Documentation stays current

After each milestone, update:

- `docs/PROGRESS.md`
- `docs/DECISIONS.md`

Update other documents when relevant.

### Rule 9 — Preserve creative consistency

New interfaces must use the approved design system.

New narrative content must remain consistent with the case specification.

### Rule 10 — Stop at the milestone gate

Cursor must report results and wait for approval before proceeding.

---

## 14. MILESTONE REPORTING FORMAT

Every Cursor milestone must end with this report:

```
MILESTONE:
STATUS: PASS / PARTIAL / BLOCKED / FAIL

IMPLEMENTED:
- ...

FILES CHANGED:
- ...

TEST RESULTS:
- Typecheck:
- Lint:
- Unit tests:
- Integration tests:
- E2E tests:
- Production build:

ACCEPTANCE CRITERIA:
- Passed:
- Failed:
- Not verified:

ARCHITECTURAL DECISIONS:
- ...

KNOWN ISSUES:
- ...

SOURCE-OF-TRUTH UPDATES:
- ...

GIT STATUS:
- Branch:
- Commit:
- Uncommitted changes:

NEXT RECOMMENDED ACTION:
- ...

GO / NO-GO:
- ...
```

A milestone is not complete merely because Cursor says it is complete.

It must meet the specified acceptance criteria.

---

## 15. THE FIRST CURSOR PROMPT

### START HERE — MILESTONE 0

This is the first prompt to paste into Cursor.

Before running it: Create or open a dedicated project folder, for example:

`C:\dev\Personal\redhanded-evidence-room`

Do not run the prompt from a parent folder containing other projects.

Also, copy this entire master specification into the Cursor conversation or save it as `docs/MASTER_PLAN.md` before asking Cursor to implement anything. The prompt below explicitly requires Cursor to stop if it cannot access the complete specification.

### Cursor Prompt 001 — Project Foundation and Source of Truth

```
REDHANDED: THE EVIDENCE ROOM
MILESTONE 0 — PROJECT FOUNDATION

You are the lead software architect, senior React/TypeScript engineer, technical game designer, and QA engineer for a professional interactive mystery game called The Evidence Room.

The project is an unofficial concept intended for a future pitch to the RedHanded podcast team.

Our objective is to develop a premium, playable, technically maintainable game prototype that could realistically be presented as a potential official RedHanded product.

This is not a generic trivia website.

It is a cinematic detective experience combining investigative gameplay, branching storytelling, evidence analysis, puzzle solving, and optional podcast-inspired fan experiences.

SOURCE OF TRUTH

The authoritative specification is:

docs/MASTER_PLAN.md

The master specification is titled:

REDHANDED: THE EVIDENCE ROOM — Master Product Specification & Development Roadmap, Version 1.0, November 14, 2026.

Read the entire specification before making implementation decisions.

If the file does not exist, check whether the full specification was supplied in this Cursor conversation.

If neither source contains the complete specification, STOP and request it.

Do not invent missing requirements.

Do not replace the master specification with a summary.

Preserve the complete specification verbatim in docs/MASTER_PLAN.md, apart from formatting changes necessary for valid Markdown.

The master plan governs all development.

Any proposed deviation must be documented and approved before implementation.

CURRENT MILESTONE

Implement Milestone 0 only.

Do not implement Milestone 1 or later features.

ENVIRONMENT

Development environment:

Windows 11
Cursor
Node.js
npm
Git

Project location:

C:\dev\Personal\redhanded-evidence-room

Verify the actual working directory before making changes.

Never assume that the terminal is in the correct directory.

APPROVED TECHNOLOGY

Use:

React 19
TypeScript with strict mode
Vite
Tailwind CSS v4
React Router
Zustand
Zod
Motion for React
Vitest
Testing Library
Playwright
ESLint
Prettier

Use compatible stable package versions.

Do not add a backend, database, authentication service, or payment integration.

Do not install unnecessary packages.

TASK 1 — INSPECT THE ENVIRONMENT

Before modifying files:

Print the current working directory.
Verify the project directory.
Check Node.js and npm versions.
Check Git availability.
Inspect existing files.
Check whether the directory is already a Git repository.
Check for uncommitted changes.
Check available disk space on the project drive.

If the project directory contains unrelated work, STOP.

If disk space is critically low, STOP and report the problem.

Do not delete files to make room.

TASK 2 — INITIALIZE THE PROJECT

If the directory is empty:

Initialize a Vite React TypeScript project.
Install dependencies.
Configure Tailwind CSS v4.
Configure React Router.
Configure Zustand.
Configure Zod.
Configure Motion for React.
Configure Vitest and Testing Library.
Configure Playwright.
Configure ESLint and Prettier.

Use npm.

Avoid global installations unless absolutely necessary.

TASK 3 — CONFIGURE PROJECT QUALITY

Configure:

Strict TypeScript checking.
ESLint.
Prettier.
Vitest.
React Testing Library.
Playwright.
Appropriate npm scripts.
Sensible path aliases.
Git ignore rules.

Required npm scripts:

dev
build
preview
typecheck
lint
test
test:run
test:e2e

Add formatting scripts if appropriate.

TASK 4 — ESTABLISH THE DOCUMENTATION SYSTEM

Create:

docs/MASTER_PLAN.md

docs/ARCHITECTURE.md

docs/DESIGN_SYSTEM.md

docs/CASE_001.md

docs/ROADMAP.md

docs/DECISIONS.md

docs/TEST_PLAN.md

docs/PITCH_STRATEGY.md

docs/PROGRESS.md

The master plan must contain the complete authoritative specification.

The supporting documents should organize and elaborate on relevant portions of that specification without changing approved requirements.

Do not fabricate implementation status.

Clearly distinguish:

Approved requirements.
Planned features.
Implemented features.
Future proposals.

TASK 5 — CREATE CURSOR PROJECT RULES

Create an appropriate project rule in:

.cursor/rules/

The rule must instruct Cursor to:

Read docs/MASTER_PLAN.md before implementation.
Read relevant supporting documentation.
Implement only the authorized milestone.
Preserve the established architecture.
Avoid unnecessary rewrites.
Add tests for implemented behavior.
Run relevant verification.
Update progress documentation.
Record important decisions.
Stop at milestone boundaries.
Never silently change product requirements.
Never claim tests passed unless executed.
Never use unauthorized RedHanded intellectual property.
Never commit or push without explicit authorization.

Use the currently supported Cursor project-rule format.

TASK 6 — CREATE THE APPLICATION FOUNDATION

Build only a minimal, functional application shell.

Include:

Application entry point.
Router setup.
Global styles.
Design token foundation.
Basic accessible page structure.
A simple placeholder landing page.
Not-found route.
Test setup.

The placeholder page should identify the project as:

"The Evidence Room"

Include:

"An unofficial interactive mystery game concept."

Do not use official RedHanded logos, podcast artwork, host likenesses, or recordings.

Do not attempt to create the complete cinematic interface yet.

That belongs to Milestone 2.

TASK 7 — PREPARE THE GAME ARCHITECTURE

Document the planned architecture.

Do not fully implement the game engine.

Describe:

Case content schemas.
Game state.
Progression rules.
Puzzle engine.
Evidence system.
Dialogue system.
Verdict scoring.
Persistence.
Testing strategy.

Keep narrative content separate from game logic.

Explain how new cases can be added without rewriting the application.

TASK 8 — INITIAL TESTS

Create a small initial test suite covering:

Application rendering.
Basic routing.
Not-found behavior.
A minimal Playwright smoke test.

Use reliable, deterministic assertions.

Do not create tests that require external services.

TASK 9 — VERIFICATION

Run:

TypeScript typecheck.
ESLint.
Unit tests.
Production build.
Playwright smoke test.

If Playwright browser installation is required, explain the action and install only the necessary browser components when safe.

Do not hide errors.

Fix issues within Milestone 0 scope.

If verification cannot complete, document the blocker.

TASK 10 — DOCUMENTATION AND REPORTING

Update:

docs/PROGRESS.md

Record:

Milestone 0 status.
Completed work.
Verification results.
Known issues.
Next milestone.

Update:

docs/DECISIONS.md

Record significant architectural decisions.

Provide a final report in this format:

MILESTONE:
STATUS:

IMPLEMENTED:

FILES CHANGED:

TEST RESULTS:

Typecheck:
Lint:
Unit tests:
E2E tests:
Production build:

ACCEPTANCE CRITERIA:

Passed:
Failed:
Not verified:

ARCHITECTURAL DECISIONS:

KNOWN ISSUES:

SOURCE-OF-TRUTH UPDATES:

GIT STATUS:

NEXT RECOMMENDED ACTION:

GO / NO-GO:

STRICT SCOPE LIMIT

Do not proceed to Milestone 1.

Do not implement the full case.

Do not create the evidence board.

Do not implement interviews.

Do not implement scoring.

Do not deploy.

Do not commit or push.

Stop after Milestone 0 verification and reporting.

The objective is a clean, reproducible, documented foundation that can support a professional game development project.
```

---

## 16. HOW WE WILL WORK FROM HERE

I recommend a strict development cycle.

Step 1: Run the Milestone 0 prompt in Cursor.

Step 2: Cursor inspects the environment, initializes the project, and establishes the documentation.

Step 3: Cursor runs verification and produces its milestone report.

Step 4: Bring that report back here.

Step 5: I'll review it against the master specification and identify any problems, missing requirements, or architectural risks.

Step 6: I'll provide the next detailed Cursor prompt, based on the actual implementation state.

We repeat this process until Milestone 11 is complete.

This is important because a game has more interconnected systems than a conventional website. Building the UI, game state, dialogue engine, and puzzle logic without a controlled architecture would create significant rework.

---

## 17. FINAL PROJECT SUCCESS CRITERIA

We will consider the project ready to pitch only when all of the following are true.

| Requirement | Target |
| --- | --- |
| Complete playable case | 1 |
| Target playtime | 18–25 minutes |
| Narrative acts | 3 |
| Evidence items | 14 |
| Primary characters | 4 |
| Investigation puzzles | 5 |
| Evidence board | Functional |
| Branching interviews | Functional |
| Timeline reconstruction | Functional |
| Verdict scoring | Functional |
| Save/resume | Functional |
| Mobile experience | Functional |
| Accessibility | WCAG 2.2 AA target |
| Automated tests | Critical flows covered |
| Deployment | Private and verified |
| Promotional trailer | 60–90 seconds |
| Pitch deck | 10–12 slides |
| Commercial proposal | Prepared |
| Rights and attribution | Reviewed |

### Definition of success

The pitch succeeds at the product level when a member of the RedHanded team can open the private demo, play through the case without assistance, understand the commercial opportunity, and see how the concept could expand into an official RedHanded experience.

A partnership is not guaranteed, but the product should be strong enough to justify a serious conversation.

### Project status

- **Current milestone:** M0 — Project Foundation
- **Completed milestones:** None verified
- **Next action:** Run Cursor Prompt 001
- **Source of truth:** This specification, to be preserved in `docs/MASTER_PLAN.md`
- **Development policy:** One milestone at a time, with verification before progression.

One practical detail: This chat establishes the baseline, but Cursor cannot automatically read it. The complete specification must be copied into the repository before development begins. Once `docs/MASTER_PLAN.md` exists, that file becomes the persistent authority for Cursor and future development sessions.

We're building a product RedHanded could potentially put its name on—not merely a fan project that happens to work.
