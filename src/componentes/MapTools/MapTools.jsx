import { useMap } from "react-leaflet";
import { useMapEvent } from "react-leaflet";
import url from "../../utils/urls";
import getContent from "../../utils/getContent";
import { useEffect } from "react";
import isEmpty from "../../utils/isEmpty";

export const MapClick = ({props}) =>{
    const [setPontosProximos,
        setLocalPontosProximos,
        localAtivo, setRotaAtiva] = props;

    const map = useMapEvent('click', (e) => {

        if (!isEmpty(localAtivo)){
            var mudarlocal = window.confirm("mudar local selecionado");
            if (!mudarlocal){
                return
            }
        }
        map.flyTo(e.latlng, 16);
        setLocalPontosProximos(e.latlng);
        setRotaAtiva({});
        getContent(
            url + `paradas-proximas/${e.latlng.lng}/${e.latlng.lat}`,
            setPontosProximos
        )
    })
}


export const MapFly = ({props}) =>{
    const localAtivo = props
    const mapinstance = useMap();

    useEffect(()=>{
        if ( localAtivo !== undefined && Object.keys(localAtivo).length > 0) {
            mapinstance.flyTo([localAtivo.y,localAtivo.x], 16)
        }
    }, [localAtivo])
}
