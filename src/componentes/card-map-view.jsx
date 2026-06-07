
import React, {
  useMemo,
  useState,
  createContext,
  useEffect,
  useContext,
  memo,
} from 'react';
import { MapContainer, Marker, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-ant-path';
import '../App.css';
import { Menu } from '../componentes/Menu/Menu.jsx';
import Paradas from '../componentes/Menu/Paradas.jsx';
import { MapClick, MapFly } from '../componentes/maptools';
import { Marcadores } from '../componentes/marcadores.jsx';
import isEmpty from './../utils/isEmpty.js';
import url from '../utils/urls';
import { Previsoes } from '../componentes/Menu/Previsoes.jsx'
import { useGeolocation } from '../hooks/useGeolocation.jsx'
import {
  ClickIcon,
  alfineteIcon,
  MarkerPurpleIcon,
  ParadaIconSelected
} from '../utils/Icons.js'



export const currentPointContext = createContext(null)

export const useCurrentPoint = () => {
  return useContext(currentPointContext)
}
export default function Mapa({parada_selecionada}) {
  
  return (
    <div className="map-component">
      <div className="relative w-full  h-52  sm:h-[600px] overflow-y-hidden rounded-lg">
        <MapContainer
          className=""
          center={[-12.254463237869844, -38.960094451904304]}
          zoom={14}
          zoomControl={false}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            className=""
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapComponents parada_selecionada={parada_selecionada}/>
        </MapContainer>
      </div>
    </div>
  )
}



export function MapComponents({ parada_selecionada }) {

  return (
    <div>
      <div>
      </div>
      {parada_selecionada.x && parada_selecionada.y &&
        <>
        <Marker
          key={parada_selecionada.cod}
          id={parada_selecionada.cod}
          position={[parada_selecionada.y, parada_selecionada.x]}
          zIndexOffset={100}
          opacity={1}
          icon={ParadaIconSelected}
          eventHandlers={{
            click: () => {
              
            },
          }}
        >
        </Marker>
        <MapFly currentPoint={{"x":parada_selecionada.x, "y":parada_selecionada.y}} />
        </>
      }
      
      
    </div>
  )
}