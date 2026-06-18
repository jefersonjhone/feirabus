import { useEffect, useState } from 'react'
import {
MapContainer,
TileLayer,
Marker,
CircleMarker,
useMap,
Popup,
} from 'react-leaflet'
import { BusStopIconOrangeSmall, SquareIcon } from '../../utils/Icons.js'
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
Rota,
} from '../../componentes/icons.jsx'

import { Helmet } from 'react-helmet'
import Navbar from '../../componentes/navbar.jsx'
import { useLinhasStore } from '../../stores/linhaStore.js'
import { useToastStore } from '../../stores/toastStore'
import { useLines } from '../../hooks/useLines.js'

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

export const LineDetail = () => {
  const [saida, setSaida] = useState(0)
  const [page, setPage] = useState(0)
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const tab = "a;"
  const {cod} = useParams();
  const line = useLines(cod);
  
  
    const {
      loading,
      data: paradas,
      error,
    } = useFetch(line !==undefined ? `${url}/linhas/${line.cod}/paradas/coordenadas`:null)
  
    const {
      loading: loading_itinerarios,
      data: codItinerarios,
      error: error_itinerarios,
    } = useFetch(line !== undefined? `${url}/linhas/${line.cod}/itinerarios/default`:null)


  const opcoes = ['Paradas', 'Rotas', 'Horários']
  useEffect(() => {
    if (!tab) return
    if (opcoes.includes(tab)) {
      setPage(opcoes.indexOf(tab))
    }
  }, [tab, line])

  const handle_exit = () => {
    navigate("/linhas/")
  }
  const handleSetPage = (val) => {
    params.set('tab', opcoes[val])
    navigate({ search: params.toString() }, { replace: true })
    setPage(val)
  }

  async function compartilharRota() {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${opcoes[page]} da Linha ${line.sgl} - ${line.nom}`,
          text: `Confira ${opcoes[page]} da Linha ${line.sgl} no FeiraBus`,
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
    Paradas: <PinoLocalizacao className="h-4" />,
    Rotas: <Rota className="h-full" />,
    Horários: <QuadroHorarios className="h-full" />,
  }
  const directions = paradas ? Object.keys(paradas) : []
  const routeSummary = directions.join(" → ");

  return (
    <>
      <Helmet>
        <title>
          Linha {line?.sgl} - {line?.nom} | Itinerário, Horários e Paradas
        </title>
      
        <meta
          name="description"
          content={`Consulte o itinerário, horários e pontos de parada da linha ${line?.sgl} (${line?.nom}) em Feira de Santana - BA. Planeje sua viagem de ônibus com informações atualizadas.`}
        />
      
        <meta
          name="robots"
          content="index,follow"
        />
      
        <link
          rel="canonical"
          href={`https://feirabus.vercel.app/linhas/${line?.sgl}`}
        />
      
        <meta
          property="og:type"
          content="website"
        />
      
        <meta
          property="og:url"
          content={`https://feirabus.vercel.app/linhas/${line?.sgl}`}
        />
      
        <meta
          property="og:title"
          content={`Linha ${line?.sgl} - ${line?.nom} | FeiraBus`}
        />
      
        <meta
          property="og:description"
          content={
            routeSummary
              ? `Trajeto: ${routeSummary}. Consulte horários, itinerário e pontos de parada da linha ${line?.sgl} em Feira de Santana.`
              : `Consulte horários, itinerário e pontos de parada da linha ${line?.sgl} em Feira de Santana.`
          }
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
          content={`Linha ${line?.sgl} - ${line?.nom} | FeiraBus`}
        />
      
        <meta
          name="twitter:description"
          content={
            routeSummary
              ? `Trajeto: ${routeSummary}. Consulte horários, itinerário e pontos de parada da linha ${line?.sgl}.`
              : `Consulte horários, itinerário e pontos de parada da linha ${line?.sgl}.`
          }
        />
      
        <meta
          name="twitter:image"
          content="https://feirabus.vercel.app/logo_feirabus.png"
        />
      </Helmet>
      <Navbar page={'linhas'} />
      <div className="w-full mx-auto text-left max-w-[1200px] ">
        <div className="p-4 md:my-4 flex flex-col justify-between">
          <h1 className="text-xs font-medium sm:text-xl ">
            Linha { line?.sgl} - {line?.nom}
          </h1>
          <h2 className='text-xs md:text-sm text-slate-400'>
            Consulte o itinerário completo, horários atualizados e pontos de parada da linha{" "}
            {line?.sgl} em Feira de Santana - BA.
          </h2>
        </div>
        
        <div className="w-full h-fit md:min-h-[60vh]  m-auto rounded-xl p-  bg-white z-10  ">
          <div className="flex gap-1 flex-col mb-6 sticky top-0 z-20">
            <div className="">
              <ul className="w-full bg-slate-100 flex flex-row gap-1 px-1 py-2 rounded-sm items-center  text-slate-400 text-sm ">
                {opcoes.map((p, i) =>
                  i === page ? (
                    <li
                      key={i}
                      className="bg-purple-800 p-1 rounded-full w-3/5 text-center text-white font-medium shadow-md"
                    >
                      <p className="flex items-center justify-center gap-1">
                        <span className="flex items-center justify-center rounded-md w-6 h-6 aspect-square ">
                          {opcoes_icons[p]}
                        </span>
                        {p}
                      </p>
                    </li>
                  ) : (
                    <li
                      key={i}
                      className="p-1 rounded-full bg-white  w-1/3 text-center cursor-pointer shadow-sm border hover:border hover:border-purple-800 hover:text-purple-800"
                      onClick={() => {
                        handleSetPage(i)
                      }}
                    >
                      <h3 className="flex items-center justify-center gap-1 ">
                        <span className="flex items-center justify-center rounded-md w-6 h-6 aspect-square ">
                          {opcoes_icons[p]}
                        </span>
                        {p}
                      </h3>
                    </li>
                  )
                )}
              </ul>
            </div>
          </div>
          <div className="border border-1 border-gray-300 p-1 md:p-2 rounded-md border-t-4 border-t-purple-800 ">
            <div className="flex flex-row items-center gap-2 sm:px-4 mb-8">
              <div className="w-12 h-12 aspect-square bg-purple-800 rounded-md text-white font-bold text-center flex items-center justify-center">
                {line?.sgl}
              </div>
              <div className="flex flex-col md:flex-row w-full items-center overflow-hidden">
                <div className="font-semibold truncate w-full text-xs md:text-sm">
                  {line?.nom}
                </div>
                <div className="flex flex-row w-full justify-between">
                  <div className="flex flex-row w-full md:justify-end gap-1">
                    <FavButtonLinha linha={line} />
                    <Link to={`/veiculos?linha=${line?.sgl}`}>
                      <div className="flex items-center justify-center bg-gray-100 rounded-md md:rounded-full p-2 w-8 h-8 md:w-10 md:h-10 aspect-square cursor-pointer hover:bg-gray-200 hover:border  hover:border-gray-500">
                        <Onibus className="h-" />
                      </div>
                    </Link>
                    <button
                      className="flex items-center justify-center bg-gray-100 md:rounded-full p-2 w-8 h-8 md:w-10 md:h-10 aspect-square cursor-pointer hover:bg-gray-200 hover:border  hover:border-gray-500"
                      onClick={compartilharRota}
                    >
                      <Compartilhar />
                    </button>
                  </div>
                  <button
                    className="flex items-center justify-center bg-red-400 rounded-md md:rounded-full p-2 w-8 h-8 md:w-10 md:h-10 aspect-square cursor-pointer hover:bg-gray-200 hover:border  hover:border-gray-500"
                    onClick={handle_exit}
                  >
                    <Fechar className="" />
                  </button>
                </div>
              </div>
            </div>
            {loading ? (
              <BarLoading />
            ) : error ? (
              <Error error={error} imagesrc={'./explore.png'} />
            ) : (
              <div className="flex flex-col gap-2 ">
                <div className="flex flex-col gap-1 py-1 rounded-md text-xs leading-3  bg-slate-50">
                  <h4 className="font-semibold text-center ">SAÍDA</h4>
                  <ul className="w-full bg-slate-50 flex flex-row gap-2 p-1 rounded-full items-center font-medium text-slate-600 ">
                    {directions.map((p, i) =>
                      i === saida ? (
                        <li className="py-2 bg-purple-800 rounded-full w-1/2 text-center text-white font-medium ">
                          {p}
                        </li>
                      ) : (
                        <li
                          className="py-2 rounded-full w-1/2 text-center border border-slate-100 cursor-pointer hover:cursor-pointer hover:border hover:border-purple-800 hover:text-purple-800 hover:border-purple-800 hover:text-purple-800"
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
                <div className="rounded-lg h-full">
                  {page === 0 &&
                    paradas &&
                    paradas[directions[saida]] !== undefined && (
                      <div className="">
                        

                        <h3 className="flex w-full font-medium mb-2 bg-white sticky top-0 p-2 ">
                          Paradas
                          <span className="bg-yellow-500 text-sm p-1 rounded-md ml-2">
                            {paradas[directions[saida]].length}
                          </span>
                          <span className="bg-blue-100 flex items-center justify-center mx-1 cursor-pointer">
                            <Compartilhar className="h-4 font-semibold" />
                          </span>
                        </h3>
                        <div className='shadow-inner p-4 max-h-[500px] overflow-y-scroll'>
                        {paradas[directions[saida]].map((p, i) =>
                          location_label(
                            p,
                            i + 1 < paradas[directions[saida]].length
                          )
                        )}
                      </div>
                      </div>
                    )}
                  {page === 1 ? (
                    error_itinerarios ? (
                      <Error
                      error={error_itinerarios}
                      imagesrc={'./explorar.png'}
                      />
                    ) : (
                      <>
                        
                        <Rotas
                        n_itinerario={
                          codItinerarios.itinerarios[directions[saida]]
                        }
                        paradas={paradas[directions[saida]]}
                        />
                      </>
                    )
                  ) : (
                    <></>
                  )}
                  {page === 2 && (
                    <Horarios
                    props={{ line, handle_exit, directions, saida, setSaida }}
                    />
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      
      </div>
    </>
  )
}

const location_label = (p, hasline) => {
  return (
    <Link to={`/paradas/${p.cod}` }>
    <div className="flex flex-row gap-2  ">
      <div className="flex flex-col items-center">
        <div
          className={`flex flex-row items-center justify-center text-center rounded-full text-white w-8 h-8 ${hasline ? 'bg-red-500' : 'bg-red-700'}`}
        >
          <PinoLocalizacao className="h-4" />
        </div>
        {hasline && (
          <div className="border border-t-0 border-b-0 w-0 h-8 border-red-300 border-dashed"></div>
        )}
      </div>
      <div className="font-medium h-8">
        <h2 className="text-sm font-semibold flex group ">
          {p.end}
          <a
            className="text-xs hidden group-hover:flex text-gray-400 flex items-center hover:underline hover:text-gray-600 font-medium"
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
  )
}

const FavButtonLinha = ({ linha }) => {
  const store = useLinhasStore()
  const notify = useToastStore((s) => s.notify)
  if (!linha) return null
  const isFav = store.isFavLinha(linha.sgl)
  return (
    <button
      onClick={(e) => {
        e.stopPropagation()
        const adding = !isFav
        store.toggleFavLinha(linha)
        notify(
          adding
            ? `Linha ${linha.sgl} adicionada aos favoritos`
            : `Linha ${linha.sgl} removida dos favoritos`,
          'success'
        )
      }}
      className={`flex items-center justify-center bg-gray-100 rounded-md md:rounded-full p-2 w-8 h-8 md:w-10 md:h-10 aspect-square cursor-pointer hover:bg-gray-200 hover:border hover:border-gray-500 ${isFav ? 'text-yellow-500' : 'text-gray-400'}`}
      title={isFav ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
    >
      <Estrela className={`h-5 w-5 ${isFav ? 'fill-yellow-500' : ''}`} />
    </button>
  )
}

function Rotas({ n_itinerario, paradas }) {
let itinerarios = []
const apiurl = url + `/itinerarios/${n_itinerario}`
const { loading, data: itinerarioAtivo, error } = useFetch(apiurl)

const MapFly = ({ props }) => {
  const mapinstance = useMap()
  useEffect(() => {
    mapinstance.fitBounds(props.map((i) => [i.coordY, i.coordX]))
  }, [props])
}
console.log(itinerarioAtivo)
if (
  itinerarioAtivo !== undefined &&
  itinerarioAtivo['itinerarios'] !== undefined
) {
  itinerarios = itinerarioAtivo['itinerarios']
}
console.log(itinerarioAtivo)

if (loading) {
  return <BarLoading />
}
if (error) {
  return <Error error={error} imagesrc={'./explorar.png'} />
}


if (itinerarioAtivo !== undefined && itinerarios.length !== 0) {
return (
<div className="rounded-md overflow-hidden h-fit">
<MapContainer
  className="max-h-96 rounded-md shadow-md"
  center={[-12.254463237869844, -38.960094451904304]}
  zoom={13}
  style={{ height: '', width: '100%' }}
>
<TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
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
<Marker
icon={SquareIcon}
position={[
itinerarios[itinerarios.length - 1].coordY,
itinerarios[itinerarios.length - 1].coordX,
]}
/>
{paradas
.filter((p) => p.y !== undefined && p.x !== undefined)
.map((p) => {
return (
<Marker
key={p.cod}
icon={BusStopIconOrangeSmall}
opacity={1}
options={{
color: '#ff0000',
}}
position={[p.y, p.x]}
>
    <Popup>
      <a href={`/paradas/${p.cod}`}>
        {p.desc}
    </a>
    </Popup>
</Marker>
)
})}

<CircleMarker
pathOptions={{ color: 'black' }}
radius={8}
center={[itinerarios[0].coordY, itinerarios[0].coordX]}
/>
<MapFly props={itinerarios} />
</>
</MapContainer>
</div>
)
} else {
return <BarLoading />
}
}
