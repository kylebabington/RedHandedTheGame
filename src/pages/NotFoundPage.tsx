import { Link } from 'react-router'
import { AppShell } from '@/components/layout/AppShell'

export function NotFoundPage() {
  return (
    <AppShell>
      <section className="mx-auto flex max-w-2xl flex-col gap-4" aria-labelledby="not-found-title">
        <p className="font-mono text-sm uppercase tracking-[0.18em] text-warning">404</p>
        <h1 id="not-found-title" className="font-display text-4xl font-semibold text-ink">
          Page not found
        </h1>
        <p className="text-muted">
          That route is not part of this prototype foundation.
        </p>
        <Link
          to="/"
          className="inline-flex w-fit items-center rounded-sm border border-border bg-surface px-4 py-2 text-sm text-ink transition-colors hover:border-crimson hover:text-ink"
        >
          Return to The Evidence Room
        </Link>
      </section>
    </AppShell>
  )
}
