import { AppShell } from '@/components/layout/AppShell'
import { Button } from '@/components/ui/Button'
import {
  useSettingsStore,
  type TextSizePreference,
} from '@/stores/settingsStore'

export function SettingsPage() {
  const soundEnabled = useSettingsStore((state) => state.soundEnabled)
  const musicVolume = useSettingsStore((state) => state.musicVolume)
  const effectsVolume = useSettingsStore((state) => state.effectsVolume)
  const reducedMotion = useSettingsStore((state) => state.reducedMotion)
  const textSize = useSettingsStore((state) => state.textSize)
  const setSoundEnabled = useSettingsStore((state) => state.setSoundEnabled)
  const setMusicVolume = useSettingsStore((state) => state.setMusicVolume)
  const setEffectsVolume = useSettingsStore((state) => state.setEffectsVolume)
  const setReducedMotion = useSettingsStore((state) => state.setReducedMotion)
  const setTextSize = useSettingsStore((state) => state.setTextSize)

  return (
    <AppShell>
      <section className="mx-auto flex max-w-2xl flex-col gap-8" aria-labelledby="settings-title">
        <header className="flex flex-col gap-3">
          <p className="font-mono text-sm uppercase tracking-[0.18em] text-crimson">Preferences</p>
          <h1
            id="settings-title"
            className="font-display text-4xl font-semibold text-ink sm:text-5xl"
          >
            Settings
          </h1>
          <p className="text-muted">
            Preferences are stored on this device. Sound options save now and will apply when audio
            is wired in a later milestone.
          </p>
        </header>

        <form className="flex flex-col gap-6" onSubmit={(event) => event.preventDefault()}>
          <fieldset className="workspace-panel flex flex-col gap-4 p-5">
            <legend className="px-1 font-display text-xl font-semibold text-ink">Sound</legend>
            <p className="text-sm text-muted">
              Audio playback is not connected yet. These controls store your preferences only.
            </p>
            <label className="flex min-h-11 items-center gap-3 text-sm">
              <input
                type="checkbox"
                checked={soundEnabled}
                onChange={(event) => setSoundEnabled(event.target.checked)}
              />
              Sound enabled
            </label>
            <label className="flex flex-col gap-2 text-sm">
              <span>Music volume ({Math.round(musicVolume * 100)}%)</span>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={musicVolume}
                disabled={!soundEnabled}
                onChange={(event) => setMusicVolume(Number(event.target.value))}
                aria-valuetext={`${Math.round(musicVolume * 100)} percent`}
              />
            </label>
            <label className="flex flex-col gap-2 text-sm">
              <span>Effects volume ({Math.round(effectsVolume * 100)}%)</span>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={effectsVolume}
                disabled={!soundEnabled}
                onChange={(event) => setEffectsVolume(Number(event.target.value))}
                aria-valuetext={`${Math.round(effectsVolume * 100)} percent`}
              />
            </label>
          </fieldset>

          <fieldset className="workspace-panel flex flex-col gap-4 p-5">
            <legend className="px-1 font-display text-xl font-semibold text-ink">Motion</legend>
            <label className="flex min-h-11 items-center gap-3 text-sm">
              <input
                type="checkbox"
                checked={reducedMotion}
                onChange={(event) => setReducedMotion(event.target.checked)}
              />
              Reduce motion
            </label>
            <p className="text-sm text-muted">
              Also respects your operating system&apos;s reduced-motion preference when it is
              enabled.
            </p>
          </fieldset>

          <fieldset className="workspace-panel flex flex-col gap-4 p-5">
            <legend className="px-1 font-display text-xl font-semibold text-ink">Text size</legend>
            <div className="flex flex-wrap gap-3" role="group" aria-label="Text size preference">
              {(
                [
                  { value: 'default', label: 'Default' },
                  { value: 'large', label: 'Large' },
                ] as const satisfies ReadonlyArray<{
                  value: TextSizePreference
                  label: string
                }>
              ).map((option) => (
                <Button
                  key={option.value}
                  type="button"
                  variant={textSize === option.value ? 'primary' : 'secondary'}
                  aria-pressed={textSize === option.value}
                  onClick={() => setTextSize(option.value)}
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </fieldset>

          <fieldset className="workspace-panel flex flex-col gap-4 p-5">
            <legend className="px-1 font-display text-xl font-semibold text-ink">Progress</legend>
            <Button type="button" variant="secondary" disabled aria-disabled="true">
              Reset progress
            </Button>
            <p className="text-sm text-muted">
              No investigation progress can be cleared in Milestone 2. Reset will be available once
              save and restore are wired in a later milestone.
            </p>
          </fieldset>
        </form>

        <Button to="/" variant="ghost" className="w-fit">
          Back to landing
        </Button>
      </section>
    </AppShell>
  )
}
