import { useState, useEffect, useMemo, useCallback, useRef, memo } from 'react'
import {
  CircleMarker,
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
} from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet-ant-path'
import '../App.css'

import url from '../utils/urls'
import { useFetch } from '../hooks/useFetch.jsx'
import { BarLoading } from '../componentes/loading.jsx'
import { Link } from 'react-router-dom'
import AntPath from './AntPath.jsx'
import { Bus, ArrowClockwise } from '@phosphor-icons/react'
import {
  BusIconBlue,
  SquareIcon,
  BusStopIconOrangeSmall,
} from '../utils/Icons.js'

function usePoll(fn, intervalMs, deps = []) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [lastUpdate, setLastUpdate] = useState(null)
  const savedCb = useRef()

  useEffect(() => { savedCb.current = fn }, [fn])

  const fetchNow = useCallback(() => {
    setLoading(true)
    Promise.resolve(savedCb.current())
      .then((res) => {
        setData(res)
        setError(null)
        setLastUpdate(Date.now())
      })
      .catch((err) => { setError(err) })
      .finally(() => setLoading(false))
  }, deps)

  useEffect(() => {
    fetchNow()
    if (intervalMs) {
      const id = setInterval(fetchNow, intervalMs)
      return () => clearInterval(id)
    }
  }, [fetchNow, intervalMs])

  return { data, loading, error, lastUpdate, refetch: fetchNow }
}

