import { useEffect, useState } from "react"
import getContent from "../../utils/getContent"
import url from "../../utils/urls"
import Rota from "./Rota"
import RotasSimultaneas from "./RotasSimultaneas"
import { MapContainer, TileLayer } from "react-leaflet"

const Proximos = ({props}) => {
    const [ProximosOnibus, setProximosOnibus] = useState({})
    const [desc, MudarComponente, id, coord] = props
    useEffect(
        ()=>{
            getContent(url +`previsoes/${id}`, setProximosOnibus)
        }, [id])
    if (ProximosOnibus.sucesso){

        var v = {}
        ProximosOnibus.previsoes.forEach(o=> {v[o.codItinerario]= 0});
        console.log("itinerários em v", v);
        const rotas = <>
            <MapContainer center={coord} zoom={14} style={{ height: '60vh', width: '300px' }} >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <RotasSimultaneas props={[Object.keys(v)]}/>
            </MapContainer>
            </>
            /*return <>{rotas}</>;*/

        return  (<><div  className='w-72 h-96 p-1 bg-gray-100 rounded-md overflow-y-scroll'>
                <div className='text-sm text-center'>
                    <p>Próximos ônibus para <br />{desc}:</p>
                </div>
                { Object.keys(ProximosOnibus.previsoes).length > 0 && ProximosOnibus.previsoes.map(
                    (o)=>{
                        return <div key={`${o.codItinerario} ${o.apelidoLinha} ${o.prev}`}
                            className='border-solid border cursor-pointer border-gray-300 my-1 shadow-inner overflow-hidden flex flex-row rounded-md h-16 text-center'
                            onClick={(e)=>{console.log(o.codItinerario, o.apelidoLinha, o.prev);MudarComponente(<Rota props={[coord, o.codItinerario, o.numVeicGestor, o.prev]}/>);e.stopPropagation();}}
                        >
                        <div className='w-1/4 bg-gray-200 p-0 ' >
                            <img className='mx-auto'
                                style={{marginTop:"4px", filter: "drop-shadow(1px 20px 8px #a6abad)"}}
                                src={'./Pesquisar por linha.png'}
                                alt={"icone do onibus"}
                                width={'40px'}/>

                        <p style={{margin: "0px"}} className='h-1 font-semibold' >
                            {o.numVeicGestor}{"   "}{o.codItinerario}
                        </p>

                        </div>
                        <p style={{margin: "0px", marginTop:"4px"}}
                            className='bg-gray-200 m-auto  text-l h-full font-bold w-12'>
                            {o.sgLin}
                        </p>
                        <div className='w-3/4 bg-blue-200 flex flex-col justify-start '>
                            <p style={{margin: "0px", marginTop:"4px", fontSize:"0.6rem"}}
                                className='text-xs font-semibold text-gray-500 mx-auto'>
                                {o.apelidoLinha}
                            </p>
                            <p style={{margin: "0px"}}
                                className='font-bold'>
                                {o.prev}
                            </p>
                        </div>
                    </div>
                })//fim do map em pontos proximos
                }
            </div></>)
    }
}

export default Proximos;
