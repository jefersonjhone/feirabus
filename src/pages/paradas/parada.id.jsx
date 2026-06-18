
import { useEffect, useState } from 'react'
import {
  MapContainer,
  TileLayer,
  Marker,
  CircleMarker,
  useMap,
  Popup,
} from 'react-leaflet'
import { BusIcon, BusIconBlue, BusStopIconOrangeSmall, ParadaIconSelected, MarkerPurpleIcon, SquareIcon } from '../../utils/Icons.js'
import 'leaflet/dist/leaflet.css'
import AntPath from '../../componentes/AntPath.jsx'
import 'leaflet-ant-path'
import url from '../../utils/urls.js'
import { useFetch } from '../../hooks/useFetch.jsx'
import { BarLoading, BarHLoading } from '../../componentes/loading.jsx'
import Error from '../../componentes/error.jsx'
import { Link, useNavigate, useSearchParams, useParams} from 'react-router-dom'
import { Horarios } from '../../componentes/horarios.jsx'
import {
  Compartilhar,
  Estrela,
  Fechar,
  Onibus,
  PinoLocalizacao,
  QuadroHorarios,
  RotaComBandeira,
  Seta
} from '../../componentes/icons.jsx'

import { Helmet } from 'react-helmet'
import Navbar from '../../componentes/navbar.jsx'
import { useLinhasStore } from '../../stores/linhaStore.js'
import { useToastStore } from '../../stores/toastStore'
import { useStops } from '../../hooks/useStops.js'

const parse_paradas = (paradas) => {
  var data = {}
  paradas.forEach((h) => {
    if (data[h.sent] !== undefined) {
      data[h.sent].push(h)
    } else {
      data[h.sent] = [h]
    }
  })
  return data
}

