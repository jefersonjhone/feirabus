import { useEffect } from 'react'
import { trackEvent } from '../utils/analytics'
import { ArrowClockwise } from '@phosphor-icons/react'

export default function Error({ error, imagesrc, onRetry }) {
  useEffect(() => {
    trackEvent('erro_api', {
      status: error?.status || 'unknown',
      message: error?.message?.name || 'unknown',
      page: window.location.pathname,
    })
  }, [error])

  return (
    <div className="bg-red-50 border border-red-100 w-full rounded-lg flex flex-col items-center justify-center py-10 px-4 text-center">
      {imagesrc && (
        <img src={imagesrc} className="w-20 h-20 mb-4 opacity-60" alt="" />
      )}
      <p className="text-lg font-bold text-red-700">
        {error?.status || 'Erro'}
      </p>
      <p className="text-sm text-red-500 mt-1 max-w-xs">
        {error?.message?.name === 'TypeError'
          ? 'Não foi possível conectar ao servidor. Verifique sua conexão.'
          : error?.message?.name || 'Algo deu errado. Tente novamente.'}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
        >
          <ArrowClockwise className="h-4 w-4" />
          Tentar novamente
        </button>
      )}
    </div>
  )
}
