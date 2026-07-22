import { useEffect, useMemo, useRef, useState } from 'react'
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
import { SkeletonList } from '../../componentes/skeleton.jsx'
import EmptyState from '../../componentes/empty-state.jsx'
import { motion, useReducedMotion } from 'motion/react'
import { Star, X, MagnifyingGlass, MapPin, CaretRight } from '@phosphor-icons/react'
import { useLinhasStore } from '../../stores/linhaStore'
import { useToastStore } from '../../stores/toastStore'
import { useStops } from '../../hooks/useStops'
import { trackEvent } from '../../utils/analytics'
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

  const filteredStops = useMemo(() => {
    if (!paradas || Object.keys(paradas).length === 0) return []
    if (!search) return []
    const q = search.toUpperCase()
    return Object.values(paradas).filter((p) => (p.desc?.toUpperCase().includes(q)) || (p.end?.toUpperCase().includes(q))).slice(0, 30)
  }, [paradas, search])

  useEffect(() => {
    if (name) inputRef.current.value = name
  }, [name])

  const HandleChange = () => {
    SetSearch(inputRef.current.value.toUpperCase().trim())
    trackEvent('buscar', { type: 'parada', term: inputRef.current.value.toUpperCase().trim() })
  }

  const HandleDeleteSearch = () => {
    SetSearch(null)
    inputRef.current.value = ''
  }

  if (error) {
    return (
      <>
        <Navbar page="paradas" />
        <Error error={error} imagesrc="./explorar.png" />
      </>
    )
  }

  const handleOpen = (stop) => {
    trackEvent('navegar_detalhe', { type: 'parada', id: stop.cod })
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

      <Navbar page="paradas" />
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
                Paradas
          </h1>
          <h3 className="text-xs md:text-sm text-slate-500 mt-0.5">
            Encontre e explore as paradas de ônibus de Feira de Santana
          </h3>
        </div>
        </div>
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
              {i === 0 ? <MagnifyingGlass className="h-4 w-4" /> : <MapPin className="h-4 w-4" />}
              {op}
            </button>
          ))}
        </div>

        {tab === 0 && (
          <>
            <div className="relative w-full mb-4">
              <span className="absolute pl-3 text-gray-500 h-full flex items-center z-10">
                <MagnifyingGlass />
              </span>
              <input
                ref={inputRef}
                onChange={HandleChange}
                  className={`border border-gray-200 rounded-lg w-full pl-10 pr-10 h-11 text-sm font-medium focus:outline-none focus:shadow-md shadow-sm transition-all ${inputRef.current?.value ? 'border-purple-700 shadow-purple-50' : ''}`}
                  style={{ fontSize: 16 }}
                  placeholder="Pesquisar código ou nome da parada"
                type="search"
                maxLength={30}
              />
              {inputRef.current?.value && (
                <button
                  onClick={HandleDeleteSearch}
                  className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center justify-center w-6 h-6 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-500 transition-colors z-10"
                  aria-label="Limpar pesquisa"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>
            {loading ? (
              <SkeletonList count={5} />
            ) : (
              <div className="flex flex-col gap-2 pb-8">
                {!loading && !search && (
                  <EmptyState
                    icon={<MagnifyingGlass className="h-6 w-6" />}
                    title="Pesquise por uma parada"
                    description="Digite o código ou nome da parada para encontrá-la."
                  />
                )}
                {!loading && search && filteredStops.length > 0 && (
                  <p className="text-sm text-gray-500 px-1">
                    {filteredStops.length} parada(s) encontrada(s)
                  </p>
                )}
                {!loading && search && filteredStops.length === 0 && (
                  <EmptyState
                    icon={<MapPin className="h-6 w-6" />}
                    title="Nenhuma parada encontrada"
                    description={`Nenhum resultado para "${search}". Tente outro código ou nome.`}
                  />
                )}
                {filteredStops.map((p) => (
                  <StopCard key={p.cod} stop={p} handleClick={handleOpen} />
                ))}
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
            <SkeletonList count={5} />
          </div>
        )}
        {locError && (
          <div className="absolute inset-0 z-10 rounded-xl">
            <EmptyState
              icon={<MapPin className="h-6 w-6" />}
              title="Não foi possível obter sua localização"
              description="Verifique as permissões de localização do navegador."
            />
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

      {!locLoading && !locError && loadingParadas && <SkeletonList count={3} />}
      {!locLoading && !locError && errorParadas && <Error error={errorParadas} imagesrc="./explorar.png" />}
      {!locLoading && !locError && !loadingParadas && !errorParadas && stops.length === 0 && (
        <EmptyState
          icon={<MapPin className="h-6 w-6" />}
          title="Nenhuma parada encontrada nas proximidades"
        />
      )}
      {!locLoading && !locError && !loadingParadas && !errorParadas && stops.length > 0 && (
        <div className="flex flex-col gap-2 pb-8">
          <p className="text-sm font-medium text-gray-500 pl-1">
            {stops.length} parada{stops.length !== 1 ? 's' : ''} encontrada{stops.length !== 1 ? 's' : ''}
          </p>
          {stops.map((p) => (
            <div
              key={p.cod}
              className={`border min-h-12 md:min-h-14 w-full rounded-lg px-3 md:px-4 py-2 shadow-sm cursor-pointer transition-colors ${
                selectedStop?.cod === p.cod
                  ? 'border-purple-300 bg-purple-50 shadow-md'
                  : 'border-gray-200 hover:border-purple-200 hover:bg-purple-50/30'
              }`}
              onClick={() => {
                setSelectedStop(p)
                setTimeout(() => {
                  document.getElementById(`prox-stop-${p.cod}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
                }, 100)
              }}
            >
              <div className="flex flex-row gap-2 h-full items-center py-1">
                <div className="px-2 border text-purple-700 border-purple-200 rounded-md text-sm font-bold flex items-center gap-1.5 shrink-0">
                  <MapPin className="h-3.5" />
                  {p.cod}
                </div>
                <div className="font-medium text-sm truncate flex-1">{p.desc}</div>
                <Link
                  to={`/paradas/${p.cod}`}
                  className="shrink-0 ml-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  <CaretRight className="h-5 w-5 text-gray-400 hover:text-purple-600 transition-colors" />
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
  const reduced = useReducedMotion()

  return (
    <motion.div
      initial={reduced ? {} : { opacity: 0, y: 12 }}
      whileInView={reduced ? {} : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
    <div onClick={() => handleClick(stop)} className="border border-gray-200 min-h-12 md:min-h-14 w-full rounded-lg px-3 md:px-4 py-2 shadow-sm hover:shadow-md transition-shadow cursor-pointer active:bg-purple-50/30">
      <div className="flex flex-row gap-1 md:gap-2 h-full items-center">
        <button
          onClick={(e) => {
            e.stopPropagation()
            const adding = !isFav
            toggleFav(stop)
            trackEvent('favoritar', { action: adding ? 'add' : 'remove', type: 'parada', id: stop.cod })
            notify(
              adding
                ? `Parada ${stop.cod} adicionada aos favoritos`
                : `Parada ${stop.cod} removida dos favoritos`,
              adding ? 'success' : 'info',
              adding
            )
          }}
          className={`flex items-center justify-center h-8 w-8 shrink-0 ${isFav ? 'text-yellow-500' : 'text-gray-300 hover:text-yellow-400'}`}
        >
          <Star weight={isFav ? 'fill' : 'regular'} className={`h-5 w-5 ${isFav ? 'text-yellow-500' : ''}`} />
        </button>
        <div className="px-2 border text-purple-700 border-purple-200 rounded-md text-sm font-bold flex items-center gap-1.5 shrink-0">
          <MapPin className="h-3.5" />
          {stop.cod}
        </div>
        <div className="font-medium text-sm md:text-base truncate flex-1">{stop.desc}</div>
        <CaretRight className="h-5 w-5 text-gray-400 shrink-0" />
      </div>
    </div>
    </motion.div>
  )
}
