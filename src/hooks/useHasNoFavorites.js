import { useState } from 'react'
import { useLinhasStore } from '../stores/linhaStore'

export function useHasNoFavorites() {
  const favoritosLinhas = useLinhasStore((s) => s.favoritosLinhas)
  const favoritosParadas = useLinhasStore((s) => s.favoritosParadas)
  const [dismissed, setDismissed] = useState(
    () => localStorage.getItem('fav-prompt-dismissed') === 'true'
  )

  const hasNoFavorites = !dismissed && favoritosLinhas.length === 0 && favoritosParadas.length === 0

  const dismiss = () => {
    localStorage.setItem('fav-prompt-dismissed', 'true')
    setDismissed(true)
  }

  return { hasNoFavorites, dismiss }
}
