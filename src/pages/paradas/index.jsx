
import { useEffect, useRef, useState } from 'react'
import Navbar from '../../componentes/navbar'
import url from '../../utils/urls.js'
import { useFetch } from '../../hooks/useFetch.jsx'
import Error from '../../componentes/error.jsx'
import { BarLoading } from '../../componentes/loading.jsx'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Estrela, Lupa, Onibus, PinoLocalizacao, Seta } from '../../componentes/icons.jsx'
import { Helmet } from 'react-helmet'
import {useLinhasStore} from "../../stores/linhaStore"
import {useStops} from "../../hooks/useStops"


export const Paradas = () => {
  const [page, setPage] = useState(0)
  const [line, setline] = useState(0)
  const [saida, setSaida] = useState(0)
  const [params] = useSearchParams()
  const name = params.get('name')
  const [search, SetSearch] = useState(name)
  const inputRef = useRef(null)
  const navigate = useNavigate()
  const tab = params.get('tab')
  const {
    loading,
    stops: paradas,
    error,
  } = useStops();

  useEffect(() => {
    inputRef.current.value = name;
  }, [name])


  const HandleChange = () => {
    SetSearch(inputRef.current.value.toUpperCase().trim())
  }

  const HandleDeleteSearch = () => {
    SetSearch(null)
    inputRef.current.value = ''
  }
  if (error) {
    return (
      <>
        <Navbar page={'linhas'} />
        <Error error={error} imagesrc={'./explorar.png'} />
      </>
    )
  }

  const handleOpen = (stop) => {
    navigate(`/paradas/${stop.cod}`)
  }

  const handle_exit = () => {

    navigate("/linhas/" )
  }


  return (
    <>
    <Helmet>
      <title>Paradas de Ônibus de Feira de Santana - BA</title>
    
      <meta
        name="description"
        content="Consulte as paradas de ônibus de Feira de Santana - BA. Encontre localização, linhas atendidas, itinerários e informações para planejar sua viagem."
      />
    
      <link
        rel="canonical"
        href="https://feirabus.vercel.app/paradas"
      />
    
      <meta
        property="og:title"
        content="Paradas de Ônibus de Feira de Santana - BA"
      />
    
      <meta
        property="og:description"
        content="Encontre paradas de ônibus, linhas atendidas, localização e informações atualizadas do transporte público de Feira de Santana."
      />
    
      <meta
        property="og:image"
        content="https://feirabus.vercel.app/logo_feirabus.png"
      />
    
      <meta
        property="og:type"
        content="website"
      />
    
      <meta
        property="twitter:card"
        content="summary_large_image"
      />
    
      <meta
        property="twitter:title"
        content="Paradas de Ônibus de Feira de Santana - BA"
      />
    
      <meta
        property="twitter:description"
        content="Consulte as paradas de ônibus de Feira de Santana, descubra quais linhas passam em cada ponto e planeje sua viagem."
      />
    
      <meta
        property="twitter:image"
        content="https://feirabus.vercel.app/logo_feirabus.png"
      />
      <meta name="robots" content="index,follow" />
      <meta name="author" content="FeiraBus" />
    </Helmet>
   
      <Navbar page={'paradas'} />
      <div className="w-full mx-auto text-left max-w-[1200px] ">
        <div className="label h-fit">
          <div className="flex flex-col md:flex-row w-full items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-sky-500 to-purple-500 pl-2 w-fit">
                Paradas
              </h1>
              <h3 className="text-sm text-gray-500 font-medium mb-2 pl-2">
                Encontre e explore as paradas de ônibus de Feira de Santana
              </h3>
            </div>
            <div
              style={{ transition: 'all 1s' }}
              className="flex flex-row items-center gap-2 sticky bg-white top-0 z-10 w-full md:w-1/2 px-2 md:px-8 md:min-h-12 md:mt-8 md:mb-8 rounded-md"
            >
              <label
                htmlFor={'search'}
                className={`${
                  inputRef.current !== null && inputRef.current.value
                    ? 'z-10 bg-white top-2 absolute ml-4 mdd:inset-x-1/4 text-xs font-semilight text-purple-800 font-medium w-fit mb-2 px-1'
                    : 'hidden'
                }`}
              >
                Pesquisar código ou nome da parada
              </label>
              <div className="relative w-full">
                <span className="absolute pl-3 text-gray-400 h-full flex items-center z-30">
                  <Lupa />
                </span>
                <input
                  name="search"
                  id="search"
                  ref={inputRef}
                  onChange={HandleChange}
                  className={`border border-1 border-gray-200 rounded-md w-full pl-10 pr-4 h-10 text-sm font-medium focus:outline focus:outline-offset-1 focus:outline-gray-300 sticky w-full top-0 mx-auto m-4 shadow-md rounded-md   ${inputRef.current !== null && inputRef.current.value ? 'border-purple-700' : ''}`}
                  placeholder="Pesquisar código ou nome da linha"
                  type="search"
                  maxLength={30}
                ></input>
              </div>
              {inputRef.current && inputRef.current.value && (
                <button
                  onClick={HandleDeleteSearch}
                  className="h-10 px-4 rounded-md border border-2 border-red-500 text-red-500  mr-2"
                >
                  delete
                </button>
              )}
            </div>
          </div>
        </div>
        {loading ? <BarLoading /> : <></>}
        <div className='flex flex-col gap-2'>
        {paradas && (Object.keys(paradas).length > 0) ?
            Object.values(paradas).filter(p =>
              p.desc?.toUpperCase().includes(search?.toUpperCase()) ||
              p.end?.toUpperCase().includes(search?.toUpperCase())
            ).slice(0, 30).map(
            p => <StopCard stop={p} handleClick={handleOpen} / >
          )

          :<p>sem paradas </p>
        }
            </div>
        {page !== 0 && (
          <div
            className="h-[100dvh] w-screen z-10 absolute opacity-70 bg-slate-800 left-0 top-0"
            onClick={handle_exit}
            
          >
          </div>
        )}

        <div className="flex flex-row flex-wrap gap-2 px-2 max-h-screen overflow-y-scroll">
     
         
        </div>
      </div>
    </>
  )
}

const StopCard = ({ stop, handleClick }) => {
  return (
    <>
      <div
        className={`border border-b-1 border-gray-300 min-h-12 md:min-h-16 w-full rounded-lg px-2 md:px-4 border-l-purple-800 border-l-4 border-t-purple-800 border-t-1 p-1 `}
      >
        <div className="flex flex-row gap-1 md:gap-2 h-full items-center ">
          <div className="p-1 md:px-2 border text-purple-800 border-purple-800 rounded-md text-base  font-bold text-center flex items-center gap-2">
            <span>
              <PinoLocalizacao className="" />
            </span>
            {stop.cod}
          </div>
          <div className="font-medium text-sm md:text-base truncate w-full">
            {stop.desc}
          </div>
          <div className=" flex items-center justify-center h-8 min-w-16 w-1/6 overflow-hidden">
            <button
              className=" h-full bg-purple-800 px-2 md:py-1 rounded-md text-white font-semibold leading-4 text-xs flex flex-col md:flex-row items-center "
              onClick={()=>handleClick(stop)}
            >
              Detalhes{' '}
              <span className="">
                {' '}
                <Seta className="h-4" />
              </span>
            </button>
          </div>
        </div>
      </div>
    </>
  )
}