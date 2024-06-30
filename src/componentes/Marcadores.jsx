import { Marker } from "react-leaflet";
import { useMap } from "react-leaflet";
import {ClickIcon, alfineteIcon, ParadaIconSelected, MarkerPurpleIcon} from './icons/Icons.jsx';

export function Marcador({coord, icon, id, desc, clickFn, zindex, opacity}){
    return (<>
        <Marker
            position={coord}
            zIndexOffset={zindex}
            opacity={opacity}
            icon={icon }
            eventHandlers={{click: () => { if (clickFn !== undefined){clickFn()}}}}>
            {/* id !== null && <PopUpMenu key={id} infos={[id, coord, desc]}/> */}
        </Marker>
    </>)
}



export function Marcadores({props}){
    const [pontosProximos, LocalPontosProximos, localAtivo, setLocalAtivo] = props;
    const map = useMap();

    return (<>
        {Object.keys(LocalPontosProximos).length !== 0 &&
            <Marcador
                coord={[LocalPontosProximos.lat, LocalPontosProximos.lng]}
                icon={alfineteIcon}
                id={null}
                desc={"Local selecionado"}
            />
        }
        {pontosProximos.paradas !== undefined && pontosProximos.paradas.map(
            p =>{
                return p.cod === localAtivo.cod ?
                    <Marcador
                        key={p.cod}
                        coord={[p.y, p.x]}
                        icon={ParadaIconSelected}
                        id={p.cod}
                        desc={p.desc}
                        zindex={10000}
                        opacity={1}
                    /> :
                    <Marcador
                        key={p.cod}
                        coord={[p.y, p.x]}
                        icon={MarkerPurpleIcon}
                        id={p.cod}
                        desc={p.desc}
                        zindex={10}
                        opacity={.8}
                        clickFn={ ()=>{ setLocalAtivo(p) }}
                    />
            }
        )}
        </>)

}