import { useParams, useNavigate } from 'react-router-dom'
import Navbar from '../componentes/navbar'
import EmptyState from '../componentes/empty-state'
import { Wrench, MapPin } from '@phosphor-icons/react'
import { useLinhasStore } from '../stores/linhaStore'

export function Rotas() {
  const { origem, destino } = useParams()
  const navigate = useNavigate()
  const paradas = useLinhasStore((s) => s.paradas)

  const paradaOrigem = origem ? paradas[origem] || { cod: origem } : null
  const paradaDestino = destino ? paradas[destino] || { cod: destino } : null

  return (
    <>
      <Navbar page="rotas" />
      <div className="w-full mx-auto text-left max-w-[1200px] px-2 relative z-0">
        <div className="px-2 pt-4 md:pt-6 pb-2">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center justify-center w-8 h-8 rounded-lg text-gray-500 hover:text-purple-700 hover:bg-purple-50 transition-colors -ml-1"
              aria-label="Voltar"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            </button>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
                Rotas
              </h1>
              <h3 className="text-xs md:text-sm text-slate-500 mt-0.5">
                Planeje sua viagem entre paradas de ônibus
              </h3>
            </div>
          </div>
        </div>

        {paradaOrigem && paradaDestino && (
          <div className="mx-2 mb-4 border border-gray-200 rounded-lg px-3 md:px-4 py-3 shadow-sm">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <div className="px-2 border text-green-700 border-green-200 bg-green-50 rounded-md text-xs font-bold flex items-center gap-1.5 shrink-0">
                  <MapPin className="h-3.5" />
                  Origem
                </div>
                <span className="text-sm font-medium text-gray-700 truncate">{paradaOrigem.desc || paradaOrigem.cod}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="px-2 border text-red-700 border-red-200 bg-red-50 rounded-md text-xs font-bold flex items-center gap-1.5 shrink-0">
                  <MapPin className="h-3.5" />
                  Destino
                </div>
                <span className="text-sm font-medium text-gray-700 truncate">{paradaDestino.desc || paradaDestino.cod}</span>
              </div>
            </div>
          </div>
        )}

        <EmptyState
          icon={<Wrench className="h-6 w-6" />}
          title="Em breve"
          description="Estamos trabalhando nessa funcionalidade. Em breve você poderá buscar rotas entre paradas de ônibus."
        />
      </div>
    </>
  )
}
