import { useState, useEffect, useMemo } from 'react'
import { Marker, CircleMarker } from 'react-leaflet'
import AntPath from '../AntPath'
import { ParadaIconSelected, SquareIcon } from '../../utils/Icons'
import url from '../../utils/urls'
import isEmpty from '../../utils/isEmpty'

export function Rota({
  localAtivo,
  numItinerario,
  numVeicGestor,
  previsao,
  color,
  weight,
  radius,
}) {
  const [Rotas, setRota] = useState({})

  useEffect(() => {
    if (Rotas[numItinerario] !== undefined) return
    if (numItinerario === undefined) return
    fetch(url + `itinerarios/${numItinerario}`)
      .then((e) => e.json())
      .then(setRota)
  }, [])

  const cores = {
    1: '#00f',
    2: '#ff0000',
    3: '#0f0',
    4: 'orange',
    5: 'brown',
    6: 'purple',
  }

  const AntPathRota = useMemo(
    () =>
      !isEmpty(Rotas) &&
      Rotas[numItinerario] !== undefined &&
      Rotas[numItinerario].itinerarios !== undefined ? (
        <>
          <Marker
            icon={SquareIcon}
            position={[
              Rotas[numItinerario].itinerarios[
                Rotas[numItinerario].itinerarios.length - 1
              ].coordY,
              Rotas[numItinerario].itinerarios[
                Rotas[numItinerario].itinerarios.length - 1
              ].coordX,
            ]}
          ></Marker>

          <CircleMarker
            center={[
              Rotas[numItinerario].itinerarios[0].coordY,
              Rotas[numItinerario].itinerarios[0].coordX,
            ]}
            pathOptions={{ color: cores[color] || '#000' }}
            radius={radius || 8}
          ></CircleMarker>

          <AntPath
            positions={Rotas[numItinerario].itinerarios.map((o) => [
              o.coordY,
              o.coordX,
            ])}
            options={{
              delay: 2000,
              dashArray: [10, 20],
              weight: weight || 5,
              color: cores[color] || '#000',
              opacity: 1,
              hardwareAccelerated: true,
            }}
          />
        </>
      ) : (
        <></>
      ),
    [Rotas]
  )
  return (
    <>
      {Rotas[numItinerario] !== undefined &&
      Rotas[numItinerario].itinerarios !== undefined ? (
        AntPathRota
      ) : (
        <></>
      )}
    </>
  )
}
