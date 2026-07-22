import { useState, useEffect, useRef } from 'react'
import { Helmet } from 'react-helmet'
import { Link } from 'react-router-dom'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import Navbar from '../componentes/navbar'
import url from '../utils/urls'
import { useFetch } from '../hooks/useFetch'
import { useGeolocation } from '../hooks/useGeolocation'
import { BarLoading } from '../componentes/loading'
import Error from '../componentes/error'
import { MapPin, CaretRight } from '@phosphor-icons/react'
import {
  MarkerPurpleIcon,
  ParadaIconSelected,
} from '../utils/Icons'

const userIcon = L.icon({
  iconUrl: '/alfinete-de-mapa-94.png',
  iconSize: [38, 38],
  iconAnchor: [19, 38],
})

function MapFly({ center }) {
  const map = useMap()
  useEffect(() => {
    if (center) {
      map.flyTo(center, 15, { duration: 1.5 })
    }
  }, [center, map])
  return null
}

export default function ParadasProximas() {
  const { location, error: locError, loading: locLoading } = useGeolocation()
  const [selectedStop, setSelectedStop] = useState(null)
  const listRef = useRef(null)

  const apiUrl =
    location
      ? `${url}/paradas/paradas-proximas/@${location.longitude},${location.latitude}`
      : null

  const {
    loading: loadingParadas,
    data: paradas,
    error: errorParadas,
  } = useFetch(apiUrl)

  const stops = paradas?.paradas || []
  const center = location
    ? [location.latitude, location.longitude]
    : [-12.2544, -38.9601]

  const scrollToStop = (stop) => {
    setSelectedStop(stop)
    setTimeout(() => {
      const el = document.getElementById(`stop-${stop.cod}`)
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }, 100)
  }

  return (
    <>
      <Helmet>
        <title>Paradas Próximas | FeiraBus</title>
        <meta
          name="description"
          content="Encontre paradas de ônibus próximas à sua localização em Feira de Santana."
        />
      </Helmet>
      <Navbar page="paradas" />
      <div className="w-full mx-auto text-left max-w-[1200px] px-2 relative z-0">
        <div className="label h-fit">
          <h1 className="text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-sky-500 to-purple-500 pl-2 w-fit">
            Paradas Próximas
          </h1>
          <h3 className="text-sm text-gray-500 font-medium mb-4 pl-2">
            {location
              ? `Paradas próximas a sua localização`
              : 'Permita o acesso à localização para encontrar paradas próximas'}
          </h3>
        </div>

        {locLoading ? (
          <BarLoading />
        ) : locError ? (
          <div className="flex flex-col items-center justify-center py-16 gap-4 text-gray-400">
            <MapPin className="h-12 w-12" />
            <p className="text-base font-medium">
              Não foi possível obter sua localização
            </p>
            <p className="text-sm text-gray-500">
              {locError.message || 'Verifique as permissões de localização'}
            </p>
          </div>
        ) : (
          <>
            <div className="rounded-md overflow-hidden border border-gray-300 mb-4 h-64 md:h-96">
              <MapContainer
                className="h-full w-full"
                center={center}
                zoom={14}
                scrollWheelZoom={true}
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <MapFly center={center} />
                {location && (
                  <Marker position={[location.latitude, location.longitude]} icon={userIcon}>
                    <Popup>Sua localização</Popup>
                  </Marker>
                )}
                {stops.map((p) => (
                  <Marker
                    key={p.cod}
                    position={[p.y, p.x]}
                    icon={
                      selectedStop?.cod === p.cod
                        ? ParadaIconSelected
                        : MarkerPurpleIcon
                    }
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

            {loadingParadas ? (
              <BarLoading />
            ) : errorParadas ? (
              <Error error={errorParadas} imagesrc="./explorar.png" />
            ) : stops.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 gap-4 text-gray-400">
                <MapPin className="h-12 w-12" />
                <p className="text-base font-medium">
                  Nenhuma parada encontrada nas proximidades
                </p>
              </div>
            ) : (
              <div ref={listRef} className="flex flex-col gap-2 mb-8">
                <p className="text-sm font-medium text-gray-500 pl-2">
                  {stops.length} parada{stops.length !== 1 ? 's' : ''} encontrada{stops.length !== 1 ? 's' : ''}
                </p>
                {stops.map((p) => (
                  <div
                    id={`stop-${p.cod}`}
                    key={p.cod}
                    className={`border border-b-1 border-gray-300 min-h-12 md:min-h-16 w-full rounded-lg px-2 md:px-4 border-l-4 p-1 cursor-pointer transition-all ${
                      selectedStop?.cod === p.cod
                        ? 'border-l-yellow-500 border-t-yellow-500 bg-yellow-50'
                        : 'border-l-purple-800 border-t-purple-800'
                    }`}
                    onClick={() => scrollToStop(p)}
                  >
                    <div className="flex flex-row gap-1 md:gap-2 h-full items-center">
                      <div className="p-1 md:px-2 border text-purple-800 border-purple-800 rounded-md text-base font-bold text-center flex items-center gap-2">
                        <MapPin />
                        {p.cod}
                      </div>
                      <div className="font-medium text-sm md:text-base truncate w-full">
                        {p.desc}
                      </div>
                      <Link
                        to={`/paradas/${p.cod}`}
                        className="flex items-center justify-center h-8 min-w-16 bg-purple-800 px-2 rounded-md text-white font-semibold leading-4 text-xs"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Detalhes <CaretRight className="h-4" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </>
  )
}
