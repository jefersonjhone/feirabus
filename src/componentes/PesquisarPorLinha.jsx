import { useEffect, useState, useRef, memo} from "react";
import { MapContainer, TileLayer, Marker, CircleMarker, useMap} from 'react-leaflet';
import {SquareIcon} from "./icons/Icons.jsx"
import 'leaflet/dist/leaflet.css';
import AntPath from "./AntPath"
import 'leaflet-ant-path';
import url from "../utils/urls"



function Linhas(linhas, value){
    if( linhas !== undefined ){
        if (value === null ){
            return linhas.map( li => <CardLinha Onibus={li}/> )
        }
        return linhas
            .filter( li => li.sgl.includes(value ) || li.nom.includes(value ))
            .map( li => <CardLinha Onibus={li} />)
    }
};


const parse_horarios = (horarios) =>{
    var data = {};
    horarios.forEach( h => {
        if( data[h.origem] !== undefined ){
            if (data[h.origem][h.tipoDia] !== undefined){
                data[h.origem][h.tipoDia].push(h.horario);
            }else{
                data[h.origem][h.tipoDia] = [h.horario];
            }
        }else{
            data[h.origem] = {};
            data[h.origem][h.tipoDia] = [h.horario];
        }
    })
    return data;
}


const parse_paradas = (paradas) =>{
    var data = {};
    paradas.forEach( h => {
        if( data[h.sent] !== undefined ){
            data[h.sent].push(h);
        }else{
            data[h.sent] = [h]
        }
    })
    return data;
}
//75 98253 5496

function Horarios({numero_da_linha}){
    const [horarios, SetHorarios] = useState(undefined);
    const new_url = url + `quadro-horarios/${numero_da_linha}`;

    useEffect( () => {
        if ( horarios !== undefined ){
        }else{
            fetch(new_url)
                .then( e => e.json())
                .then( e => {
                    if (e.sucesso ){
                        var data = parse_horarios(e.qros);
                        SetHorarios(data);
                    }
                })
        }
    })

    return (<>
        <div className="flex flex-col wrap mx-2">
            {horarios !== undefined && Object.keys(horarios ).map( h =>
            <div className="w-full mb-4">
                <details>
                    <summary className="p-2 bg-orange-300 mx-auto rounded-md shadow-md">
                        Saída: {h}
                    </summary>
                    <div className=" mt-2 flex flex-col flex-wrap w-full gap-2">
                        {Object.keys(horarios[h]).map( ho =>
                        <div className={` w-full rounded-md mb-4 mx-4`}>
                            {ho}
                            <div className="flex flex-row flex-wrap">
                                {horarios[h][ho].map( hor =>
                                <div className="bg-blue-200 border border-1 border-slate-800
                                    m-1 p-1 text-sm rounded-md">
                                    {hor}
                                </div>
                                )}
                            </div>
                            <hr/>
                        </div>
                        )}
                    </div>
                </details>
            </div>
            )}
        </div>
    </>)
}

