export type CaseRegistryEntry = {
  id: string
  title: string
  difficulty: string
  playtime: string
  synopsis: string
  status: 'playable' | 'coming-soon'
}

/**
 * UI-facing case catalog for Milestone 2.
 * Playable preview uses the M1 fixture; CASE_001 is a labeled future concept only.
 */
export const caseRegistry: CaseRegistryEntry[] = [
  {
    id: 'CASE_FIX_001',
    title: 'The Empty Locker',
    difficulty: 'Intro',
    playtime: '5 minutes',
    synopsis:
      'A staff locker key vanishes during the night shift. The log says one thing. The hallway camera suggests another.',
    status: 'playable',
  },
  {
    id: 'CASE_001',
    title: 'The Last Broadcast',
    difficulty: 'Intermediate',
    playtime: '18–25 minutes',
    synopsis:
      'A locked studio. Eleven seconds of silence. A presenter who may not have left alone.',
    status: 'coming-soon',
  },
]

export function getCaseEntry(caseId: string): CaseRegistryEntry | undefined {
  return caseRegistry.find((entry) => entry.id === caseId)
}

export function getPlayableCases(): CaseRegistryEntry[] {
  return caseRegistry.filter((entry) => entry.status === 'playable')
}
