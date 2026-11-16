import { Navigate, useParams } from 'react-router'
import { AppShell } from '@/components/layout/AppShell'
import { Button } from '@/components/ui/Button'
import { getCaseEntry } from '@/content/registry'

const toolLabels = ['Evidence', 'Board', 'Interviews', 'Timeline', 'Verdict'] as const

export function InvestigationPage() {
  const { caseId = '' } = useParams()
  const entry = getCaseEntry(caseId)

  if (!entry || entry.status !== 'playable') {
    return <Navigate to="/cases" replace />
  }

  return (
    <AppShell>
      <section className="flex flex-col gap-8" aria-labelledby="workspace-title">
        <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-col gap-2">
            <p className="font-mono text-sm uppercase tracking-[0.18em] text-crimson">
              Investigation workspace
            </p>
            <h1
              id="workspace-title"
              className="font-display text-3xl font-semibold text-ink sm:text-4xl"
            >
              {entry.title}
            </h1>
            <p className="max-w-2xl text-muted">
              Shell layout only. Evidence tools, interviews, and verdicts are not interactive in
              Milestone 2.
            </p>
          </div>
          <Button to="/cases" variant="secondary" className="w-fit shrink-0">
            Back to cases
          </Button>
        </header>

        <div className="grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
          <div className="flex flex-col gap-4">
            <section className="workspace-panel p-5" aria-labelledby="objective-heading">
              <h2 id="objective-heading" className="font-display text-xl font-semibold text-ink">
                Current objective
              </h2>
              <p className="mt-2 text-muted">
                Establish what happened to the missing locker key. Full objective tracking arrives
                with investigation systems.
              </p>
            </section>

            <section className="workspace-panel p-5" aria-labelledby="tools-heading">
              <h2 id="tools-heading" className="font-display text-xl font-semibold text-ink">
                Investigative tools
              </h2>
              <nav aria-label="Investigative tools" className="mt-4 flex flex-wrap gap-2">
                {toolLabels.map((label) => (
                  <button
                    key={label}
                    type="button"
                    disabled
                    className="min-h-11 rounded-sm border border-border bg-elevated px-4 py-2 text-sm text-muted disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {label}
                  </button>
                ))}
              </nav>
              <p className="mt-3 text-sm text-muted">Tools are placeholders for later milestones.</p>
            </section>
          </div>

          <div className="flex flex-col gap-4">
            <section className="workspace-panel p-5" aria-labelledby="inventory-heading">
              <h2 id="inventory-heading" className="font-display text-xl font-semibold text-ink">
                Evidence inventory
              </h2>
              <p className="mt-2 text-sm text-muted">No evidence discovered yet in this shell.</p>
              <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-muted">
                <li>Inventory list will appear here</li>
                <li>Inspection and connections come later</li>
              </ul>
            </section>

            <section className="workspace-panel p-5" aria-labelledby="progress-heading">
              <h2 id="progress-heading" className="font-display text-xl font-semibold text-ink">
                Case progress
              </h2>
              <p className="mt-2 text-sm text-muted">Act tracking and save/resume UI arrive later.</p>
              <div
                className="mt-4 h-2 overflow-hidden rounded-sm bg-elevated"
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={0}
                aria-label="Case progress placeholder"
              >
                <div className="h-full w-0 bg-crimson" />
              </div>
            </section>
          </div>
        </div>
      </section>
    </AppShell>
  )
}
