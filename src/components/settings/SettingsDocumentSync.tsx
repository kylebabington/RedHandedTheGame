import { useEffect } from 'react'
import { useSettingsStore } from '@/stores/settingsStore'

/** Applies persisted text-size and reduced-motion preferences to the document root. */
export function SettingsDocumentSync() {
  const textSize = useSettingsStore((state) => state.textSize)
  const reducedMotion = useSettingsStore((state) => state.reducedMotion)

  useEffect(() => {
    const root = document.documentElement
    root.dataset.textSize = textSize
    root.dataset.reducedMotion = reducedMotion ? 'true' : 'false'
  }, [textSize, reducedMotion])

  return null
}
