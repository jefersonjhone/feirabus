import { useEffect, useRef, useState } from 'react'
import { LineDetail } from '../componentes/LinhaDetail'
import Navbar from '../componentes/navbar'
import url from '../utils/urls.js'
import { useFetch } from '../hooks/useFetch.jsx'
import Error from '../componentes/error.jsx'
import { BarLoading } from '../componentes/loading.jsx'
import { useNavigate, useSearchParams } from 'react-router-dom'

const setinha = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    class="lucide lucide-arrow-right mx-1 h-3 w-3 text-muted-foreground"
  >
    <path d="M5 12h14"></path>
    <path d="m12 5 7 7-7 7"></path>
  </svg>
)
const onibus = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    class="lucide lucide-clock h-4 w-4 text-route-purple"
  >
    <circle cx="12" cy="12" r="10"></circle>
    <polyline points="12 6 12 12 16 14"></polyline>
  </svg>
)
const relogio = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    class="lucide lucide-clock h-4 w-4 text-route-purple"
  >
    <circle cx="12" cy="12" r="10"></circle>
    <polyline points="12 6 12 12 16 14"></polyline>
  </svg>
)
const location = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    class="lucide lucide-map-pin mr-2 h-4 w-4"
  >
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
    <circle cx="12" cy="10" r="3"></circle>
  </svg>
)

function LinhasFiltered(linhas, value, handleSetPage) {
  if (linhas !== undefined && linhas.length > 0) {
    if (value === null) {
      return linhas.map((linha) => (
        <CardLinhas key={linha.cod} props={{ linha, handleSetPage }} />
      ))
    }
    return linhas
      .filter((li) => li.sgl.includes(value) || li.nom.includes(value))
      .map((linha) => (
        <CardLinhas key={linha.code} props={{ linha, handleSetPage }} />
      ))
  }
}

export const Rotas = () => {
  const [page, setPage] = useState(0)
  const [line, setline] = useState(0)
  const [saida, setSaida] = useState(0)
  const inputRef = useRef(null)
  const [search, SetSearch] = useState(null)
  const [params] = useSearchParams()
  const navigate = useNavigate()

  const {
    loading: loading,
    data: linhas,
    error: error,
  } = useFetch(url + '/linhas/')
  useEffect(() => {
    if (!params.get('linha')) return
    if (page === 1) return
    if (linhas) {
      const line_param = linhas.filter((l) => l.sgl === params.get('linha'))
      if (line_param) {
        handleSetPage(line_param[0], 1)
        console.log('set param')
      }
    }
  })

  const handleSetPage = (line, page) => {
    setline(line)
    setPage(page)
  }
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

  const handle_open = (line, page) => {
    params.set('linha', line.sgl)
    navigate({ search: params.toString() }, { replace: true })
    handleSetPage(line, page)
  }

  const handle_exit = () => {
    params.delete('linha')
    navigate({ search: params.toString() }, { replace: true })
    handleSetPage(null, 0)
  }

    <button
    type="submit"
    className="flex flex-row items-center gap-2 bg-purple-700 p-2 min-w-24 rounded-md text-white font-medium hover:bg-purple-800"
  >
    <span>{relogio()}</span>
    Buscar
  </button>

  return (
    <>
      <Navbar page={'linhas'} />
      <div className="w-full mx-auto text-left max-w-[1200px] ">
        <div className="label h-fit">
          <div className="flex flex-row w-full items-center justify-center">
            <div
              style={{ transition: 'all 1s' }}
              className="flex sticky bg-white top-0 z-10 w-full md:w-1/2 px-8 flex flex-col min-h-12 md:mt-8 md:mb-8 rounded-md"
            >
              <label
                htmlFor={'search'}
                className={`${
                  inputRef.current !== null && inputRef.current.value
                    ? 'z-10 bg-white top-2 absolute ml-4 mdd:inset-x-1/4 text-xs font-semilight text-purple-800 font-medium h-6 w-fit mb-2 px-1'
                    : 'hidden'
                }`}
              >
                Pesquisar código ou nome da linha
              </label>
              <div className="relative">
                <span className="absolute pl-3 text-gray-400 h-full flex items-center z-30">
                  {relogio()}
                </span>
                <input
                  name="search"
                  id="search"
                  ref={inputRef}
                  onChange={HandleChange}
                  className={`border border-1 border-gray-200 rounded-md w-full pl-10 h-10 text-sm font-medium focus:outline focus:outline-offset-1 focus:outline-gray-300   sticky w-full top-0 mx-auto h-12  m-4 shadow-md rounded-md border  ${inputRef.current !== null && inputRef.current.value ? 'border-purple-700' : ''}`}
                  placeholder="Pesquisar código ou nome da linha"
                  type="search"
                  maxLength={20}
                ></input>
              </div>
            </div>
            {inputRef.current && inputRef.current.value ? (
              <button
                onClick={HandleDeleteSearch}
                className="h-12 w-32 rounded-md border border-2 border-red-500 text-red-500  mr-2"
              >
                {' '}
                delete{' '}
              </button>
            ) : (
              <></>
            )}
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-purple-500 pl-2 w-fit">
            Linhas
          </h1>
          <h3 className="text-sm text-gray-500 font-medium mb-2 pl-2">
            Encontre e explore as linhas de ônibus da sua região
          </h3>
        </div>
        {loading ? <BarLoading /> : <></>}
        {page !== 0 ? (
          <div
            className="h-[100dvh] w-screen z-10 absolute opacity-70 bg-slate-800 left-0 top-0"
            onClick={handle_exit}
          >
            {' '}
          </div>
        ) : (
          <></>
        )}
        <div className="flex flex-row flex-wrap gap-2 max-h-screen overflow-y-scroll">
          {page === 1 ? (
            <div className="h-[100dvh] w-screen absolute left-0 top-0 flex flex-col items-center justify-end md:justify-center pb-4">
              <LineDetail props={{ line, handle_exit }} />
            </div>
          ) : (
            <></>
          )}
          {LinhasFiltered(linhas, search, handle_open)}
        </div>
      </div>
    </>
  )
}

