import { useFetch } from '../hooks/useFetch'
import { motion } from 'motion/react'
import { Bus, ArrowUpRight } from '@phosphor-icons/react'
import { Link } from 'react-router-dom'

const PARADA_TERMINAL = 4975

export default function CardSaidasTerminal() {
  const url = process.env.REACT_APP_API_URL + `/paradas/${PARADA_TERMINAL}/previsoes`
  const { loading, data, error } = useFetch(url)

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="p-[3px] rounded-xl bg-gray-50/40 ring-1 ring-gray-200/30 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-purple-50/40 hover:ring-purple-200/30 hover:shadow-[0_4px_20px_-6px_rgba(168,85,247,0.08)]">
        <div className="rounded-[calc(0.75rem-3px)] bg-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.6)] overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase tracking-[0.15em] font-medium text-purple-500 mb-1 block">Terminal Central</span>
                <h2 className="text-xl md:text-2xl font-semibold tracking-tight text-slate-900">
                  Próximas saídas
                </h2>
              </div>
              <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
                <Bus className="h-5 w-5" />
              </div>
            </div>
          </div>

          <div className="px-5 py-3">
            {loading && (
              <div className="flex items-center justify-center py-8">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-purple-400 border-t-transparent" />
              </div>
            )}

            {error && (
              <p className="text-center text-sm text-slate-400 py-8">Não foi possível carregar as saídas</p>
            )}

            {data && data.previsoes && data.previsoes.length === 0 && (
              <p className="text-center text-sm text-slate-400 py-8">Nenhuma saída prevista no momento</p>
            )}

            {data && data.previsoes && data.previsoes.length > 0 && (
              <div className="divide-y divide-gray-100">
                {data.previsoes.slice(0, 6).map((pr, i) => (
                  <Link
                    key={i}
                    to={`/linhas/${pr.sgLin}`}
                    className="group flex items-center justify-between py-2.5 px-1 rounded-md hover:bg-purple-50/50 transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] -mx-1"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold text-purple-700 border border-purple-200 shrink-0">
                        <Bus className="h-3" />
                        {pr.sgLin}
                      </span>
                      <span className="text-sm text-slate-700 truncate">
                        {pr.apelidoLinha || pr.sgLin}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 ml-2">
                      <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md">
                        {pr.prev}
                      </span>
                      <ArrowUpRight className="h-3.5 w-3.5 text-slate-300 transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:text-purple-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {data && data.horaConsulta && (
              <div className="flex items-center justify-center gap-1.5 mt-3 mb-1 text-[11px] text-slate-400">
                <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
                Atualizado às {data.horaConsulta}
              </div>
            )}
          </div>

          <Link
            to={`/paradas/${PARADA_TERMINAL}?tab=previsoes`}
            className="group flex items-center justify-center gap-2 py-3.5 bg-gray-50 text-sm font-medium text-slate-500 hover:text-purple-700 transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] border-t border-gray-100"
          >
            Ver todas as saídas
            <span className="w-6 h-6 rounded-full bg-purple-50 flex items-center justify-center transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:bg-purple-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
              <ArrowUpRight className="h-3 w-3 text-purple-600" />
            </span>
          </Link>
        </div>
      </div>
    </motion.div>
  )
}
