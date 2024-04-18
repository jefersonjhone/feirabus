import React, { useMemo, useState, useEffect } from 'react';
import { MapContainer, TileLayer, useMapEvent, Marker, Circle, Pane, Popup} from 'react-leaflet';
import PopUpMenu from './Popup.jsx';
import 'leaflet-ant-path';
import getContent from '../utils/getContent.js';
import {ClickIcon, alfineteIcon} from './icons/Icons.jsx';
import RotasSimultaneas from './PopUpPontos/RotasSimultaneas.jsx'
import url from '../utils/urls.js';




const A = () =>{
    const [pontosProximos, setPontosProximos] = useState([]);
    const [LocalPontosProximos, setLocalPontosProximos] = useState({});
    console.log("componenote a foi renderizado")
    useMapEvent('click', (e) => {
        console.log(e.latlng);
        setLocalPontosProximos(e.latlng)
        getContent( url + `paradas-proximas/${e.latlng.lng}/${e.latlng.lat}`, setPontosProximos)
    })
    return (<>





  {Object.keys(LocalPontosProximos).length !== 0 &&
            <Marcador
                coord={[LocalPontosProximos.lat, LocalPontosProximos.lng]}
                icon={alfineteIcon}
                id={null}
                desc={"Local selecionado"}/>}
        {pontosProximos.paradas !== undefined && pontosProximos.paradas.map((p)=>{
            return (<Marcador key={p.cod}
                                coord={[p.y, p.x]}
                                icon={ClickIcon}
                                id={p.cod}
                                desc={p.desc}
                            />)
                })
            }
</>)
}

function Marcador({coord, icon, id, desc}){

    return (<>
                <Marker position={coord} icon={icon}>
                    { id !== null && <PopUpMenu key={id} infos={[id, coord, desc]}/> }
                </Marker>
        </>)

}






export default function  Mapa(){
    const mapa = useMemo(()=>{
        return(<>
            <MapContainer center={[-12.254463237869844,-38.960094451904304]} zoom={13} style={{ height: '100vh', width: '100%' }} >
                <div className='absolute container' style={{height: 3, width:'100%', zIndex:401}}>
                    <div className='text-xl text-center bg-slate-100 '>
                    </div>
                </div>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <A/>
                <RotasSimultaneas style={{opacity:.1}} props={[[]]}/>
            </MapContainer>
            </>)
    },[])
    return (mapa)
};

