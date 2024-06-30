import {useState,useRef,useEffect, createRef} from "react";
import {useMap} from "react-leaflet";
import {Previsoes} from "./Previsoes";


export default function Paradas({props}){
    const divRef = useRef();
    const [
        pontosProximos,
        localAtivo,
        setLocalAtivo,
        MudarComponente,
        itinerarioAtivo,
        setItinerarioAtivo,
        setRotaAtiva] = props

    const localClique = {}
    const scrollToElement = () => {
        const {current} = divRef;
        if (current !== null && current !== undefined){
            current.scrollIntoView({behavior: "smooth", block:'center', inline:'nearest' })
        }
    }

    const handleCLickParada = (e)=>{
        //console.log(e);
        setLocalAtivo(e);
    }
    const handleCLickProximos = ()=>{
        MudarComponente(
            <Previsoes
                key={localAtivo.cod}
                props={[
                    pontosProximos,
                    localAtivo,
                    setLocalAtivo,
                    MudarComponente,
                    itinerarioAtivo,
                    setItinerarioAtivo,
                    setRotaAtiva
                ]}
            />
        )
    }

    useEffect(()=>{
        scrollToElement();
        console.log("o diabo mudou", itinerarioAtivo)
    }, [localAtivo, itinerarioAtivo])

    const CardLinha = parada => {
        return (<>
            <div
                active={(localAtivo.cod === parada.cod).toString()}
                className='linha mx-2 rounded-md px-2 opacity-80 bg-gray-100
                           flex flex-row items-center justify-evenly h-20 text-base
                           border-black mt-2 mb-2 hover:bg-gray-100'
                onClick={(e)=>{
                    e.stopPropagation();
                    handleCLickParada(parada)}} >
                <div className='w-1/4 p-1 md:w-1/4 mx-2 flex justify-center h-16 opacity-70'>
                    <img src="./map-purple.png"></img>
                </div>
                <div className='w-3/4 text-left mt-2 text-sm md:text-base'>
                    <h3 className='font-base font-sans '>
                        {parada.desc}
                    </h3>
                    <span className='text-xs md:text-sm text-gray-400 text-base'>
                        {parada.x}
                        {parada.y}
                    </span>
                </div>
            </div>

            </>)
    }

    const CardPrincipal = parada =>{
        return (<>
            <div
                active={(localAtivo.cod === parada.cod).toString()}
                ref={divRef}
                id="active"
                className='linha flex flex-col items-center justify-evenly
                           h-fit sm:h-44 text-base border-2 border-black
                           rounded-lg shadow-lg mx-1 sm:mx-8 md:mx-12 my-4 ' >

                <div className='img-linha w-1/6 sm:w-1/3 flex justify-center  opacity-70'>
                    <img  style={{filter: "drop-shadow(10px 20px 8px #a6abad)"}}
                          src="./Encontrar no mapa.png" alt="Encontrar no mapa">
                    </img>
                </div>
                <div className='w-11/12 '>
                    <h3 className='font-bold text-sm font-sans  text-lg sm:text-xl'>
                        {parada.desc}
                    </h3>
                    <span className='text-xs  md:text-sm text-gray-400 text-base'>
                        {parada.x}
                        {parada.y}
                    </span>
                </div>
                <div className="text-xs pb-2 md:text-sm w-full flex flex-row
                                justify-center h-8 gap-2 text-center">

                    <div className="flex flex-row items-center text-xs border
                                    border-solid border-gray-300 h-6 px-1 sm:mx-4
                                    sm:px-4 my-1 bg-green-500 rounded-md text-white font-semibold"
                        onClick={()=>{ handleCLickProximos()}}>
                        <p>
                            Proximo ônibus
                        </p>
                    </div>
                    <div className="flex flex-row items-center text-xs border border-solid
                                    bg-blue-500 h-6 align-center justify-center mx-1 my-1
                                    sm:px-4 text-white mb-2 px-1 rounded-md text-white font-bold">
                        <p>
                            Linhas que atendem essa parada
                        </p>
                    </div>
                </div>
            </div>
        </>)

    }


 return (<>
     <div className='font-base text-xl my-2 fixed top-0 left-0 right-0' >
     </div>
     <hr/>
         <div className=" h-full overflow-y-scroll pb-12 pt-12">
             {pontosProximos.paradas && Object.keys(pontosProximos.paradas).map(
                 e => { return (<>
                    {(pontosProximos.paradas[e].cod === localAtivo.cod)?
                    CardPrincipal(localAtivo):
                    CardLinha(pontosProximos.paradas[e])}
                    </>)
                 }
             )
             }
        </div>
     {(Object.keys(localClique).length > 0)?
      [localClique.lat, localClique.lng]:
      'Clique no mapa para selecionar um local e ver as paradas proximas a ele'
     }

    </>)
}

