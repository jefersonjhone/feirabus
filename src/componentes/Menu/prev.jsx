import { useEffect, useRef, useState } from 'react'

export const useNextBus = (numItinerario) => {
  const [nextBus, setNextBus] = useState([])
  const source = useRef(undefined)
  useEffect(() => {
    if (source.current !== undefined) {
      source.current.close()
    }
    const es = new EventSource(
      `http://localhost:5000/veiculos-location/${numItinerario}`
    )
    es.onopen = function (event) {}
    es.onmessage = function (event) {
      let data = JSON.parse(event.data)
      if (!data.veiculos || data.veiculos.length === 0) {
        source.current.close()
      }

      if (nextBus !== data) {
        setNextBus(JSON.parse(event.data))
      }
    }
    es.onclose = function () {}

    es.onerror = function () {}

    source.current = es
    return () => source.current.close()
  }, [numItinerario])
  return nextBus
}
