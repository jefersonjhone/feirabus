import React, { useMemo, useState, useEffect} from 'react';
import { MapContainer, TileLayer} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-ant-path';
import '../App.css'
import Paradas from './Menu/Paradas.jsx';
import {Rota} from './Menu/Previsoes.jsx';
import { MapClick, MapFly } from './MapTools/MapTools.jsx';
import { Marcadores } from './Marcadores.jsx';
import { Menu } from './Menu/Menu.jsx';
import isEmpty from '../utils/isEmpty.js';


export default function  Mapa(){
    const [pontosProximos, setPontosProximos] = useState({});
    const [localAtivo, setLocalAtivo] = useState({})
    const [LocalClique, setLocalClique] = useState({});
    const [historico, setHistorico] = useState([]);
    const [itinerarioAtivo, setItinerarioAtivo] = useState([]);
    const [RotaAtiva, setRotaAtiva] = useState(undefined);


    useEffect(()=>{
        if (isEmpty(localAtivo) && 
            (!isEmpty(pontosProximos) && !isEmpty(pontosProximos.paradas))){
            setLocalAtivo(pontosProximos.paradas[0]);
        }else if ( pontosProximos.paradas !== undefined &&
            !pontosProximos.paradas.includes(localAtivo)){
            setLocalAtivo(pontosProximos.paradas[0]);
        }
        if (!isEmpty(localAtivo)){
            console.log("setando o local ativo :\n o local ativo é :", Object.keys(localAtivo), isEmpty(localAtivo));

            setHistorico([ <Paradas key={1} props= {
                 [   pontosProximos,
                     localAtivo,
                     setLocalAtivo,
                     MudarComponente,
                     itinerarioAtivo,
                     setItinerarioAtivo,
                     setRotaAtiva
                 ]
             }/>
             ]
        )}
    }, [LocalClique, pontosProximos, localAtivo])


    const HandlerRota = ({props})=>{
        const [RotaAtiva, itinerarioAtivo] = props;
        
        if (RotaAtiva !== undefined && itinerarioAtivo.codItinerario !== undefined && RotaAtiva.props.props[1] === itinerarioAtivo.codItinerario){return RotaAtiva}
        else{console.log("rota não definida ainda!")}

    }
    const MudarComponente = (componente) => {

        if (historico.length === 0 || componente.key !== historico[historico.length -1].key){
          setHistorico([...historico, componente]);
        }
        else{
            console.log("componente é igual ao anterior")
            alert("key === key anterior");
        }
    }

    const VoltarComponenteAnterior = (e) => {
        e.stopPropagation();
        if (historico.length > 1){
            const novoHistorico =[...historico];
            novoHistorico.pop();
            setHistorico(novoHistorico);
        }

    }

    const componenteAtual = useMemo(() => historico[historico.length - 1] !== undefined ? historico[historico.length - 1] : <></>, [historico]);

    const Mapa = <>
            <div className='relative w-screen h-screen overflow-y-hidden'>
                <div className="h-44">
                    <MapContainer
                        className=''
                        center={[-12.254463237869844,-38.960094451904304]}
                        zoom={13}
                        style={{ height: '', width: '100%' }} >
                        <TileLayer className='' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                        <MapClick props={[setPontosProximos, setLocalClique, localAtivo]}/>
                        <MapFly props={localAtivo}/>
                        <HandlerRota props={[RotaAtiva, itinerarioAtivo]}/>
                        <Marcadores props={[pontosProximos, LocalClique, localAtivo, setLocalAtivo]}/>
                    </MapContainer>
                </div>
                <Menu> {componenteAtual}</Menu>
            </div>
        </>
    return (<>
        <div className='map-component'>
            {Mapa}
        </div>
    </>)        
};

