import { useEffect, useRef, useState } from 'react'
import { Veiculos } from './Previsoes'

export const useNextBus = (numItinerario) => {
  const [nextBus, setNextBus] = useState([])
  const source = useRef(undefined)
  console.log('current ->', source.current)
  useEffect(() => {
    if (source.current !== undefined) {
      console.log('já tem um event soure')
      source.current.close()
    }
    const es = new EventSource(
      `http://localhost:5000/veiculos-location/${numItinerario}`
    )
    es.onopen = function (event) {
      console.log('opening connection -> ', numItinerario)
    }
    es.onmessage = function (event) {
      console.log('new message -> ', event.data)
      let data = JSON.parse(event.data)
      if (!data.veiculos || data.veiculos.length === 0) {
        console.log('não há veículos, closing...')
        source.current.close()
      }

      if (nextBus !== data) {
        console.log(nextBus, JSON.parse(event.data))
        setNextBus(JSON.parse(event.data))
      } else {
        console.log('posição igual')
      }
    }
    es.onclose = function () {
      console.log('closed connection -> ', numItinerario)
    }

    es.onerror = function () {
      console.error('Erro ao receber eventos do servidor.')
    }

    source.current = es
    return () => source.current.close()
  }, [numItinerario])
  return nextBus
}
