import React, { useMemo, useState, createContext, useEffect, useContext} from 'react';
import { MapContainer, TileLayer} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-ant-path';
import '../App.css'
import { Menu } from './Menu/Menu.jsx';
import { useMap } from 'react-leaflet';
import Paradas from './Menu/Paradas.jsx';
import { MapClick, MapFly } from './MapTools/MapTools.jsx';
import { Marcadores } from './Marcadores.jsx';
import isEmpty from '../utils/isEmpty.js';




const historicoContext = createContext(null);
const localContext = createContext(null);
const pontosproximosContext = createContext(null);
const RotaContext = createContext(null);
const itinerarioContext = createContext(null);


export default function  Mapa(){
    const [historico, setHistorico] = useState([]);

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

                        <historicoContext.Provider value={setHistorico}>
                            <MapComponents/>
                        </historicoContext.Provider>
                    </MapContainer>
                </div>
                <Menu>
                    {componenteAtual}
                </Menu>
            </div>
        </>
    return (<>
        <div className='map-component'>
            {Mapa}
        </div>
    </>)
};





export function  MapComponents(){
    const [pontosProximos, setPontosProximos] = useState({});
    const [localAtivo, setLocalAtivo] = useState({})
    const [LocalClique, setLocalClique] = useState({});
    const [itinerarioAtivo, setItinerarioAtivo] = useState([]);
    const [RotaAtiva, setRotaAtiva] = useState(undefined);
    const setHistorico = useContext(historicoContext);

    useEffect(()=>{
        if (isEmpty(localAtivo) &&
            (!isEmpty(pontosProximos) && !isEmpty(pontosProximos.paradas))){
            setLocalAtivo(pontosProximos.paradas[0]);
        }else if ( pontosProximos.paradas !== undefined &&
            !pontosProximos.paradas.includes(localAtivo)){
            setLocalAtivo(pontosProximos.paradas[0]);
        }
        if (!isEmpty(localAtivo)){
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
        if (RotaAtiva !== undefined &&
            itinerarioAtivo.codItinerario !== undefined &&RotaAtiva.props !== undefined &&
            RotaAtiva.props.props[1] === itinerarioAtivo.codItinerario){
                return RotaAtiva
        }
        else{console.log("não tem rota!")}
    }
    const handlerLocalAtivo = (newLocalAtivo)=>{
        setRotaAtiva({});
        setLocalAtivo(newLocalAtivo);
    }

    const MudarComponente = (componente) => {
        setHistorico([componente]);

        /*if (historico.length === 0 || componente.key !== historico[historico.length -1].key){
        }
        else{
            console.log("componente é igual ao anterior")
            alert("key === key anterior");
        }*/
    }

    const VoltarComponenteAnterior = (e) => {
        //e.stopPropagation();
        /*if (historico.length > 1){
            const novoHistorico =[...historico];
            novoHistorico.pop();
            setHistorico(novoHistorico);
        }*/

    }
    const botaoVoltar = ()=>{

        return (<>
        <div className='absolute'>
            <button className='relative text-slate-800 z-index-10 m-2  rounded-full w-14 h-14 border border-2 border-slate-800 ' onClick={()=>{VoltarComponenteAnterior()}}>voltar</button>
        </div>
        </>)
    }

    return <>
        <div style={{"zIndex":10}} >
        <MapClick props={[setPontosProximos, setLocalClique, localAtivo, setRotaAtiva]}/>
        <MapFly props={localAtivo}/>
        </div>
        <HandlerRota props={[RotaAtiva, itinerarioAtivo]}/>
        <Marcadores props={[pontosProximos, LocalClique, localAtivo, handlerLocalAtivo]}/>
        </>
}
