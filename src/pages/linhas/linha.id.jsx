import { useEffect, useState } from 'react'
import {
  MapContainer,
  TileLayer,
  Marker,
  CircleMarker,
  useMap,
  Popup,
} from 'react-leaflet'
import { BusStopIconOrangeSmall, SquareIcon } from '../../utils/Icons.js'
import 'leaflet/dist/leaflet.css'
import AntPath from '../../componentes/AntPath.jsx'
import 'leaflet-ant-path'
import url from '../../utils/urls.js'
import { useFetch } from '../../hooks/useFetch.jsx'
import { BarLoading } from '../../componentes/loading.jsx'
import Error from '../../componentes/error.jsx'
import { Link, useNavigate, useSearchParams, useParams } from 'react-router-dom'
import { Horarios } from '../../componentes/horarios.jsx'
import { Star, X, Bus, MapPin, Path, ArrowUpRight } from '@phosphor-icons/react'
import { QuadroHorarios } from '../../componentes/icons.jsx'
import ShareDialog from '../../componentes/share-dialog.jsx'
import { Helmet } from 'react-helmet'
import Navbar from '../../componentes/navbar.jsx'
import { useLinhasStore } from '../../stores/linhaStore.js'
import { useToastStore } from '../../stores/toastStore'
import { useLines } from '../../hooks/useLines.js'
import { trackEvent } from '../../utils/analytics'
import FavPrompt from '../../componentes/fav-prompt.jsx'
import { useHasNoFavorites } from '../../hooks/useHasNoFavorites.js'

const parse_paradas = (paradas) => {
  var data = {}
  paradas.forEach((h) => {
    if (data[h.sent] !== undefined) {
      data[h.sent].push(h)
    } else {
      data[h.sent] = [h]
    }
  })
  return data
}

