import {useEffect, useState} from "react";
import url from "../../utils/urls";
import getContent from "../../utils/getContent";
import Proximos from "./Proximos";



export const MenuParadas = ({props}) => {
    const [cod_parada, MudarComponente] = props; 
    const [Paradas, setParadas] = useState({});
    var paradasSplited = {};
    useEffect(()=>{
        getContent(url + `buscarParadasPorLinha/${cod_parada}/1/Recebe`, setParadas)
        
    },[cod_parada])
    if (Object.keys(Paradas).length > 0 && Paradas.sucesso){
        Paradas.paradas.forEach((parada) => {
            if (parada.sent in paradasSplited){
                paradasSplited[parada.sent].push(parada)
            }
            else {
                paradasSplited[parada.sent] = [parada] }
        })
    }
    console.log(paradasSplited, typeof MudarComponente)
    

    return (<><div className="flex min-w-fit w-full align-center rounded-md min-h-80 ">
                <div className='bg-red-400 flex flex-col rounded-md shadow-inner m-auto'>
                    {Object.keys(paradasSplited).map(o =>{

                        return <div className="p-2 m-2 bg-gray-100 rounded-md font-semibold shadow-md cursor-pointer " onClick={(e)=>{e.stopPropagation(); MudarComponente(<MostrarParadas key={5} props={[paradasSplited[o], MudarComponente]}/>) }}> <p className="">SAÍDA: {o}</p>
                    </div>
                    })}
                </div>
        </div>
    </>);
}
export const MostrarParadas = ({props}) => {
    const [paradas, MudarComponente] = props

    return <div className= "" style={{maxHeight:'300px', overflow:'scroll'}}> paradas: {paradas.map(e=> {
        return <div className=''>
            <div key={e.cod}
                id={e.cod}
                className='border-solid border-gray-700 border my-1 shadow-inner flex flex-row rounded-md h-14 text-center'
                onClick={(o)=>{o.stopPropagation();console.log(e);MudarComponente(<Proximos key={10} props={[e.end, MudarComponente, e.cod, [0,0]]} />)}}>
                <div className='w-1/4 bg-gray-200 p-0 ' >
                <img className='mx-auto'
                    style={{marginTop:"4px", filter: "drop-shadow(1px 20px 8px #a6abad)"}}
                    src={'./marker-icon.png'}
                    alt={"icone do onibus"}
                    width={'20px'}/>

                    <p style={{margin: "0px"}} className='h-1 font-semibold' >
                        {e.cod}
                    </p>

                    </div>

                    <div className='w-3/4 bg-blue-200 flex flex-col justify-start '>
                        <p style={{margin: "0px", marginTop:"4px", fontSize:"0.6rem"}}
                            className='text-base font-semibold text-gray-700 mx-auto'>
                            {e.end}
                        </p>

                    </div>
                </div>
            </div>
    })}</div>
    }