export const StopDetail = () => {
  const [itinerarioAtivo, setItinerarioAtivo] = useState(null)
  const [page, setPage] = useState(0)
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const tab = "a;"
  const {cod} = useParams();
  const stop = useStops(cod);
  

  const opcoes = ['Previsões', 'Linhas', 'Paradas Próximas']

  const handle_exit = () => {
    //navigate("/linhas/")
    window.history.back()
  }
  const handleSetPage = (val) => {
    params.set('tab', opcoes[val])
    navigate({ search: params.toString() }, { replace: true })
    setItinerarioAtivo(null)
    setPage(val)
  }

  async function compartilharRota() {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${opcoes[page]} da Linha `,
          text: `Confira ${opcoes[page]} da Linha  no FeiraBus`,
          url: window.location.href,
        })
      } catch (err) {
        console.error('Erro ao compartilhar:', err)
      }
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert('O compartilhamento não é suportado neste navegador.')
    }
  }

  const opcoes_icons = {
    'Previsões': <QuadroHorarios className="h-4" />,
    'Linhas': <Onibus className="h-4" />,
    'Paradas Próximas': <PinoLocalizacao className="h-4" />,
  }

  const {
    loading,
    data: linhaQueAtendem,
    error,
  } = useFetch( stop?`${url}/paradas/${stop.cod}/linhas-que-atendem`:null)

  const {
    loading: loading_itinerarios,
    data: previsoes,
    error: error_itinerarios,
  } = useFetch(stop?`${url}/paradas/${stop.cod}/previsoes`:null)

  const {
    loading: loading_paradas_proximas,
    data: paradas_proximas,
    error: error_paradas_proximas,
  } = useFetch(stop? `${url}/paradas/paradas-proximas/@${stop.x},${stop.y}`:null)


  return (
    <>
      <Helmet>
        <title>
          {stop?.desc} | Linhas, Previsões e Localização da Parada
        </title>
      
        <meta
          name="description"
          content={`Consulte as linhas que atendem a parada ${stop?.desc}, previsões de chegada, localização no mapa, itinerários e paradas próximas em Feira de Santana - BA.`}
        />
      
        <meta
          name="robots"
          content="index,follow"
        />
      
        <link
          rel="canonical"
          href={`https://feirabus.vercel.app/paradas/${stop?.cod}`}
        />
      
        <meta
          property="og:type"
          content="website"
        />
      
        <meta
          property="og:url"
          content={`https://feirabus.vercel.app/paradas/${stop?.cod}`}
        />
      
        <meta
          property="og:title"
          content={`${stop?.nome} | Parada de Ônibus em Feira de Santana`}
        />
      
        <meta
          property="og:description"
          content={`Veja previsões de chegada, linhas atendidas, itinerários e localização da parada ${stop?.desc}.`}
        />
      
        <meta
          property="og:image"
          content="https://feirabus.vercel.app/logo_feirabus.png"
        />
      
        <meta
          name="twitter:card"
          content="summary_large_image"
        />
      
        <meta
          name="twitter:title"
          content={`${stop?.desc} | Parada de Ônibus`}
        />
      
        <meta
          name="twitter:description"
          content={`Consulte linhas, previsões de chegada e localização da parada ${stop?.desc} em Feira de Santana.`}
        />
      
        <meta
          name="twitter:image"
          content="https://feirabus.vercel.app/logo_feirabus.png"
        />
      </Helmet>
      <Navbar page={'linhas'} />
      <div className="w-full mx-auto text-left max-w-[1200px] ">
        <div className="md:my-4 flex flex-col justify-between gap-4">
          <div className="flex items-center justify-between">
            <h1 className="text-sm font-medium sm:text-xl ">
              Parada {stop?.desc}
            </h1>
            <FavButtonParada parada={stop} />
          </div>
          <h2 className='text-xs md:text-sm text-slate-400 mb-4 md:mb-8 sr-only'>
            Consulte previsões de próximos ônibus, linhas que atendem e paradas próximas a { stop?.desc} em Feira de Santana.
          </h2>
          <div className="flex w-full gap-1 flex-col mb-6 sticky top-0 z-[99]">
            <div className="">
              <ul className="w-full bg-slate-100 flex flex-row gap-1 px-1 py-2 rounded-sm items-center  text-slate-400 text-sm ">
                {opcoes.map((p, i) =>
                  i === page ? (
                    <li
                      key={i}
                      className="bg-purple-800 p-1 rounded-full w-3/5 text-center text-white font-medium shadow-md"
                    >
                      <p className="flex items-center justify-center gap-1 ">
                        <span className="flex items-center justify-center rounded-md w-6 h-6 aspect-square ">
                          {opcoes_icons[p]}
                        </span>
                        {p}
                      </p>
                    </li>
                  ) : (
                    <li
                      key={i}
                      className="p-1 rounded-full  truncate bg-white  w-1/3 text-center cursor-pointer shadow-sm border hover:border hover:border-purple-800 hover:text-purple-800"
                      onClick={() => {
                        handleSetPage(i)
                      }}
                    >
                      <h3 className="flex items-center justify-center w-full truncate">
                        <span className="flex items-center justify-center rounded-md w-6 h-6 aspect-square ">
                          {opcoes_icons[p]}
                        </span>
                          <span className='w-1/2 sm:w-fit '>
                        {p}
                          </span>
                      </h3>
                    </li>
                  )
                )}
              </ul>
            </div>
          </div>
          
          {stop?.x && stop?.y ?
            <div className=' w-full border rounded-md gap-4'>
              <Location lat={stop.y} long={stop?.x} itinerarioAtivo={itinerarioAtivo} paradas_proximas={page ===2 ? paradas_proximas?.paradas : []} height={200} />
              
              
            </div>
            : <p>localização faltando</p>
          }
        <div className="flex flex-row gap-2 rounded-md  bg-slate-100 px-1 py-1 text-sm  text-slate-700">
          Atualizado em :
          <span className='flex items-center gap-1 text-nowrap text-emerald-600 '>
            <span className="h-2 w-2 rounded-full bg-green-500 font-bold "></span>
            {previsoes?.horaConsulta}
          </span>
        </div>
        <section className={`gap-4 ${page === 0? "" : "sr-only"}`} >
          <div className=' p-2  flex flex-col gap-2  overflow-x-hidden shadow-inner'>
            Proximos ônibus para {stop.desc}
            {previsoes && previsoes.previsoes.map(p =>
                <div
                key={p.cod}
                className="px-1 md:px-2 max-h-24 py-1 shadow-sm rounded-md border transform  transition-transform duration-300
                hover:scale-y-105 hover:border-slate-300 hover:shadow-lg hover:bg-white hover:z-10 text-xs "
              >
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="flex gap-1 md:gap-2 p-1 md:p-2 items-center justify-center rounded-md text-violet-700 border-2  border-violet-700   font-bold"
                      
                    >
                      <Onibus />
                      {p.sgLin}
                    </div>
                    <div>
                      <div className="font-semibold text-xs md:text-sm md:font-medium">{p.apelidoLinha}</div>
                      <div className="flex items-center gap-1 text-xs text-gray-800">
                        {p.numVeicGestor && <><Onibus className="h-3"/> Veículo {p.numVeicGestor}</>}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm bg-emerald-200/40 p-1  px-2 rounded-md text-emerald-700 text-nowrap">
                      {p.prev}
                    </div>
                    
                  </div>
                </div>
                <div
                  className=' flex justify-end gap-2 text-xs '
                >
                  <spam
                    className={`flex flex-row items-center rounded-lg text-slate-600 px-2 hover:border-slate-400 hover:border cursor-pointer ${itinerarioAtivo === p.codItinerario? "bg-emerald-200" : "bg-slate-200" }`}
                    onClick={(event) => itinerarioAtivo === p.codItinerario ?setItinerarioAtivo(null): setItinerarioAtivo(p.codItinerario)}
                  >
                    { itinerarioAtivo === p.codItinerario? "Itinerário ativo" : "Ver itinerário" }
                  <RotaComBandeira className={" p-1 font-base rounded-md"}/>
                  </spam>
                <Link
                    to={`/linhas/${p.sgLin}`} 
                    className="flex justify-end "  
                >
                  <span className="flex items-center text-blue-600 cursor-pointer hover:text-blue-800 hover:font-medium bg-blue-100 rounded-lg px-2">
                    Ver Detalhes{' '}
                    <span>
                      {' '}
                      <Seta />
                    </span>
                  </span>
              </Link>
                </div>
                </div>
            )}
          </div>
        </section>
            <section id="linhas-que-atendem" className={`p-1 flex flex-col gap-4 ${page === 1 ? "" : "sr-only"}`}>
            Linhas que atendem {stop?.desc}
            {linhaQueAtendem && linhaQueAtendem.linhas.map(p =>
              <Link
                to={`/linhas/${p.num_linha}`}
                key={p.cod}
                className="py-1 px-2 shadow-sm rounded-md border transform  transition-transform duration-300
                 hover:scale-y-110 hover:border-slate-300 hover:shadow-lg hover:bg-white hover:z-10"
              >
                <div className="flex items-center justify-between ">
                  <div className="flex items-center gap-2">
                    <div
                      className="flex gap-2 px-2 py-1 items-center justify-center rounded-md text-violet-700 border-2  border-violet-700   font-bold"
                      
                    >
                      {p.num_linha}
                    </div>
                    <div>
                      <div className="font text-sm">{p.descricao}</div>
                      <div className="flex items-center gap-1 text-xs text-gray-800">
                        {p.numVeicGestor && <><Onibus className="h-3"/> Veículo {p.numVeicGestor}</>}
                      </div>
                    </div>
                  </div>
                  
                </div>
                <div className="flex justify-end text-xs ">
                  <span className="flex items-center text-blue-600 cursor-pointer hover:text-blue-800 hover:font-medium">
                    Ver Detalhes{' '}
                    <span>
                      {' '}
                      <Seta />
                    </span>
                  </span>
                </div>
              </Link>
              
            )}
          </section>
          <section id="paradas-proximas" className={`flex flex-col gap-4 p-2 ${page === 2 ? "" : "sr-only"}`}>
                Paradas próximas de {stop?.desc}
                {paradas_proximas && paradas_proximas.paradas.filter(p => p.cod !== stop.cod).map(p =>
                  <Link to={`/paradas/${p.cod}` }>
                     <div className="flex flex-row gap-2  border p-2">
                       <div className="flex flex-col items-center">
                         <div
                           className={`flex flex-row items-center justify-center text-center rounded-full text-white w-8 h-8 bg-purple-800`}
                         >
                           <PinoLocalizacao className="h-4" />
                         </div>
                        
                       </div>
                       <div className="font-medium h-8">
                         <h2 className="text-sm font-semibold flex group ">
                           {p.desc}
                           <a
                             className="text-xs group-hover:flex text-gray-400 flex items-center hover:underline hover:text-gray-600 font-medium"
                             href={`/paradas/${p.cod}`}
                             //href={`https://www.google.com/maps/dir/${p.y},${p.x}/@${p.y},${p.x},81m/`}
                             target="_blank"
                             rel="noreferrer"
                           >
                             <Compartilhar className="h-3" />
                           </a>
                         </h2>
                         <div className="flex flex-col ">
                           <p className="text-gray-500 text-xs">
                             {p.x} {p.y}
                           </p>
                         </div>
                       </div>
                     </div>
                     </Link>
                )}
          </section>
          </div>
      </div>
    </> 
  )
}


