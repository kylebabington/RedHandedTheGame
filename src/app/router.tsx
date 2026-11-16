import { BrowserRouter, Route, Routes } from 'react-router'
import { FocusOnRouteChange } from '@/components/a11y/FocusOnRouteChange'
import { SettingsDocumentSync } from '@/components/settings/SettingsDocumentSync'
import { CaseIntroPage } from '@/pages/CaseIntroPage'
import { CaseSelectPage } from '@/pages/CaseSelectPage'
import { CreditsPage } from '@/pages/CreditsPage'
import { InvestigationPage } from '@/pages/InvestigationPage'
import { LandingPage } from '@/pages/LandingPage'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { SettingsPage } from '@/pages/SettingsPage'

export function AppRouter() {
  return (
    <BrowserRouter>
      <SettingsDocumentSync />
      <FocusOnRouteChange />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/cases" element={<CaseSelectPage />} />
        <Route path="/cases/:caseId/intro" element={<CaseIntroPage />} />
        <Route path="/cases/:caseId/investigate" element={<InvestigationPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/credits" element={<CreditsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}
