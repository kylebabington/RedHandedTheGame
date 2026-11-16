import { Link } from 'react-router'
import { AppShell } from '@/components/layout/AppShell'
import { Button } from '@/components/ui/Button'
import { caseRegistry } from '@/content/registry'

export function CaseSelectPage() {
  return (
    <AppShell>
      <section className="mx-auto flex max-w-4xl flex-col gap-8" aria-labelledby="cases-title">
        <header className="flex flex-col gap-3">
          <p className="font-mono text-sm uppercase tracking-[0.18em] text-crimson">Case files</p>
          <h1 id="cases-title" className="font-display text-4xl font-semibold text-ink sm:text-5xl">
            Select a case
          </h1>
          <p className="max-w-2xl text-muted">
            One preview investigation is available in this prototype. Future cases appear as labeled
            concepts only.
          </p>
        </header>

        <ul className="grid gap-4 md:grid-cols-2">
          {caseRegistry.map((entry) => {
            const isPlayable = entry.status === 'playable'
            return (
              <li
                key={entry.id}
                className="workspace-panel flex flex-col gap-4 p-5"
                aria-labelledby={`case-${entry.id}-title`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-mono text-xs uppercase tracking-[0.16em] text-muted">
                    {entry.id}
                  </p>
                  <span
                    className={
                      isPlayable
                        ? 'font-mono text-xs uppercase tracking-[0.14em] text-success'
                        : 'font-mono text-xs uppercase tracking-[0.14em] text-warning'
                    }
                  >
                    {isPlayable ? 'Playable preview' : 'Coming soon'}
                  </span>
                </div>
                <h2
                  id={`case-${entry.id}-title`}
                  className="font-display text-2xl font-semibold text-ink"
                >
                  {entry.title}
                </h2>
                <p className="text-sm text-muted">
                  {entry.difficulty} · {entry.playtime}
                </p>
                <p className="text-sm text-muted">{entry.synopsis}</p>
                {isPlayable ? (
                  <Button to={`/cases/${entry.id}/intro`} variant="primary" className="w-fit">
                    Open case file
                  </Button>
                ) : (
                  <p className="text-sm text-muted">
                    Not playable in this milestone. Content arrives in a later release.
                  </p>
                )}
              </li>
            )
          })}
        </ul>

        <p className="text-sm text-muted">
          <Link to="/" className="text-ink underline-offset-4 hover:underline">
            Back to landing
          </Link>
        </p>
      </section>
    </AppShell>
  )
}
