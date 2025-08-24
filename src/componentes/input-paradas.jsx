import { useEffect, useRef, useState } from 'react'
import { Onibus, PinoLocalizacao, Seta } from './icons'

export default function InputParadas({ value, setValue }) {
  const [searchResults, setSearchResults] = useState([])
  const inputRef = useRef(null)
  const handleSearch = (event) => {
    const text = event.target.value
    if (!text) return
    fetch(`${process.env.REACT_APP_API_ROUTES_URL}/search?termo=${text}`)
      .then((e) => e.json())
      .then((e) =>
        e.paradas ? setSearchResults(e.paradas) : setSearchResults([])
      )
  }

  const handleSelect = (value) => {
    inputRef.current.value = value.desc
    setValue(value)
    setSearchResults([])
  }
  useEffect(() => {
    if (value?.desc) {
      inputRef.current.value = value.desc
    }
  }, [value])

  return (
    <>
      <div className="flex flex-row items-center w-full  ">
        <div className="w-full flex flex-col relative">
          <span className="absolute pl-3 pt-3 text-gray-400">
            <PinoLocalizacao className="h-4" />
          </span>
          <input
            ref={inputRef}
            onChange={handleSearch}
            className="border border-1 border-gray-200 rounded-md w-full pl-10 h-10 text-sm font-medium focus:outline focus:outline-offset-1 focus:outline-gray-300"
            placeholder="Nome ou código da parada"
            type="search"
            name="search"
            id="search"
          />
          {searchResults.length > 0 && (
            <div className="absolute top-10 shadow-inner border shadow-md rounded-md z-90 bg-white h-fit overflow-y-scroll max-h-[300px] w-full p-2 rounded-sm mt-2">
              {searchResults.map((e) => (
                <p
                  className="text-sm  font-medium flex items-center  h-6 border border-blue-600 mt-1 rounded-md"
                  onClick={() => {
                    handleSelect(e)
                  }}
                >
                  <div className="text-blue-600 flex flex-row items-center border-r border-r-blue-600 rounded-sm mr-1">
                    <PinoLocalizacao className="h-4  w-4" />
                    <span className="mr-1">{e.cod}</span>
                  </div>
                  <span className="w-full truncate">{e.desc}</span>
                </p>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
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
      <PinoLocalizacao className="h-4" />
      {parada.cod}
    </div>
  )
}

const LabelLinha = (cod) => {
  return (
    <span className="flex flex-col justify-center items-center ">
      <span className="flex items-center rounded-md border border-purple-600 bg-purple-600 text-white font-semibold text-sm w-16">
        <Onibus className="h-4" />
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
  console.log(p)
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
