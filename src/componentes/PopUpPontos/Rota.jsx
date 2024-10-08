import {MapContainer, Marker, Popup, TileLayer} from "react-leaflet"
import AntPath from "../AntPath"
import {useEffect, useState} from "react";
import getContent from "../../utils/getContent";
import {BusIconBlue, BusIconGray, ClickIcon} from "../icons/Icons";
import url from "../../utils/urls";







export default function Rota({props}){
    var [coord, numItinerario, numVeicGestor, previsao] = props;

    const [Rotas, setRota] = useState({});
    const [Veiculos, setVeiculos] = useState({});


    useEffect( () => {
        var intervalo = setInterval(()=>{}, 10000)
        if (Object.keys(Rotas) < 1){
            getContent(url+`itinerarios/${numItinerario}`, setRota)

        }
        else if ( numVeicGestor && Veiculos.veiculos === undefined){
            getContent(url+`veiculos-por-itinerario/${numItinerario}`, setVeiculos)
            intervalo = setInterval( () =>{getContent(url+`veiculos-por-itinerario/${numItinerario}`, setVeiculos)}, 5000)

        }  return ()=> clearInterval(intervalo);}, [Rotas])


    const onibus = (numVeicGestor && Object.keys(Veiculos).length > 0 && Veiculos.veiculos !== undefined )?
        Veiculos.veiculos.map((o) =>{
            if(o.numVeicGestor === numVeicGestor){
                return <Marker icon={BusIconBlue} position={[o.lat, o.long]}><Popup>ola</Popup></Marker>
            }
            return <Marker style={{opacity:'.6'}}  icon={BusIconGray} position={[o.lat, o.long]}></Marker>}):
        <></>

    const AntPathRota = (Object.keys(Rotas).length > 0 && Rotas.itinerarios !== undefined ) ?
        <AntPath positions={Rotas.itinerarios.map((o)=>[o.coordY, o.coordX])} options={{ delay: 600, dashArray: [10, 20], weight: 5, color: '#0000FF' }} />:
        <></>

    return (<><div className="rounded-md overflow-hidden" >
        <div>
            <button onClick={()=>{  }}>ola</button>
        </div>
        numero do itinerário: {numItinerario}
        <br />
        previsao: {previsao}
        <MapContainer center={coord} zoom={14} style={{ height: '60vh', width: '300px' }} >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Marker icon={ClickIcon} position={coord} ></Marker>
            {onibus}
            {AntPathRota}
        </MapContainer>
        </div>
</>)}