export const CardLinhas = ({ props }) => {
  const [saida, setSaida] = useState(0)
  const sentidos = ['UEFS', 'TERMINAL CENTRAL']
  const { linha, handleSetPage } = props
  return (
    <>
      <div className="flex flex-col w-full max-w-[500px] max-h-[400px] mb-4 border border-1 border-gray-400 rounded-lg p-2 md:p-4 gap-1 mx-auto border-t-4 border-t-purple-800 ">
        <div className="flex flex-row gap-2 items-center sticky top-0 border-b shadow-sm bg-white py-1">
          <div className="w-10 h-10 sm:h-12 sm:w-12 aspect-square bg-purple-800 rounded-full text-white font-bold text-center flex items-center justify-center">
            {linha.sgl}
          </div>
          <div className="font-bold truncate ">{linha.nom}</div>
        </div>
        <div className="flex flex-col w-full text-center mx-auto border border-gray-400 py-1 items-center px-2 rounded-lg text-sm leading-4 font-medium">
          Saída
          <div className="flex flex-row w-full text-center mx-auto bg-gray-200 py-1 items-center px-2 rounded-lg text-sm leading-4 font-medium ">
            {sentidos.map((e, i) =>
              i === saida ? (
                <div
                  key={i}
                  className="bg-white w-1/2 rounded-lg shadow-md p-1 text-sm"
                >
                  {e}
                </div>
              ) : (
                <div
                  key={i}
                  className="w-1/2 text-gray-400 cursor-pointer"
                  onClick={() => {
                    setSaida(i)
                  }}
                >
                  {e}
                </div>
              )
            )}
          </div>
        </div>
        <div className="text-left mt-2 text-sm font-medium leading-4 ">
          <h3 className="flex gap-2 items-center text-left pb-1 ">
            <span className="text-blue-600">{relogio()}</span> Horários
          </h3>
          <div className="ml-2 flex flex-row gap-1">
            <div className="text-gray-500">Dia util:</div>
            <div className=""> 5:30 AM - 7:15 PM</div>
          </div>
          <div className="ml-2 flex flex-row gap-1">
            <div className="text-gray-500">Sábado:</div>
            <div className=""> 5:30 AM - 4:15 PM</div>
          </div>
          <div className="ml-2 flex flex-row gap-1">
            <div className="text-gray-500">Domingo:</div>
            <div className=""> 7:30 AM - 1:15 PM</div>
          </div>
        </div>
        <div className="text-left text-sm font-medium">
          <div>
            <h3 className="flex items-center pb-1">
              <span className="text-purple-600">{location()}</span>
              Paradas
            </h3>
            <div className="text-gray-700 leading-4 overflow-y-scroll max-h-24 px-2">
              <h4 className=" flex-wrap flex flex-row items-center shadow-inner py-1">
                Av. Transnordestina{' '}
                <span className="text-red-700">{setinha()}</span>
                Av. Frei Felix de Pacauba, 3550{' '}
                <span className="text-red-700">{setinha()}</span>
                Av. Frei Felix de Pacauba, 2882-2974{' '}
                <span className="text-red-700">{setinha()}</span>
                Av. Transnordestina{' '}
                <span className="text-red-700">{setinha()}</span>
                Av. Frei Felix de Pacauba, 3550{' '}
                <span className="text-red-700">{setinha()}</span>
                Av. Frei Felix de Pacauba, 2882-2974{' '}
                <span className="text-red-700">{setinha()}</span>
                Av. Transnordestina{' '}
                <span className="text-red-700">{setinha()}</span>
                Av. Frei Felix de Pacauba, 3550{' '}
                <span className="text-orange-900">{setinha()}</span>
                Av. Frei Felix de Pacauba, 2882-2974{' '}
                <span className="text-red-700">{setinha()}</span>
              </h4>
            </div>
          </div>
        </div>

        <div
          onClick={() => {
            handleSetPage(linha, 1)
          }}
          className="flex flex-row items-center justify-center mx-auto bg-purple-800 w-full h-8 py-4 text-white font-medium rounded-lg mt-2 hover:bg-white hover:text-blue-800 hover:border hover:border-blue-800 hover:border-2"
        >
          view details
        </div>
      </div>
    </>
  )
}
