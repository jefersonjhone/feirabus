import { useEffect, useState } from "react";

export default function PesquisarPorLinha(){
    const [linhas, SetLinhas] = useState([]);
    useEffect(()=>{
        if (linhas.length > 0){return}
        var url = 'http://fsa.siumobile.com.br:6060/siumobile-ws-v01/rest/ws/';
        window.Recebe = function(data){
            if (data.sucesso){
                SetLinhas(data.linhas);
            }
        }

        window.$.ajax({
            url: url + `buscarLinhas/Recebe`,
            type:  'GET',
            crossDomain: true,
            dataType: 'jsonp',
            async : true,
            timeout: 45000,
            cache: false,
            error: (e)=>{},
        })
        return () => {delete window.Recebe}
    });
return (<>
    {
        linhas.lenght > 1 ?
        <h1>{linhas.lenght}</h1> :
        <h1>nao foi : {linhas}</h1>}</>
)}
