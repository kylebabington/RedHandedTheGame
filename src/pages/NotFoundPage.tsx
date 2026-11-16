import { AppShell } from '@/components/layout/AppShell'
import { Button } from '@/components/ui/Button'

export function NotFoundPage() {
  return (
    <AppShell>
      <section className="mx-auto flex max-w-2xl flex-col gap-4" aria-labelledby="not-found-title">
        <p className="font-mono text-sm uppercase tracking-[0.18em] text-warning">404</p>
        <h1 id="not-found-title" className="font-display text-4xl font-semibold text-ink">
          Page not found
        </h1>
        <p className="text-muted">That route is not part of this prototype.</p>
        <Button to="/" variant="secondary" className="w-fit">
          Return to The Evidence Room
        </Button>
      </section>
    </AppShell>
  )
}
