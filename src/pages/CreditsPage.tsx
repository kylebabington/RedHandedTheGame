import { AppShell } from '@/components/layout/AppShell'
import { Button } from '@/components/ui/Button'

export function CreditsPage() {
  return (
    <AppShell>
      <section className="mx-auto flex max-w-2xl flex-col gap-8" aria-labelledby="credits-title">
        <header className="flex flex-col gap-3">
          <p className="font-mono text-sm uppercase tracking-[0.18em] text-crimson">Attribution</p>
          <h1
            id="credits-title"
            className="font-display text-4xl font-semibold text-ink sm:text-5xl"
          >
            Credits
          </h1>
        </header>

        <div className="workspace-panel flex flex-col gap-4 p-5 text-muted">
          <p>
            <span className="font-display text-xl font-semibold text-ink">The Evidence Room</span>
            <br />
            An unofficial interactive mystery game concept created as a pitch prototype.
          </p>
          <p>
            This project is not affiliated with, endorsed by, or licensed by RedHanded or its
            creators. No official logos, host likenesses, podcast recordings, or copyrighted episode
            material are used.
          </p>
          <p>
            Case preview content in this milestone uses original fictional fixture material. Visual
            textures and interface copy are original to this prototype.
          </p>
          <p>
            Typography: Fraunces, DM Sans, and IBM Plex Mono via Google Fonts (SIL Open Font
            License).
          </p>
        </div>

        <Button to="/" variant="secondary" className="w-fit">
          Back to landing
        </Button>
      </section>
    </AppShell>
  )
}
