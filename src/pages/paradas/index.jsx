import { useEffect, useRef, useState } from 'react'
import { Helmet } from 'react-helmet'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import Navbar from '../../componentes/navbar'
import url from '../../utils/urls.js'
import { useFetch } from '../../hooks/useFetch.jsx'
import { useGeolocation } from '../../hooks/useGeolocation'
import Error from '../../componentes/error.jsx'
import { BarLoading } from '../../componentes/loading.jsx'
import { Estrela, Lupa, PinoLocalizacao, Seta } from '../../componentes/icons.jsx'
import { useLinhasStore } from '../../stores/linhaStore'
import { useToastStore } from '../../stores/toastStore'
import { useStops } from '../../hooks/useStops'
import {
  MarkerPurpleIcon,
  ParadaIconSelected,
} from '../../utils/Icons'

const userIcon = L.icon({
  iconUrl: '/alfinete-de-mapa-94.png',
  iconSize: [38, 38],
  iconAnchor: [19, 38],
})

function MapFly({ center }) {
  const map = useMap()
  useEffect(() => {
    if (center) {
      map.whenReady(() => {
        map.invalidateSize()
        map.setView(center, 15)
      })
    }
  }, [center && center[0], center && center[1]])
  return null
}

function FlyToStop({ stop }) {
  const map = useMap()
  useEffect(() => {
    if (stop?.y && stop?.x) map.flyTo([stop.y, stop.x], 16, { duration: 1 })
  }, [stop?.cod])
  return null
}

function MapResize({ stops }) {
  const map = useMap()
  useEffect(() => {
    map.invalidateSize()
  }, [map, stops])
  return null
}

const opcoes = ['Pesquisar paradas', 'Paradas próximas']

