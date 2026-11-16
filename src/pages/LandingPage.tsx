import { motion } from 'motion/react'
import { AppShell } from '@/components/layout/AppShell'
import { Button } from '@/components/ui/Button'
import { useReducedMotionPreference } from '@/hooks/useReducedMotionPreference'

export function LandingPage() {
  const reduceMotion = useReducedMotionPreference()

  return (
    <AppShell>
      <section
        className="landing-hero-glow relative mx-auto flex max-w-3xl flex-col gap-8"
        aria-labelledby="project-title"
      >
        <motion.div
          className="flex flex-col gap-5"
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={reduceMotion ? { duration: 0 } : { duration: 0.55, ease: 'easeOut' }}
        >
          <p className="font-mono text-sm uppercase tracking-[0.18em] text-crimson">
            Every story has a second version
          </p>
          <h1
            id="project-title"
            className="font-display text-5xl font-semibold tracking-tight text-ink sm:text-6xl md:text-7xl"
          >
            The Evidence Room
          </h1>
          <p className="max-w-2xl text-lg text-muted">
            An unofficial interactive mystery game concept inspired by investigative storytelling.
            Examine evidence, challenge assumptions, and reconstruct what actually happened.
          </p>
          <p className="max-w-2xl text-base text-muted">
            This is a fan pitch prototype and is not affiliated with or endorsed by RedHanded.
          </p>
        </motion.div>

        <div className="flex flex-wrap gap-3">
          <Button to="/cases" variant="primary">
            Start investigation
          </Button>
          <Button to="/settings" variant="secondary">
            Settings
          </Button>
          <Button to="/credits" variant="ghost">
            Credits
          </Button>
        </div>
      </section>
    </AppShell>
  )
}
