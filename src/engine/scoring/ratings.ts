export const SCORE_WEIGHTS = {
  evidenceDiscovery: 20,
  contradictionIdentification: 20,
  timelineReconstruction: 20,
  finalConclusions: 30,
  factVsSpeculation: 10,
} as const

export type InvestigatorRating =
  | 'The Master Investigator'
  | 'The Skeptic'
  | 'The Detective'
  | 'The Amateur Sleuth'
  | 'Back to the Evidence'

export function ratingForScore(total: number): InvestigatorRating {
  if (total >= 90) return 'The Master Investigator'
  if (total >= 75) return 'The Skeptic'
  if (total >= 60) return 'The Detective'
  if (total >= 40) return 'The Amateur Sleuth'
  return 'Back to the Evidence'
}
