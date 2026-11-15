import type { ReactNode } from 'react'

interface AppShellProps {
  children: ReactNode
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-background text-ink">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-sm focus:bg-elevated focus:px-3 focus:py-2 focus:text-ink"
      >
        Skip to main content
      </a>
      <header className="border-b border-border px-6 py-4">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
          Unofficial prototype
        </p>
      </header>
      <main id="main-content" className="px-6 py-12">
        {children}
      </main>
    </div>
  )
}
