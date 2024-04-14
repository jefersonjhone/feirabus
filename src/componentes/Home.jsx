import {Link} from "react-router-dom";
import getContent from "../utils/getContent"
import {useMemo, useState} from "react";

export default function Home(){
    var opcoes = ["Encontrar no mapa", "Minhas paradas", "Pesquisar por linha", "Paradas proximas", "Sobre"]
    const menu = useMemo (() =>{
        return <div className="container flex flex-column w-full h-screen text-center align-center justify-center">
                <div className="h-full text-xl flex flex-col justify-center text-center">
                    {opcoes.map((op)=>
                        {return <Link key={op} className="flex flex-row shadow-md align-center bg-gray-100 m-2 rounded-md" to={op.replaceAll(" ", "-")}>
                            <img className="w-16 m-2 " style={{filter: "drop-shadow(1px 20px 8px #a6abad)"}} src={'./'+op+'.png'}alt="react-logo">

                    </img>
                    <p className="mb-auto mt-auto m-2">{op} </p></Link>})}
                </div>
            </div>

    }, [opcoes])
    return <>{menu}</>
}
