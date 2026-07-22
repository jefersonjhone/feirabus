import { useState, useEffect } from 'react'
import {
  MapContainer,
  TileLayer,
  Marker,
  CircleMarker,
  Popup,
  useMap,
} from 'react-leaflet'
import { BusIconBlue, ParadaIconSelected, MarkerPurpleIcon, SquareIcon } from '../../utils/Icons.js'
import 'leaflet/dist/leaflet.css'
import AntPath from '../../componentes/AntPath.jsx'
import 'leaflet-ant-path'
import url from '../../utils/urls.js'
import { useFetch } from '../../hooks/useFetch.jsx'
import { BarLoading } from '../../componentes/loading.jsx'
import Error from '../../componentes/error.jsx'
import { Link, useNavigate, useSearchParams, useParams } from 'react-router-dom'
import { Star, X, Bus, MapPin, CaretRight, ArrowUpRight } from '@phosphor-icons/react'
import { QuadroHorarios, RotaComBandeira } from '../../componentes/icons.jsx'
import ShareDialog from '../../componentes/share-dialog.jsx'
import { Helmet } from 'react-helmet'
import Navbar from '../../componentes/navbar.jsx'
import { useLinhasStore } from '../../stores/linhaStore.js'
import { useToastStore } from '../../stores/toastStore'
import { useStops } from '../../hooks/useStops.js'
import { trackEvent } from '../../utils/analytics'
import FavPrompt from '../../componentes/fav-prompt.jsx'
import { useHasNoFavorites } from '../../hooks/useHasNoFavorites.js'

