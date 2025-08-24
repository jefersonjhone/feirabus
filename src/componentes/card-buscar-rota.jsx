import { useRef, useState, memo, useEffect } from 'react'
import { Lupa, Onibus, PinoLocalizacao, Seta } from './icons'
import InputParadas, { Results } from './input-paradas'
import { redirect } from 'react-router-dom'

function CardBuscarRota({ i, d }) {
  const [results, setResult] = useState({})
  const [init, setInit] = useState(i)
  const [dest, setDest] = useState(d)

  const handleSelect = () => {
    console.log('redirect')
    window.location = `/rotas?codInit=${init.cod}&codDest=${dest.cod}`
  }

  const HandleSubmit = () => {
    if (!(init.cod && dest.cod)) return
    fetch(
      `${process.env.REACT_APP_API_ROUTES_URL}/rotas?cod_inicio=${init.cod}&cod_dest=${dest.cod}`
    )
      .then((e) => e.json())
      .then((e) => handleFetch(e))
      .catch((e) => console.log(e))
  }

  const handleFetch = (e) => {
    setInit(e.parada_inicio[0])
    setDest(e.parada_dest[0])
    console.log(e)
    setResult(e)
  }
  useEffect(() => {
    if (i && d && !results.results) {
      HandleSubmit()
    }
  })

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-2 items-center w-full z-90 ">
        <div className="flex flex-row items-center w-full">
          <div className="w-full flex flex-col relative">
            <span className="absolute pl-3 text-gray-400 pt-3">
              <PinoLocalizacao className="h-4" />
            </span>
            <InputParadas value={init} setValue={setInit} />
          </div>
        </div>
        <button
          onClick={() => {
            const a = dest
            setDest(init)
            setInit(a)
          }}
        >
          swap
        </button>
        <div className="flex flex-row items-center w-full  ">
          <div className="w-full flex flex-col relative">
            <span className="absolute pl-3 pt-3 text-gray-400">
              <PinoLocalizacao className="h-4" />
            </span>
            <InputParadas value={dest} setValue={setDest} />
          </div>
        </div>
        <button
          type="submit"
          onMouseDown={handleSelect}
          onSubmit={handleSelect}
          className="flex flex-row items-center gap-2 bg-purple-700 p-2 min-w-24 rounded-md text-white font-medium hover:bg-purple-800"
        >
          <span>
            <Lupa className="h-4" />
          </span>
          Buscar
        </button>
      </div>
      <Results results={results} />
    </>
  )
}

export default CardBuscarRota
