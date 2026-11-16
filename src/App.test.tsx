import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router'
import { beforeEach, describe, expect, it } from 'vitest'
import { CaseIntroPage } from '@/pages/CaseIntroPage'
import { CaseSelectPage } from '@/pages/CaseSelectPage'
import { CreditsPage } from '@/pages/CreditsPage'
import { InvestigationPage } from '@/pages/InvestigationPage'
import { LandingPage } from '@/pages/LandingPage'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { SettingsPage } from '@/pages/SettingsPage'
import { useSettingsStore } from '@/stores/settingsStore'

function renderApp(initialPath: string) {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/cases" element={<CaseSelectPage />} />
        <Route path="/cases/:caseId/intro" element={<CaseIntroPage />} />
        <Route path="/cases/:caseId/investigate" element={<InvestigationPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/credits" element={<CreditsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('application foundation', () => {
  beforeEach(() => {
    useSettingsStore.setState({
      soundEnabled: true,
      musicVolume: 0.7,
      effectsVolume: 0.8,
      reducedMotion: false,
      textSize: 'default',
    })
    document.documentElement.dataset.textSize = 'default'
    document.documentElement.dataset.reducedMotion = 'false'
  })

  it('renders the landing page identity and start CTA', () => {
    renderApp('/')

    expect(
      screen.getByRole('heading', { level: 1, name: 'The Evidence Room' }),
    ).toBeInTheDocument()
    expect(
      screen.getByText(/not affiliated with or endorsed by RedHanded/i),
    ).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Start investigation' })).toHaveAttribute(
      'href',
      '/cases',
    )
    expect(screen.queryByRole('link', { name: /continue/i })).not.toBeInTheDocument()
  })

  it('routes the home path to the landing page', () => {
    renderApp('/')

    expect(screen.getByRole('heading', { name: 'The Evidence Room' })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Page not found' })).not.toBeInTheDocument()
  })

  it('shows not-found content for unknown routes', () => {
    renderApp('/missing-route')

    expect(screen.getByRole('heading', { name: 'Page not found' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Return to The Evidence Room' })).toHaveAttribute(
      'href',
      '/',
    )
  })

  it('walks landing to case selection, intro, and workspace shell', async () => {
    const user = userEvent.setup()
    renderApp('/')

    await user.click(screen.getByRole('link', { name: 'Start investigation' }))
    expect(screen.getByRole('heading', { name: 'Select a case' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'The Empty Locker' })).toBeInTheDocument()
    expect(screen.getByText('Coming soon')).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /open case file/i })).toBeInTheDocument()

    await user.click(screen.getByRole('link', { name: 'Open case file' }))
    expect(screen.getByRole('heading', { name: 'The Empty Locker' })).toBeInTheDocument()
    expect(screen.getByText(/Opening brief/i)).toBeInTheDocument()

    await user.click(screen.getByRole('link', { name: 'Enter investigation' }))
    expect(screen.getByRole('heading', { name: 'The Empty Locker' })).toBeInTheDocument()
    expect(screen.getByText(/Shell layout only/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Evidence' })).toBeDisabled()
  })

  it('reaches settings and credits from shared navigation', async () => {
    const user = userEvent.setup()
    renderApp('/')

    const nav = screen.getByRole('navigation', { name: 'Primary' })
    await user.click(within(nav).getByRole('link', { name: 'Settings' }))
    expect(screen.getByRole('heading', { name: 'Settings' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Reset progress' })).toBeDisabled()
    expect(
      screen.getByText(/No investigation progress can be cleared in Milestone 2/i),
    ).toBeInTheDocument()
    expect(screen.getByText(/Audio playback is not connected yet/i)).toBeInTheDocument()

    const settingsNav = screen.getByRole('navigation', { name: 'Primary' })
    await user.click(within(settingsNav).getByRole('link', { name: 'Credits' }))
    expect(screen.getByRole('heading', { name: 'Credits' })).toBeInTheDocument()
    expect(
      screen.getByText(/not affiliated with, endorsed by, or licensed by RedHanded/i),
    ).toBeInTheDocument()
  })

  it('updates text size and reduced motion preferences', async () => {
    const user = userEvent.setup()
    renderApp('/settings')

    await user.click(screen.getByRole('button', { name: 'Large' }))
    expect(useSettingsStore.getState().textSize).toBe('large')

    const motion = screen.getByRole('checkbox', { name: /Reduce motion/i })
    await user.click(motion)
    expect(useSettingsStore.getState().reducedMotion).toBe(true)
  })

  it('redirects locked or unknown case routes back to case selection', () => {
    renderApp('/cases/CASE_001/intro')
    expect(screen.getByRole('heading', { name: 'Select a case' })).toBeInTheDocument()

    renderApp('/cases/UNKNOWN/investigate')
    expect(screen.getAllByRole('heading', { name: 'Select a case' }).length).toBeGreaterThan(0)
  })

  it('keeps primary navigation links available on the case select screen', () => {
    renderApp('/cases')
    const nav = screen.getByRole('navigation', { name: 'Primary' })
    expect(within(nav).getByRole('link', { name: 'Cases' })).toHaveAttribute('href', '/cases')
    expect(within(nav).getByRole('link', { name: 'Settings' })).toHaveAttribute(
      'href',
      '/settings',
    )
    expect(within(nav).getByRole('link', { name: 'Credits' })).toHaveAttribute('href', '/credits')
  })
})
