import { useEffect, useState } from 'react'
import { useSettingsStore } from '@/stores/settingsStore'

function getOsReducedMotion(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) {
    return false
  }
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/** True when OS prefers reduced motion or the in-app setting is enabled. */
export function useReducedMotionPreference(): boolean {
  const inAppReducedMotion = useSettingsStore((state) => state.reducedMotion)
  const [osReducedMotion, setOsReducedMotion] = useState(getOsReducedMotion)

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) {
      return
    }
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onChange = () => setOsReducedMotion(media.matches)
    onChange()
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [])

  return osReducedMotion || inAppReducedMotion
}
