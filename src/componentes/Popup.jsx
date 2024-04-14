import React, { useMemo, useState} from 'react';
import { MapContainer, TileLayer, useMapEvent, Marker, Popup} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-ant-path';
import getContent from '../utils/getContent';
import Rota from './PopUpPontos/Rota';
import Proximos from './PopUpPontos/Proximos.jsx';
import {MenuParadas, MostrarParadas} from './PopUpPontos/MostrarParadas';
import SeuComponente from './Historico';
import Menu from './PopUpMenu';

//var url = 'http://localhost:5000';
const url = "http://fsa.siumobile.com.br:6060/siumobile-ws-v01/rest/ws/";




const card_linhas = (linha, callback) => {
    const handleclick = e => {
        callback(linha.cod_linha);
        e.stopPropagation();
    }
        return <div className=''>
                <div key={linha.cod_linha}
                    id={linha.cod_linha}
                    className=' my-1 shadow-inner overflow-hidden flex flex-row rounded-md h-16 text-center'
                    onClick={handleclick}
                    >
                    <div className='w-1/4 bg-gray-200 p-0 ' >
                        <img className='mx-auto'
                            style={{marginTop:"4px", filter: "drop-shadow(1px 20px 8px #a6abad)"}}
                            src={'./Pesquisar por linha.png'}
                            alt={"icone do onibus"}
                            width={'40px'}/>

                    <p style={{margin: "0px"}} className='h-1 font-semibold' >
                        {linha.num_linha}{"      "}{linha.cod_linha}
                    </p>

                    </div>

                    <div className='w-3/4 bg-blue-200 flex flex-col justify-start '>
                        <p style={{margin: "0px", marginTop:"4px", fontSize:"0.6rem"}}
                            className='text-xs font-semibold text-gray-700 mx-auto'>
                            {linha.descricao}
                        </p>

                    </div>
                </div>
            </div>}




const showLinhas = (linhas, fnParadas) => {
    linhas = linhas.linhas
        return (<>
            <div className=" bg-gray-100 rounded-md">
                {linhas.map(linha=> card_linhas(linha, fnParadas))}
            </div>
            </>)
    }




export default function PopUpMenu({infos }){

    const [id, coord, desc] = infos;
    const [Pagina, setPagina] = useState('menu');
    const [ProximosOnibus, setProximosOnibus] = useState({});
    const [codItinerario, setCodItinerario] = useState(0);
    const [Linhas, setLinhas] = useState({});
    const [Paradas, setParadas] = useState({});
    const [ParadasSentido, setParadasSentido] = useState([])


    const buscarPrevisoes = (id) => {
        getContent(url+`V3/buscarPrevisoes/${id}/false/1/w/Recebe`, setProximosOnibus )
        //previsoes
    }
    const buscarLinhas = id => {
        getContent(url+`retornaLinhasQueAtendemParada/${id}/1/Recebe`, setLinhas )
    }

    const buscarParadas = (cod_parada) => {
        getContent(url + `buscarParadasPorLinha/${cod_parada}/1/Recebe`, setParadas)
    }

    const clickMenuPrevisoes = (id) => { setPagina('proximos'); buscarPrevisoes(id)}
    const clickMenuLinhasQueAtendem = (id) => { setPagina('linhas'); buscarLinhas(id)}
    const clickProximos = (o) => {setPagina('rotas'); setCodItinerario(o.codItinerario)}
    const clickParadas = (cod) => {setPagina('paradasMenu'); buscarParadas(cod)}
    const clickParadasSentido = (paradas) => {setPagina('paradas'); setParadasSentido(paradas)}




    //migracao para uso de hitórico
    

    const MudarComponente = (componente) => {
        if (componente.key !== historico[historico.length -1].key){

          setHistorico([...historico, componente]);
        }
        else{
            console.log("componente é igual ao anterior")
        }
    }
    const VoltarComponenteAnterior = () => {
        if (historico.length > 1){
            const novoHistorico =[...historico];
            novoHistorico.pop();
            setHistorico(novoHistorico);
        }

    }
    const [historico, setHistorico] = useState([<Menu key={1} props={[desc, coord, MudarComponente, id]}/>])
    const componenteAtual = useMemo(() => {return historico[historico.length - 1]}, [historico]);





    return <Popup  style={{fontSize:'24px', margin:'0px', width:"300px", height:"50%", minWidth:"300px"}}
                    className='w-full absolute min-w-fit' key={id} onClick={(e)=>{e.stopPropagation()}}>
                        <div className='min-w-72 min-h-80'>

                        
        <button onClick={VoltarComponenteAnterior}>voltar</button>
        
        {componenteAtual}
        
        {/*menu(desc, coord, clickMenuPrevisoes, clickMenuLinhasQueAtendem, id)*/}
        {Pagina === 'proximos' && Proximos(desc, ProximosOnibus, clickProximos)}
        {Pagina === 'rotas' && codItinerario !== 0 && <Rota props = {[coord, url, codItinerario, true, ]}/>}
        {Pagina === 'linhas' && Object.keys(Linhas).length > 0 && showLinhas(Linhas, clickParadas) }
        {Pagina === 'paradasMenu' && Object.keys(Paradas).length > 0 && Paradas.sucesso && <MenuParadas paradas={Paradas} callbackFn={clickParadasSentido }/>}
        {Pagina === 'paradas' && Object.keys(ParadasSentido).length > 0 && <MostrarParadas paradas={ParadasSentido}/> }
        </div>
        </Popup>


}
