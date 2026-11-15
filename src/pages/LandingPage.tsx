import { AppShell } from '@/components/layout/AppShell'

export function LandingPage() {
  return (
    <AppShell>
      <section className="mx-auto flex max-w-3xl flex-col gap-6" aria-labelledby="project-title">
        <p className="font-mono text-sm uppercase tracking-[0.18em] text-crimson">Case file pending</p>
        <h1 id="project-title" className="font-display text-5xl font-semibold tracking-tight text-ink md:text-6xl">
          The Evidence Room
        </h1>
        <p className="max-w-2xl text-lg text-muted">
          An unofficial interactive mystery game concept.
        </p>
        <p className="max-w-2xl text-base text-muted">
          This Milestone 0 foundation establishes the project tooling, documentation, and application
          shell. Gameplay systems begin in later milestones.
        </p>
      </section>
    </AppShell>
  )
}
