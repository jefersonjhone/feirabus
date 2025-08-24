import React, {
  useMemo,
  useState,
  createContext,
  useEffect,
  useContext,
  memo,
} from 'react'
import { MapContainer, Marker, TileLayer } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet-ant-path'
import '../App.css'
import { Menu } from '../componentes/Menu/Menu.jsx'
import Paradas from '../componentes/Menu/Paradas.jsx'
import { MapClick, MapFly } from '../componentes/maptools'
import { Marcadores } from '../componentes/marcadores.jsx'
import isEmpty from './../utils/isEmpty.js'
import url from '../utils/urls'
import { Previsoes } from '../componentes/Menu/Previsoes.jsx'
import { useGeolocation } from '../hooks/useGeolocation.jsx'

const historicoContext = createContext(null)
export const currentPointContext = createContext(null)

export const useCurrentPoint = () => {
  return useContext(currentPointContext)
}
const Marcador = memo(
  Marcadores,
  (prevProps, nextProps) =>
    (prevProps.currentBusStop === nextProps.currentBusStop) &
    (prevProps.currentPoint === nextProps.currentPoint)
)

export default function Mapa() {
  const {
    location,
    error: location_error,
    loading: loading_location,
  } = useGeolocation()
  console.log(location)
  return (
    <div className="map-component">
      <div className="relative w-screen h-screen overflow-y-hidden">
        <MapContainer
          className=""
          center={[-12.254463237869844, -38.960094451904304]}
          zoom={13}
          style={{ height: '100vh', width: '100%' }}
        >
          <TileLayer
            className=""
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {location && (
            <Marker position={[location.latitude, location.longitude]} />
          )}
          <MapComponents />
        </MapContainer>
      </div>
    </div>
  )
}

const SCREENS = {
  PARADAS: 'PARADAS',
  PREVISOES: 'PREVISOES',
}

export function MapComponents() {
  const [pontosProximos, setPontosProximos] = useState({})
  const [itinerarioAtivo, setItinerarioAtivo] = useState([])
  const [RotaAtiva, setRotaAtiva] = useState(undefined)
  const [currentPoint, setCurrentPoint] = useState({})
  const [currentBusStop, setCurrentBusStop] = useState({})
  const [currentScreen, setCurrentScreen] = useState('')

  const setHistorico = useContext(historicoContext)

  console.log('rerendering -> mapcomponents')
  useEffect(() => {
    if (isEmpty(currentPoint)) return
    fetch(url + `/paradas-proximas/${currentPoint.lng}/${currentPoint.lat}`)
      .then((e) => e.json())
      .then(setPontosProximos)
  }, [currentPoint])

  useEffect(() => {
    setCurrentScreen(SCREENS.PARADAS)
    if (
      pontosProximos.paradas === undefined ||
      isEmpty(pontosProximos.paradas)
    ) {
      console.log('não há paradas próximas')
      return
    }
    if (
      pontosProximos.paradas.filter((e) => e.cod === currentBusStop.cod)
        .length > 0
    )
      return
    setCurrentBusStop(pontosProximos.paradas[0])
  }, [pontosProximos])

  useEffect(() => setCurrentScreen(SCREENS.PARADAS), [currentBusStop.cod])

  const HandlerRota = ({ props }) => {
    const [RotaAtiva, itinerarioAtivo] = props
    if (RotaAtiva === undefined) return
    if (itinerarioAtivo.codItinerario === undefined) return
    if (RotaAtiva.props === undefined) return
    if (RotaAtiva.props.props[1] === itinerarioAtivo.codItinerario) {
      return RotaAtiva
    }
  }

  const renderScreen = () => {
    switch (currentScreen) {
      case SCREENS.PARADAS:
        return (
          <Paradas
            pontosProximos={pontosProximos}
            localAtivo={currentBusStop}
            setLocalAtivo={setCurrentBusStop}
            MudarComponente={setCurrentScreen}
            itinerarioAtivo={itinerarioAtivo}
          />
        )
      case SCREENS.PREVISOES:
        return (
          <Previsoes
            key={currentBusStop.cod}
            pontosProximos={pontosProximos}
            currentBusStop={currentBusStop}
            setCurrentBusStop={setCurrentBusStop}
            setCurrentScreen={setCurrentScreen}
            itinerarioAtivo={itinerarioAtivo}
            setItinerarioAtivo={setItinerarioAtivo}
            setRotaAtiva={setRotaAtiva}
          />
        )
      default:
        return null
    }
  }

  const handlerLocalAtivo = (newLocalAtivo) => setCurrentBusStop(newLocalAtivo)

  const handlerCurrentPoint = (newPoint) => setCurrentPoint(newPoint)

  return (
    <div>
      <div>
        <MapClick handleCurrentPoint={handlerCurrentPoint} />
        <MapFly currentPoint={currentPoint} />
      </div>
      <HandlerRota props={[RotaAtiva, itinerarioAtivo]} />
      <Marcador
        pontosProximos={pontosProximos}
        currentPoint={currentPoint}
        currentBusStop={currentBusStop}
        handlerLocalAtivo={handlerLocalAtivo}
      />
      <Menu>{renderScreen()}</Menu>
    </div>
  )
}
