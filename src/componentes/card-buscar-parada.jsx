import { useRef, useState } from 'react'
import { Star, MagnifyingGlass, MapPin, CaretRight } from '@phosphor-icons/react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'


function CardBuscarParada() {
  const [results, setResult] = useState([])
  const inputRef = useRef(null)
  const navigate = useNavigate()

  const HandleSubmit = () => {
    const search = inputRef.current?.value?.toUpperCase().trim();
    if (!search) {
      return
    }
    navigate(`/paradas/?name=${search}`)
  }
  return (
    <>
      <div className="flex flex-row gap-2 items-center"
      >
        <div className="relative w-full">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <MapPin className="h-4" />
          </span>
          <input
            className="border border-gray-200 rounded-lg w-full pl-10 h-11 text-sm font-medium focus:outline-none focus:ring-1 focus:ring-purple-400 focus:border-purple-400 shadow-sm transition-shadow"
            style={{ fontSize: 16 }}
            placeholder="Nome ou código da parada"
            ref={inputRef}
            onKeyDown={(key) => {
              if (key.code === "Enter") {
                key.preventDefault();
               HandleSubmit() 
              }
            }
            }
            id="search"
          />
        </div>
        
        <button
          className="flex items-center justify-center bg-purple-700 h-11 px-4 rounded-lg text-white font-medium text-sm hover:bg-purple-800 transition-colors shrink-0 gap-2"
          onClick={HandleSubmit}
          aria-label="Buscar parada"
        >
          <MagnifyingGlass className="h-4" />
          Buscar
        </button>

      </div>
      {results.paradas && (
        <div className="flex flex-col border-b mt-2 overflow-y-scroll max-h-72 pb-2 z-40">
          <div className="bg-slate-100 text-sm font-bold flex items-center gap-2">
            <div className="flex items-center">
              <MapPin className="h-4 " />
              {results.paradas.length} paradas encontradas
            </div>
            <Link to={'mapa?search=1'}>
              <p className="flex items-center font-normal text-purple-600 hover:underline hover:text-purple-800">
                ver no mapa <CaretRight className="h-4" />
              </p>
            </Link>
          </div>
          {results.paradas.map((p) => (
            <p
              key={p.cod}
              className="flex items-center bg-slate-300 text-sm font-medium h-8 mt-1 rounded-md gap-1 px-1"
            >
              <span className="flex text-xs border border-purple-700 p-1 w-16 rounded-md text-purple-700">
                {p.cod}
                <MapPin className="h-4 text-purple-700" />
              </span>
              <Star className="h-4" />
              {p.desc? p.desc:p.end }
              <span className="text-xs font-normal">
                {p.x}
                {p.y}
              </span>
              <button className="text-purple-800">
                <CaretRight className="h-6" />
              </button>
            </p>
          ))}
        </div>
      )}
    </>
  )
}

export default CardBuscarParada
