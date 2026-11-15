import { parseCase, type CaseDefinition } from '@/engine/schemas/case'

/**
 * Small original fictional fixture for Milestone 1 engine tests.
 * Not CASE_001 — production case content begins in Milestone 3.
 */
const rawFixture = {
  id: 'CASE_FIX_001',
  title: 'The Empty Locker',
  difficulty: 'intro',
  playtime: '5 minutes',
  characters: [
    {
      id: 'CHAR_NIA',
      name: 'Nia Holt',
      role: 'Night clerk',
    },
  ],
  acts: [
    {
      number: 1,
      title: 'Something Missing',
      completeWhen: { type: 'puzzlesAll', puzzleIds: ['P_GAP'] },
    },
    {
      number: 2,
      title: 'Who Took the Key',
      completeWhen: {
        type: 'all',
        of: [
          { type: 'puzzlesAll', puzzleIds: ['P_CLASSIFY'] },
          { type: 'dialogueCompleted', dialogueIds: ['D_NIA'] },
        ],
      },
    },
  ],
  evidence: [
    {
      id: 'FX_E001',
      title: 'Locker photograph',
      description: 'An open staff locker with a missing key hook.',
      type: 'photograph',
      relatedEvidenceIds: ['FX_E002'],
      unlock: { type: 'always' },
      accessibilityDescription: 'Photo of an empty locker interior.',
    },
    {
      id: 'FX_E002',
      title: 'Shift log',
      description: 'Handwritten log claiming the key was present at 9:00 p.m.',
      type: 'document',
      relatedEvidenceIds: ['FX_E001'],
      unlock: { type: 'evidenceAll', evidenceIds: ['FX_E001'] },
      accessibilityDescription: 'A shift log page mentioning the locker key.',
    },
    {
      id: 'FX_E003',
      title: 'Key audit note',
      description: 'A typed note that the spare key was signed out at 8:40 p.m.',
      type: 'document',
      unlock: { type: 'puzzlesAll', puzzleIds: ['P_GAP'] },
      accessibilityDescription: 'Typed audit note about a spare key.',
    },
    {
      id: 'FX_E004',
      title: 'Camera still',
      description: 'A still showing Nia near the locker hallway at 8:42 p.m.',
      type: 'photograph',
      unlock: { type: 'evidenceAll', evidenceIds: ['FX_E003'] },
      accessibilityDescription: 'Security camera still of the hallway.',
    },
  ],
  puzzles: [
    {
      id: 'P_GAP',
      title: 'The Missing Eleven Minutes',
      type: 'evidence-comparison',
      act: 1,
      unlock: {
        type: 'evidenceAll',
        evidenceIds: ['FX_E001', 'FX_E002'],
      },
      solution: { kind: 'exact', value: 'log-altered' },
    },
    {
      id: 'P_CLASSIFY',
      title: 'Fact or Theory?',
      type: 'classification',
      act: 2,
      unlock: {
        type: 'all',
        of: [
          { type: 'actAtLeast', act: 2 },
          { type: 'evidenceAll', evidenceIds: ['FX_E003', 'FX_E004'] },
        ],
      },
      solution: {
        kind: 'map',
        value: {
          FX_E003: 'verified-evidence',
          FX_E004: 'witness-claim',
        },
      },
    },
  ],
  dialogue: [
    {
      id: 'D_NIA',
      characterId: 'CHAR_NIA',
      title: 'Interview: Nia Holt',
      unlock: {
        type: 'all',
        of: [
          { type: 'actAtLeast', act: 2 },
          { type: 'puzzlesAll', puzzleIds: ['P_GAP'] },
        ],
      },
    },
  ],
  connections: [
    {
      id: 'CX_LOG_PHOTO',
      evidenceIds: ['FX_E001', 'FX_E002'],
      label: 'Log conflicts with empty hook',
    },
  ],
  timelineEventIds: ['T_SIGN_OUT', 'T_CAMERA', 'T_LOG_CLAIM'],
  scoring: {
    scoredEvidenceIds: ['FX_E001', 'FX_E002', 'FX_E003', 'FX_E004'],
    contradictionPuzzleIds: ['P_GAP'],
    correctTimelineOrder: ['T_SIGN_OUT', 'T_CAMERA', 'T_LOG_CLAIM'],
    classificationPuzzleId: 'P_CLASSIFY',
    verdictQuestions: [
      {
        id: 'VQ_WHAT',
        prompt: 'What happened to the key?',
        correctAnswerId: 'signed-out-early',
      },
      {
        id: 'VQ_WHO',
        prompt: 'Who altered the shift log?',
        correctAnswerId: 'nia',
      },
    ],
  },
} as const

export const caseFix001: CaseDefinition = parseCase(rawFixture)

export function getCaseFix001(): CaseDefinition {
  return caseFix001
}
