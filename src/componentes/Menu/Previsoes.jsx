import {useState,useRef,useEffect, useMemo} from "react";
import { useMap, Marker, Popup, CircleMarker} from "react-leaflet";
import AntPath from "../AntPath"
import getContent from "../../utils/getContent";
import {BusIconBlue, BusIconGray, SquareIcon} from "../icons/Icons";
import url from "../../utils/urls";
import isEmpty from "../../utils/isEmpty";





export function Veiculos({props}){
    const [Veiculos, setVeiculos] = useState({});
    const map = useMap();
    var [localAtivo, numItinerario, numVeicGestor, previsao, itinerarioAtivo] = props;

    useEffect( () => {
        //map.flyTo([localAtivo.y, localAtivo.x], 14);
        var intervalo = setInterval(()=>{}, 100000);
        if (numVeicGestor !== undefined){
            if (Veiculos.veiculos === undefined ||
            (Veiculos.veiculos.filter((v) => v.numVeicGestor === numVeicGestor).length === 0)){
                getContent(
                    url+`veiculos-por-itinerario/${numItinerario}`,
                    setVeiculos
                );
                intervalo = setInterval( () =>{
                    getContent(
                        url+`veiculos-por-itinerario/${numItinerario}`,
                        setVeiculos
                    )
                }, 10000)
            } 
        }
        return ()=> clearInterval(intervalo);
    })




    const onibus = (numVeicGestor && Object.keys(Veiculos).includes("veiculos"))?
        Veiculos.veiculos.map(v =>{ 
            if (v.numVeicGestor === numVeicGestor){
                //map.flyTo([v.lat, v.long], 12);
                return <Marker
                    icon={BusIconBlue}
                    position={[v.lat, v.long]}>
                    <Popup>
                    linha {v.descricao}
                    <br/>
                    número do veículo {v.numVeicGestor}
                </Popup>
                </Marker>
            }else{
                return <Marker
                    style={{opacity:'.6'}}
                    icon={BusIconGray}
                    position={[v.lat, v.long]}>
                </Marker>
            }
            })
        :<></>
    return <>
       {onibus}
        </>


}





export function Rota({props}){
    const [Rotas, setRota] = useState({});
    const map = useMap();
    var [localAtivo, numItinerario, numVeicGestor, previsao, itinerarioAtivo] = props;


    useEffect( () => {

        if ( Rotas.itinerarios === undefined ||(
        itinerarioAtivo.codItinerario !== undefined &&
        numItinerario !== itinerarioAtivo.codItinerario)){
            console.log(Rotas.itinerarios, itinerarioAtivo.codItinerario, numItinerario)
            //map.flyTo([localAtivo.y, localAtivo.x], 14);
            console.log("local ativo", localAtivo)
            getContent(
                url+`itinerarios/${numItinerario}`,
                setRota
            );
        }
    }, [localAtivo, itinerarioAtivo, numItinerario])


    const AntPathRota = useMemo(()=>(Object.keys(Rotas).length > 0 && Rotas.itinerarios !== undefined ) ?
        <>
            <Marker
                icon={SquareIcon}
                position={[Rotas.itinerarios[Rotas.itinerarios.length -1].coordY, Rotas.itinerarios[Rotas.itinerarios.length -1].coordX]} >
            </Marker>


            <CircleMarker
            center={[Rotas.itinerarios[0].coordY, Rotas.itinerarios[0].coordX] }
            pathOptions={{color:'black'}}
            radius={8}
            >
            </CircleMarker>

            <AntPath
                positions={Rotas.itinerarios.map((o)=>[o.coordY, o.coordX])}
                options={{ delay: 2000, dashArray: [10, 20], weight: 5, color: '#000', opacity:1, hardwareAccelerated:true}} />
        </>:
            <></>)

        return (<> {AntPathRota} <Veiculos props={[localAtivo, numItinerario, numVeicGestor, previsao, itinerarioAtivo]}/></>)

}








