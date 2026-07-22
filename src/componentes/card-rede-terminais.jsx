import { motion } from 'motion/react'
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet-ant-path'
import AntPath from './AntPath'
import { useNavigate, Link } from 'react-router-dom'
import L from 'leaflet'

const TERMINAIS = [
  { id: 'central', nome: 'Terminal Central', cod: 4975, lat: -12.254389, lng: -38.972522, cor: '#a855f7' },
  { id: 'norte', nome: 'Terminal Norte', cod: 2028, lat: -12.224017, lng: -38.964381, cor: '#06b6d4' },
  { id: 'sul', nome: 'Terminal Sul', cod: 1822, lat: -12.295203, lng: -38.957406, cor: '#22c55e' },
  { id: 'pampalona', nome: 'Terminal Pampalona', cod: 5686, lat: -12.222101, lng: -38.983881, cor: '#f97316' },
  { id: 'ayrton', nome: 'Terminal Ayrton Senna', cod: 5660, lat: -12.222548, lng: -38.941005, cor: '#ec4899' },
  { id: 'noide', nome: 'Terminal Noide Cerqueira', cod: 5631, lat: -12.256095, lng: -38.922219, cor: '#f59e0b' },
]

const CONEXOES = [
  { from: 'central', to: 'norte', cor: '#06b6d4' },
  { from: 'central', to: 'sul', cor: '#22c55e' },
  { from: 'central', to: 'pampalona', cor: '#f97316' },
  { from: 'central', to: 'noide', cor: '#f59e0b' },
  { from: 'central', to: 'ayrton', cor: '#ec4899' },
  { from: 'norte', to: 'sul', cor: '#14b8a6' },
]

function bezierArc(lat1, lng1, lat2, lng2, curvature = 0.3, n = 40) {
  const midLat = (lat1 + lat2) / 2
  const midLng = (lng1 + lng2) / 2
  const dLat = lat2 - lat1
  const dLng = lng2 - lng1
  const dist = Math.sqrt(dLat * dLat + dLng * dLng)
  if (dist === 0) return [[lat1, lng1], [lat2, lng2]]
  const nx = -dLng / dist
  const ny = dLat / dist
  const offset = dist * curvature
  const cpLat = midLat + offset * ny
  const cpLng = midLng + offset * nx
  const points = []
  for (let i = 0; i <= n; i++) {
    const t = i / n
    const u = 1 - t
    points.push([
      u * u * lat1 + 2 * u * t * cpLat + t * t * lat2,
      u * u * lng1 + 2 * u * t * cpLng + t * t * lng2,
    ])
  }
  return points
}

function TerminalMarker({ terminal }) {
  const navigate = useNavigate()
  const icon = L.divIcon({
    className: '',
    html: `<div class="terminal-pulse" style="width:14px;height:14px;border-radius:50%;background:${terminal.cor};border:2px solid rgba(255,255,255,0.9);box-shadow:0 0 10px ${terminal.cor}80,0 0 24px ${terminal.cor}40;cursor:pointer;"></div>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
  })
  return (
    <Marker
      position={[terminal.lat, terminal.lng]}
      icon={icon}
      eventHandlers={{ click: () => navigate(`/paradas/${terminal.cod}?tab=previsoes`) }}
    />
  )
}

function AjustaZoom() {
  const map = useMap()
  map.setView([-12.246, -38.957], 12)
  return null
}

export default function CardRedeTerminais() {
  const arcos = CONEXOES.map(c => {
    const a = TERMINAIS.find(t => t.id === c.from)
    const b = TERMINAIS.find(t => t.id === c.to)
    return { ...c, positions: bezierArc(a.lat, a.lng, b.lat, b.lng, 0.35, 40) }
  })

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="p-[3px] rounded-xl bg-gray-50/40 ring-1 ring-gray-200/30 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-purple-50/30 hover:ring-purple-200/30 hover:shadow-[0_4px_20px_-6px_rgba(168,85,247,0.08)]">
        <div className="rounded-[calc(0.75rem-3px)] bg-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.6)] overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[10px] uppercase tracking-[0.15em] font-medium text-purple-500 mb-1 block">Conexões</span>
                <h2 className="text-xl md:text-2xl font-semibold tracking-tight text-slate-900">
                  Rede de Terminais
                </h2>
              </div>
              <div className="flex flex-wrap gap-3">
                {TERMINAIS.map(t => (
                  <Link
                    key={t.id}
                    to={`/paradas/${t.cod}?tab=previsoes`}
                    className="flex items-center gap-1.5 text-xs transition-colors duration-200"
                  >
                    <span className="h-2 w-2 rounded-full shrink-0" style={{ background: t.cor }} />
                    <span className="text-gray-500 hover:text-purple-700 hover:underline">{t.nome}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div className="h-72 sm:h-[520px] w-full bg-[#0a0a1a]">
            <MapContainer
              center={[-12.246, -38.957]}
              zoom={15}
              zoomControl={false}
              scrollWheelZoom={false}
              dragging={false}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                attribution='&copy; <a href="https://carto.com/">CARTO</a>'
                opacity={0.9}
              />
              <AjustaZoom />

              {arcos.map(a => (
                <AntPath
                  key={`glow-${a.from}-${a.to}`}
                  positions={a.positions}
                  options={{ weight: 12, color: a.cor, opacity: 0.08, delay: 4000, dashArray: [1, 0], hardwareAccelerated: true }}
                />
              ))}

              {arcos.map(a => (
                <AntPath
                  key={`main-${a.from}-${a.to}`}
                  positions={a.positions}
                  options={{ weight: 3, color: a.cor, opacity: 0.7, delay: 2000, dashArray: [8, 12], hardwareAccelerated: true }}
                />
              ))}

              {TERMINAIS.map(t => (
                <TerminalMarker key={t.id} terminal={t} />
              ))}
            </MapContainer>
          </div>

          <div className="flex sm:hidden flex-wrap gap-1.5 px-3 py-2 border-t border-gray-100 bg-gray-50">
            {TERMINAIS.map(t => (
              <Link key={t.id} to={`/paradas/${t.cod}?tab=previsoes`} className="flex items-center gap-1 text-[10px]">
                <span className="h-1.5 w-1.5 rounded-full shrink-0" style={{ background: t.cor }} />
                <span className="text-gray-500 hover:text-purple-700 hover:underline">{t.nome.split(' ').pop()}</span>
              </Link>
            ))}
          </div>

          <div className="hidden sm:flex flex-wrap items-center gap-x-3 gap-y-1 px-4 py-1.5 border-t border-gray-100 bg-gray-50/50 text-[11px] text-gray-500">
            {CONEXOES.map(c => {
              const t1 = TERMINAIS.find(t => t.id === c.from)
              const t2 = TERMINAIS.find(t => t.id === c.to)
              return (
                <span key={c.from + c.to} className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full shrink-0" style={{ background: c.cor }} />
                  <span>{t1.nome.split(' ')[1]}–{t2.nome.split(' ')[1]}</span>
                </span>
              )
            })}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
