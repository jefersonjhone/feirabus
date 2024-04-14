import React, { useMemo, useState, useEffect } from 'react';
import { MapContainer, TileLayer, useMapEvent, Marker, Circle, Pane, Popup} from 'react-leaflet';
import PopUpMenu from './Popup.jsx';
import 'leaflet-ant-path';
import getContent from '../utils/getContent.js';
import {ClickIcon, alfineteIcon} from './icons/Icons.jsx';
import RotasSimultaneas from './PopUpPontos/RotasSimultaneas.jsx'



//var url = 'http://localhost:5000';
var url = "http://fsa.siumobile.com.br:6060/siumobile-ws-v01/rest/ws/";


const A = () =>{
    const [pontosProximos, setPontosProximos] = useState([]);
    const [LocalPontosProximos, setLocalPontosProximos] = useState({});
    console.log("componenote a foi renderizado")
    useMapEvent('click', (e) => {
        console.log(e.latlng);
        setLocalPontosProximos(e.latlng)
        getContent( url + `V3/buscarParadasProximas/${e.latlng.lng}/${e.latlng.lat}/1/w/Recebe`, setPontosProximos)
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
    const [raio, setRaio] = useState(1); // Inicializa o raio com 100 metros
    const limiteRaio = 300; // Limite máximo de raio em metros

  useEffect(() => {
    const intervalId = setInterval(() => {
      // Incrementa o raio em 10 metros a cada segundo
      setRaio(raio => {
        const novoRaio = raio + 10;
        // Verifica se o novo raio excede o limite, se sim, reinicia o raio para 100
        return novoRaio > limiteRaio ? 10 : novoRaio;
      });
    }, 40);

    return () => clearInterval(intervalId); // Limpa o intervalo quando o componente é desmontado
  }, []); // Executa apenas uma vez ao montar o componente

    return (<>
                <Pane name="custom" style={{ zIndex: 419 }}>
                    <Circle id="ola"
                            center={coord}
                            radius={raio}
                            pathOptions={
                                {setRaio:false,
                                weight:1,
                                color:'#f44b3f',
                                fillColor:"white",
                                fillOpacity:.4}
                            } />
                </Pane>

                <Marker position={coord} icon={icon}>
                    { id !== null && <PopUpMenu key={id} infos={[id, coord, desc]}/> }
                </Marker>
        </>)

}






export default function  Mapa(){
    const mapa = useMemo(()=>{
        return(<>
            <MapContainer center={[-12.256106, -38.922214]} zoom={13} style={{ height: '100vh', width: '100%' }} >
                <div className='absolute container' style={{height: 300, width:'100%', zIndex:401}}>
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

