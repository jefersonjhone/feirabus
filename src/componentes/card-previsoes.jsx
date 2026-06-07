import { useEffect, useRef, useState } from 'react';
import { useFetch } from '../hooks/useFetch'
import { Editar, Lupa, Onibus, Seta } from './icons'
import { Modal } from './modal';
import InputParadas from './input-paradas';
import Mapa from './card-map-view';
import { Link } from 'react-router-dom'


export default function CardPrevisoes() {

  const [page, setPage] = useState(0);
  const inputRef = useRef(null);
  const colors = ['#8339a8', '#5025c7', '#3c1cb5', '#3a2e85', '#2813a2'];
  const [parada_selecionada, setParadaSelecionada] = useState( {
        "cod": 4975,
        "desc": "TERMINAL CENTRAL (SAIDA)",
        "end": "TERMINAL CENTRAL (SAIDA)",
        "sent": "TERMINAL CENTRAL",
        "x": -38.972522,
        "y": -12.254389
      },
  );
      
  const url = process.env.REACT_APP_API_URL + `/paradas/${parada_selecionada.cod}/previsoes`;
  const {
    loading: loading_prev,
    data: previsoes,
    error: error_previsoes,
  } = useFetch(url)

  const handleSelectParada = (value) => {
    setParadaSelecionada(value); setPage(0)
  }
  return (<div className='grid grid-flow-row md:grid-cols-2 '>
    <div className="mb-6 flex items-center justify-between">
            <h2 className="text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-b  from-sky-500 to-indigo-500">
              Proximos Ônibus
            </h2>
       
    </div>
    <div className="md:col-span-2 shadow-md rounded-md border ">
      {page === 1 && <Modal handle_exit={() => { setPage(0) }}> 
        <div className='flex flex-col'>
          <div className='text-center font-medium'>
            Insira o codigo da parada
             <div
              style={{ transition: 'all 1s' }}
              className="flex flex-row items-center gap-2 sticky bg-white top-0 z-10 w-full  px-2 md:px-8 md:min-h-12 md:mt-8 md:mb-8 rounded-md"
            >
              <InputParadas setValue={handleSelectParada}/>
              
            </div>
          </div>
          </div>
      </Modal>
        }

      <div className="">
        <div className="p-2 md:p-4 shadow-md">
          <div className="mb-2 flex flex-row items-center justify-between gap-2">
            <h3 className="md:text-lg  text-nowrap flex flex-col md:flex-row gap-2 tracking-tight ">
              Previsões em tempo real para
              <span className="flex items-center justify-center nowrap border p-1 rounded-md border-violet-600 text-violet-600 cursor-pointer  text-xs font-bold md:text-sm"
                onMouseDown={() => { setPage(1) }}>
                {parada_selecionada.desc?parada_selecionada.desc:parada_selecionada.end}<Editar className="h-4"/> 
              </span>
            </h3>
            <div className="flex flex-col rounded-md  bg-slate-100 px-1 py-1 text-xs  text-slate-700">
              Atualizado em :
              <span className='flex items-center gap-1 text-nowrap text-emerald-600 '>
                <span className="h-2 w-2 rounded-full bg-green-500 "></span>
                {previsoes?.horaConsulta}
              </span>
            </div>
            
          </div>
        </div>

        <div className=" grid md:grid-cols-2 border border-1 rounded-md pt-4">
          
          {page === 0 &&
            <div className='p-2 md:px-4'>
              <Mapa parada_selecionada={parada_selecionada} />
            </div>
          }
          <div className="grid  gap-2 px-1 md:px-4 pt-4 shadow-inner h-72 sm:h-[600px] overflow-y-scroll overflow-x-hidden  ">
            {previsoes &&
              previsoes.previsoes.slice(1,6).map((pr, i) => (
                <Link
                  to={`/linhas/${pr.sgLin}`}
                  key={i}
                  className="px-2 max-h-24 py-1 shadow-sm rounded-md border transform  transition-transform duration-300
                  hover:scale-105 hover:scale-y-110 hover:border-slate-300 hover:shadow-lg hover:bg-white hover:z-10"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className="flex gap-2 p-2 items-center justify-center rounded-md text-violet-700 border-2  border-violet-700   font-bold"
                        
                      >
                        <Onibus />
                        {pr.sgLin}
                      </div>
                      <div>
                        <div className="font text-sm">{pr.apelidoLinha}</div>
                        <div className="flex items-center gap-1 text-xs text-gray-800">
                        {pr.numVeicGestor && <><Onibus className="h-3"/> Veículo {pr.numVeicGestor}</>}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs bg-emerald-200/40 p-1  px-2 rounded-md text-emerald-700 text-nowrap">
                        {pr.prev}
                      </div>
                    
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs hidden">
                    <span className="flex items-center text-blue-600 cursor-pointer hover:text-blue-800 hover:font-medium">
                      View Details{' '}
                      <span>
                        {' '}
                        <Seta />
                      </span>
                    </span>
                  </div>
                </Link>
              ))}
            <div className='w-full flex py-2'>
              <a className='mx-auto underline text-blue-600 font-medium text-sm px-2 ' href={`/paradas/${parada_selecionada.cod}/?tab=previsoes`}>
                Ver todas as previsões para {parada_selecionada.desc}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  )
}
