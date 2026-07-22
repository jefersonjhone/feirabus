import { useEffect, useRef, useState } from 'react'
import { useLinhasStore } from '../stores/linhaStore'
import { useStops } from '../hooks/useStops'
import { Star, Bus, MapPin, CaretRight } from '@phosphor-icons/react'

export default function InputParadas({ value, setValue }) {
  const [searchResults, setSearchResults] = useState([])
  const [focused, setFocused] = useState(false)
  const inputRef = useRef(null)
  const { stops, loading } = useStops()
  const favoritosParadas = useLinhasStore((s) => s.favoritosParadas)

  const handleSearch = (e) => {
    const text = e.target.value.toUpperCase().trim()
    if (!text || !stops) {
      setSearchResults([])
      return
    }
    const results = Object.values(stops).filter(
      (p) => String(p.cod).includes(text) || p.desc?.toUpperCase().includes(text)
    )
    setSearchResults(results.slice(0, 30))
  }

  const handleFocus = () => {
    setFocused(true)
    if (!inputRef.current?.value && favoritosParadas.length > 0) {
      setSearchResults(favoritosParadas)
    }
  }

  const handleBlur = () => {
    setFocused(false)
    setTimeout(() => setSearchResults([]), 200)
  }

  const handleSelect = (value) => {
    inputRef.current.value = value.desc || value.end
    setValue(value)
    setSearchResults([])
  }

  useEffect(() => {
    if (value?.desc) inputRef.current.value = value.desc
  }, [value])

  const showDropdown = searchResults.length > 0 && focused

  return (
    <div className="relative w-full">
      <span className="absolute pl-3 text-gray-400 h-full flex items-center z-30">
        <MapPin className="h-4" />
      </span>
      <input
        ref={inputRef}
        onChange={handleSearch}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className="border border-gray-200 rounded-lg w-full pl-10 pr-4 h-10 text-sm font-medium focus:outline focus:outline-offset-1 focus:outline-gray-300 shadow-sm"
        style={{ fontSize: 16 }}
        placeholder="Nome ou código da parada"
        type="search"
        name="search"
        id="search"
      />
      {showDropdown && (
        <div className="absolute top-11 z-50 bg-white border border-gray-200 shadow-lg rounded-lg w-full max-h-72 overflow-y-auto">
          {!inputRef.current?.value && (
            <div className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-gray-400 border-b border-gray-100">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              Paradas favoritas
            </div>
          )}
          {searchResults.map((e) => (
            <button
              key={e.cod}
              onMouseDown={() => handleSelect(e)}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-purple-50 transition-colors text-left border-b border-gray-50 last:border-0"
            >
              <div className="flex items-center gap-1 px-2 py-0.5 border border-purple-800 rounded-md text-purple-800 font-bold text-xs shrink-0">
                <MapPin className="h-3" />
                {e.cod}
              </div>
              <span className="truncate text-gray-700 font-medium">
                {e.desc || e.end}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export function Results({ results }) {
  return (
    <>
      {results.results && (
        <div className="h-full overflow-y-scroll">
          {results.results.map((r) => (
            <div className="flex flex-row py-2 border border-2 my-2">
              {r.map((p, i) => (
                <>{location_label(p, i !== r.length - 1 || r.length === 1)}</>
              ))}
            </div>
          ))}
        </div>
      )}
    </>
  )
}

const LabelParada = (parada) => {
  return (
    <div
      className={`flex flex-row font-semibold text-sm items-center justify-center  rounded-md text-white w-16 h-6 bg-blue-700`}
      onClick={() => {
        alert(parada.desc)
      }}
    >
      <MapPin className="h-4" />
      {parada.cod}
    </div>
  )
}

const LabelLinha = (cod) => {
  return (
    <span className="flex flex-col justify-center items-center ">
      <span className="flex items-center rounded-md border border-purple-600 bg-purple-600 text-white font-semibold text-sm w-16">
        <Bus className="h-4" />
        {cod}
      </span>
      <span className="text-sm font-medium px-2 flex flex-col gap-0 justify-center">
        {
          //p.linha.descricao
        }
      </span>
    </span>
  )
}

const location_label = (p, hasline) => {
  return (
    <div className="flex flex-row gap-2 ">
      <div className="flex flex-row items-center">
        {hasline && LabelParada(p.parada_inicio)}
        <div className="border-t-2 w-4 h-0 border-purple-500 border-dashed"></div>
        {p.linhas.map((linha) => LabelLinha(linha.num_linha))}
        <div className="border-t-2 w-4 h-0 border-purple-500 border-dashed"></div>
        {LabelParada(p.parada_fim)}
      </div>
    </div>
  )
}
