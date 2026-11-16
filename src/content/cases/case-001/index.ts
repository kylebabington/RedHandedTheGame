import { parseCase, type CaseDefinition } from '@/engine/schemas/case'

/**
 * CASE_001 — The Last Broadcast
 * Canonical narrative from docs/MASTER_PLAN.md and docs/CASE_001.md.
 * Public case selector remains "Coming soon"; engine access is for development.
 */

export const CANONICAL_RECONSTRUCTION_ORDER = [
  'T_THREAT',
  'T_ASSIST',
  'T_INTERRUPTION',
  'T_EXIT',
  'T_ALTERED',
] as const

const rawCase001 = {
  id: 'CASE_001',
  title: 'The Last Broadcast',
  difficulty: 'Intermediate',
  playtime: '18–25 minutes',
  characters: [
    {
      id: 'CHAR_EVELYN',
      name: 'Evelyn Cross',
      role: 'Investigative journalist',
      summary:
        'Presenter of Night Frequency. Missing after her final live broadcast.',
    },
    {
      id: 'CHAR_DANIEL',
      name: 'Daniel Mercer',
      role: 'Radio producer',
      summary:
        'Evelyn’s producer. Keeps parts of the night’s sequence carefully vague.',
    },
    {
      id: 'CHAR_CLARA',
      name: 'Clara Voss',
      role: 'Station executive',
      summary:
        'Runs the station’s contracts and “risk management.” Linked to research access.',
    },
    {
      id: 'CHAR_MARCUS',
      name: 'Marcus Reed',
      role: 'Security guard',
      summary:
        'Night security. Filed an incomplete incident note after a system reset.',
    },
  ],
  acts: [
    {
      number: 1,
      title: 'The Disappearance',
      completeWhen: {
        type: 'puzzlesAll',
        puzzleIds: ['P_ELEVEN_SECONDS'],
      },
    },
    {
      number: 2,
      title: 'Everyone Has a Version',
      completeWhen: {
        type: 'all',
        of: [
          {
            type: 'puzzlesAll',
            puzzleIds: [
              'P_PRODUCER_TIMELINE',
              'P_SECURITY_GAP',
              'P_FACT_OR_THEORY',
            ],
          },
          {
            type: 'dialogueCompleted',
            dialogueIds: ['D_DANIEL', 'D_MARCUS', 'D_CLARA'],
          },
        ],
      },
    },
    {
      number: 3,
      title: 'The Final Broadcast',
      completeWhen: {
        type: 'all',
        of: [
          { type: 'puzzlesAll', puzzleIds: ['P_RECONSTRUCTION'] },
          {
            type: 'evidenceAll',
            evidenceIds: ['E011', 'E012', 'E013', 'E014'],
          },
        ],
      },
    },
  ],
  evidence: [
    {
      id: 'E001',
      title: 'Studio photograph',
      description:
        'Booth B after the blackout: headphones on the desk, mic still live-armed, no presenter in frame. The red ON-AIR lamp is dark.',
      type: 'photograph',
      relatedEvidenceIds: ['E002', 'E005'],
      unlock: { type: 'always' },
      accessibilityDescription:
        'Photograph of an empty radio studio booth with a dark on-air lamp.',
    },
    {
      id: 'E002',
      title: 'Broadcast recording',
      description:
        'Air check of Evelyn’s last words: “If you\'re listening to this, someone has been lying to you.” Then eleven seconds of silence before the feed cuts. The silence is clean—no chair scrape, no breath—unlike a live mic dying mid-sentence.',
      type: 'audio',
      relatedEvidenceIds: ['E001', 'E003', 'E010'],
      unlock: { type: 'evidenceAll', evidenceIds: ['E001'] },
      accessibilityDescription:
        'Audio recording ending in eleven seconds of unexplained silence.',
    },
    {
      id: 'E003',
      title: 'Studio access log',
      description:
        'Electronic log for Booth B: Evelyn badge-in 22:58; Daniel badge-in 23:05; no badge-out for Evelyn. A gap appears from 23:41–23:52 with no door events recorded at all.',
      type: 'record',
      relatedEvidenceIds: ['E007', 'E005'],
      unlock: { type: 'evidenceAll', evidenceIds: ['E001'] },
      accessibilityDescription:
        'Access log showing badge events and a ten-minute gap with no door records.',
    },
    {
      id: 'E004',
      title: 'Handwritten note',
      description:
        'Found under the console: “Don’t trust the air check. Pull the ORIGINAL feed — rack 3. — E.” The word ORIGINAL is underlined twice.',
      type: 'document',
      relatedEvidenceIds: ['E010', 'E002'],
      unlock: { type: 'evidenceAll', evidenceIds: ['E002'] },
      accessibilityDescription:
        'Handwritten note telling the reader to pull the original feed from rack 3.',
    },
    {
      id: 'E005',
      title: 'Door mechanism diagram',
      description:
        'Service diagram for Booth B: the main door locks electromagnetically, but a rear maintenance hatch opens into Corridor C when the magnetic latch loses power. The hatch is not on the public floor plan.',
      type: 'diagram',
      relatedEvidenceIds: ['E001', 'E011'],
      unlock: { type: 'evidenceAll', evidenceIds: ['E001'] },
      accessibilityDescription:
        'Diagram showing a maintenance hatch that opens when power to the magnetic lock fails.',
    },
    {
      id: 'E006',
      title: 'Producer statement',
      description:
        'Daniel’s written statement: he was “in the control bay the whole hour,” never left the glass, and only noticed Evelyn missing after the cut. He claims he did not enter Corridor C.',
      type: 'document',
      relatedEvidenceIds: ['E008', 'E012'],
      unlock: { type: 'actAtLeast', act: 2 },
      accessibilityDescription:
        'Producer statement claiming he stayed in the control bay the entire hour.',
    },
    {
      id: 'E007',
      title: 'Security incident report',
      description:
        'Marcus filed a late note: “Unauthorized security console reset at 23:44. Camera buffer cleared for Corridor C. No badge event logged for the reset operator.” He initials that he “restored defaults” and closed the ticket.',
      type: 'document',
      relatedEvidenceIds: ['E003', 'E011'],
      unlock: { type: 'actAtLeast', act: 2 },
      accessibilityDescription:
        'Security report describing an unauthorized console reset that cleared Corridor C camera buffer.',
    },
    {
      id: 'E008',
      title: 'Maintenance schedule',
      description:
        'Facilities calendar: planned power interruption for Booth B magnetic locks, 23:40–23:50, “rack UPS test.” Daniel’s signature acknowledges the window two days earlier.',
      type: 'document',
      relatedEvidenceIds: ['E006', 'E005'],
      unlock: { type: 'actAtLeast', act: 2 },
      accessibilityDescription:
        'Maintenance schedule showing a planned power interruption Daniel acknowledged.',
    },
    {
      id: 'E009',
      title: 'Executive correspondence',
      description:
        'Clara’s email to an outside contractor: “Confirm retrieval window for Cross research archive while Night Frequency is live. Prefer no station staff present in Archive A.” Timestamped earlier that evening.',
      type: 'document',
      relatedEvidenceIds: ['E013'],
      unlock: { type: 'actAtLeast', act: 2 },
      accessibilityDescription:
        'Executive email arranging contractor retrieval of Evelyn’s research during the live show.',
    },
    {
      id: 'E010',
      title: 'Original recording metadata',
      description:
        'Rack-3 original feed metadata: continuous waveform through 23:47 with a soft door latch and two whispered syllables, then a splice marker. The aired check replaces that segment with eleven seconds of generated silence stamped “post-mix.”',
      type: 'record',
      relatedEvidenceIds: ['E002', 'E004', 'E012'],
      unlock: {
        type: 'all',
        of: [
          { type: 'actAtLeast', act: 2 },
          { type: 'evidenceAll', evidenceIds: ['E004'] },
        ],
      },
      accessibilityDescription:
        'Metadata showing the original feed was spliced and the aired silence was generated in post-mix.',
    },
    {
      id: 'E011',
      title: 'Maintenance corridor diagram',
      description:
        'Corridor C map: Booth B hatch → service stairs → alley exit. Camera node CAM-C covers the hatch; its buffer is the one Marcus reported cleared.',
      type: 'diagram',
      relatedEvidenceIds: ['E005', 'E007'],
      unlock: { type: 'actAtLeast', act: 3 },
      accessibilityDescription:
        'Diagram of Corridor C connecting the booth hatch to an alley exit.',
    },
    {
      id: 'E012',
      title: 'Recovered audio segment',
      description:
        'Recovered whisper from the original feed: a male voice, consistent with Daniel’s timbre, says “Go—now.” timed to the planned interruption window.',
      type: 'audio',
      relatedEvidenceIds: ['E010', 'E006'],
      unlock: {
        type: 'all',
        of: [
          { type: 'actAtLeast', act: 3 },
          { type: 'evidenceAll', evidenceIds: ['E010'] },
        ],
      },
      accessibilityDescription:
        'Recovered audio of a male voice saying go now during the interruption window.',
    },
    {
      id: 'E013',
      title: 'Research transfer record',
      description:
        'Archive A transfer log: contractor badge “NEX-19” removed Evelyn’s research drive at 23:36—before the on-air cut—under Clara’s authorization code.',
      type: 'record',
      relatedEvidenceIds: ['E009'],
      unlock: {
        type: 'all',
        of: [
          { type: 'actAtLeast', act: 3 },
          { type: 'evidenceAll', evidenceIds: ['E009'] },
        ],
      },
      accessibilityDescription:
        'Transfer record showing a contractor removed Evelyn’s research under Clara’s authorization.',
    },
    {
      id: 'E014',
      title: 'Final timeline comparison',
      description:
        'Side-by-side board: research threat discovered → assistance arranged → planned interruption → hatch exit → altered broadcast narrative. Gaps in the public air-check line up with Corridor C events, not a locked-room vanishing.',
      type: 'document',
      relatedEvidenceIds: ['E011', 'E012', 'E013'],
      unlock: {
        type: 'all',
        of: [
          { type: 'actAtLeast', act: 3 },
          { type: 'evidenceAll', evidenceIds: ['E011', 'E012', 'E013'] },
        ],
      },
      accessibilityDescription:
        'Timeline comparison linking the research threat, assistance, interruption, exit, and altered broadcast.',
    },
  ],
  puzzles: [
    {
      id: 'P_ELEVEN_SECONDS',
      title: 'The Missing Eleven Seconds',
      type: 'evidence-comparison',
      act: 1,
      prompt:
        'Compare the aired broadcast with the studio access context. What best explains the eleven-second gap?',
      unlock: {
        type: 'evidenceAll',
        evidenceIds: ['E001', 'E002', 'E003', 'E004', 'E005'],
      },
      solution: { kind: 'exact', value: 'recording-altered' },
    },
    {
      id: 'P_PRODUCER_TIMELINE',
      title: "The Producer's Timeline",
      type: 'contradiction',
      act: 2,
      prompt:
        'Daniel says he never left the glass. What contradiction does the record force?',
      unlock: {
        type: 'all',
        of: [
          { type: 'actAtLeast', act: 2 },
          {
            type: 'evidenceAll',
            evidenceIds: ['E006', 'E008'],
          },
          { type: 'dialogueCompleted', dialogueIds: ['D_DANIEL'] },
        ],
      },
      solution: { kind: 'exact', value: 'daniel-location-contradiction' },
    },
    {
      id: 'P_SECURITY_GAP',
      title: 'The Security Gap',
      type: 'contradiction',
      act: 2,
      prompt:
        'The access log has a quiet gap. What does a missing access record actually prove?',
      unlock: {
        type: 'all',
        of: [
          { type: 'actAtLeast', act: 2 },
          { type: 'evidenceAll', evidenceIds: ['E003', 'E007'] },
          { type: 'dialogueCompleted', dialogueIds: ['D_MARCUS'] },
        ],
      },
      solution: { kind: 'exact', value: 'missing-record-not-proof' },
    },
    {
      id: 'P_FACT_OR_THEORY',
      title: 'Fact or Theory?',
      type: 'classification',
      act: 2,
      prompt: 'Classify each statement by how strongly the case supports it.',
      unlock: {
        type: 'all',
        of: [
          { type: 'actAtLeast', act: 2 },
          {
            type: 'evidenceAll',
            evidenceIds: ['E006', 'E007', 'E008', 'E009', 'E010'],
          },
          {
            type: 'dialogueCompleted',
            dialogueIds: ['D_DANIEL', 'D_MARCUS', 'D_CLARA'],
          },
        ],
      },
      solution: {
        kind: 'map',
        value: {
          S_AIR_SILENCE: 'verified-evidence',
          S_DANIEL_GLASS: 'witness-claim',
          S_HATCH_EXIT: 'reasonable-inference',
          S_KIDNAPPED: 'unsupported-speculation',
        },
      },
    },
    {
      id: 'P_RECONSTRUCTION',
      title: 'The Reconstruction',
      type: 'timeline-ordering',
      act: 3,
      prompt: 'Order the five events that explain the night without the myth.',
      unlock: {
        type: 'all',
        of: [
          { type: 'actAtLeast', act: 3 },
          {
            type: 'evidenceAll',
            evidenceIds: ['E011', 'E012', 'E013', 'E014'],
          },
        ],
      },
      solution: {
        kind: 'order',
        value: [...CANONICAL_RECONSTRUCTION_ORDER],
      },
    },
  ],
  dialogue: [
    {
      id: 'D_DANIEL',
      characterId: 'CHAR_DANIEL',
      title: 'Interview: Daniel Mercer',
      unlock: {
        type: 'all',
        of: [
          { type: 'actAtLeast', act: 2 },
          { type: 'puzzlesAll', puzzleIds: ['P_ELEVEN_SECONDS'] },
        ],
      },
      beats: [
        {
          speaker: 'investigator',
          text: 'You said you stayed in the control bay. Walk me through 23:40.',
        },
        {
          speaker: 'character',
          text: 'Lights flickered for the UPS test. I kept my eyes on levels. Evelyn was… handling something. I don’t discuss her sources.',
        },
        {
          speaker: 'investigator',
          text: 'The maintenance window is on your signature. Did you leave the glass?',
        },
        {
          speaker: 'character',
          text: 'I told the statement I didn’t. Some doors aren’t on the log the way people think.',
        },
      ],
    },
    {
      id: 'D_MARCUS',
      characterId: 'CHAR_MARCUS',
      title: 'Interview: Marcus Reed',
      unlock: {
        type: 'all',
        of: [
          { type: 'actAtLeast', act: 2 },
          { type: 'evidenceAll', evidenceIds: ['E007'] },
        ],
      },
      beats: [
        {
          speaker: 'investigator',
          text: 'Your reset cleared Corridor C. Who authorized it?',
        },
        {
          speaker: 'character',
          text: 'Nobody signed it. I restored defaults so morning shift wouldn’t panic. A blank log doesn’t mean someone walked through.',
        },
        {
          speaker: 'investigator',
          text: 'So the gap isn’t proof of entry or exit?',
        },
        {
          speaker: 'character',
          text: 'Correct. Missing camera time isn’t a body in the hallway.',
        },
      ],
    },
    {
      id: 'D_CLARA',
      characterId: 'CHAR_CLARA',
      title: 'Interview: Clara Voss',
      unlock: {
        type: 'all',
        of: [
          { type: 'actAtLeast', act: 2 },
          { type: 'evidenceAll', evidenceIds: ['E009'] },
        ],
      },
      beats: [
        {
          speaker: 'investigator',
          text: 'Why schedule a contractor against Evelyn’s archive during her live hour?',
        },
        {
          speaker: 'character',
          text: 'Risk management. Her draft named partners. The station protects itself.',
        },
        {
          speaker: 'investigator',
          text: 'Did that retrieval have anything to do with the disappearance story?',
        },
        {
          speaker: 'character',
          text: 'Different problem. Don’t confuse a contract with a locked booth.',
        },
      ],
    },
  ],
  connections: [
    {
      id: 'CX_AIR_NOTE',
      evidenceIds: ['E002', 'E004'],
      label: 'Air check vs original-feed note',
    },
    {
      id: 'CX_HATCH_CORRIDOR',
      evidenceIds: ['E005', 'E011'],
      label: 'Hatch opens into Corridor C',
    },
    {
      id: 'CX_CLARA_TRANSFER',
      evidenceIds: ['E009', 'E013'],
      label: 'Executive order matches transfer',
    },
  ],
  timelineEventIds: [...CANONICAL_RECONSTRUCTION_ORDER],
  scoring: {
    scoredEvidenceIds: [
      'E001',
      'E002',
      'E003',
      'E004',
      'E005',
      'E006',
      'E007',
      'E008',
      'E009',
      'E010',
      'E011',
      'E012',
      'E013',
      'E014',
    ],
    contradictionPuzzleIds: ['P_PRODUCER_TIMELINE', 'P_SECURITY_GAP'],
    correctTimelineOrder: [...CANONICAL_RECONSTRUCTION_ORDER],
    classificationPuzzleId: 'P_FACT_OR_THEORY',
    verdictQuestions: [
      {
        id: 'VQ_WHAT',
        prompt: 'What happened to Evelyn?',
        correctAnswerId: 'staged-exit',
        options: [
          {
            id: 'staged-exit',
            label: 'She staged an exit during the interruption',
          },
          { id: 'abducted', label: 'She was abducted from the locked booth' },
          { id: 'still-hiding', label: 'She is still hiding inside the studio' },
        ],
      },
      {
        id: 'VQ_VOLUNTARY',
        prompt: 'Was the disappearance voluntary?',
        correctAnswerId: 'voluntary',
        options: [
          { id: 'voluntary', label: 'Yes — voluntary and planned' },
          { id: 'forced', label: 'No — she was forced out' },
          { id: 'unknown', label: 'Cannot be determined' },
        ],
      },
      {
        id: 'VQ_ASSISTED',
        prompt: 'Who assisted her?',
        correctAnswerId: 'daniel',
        options: [
          { id: 'daniel', label: 'Daniel Mercer' },
          { id: 'marcus', label: 'Marcus Reed' },
          { id: 'clara', label: 'Clara Voss' },
          { id: 'nobody', label: 'Nobody' },
        ],
      },
      {
        id: 'VQ_MANIPULATED',
        prompt: 'Which evidence was manipulated?',
        correctAnswerId: 'broadcast-feed',
        options: [
          { id: 'broadcast-feed', label: 'The aired broadcast / air check' },
          { id: 'access-log-forged', label: 'Evelyn’s badge-in was forged' },
          {
            id: 'maintenance-fake',
            label: 'The maintenance schedule was fabricated',
          },
        ],
      },
      {
        id: 'VQ_WRONGDOING',
        prompt: 'What separate wrongdoing occurred?',
        correctAnswerId: 'research-theft',
        options: [
          {
            id: 'research-theft',
            label: 'Unauthorized transfer of Evelyn’s research',
          },
          {
            id: 'only-disappearance',
            label: 'Only the disappearance — nothing else',
          },
          {
            id: 'marcus-theft',
            label: 'Marcus stole the research personally',
          },
        ],
      },
      {
        id: 'VQ_SUPPORTED',
        prompt: 'Which conclusions are supported by evidence?',
        correctAnswerId: 'linked-distinct',
        options: [
          {
            id: 'linked-distinct',
            label:
              'Disappearance, tampering, and corruption are connected but distinct',
          },
          {
            id: 'single-plot',
            label: 'Everything was one unified kidnapping plot',
          },
          {
            id: 'clara-assisted-exit',
            label: 'Clara personally guided Evelyn through the hatch',
          },
        ],
      },
    ],
  },
  verdictPrerequisite: {
    type: 'all',
    of: [
      { type: 'puzzlesAll', puzzleIds: ['P_RECONSTRUCTION'] },
      {
        type: 'evidenceAll',
        evidenceIds: ['E011', 'E012', 'E013', 'E014'],
      },
    ],
  },
  reveal: {
    steps: [
      {
        id: 'R_STAGED',
        title: 'A staged disappearance',
        body: 'Evelyn staged her exit to protect an informant and force attention onto a tampered broadcast narrative.',
      },
      {
        id: 'R_DANIEL',
        title: 'Assistance through Corridor C',
        body: 'Daniel helped her leave through the maintenance hatch during the scheduled power interruption.',
      },
      {
        id: 'R_CLARA',
        title: 'A separate retrieval',
        body: 'Clara independently arranged for a contractor to obtain Evelyn’s research during the live hour.',
      },
      {
        id: 'R_MARCUS',
        title: 'A concealed reset',
        body: 'Marcus concealed an unauthorized security-system reset that cleared Corridor C’s camera buffer.',
      },
      {
        id: 'R_DISTINCT',
        title: 'Connected, not identical',
        body: 'The disappearance, the evidence tampering, and the corruption are connected—but they are distinct acts the evidence can separate.',
      },
    ],
  },
} as const

export const case001: CaseDefinition = parseCase(rawCase001)

export function getCase001(): CaseDefinition {
  return case001
}
