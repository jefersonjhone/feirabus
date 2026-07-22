import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { trackEvent } from '../utils/analytics'
import { MagnifyingGlass } from '@phosphor-icons/react'

export default function NotFound() {
  useEffect(() => {
    trackEvent('pagina_nao_encontrada', { page: window.location.pathname })
  }, [])

  return (
    <div className="min-h-[80dvh] flex flex-col items-center justify-center px-4">
      <MagnifyingGlass className="h-12 w-12 text-gray-300 mb-4" />
      <h1 className="text-2xl font-bold text-slate-900 mb-2">Página não encontrada</h1>
      <p className="text-sm text-gray-500 text-center mb-6 max-w-xs">
        A página que você procura não existe ou foi removida.
      </p>
      <Link to="/" className="px-5 py-2.5 rounded-lg bg-purple-800 text-white text-sm font-medium hover:bg-purple-700 transition-colors">
        Voltar ao início
      </Link>
    </div>
  )
}
