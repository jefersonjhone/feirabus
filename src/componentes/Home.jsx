import {Link} from "react-router-dom";
import getContent from "../utils/getContent"
import {useMemo, useState} from "react";

export default function Home(){
    const menu = useMemo (() =>{
        const opcoes = {
            "Encontrar no mapa" : "explorar",
            "Minhas paradas" : "favoritos",
            "Pesquisar por linha" : "pesquisar-linha",
            "Paradas proximas" : "paradas-proximas",
            "Sobre" : "sobre"
        }
        return <>
            <div className="container flex flex-column w-full h-screen text-center align-center justify-center">
                <div className="h-full text-xl flex flex-col justify-center text-center">
                    {Object.keys(opcoes).map(
                    op => <Link key={opcoes[op]} className="flex flex-row shadow-md align-center bg-gray-100 m-2 rounded-md" to={opcoes[op].replaceAll(" ", "-")}>
                            <img className="w-16 m-2 " style={{filter: "drop-shadow(1px 20px 8px #a6abad)"}} src={'./'+opcoes[op]+'.png'}alt={`${op}`}></img>
                            <p className="mb-auto mt-auto m-2">
                              {op}
                            </p>
                        </Link>
                    )}
                </div>
            </div>
        </>

    })
    return <>{menu}</>
}
