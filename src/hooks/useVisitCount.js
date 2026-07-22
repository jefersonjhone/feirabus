import { useState, useEffect } from 'react'

export function useVisitCount() {
  const [shouldShow, setShouldShow] = useState(false)

  useEffect(() => {
    const dismissed = localStorage.getItem('fav-prompt-dismissed') === 'true'
    if (dismissed) return

    const count = parseInt(localStorage.getItem('feirabus-visit-count') || '0', 10)
    const next = count + 1
    localStorage.setItem('feirabus-visit-count', String(next))

    if (next >= 3) {
      setShouldShow(true)
    }
  }, [])

  const dismiss = () => {
    localStorage.setItem('fav-prompt-dismissed', 'true')
    setShouldShow(false)
  }

  return { shouldShow, dismiss }
}