function Rotas({nome_linha}){
    const new_url = url + `itinerarios-por-linha/${nome_linha}`
    const [codItinearios, setCodItinerarios] = useState(undefined);
    const [itinerarioAtivo, SetItinerarioAtivo] = useState(undefined);

    useEffect( () => {
        if (codItinearios !== undefined){

        }else{
            fetch(new_url)
                .then(e => e.json())
                .then(e => {
                    setCodItinerarios(e);
                })
        }
    })

    const MapFly = ({props}) => {
        const mapinstance = useMap();
        useEffect( () => {
            mapinstance.fitBounds(props.map(i => [i.coordY, i.coordX]))
        }, [props])
    }

    return (<>
        {codItinearios !== undefined && codItinearios.map( c =>
            itinerarioAtivo === undefined || c !== itinerarioAtivo.cod ?
                <div className="opacity-80 p-2 m-2 bg-slate-300 rounded-md cursor-pointer"
                    onClick = { e => {
                        fetch( url + `itinerarios/${c}`)
                            .then( e => e.json())
                            .then( e => {e.cod = c ; SetItinerarioAtivo(e)})
                    }}>
                    Rota nº {c}
                </div>
                :
                <div className="border border-2 border-slate-400 p-2
                    m-2 bg-orange-300 rounded-md shadow-md ">
                    Rota nº {c}
                    {itinerarioAtivo !== undefined &&
                    <div className="mx-2 p-1 rounded-md overflow-hidden">

                        <MapContainer
                            className='max-h-96 rounded-md shadow-md'
                            center={[-12.254463237869844,-38.960094451904304]}
                            zoom={13}
                            style={{ height: '', width: '100%' }} >
                            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                            <>
                                <AntPath
                                    positions={
                                        itinerarioAtivo.itinerarios.map( o =>[o.coordY, o.coordX] )}
                                    options={{
                                        delay: 2000,
                                        dashArray: [10, 20],
                                        weight: 5,
                                        color: '#000',
                                        opacity:1,
                                        hardwareAccelerated:true}} />
                                <Marker
                                    icon={SquareIcon}
                                    position={[
                                        itinerarioAtivo.itinerarios[itinerarioAtivo.itinerarios.length -1].coordY,
                                        itinerarioAtivo.itinerarios[itinerarioAtivo.itinerarios.length -1].coordX
                                    ]} />
                                <CircleMarker
                                    pathOptions={{color:'black'}}
                                    radius={8}
                                    center={[
                                        itinerarioAtivo.itinerarios[0].coordY,
                                        itinerarioAtivo.itinerarios[0].coordX
                                    ]}/>
                                <MapFly
                                    props={itinerarioAtivo.itinerarios}
                                />
                            </>
                        </MapContainer>
                    </div>
                    }
                </div>
        )}
    </>)
};




function Paradas({numero_da_linha}){
    const [paradas, SetParadas] = useState(undefined);


    useEffect( () => {
        if (paradas === undefined){
            fetch(url + `paradas-por-linha/${numero_da_linha}`)
            .then(e => e.json())
            .then(e => {
                if (e.sucesso){
                    var paradas = parse_paradas(e.paradas);
                    SetParadas(paradas);
                }
            })
        }
    })

    return (<>
        <div className="mx-2">
            {paradas !== undefined && Object.keys(paradas).map( o =>
                <details className="mb-4">
                    <summary className="p-2 bg-orange-300 mx-auto rounded-md shadow-md">
                        Saída: {o}
                    </summary>
                    <div className=" mt-2 flex flex-col flex-wrap w-full">
                        {paradas[o].map( p =>
                        <div className={` rounded-md mx-6 bg-blue-200 p-1 m-1 pl-2 shadow-md border border-1 border-slate-700 `} onClick={()=>fetch(url + `info-paradas/${p.cod}`)}>
                            {p.end}
                        </div>
                        )}
                    </div>
                </details>
            )}
        </div>
    </>)
}



