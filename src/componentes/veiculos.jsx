import React, {
  useMemo,
  useState,
  createContext,
  useEffect,
  useContext,
  memo,
} from 'react'
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
import { HorariosDetail } from '../componentes/HorariosDetail'
import Navbar from '../componentes/navbar'
import { useFetch } from '../hooks/useFetch.jsx'
import { BarLoading } from '../componentes/loading.jsx'
import Error from '../componentes/error.jsx'
import { useNavigate, useSearchParams } from 'react-router-dom'
import AntPath from './AntPath.jsx'
import {
  BusIconBlue,
  BusIconBlueTopView,
  SquareIcon,
  SquareIconSmall,
} from '../utils/Icons.js'

export function VeiculosCard({ linha }) {
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
  const [saida, setSaida] = useState(0)
  const directions = codItinerarios
    ? Object.keys(codItinerarios['itinerarios'])
    : []
  if (loading_itinerarios) {
    return <>loading...</>
  }
  if (error_itinerarios) {
    return <>error...</>
  }
  return (
    <div className="w-full h-full flex flex-col mx-auto ">
      <div className="border border-slate-200 px-2 py-1 rounded-sm text-sm">
        <h4 className="font-medium text-center">SAÍDA</h4>
        <ul className="w-full bg-slate-100 flex flex-row gap-2 p-1 rounded-sm items-center font-medium text-slate-500 leading-4">
          {directions.map((p, i) =>
            i === saida ? (
              <li className="bg-purple-800 p-1 rounded-md w-1/2 text-center text-white font-medium ">
                {p}
              </li>
            ) : (
              <li
                className="p-1 rounded-md w-1/2 text-center cursor-pointer hover:cursor-pointer hover:border hover:border-purple-800 hover:text-purple-800 hover:border-purple-800 hover:text-purple-800"
                onClick={() => {
                  setSaida(i)
                }}
              >
                {p}
              </li>
            )
          )}
        </ul>
      </div>
      <div className="w-full h-full ">
        {paradas !== undefined && (
          <Mapa
            n_itinerario={codItinerarios.itinerarios[directions[saida]][0]}
            paradas={paradas[directions[saida]]}
            linha={linha}
          />
        )}
      </div>
    </div>
  )
}

export function Mapa({ n_itinerario, paradas, linha }) {
  const apiurl_veiculos = url + `/itinerarios/${n_itinerario}/veiculos`
  const apiurl_itinerario = url + `/itinerarios/${n_itinerario}`
  const {
    loading_veiculos,
    data: veiculos,
    error: error_veiculos,
  } = useFetch(apiurl_veiculos)
  const {
    loading: loading_itinerario,
    data: itinerarioAtivo,
    error: error_itinerario,
  } = useFetch(apiurl_itinerario)
  let last =
    paradas && veiculos && veiculos.veiculos && veiculos.veiculos.length > 0
      ? paradas[paradas.length - 1]
      : null
  const apiurl_previsoes = last ? url + `/paradas/${last.cod}/previsoes` : null
  const {
    loading: loading_prev,
    data: previsoes,
    errorr: error_prev,
  } = useFetch(apiurl_previsoes)
  const itinerarios =
    itinerarioAtivo && itinerarioAtivo.itinerarios
      ? itinerarioAtivo.itinerarios
      : []

  let prevs = []

  console.log(
    previsoes !== undefined
      ? previsoes.previsoes
          .filter((p) => p.sgLin === linha.sgl)
          .filter(
            (p) =>
              p.numVeicGestor in veiculos.veiculos.map((v) => v.numVeicGestor)
          )
      : ''
  )
  if (veiculos && previsoes) {
    let veics = veiculos.veiculos.map((v) => v.numVeicGestor)
    veics.map((v) => {
      prevs.push(...previsoes.previsoes.filter((p) => p.numVeicGestor === v))
    })
  }

  console.log(previsoes, veiculos)
  if (prevs) {
    console.log(prevs)
  }
  if (loading_veiculos) {
    return <BarLoading />
  }
  if (error_veiculos) {
    return <Error error={error_veiculos} imagesrc={'./explorar.png'} />
  }
  let paths = []
  let rotation = 0
  itinerarios.forEach((o, i) => {
    if (veiculos && veiculos.veiculos && veiculos.veiculos.length > 0) {
      let distX = veiculos.veiculos[0].lat - o.coordY
      let distY = o.coordX - veiculos.veiculos[0].long
      const max_dist = 0.0005
      if (Math.abs(distX) < max_dist && Math.abs(distY) < max_dist) {
        paths = [itinerarios.slice(0, i), itinerarios.slice(i)]
      }
    }
  })

  return (
    <>
      <div className="rounded-md overflow-hidden w-full h-full md:p-4">
        <p className="text-sm font-medium">
          {prevs.length > 0 && last && (
            <h3>
              previsao de chegada em <b>{last.desc}</b>:{' '}
              {prevs.map((p) => (
                <p>
                  Veículo <span className="">{p.numVeicGestor}</span>:{' '}
                  <i>
                    <b>{p.prev}</b>
                  </i>
                </p>
              ))}
            </h3>
          )}
        </p>
        <MapContainer
          className="rounded-md shadow-md"
          center={[-12.254463237869844, -38.960094451904304]}
          zoom={13}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <>
            {veiculos &&
              veiculos.veiculos &&
              veiculos.veiculos.map((v) => (
                <div className="transform -rotate-45">
                  <Marker
                    className=""
                    icon={BusIconBlueTopView('/bus_top_view_blue.png')}
                    position={[v.lat, v.long]}
                  />
                </div>
              ))}
            {itinerarioAtivo && itinerarioAtivo.itinerarios && (
              <>
                <AntPath
                  positions={itinerarios.map((o) => [o.coordY, o.coordX])}
                  options={{
                    delay: 2000,
                    dashArray: [10, 20],
                    weight: 5,
                    color: '#000',
                    opacity: 1,
                    hardwareAccelerated: true,
                  }}
                />

                {paths.map((p, i) => {
                  return (
                    <AntPath
                      positions={p.map((o) => [o.coordY, o.coordX])}
                      options={{
                        delay: 2000,
                        dashArray: [10, 20],
                        weight: 5,
                        color: i === 0 ? '#ddddff' : '#0000dd',
                        opacity: 1,
                        hardwareAccelerated: true,
                      }}
                    />
                  )
                })}

                <Marker
                  icon={SquareIcon}
                  position={[
                    itinerarios[itinerarios.length - 1].coordY,
                    itinerarios[itinerarios.length - 1].coordX,
                  ]}
                />

                <CircleMarker
                  pathOptions={{ color: 'black' }}
                  radius={8}
                  center={[itinerarios[0].coordY, itinerarios[0].coordX]}
                />
              </>
            )}
          </>
        </MapContainer>
      </div>
    </>
  )
}
