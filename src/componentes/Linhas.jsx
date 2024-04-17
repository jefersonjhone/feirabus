import { useEffect, useState } from "react";
import url from "../utils/urls";
import getContent from "../utils/getContent";
import { MenuParadas } from "./PopUpPontos/MostrarParadas";





const Linhas = ({props}) => {
    const [LinhasQueAtendem, setLinhasQueAtendem] = useState({})
    const [idlinha, MudarComponente] = props

    useEffect(()=>{getContent(url+`linhas-que-atendem/${idlinha}`, setLinhasQueAtendem )},[idlinha])
    if (LinhasQueAtendem.sucesso){
    return (<>
        <div className=" bg-gray-100 rounded-md">
                {LinhasQueAtendem.linhas.map(linha=> {
                        return <div className=''>
                                <div key={linha.cod_linha}
                                    id={linha.cod_linha}
                                    className='border border-solid border-gray-500 my-1 shadow-inner overflow-hidden flex flex-row rounded-md h-16 text-center'
                                    onClick={(e)=>{e.stopPropagation(); MudarComponente(<MenuParadas key={4} props={[linha.cod_linha, MudarComponente]} />) }}
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
                            </div>
                })}
        </div>
    </>)
    }}

export default Linhas;
