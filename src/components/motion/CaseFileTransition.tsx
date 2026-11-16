import type { ReactNode } from 'react'
import { motion } from 'motion/react'
import { useReducedMotionPreference } from '@/hooks/useReducedMotionPreference'

type CaseFileTransitionProps = {
  title: string
  children: ReactNode
}

export function CaseFileTransition({ title, children }: CaseFileTransitionProps) {
  const reduceMotion = useReducedMotionPreference()

  return (
    <motion.div
      className="case-file relative overflow-hidden rounded-md border border-border bg-paper text-background shadow-[0_24px_60px_rgba(0,0,0,0.45)]"
      initial={reduceMotion ? false : { rotateX: 18, y: 28, opacity: 0.35 }}
      animate={{ rotateX: 0, y: 0, opacity: 1 }}
      transition={
        reduceMotion
          ? { duration: 0 }
          : { type: 'spring', stiffness: 120, damping: 18, mass: 0.9 }
      }
      style={{ transformPerspective: 900 }}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{ backgroundImage: "url('/textures/paper.svg')" }}
        aria-hidden="true"
      />
      <div className="relative border-b border-border/40 bg-background/5 px-5 py-3 font-mono text-xs uppercase tracking-[0.2em] text-background/70">
        Case file · {title}
      </div>
      <div className="relative px-5 py-6 md:px-8 md:py-8">{children}</div>
    </motion.div>
  )
}
