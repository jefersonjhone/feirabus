import { useEffect } from 'react'
import { Marker, Popup } from 'react-leaflet'

import { BusIconBlue, BusIconGray } from '../../utils/Icons'

import { useNextBus } from '../Menu/prev'

export function Veiculos({
  localAtivo,
  numItinerario,
  numVeicGestor,
  previsao,
}) {
  const prev = useNextBus(numItinerario)
  console.log('updating bus -> ', numItinerario)
  console.log(prev)
  useEffect(() => {}, [prev])

  const veiculos = () => {
    return prev.veiculos !== undefined ? (
      prev.veiculos.map((v) =>
        v.numVeicGestor === numVeicGestor ? (
          <Marker icon={BusIconBlue} position={[v.lat, v.long]}>
            <Popup>
              linha {v.descricao}
              <br />
              número do veículo {v.numVeicGestor}
            </Popup>
          </Marker>
        ) : (
          <Marker
            style={{ opacity: '.6', color: '#ff0000' }}
            icon={BusIconGray}
            position={[v.lat, v.long]}
          ></Marker>
        )
      )
    ) : (
      <></>
    )
  }

  return <>{veiculos()}</>
}