export function VeiculosCard({ linha }) {
  const [saida, setSaida] = useState(0)
  const [timeAgo, setTimeAgo] = useState(0)

  const {
    loading: loading_itinerarios,
    data: codItinerarios,
    error: error_itinerarios,
  } = useFetch(url + `/linhas/${linha.cod}/itinerarios/default`)
  const {
    loading: loading_paradas,
    data: paradas,
    error: error_paradas,
  } = useFetch(url + `/linhas/${linha.cod}/paradas/coordenadas`)

  const directions = codItinerarios
    ? Object.keys(codItinerarios['itinerarios'])
    : []

  const nItinerario = codItinerarios?.itinerarios?.[directions[saida]]?.[0]
  const paradasList = paradas?.[directions[saida]]

  const veicPoll = usePoll(
    () => fetch(url + `/itinerarios/${nItinerario}/veiculos`).then(r => r.json()),
    (nItinerario ? 15000 : null), [nItinerario]
  )

  const lastParada = paradasList?.length > 0 ? paradasList[paradasList.length - 1] : null

  const prevPoll = usePoll(
    () => lastParada ? fetch(url + `/paradas/${lastParada.cod}/previsoes`).then(r => r.json()) : Promise.resolve(null),
    (nItinerario && lastParada) ? 15000 : null, [nItinerario, lastParada?.cod]
  )

  const { data: itinerarioAtivo } = useFetch(
    nItinerario ? url + `/itinerarios/${nItinerario}` : null
  )

  useEffect(() => {
    if (!veicPoll.lastUpdate) return
    const id = setInterval(() => {
      setTimeAgo(Math.floor((Date.now() - veicPoll.lastUpdate) / 1000))
    }, 1000)
    return () => clearInterval(id)
  }, [veicPoll.lastUpdate])

  const handleRefresh = () => {
    veicPoll.refetch()
  }

  if (loading_itinerarios) return <BarLoading />
  if (error_itinerarios) return <BarLoading />

  return (
    <div className="w-full h-full flex flex-col mx-auto">
      <div className="flex flex-col gap-1 mb-3">
        <p className="text-[11px] font-medium text-gray-500 text-center">SAÍDA</p>
        <div className="flex gap-2 bg-gray-100 rounded-xl h-11 p-1">
          {directions.map((p, i) => (
            <button key={i}
              className={`flex items-center justify-center flex-1 rounded-lg text-sm font-medium transition-colors ${
                i === saida ? 'bg-purple-800 text-white shadow-sm' : 'text-gray-500 hover:text-purple-800'
              }`}
              onClick={() => setSaida(i)}
            >{p}</button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between mb-2 px-1">
        <div className="flex items-center gap-2 text-[11px] text-gray-400">
          {veicPoll.lastUpdate ? (
            <span className="flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
              Atualizado há {timeAgo}s
            </span>
          ) : (
            <span className="flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-gray-300" />
              Aguardando dados...
            </span>
          )}
          <span className="text-gray-300">·</span>
          <span>Auto 15s</span>
        </div>
        <button
          onClick={handleRefresh}
          disabled={veicPoll.lastUpdate && Date.now() - veicPoll.lastUpdate < 15000}
          className="flex items-center gap-1 text-xs font-medium text-purple-700 hover:text-purple-900 disabled:text-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          <ArrowClockwise className={`h-3.5 w-3.5 ${veicPoll.loading ? 'animate-spin' : ''}`} />
          Atualizar
        </button>
      </div>

      <div className="rounded-md overflow-hidden w-full flex-1 flex flex-col">
        {veicPoll.loading && !veicPoll.data && (
          <div className="flex items-center justify-center gap-2 py-2 text-xs text-gray-400 bg-gray-50 rounded-md mb-2">
            <div className="h-3 w-3 animate-spin rounded-full border-2 border-purple-600 border-t-transparent" />
            Buscando veículos...
          </div>
        )}
        {veicPoll.error && (
          <div className="flex items-center justify-center gap-2 py-2 text-xs text-red-400 bg-red-50 rounded-md mb-2">Erro ao carregar veículos</div>
        )}
        {!veicPoll.loading && !veicPoll.error && veicPoll.data?.veiculos?.length === 0 && (
          <div className="flex items-center justify-center gap-2 py-2 text-xs text-gray-400 bg-gray-50 rounded-md mb-2">
            <Bus className="h-3.5 w-3.5" /> Nenhum veículo neste itinerário no momento
          </div>
        )}

        {veicPoll.data?.veiculos?.length > 0 && prevPoll.data?.previsoes && lastParada && (
          <div className="mb-2">
            <p className="text-[11px] font-medium text-gray-500 mb-1">
              Previsão em <b className="text-gray-700">{lastParada.desc}</b>
            </p>
            <div className="flex flex-col gap-1">
              {prevPoll.data.previsoes
                .filter((p) => veicPoll.data.veiculos.some((v) => v.numVeicGestor === p.numVeicGestor))
                .map((p) => (
                  <div key={p.numVeicGestor} className="flex items-center justify-between px-2 py-1 shadow-sm rounded-md border text-xs">
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1 p-1 items-center justify-center rounded-md text-purple-700 border border-purple-200 font-bold">
                        <Bus className="h-3" /> {p.sgLin}
                      </div>
                      <div>
                        <div className="font-semibold text-xs">{p.apelidoLinha}</div>
                        <div className="flex items-center gap-1 text-xs text-gray-500"><Bus className="h-3" /> Veículo {p.numVeicGestor}</div>
                      </div>
                    </div>
                    <div className="text-xs bg-emerald-200/40 px-2 py-1 rounded-md text-emerald-700 font-medium text-nowrap">{p.prev}</div>
                  </div>
                ))}
            </div>
          </div>
        )}

        <div className="flex-1 rounded-md overflow-hidden border border-gray-200">
          <Mapa
            itinerarios={itinerarioAtivo?.itinerarios || []}
            paradas={paradasList}
            veiculos={veicPoll.data?.veiculos || []}
            nItinerario={nItinerario}
          />
        </div>
      </div>
    </div>
  )
}

function FlyToVehicle({ veiculos }) {
  const map = useMap()
  useEffect(() => {
    if (veiculos.length > 0 && veiculos[0]?.lat && veiculos[0]?.long) {
      const lat = parseFloat(veiculos[0].lat)
      const lng = parseFloat(veiculos[0].long)
      if (!isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0) {
        map.whenReady(() => {
          setTimeout(() => {
            map.invalidateSize()
            map.flyTo([lat, lng], 15, { duration: 1.5 })
          }, 100)
        })
      }
    }
  }, [veiculos])
  return null
}

const Mapa = memo(({ itinerarios, paradas, veiculos, nItinerario }) => {
  const { data: itinerarioAtivo } = useFetch(
    nItinerario ? url + `/itinerarios/${nItinerario}` : null
  )

  const fullItinerarios = itinerarioAtivo?.itinerarios || itinerarios

  const paths = useMemo(() => {
    const result = []
    if (veiculos.length > 0 && fullItinerarios.length > 0) {
      fullItinerarios.forEach((o, i) => {
        const distX = Math.abs(veiculos[0].lat - o.coordY)
        const distY = Math.abs(o.coordX - veiculos[0].long)
        if (distX < 0.0005 && distY < 0.0005) {
          result.push(fullItinerarios.slice(0, i))
          result.push(fullItinerarios.slice(i))
        }
      })
    }
    return result
  }, [fullItinerarios, veiculos])

  const hasVeiculos = veiculos.length > 0
  const antDelay = 8000

  return (
    <MapContainer className="w-full rounded-md shadow-md" center={[-12.2544, -38.9601]} zoom={13} scrollWheelZoom={true} style={{ height: '350px', minHeight: '350px' }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <FlyToItinerario itinerarios={fullItinerarios} veiculos={veiculos} />
      <FlyToVehicle veiculos={veiculos} />
      <>
        {veiculos.map((v) => (
          <Marker key={v.numVeicGestor} icon={BusIconBlue} position={[v.lat, v.long]} />
        ))}
        {fullItinerarios.length > 0 && (
          <>
            <AntPath positions={fullItinerarios.map(o => [o.coordY, o.coordX])} options={{ delay: antDelay, dashArray: [10, 20], weight: 5, color: hasVeiculos ? '#ddd' : '#000', opacity: 1, hardwareAccelerated: true }} />
            {hasVeiculos && paths[0] && <AntPath positions={paths[0].map(o => [o.coordY, o.coordX])} options={{ delay: antDelay, dashArray: [10, 20], weight: 5, color: '#ddd', opacity: 1, hardwareAccelerated: true }} />}
            {hasVeiculos && paths[1] && <AntPath positions={paths[1].map(o => [o.coordY, o.coordX])} options={{ delay: antDelay, dashArray: [10, 20], weight: 5, color: '#0000dd', opacity: 1, hardwareAccelerated: true }} />}
            <Marker icon={SquareIcon} position={[fullItinerarios[fullItinerarios.length - 1].coordY, fullItinerarios[fullItinerarios.length - 1].coordX]} />
            <CircleMarker pathOptions={{ color: '#374151' }} radius={8} center={[fullItinerarios[0].coordY, fullItinerarios[0].coordX]} />
          </>
        )}
        {paradas?.filter(p => p.y && p.x).map(p => (
          <Marker key={p.cod} icon={BusStopIconOrangeSmall} opacity={0.8} position={[p.y, p.x]}>
            <Popup>
              <Link to={`/paradas/${p.cod}`} className="text-sm font-medium text-purple-700 hover:underline">{p.desc || p.end}</Link>
            </Popup>
          </Marker>
        ))}
      </>
    </MapContainer>
  )
})

function FlyToItinerario({ itinerarios, veiculos }) {
  const map = useMap()
  useEffect(() => {
    if (itinerarios.length === 0) return
    if (veiculos.length > 0 && veiculos[0]?.lat) return
    const bounds = itinerarios.map((o) => [o.coordY, o.coordX])
    map.whenReady(() => {
      setTimeout(() => {
        map.invalidateSize()
        map.fitBounds(bounds, { padding: [40, 40] })
      }, 100)
    })
  }, [itinerarios, veiculos])
  return null
}

export { Mapa }