export const Paradas = () => {
  const [tab, setTab] = useState(0)
  const [params] = useSearchParams()
  const name = params.get('name')
  const [search, SetSearch] = useState(name)
  const inputRef = useRef(null)
  const navigate = useNavigate()

  const {
    loading,
    stops: paradas,
    error,
  } = useStops()

  useEffect(() => {
    if (name) inputRef.current.value = name
  }, [name])

  const HandleChange = () => {
    SetSearch(inputRef.current.value.toUpperCase().trim())
  }

  const HandleDeleteSearch = () => {
    SetSearch(null)
    inputRef.current.value = ''
  }

  if (error) {
    return (
      <>
        <Navbar page={'paradas'} />
        <Error error={error} imagesrc={'./explorar.png'} />
      </>
    )
  }

  const handleOpen = (stop) => {
    navigate(`/paradas/${stop.cod}`)
  }

  return (
    <>
      <Helmet>
        <title>Paradas de Ônibus de Feira de Santana - BA</title>
        <meta
          name="description"
          content="Consulte as paradas de ônibus de Feira de Santana - BA. Encontre localização, linhas atendidas, itinerários e informações para planejar sua viagem."
        />
        <link rel="canonical" href="https://feirabus.vercel.app/paradas" />
        <meta property="og:title" content="Paradas de Ônibus de Feira de Santana - BA" />
        <meta
          property="og:description"
          content="Encontre paradas de ônibus, linhas atendidas, localização e informações atualizadas do transporte público de Feira de Santana."
        />
        <meta property="og:image" content="https://feirabus.vercel.app/logo_feirabus.png" />
        <meta property="og:type" content="website" />
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:title" content="Paradas de Ônibus de Feira de Santana - BA" />
        <meta
          property="twitter:description"
          content="Consulte as paradas de ônibus de Feira de Santana, descubra quais linhas passam em cada ponto e planeje sua viagem."
        />
        <meta property="twitter:image" content="https://feirabus.vercel.app/logo_feirabus.png" />
        <meta name="robots" content="index,follow" />
        <meta name="author" content="FeiraBus" />
      </Helmet>

      <Navbar page={'paradas'} />
      <div className="w-full mx-auto text-left max-w-[1200px] px-2 relative z-0">
        <div className="mb-3">
          <h1 className="text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-sky-500 to-purple-500 pl-2 w-fit">
            Paradas
          </h1>
          <h3 className="text-sm text-gray-500 font-medium pl-2">
            Encontre e explore as paradas de ônibus de Feira de Santana
          </h3>
        </div>

        <div className="flex gap-2 bg-gray-200 rounded-xl h-11 p-1 mb-4">
          {opcoes.map((op, i) => (
            <button
              key={op}
              className={`flex items-center justify-center gap-1.5 h-full w-1/2 rounded-lg text-sm font-medium transition-all ${
                tab === i
                  ? 'bg-purple-800 text-white shadow-sm'
                  : 'text-gray-500 hover:text-purple-800'
              }`}
              onClick={() => setTab(i)}
            >
              {i === 0 ? <Lupa className="h-4 w-4" /> : <PinoLocalizacao className="h-4 w-4" />}
              {op}
            </button>
          ))}
        </div>

        {tab === 0 && (
          <>
            <div className="flex flex-row items-center gap-2 mb-4">
              <div className="relative w-full">
                <span className="absolute pl-3 text-gray-400 h-full flex items-center z-30">
                  <Lupa />
                </span>
                <input
                  ref={inputRef}
                  onChange={HandleChange}
                  className={`border border-gray-200 rounded-lg w-full pl-10 pr-4 h-10 text-sm font-medium focus:outline focus:outline-offset-1 focus:outline-gray-300 shadow-sm ${inputRef.current?.value ? 'border-purple-700' : ''}`}
                  placeholder="Pesquisar código ou nome da parada"
                  type="search"
                  maxLength={30}
                />
              </div>
              {inputRef.current?.value && (
                <button
                  onClick={HandleDeleteSearch}
                  className="h-10 px-4 rounded-lg border-2 border-red-500 text-red-500 text-sm font-medium whitespace-nowrap"
                >
                  limpar
                </button>
              )}
            </div>
            {loading ? (
              <BarLoading />
            ) : (
              <div className="flex flex-col gap-2 pb-8">
                {paradas && Object.keys(paradas).length > 0
                  ? Object.values(paradas)
                      .filter(
                        (p) =>
                          p.desc?.toUpperCase().includes(search?.toUpperCase()) ||
                          p.end?.toUpperCase().includes(search?.toUpperCase())
                      )
                      .slice(0, 30)
                      .map((p) => (
                        <StopCard key={p.cod} stop={p} handleClick={handleOpen} />
                      ))
                  : search && <p className="text-sm text-gray-400 text-center py-8">Nenhuma parada encontrada</p>}
              </div>
            )}
          </>
        )}

        {tab === 1 && <ParadasProximas />}
      </div>
    </>
  )
}

