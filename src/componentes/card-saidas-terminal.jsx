import { useFetch } from '../hooks/useFetch'
import { Onibus } from './icons'
import { Link } from 'react-router-dom'

const PARADA_TERMINAL = 4975

export default function CardSaidasTerminal() {
  const url = process.env.REACT_APP_API_URL + `/paradas/${PARADA_TERMINAL}/previsoes`
  const { loading, data, error } = useFetch(url)

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-purple-600 to-indigo-600">
              Próximas saídas
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">
              Terminal Central
            </p>
          </div>
          <Onibus className="h-6 text-purple-400" />
        </div>
      </div>

      <div className="px-5 py-3">
        {loading && (
          <div className="flex items-center justify-center py-8">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-purple-600 border-t-transparent" />
          </div>
        )}

        {error && (
          <p className="text-center text-sm text-gray-400 py-8">
            Não foi possível carregar as saídas
          </p>
        )}

        {data && data.previsoes && data.previsoes.length === 0 && (
          <p className="text-center text-sm text-gray-400 py-8">
            Nenhuma saída prevista no momento
          </p>
        )}

        {data && data.previsoes && data.previsoes.length > 0 && (
          <div className="divide-y divide-gray-100">
            {data.previsoes.slice(0, 6).map((pr, i) => (
              <Link
                key={i}
                to={`/linhas/${pr.sgLin}`}
                className="flex items-center justify-between py-2.5 px-1 rounded-md hover:bg-purple-50 transition-colors -mx-1"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold text-purple-700 border border-purple-300 shrink-0">
                    <Onibus className="h-3" />
                    {pr.sgLin}
                  </span>
                  <span className="text-sm text-gray-700 truncate">
                    {pr.apelidoLinha || pr.sgLin}
                  </span>
                </div>
                <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md shrink-0 ml-2">
                  {pr.prev}
                </span>
              </Link>
            ))}
          </div>
        )}

        {data && data.horaConsulta && (
          <div className="flex items-center justify-center gap-1.5 mt-3 mb-1 text-xs text-gray-400">
            <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
            Atualizado às {data.horaConsulta}
          </div>
        )}
      </div>

      <Link
        to={`/paradas/${PARADA_TERMINAL}?tab=previsoes`}
        className="flex items-center justify-center gap-1 py-3 bg-gray-50 text-sm font-medium text-purple-700 hover:bg-purple-50 transition-colors border-t border-gray-100"
      >
        Ver todas as saídas do Terminal Central
      </Link>
    </div>
  )
}