const FavButtonParada = ({ parada }) => {
  const store = useLinhasStore()
  const notify = useToastStore((s) => s.notify)
  if (!parada) return null
  const isFav = store.isFavParada(parada.cod)
  return (
    <button
      onClick={(e) => {
        e.stopPropagation()
        const adding = !isFav
        store.toggleFavParada(parada)
        notify(
          adding
            ? `Parada ${parada.cod} adicionada aos favoritos`
            : `Parada ${parada.cod} removida dos favoritos`,
          'success'
        )
      }}
      className={`flex items-center justify-center bg-gray-100 rounded-full p-2 w-10 h-10 aspect-square cursor-pointer hover:bg-gray-200 hover:border hover:border-gray-500 ${isFav ? 'text-yellow-500' : 'text-gray-400'}`}
      title={isFav ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
    >
      <Estrela className={`h-5 w-5 ${isFav ? 'fill-yellow-500' : ''}`} />
    </button>
  )
}

function Location({ lat, long, itinerarioAtivo, paradas_proximas, }) {
  const {
    loading: loading_itinerarios,
    data,
    error: error_itinerarios,
  } = useFetch(itinerarioAtivo !== null ? `${url}/itinerarios/${itinerarioAtivo}`:null)
  const {
    loading: loading_veiculos,
    data:veiculos,
    error: error_veiculos,
  } = useFetch(itinerarioAtivo !== null ? `${url}/itinerarios/${itinerarioAtivo}/veiculos`:null)
  const itinerarios = data?.itinerarios
  return (
    <div className="rounded-md overflow-hidden h-fit">
      <MapContainer
        className="max-h-52 md:max-h-96 rounded-md shadow-md"
        center={[lat, long]}
        zoom={17}
        style={{ height: "", width: '100%' }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {
          itinerarioAtivo && itinerarios && !loading_itinerarios?<>
            <AntPath
            positions={itinerarios.map((o) => [o.coordY, o.coordX])}
            options={{
              delay: 1000,
              dashArray: [9, 22],
              weight: 5,
              color: '#000',
              opacity: 1,
              hardwareAccelerated: true,
            }}
            />
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
            {veiculos &&
                         veiculos.veiculos &&
                         veiculos.veiculos.map((v) => (
                           <div className="">
                             <Marker
                               className=""
                               icon={BusIconBlue}
                               position={[v.lat, v.long]}
                             />
                           </div>
                         ))}
          </>
          :<></>
        }
        <>

          <Marker
          icon={ParadaIconSelected}
          position={[lat, long]}
          />
          {paradas_proximas?.map(p => 
            <Marker
              icon={MarkerPurpleIcon}
              position={[p.y, p.x]}
            >
              <Popup>
                <a href={`/paradas/${p.cod}`}>
                  {p.desc}
                </a>
              </Popup>
            </Marker>
            
          )}
        </>
      </MapContainer>
    </div>
  )
}