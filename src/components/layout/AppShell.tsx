import type { ReactNode } from 'react'
import { NavLink } from 'react-router'

interface AppShellProps {
  children: ReactNode
}

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  [
    'rounded-sm px-2 py-1.5 text-sm transition-colors',
    isActive ? 'text-ink' : 'text-muted hover:text-ink',
  ].join(' ')

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="atmosphere relative min-h-screen text-ink">
      <div className="atmosphere-overlay pointer-events-none absolute inset-0" aria-hidden="true" />

      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-sm focus:bg-elevated focus:px-3 focus:py-2 focus:text-ink"
      >
        Skip to main content
      </a>

      <header className="relative z-10 border-b border-border/80 bg-background/70 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div className="min-w-0">
            <p className="font-mono text-[0.7rem] uppercase tracking-[0.2em] text-muted">
              Unofficial prototype
            </p>
            <NavLink
              to="/"
              className="font-display text-lg font-semibold tracking-tight text-ink hover:text-crimson-bright"
            >
              The Evidence Room
            </NavLink>
          </div>
          <nav aria-label="Primary" className="flex flex-wrap items-center gap-1 sm:gap-2">
            <NavLink to="/cases" className={navLinkClass}>
              Cases
            </NavLink>
            <NavLink to="/settings" className={navLinkClass}>
              Settings
            </NavLink>
            <NavLink to="/credits" className={navLinkClass}>
              Credits
            </NavLink>
          </nav>
        </div>
      </header>

      <main
        id="main-content"
        tabIndex={-1}
        className="relative z-10 mx-auto max-w-6xl px-4 py-10 outline-none sm:px-6 sm:py-12"
      >
        {children}
      </main>
    </div>
  )
}
