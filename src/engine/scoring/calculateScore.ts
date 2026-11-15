import type { CaseDefinition } from '../schemas/case'
import type { GameState } from '../schemas/gameState'
import type { VerdictAnswers } from '../schemas/save'
import { SCORE_WEIGHTS, ratingForScore, type InvestigatorRating } from './ratings'

export type CategoryScore = {
  key: keyof typeof SCORE_WEIGHTS
  label: string
  weight: number
  ratio: number
  points: number
  explanation: string
}

export type ScoreResult = {
  total: number
  rating: InvestigatorRating
  categories: CategoryScore[]
  missedEvidence: string[]
  explanations: string[]
}

function clampRatio(value: number): number {
  if (Number.isNaN(value) || value < 0) return 0
  if (value > 1) return 1
  return value
}

function roundPoints(points: number): number {
  return Math.round(points * 100) / 100
}

function ratioFromIds(required: string[], completed: string[]): number {
  if (required.length === 0) return 0
  const completedSet = new Set(completed)
  const hits = required.filter((id) => completedSet.has(id)).length
  return hits / required.length
}

function timelineRatio(expected: string[], actual: string[]): number {
  if (expected.length === 0) return 0
  if (actual.length !== expected.length) return 0
  let matches = 0
  for (let index = 0; index < expected.length; index += 1) {
    if (actual[index] === expected[index]) {
      matches += 1
    }
  }
  return matches / expected.length
}

function verdictRatio(
  questions: CaseDefinition['scoring']['verdictQuestions'],
  answers: VerdictAnswers | undefined,
): number {
  if (questions.length === 0) return 0
  if (!answers) return 0
  let correct = 0
  for (const question of questions) {
    if (answers[question.id] === question.correctAnswerId) {
      correct += 1
    }
  }
  return correct / questions.length
}

/**
 * Deterministic weighted scoring per MASTER_PLAN.md.
 *
 * Verdict answers are not part of GameState. After a save/load cycle,
 * callers must pass `verdictAnswers` again (from the optional save-envelope
 * field restored by the engine, or from UI session state).
 */
export function calculateScore(
  state: GameState,
  caseDef: CaseDefinition,
  verdictAnswers?: VerdictAnswers,
): ScoreResult {
  const scoring = caseDef.scoring

  const evidenceRatio = clampRatio(
    ratioFromIds(scoring.scoredEvidenceIds, state.discoveredEvidence),
  )
  const contradictionRatio = clampRatio(
    ratioFromIds(scoring.contradictionPuzzleIds, state.completedPuzzles),
  )
  const timeline = clampRatio(
    timelineRatio(scoring.correctTimelineOrder, state.timelineOrder),
  )
  const classificationRatio = clampRatio(
    state.completedPuzzles.includes(scoring.classificationPuzzleId) ? 1 : 0,
  )
  const conclusionsRatio = clampRatio(
    state.verdictSubmitted
      ? verdictRatio(scoring.verdictQuestions, verdictAnswers)
      : 0,
  )

  const categories: CategoryScore[] = [
    {
      key: 'evidenceDiscovery',
      label: 'Evidence discovery',
      weight: SCORE_WEIGHTS.evidenceDiscovery,
      ratio: evidenceRatio,
      points: roundPoints(evidenceRatio * SCORE_WEIGHTS.evidenceDiscovery),
      explanation: `Discovered ${Math.round(evidenceRatio * scoring.scoredEvidenceIds.length)} of ${scoring.scoredEvidenceIds.length} scored evidence items.`,
    },
    {
      key: 'contradictionIdentification',
      label: 'Contradiction identification',
      weight: SCORE_WEIGHTS.contradictionIdentification,
      ratio: contradictionRatio,
      points: roundPoints(
        contradictionRatio * SCORE_WEIGHTS.contradictionIdentification,
      ),
      explanation: `Completed ${Math.round(contradictionRatio * scoring.contradictionPuzzleIds.length)} of ${scoring.contradictionPuzzleIds.length} contradiction puzzles.`,
    },
    {
      key: 'timelineReconstruction',
      label: 'Timeline reconstruction',
      weight: SCORE_WEIGHTS.timelineReconstruction,
      ratio: timeline,
      points: roundPoints(timeline * SCORE_WEIGHTS.timelineReconstruction),
      explanation:
        timeline === 1
          ? 'Timeline order matches the canonical reconstruction.'
          : `Timeline match ratio ${timeline.toFixed(2)}.`,
    },
    {
      key: 'finalConclusions',
      label: 'Final conclusions',
      weight: SCORE_WEIGHTS.finalConclusions,
      ratio: conclusionsRatio,
      points: roundPoints(conclusionsRatio * SCORE_WEIGHTS.finalConclusions),
      explanation: state.verdictSubmitted
        ? `Answered ${Math.round(conclusionsRatio * scoring.verdictQuestions.length)} of ${scoring.verdictQuestions.length} verdict questions correctly.`
        : 'Verdict not submitted.',
    },
    {
      key: 'factVsSpeculation',
      label: 'Distinguishing fact from speculation',
      weight: SCORE_WEIGHTS.factVsSpeculation,
      ratio: classificationRatio,
      points: roundPoints(classificationRatio * SCORE_WEIGHTS.factVsSpeculation),
      explanation: state.completedPuzzles.includes(scoring.classificationPuzzleId)
        ? 'Classification puzzle completed.'
        : 'Classification puzzle incomplete.',
    },
  ]

  const total = roundPoints(
    categories.reduce((sum, category) => sum + category.points, 0),
  )
  const missedEvidence = scoring.scoredEvidenceIds.filter(
    (id) => !state.discoveredEvidence.includes(id),
  )
  const explanations = categories.map((category) => category.explanation)

  return {
    total,
    rating: ratingForScore(total),
    categories,
    missedEvidence,
    explanations,
  }
}
