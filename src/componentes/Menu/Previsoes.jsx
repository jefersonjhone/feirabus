import { useState, useRef, useEffect, useMemo } from 'react'
import url from '../../utils/urls'
import isEmpty from '../../utils/isEmpty'
import { scrollToElement } from '../../utils/Transitions'
import { Rota } from '../Rota/Rota'
import { Veiculos } from '../Rota/Veiculos'

const CardLinha = (PrevVeic, handleClickPrevVeic) => {
  return (
    <>
      <div
        className="linha mx-2 rounded-md bg-gray-100 flex flex-row
                   items-center justify-evenly h-20  text-base
                   border-black mt-2 mb-2 hover:bg-gray-100"
        onClick={(e) => {
          e.stopPropagation()
          handleClickPrevVeic(PrevVeic)
        }}
      >
        <div className="flex flex-col w-1/5 md:w-1/4 bg-gray-100  ">
          <div className="flex justify-center h-12 opacity-70 ">
            <img src="./bus_blue.png"></img>
          </div>
          <h4 className="text-sm font-semibold text-gray-400">
            {PrevVeic.numVeicGestor}
          </h4>
        </div>
        <div className="w-3/4 py-2 h-5/6 text-xs md:text-base">
          <div className="flex flex-row h-full">
            <div
              className="mr-2 my-auto font-medium text-sm
                        w-1/6 bg-gray-200 rounded-sm underline shadow-md"
            >
              {PrevVeic.sgLin}
            </div>

            <div className="flex flex-col justify-evenly w-full ">
              <h3 className=" text-gray-600 text-xs font-medium ">
                {
                  //Object.keys(Onibus)
                }
                {PrevVeic.apelidoLinha}
              </h3>
              <span className=" text-gray-700 font-bold text-center text-sm">
                {PrevVeic.prev}
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

const CardPrincipal = (PrevVeic, handleClickPrevVeic, divRef) => {
  return (
    <>
      <div
        ref={divRef}
        id="active"
        className="linha flex flex-col items-center justify-evenly
                       h-fit sm:h-44 text-base border-2 border-black
                       rounded-lg shadow-lg mx-1 sm:mx-8 md:mx-12 my-4 "
      >
        <div className="img-linha h-16 w-1/5 sm:w-1/3 flex flex-row justify-center  opacity-70">
          <div className="flex flex-row items-center justify-center ">
            <h3
              className="text-gray-800 font-medium text-base bg-gray-400 rounded-sm px-2
                     m-2
                     "
            >
              {PrevVeic.sgLin}
            </h3>
          </div>

          <img
            style={{ filter: 'drop-shadow(10px 20px 8px #a6abad)' }}
            src="./bus_blue.png"
          ></img>
        </div>
        <div className="w-11/12 ">
          <h3 className="font-medium text-sm font-sans  text-lg sm:text-xl">
            {PrevVeic.apelidoLinha}
          </h3>
          <span className="text-gray-900 underline m-2 font-bold text-base">
            {PrevVeic.prev}
          </span>
        </div>
        <div
          className="text-xs pb-2 md:text-sm w-full flex flex-row
                justify-center h-8 gap-2 text-center"
        >
          <div
            className="flex flex-row items-center text-xs border
                               border-solid border-gray-300 h-6 px-1 sm:mx-4 sm:px-4
                               my-1 bg-green-500 rounded-md text-white font-semibold"
            onClick={() => {
              handleClickPrevVeic()
            }}
          >
            <p>Quadro de Hórários</p>
          </div>
        </div>
      </div>
    </>
  )
}

export function Previsoes({
  pontosProximos,
  currentBusStop,
  setCurrentBusStop,
  setCurrentScreen,
  setRotaAtiva,
}) {
  const divRef = useRef()
  const localClique = {}
  const [itinerario__, setItinerario__] = useState(undefined)
  const [prevVeic, setPrevVeic] = useState({})
  console.log(itinerario__)
  const fetchContent = (ApiEndPoint) => {
    fetch(ApiEndPoint)
      .then((e) => e.json())
      .then(setPrevVeic)
  }

  useEffect(() => {
    if (prevVeic.previsoes === undefined) {
      fetchContent(url + `/previsoes/${currentBusStop.cod}`)
      return
    }

    if (prevVeic.previsoes !== undefined && isEmpty(prevVeic.previsoes)) return

    const intervalo = setInterval(() => {
      fetchContent(url + `previsoes/${currentBusStop.cod}`)
    }, 30000)

    scrollToElement(divRef.current)
    return () => clearInterval(intervalo)
  }, [currentBusStop])

  useEffect(() => {
    if (itinerario__ !== undefined) return
    if (prevVeic.previsoes === undefined) return
    const e = prevVeic.previsoes[0]
    setItinerario__(e)
  }, [prevVeic, itinerario__])

  const handleClickPrevVeic = (e) => {
    setItinerario__(e)
  }
  const handleCLickProximos = () => {
    alert(currentBusStop.cod)
  }

  const previsoes_ = () => {
    if (prevVeic.previsoes === undefined) {
      return null
    }

    return Object.keys(prevVeic.previsoes).map((e) => {
      if (
        itinerario__ !== undefined &&
        itinerario__.codItinerario !== undefined
      ) {
        console.log(
          'listando previsoes: ',
          prevVeic.previsoes[e].codItinerario.toString() ===
            itinerario__.codItinerario.toString()
        )
      } else if (Object.keys(prevVeic.previsoes).length > 0) {
        console.log('setando o ativo como o primeiro')
        //setItinerario__(ProximosOnibus.previsoes[0])
      }

      if (
        itinerario__ !== undefined &&
        itinerario__.codItinerario !== undefined &&
        prevVeic.previsoes[e].codItinerario === itinerario__.codItinerario &&
        prevVeic.previsoes[e].prev === itinerario__.prev
      ) {
        return CardPrincipal(prevVeic.previsoes[e], handleClickPrevVeic, divRef)
      }
      return CardLinha(prevVeic.previsoes[e], handleClickPrevVeic)
    })
  }

  return (
    <>
      <div className="font-base text-xl my-2 fixed top-0 left-0 right-0"></div>
      <hr />
      <div className=" h-full overflow-y-scroll pb-12 pt-12">
        proximos ônibus para
        <br />
        <h3 className="text-">{currentBusStop.desc}</h3>
        {previsoes_()}
        {itinerario__ !== undefined ? (
          <Rota
            localAtivo={currentBusStop}
            numItinerario={itinerario__.codItinerario}
            numVeicGestor={itinerario__.numVeicGestor}
            previsao={itinerario__.previsao}
          />
        ) : (
          <></>
        )}
        {itinerario__ !== undefined &&
        itinerario__.codItinerario !== undefined ? (
          <Veiculos
            localAtivo={currentBusStop}
            numItinerario={itinerario__.codItinerario}
            numVeicGestor={itinerario__.numVeicGestor}
            previsao={itinerario__.previsao}
          />
        ) : (
          <></>
        )}
      </div>
    </>
  )
}
