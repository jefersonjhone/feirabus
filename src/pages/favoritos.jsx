import { useState } from 'react'
import { Helmet } from 'react-helmet'
import { Link, useNavigate } from 'react-router-dom'
import { motion, useReducedMotion } from 'motion/react'
import Navbar from '../componentes/navbar'
import EmptyState from '../componentes/empty-state'
import { useLinhasStore } from '../stores/linhaStore'
import { useToastStore } from '../stores/toastStore'
import { Star, Bus, MapPin, CaretRight } from '@phosphor-icons/react'

export default function Favoritos() {
  const [tab, setTab] = useState(0)
  const favoritosLinhas = useLinhasStore((s) => s.favoritosLinhas)
  const favoritosParadas = useLinhasStore((s) => s.favoritosParadas)
  const toggleFavLinha = useLinhasStore((s) => s.toggleFavLinha)
  const toggleFavParada = useLinhasStore((s) => s.toggleFavParada)
  const notify = useToastStore((s) => s.notify)
  const reduced = useReducedMotion()
  const navigate = useNavigate()

  const tabs = [
    { label: 'Paradas', icon: <MapPin className="h-5 w-5" />, count: favoritosParadas.length },
    { label: 'Linhas', icon: <Bus className="h-5 w-5" />, count: favoritosLinhas.length },
  ]

  return (
    <>
      <Helmet>
        <title>Favoritos | FeiraBus</title>
        <meta name="description" content="Suas linhas e paradas favoritas do transporte público de Feira de Santana." />
      </Helmet>
      <Navbar page="favoritos" />
      <div className="w-full mx-auto text-left max-w-[1200px] px-2 relative z-0">
        <div className="px-2 pt-4 md:pt-6 pb-2">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center justify-center w-8 h-8 rounded-lg text-gray-500 hover:text-purple-700 hover:bg-purple-50 transition-colors -ml-1"
              aria-label="Voltar"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m15 18-6-6 6-6"/>
              </svg>
            </button>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
                Favoritos
              </h1>
              <h3 className="text-xs md:text-sm text-slate-500 mt-0.5">
                Suas linhas e paradas salvas para acesso rápido
              </h3>
            </div>
          </div>
        </div>

        <div className="flex gap-2 bg-gray-100 rounded-xl h-11 p-1 mb-4">
          {tabs.map((t, i) => (
            <button
              key={t.label}
              className={`flex items-center justify-center gap-1.5 h-full flex-1 rounded-lg text-sm font-medium transition-all ${
                tab === i
                  ? 'bg-purple-800 text-white shadow-sm'
                  : 'text-gray-500 hover:text-purple-800'
              }`}
              onClick={() => setTab(i)}
            >
              {t.icon}
              {t.label}
              {t.count > 0 && (
                <span className={`text-xs rounded-full px-1.5 py-0.5 ${
                  tab === i ? 'bg-white/20 text-white' : 'bg-yellow-500 text-white'
                }`}>
                  {t.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {tab === 0 && (
          <div className="flex flex-col gap-2 pb-8">
            {favoritosParadas.length === 0 ? (
              <EmptyState
                icon={<MapPin className="h-6 w-6" />}
                title="Nenhuma parada favoritada"
                description="Salve suas paradas favoritas para acessá-las rapidamente."
                to="/paradas"
                actionLabel="Explorar paradas"
              />
            ) : (
              favoritosParadas.map((parada) => (
                <motion.div
                  key={parada.cod}
                  initial={reduced ? {} : { opacity: 0, y: 12 }}
                  whileInView={reduced ? {} : { opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                >
                  <Link to={`/paradas/${parada.cod}`} className="block">
                    <div className="border border-gray-200 min-h-14 md:min-h-[4.5rem] w-full rounded-lg px-3 md:px-5 py-2 shadow-sm hover:shadow-md transition-shadow cursor-pointer active:bg-purple-50/30">
                      <div className="flex flex-row gap-2 md:gap-3 h-full items-center">
                        <div className="p-1 md:px-2 border text-purple-700 border-purple-200 rounded-md text-sm font-bold text-center flex items-center gap-2 shrink-0">
                          <MapPin className="h-5 w-5" />
                          {parada.cod}
                        </div>
                        <div className="font-medium text-sm md:text-base truncate w-full">{parada.desc}</div>
                        <button
                          onClick={(e) => { e.stopPropagation(); e.preventDefault(); toggleFavParada(parada); notify(`Parada ${parada.cod} removida dos favoritos`, 'info') }}
                          className="flex items-center justify-center h-11 w-11 shrink-0 text-yellow-500 hover:text-yellow-600"
                          aria-label="Remover dos favoritos"
                        >
                          <Star weight="fill" className="h-5 w-5 text-yellow-500" />
                        </button>
                        <CaretRight className="h-5 w-5 text-gray-400 shrink-0" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))
            )}
          </div>
        )}

        {tab === 1 && (
          <div className="flex flex-col gap-2 pb-8">
            {favoritosLinhas.length === 0 ? (
              <EmptyState
                icon={<Star className="h-6 w-6" />}
                title="Nenhuma linha favoritada"
                description="Salve suas linhas favoritas para acessá-las rapidamente."
                to="/linhas"
                actionLabel="Explorar linhas"
              />
            ) : (
              favoritosLinhas.map((linha) => (
                <motion.div
                  key={linha.sgl}
                  initial={reduced ? {} : { opacity: 0, y: 12 }}
                  whileInView={reduced ? {} : { opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                >
                  <Link to={`/linhas/${linha.sgl}`} className="block">
                    <div className="border border-gray-200 min-h-14 md:min-h-[4.5rem] w-full rounded-lg px-3 md:px-5 py-2 shadow-sm hover:shadow-md transition-shadow cursor-pointer active:bg-purple-50/30">
                      <div className="flex flex-row gap-2 md:gap-3 h-full items-center">
                        <div className="p-1 md:px-2 border text-purple-700 border-purple-200 rounded-md text-sm font-bold text-center flex items-center gap-2 shrink-0">
                          <Bus className="h-5 w-5" />
                          {linha.sgl}
                        </div>
                        <div className="font-medium text-sm md:text-base truncate w-full">{linha.nom}</div>
                        <button
                          onClick={(e) => { e.stopPropagation(); e.preventDefault(); toggleFavLinha(linha); notify(`Linha ${linha.sgl} removida dos favoritos`, 'info') }}
                          className="flex items-center justify-center h-11 w-11 shrink-0 text-yellow-500 hover:text-yellow-600"
                          aria-label="Remover dos favoritos"
                        >
                          <Star weight="fill" className="h-5 w-5 text-yellow-500" />
                        </button>
                        <CaretRight className="h-5 w-5 text-gray-400 shrink-0" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))
            )}
          </div>
        )}
      </div>
    </>
  )
}
