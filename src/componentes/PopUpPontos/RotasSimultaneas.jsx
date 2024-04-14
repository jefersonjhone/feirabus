import {useEffect, useState} from "react";
import getContent from "../../utils/getContent";
import url from "../../utils/urls";
import AntPath from "../AntPath";
import {itinerarios_1534, itinerarios_797} from "../../mock_dados";
import {Popup, Tooltip} from "react-leaflet";


const RotasSimultaneas = ({props}) => {
    const [ListaItinerarios] = props;
    const [Itinerarios, setItinerairios] = useState([])
    const Iti_mock = [itinerarios_797, itinerarios_1534]


    const cores = ['blue', 'red', 'green', 'orange', 'gray', 'pink' ]
    const AdicionarItinerario = (itinerario) => {
        setItinerairios( itinerario => [...Itinerarios, itinerario]);
    }
    useEffect(
        ()=>{
            ListaItinerarios.forEach(numItinerario => {
                getContent(url+`V3/buscarItinerario/${numItinerario}/1/w/Recebe`, AdicionarItinerario);
            });
        },[ListaItinerarios])

    const data = Iti_mock.map( (element, index) => <AntPath positions={element.itinerarios.map((o)=>[o.coordY, o.coordX])} options={{ delay: 600, dashArray: [1, 10], weight: 4, color:cores[index], hardwareAccelerated: true}}/>)
    return (<>
        {data}

        <div className="absolute end-0 w-1/5 mr-4 bg-gray-100 rounded-md border border-solid border-gray-900 m-1" style={{zIndex:500}}>
            {Iti_mock.map((e,i)=>{
                return (<>
                    <div className="flex flex-row align-center">
                        <div className="border border-solid border-gray-900 w-8 h-8 text-center text-white text-bold text-xl m-1 opacity-60 rounded-md " style={{ backgroundColor: cores[i]}}>

                        </div>
                        <h3 className="m-auto mr-1 text-base">1{i}0{i}</h3>
                    </div>
                    <hr className="text-red-900"/>
                </>)})}
        </div>
        </>)

}

export default RotasSimultaneas;