function ParadasProximas() {
  const [selectedStop, setSelectedStop] = useState(null)
  const { location, error: locError, loading: locLoading } = useGeolocation()

  const apiUrl = location
    ? `${url}/paradas/paradas-proximas/@${location.longitude},${location.latitude}`
    : null

  const { loading: loadingParadas, data: paradasProximas, error: errorParadas } = useFetch(apiUrl)

  const stops = paradasProximas?.paradas || []
  const center = location ? [location.latitude, location.longitude] : [-12.2544, -38.9601]

  return (
    <>
      <div className="rounded-xl overflow-hidden border border-gray-200 mb-4 h-64 md:h-80 relative">
        {locLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white z-10 rounded-xl">
            <BarLoading />
          </div>
        )}
        {locError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white z-10 rounded-xl gap-2 text-gray-400">
            <PinoLocalizacao className="h-8 w-8" />
            <p className="text-sm font-medium">Não foi possível obter sua localização</p>
            <p className="text-xs text-gray-500">Verifique as permissões de localização do navegador</p>
          </div>
        )}
        <MapContainer className="h-full max-h-64 md:max-h-80 w-full" center={center} zoom={16} scrollWheelZoom={true}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <MapResize stops={stops} />
          <MapFly center={center} />
          <FlyToStop stop={selectedStop} />
          {location && (
            <Marker position={[location.latitude, location.longitude]} icon={userIcon}>
              <Popup>Sua localização</Popup>
            </Marker>
          )}
          {stops.map((p) => (
            <Marker
              key={p.cod}
              position={[p.y, p.x]}
              icon={selectedStop?.cod === p.cod ? ParadaIconSelected : MarkerPurpleIcon}
            >
              <Popup>
                <Link to={`/paradas/${p.cod}`} className="text-purple-800 font-medium">
                  {p.desc || p.end}
                </Link>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {!locLoading && !locError && loadingParadas && <BarLoading />}
      {!locLoading && !locError && errorParadas && <Error error={errorParadas} imagesrc={'./explorar.png'} />}
      {!locLoading && !locError && !loadingParadas && !errorParadas && stops.length === 0 && (
        <div className="flex flex-col items-center justify-center py-8 gap-2 text-gray-400">
          <PinoLocalizacao className="h-8 w-8" />
          <p className="text-sm font-medium">Nenhuma parada encontrada nas proximidades</p>
        </div>
      )}
      {!locLoading && !locError && !loadingParadas && !errorParadas && stops.length > 0 && (
        <div className="flex flex-col gap-2 pb-8">
          <p className="text-sm font-medium text-gray-500 pl-1">
            {stops.length} parada{stops.length !== 1 ? 's' : ''} encontrada{stops.length !== 1 ? 's' : ''}
          </p>
          {stops.map((p) => (
            <div
              key={p.cod}
              className={`border min-h-12 md:min-h-14 w-full rounded-lg px-3 md:px-4 border-l-4 cursor-pointer transition-all ${
                selectedStop?.cod === p.cod
                  ? 'border-l-purple-800 border-t-purple-800 bg-purple-50'
                  : 'border-gray-300 border-l-purple-800'
              }`}
              onClick={() => {
                setSelectedStop(p)
                setTimeout(() => {
                  document.getElementById(`prox-stop-${p.cod}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
                }, 100)
              }}
            >
              <div className="flex flex-row gap-2 h-full items-center py-1">
                <div className="px-2 border text-purple-800 border-purple-800 rounded-md text-sm font-bold flex items-center gap-1.5">
                  <PinoLocalizacao className="h-3.5" />
                  {p.cod}
                </div>
                <div className="font-medium text-sm truncate flex-1">{p.desc}</div>
                <Link
                  to={`/paradas/${p.cod}`}
                  className="flex items-center justify-center h-7 min-w-14 bg-purple-800 px-2 rounded-md text-white font-semibold text-xs"
                  onClick={(e) => e.stopPropagation()}
                >
                  Detalhes <Seta className="h-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  )
}

const StopCard = ({ stop, handleClick }) => {
  const isFav = useLinhasStore((s) => s.isFavParada(stop.cod))
  const toggleFav = useLinhasStore((s) => s.toggleFavParada)
  const notify = useToastStore((s) => s.notify)

  return (
    <div className="border border-gray-300 min-h-12 md:min-h-14 w-full rounded-lg px-3 md:px-4 border-l-purple-800 border-l-4">
      <div className="flex flex-row gap-1 md:gap-2 h-full items-center">
        <button
          onClick={(e) => {
            e.stopPropagation()
            const adding = !isFav
            toggleFav(stop)
            notify(
              adding
                ? `Parada ${stop.cod} adicionada aos favoritos`
                : `Parada ${stop.cod} removida dos favoritos`,
              'success'
            )
          }}
          className={`hidden sm:flex items-center justify-center h-8 w-8 ${isFav ? 'text-yellow-500' : 'text-gray-300 hover:text-yellow-400'}`}
        >
          <Estrela className={`h-5 w-5 ${isFav ? 'fill-yellow-500' : ''}`} />
        </button>
        <div className="px-2 border text-purple-800 border-purple-800 rounded-md text-sm font-bold flex items-center gap-1.5">
          <PinoLocalizacao className="h-3.5" />
          {stop.cod}
        </div>
        <div className="font-medium text-sm md:text-base truncate flex-1">{stop.desc}</div>
        <button
          className="h-7 min-w-14 bg-purple-800 px-2 rounded-md text-white font-semibold text-xs flex items-center"
          onClick={() => handleClick(stop)}
        >
          Detalhes <Seta className="h-3" />
        </button>
      </div>
    </div>
  )
}
