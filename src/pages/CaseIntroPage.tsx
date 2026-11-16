import { Navigate, useParams } from 'react-router'
import { AppShell } from '@/components/layout/AppShell'
import { CaseFileTransition } from '@/components/motion/CaseFileTransition'
import { Button } from '@/components/ui/Button'
import { getCaseEntry } from '@/content/registry'

export function CaseIntroPage() {
  const { caseId = '' } = useParams()
  const entry = getCaseEntry(caseId)

  if (!entry || entry.status !== 'playable') {
    return <Navigate to="/cases" replace />
  }

  return (
    <AppShell>
      <section className="mx-auto flex max-w-3xl flex-col gap-8" aria-labelledby="intro-title">
        <header className="flex flex-col gap-3">
          <p className="font-mono text-sm uppercase tracking-[0.18em] text-crimson">
            Case introduction
          </p>
          <h1 id="intro-title" className="font-display text-4xl font-semibold text-ink sm:text-5xl">
            {entry.title}
          </h1>
          <p className="text-muted">
            {entry.difficulty} · {entry.playtime} · {entry.id}
          </p>
        </header>

        <CaseFileTransition title={entry.title}>
          <div className="flex flex-col gap-4">
            <p className="font-display text-xl font-semibold text-background">Opening brief</p>
            <p className="text-background/85">{entry.synopsis}</p>
            <p className="text-sm text-background/70">
              This preview uses the approved fixture case from the engine foundation. Full narrative
              systems arrive in later milestones; the next screen is a workspace shell only.
            </p>
            <div className="mt-2 flex flex-wrap gap-3">
              <Button to={`/cases/${entry.id}/investigate`} variant="primary">
                Enter investigation
              </Button>
              <Button to="/cases" variant="secondary">
                Back to cases
              </Button>
            </div>
          </div>
        </CaseFileTransition>
      </section>
    </AppShell>
  )
}