export const LineDetail = () => {
  const [saida, setSaida] = useState(0)
  const [page, setPage] = useState(0)
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const tab = params.get('tab')
  const { cod } = useParams()
  const line = useLines(cod)
  const { hasNoFavorites, dismiss } = useHasNoFavorites()
  const store = useLinhasStore()
  const notify = useToastStore((s) => s.notify)

  const { loading, data: paradas, error } = useFetch(
    line !== undefined ? `${url}/linhas/${line.cod}/paradas/coordenadas` : null,
  )

  const { loading: loading_itinerarios, data: codItinerarios, error: error_itinerarios } = useFetch(
    line !== undefined ? `${url}/linhas/${line.cod}/itinerarios/default` : null,
  )

  const opcoes = ['Paradas', 'Rotas', 'Horários']

  useEffect(() => {
    if (!tab) return
    if (opcoes.includes(tab)) {
      setPage(opcoes.indexOf(tab))
    }
  }, [tab, line])

  const handle_exit = () => {
    navigate(-1)
  }

  const handleSetPage = (val) => {
    trackEvent('mudar_aba', { page: window.location.pathname, tab: opcoes[val] })
    params.set('tab', opcoes[val])
    navigate({ search: params.toString() }, { replace: true })
    setPage(val)
  }

  const opcoes_icons = {
    Paradas: <MapPin className="h-5 w-5" />,
    Rotas: <Path className="h-5 w-5" />,
    Horários: <QuadroHorarios className="h-5 w-5" />,
  }

  const directions = paradas ? Object.keys(paradas) : []
  const routeSummary = directions.join(' → ')

  return (
    <>
      <Helmet>
        <title>Linha {line?.sgl} - {line?.nom} | Itinerário, Horários e Paradas</title>
        <meta
          name="description"
          content={`Consulte o itinerário, horários e pontos de parada da linha ${line?.sgl} (${line?.nom}) em Feira de Santana - BA. Planeje sua viagem de ônibus com informações atualizadas.`}
        />
        <meta name="robots" content="index,follow" />
        <link rel="canonical" href={`https://feirabus.vercel.app/linhas/${line?.sgl}`} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://feirabus.vercel.app/linhas/${line?.sgl}`} />
        <meta property="og:title" content={`Linha ${line?.sgl} - ${line?.nom} | FeiraBus`} />
        <meta
          property="og:description"
          content={
            routeSummary
              ? `Trajeto: ${routeSummary}. Consulte horários, itinerário e pontos de parada da linha ${line?.sgl} em Feira de Santana.`
              : `Consulte horários, itinerário e pontos de parada da linha ${line?.sgl} em Feira de Santana.`
          }
        />
        <meta property="og:image" content="https://feirabus.vercel.app/logo_feirabus.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`Linha ${line?.sgl} - ${line?.nom} | FeiraBus`} />
        <meta
          name="twitter:description"
          content={
            routeSummary
              ? `Trajeto: ${routeSummary}. Consulte horários, itinerário e pontos de parada da linha ${line?.sgl}.`
              : `Consulte horários, itinerário e pontos de parada da linha ${line?.sgl}.`
          }
        />
        <meta name="twitter:image" content="https://feirabus.vercel.app/logo_feirabus.png" />
      </Helmet>
      <Navbar page="linhas" />
      <div className="w-full mx-auto text-left max-w-[1200px] px-2">
        <div className="py-3 md:py-8">
          <div className="flex items-center gap-3 mb-1">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center justify-center w-8 h-8 rounded-lg text-gray-500 hover:text-purple-700 hover:bg-purple-50 transition-colors -ml-1 shrink-0"
              aria-label="Voltar"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
            </button>
            <h1 className="text-base sm:text-2xl font-bold text-slate-900">
              {`LINHA ${line?.sgl} - ${line?.nom}`.toUpperCase()}
            </h1>
          </div>
          <h2 className="text-[10px] md:text-sm text-slate-500">
            Consulte o itinerário completo, horários atualizados e pontos de parada da linha{' '}
            {line?.sgl} em Feira de Santana - BA.
          </h2>
        </div>

        {hasNoFavorites && line && (
          <div className="mb-4">
            <FavPrompt
              type="linha"
              itemName={line.sgl}
              onDismiss={dismiss}
              onFavorite={() => {
                const adding = !store.isFavLinha(line.sgl)
                store.toggleFavLinha(line)
                trackEvent('favoritar', { action: adding ? 'add' : 'remove', type: 'linha', id: line.sgl })
                notify(
                  adding
                    ? `Linha ${line.sgl} adicionada aos favoritos`
                    : `Linha ${line.sgl} removida dos favoritos`,
                  adding ? 'success' : 'info',
                  adding,
                )
                dismiss()
              }}
            />
          </div>
        )}

        <div className="w-full h-fit md:min-h-[60vh] m-auto rounded-xl bg-white">
          <div className="flex flex-col gap-1 mb-4 sticky top-0 z-10 bg-white">
            <div className="flex gap-2 bg-gray-100 rounded-xl h-11 p-1 px-2">
              {opcoes.map((p, i) =>
                <button
                  key={i}
                  className={`flex items-center justify-center gap-2 h-full flex-1 rounded-lg text-sm font-medium transition-colors duration-150 active:scale-[0.97] ${
                    i === page
                      ? 'bg-purple-800 text-white shadow-sm'
                      : 'text-gray-500 hover:text-purple-800'
                  }`}
                  onClick={() => handleSetPage(i)}
                >
                  {opcoes_icons[p]}
                  {p}
                </button>
              )}
            </div>
          </div>

          <div className="border border-gray-200 p-3 md:p-4 rounded-md border-t-4 border-t-purple-800">
            <div className="flex flex-row gap-2 sm:px-4 mb-8">
              <div className="w-12 h-12 aspect-square bg-purple-800 rounded-md text-white font-bold text-center flex items-center justify-center shrink-0">
                {line?.sgl}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold truncate w-full text-xs md:text-sm">
                  {line?.nom}
                </div>
                <div className="flex gap-2 mt-1.5">
                  <div className="flex flex-col items-center gap-0.5">
                    <FavButtonLinha linha={line} />
                    <span className="block text-[10px] text-gray-400 leading-tight">Favoritar</span>
                  </div>
                  <Link to={`/veiculos?linha=${line?.sgl}`} className="flex flex-col items-center gap-0.5">
                    <div className="flex items-center justify-center bg-gray-100 rounded-md p-2 w-9 h-9 cursor-pointer hover:bg-gray-200 transition-colors">
                      <Bus className="h-4 w-4 text-gray-500" />
                    </div>
                    <span className="block text-[10px] text-gray-400 leading-tight">Veículos</span>
                  </Link>
                  <ShareDialog
                    title={`${opcoes[page]} da Linha ${line.sgl} - ${line.nom}`}
                    text={`Confira ${opcoes[page]} da Linha ${line.sgl} no FeiraBus`}
                  />
                </div>
              </div>
              <div className="shrink-0">
                <button
                  className="flex items-center justify-center bg-red-50 rounded-md p-2 w-9 h-9 aspect-square cursor-pointer hover:bg-red-100 transition-colors"
                  onClick={handle_exit}
                >
                  <X className="h-4 w-4 text-red-500" />
                </button>
              </div>
            </div>

            {loading ? (
              <BarLoading />
            ) : error ? (
              <Error error={error} imagesrc="./explorar.png" />
            ) : (
              <div className="flex flex-col gap-2 md:gap-4">
                <div className="flex flex-col gap-1">
                  <p className="text-[11px] font-medium text-gray-500 text-center">SAÍDA</p>
                  <div className="flex gap-2 bg-gray-100 rounded-xl h-11 p-1">
                    {directions.map((p, i) =>
                      <button
                        key={i}
                        className={`flex items-center justify-center gap-2 flex-1 rounded-lg text-sm font-medium transition-colors duration-150 active:scale-[0.97] ${
                          i === saida
                            ? 'bg-purple-800 text-white shadow-sm'
                            : 'text-gray-500 hover:text-purple-800'
                        }`}
                        onClick={() => setSaida(i)}
                      >
                        {p}
                      </button>
                    )}
                  </div>
                </div>

                <div className="rounded-lg h-full">
                  {page === 0 && paradas && paradas[directions[saida]] !== undefined && (
                    <div>
                      <h3 className="flex items-center font-medium mb-3 md:mb-4 px-1">
                        Paradas
                        <span className="bg-gray-300 text-xs px-1.5 py-0.5 rounded-full ml-2 text-gray-700 font-medium">
                          {paradas[directions[saida]].length}
                        </span>
                      </h3>
                      <div className="max-h-[600px] overflow-y-auto px-2 border-t-2">
                        {paradas[directions[saida]].map((p, i) =>
                          <LocationLabel
                            key={p.cod}
                            p={p}
                            hasline={i + 1 < paradas[directions[saida]].length}
                          />
                        )}
                      </div>
                    </div>
                  )}

                  {page === 1 ? (
                    error_itinerarios ? (
                      <Error error={error_itinerarios} imagesrc="./explorar.png" />
                    ) : (
                      <Rotas
                        n_itinerario={codItinerarios?.itinerarios?.[directions[saida]]}
                        paradas={paradas[directions[saida]]}
                      />
                    )
                  ) : null}

                  {page === 2 && (
                    <Horarios props={{ line, handle_exit, directions, saida, setSaida }} />
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

const LocationLabel = ({ p, hasline }) => (
  <Link to={`/paradas/${p.cod}`} className="block group">
    <div className="flex flex-row gap-3 py-1.5 md:py-2">
      <div className="flex flex-col items-center">
        <div className="flex items-center justify-center rounded-full w-8 h-8 bg-orange-300 text-white">
          <MapPin className="h-4" />
        </div>
        {hasline && <div className="w-px h-8 bg-gray-100" />}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-800 truncate">{p.end}</p>
        <p className="text-xs text-gray-500 truncate">{p.desc}</p>
      </div>
      {p.x && p.y && (
        <ArrowUpRight className="h-4 w-4 text-gray-400 shrink-0 group-hover:text-purple-600 transition-colors mr-1" />
      )}
    </div>
  </Link>
)

const FavButtonLinha = ({ linha }) => {
  const store = useLinhasStore()
  const notify = useToastStore((s) => s.notify)
  if (!linha) return null
  const isFav = store.isFavLinha(linha.sgl)

  return (
    <button
      onClick={(e) => {
        e.stopPropagation()
        const adding = !isFav
        store.toggleFavLinha(linha)
        trackEvent('favoritar', { action: adding ? 'add' : 'remove', type: 'linha', id: linha.sgl })
        notify(
          adding
            ? `Linha ${linha.sgl} adicionada aos favoritos`
            : `Linha ${linha.sgl} removida dos favoritos`,
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

function MapFly({ itinerarios }) {
  const mapinstance = useMap()
  useEffect(() => {
    if (!itinerarios?.length) return
    mapinstance.whenReady(() => {
      mapinstance.invalidateSize()
      mapinstance.fitBounds(itinerarios.map((i) => [i.coordY, i.coordX]))
    })
  }, [itinerarios, mapinstance])
}

function Rotas({ n_itinerario, paradas }) {
  const apiurl = url + `/itinerarios/${n_itinerario}`
  const { loading, data: itinerarioAtivo, error } = useFetch(apiurl)

  if (loading) return <BarLoading />
  if (error) return <Error error={error} imagesrc="./explorar.png" />

  const itinerarios = itinerarioAtivo?.itinerarios || []
  if (!itinerarios.length) return <BarLoading />

  return (
    <div className="rounded-md overflow-hidden mt-6">
      <MapContainer
        className="max-h-80 md:max-h-[500px] rounded-md shadow-md"
        center={[-12.254463237869844, -38.960094451904304]}
        zoom={13}
        style={{ height: '360px', width: '100%' }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <>
          <AntPath
            positions={itinerarios.map((o) => [o.coordY, o.coordX])}
            options={{
              delay: 2000,
              dashArray: [10, 20],
              weight: 5,
              color: '#374151',
              opacity: 1,
              hardwareAccelerated: true,
            }}
          />
          <Marker
            icon={SquareIcon}
            position={[itinerarios[itinerarios.length - 1].coordY, itinerarios[itinerarios.length - 1].coordX]}
          />
          {paradas
            .filter((p) => p.y !== undefined && p.x !== undefined)
            .map((p) => (
              <Marker key={p.cod} icon={BusStopIconOrangeSmall} opacity={1} position={[p.y, p.x]}>
                <Popup>
                  <Link to={`/paradas/${p.cod}`} className="flex items-center gap-1.5 text-sm font-medium text-gray-800 hover:text-purple-700">
                    {p.desc || p.end}
                    <ArrowUpRight className="h-3.5 w-3.5 text-gray-400" />
                  </Link>
                </Popup>
              </Marker>
            ))}
          <CircleMarker
            pathOptions={{ color: '#374151' }}
            radius={8}
            center={[itinerarios[0].coordY, itinerarios[0].coordX]}
          />
          <MapFly itinerarios={itinerarios} />
        </>
      </MapContainer>
    </div>
  )
}