export function Previsoes({props}){
    const [pontosProximos,
        localAtivo,
        setLocalAtivo,
        MudarComponente,
        itinerarioAtivo,
        setItinerarioAtivo,
        setRotaAtiva] = props
    const divRef = useRef();
    const localClique = {}
    const [itinerario__, setItinerario__ ] = useState(undefined);
    const [ProximosOnibus, setProximosOnibus] = useState({})

    useEffect(()=>{
        var intervalo = setInterval(()=>{},10000);
        if (ProximosOnibus.previsoes === undefined){
            getContent(url +`previsoes/${localAtivo.cod}`, setProximosOnibus);

        }
        if (itinerario__ === undefined && ProximosOnibus.previsoes !== undefined && !isEmpty(ProximosOnibus.previsoes)){
            const e = ProximosOnibus.previsoes[0];
            setItinerarioAtivo(ProximosOnibus.previsoes[0]);
            setItinerario__(ProximosOnibus.previsoes[0]);
            setRotaAtiva(<Rota props={[localAtivo, e.codItinerario, e.numVeicGestor, e.previsao, itinerarioAtivo ]}/>);
        }

        scrollToElement();
        return ()=>{clearInterval(intervalo)}
           }, [localAtivo, ProximosOnibus, itinerarioAtivo, itinerario__])



    const scrollToElement = () => {
        const {current} = divRef;
        if (current !== null && current !== undefined){
            current.scrollIntoView({behavior: "smooth", block:'center', inline:'nearest' })
        }
    }

    const handleCLickOnibus = (e)=>{
        setItinerarioAtivo(e);
        setItinerario__(e);
        setRotaAtiva(<Rota props={[localAtivo, e.codItinerario, e.numVeicGestor, e.previsao, itinerario__ ]}/>)
    }
    const handleCLickProximos = ()=>{
        alert(localAtivo.cod );
    }





    const CardLinha = (Onibus) => {
        return (<>
            <div
                active={(localAtivo.cod === Onibus.cod).toString()}
                className='linha mx-2 rounded-md bg-gray-100 flex flex-row
                       items-center justify-evenly h-20  text-base
                       border-black mt-2 mb-2 hover:bg-gray-100'
                onClick={(e)=>{
                    e.stopPropagation();
                    handleCLickOnibus(Onibus);
            }}>


                <div className="flex flex-col w-1/5 md:w-1/4 bg-gray-100  ">
                    <div className='flex justify-center h-12 opacity-70 '>
                        <img src="./bus_blue.png"></img>
                    </div>
                    <h4 className="text-sm font-semibold text-gray-400" >
                        {Onibus.numVeicGestor}
                    </h4>
                </div>
                <div className='w-3/4 py-2 h-5/6 text-xs md:text-base'>
                    <div className="flex flex-row h-full">
                        <div className="mr-2 my-auto font-medium text-sm
                            w-1/6 bg-gray-200 rounded-sm underline shadow-md"
                        >
                            {Onibus.sgLin}
                        </div>

                        <div className="flex flex-col justify-evenly w-full ">
                            <h3 className=' text-gray-600 text-xs font-medium '>
                                {
                                    //Object.keys(Onibus)
                                }
                                {Onibus.apelidoLinha}
                            </h3>
                            <span className=' text-gray-700 font-bold text-center text-sm'>
                                {Onibus.prev}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </>)
    }




    const CardPrincipal = (parada) =>{
        return (<>
            <div
                active={(localAtivo.cod === parada.cod).toString()}
                ref={divRef}
                id="active"
                className='linha flex flex-col items-center justify-evenly
                           h-fit sm:h-44 text-base border-2 border-black
                           rounded-lg shadow-lg mx-1 sm:mx-8 md:mx-12 my-4 '
            >
                <div className='img-linha h-16 w-1/5 sm:w-1/3 flex flex-row justify-center  opacity-70'>
                     <div className="flex flex-row items-center justify-center ">
                     <h3 className='text-gray-800 font-medium text-base bg-gray-400 rounded-sm px-2
                         m-2
                         '>
                        {parada.sgLin}
                    </h3>
                    </div>

                    <img

                        style={{filter: "drop-shadow(10px 20px 8px #a6abad)"}}
                        src="./bus_blue.png">
                    </img>

                </div>
                <div className='w-11/12 '>
                    <h3 className='font-medium text-sm font-sans  text-lg sm:text-xl'>
                        {parada.apelidoLinha}
                    </h3>
                    <span className='text-gray-900 underline m-2 font-bold text-base'>
                        {parada.prev}
                    </span>
                </div>
                <div className="text-xs pb-2 md:text-sm w-full flex flex-row
                    justify-center h-8 gap-2 text-center">
                    <div
                        className="flex flex-row items-center text-xs border
                                   border-solid border-gray-300 h-6 px-1 sm:mx-4 sm:px-4
                                   my-1 bg-green-500 rounded-md text-white font-semibold"
                        onClick={()=>{ handleCLickProximos()}}
                    >
                        <p>
                            Quadro de Hórários
                        </p>
                    </div>
                </div>
            </div>
        </>)

    }












    const previsoes_ = () => {if (ProximosOnibus.previsoes !== undefined) return Object.keys(ProximosOnibus.previsoes).map(
                 (e)=>{
                     if (itinerario__ !== undefined && itinerario__.codItinerario !== undefined){
                    console.log("listando previsoes: ", ProximosOnibus.previsoes[e].codItinerario.toString() === itinerario__.codItinerario.toString())}

                     else if (Object.keys(ProximosOnibus.previsoes).length > 0){
                         //console.log("setando o ativo como o primeiro")
                         //setItinerario__(ProximosOnibus.previsoes[0])
                     }
                     console.log(itinerarioAtivo.codItinerario, ProximosOnibus.previsoes)

                    if (itinerario__ !== undefined && itinerario__.codItinerario !== undefined && ProximosOnibus.previsoes[e].codItinerario === itinerario__.codItinerario && ProximosOnibus.previsoes[e].prev === itinerario__.prev){
                        return CardPrincipal(ProximosOnibus.previsoes[e])
                    }
                    return CardLinha(ProximosOnibus.previsoes[e])

                 }
             )}

 return (<>
     <div className='font-base text-xl my-2 fixed top-0 left-0 right-0' >
     </div>
     <hr/>
     <div className=" h-full overflow-y-scroll pb-12 pt-12">
         proximos ônibus para
         <br/>
         <h3 className="text-">
             {localAtivo.desc}
         </h3>
        {
            previsoes_()
         }
     </div>
     {
         !isEmpty(localClique)?
         [localClique.lat, localClique.lng]:''

         //'Clique no mapa para selecionar um local e ver as paradas proximas a ele'
     }

    </>)
}
