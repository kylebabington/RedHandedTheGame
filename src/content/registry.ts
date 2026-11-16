import type { CaseDefinition } from '@/engine/schemas/case'
import { case001 } from '@/content/cases/case-001'
import { caseFix001 } from '@/content/cases/case-fix-001'

export type CaseRegistryEntry = {
  id: string
  title: string
  difficulty: string
  playtime: string
  synopsis: string
  status: 'playable' | 'coming-soon'
}

/**
 * UI-facing case catalog.
 * Public selector keeps CASE_001 as coming-soon through M3; engine content is
 * available via getCaseDefinition for development / headless playthroughs.
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

const caseDefinitions: Record<string, CaseDefinition> = {
  CASE_FIX_001: caseFix001,
  CASE_001: case001,
}

export function getCaseEntry(caseId: string): CaseRegistryEntry | undefined {
  return caseRegistry.find((entry) => entry.id === caseId)
}

export function getPlayableCases(): CaseRegistryEntry[] {
  return caseRegistry.filter((entry) => entry.status === 'playable')
}

/** Engine content loader. Does not imply public UI playability. */
export function getCaseDefinition(
  caseId: string,
): CaseDefinition | undefined {
  return caseDefinitions[caseId]
}
