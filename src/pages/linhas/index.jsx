import { useEffect, useMemo, useRef, useState } from 'react'
import { LineDetail } from './linha.id'
import Navbar from '../../componentes/navbar'
import url from '../../utils/urls.js'
import Error from '../../componentes/error.jsx'
import { SkeletonList } from '../../componentes/skeleton.jsx'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Star, X, MagnifyingGlass, Bus, CaretRight } from '@phosphor-icons/react'
import { Helmet } from 'react-helmet'
import { motion, useReducedMotion } from 'motion/react'
import EmptyState from '../../componentes/empty-state.jsx'
import {useLinhasStore} from "../../stores/linhaStore"
import { useToastStore } from '../../stores/toastStore'
import { useLines } from '../../hooks/useLines'
import { trackEvent } from '../../utils/analytics'


export const Linhas = () => {
  const [page, setPage] = useState(0)
  const [line, setline] = useState(0)
  const [search, SetSearch] = useState(null)
  const inputRef = useRef(null)
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const {
    loading,
    lines:lines_obj,
    error,
  } = useLines();
  const lines = Object.values(lines_obj)
  const favoritosLinhas = useLinhasStore((s) => s.favoritosLinhas)
  const favSet = new Set(favoritosLinhas.map(f => f.sgl))

  const filteredLines = useMemo(() => {
    if (!lines || lines.length === 0) return []
    const base = search === null ? lines : lines.filter((li) => li.sgl.includes(search) || li.nom.includes(search))
    return [...base].sort((a, b) => {
      const aFav = favSet.has(a.sgl) ? 0 : 1
      const bFav = favSet.has(b.sgl) ? 0 : 1
      if (aFav !== bFav) return aFav - bFav
      return a.sgl.localeCompare(b.sgl)
    })
  }, [lines, search, favoritosLinhas])

  const tab = params.get('tab')
  useEffect(() => {
    if (!params.get('linha')) return
    if (page === 1) return
    if (lines) {
      const line_param = lines.filter((l) => l.sgl === params.get('linha'))
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
    trackEvent('buscar', { type: 'linha', term: inputRef.current.value.toUpperCase().trim() })
    document.getElementById('linhas-list')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const HandleDeleteSearch = () => {
    SetSearch(null)
    inputRef.current.value = ''
  }
  if (error) {
    return (
      <>
        <Navbar page="linhas" />
        <Error error={error} imagesrc="./explorar.png" />
      </>
    )
  }

  const handleOpen = (line, page) => {
    trackEvent('navegar_detalhe', { type: 'linha', id: line.sgl })
    navigate(`/linhas/${line.sgl}`)
    handleSetPage(line, page)
  }

  const handle_exit = () => {

    navigate("/linhas/" )
  }


  return (
    <>
      <Helmet>
        <title>
          Linhas de Ônibus de Feira de Santana (BA) | Itinerários e Horários
        </title>
      
        <meta
          name="description"
          content="Consulte todas as linhas de ônibus de Feira de Santana (BA). Veja itinerários, horários, pontos de parada e informações atualizadas do transporte público municipal."
        />
      
        <meta
          name="keywords"
          content="linhas de ônibus feira de santana, ônibus feira de santana, itinerário ônibus feira de santana, horários ônibus feira de santana, transporte público feira de santana"
        />
      
        <meta name="robots" content="index,follow" />
      
        <link
          rel="canonical"
          href="https://feirabus.vercel.app/linhas"
        />
      
        <meta
          property="og:type"
          content="website"
        />
      
        <meta
          property="og:title"
          content="Linhas de Ônibus de Feira de Santana (BA)"
        />
      
        <meta
          property="og:description"
          content="Consulte itinerários, horários e pontos de parada de todas as linhas de ônibus de Feira de Santana."
        />
      
        <meta
          property="og:image"
          content="https://feirabus.vercel.app/logo_feirabus.png"
        />
      
        <meta
          property="og:url"
          content="https://feirabus.vercel.app/linhas"
        />
      
        <meta
          name="twitter:card"
          content="summary_large_image"
        />
      
        <meta
          name="twitter:title"
          content="Linhas de Ônibus de Feira de Santana (BA)"
        />
      
        <meta
          name="twitter:description"
          content="Consulte itinerários, horários e pontos de parada das linhas de ônibus de Feira de Santana."
        />
      
        <meta
          name="twitter:image"
          content="https://feirabus.vercel.app/logo_feirabus.png"
        />
      </Helmet>
      <Navbar page="linhas" />
      <div className="w-full mx-auto text-left max-w-[1200px] relative z-0">
        <div className="px-4 pt-4 md:pt-6 pb-2">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center justify-center w-8 h-8 rounded-lg text-gray-500 hover:text-purple-700 hover:bg-purple-50 transition-colors -ml-1"
              aria-label="Voltar"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            </button>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
                Linhas
              </h1>
              <h3 className="text-xs md:text-sm text-slate-500 mt-0.5">
              Consulte todas as linhas de ônibus de Feira de Santana, incluindo
              itinerários, horários e pontos de parada.
              </h3>
            </div>
          </div>
        </div>

        <div className="sticky top-0 z-10 bg-white px-4 pt-3 pb-3">
          <div className="relative w-full">
            <span className="absolute pl-3 text-gray-500 h-full flex items-center z-10">
              <MagnifyingGlass />
            </span>
            <input
              name="search"
              id="search"
              ref={inputRef}
              onChange={HandleChange}
                  className={`border border-gray-200 rounded-lg w-full pl-10 pr-10 h-11 text-sm font-medium focus:outline-none focus:shadow-md shadow-sm transition-all ${inputRef.current?.value ? 'border-purple-700 shadow-purple-50' : ''}`}
                  style={{ fontSize: 16 }}
                  placeholder="Pesquisar código ou nome da linha"
              type="search"
              maxLength={20}
            />
            {inputRef.current && inputRef.current.value && (
              <button
                onClick={HandleDeleteSearch}
                className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center justify-center w-6 h-6 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-500 transition-colors z-10"
                aria-label="Limpar pesquisa"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
        </div>
        {loading ? <SkeletonList count={6} /> : <></>}
        {page !== 0 && (
          <div
            className="h-[100dvh] w-screen z-10 absolute opacity-70 bg-slate-800 left-0 top-0"
            onClick={handle_exit}
          ></div>
        )}

        <div id="linhas-list" className="flex flex-col gap-2 px-2 mt-4 md:mt-12">
          {!loading && search !== null && filteredLines.length > 0 && (
            <p className="text-sm text-gray-500 px-1 pb-1">
              {filteredLines.length} linha(s) encontrada(s)
            </p>
          )}

          {!loading && search !== null && filteredLines.length === 0 && (
            <EmptyState
              icon={<MagnifyingGlass className="h-6 w-6" />}
              title="Nenhuma linha encontrada"
              description={`Nenhum resultado para "${search}". Tente outro código ou nome.`}
            />
          )}

          {page === 1 && (
            <div className="h-[100dvh] w-screen fixed inset-0 z-40 flex flex-col items-center justify-end md:justify-center pb-4">
              <LineDetail line={line} handle_exit={handle_exit} tab={tab} />
            </div>
          )}

          {lines !== undefined &&
            lines.length > 0 &&
            filteredLines.map((linha) => (
              <LineCard
                key={linha.cod}
                linha={linha}
                setPage={handleOpen}
              />
            ))}
        </div>
      </div>
    </>
  )
}

const LineCard = ({ linha, setPage }) => {
  const isFav = useLinhasStore((s) => s.isFavLinha(linha.sgl))
  const toggleFav = useLinhasStore((s) => s.toggleFavLinha)
  const notify = useToastStore((s) => s.notify)
  const reduced = useReducedMotion()

  return (
    <motion.div
      initial={reduced ? {} : { opacity: 0, y: 12 }}
      whileInView={reduced ? {} : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      <div
        onClick={() => setPage(linha)}
        className={`border border-gray-200 min-h-14 md:min-h-[4.5rem] w-full rounded-lg px-3 md:px-5 py-2 shadow-sm hover:shadow-md transition-shadow cursor-pointer active:bg-purple-50/30`}
      >
        <div className="flex flex-row gap-2 md:gap-3 h-full items-center">
          <button
            onClick={(e) => {
              e.stopPropagation()
              const adding = !isFav
              toggleFav(linha)
              trackEvent('favoritar', { action: adding ? 'add' : 'remove', type: 'linha', id: linha.sgl })
              notify(
                adding
                  ? `Linha ${linha.sgl} adicionada aos favoritos`
                  : `Linha ${linha.sgl} removida dos favoritos`,
                adding ? 'success' : 'info',
                adding
              )
            }}
            className={`flex items-center justify-center h-8 w-8 sm:h-8 sm:w-8 shrink-0 ${isFav ? 'text-yellow-500' : 'text-gray-300 hover:text-yellow-400'}`}
          >
            <Star weight={isFav ? 'fill' : 'regular'} className={`h-5 w-5 ${isFav ? 'text-yellow-500' : ''}`} />
          </button>
          <div className="p-1 md:px-2 border text-purple-700 border-purple-200 rounded-md text-base font-bold text-center flex items-center gap-2 shrink-0">
            <span>
              <Bus className="h-5 w-5" />
            </span>
            {linha.sgl}
          </div>
          <div className="font-medium text-sm md:text-base truncate w-full">
            {linha.nom}
          </div>
          <CaretRight className="h-5 w-5 text-gray-400 shrink-0" />
        </div>
      </div>
    </motion.div>
  )
}