export const StopDetail = () => {
  const [itinerarioAtivo, setItinerarioAtivo] = useState(null)
  const [page, setPage] = useState(0)
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const tab = params.get('tab')
  const { cod } = useParams()
  const stop = useStops(cod)
  const { hasNoFavorites, dismiss } = useHasNoFavorites()
  const store = useLinhasStore()
  const notify = useToastStore((s) => s.notify)

  const opcoes = ['Previsões', 'Linhas', 'Paradas Próximas']

  const handle_exit = () => {
    navigate(-1)
  }

  const handleSetPage = (val) => {
    trackEvent('mudar_aba', { page: window.location.pathname, tab: opcoes[val] })
    params.set('tab', opcoes[val])
    navigate({ search: params.toString() }, { replace: true })
    setItinerarioAtivo(null)
    setPage(val)
  }

  const opcoes_icons = {
    'Previsões': <QuadroHorarios className="h-5 w-5" />,
    'Linhas': <Bus className="h-5 w-5" />,
    'Paradas Próximas': <MapPin className="h-5 w-5" />,
  }

  const { data: linhaQueAtendem, loading: loadingLinhas, error: errorLinhas } = useFetch(stop ? `${url}/paradas/${stop.cod}/linhas-que-atendem` : null)
  const { data: previsoes, loading: loadingPrevisoes, error: errorPrevisoes } = useFetch(stop ? `${url}/paradas/${stop.cod}/previsoes` : null)
  const { data: paradas_proximas, loading: loadingProximas, error: errorProximas } = useFetch(stop ? `${url}/paradas/paradas-proximas/@${stop.x},${stop.y}` : null)

  return (
    <>
      <Helmet>
        <title>{stop?.desc} | Linhas, Previsões e Localização da Parada</title>
        <meta name="description" content={`Consulte as linhas que atendem a parada ${stop?.desc}, previsões de chegada, localização no mapa, itinerários e paradas próximas em Feira de Santana - BA.`} />
        <meta name="robots" content="index,follow" />
        <link rel="canonical" href={`https://feirabus.vercel.app/paradas/${stop?.cod}`} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://feirabus.vercel.app/paradas/${stop?.cod}`} />
        <meta property="og:title" content={`${stop?.desc} | Parada de Ônibus em Feira de Santana`} />
        <meta property="og:description" content={`Veja previsões de chegada, linhas atendidas, itinerários e localização da parada ${stop?.desc}.`} />
        <meta property="og:image" content="https://feirabus.vercel.app/logo_feirabus.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${stop?.desc} | Parada de Ônibus`} />
        <meta name="twitter:description" content={`Consulte linhas, previsões de chegada e localização da parada ${stop?.desc} em Feira de Santana.`} />
        <meta name="twitter:image" content="https://feirabus.vercel.app/logo_feirabus.png" />
      </Helmet>
      <Navbar page="paradas" />
      <div className="w-full mx-auto text-left max-w-[1200px] px-2">
        <div className="py-6 md:py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center justify-center w-8 h-8 rounded-lg text-gray-500 hover:text-purple-700 hover:bg-purple-50 transition-colors -ml-1 shrink-0"
                aria-label="Voltar"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
              </button>
              <h1 className="text-lg sm:text-2xl font-bold text-slate-900">
                Parada {stop?.desc}
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <ShareDialog
                title={`Previsões da Parada ${stop?.cod}`}
                text={`Confira as previsões da Parada ${stop?.cod} no FeiraBus`}
              />
              <div className="flex flex-col items-center gap-0.5">
                <FavButtonParada parada={stop} />
                <span className="block text-[10px] text-gray-400 leading-tight">Favoritar</span>
              </div>
            </div>
          </div>
        </div>

        {hasNoFavorites && stop && (
          <div className="mb-4">
            <FavPrompt
              type="parada"
              itemName={stop.desc}
              onDismiss={dismiss}
              onFavorite={() => {
                const adding = !store.isFavParada(stop.cod)
                store.toggleFavParada(stop)
                trackEvent('favoritar', { action: adding ? 'add' : 'remove', type: 'parada', id: stop.cod })
                notify(
                  adding
                    ? `Parada ${stop.cod} adicionada aos favoritos`
                    : `Parada ${stop.cod} removida dos favoritos`,
                  adding ? 'success' : 'info',
                  adding,
                )
                dismiss()
              }}
            />
          </div>
        )}

        <div className="flex flex-col gap-1 mb-4 sticky top-0 z-10 bg-white">
          <div className="flex gap-2 bg-gray-100 rounded-xl h-11 p-1" role="tablist" aria-label="Detalhes da parada">
            {opcoes.map((p, i) =>
              <button
                key={i}
                role="tab"
                aria-selected={i === page}
                aria-controls={`tabpanel-${i}`}
                id={`tab-${i}`}
                className={`flex items-center justify-center gap-1 h-full flex-1 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                  i === page ? 'bg-purple-800 text-white shadow-sm' : 'text-gray-500 hover:text-purple-800'
                }`}
                onClick={() => handleSetPage(i)}
              >
                {opcoes_icons[p]}
                <span className="truncate">{p}</span>
              </button>
            )}
          </div>
        </div>

        {stop?.x && stop?.y ? (
          <div className="w-full border rounded-md overflow-hidden mb-3">
            <Location lat={stop.y} long={stop?.x} itinerarioAtivo={itinerarioAtivo} paradas_proximas={page === 2 ? paradas_proximas?.paradas : []} />
          </div>
        ) : (
          <p>localização faltando</p>
        )}

        <div className="flex items-center gap-1.5 text-[11px] text-gray-400 mb-3">
          <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
          Atualizado {previsoes?.horaConsulta || '...'}
        </div>

        <section role="tabpanel" id="tabpanel-0" aria-labelledby="tab-0" className={`flex flex-col gap-3 ${page === 0 ? '' : 'hidden'}`}>
          <h3 className="text-sm font-semibold text-slate-700 px-1">Próximos ônibus</h3>
          {loadingPrevisoes ? (
            <BarLoading />
          ) : errorPrevisoes ? (
            <Error error={errorPrevisoes} imagesrc="./explorar.png" />
          ) : previsoes?.previsoes?.map(p =>
            <Link to={`/linhas/${p.sgLin}`} key={p.cod}
              className="group flex items-center justify-between gap-2 px-3 md:px-4 py-2 shadow-sm rounded-lg border border-gray-200 hover:shadow-md hover:border-purple-200 transition-all text-xs"
            >
              <div className="flex items-center gap-2 md:gap-3 min-w-0 flex-1">
                <div className="flex items-center gap-1 md:gap-2 p-1 md:p-2 rounded-md text-purple-700 border border-purple-200 font-bold shrink-0">
                  <Bus className="h-4 md:h-5 w-4 md:w-5" />
                  {p.sgLin}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-semibold text-xs md:text-sm">{p.apelidoLinha || p.sgLin || 'Linha'}</div>
                  {p.numVeicGestor && (
                    <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                      <Bus className="h-3" /> Veículo {p.numVeicGestor}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex flex-col items-end gap-1 shrink-0">
                <div className="text-xs bg-emerald-50 px-2 py-1 rounded-md text-emerald-700 font-medium text-nowrap">{p.prev}</div>
                {p.codItinerario && (
                  <button
                    onClick={(e) => { e.stopPropagation(); e.preventDefault(); setItinerarioAtivo(itinerarioAtivo === p.codItinerario ? null : p.codItinerario) }}
                    className={`flex items-center rounded-lg text-xs px-2 py-1 transition-colors ${itinerarioAtivo === p.codItinerario ? 'bg-emerald-200 text-emerald-800' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                  >
                    <RotaComBandeira className="h-3.5 w-3.5 mr-1" />
                    {itinerarioAtivo === p.codItinerario ? 'Ocultar' : 'Ver rota'}
                  </button>
                )}
              </div>
              <CaretRight className="h-4 w-4 text-gray-400 shrink-0 ml-1" />
            </Link>
          )}
        </section>

        <section id="tabpanel-1" role="tabpanel" aria-labelledby="tab-1" className={`flex flex-col gap-3 ${page === 1 ? '' : 'hidden'}`}>
          <h3 className="text-sm font-semibold text-slate-700 px-1">Linhas que atendem</h3>
          {loadingLinhas ? (
            <BarLoading />
          ) : errorLinhas ? (
            <Error error={errorLinhas} imagesrc="./explorar.png" />
          ) : linhaQueAtendem && (() => {
            const linhas = linhaQueAtendem.linhas
            const linhasList = Array.isArray(linhas) ? linhas : Object.values(linhas || {})
            return linhasList.map(p =>
              <Link to={`/linhas/${p.num_linha}`} key={p.num_linha}
                className="group flex items-center justify-between gap-2 px-3 md:px-4 py-2 shadow-sm rounded-lg border border-gray-200 hover:shadow-md hover:border-purple-200 transition-all text-xs"
              >
                <div className="flex items-center gap-2 md:gap-3 min-w-0">
                  <div className="flex items-center gap-2 px-2 py-1 rounded-md text-purple-700 border border-purple-200 font-bold shrink-0">
                    {p.num_linha}
                  </div>
                  <div className="min-w-0">
                    <div className="font-medium text-sm">{p.descricao}</div>
                    {p.numVeicGestor && (
                      <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                        <Bus className="h-3" /> Veículo {p.numVeicGestor}
                      </div>
                    )}
                  </div>
                </div>
                <CaretRight className="h-4 w-4 text-gray-400 shrink-0" />
              </Link>
            )
          })()}
        </section>

        <section id="tabpanel-2" role="tabpanel" aria-labelledby="tab-2" className={`flex flex-col gap-3 ${page === 2 ? '' : 'hidden'}`}>
          <h3 className="text-sm font-semibold text-slate-700 px-1">Paradas próximas</h3>
          {loadingProximas ? (
            <BarLoading />
          ) : errorProximas ? (
            <Error error={errorProximas} imagesrc="./explorar.png" />
          ) : paradas_proximas?.paradas?.filter(p => p.cod !== stop.cod).map(p =>
            <Link to={`/paradas/${p.cod}`} key={p.cod} className="group flex items-center gap-3 px-2 py-1.5 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-center rounded-full w-8 h-8 bg-gray-400 text-white shrink-0">
                <MapPin className="h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">{p.desc}</p>
              </div>
              <ArrowUpRight className="h-4 w-4 text-gray-400 shrink-0 group-hover:text-purple-600 transition-colors" />
            </Link>
          )}
        </section>
      </div>
    </>
  )
}

const FavButtonParada = ({ parada }) => {
  const store = useLinhasStore()
  const notify = useToastStore((s) => s.notify)
  if (!parada) return null
  const isFav = store.isFavParada(parada.cod)

  return (
    <button
      onClick={(e) => {
        e.stopPropagation()
        const adding = !isFav
        store.toggleFavParada(parada)
        trackEvent('favoritar', { action: adding ? 'add' : 'remove', type: 'parada', id: parada.cod })
        notify(
          adding
            ? `Parada ${parada.cod} adicionada aos favoritos`
            : `Parada ${parada.cod} removida dos favoritos`,
          adding ? 'success' : 'info',
          adding,
        )
      }}
      className={`flex items-center justify-center bg-gray-100 rounded-md p-2 w-9 h-9 aspect-square cursor-pointer hover:bg-gray-200 transition-colors ${isFav ? 'text-yellow-500' : 'text-gray-400'}`}
      title={isFav ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
    >
      <Star weight={isFav ? 'fill' : 'regular'} className={`h-5 w-5 ${isFav ? 'text-yellow-500' : ''}`} />
    </button>
  )
}

function Location({ lat, long, itinerarioAtivo, paradas_proximas }) {
  const { data, error: error_itinerarios } = useFetch(itinerarioAtivo !== null ? `${url}/itinerarios/${itinerarioAtivo}` : null)
  const { data: veiculos } = useFetch(itinerarioAtivo !== null ? `${url}/itinerarios/${itinerarioAtivo}/veiculos` : null)
  const itinerarios = data?.itinerarios

  if (error_itinerarios) return null

  return (
    <div className="rounded-md overflow-hidden">
      <MapContainer className="max-h-52 md:max-h-96 rounded-md shadow-md" center={[lat, long]} zoom={17} style={{ height: '300px', width: '100%' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <FlyToItinerario itinerarios={itinerarios} itinerarioAtivo={itinerarioAtivo} />
        {itinerarioAtivo && itinerarios && (
          <>
            <AntPath positions={itinerarios.map((o) => [o.coordY, o.coordX])} options={{ delay: 1000, dashArray: [9, 22], weight: 5, color: '#000', opacity: 1, hardwareAccelerated: true }} />
            <Marker icon={SquareIcon} position={[itinerarios[itinerarios.length - 1].coordY, itinerarios[itinerarios.length - 1].coordX]} />
            <CircleMarker pathOptions={{ color: '#374151' }} radius={8} center={[itinerarios[0].coordY, itinerarios[0].coordX]} />
            {veiculos?.veiculos?.map((v) => (
              <Marker key={v.lat + v.long} icon={BusIconBlue} position={[v.lat, v.long]} />
            ))}
          </>
        )}
        <Marker icon={ParadaIconSelected} position={[lat, long]} />
        {paradas_proximas?.map(p =>
          <Marker key={p.cod} icon={MarkerPurpleIcon} position={[p.y, p.x]}>
            <Popup>
              <Link
                to={`/paradas/${p.cod}`}
                onClick={() => trackEvent('clicar_parada_mapa', { id: p.cod, page: window.location.pathname })}
                className="text-sm font-medium text-purple-800 hover:underline"
              >{p.desc}</Link>
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  )
}

function FlyToItinerario({ itinerarios, itinerarioAtivo }) {
  const map = useMap()
  useEffect(() => {
    if (!itinerarioAtivo || !itinerarios || itinerarios.length === 0) return
    const bounds = itinerarios.map((o) => [o.coordY, o.coordX])
    map.whenReady(() => {
      setTimeout(() => {
        map.invalidateSize()
        map.fitBounds(bounds, { padding: [40, 40] })
      }, 100)
    })
  }, [itinerarios, itinerarioAtivo, map])
  return null
}
