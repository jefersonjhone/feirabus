import { useState, useEffect } from 'react'

function getIsIOS() {
  return /iPhone|iPad|iPod/.test(navigator.userAgent) && !window.MSStream
}

export function useInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [isInstallable, setIsInstallable] = useState(false)
  const [isIOS, setIsIOS] = useState(false)

  useEffect(() => {
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches
    const isIOSStandalone = navigator.standalone === true
    const dismissed = localStorage.getItem('install-prompt-dismissed') === 'true'
    const ios = getIsIOS()

    setIsIOS(ios)

    if (isStandalone || isIOSStandalone || dismissed) return

    if (ios) {
      setIsInstallable(true)
      return
    }

    const handler = (e) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setIsInstallable(true)
    }

    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const install = async () => {
    if (!deferredPrompt) return false
    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    setDeferredPrompt(null)
    setIsInstallable(false)
    return outcome === 'accepted'
  }

  const dismiss = () => {
    localStorage.setItem('install-prompt-dismissed', 'true')
    setIsInstallable(false)
  }

  return { isInstallable, isIOS, install, dismiss }
}
