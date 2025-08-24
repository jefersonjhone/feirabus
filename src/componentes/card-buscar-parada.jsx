import { memo, useRef, useState } from 'react'
import { Estrela, Lupa, PinoLocalizacao, Seta } from './icons'
import { useFetch } from '../hooks/useFetch'
import { Link } from 'react-router-dom'

function CardBuscarParada() {
  const [results, setResult] = useState([])
  const inputRef = useRef(null)

  const HandleSubmit = () => {
    fetch(
      `${process.env.REACT_APP_API_ROUTES_URL}/search?termo=` +
        inputRef.current.value.toUpperCase().trim()
    )
      .then((e) => e.json())
      .then((e) => setResult(e))
  }

  return (
    <>
      <div className="flex flex-row gap-2 items-center">
        <span className="absolute pl-3 text-gray-400">
          <PinoLocalizacao className="h-4" />
        </span>
        <input
          className="border border-1 border-gray-200 rounded-md w-full pl-10 h-10 text-sm font-medium focus:outline focus:outline-offset-1 focus:outline-gray-300"
          placeholder="Nome ou código da parada"
          ref={inputRef}
          type="search"
          name="search"
          id="search"
        />
        <button
          type="submit"
          className="flex flex-row items-center gap-2 bg-purple-700 p-2 min-w-24 rounded-md text-white font-medium hover:bg-purple-800"
          onMouseDown={HandleSubmit}
        >
          <span>
            <Lupa className="h-4" />
          </span>
          Buscar
        </button>
      </div>
      {results.paradas && (
        <div className="flex flex-col border-b mt-2 overflow-y-scroll max-h-72 pb-2 z-40">
          <div className="bg-slate-100 text-sm font-bold flex items-center gap-2">
            <div className="flex items-center">
              <PinoLocalizacao className="h-4 " />
              {results.paradas.length} paradas encontradas
            </div>
            <Link to={'mapa?search=1'}>
              <p className="flex items-center font-normal text-blue-500 hover:underline hover:text-blue-700">
                ver no mapa <Seta className="h-4" />
              </p>
            </Link>
          </div>
          {results.paradas.map((p) => (
            <p
              key={p.cod}
              className="flex items-center bg-slate-300 text-sm font-medium h-8 mt-1 rounded-md gap-1 px-1"
            >
              <span className="flex text-xs border border-blue-700 p-1 w-16  rounded-md text-blue-700">
                {p.cod}
                <PinoLocalizacao className="h-4 text-blue-700" />
              </span>
              <Estrela className="h-4" />
              {p.desc}
              <span className="text-xs font-normal">
                {p.x}
                {p.y}
              </span>
              <button className="text-purple-800">
                <Seta className="h-6" />
              </button>
            </p>
          ))}
        </div>
      )}
    </>
  )
}

export default CardBuscarParada
