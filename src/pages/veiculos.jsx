import { useEffect, useMemo, useRef, useState } from 'react'
import Navbar from '../componentes/navbar'
import { useLines } from '../hooks/useLines'
import Error from '../componentes/error.jsx'
import { SkeletonList } from '../componentes/skeleton.jsx'
import EmptyState from '../componentes/empty-state.jsx'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { VeiculosCard } from '../componentes/veiculos.jsx'
import { useLinhasStore } from '../stores/linhaStore'
import { useToastStore } from '../stores/toastStore'
import { Star, X, MagnifyingGlass, Bus, CaretRight } from '@phosphor-icons/react'
import { motion } from 'motion/react'
import { Helmet } from 'react-helmet'
import ShareDialog from '../componentes/share-dialog.jsx'
import { trackEvent } from '../utils/analytics'

export const Veiculos = () => {
  const [page, setPage] = useState(0)
  const [line, setline] = useState(0)
  const inputRef = useRef(null)
  const [search, SetSearch] = useState(null)
  const {
    loading,
    lines: lines_obj,
    error,
  } = useLines()
  const lines = Object.values(lines_obj)
  const favoritosLinhas = useLinhasStore((s) => s.favoritosLinhas)
  const favSet = new Set(favoritosLinhas.map(f => f.sgl))
  const [params] = useSearchParams()
  const navigate = useNavigate()

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

  const HandleChange = () => {
    SetSearch(inputRef.current.value.toUpperCase().trim())
    trackEvent('buscar', { type: 'linha', term: inputRef.current.value.toUpperCase().trim() })
    document.getElementById('veiculos-list')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const HandleDeleteSearch = () => {
    SetSearch(null)
    inputRef.current.value = ''
  }

  useEffect(() => {
    if (!params.get('linha')) return
    if (page === 1) return
    if (lines.length) {
      const line_param = lines.filter((l) => l.sgl === params.get('linha'))
      if (line_param.length) {
        handleSetPage(line_param[0], 1)
      }
    }
  })

  const handleSetPage = (line, page) => {
    setline(line)
    setPage(page)
  }

  const handle_open = (line, page) => {
    trackEvent('navegar_detalhe', { type: 'veiculo', id: line.sgl })
    params.set('linha', line.sgl)
    navigate({ search: params.toString() }, { replace: true })
    handleSetPage(line, page)
  }

  const handle_exit = () => {
    params.delete('linha')
    navigate({ search: params.toString() }, { replace: true })
    handleSetPage(null, 0)
  }

  if (error) {
    return (
      <>
        <Navbar page="veiculos" />
        <Error error={error} imagesrc="./explorar.png" />
      </>
    )
  }

  return (
    <>
      <Helmet>
        <title>Veículos em Tempo Real | FeiraBus</title>
        <meta name="description" content="Acompanhe a localização dos ônibus de Feira de Santana em tempo real." />
      </Helmet>
      <Navbar page="veiculos" />
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
                Veículos
              </h1>
              <h3 className="text-xs md:text-sm text-slate-500 mt-0.5">
                Acompanhe a localização dos ônibus em tempo real
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

        {loading ? (
          <SkeletonList count={5} />
        ) : (
          <div className="relative">
            {page !== 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.7 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="h-screen w-screen z-10 fixed bg-slate-800 left-0 top-0"
                onClick={handle_exit}
              />
            )}
            <div id="veiculos-list" className="flex flex-col gap-2 px-2 mt-4 md:mt-8">
              {!loading && search !== null && filteredLines.length > 0 && (
                <p className="text-sm text-gray-500 px-1">
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
              {filteredLines.map((li, i) => (
                <LineCardVeiculo key={li.cod} linha={li} setPage={handle_open} index={i} />
              ))}
            </div>
            {page === 1 && (
              <div className="h-screen w-screen fixed left-0 top-0 flex flex-col items-center justify-end md:justify-center pb-4 z-20 pointer-events-none">
                <motion.div
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  className="w-full h-3/4 md:w-2/3 lg:w-1/2 md:h-3/4 p-[3px] rounded-xl bg-black/[0.03] ring-1 ring-black/[0.06] pointer-events-auto"
                >
                  <div className="h-full rounded-[calc(0.75rem-3px)] bg-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.8)] flex flex-col">
                    <div className="shrink-0 h-1 bg-purple-800 rounded-full mx-3 mt-3" />
                    <div className="flex flex-col p-2 min-h-0 flex-1">
                      <div className="flex flex-row items-center gap-2 mb-2 sm:px-4">
                        <div className="w-12 h-12 aspect-square bg-purple-800 rounded-[10px] text-white font-bold text-center flex items-center justify-center shrink-0">
                          {line.sgl}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold truncate w-full text-sm text-[#111]">
                            {line.nom}
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <Link to={`/linhas/${line.sgl}`} className="flex flex-col items-center gap-0.5">
                              <div className="flex items-center justify-center bg-[#F7F6F3] rounded-md p-1.5 w-7 h-7 cursor-pointer hover:bg-[#EAEAEA] transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)]">
                                <CaretRight className="h-3.5 w-3.5 text-[#787774]" />
                              </div>
                              <span className="text-[8px] text-[#787774] leading-none">Detalhes</span>
                            </Link>
                            <ShareDialog
                              compact
                              title={`Linha ${line.sgl} - ${line.nom}`}
                              url={window.location.href}
                            />
                          </div>
                        </div>
                        <button
                          className="flex items-center justify-center bg-[#FDEBEC] rounded-[10px] p-2 w-9 h-9 cursor-pointer hover:bg-[#F5D5D6] transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] shrink-0 active:scale-[0.92]"
                          onClick={handle_exit}
                        >
                          <X className="h-4 w-4 text-[#9F2F2D]" />
                        </button>
                      </div>
                      <div className="flex-1 min-h-0 overflow-hidden rounded-lg">
                        <VeiculosCard linha={line} />
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  )
}

const LineCardVeiculo = ({ linha, setPage, index = 0 }) => {
  const isFav = useLinhasStore((s) => s.isFavLinha(linha.sgl))
  const toggleFav = useLinhasStore((s) => s.toggleFavLinha)
  const notify = useToastStore((s) => s.notify)

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      <div
        onClick={() => setPage(linha, 1)}
        className="border border-gray-200 min-h-14 md:min-h-[4.5rem] w-full rounded-lg px-3 md:px-5 py-2 shadow-sm hover:shadow-md transition-shadow cursor-pointer active:bg-purple-50/30"
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
            className={`flex items-center justify-center h-11 w-11 shrink-0 ${isFav ? 'text-yellow-500' : 'text-gray-300 hover:text-yellow-400'}`}
            aria-label={isFav ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
          >
            <Star weight={isFav ? 'fill' : 'regular'} className={`h-5 w-5 ${isFav ? 'text-yellow-500' : ''}`} />
          </button>
          <div className="p-1 md:px-2 border text-purple-700 border-purple-200 rounded-md text-base font-bold text-center flex items-center gap-2 shrink-0">
            <Bus className="h-5 w-5" />
            {linha.sgl}
          </div>
          <div className="font-medium text-sm md:text-base truncate w-full">{linha.nom}</div>
          <CaretRight className="h-5 w-5 text-gray-400 shrink-0" />
        </div>
      </div>
    </motion.div>
  )
}
