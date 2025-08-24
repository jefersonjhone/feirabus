import { useEffect, useRef, useState } from 'react'
import { HorariosDetail } from '../componentes/HorariosDetail'
import Navbar from '../componentes/navbar'
import url from '../utils/urls.js'
import { useFetch } from '../hooks/useFetch.jsx'
import { BarLoading } from '../componentes/loading.jsx'
import Error from '../componentes/error.jsx'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { VeiculosCard } from '../componentes/veiculos.jsx'

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

export const Veiculos = () => {
  const [page, setPage] = useState(0)
  const [line, setline] = useState(0)
  const inputRef = useRef(null)
  const [search, SetSearch] = useState(null)
  const {
    loading: loading,
    data: linhas,
    error: error,
  } = useFetch(url + '/linhas/')
  const [params] = useSearchParams()
  const navigate = useNavigate()

  const HandleDeleteSearch = () => {
    SetSearch(null)
    inputRef.current.value = ''
  }

  const handleSetPage = (line, page) => {
    setline(line)
    setPage(page)
  }

  const HandleChange = () => {
    SetSearch(inputRef.current.value.toUpperCase().trim())
  }
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

  return (
    <>
      <Navbar page={'veiculos'} />
      <div className="text-left max-w-[1200px] mx-auto w-full max-h-screen overflow-hidden">
        <div className="label h-fit">
          <div
            style={{ transition: 'all 1s' }}
            className="sticky bg-white md:w-1/2 mx-auto top-0 z-10 w-full px-8 flex flex-col min-h-12 md:mt-12 md:mb-8 rounded-md"
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
            Localização dos veículos
          </h1>
          <h3 className="text-sm text-gray-500 font-medium mb-2 ml-2">
            Acompanhe seus ônibus em tempo real
          </h3>
        </div>
        {loading ? (
          <BarLoading />
        ) : error ? (
          <Error error={error} imagesrc={'./explorar.png'} />
        ) : (
          <div>
            {page !== 0 && (
              <div
                className="h-screen w-screen z-10 absolute opacity-70 bg-slate-800 left-0 top-0"
                onClick={handle_exit}
              >
                {' '}
              </div>
            )}
            <div
              className={`flex flex-col items-center gap-2 border border-gray-300 max-h-[500px] h-full overflow-y-scroll p-2 pb-32 `}
            >
              {LinhasFiltered(linhas, search, handle_open)}
              {page === 1 && (
                <div className="h-screen w-screen absolute left-0 top-0 flex flex-col items-center justify-end">
                  <div className="w-full h-3/4 md:w-1/2 md:h-3/4 md:w-2/3 lg:w-1/2 md:h-1/2 bottom-100 border border-gray-300 border border-t-8 border-t-purple-800 rounded-xl p-2 bg-white z-10 ">
                    <div className="flex flex-row items-center gap-2 mb-2 sm:px-4">
                      <div className="w-12 h-12 aspect-square bg-purple-800 rounded-md text-white font-bold text-center flex items-center justify-center">
                        {line.sgl}
                      </div>
                      <div className="font-semibold truncate w-full text-sm">
                        {line.nom}
                      </div>

                      <Link to={`/linhas?linha=${line.sgl}`}>
                        <div className="flex items-center justify-center bg-gray-300 rounded-full p-1 w-10 h-10 aspect-square cursor-pointer hover:bg-gray-200 hover:border  hover:border-gray-500">
                          <svg
                            width="100"
                            height="100"
                            viewBox="0 0 64 64"
                            xmlns="http://www.w3.org/2000/svg"
                            stroke-width="2"
                            stroke="currentColor"
                            fill="none"
                          >
                            <g id="SVGRepo_bgCarrier"></g>
                            <g
                              id="SVGRepo_tracerCarrier"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            ></g>
                            <g id="SVGRepo_iconCarrier">
                              <path d="M17.94,54.81a.1.1,0,0,1-.14,0c-1-1.11-11.69-13.23-11.69-21.26,0-9.94,6.5-12.24,11.76-12.24,4.84,0,11.06,2.6,11.06,12.24C28.93,41.84,18.87,53.72,17.94,54.81Z"></path>
                              <circle cx="17.52" cy="31.38" r="4.75"></circle>
                              <path d="M49.58,34.77a.11.11,0,0,1-.15,0c-.87-1-9.19-10.45-9.19-16.74,0-7.84,5.12-9.65,9.27-9.65,3.81,0,8.71,2,8.71,9.65C58.22,24.52,50.4,33.81,49.58,34.77Z"></path>
                              <circle cx="49.23" cy="17.32" r="3.75"></circle>
                              <path d="M17.87,54.89a28.73,28.73,0,0,0,3.9.89"></path>
                              <path
                                d="M24.68,56.07c2.79.12,5.85-.28,7.9-2.08,5.8-5.09,2.89-11.25,6.75-14.71a16.72,16.72,0,0,1,4.93-3"
                                stroke-dasharray="7.8 2.92"
                              ></path>
                              <path d="M45.63,35.8a23,23,0,0,1,3.88-.95"></path>
                            </g>
                          </svg>
                          ,
                        </div>
                      </Link>

                      <div className="flex items-center justify-center bg-gray-300 rounded-full p-2 w-10 h-10 aspect-square cursor-pointer hover:bg-gray-200 hover:border  hover:border-gray-500">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          x="0px"
                          y="0px"
                          width="100"
                          height="100"
                          viewBox="0 0 50 50"
                        >
                          <path d="M 4 4 L 4 45 A 1.0001 1.0001 0 0 0 5 46 L 45 46 A 1.0001 1.0001 0 0 0 46 45 L 46 32 L 44 32 L 44 44 L 6 44 L 6 4 L 4 4 z M 37.990234 4.9902344 A 1.0001 1.0001 0 0 0 37.292969 6.7070312 L 41.585938 11 L 35.025391 11 C 24.998681 10.750465 18.501219 13.39498 14.695312 18.398438 C 10.889406 23.401895 9.8315993 30.506951 10 39.019531 A 1.0001907 1.0001907 0 1 0 12 38.980469 C 11.835401 30.660049 12.932016 24.020168 16.287109 19.609375 C 19.642203 15.198582 25.312319 12.759535 34.974609 13 L 34.988281 13 L 41.585938 13 L 37.292969 17.292969 A 1.0001 1.0001 0 1 0 38.707031 18.707031 L 45.414062 12 L 38.707031 5.2929688 A 1.0001 1.0001 0 0 0 37.990234 4.9902344 z"></path>
                        </svg>
                      </div>

                      <div
                        className="bg-gray-300 rounded-full p-2 w-10 h-10 aspect-square cursor-pointer hover:bg-gray-200 hover:border  hover:border-gray-500"
                        onClick={handle_exit}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-full h-full"
                          x="0px"
                          y="0px"
                          width="100"
                          height="100"
                          viewBox="0 0 50 50"
                        >
                          <path d="M 7.71875 6.28125 L 6.28125 7.71875 L 23.5625 25 L 6.28125 42.28125 L 7.71875 43.71875 L 25 26.4375 L 42.28125 43.71875 L 43.71875 42.28125 L 26.4375 25 L 43.71875 7.71875 L 42.28125 6.28125 L 25 23.5625 Z"></path>
                        </svg>
                      </div>
                    </div>

                    <div className="w-full max-w-[1000px] h-5/6 z-20">
                      <VeiculosCard linha={line} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  )
}

function LinhasFiltered(linhas, value, handleSetPage) {
  if (linhas !== undefined) {
    if (value === null) {
      return linhas.map((li) => lineCard(li, handleSetPage))
    }
    return linhas
      .filter((li) => li.sgl.includes(value) || li.nom.includes(value))
      .map((li) => lineCard(li, handleSetPage))
  }
}

const lineCard = (linha, setPage) => {
  return (
    <>
      <div
        className={`border border-1 border-gray-300 min-h-16 h-2 w-full rounded-lg px-2 md:px-8 border-l-purple-800 border-l-4`}
      >
        <div className="flex flex-row gap-2 h-full items-center">
          <div className="w-12 h-12 aspect-square bg-purple-800 rounded-full text-white font-bold text-center flex items-center justify-center">
            {setinha()}
            {linha.sgl}
          </div>
          <div className="font-semibold truncate w-full">{linha.nom}</div>
          <div className="h-full flex items-center">
            <button
              className="bg-white border border-2 border-purple-800 px-2 py-1 rounded-lg text-purple-800 flex items-center"
              onClick={() => {
                setPage(linha, 1)
              }}
            >
              view <span>{setinha()}</span>
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
