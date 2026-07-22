import { useState, useEffect, useMemo } from 'react'
import { MapContainer, TileLayer, Marker, Polyline } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { MagnifyingGlass, MapPin, ArrowsLeftRight, CaretRight } from '@phosphor-icons/react'
import InputParadas from './input-paradas'
import { useLinhasStore } from '../stores/linhaStore'
import url from '../utils/urls'

function fmtTime(secs) {
  const h = Math.floor(secs / 3600)
  const m = Math.floor((secs % 3600) / 60)
  return `${String(h).padStart(2, '0')}h${String(m).padStart(2, '0')}`
}

function CardBuscarRota({ i, d, showMap = true }) {
  const paradas = useLinhasStore((s) => s.paradas)
  const [results, setResult] = useState({})
  const [init, setInit] = useState(i)
  const [dest, setDest] = useState(d)
  const [activeJourney, setActiveJourney] = useState(0)

  const timeSinceMidnight = () => {
    const now = new Date()
    return now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds()
  }

  const handleSelect = () => {
    window.location = `/rotas/${init.cod}/${dest.cod}`
  }

  const HandleSubmit = () => {
    if (!(init.cod && dest.cod)) return
    const tsm = timeSinceMidnight()
    fetch(`${process.env.REACT_APP_API_URL}/rotas/${init.cod}/${dest.cod}/${tsm}`)
      .then((e) => e.json())
      .then((e) => handleFetch(e))
      .catch((e) => console.log(e))
  }

  const handleFetch = (data) => {
    if (data.status !== 'OK') return
    const linhasMap = useLinhasStore.getState().linhas
    const sglPorCod = {}
    Object.values(linhasMap).forEach(l => { sglPorCod[l.cod] = l.sgl })
    const transformed = {
      departure_time: data.departure_time,
      from: data.from,
      to: data.to,
      results: data.journeys.map(journey => ({
        arrival_time: journey.arrival_time,
        departure_time: journey.departure_time,
        num_transfers: journey.num_transfers,
        legs: journey.legs.map(leg => ({
          parada_inicio: { cod: leg.from_stop_id, desc: leg.from_stop_name },
          parada_fim: { cod: leg.to_stop_id, desc: leg.to_stop_name },
          route_id: leg.route_id,
          linhas: [{ num_linha: sglPorCod[leg.route_id] || leg.route_id, descricao: leg.route_name }],
          departure_time: leg.departure_time,
          arrival_time: leg.arrival_time,
        })),
      })),
    }
    setResult(transformed)
  }

  useEffect(() => {
    if (i && d && i.cod && d.cod && !results.results) {
      HandleSubmit()
    }
  }, [])

  const currentJourney = results.results?.[activeJourney]

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-3 items-center w-full py-1">
        <div className="flex flex-row items-center w-full">
          <div className="w-full flex flex-col relative">
            <span className="absolute pl-3 text-gray-500 pt-3.5">
              <MapPin className="h-4" />
            </span>
            <InputParadas value={init} setValue={setInit} />
          </div>
        </div>
        <button
          onClick={() => { const a = dest; setDest(init); setInit(a) }}
          className="flex items-center justify-center w-10 h-10 rounded-full border border-gray-300 text-gray-500 hover:bg-purple-50 hover:text-purple-800 hover:border-purple-800 transition-all shrink-0"
          aria-label="Trocar origem e destino"
        >
          <ArrowsLeftRight className="h-5 w-5" />
        </button>
        <div className="flex flex-row items-center w-full">
          <div className="w-full flex flex-col relative">
            <span className="absolute pl-3 pt-3.5 text-gray-500">
              <MapPin className="h-4" />
            </span>
            <InputParadas value={dest} setValue={setDest} />
          </div>
        </div>
        <button
          type="submit"
          onMouseDown={handleSelect}
          onSubmit={handleSelect}
          className="flex flex-row items-center gap-2 bg-purple-700 p-2 min-w-24 rounded-md text-white font-medium hover:bg-purple-800"
        >
          <MagnifyingGlass className="h-4" />
          Buscar
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 mt-6">
        {showMap && (
        <div className="lg:w-3/5 lg:order-2">
          <RotaMap
            initParada={init}
            destParada={dest}
            journey={currentJourney}
            paradas={paradas}
          />
        </div>
        )}
        <div className={showMap ? 'lg:w-2/5 lg:order-1' : 'w-full'}>
          {results.results && results.results.length > 0 && (
            <div className="flex flex-col gap-3">
              <p className="text-sm text-gray-500">
                {results.results.length} rota{results.results.length > 1 ? 's' : ''} encontrada{results.results.length > 1 ? 's' : ''}
              </p>
              {results.results.map((journey, i) => (
                <button
                  key={i}
                  onClick={() => setActiveJourney(i)}
                  className={`text-left rounded-lg border p-3 transition-all ${
                    i === activeJourney
                      ? 'border-purple-500 bg-purple-50 shadow-sm ring-1 ring-purple-200'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3 text-sm text-gray-500 mb-2">
                    <span className="font-medium text-blue-700">{fmtTime(journey.departure_time)}</span>
                    <span>→</span>
                    <span className="font-medium text-green-700">{fmtTime(journey.arrival_time)}</span>
                    <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full ml-auto">
                      {journey.num_transfers === 0 ? 'direto' : `${journey.num_transfers} transferência${journey.num_transfers > 1 ? 's' : ''}`}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    {journey.legs.map((leg, j) => (
                      <div key={j} className="flex items-center gap-2 text-xs text-gray-600">
                        <span className="font-semibold text-blue-800 shrink-0">{leg.linhas[0].num_linha}</span>
                        <span className="truncate">{leg.parada_inicio.desc}</span>
                        <span className="text-gray-300 shrink-0">→</span>
                        <span className="truncate">{leg.parada_fim.desc}</span>
                      </div>
                    ))}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}

function RotaMap({ initParada, destParada, journey, paradas }) {
  const [itinerariosPath, setItinerariosPath] = useState(null)

  const markers = useMemo(() => {
    const result = []
    const seen = new Set()
    if (initParada?.y) {
      seen.add(initParada.cod)
      result.push({ cod: initParada.cod, desc: initParada.desc, lat: initParada.y, lng: initParada.x, tipo: 'origem' })
    }
    if (journey) {
      journey.legs.forEach((leg) => {
        const fromP = paradas[leg.parada_inicio.cod]
        const toP = paradas[leg.parada_fim.cod]
        if (fromP && !seen.has(leg.parada_inicio.cod)) { seen.add(leg.parada_inicio.cod); result.push({ cod: leg.parada_inicio.cod, desc: leg.parada_inicio.desc, lat: fromP.y, lng: fromP.x, tipo: 'intermediaria' }) }
        if (toP && !seen.has(leg.parada_fim.cod)) { seen.add(leg.parada_fim.cod); result.push({ cod: leg.parada_fim.cod, desc: leg.parada_fim.desc, lat: toP.y, lng: toP.x, tipo: 'intermediaria' }) }
      })
    }
    if (destParada?.y && !seen.has(destParada.cod)) {
      result.push({ cod: destParada.cod, desc: destParada.desc, lat: destParada.y, lng: destParada.x, tipo: 'destino' })
    }
    return result
  }, [initParada, destParada, journey, paradas])

  useEffect(() => {
    if (!journey) { setItinerariosPath(null); return }
    let cancelled = false
    const routeIds = [...new Set(journey.legs.map(l => l.route_id).filter(Boolean))]
    Promise.all(routeIds.map(rid =>
      fetch(`${url}/linhas/${rid}/itinerarios/default`).then(r => r.json()).then(data => {
        const itins = data?.itinerarios
        if (!itins) return null
        return Object.values(itins).flat()[0] || null
      })
    )).then(cods => {
      if (cancelled) return
      const valid = cods.filter(Boolean)
      return Promise.all(valid.map(cid =>
        fetch(`${url}/itinerarios/${cid}`).then(r => r.json()).then(data => (data?.itinerarios || []).map(p => [p.coordY, p.coordX]))
      ))
    }).then(paths => {
      if (!cancelled && paths) setItinerariosPath(paths)
    }).catch(() => {})
    return () => { cancelled = true }
  }, [journey])

  const center = markers.length > 0 ? [markers[0].lat, markers[0].lng] : [-12.246, -38.957]

  return (
    <div className="h-48 md:h-96 w-full rounded-lg overflow-hidden border border-gray-200">
      <MapContainer center={center} zoom={13} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
        <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />
        {(itinerariosPath || []).map((coords, i) => (
          coords.length > 1 && <Polyline key={i} positions={coords} pathOptions={{ color: '#374151', weight: 3, opacity: 0.7 }} />
        ))}
        {markers.map((p) => (
          <Marker key={p.cod} position={[p.lat, p.lng]} icon={L.divIcon({
            className: '',
            html: `<div style="width:12px;height:12px;border-radius:50%;background:${p.tipo === 'origem' ? '#22c55e' : p.tipo === 'destino' ? '#ef4444' : '#6b21a8'};border:2px solid white;box-shadow:0 1px 4px rgba(0,0,0,0.3);"></div>`,
            iconSize: [12, 12], iconAnchor: [6, 6],
          })} />
        ))}
      </MapContainer>
    </div>
  )
}

export default CardBuscarRota
