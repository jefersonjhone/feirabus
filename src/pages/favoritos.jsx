import { useState } from 'react'
import { Helmet } from 'react-helmet'
import { Link } from 'react-router-dom'
import Navbar from '../componentes/navbar'
import { useLinhasStore } from '../stores/linhaStore'
import { useToastStore } from '../stores/toastStore'
import { Estrela, Onibus, PinoLocalizacao, Seta } from '../componentes/icons'

export default function Favoritos() {
  const [tab, setTab] = useState(0)
  const favoritosLinhas = useLinhasStore((s) => s.favoritosLinhas)
  const favoritosParadas = useLinhasStore((s) => s.favoritosParadas)
  const toggleFavLinha = useLinhasStore((s) => s.toggleFavLinha)
  const toggleFavParada = useLinhasStore((s) => s.toggleFavParada)
  const notify = useToastStore((s) => s.notify)

  const tabs = [
    { label: 'Linhas', icon: <Onibus className="h-4" />, count: favoritosLinhas.length },
    { label: 'Paradas', icon: <PinoLocalizacao className="h-4" />, count: favoritosParadas.length },
  ]

  return (
    <>
      <Helmet>
        <title>Favoritos | FeiraBus</title>
        <meta name="description" content="Suas linhas e paradas favoritas do transporte público de Feira de Santana." />
      </Helmet>
      <Navbar page={'favoritos'} />
      <div className="w-full mx-auto text-left max-w-[1200px] px-2 relative z-0">
        <div className="label h-fit">
          <h1 className="text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-sky-500 to-purple-500 pl-2 w-fit">
            Favoritos
          </h1>
          <h3 className="text-sm text-gray-500 font-medium mb-4 pl-2">
            Suas linhas e paradas salvas para acesso rápido
          </h3>
        </div>

        <ul className="w-full bg-slate-100 flex flex-row gap-1 px-1 py-2 rounded-sm items-center text-slate-400 text-sm mb-4">
          {tabs.map((t, i) => (
            <li
              key={i}
              className={
                i === tab
                  ? 'bg-purple-800 p-1 rounded-full w-1/2 text-center text-white font-medium shadow-md'
                  : 'p-1 rounded-full bg-white w-1/2 text-center cursor-pointer shadow-sm border hover:border hover:border-purple-800 hover:text-purple-800'
              }
              onClick={() => setTab(i)}
            >
              <span className="flex items-center justify-center gap-1">
                {t.icon}
                {t.label}
                {t.count > 0 && (
                  <span className="text-xs bg-yellow-500 text-white rounded-full px-1.5 py-0.5">
                    {t.count}
                  </span>
                )}
              </span>
            </li>
          ))}
        </ul>

        {tab === 0 && (
          <div className="flex flex-col gap-2">
            {favoritosLinhas.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 gap-4 text-gray-400">
                <Estrela className="h-12 w-12" />
                <p className="text-base font-medium">Nenhuma linha favoritada</p>
                <Link to="/linhas" className="text-purple-800 font-medium text-sm hover:underline">
                  Explorar linhas
                </Link>
              </div>
            ) : (
              favoritosLinhas.map((linha) => (
                <div
                  key={linha.sgl}
                  className="border border-b-1 border-gray-300 min-h-12 md:min-h-16 w-full rounded-lg px-2 md:px-4 border-l-purple-800 border-l-4 border-t-purple-800 border-t-1"
                >
                  <div className="flex flex-row gap-1 md:gap-2 h-full items-center">
                    <div className="p-1 md:px-2 border text-purple-800 border-purple-800 rounded-md text-base font-bold text-center flex items-center gap-2">
                      <Onibus />
                      {linha.sgl}
                    </div>
                    <div className="font-medium text-sm md:text-base truncate w-full">{linha.nom}</div>
                    <button
                      onClick={() => {
                        toggleFavLinha(linha)
                        notify(`Linha ${linha.sgl} removida dos favoritos`, 'success')
                      }}
                      className="flex items-center justify-center h-8 w-8 text-yellow-500 hover:text-yellow-600"
                    >
                      <Estrela className="h-5 w-5 fill-yellow-500" />
                    </button>
                    <Link
                      to={`/linhas/${linha.sgl}`}
                      className="flex items-center justify-center h-8 min-w-16 bg-purple-800 px-2 rounded-md text-white font-semibold leading-4 text-xs"
                    >
                      Detalhes <Seta className="h-4" />
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {tab === 1 && (
          <div className="flex flex-col gap-2">
            {favoritosParadas.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 gap-4 text-gray-400">
                <Estrela className="h-12 w-12" />
                <p className="text-base font-medium">Nenhuma parada favoritada</p>
                <Link to="/paradas" className="text-purple-800 font-medium text-sm hover:underline">
                  Explorar paradas
                </Link>
              </div>
            ) : (
              favoritosParadas.map((parada) => (
                <div
                  key={parada.cod}
                  className="border border-b-1 border-gray-300 min-h-12 md:min-h-16 w-full rounded-lg px-2 md:px-4 border-l-purple-800 border-l-4 border-t-purple-800 border-t-1"
                >
                  <div className="flex flex-row gap-1 md:gap-2 h-full items-center">
                    <div className="p-1 md:px-2 border text-purple-800 border-purple-800 rounded-md text-base font-bold text-center flex items-center gap-2">
                      <PinoLocalizacao />
                      {parada.cod}
                    </div>
                    <div className="font-medium text-sm md:text-base truncate w-full">{parada.desc}</div>
                    <button
                      onClick={() => {
                        toggleFavParada(parada)
                        notify(`Parada ${parada.cod} removida dos favoritos`, 'success')
                      }}
                      className="flex items-center justify-center h-8 w-8 text-yellow-500 hover:text-yellow-600"
                    >
                      <Estrela className="h-5 w-5 fill-yellow-500" />
                    </button>
                    <Link
                      to={`/paradas/${parada.cod}`}
                      className="flex items-center justify-center h-8 min-w-16 bg-purple-800 px-2 rounded-md text-white font-semibold leading-4 text-xs"
                    >
                      Detalhes <Seta className="h-4" />
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </>
  )
}
