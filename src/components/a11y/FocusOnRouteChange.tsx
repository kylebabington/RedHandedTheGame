import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router'

/**
 * Moves keyboard focus to main content after client-side navigations
 * so screen-reader and keyboard users land in the new page.
 */
export function FocusOnRouteChange() {
  const location = useLocation()
  const isFirstRender = useRef(true)

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }

    const frame = window.requestAnimationFrame(() => {
      const main = document.getElementById('main-content')
      if (!main) {
        return
      }

      if (!main.hasAttribute('tabindex')) {
        main.setAttribute('tabindex', '-1')
      }
      main.focus({ preventScroll: true })
    })

    return () => window.cancelAnimationFrame(frame)
  }, [location.pathname])

  return null
}
