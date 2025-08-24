import { useEffect, useState } from 'react'
import {
  MapContainer,
  TileLayer,
  Marker,
  CircleMarker,
  useMap,
  Popup,
} from 'react-leaflet'
import { SquareIcon, BusStopIconOrangeSmall } from '../utils/Icons.js'
import 'leaflet/dist/leaflet.css'
import AntPath from './AntPath.jsx'
import 'leaflet-ant-path'
import url from '../utils/urls.js'
import navbar from './navbar'
import { useSearchParams } from 'react-router-dom'

export default function Map() {
  const [rotas, setRotas] = useState([])
  const [rotaAtiva, setRotaAtiva] = useState(undefined)
  const [codItinearios, setCodItinerarios] = useState({})
  const [itinerarioAtivo, SetItinerarioAtivo] = useState({})
  const [paradas, setParadas] = useState({})
  const [searchParams] = useSearchParams()

  const inicio = Number(searchParams.get('p_i'))
  const fim = Number(searchParams.get('p_f'))

  useEffect(() => {
    if (rotas.length > 0) {
      return
    }
    if (!inicio || !fim) {
      return
    }
    fetch('http://localhost:5500' + `/rotas/${inicio}/${fim}`)
      .then((e) => e.json())
      .then((e) => {
        if (e) {
          //var paradas = parse_paradas(e.paradas);
          //SetParadas(paradas);
          setRotas(e)
        } else {
          setRotas([{ error: 'true' }])
        }
      })
  })

  useEffect(() => {
    if (rotas.length > 0) {
      setRotaAtiva(0)
    }
  }, [rotas.length])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responses = await Promise.all(
          rotas[rotaAtiva].map(async (item) => {
            const res = await fetch(
              url + `/linhas/${item.linha.cod_linha}/paradas/coordenadas/`
            )
            const res_js = await res.json()
            const data = {}
            data[item.linha.cod_linha] = res_js
            return data
          })
        )
        setParadas(() => {
          const result = responses.reduce((acc, obj) => {
            return { ...acc, ...obj }
          }, {})
          return result
        })
      } catch (error) {
        console.error('Erro ao buscar dados:', error)
      }
    }

    if (rotaAtiva !== undefined) {
      fetchData()
    }
  }, [rotaAtiva])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responses = await Promise.all(
          rotas[rotaAtiva].map(async (item) => {
            const new_url = url + `/linhas/${item.linha.num_linha}/itinerarios`
            const res = await fetch(new_url)
            const res_js = await res.json()

            return res_js
          })
        )
        setCodItinerarios(() => {
          const resultado = Object.assign({}, ...responses)
          return resultado
        })
      } catch (error) {
        console.error('Erro ao buscar dados:', error)
      }
    }

    if (rotaAtiva !== undefined) {
      fetchData()
    }
  }, [rotaAtiva])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responses = await Promise.all(
          rotas[rotaAtiva].map(async (item) => {
            const linha = item.linha.num_linha
            console.log('linha ->', linha, codItinearios, codItinearios[linha])
            let itinerarios = codItinearios[linha]
            if (
              itinerarios === undefined ||
              itinerarios === 'sem itinerários'
            ) {
              return {}
            }
            const n_itinerarios = itinerarios[item.sentido]
            let n_itinerario = n_itinerarios[0]
            const new_url = url + `/itinerarios/${n_itinerario}`
            const res = await fetch(new_url)
            const res_js = await res.json()
            let data = {}
            data[n_itinerario] = res_js
            return data
          })
        )
        SetItinerarioAtivo(() => {
          const resultado = Object.assign({}, ...responses)
          return resultado
        })
      } catch (error) {
        console.error('Erro ao buscar dados:', error)
      }
    }

    if (Object.keys(codItinearios).length > 0 && rotaAtiva !== undefined) {
      fetchData()
    }
  }, [codItinearios])

  return (
    <MapContainer
      className="w-full h-full rounded-md shadow-md"
      center={[-12.254463237869844, -38.960094451904304]}
      zoom={13}
      style={{ height: '', width: '100%' }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {Object.keys(itinerarioAtivo).length > 0 ? (
        <>
          {Object.keys(itinerarioAtivo).map((n_itinerario, i) => (
            <AntPath
              positions={itinerarioAtivo[n_itinerario].itinerarios.map((o) => [
                o.coordY,
                o.coordX,
              ])}
              options={{
                delay: 2000,
                dashArray: [10, 20],
                weight: 4,
                color: i % 2 === 0 ? '#a200ff' : '#0000ff',
                opacity: 0.8,
                hardwareAccelerated: true,
              }}
            />
          ))}
          {/*
                                  <Marker
                                  icon={SquareIcon}
                                  position={[
                                    itinerarioAtivo.itinerarios[itinerarioAtivo.itinerarios.length -1].coordY,
                                    itinerarioAtivo.itinerarios[itinerarioAtivo.itinerarios.length -1].coordX
                                  ]} />
                                */}
        </>
      ) : (
        <></>
      )}
      {Object.keys(paradas).length > 0 && paradas ? (
        rotas[rotaAtiva].map((rota) => {
          //console.log(rota)
          //console.log(paradas[rota.linha.cod_linha] [rota.sentido])
          if (
            paradas[rota.linha.cod_linha] &&
            paradas[rota.linha.cod_linha][rota.sentido]
          ) {
            return paradas[rota.linha.cod_linha][rota.sentido]
              .filter(
                (p) =>
                  p.x &&
                  p.y &&
                  (p.cod === rota.parada_fim || p.cod === rota.parada_inicio)
              )
              .map((p) => (
                <Marker
                  icon={BusStopIconOrangeSmall}
                  opacity={1}
                  options={{
                    color: '#ff0000',
                  }}
                  position={[p.y, p.x]}
                  onClick={() => {
                    alert(p.cod)
                  }}
                >
                  <Popup>
                    {p.cod}
                    <hr />
                    {p.end}
                    <hr />
                    {rota.linha.num_linha}
                  </Popup>
                </Marker>
              ))
          }
        })
      ) : (
        <></>
      )}
      {/*
                                <CircleMarker
                                    pathOptions={{color:'black'}}
                                    radius={8}
                                    center={[
                                        itinerarios[0].coordY,
                                        itinerarios[0].coordX
                                    ]}/>
                                <MapFly
                                    props={itinerarios}
                                />
                                */}
      <div
        className="bg-white w-2/6 lg:w-1/6 h-screen absolute z-[16661] overflow-scroll  "
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
        }}
        onScroll={(e) => e.preventDefault()}
      >
        {rotas.map((r, i) => {
          return (
            <div
              className="rounded border border-1  mx-2 my-1 p-1  "
              onClick={() => setRotaAtiva(i)}
            >
              {r.map((op) => {
                return (
                  <div className={`${i === rotaAtiva ? 'bg-red-200 p-2' : ''}`}>
                    <p className="max-w-full truncate ">
                      linha {op.linha.num_linha} - {op.linha.descricao}
                    </p>

                    <p>sobe em: {op.parada_inicio}</p>
                    <p>desce em: {op.parada_fim}</p>
                  </div>
                )
              })}
            </div>
          )
        })}
      </div>
    </MapContainer>
  )
}
