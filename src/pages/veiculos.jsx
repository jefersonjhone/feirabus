import { useEffect, useRef, useState } from 'react'
import Navbar from '../componentes/navbar'
import url from '../utils/urls.js'
import { useFetch } from '../hooks/useFetch.jsx'
import { BarLoading } from '../componentes/loading.jsx'
import Error from '../componentes/error.jsx'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { VeiculosCard } from '../componentes/veiculos.jsx'
import { useLinhasStore } from '../stores/linhaStore'
import { useToastStore } from '../stores/toastStore'
import { Estrela, Lupa, Seta, Fechar, Onibus } from '../componentes/icons.jsx'

import { Helmet } from 'react-helmet'

export const Veiculos = () => {
  const [page, setPage] = useState(0)
  const [line, setline] = useState(0)
  const inputRef = useRef(null)
  const [search, SetSearch] = useState(null)
  const {
    loading,
    data: linhas,
    error,
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
      <Helmet>
        <title>Veículos em Tempo Real | FeiraBus</title>
        <meta name="description" content="Acompanhe a localização dos ônibus de Feira de Santana em tempo real." />
      </Helmet>
      <Navbar page={'veiculos'} />
      <div className="text-left max-w-[1200px] mx-auto w-full px-2 relative z-0">
        <div className="label h-fit">
          <div className="flex flex-col md:flex-row w-full items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-sky-500 to-purple-500 pl-2 w-fit">
                Localização dos veículos
              </h1>
              <h3 className="text-sm text-gray-500 font-medium mb-2 ml-2">
                Acompanhe seus ônibus em tempo real
              </h3>
            </div>
            <div className="flex flex-row items-center gap-2 sticky bg-white top-0 z-10 w-full md:w-1/2 px-2 md:px-8 md:min-h-12 md:mt-8 md:mb-8 rounded-md">
              <div className="relative w-full">
                <span className="absolute pl-3 text-gray-400 h-full flex items-center z-30">
                  <Lupa />
                </span>
                <input
                  name="search"
                  id="search"
                  ref={inputRef}
                  onChange={HandleChange}
                  className={`border border-gray-200 rounded-lg w-full pl-10 pr-4 h-10 text-sm font-medium focus:outline focus:outline-offset-1 focus:outline-gray-300 shadow-sm ${inputRef.current?.value ? 'border-purple-700' : ''}`}
                  placeholder="Pesquisar código ou nome da linha"
                  type="search"
                  maxLength={20}
                />
              </div>
              {inputRef.current && inputRef.current.value && (
                <button
                  onClick={HandleDeleteSearch}
                  className="h-10 px-4 rounded-lg border-2 border-red-500 text-red-500 text-sm font-medium whitespace-nowrap"
                >
                  limpar
                </button>
              )}
            </div>
          </div>
        </div>
        {loading ? (
          <BarLoading />
        ) : error ? (
          <Error error={error} imagesrc={'./explorar.png'} />
        ) : (
          <div className="relative">
            {page !== 0 && (
              <div
                className="h-screen w-screen z-10 fixed opacity-70 bg-slate-800 left-0 top-0"
                onClick={handle_exit}
              />
            )}
            <div className="flex flex-col gap-2 pb-8">
              {LinhasFiltered(linhas, search, handle_open)}
            </div>
            {page === 1 && (
              <div className="h-screen w-screen fixed left-0 top-0 flex flex-col items-center justify-end md:justify-center pb-4 z-20">
                <div className="w-full h-3/4 md:w-2/3 lg:w-1/2 md:h-3/4 border border-t-8 border-t-purple-800 rounded-xl p-2 bg-white z-10 flex flex-col">
                  <div className="flex flex-row items-center gap-2 mb-2 sm:px-4">
                    <div className="w-12 h-12 aspect-square bg-purple-800 rounded-md text-white font-bold text-center flex items-center justify-center">
                      {line.sgl}
                    </div>
                    <div className="font-semibold truncate w-full text-sm">
                      {line.nom}
                    </div>
                    <Link to={`/linhas/${line.sgl}`}>
                      <div className="flex items-center justify-center bg-gray-100 rounded-full p-2 w-10 h-10 aspect-square cursor-pointer hover:bg-gray-200 hover:border hover:border-gray-500">
                        <Seta className="h-5" />
                      </div>
                    </Link>
                    <div
                      className="bg-gray-100 rounded-full p-2 w-10 h-10 aspect-square cursor-pointer hover:bg-gray-200 hover:border hover:border-gray-500"
                      onClick={handle_exit}
                    >
                      <Fechar className="w-full h-full" />
                    </div>
                  </div>
                  <div className="flex-1 min-h-0">
                    <VeiculosCard linha={line} />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  )
}

function LinhasFiltered(linhas, value, handleSetPage) {
  if (linhas !== undefined) {
    if (value === null) {
      return linhas.map((li) => <LineCardVeiculo key={li.cod} linha={li} setPage={handleSetPage} />)
    }
    return linhas
      .filter((li) => li.sgl.includes(value) || li.nom.includes(value))
      .map((li) => <LineCardVeiculo key={li.cod} linha={li} setPage={handleSetPage} />)
  }
}

const LineCardVeiculo = ({ linha, setPage }) => {
  const isFav = useLinhasStore((s) => s.isFavLinha(linha.sgl))
  const toggleFav = useLinhasStore((s) => s.toggleFavLinha)
  const notify = useToastStore((s) => s.notify)

  return (
    <div className="border border-b-1 border-gray-300 min-h-12 md:min-h-16 w-full rounded-lg px-2 md:px-4 border-l-purple-800 border-l-4 border-t-purple-800 border-t-1">
      <div className="flex flex-row gap-1 md:gap-2 h-full items-center">
        <button
          onClick={(e) => {
            e.stopPropagation()
            const adding = !isFav
            toggleFav(linha)
            notify(
              adding
                ? `Linha ${linha.sgl} adicionada aos favoritos`
                : `Linha ${linha.sgl} removida dos favoritos`,
              'success'
            )
          }}
          className={`hidden sm:flex items-center justify-center h-8 w-8 ${isFav ? 'text-yellow-500' : 'text-gray-300 hover:text-yellow-400'}`}
        >
          <Estrela className={`h-5 w-5 ${isFav ? 'fill-yellow-500' : ''}`} />
        </button>
        <div className="p-1 md:px-2 border text-purple-800 border-purple-800 rounded-md text-base font-bold text-center flex items-center gap-2">
          <Onibus />
          {linha.sgl}
        </div>
        <div className="font-medium text-sm md:text-base truncate w-full">{linha.nom}</div>
        <button
          className="flex items-center justify-center h-8 min-w-16 bg-purple-800 px-2 rounded-md text-white font-semibold leading-4 text-xs"
          onClick={() => setPage(linha, 1)}
        >
          Mapa <Seta className="h-4" />
        </button>
      </div>
    </div>
  )
}
