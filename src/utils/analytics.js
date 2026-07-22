export function trackEvent(action, params = {}) {
  if (typeof window.gtag === 'function') {
    window.gtag('event', action, params)
  }
}