export default function PesquisarPorLinha(){
    const [linhas, SetLinhas] = useState([]);
    const inputRef = useRef(null);
    const [search, SetSearch] = useState(null);

    useEffect( () => {
        if (linhas.length > 0){
        }else{
            fetch(url+"buscarlinhas")
                .then(e => e.json())
                .then(e => {
                    if (e.sucesso){
                        var data = e.linhas[0].replace(/"/g,'')
                            .replace(/'/g,'"')
                            .replace(/\//g,'|')
                            .replace(/\\/g,'|');
                        SetLinhas(JSON.parse(`[${data}]`));
                    }
                })
        }
    })
    const HandleChange = () => {
        SetSearch(inputRef.current.value.toUpperCase().trim())
    }


    return (<>
        {linhas.lenght > 1 ?
            <h1>
                {linhas.lenght()}
            </h1>

            :
            <div className="label h-fit">
                <div style={{transition:"all 1s"}} className="sticky bg-white top-0 z-10 w-full px-8 flex flex-col min-h-12 mt-12 mb-8 rounded-md">
                    <label
                        htmlFor={"search"}
                        className={`${inputRef.current !== null && inputRef.current.value?
                                "z-10 ml-4 md:ml-8 bg-white top-2 absolute md:inset-x-1/4 text-xs font-semilight text-slate-400 h-6 w-fit mb-4 "
                                :
                        "hidden"}`
                        }>
                        Pesquisar código ou nome da linha
                    </label>
                    <input
                        name="search"
                        ref={inputRef}
                        onChange={HandleChange}
                        className="sticky w-full md:w-1/2 top-0 mx-auto h-12 pl-4 m-4 shadow-md rounded-md border border-slate-300"
                        placeholder="Pesquisar código ou nome da linha"
                        type="text"
                        maxLength={20}>
                    </input>
                    <hr/>
                </div>
                <div className="md:w-1/2 m-2 md:mx-auto">
                    {Linhas(linhas, search)}
                </div>
            </div>
        }
    </>)
}

const CardLinha = ({Onibus}) => {
    const [open, SetOpen] = useState(true);
    const [componente, SetComponente] = useState(null);

    return (<>
        <div className='mx-2 rounded-md bg-gray-100
            border-black my-4 hover:bg-gray-200 shadow-md border border-1 border-slate-200 '>

            <div key={Onibus.sgl}
                className='rounded-md bg-gray-100 flex flex-row justify-evenly min-h-24 md:h-20
                text-base border-black hover:bg-gray-200 shadow-md border border-1 border-slate-200 '
                onClick={ () => { SetOpen(!open)}}>

                <div className="flex flex-col ml-4 w-1/6 md:w-1/4 h-full items-center justify-center ">
                    <div className="font-medium text-base
                        bg-gray-200 rounded-sm underline shadow-md">
                        {Onibus.sgl}
                    </div>
                    <div className='flex mt-2 justify-center mx-auto h-12 opacity-80 aspect-square'>
                        <img src="./bus_blue.png" alt="ônibus"/>
                    </div>
                </div>
                <div className='w-5/6 py-2 h-5/6 text-xs md:text-base'>
                    <div className="flex flex-row h-full">
                        <div className="flex flex-col w-full h-full min-h-20">
                            <h3 className=' text-gray-600 text-xs font-semibold text-center pb-2'>
                                {Onibus.nom}
                            </h3>
                            <div className=" w-full flex flex-row ">
                                <div className="w-full flex flex-row justify-evenly opacity- text-xs">
                                    <div className={`min-w-16 border border-1 border-slate-300 py-1 px-2 rounded-md h-fit text-center leading-3 ${ componente === "horarios" && "bg-white shadow-xl border-2"}` }
                                        onClick={ e => {
                                            e.stopPropagation();
                                            if (componente !== "horarios"){
                                                SetComponente("horarios")
                                            }else{
                                                SetComponente(undefined)
                                            }
                                        }}>

                                        <h6>Horários </h6>
                                        <div className="w-8 p-0 mx-auto  aspect-square ">
                                            <img src={"./icons8-relógio-94.png "} alt="Horários"/>
                                        </div>
                                    </div>
                                    <div className={`min-w-16 border border-1 border-slate-300 py-1
                                        px-2 rounded-md h-fit text-center leading-3  ${ componente === "rotas" && "bg-white shadow-xl border-2"}` }
                                        onClick={ e => {
                                            e.stopPropagation();
                                            if (componente !== "rotas"){
                                                SetComponente("rotas");
                                            }else{
                                                SetComponente(undefined)
                                            }
                                        }}>
                                        <h6>Rotas </h6>
                                        <div className="w-8 mx-auto aspect-square">
                                            <img src={"./icons8-viagem-94.png"} alt="Rotas"/>
                                        </div>
                                    </div>
                                    <div className={`min-w-16 border border-1 border-slate-300 py-1
                                        px-2 rounded-md h-fit text-center leading-3 ${ componente === "paradas" && "bg-white shadow-xl border-2"} `}
                                        onClick={ e => {
                                            e.stopPropagation();
                                            if (componente !== "paradas"){
                                                SetComponente("paradas");
                                            }else{
                                                SetComponente(undefined)
                                            }
                                        }}>
                                        <h6>Paradas</h6>
                                        <div className="w-8 mx-auto aspect-square">
                                            <img src={"./map-purple.png "} alt="Mapa"/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
            <div className="h-fit bg-slate-100 rounded-md my-2">

                {componente === "horarios" && <Horarios numero_da_linha={Onibus.cod}/> }
                {componente === "rotas" && <Rotas nome_linha={Onibus.sgl}/>}
                {componente === "paradas" && <Paradas numero_da_linha={Onibus.cod}/>}
            </div>
        </div>
    </>)
}


