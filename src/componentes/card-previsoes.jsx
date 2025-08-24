import { useEffect, useRef, useState } from 'react';
import { useFetch } from '../hooks/useFetch'
import { Editar, Lupa, Onibus, Seta } from './icons'
import { Modal } from './modal';


export default function CardPrevisoes() {

  const [page, setPage] = useState(0);
  const inputRef = useRef(null);
  const colors = ['#8339a8', '#5025c7', '#3c1cb5', '#3a2e85', '#2813a2'];
  const [parada_selecionada, setParadaSelecionada] = useState(4940);
  const url = process.env.REACT_APP_API_URL + `/paradas/${parada_selecionada}/previsoes`;
  const {
    loading: loading_prev,
    data: previsoes,
    error: error_previsoes,
  } = useFetch(url)

  return (
    <div className="md:col-span-2 shadow-md rounded-md border ">
      {page === 1 && <Modal handle_exit={()=>{setPage(0)}}> 
        <div className='flex flex-col'>
          <div className='text-center font-medium'>
            Insira o codigo da parada
             <div
              style={{ transition: 'all 1s' }}
              className="flex flex-row items-center gap-2 sticky bg-white top-0 z-10 w-full  px-2 md:px-8 md:min-h-12 md:mt-8 md:mb-8 rounded-md"
            >
              <label
                htmlFor={'search'}
                className={`${
                  inputRef.current !== null && inputRef.current.value
                    ? 'z-10 bg-white top-2 absolute ml-4 mdd:inset-x-1/4 text-xs font-semilight text-purple-800 font-medium w-fit mb-2 px-1'
                    : 'hidden'
                }`}
              >
              Código da parada 
              </label>
              <div className="relative w-full">
                <span className="absolute pl-3 text-gray-400 h-full flex items-center z-30">
                  <Lupa />
                </span>
                <input
                  name="search"
                  id="search"
                  ref={inputRef}
                  className={`border border-1 border-gray-200 rounded-md w-full pl-10 pr-4 h-10 text-sm font-medium focus:outline focus:outline-offset-1 focus:outline-gray-300 sticky top-0 mx-auto m-4 shadow-md rounded-md   ${inputRef.current !== null && inputRef.current.value ? 'border-purple-700' : ''}`}
                  placeholder="Código da parada"
                  type="search"
                  maxLength={20}
                ></input>
              </div>
            </div>
          </div>
          <div className='fixed bottom-10 w-full flex items-center'>
            <button 
              className="bg-green-500 hover:bg-green-700 text-white font-semibold rounded-lg px-4 py-2 shadow-lg max-w-24 mx-auto "
              onMouseDown={()=>{setParadaSelecionada(inputRef.current.value); setPage(0)}}>salvar</button>
          </div>
        </div>
      </Modal>
        }
      <div className="p-0">
        <div className="h-2 bg-gradient-to-r from-sky-200 to-sky-300 transition-all duration-300 ease-in-out mb-2 "></div>
        <div className="border-b p-4">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-lg font-semibold">
              Atualizações em tempo real para
              <span className="flex items-center justify-center nowrap border p-1 rounded-md border-slate-500 text-slate-500 cursor-pointer text-sm" onMouseDown={()=>{setPage(1)}}>
                {parada_selecionada}<Editar className="h-4"/> 
              </span>
            </h3>
            <div className="flex items-center gap-1 rounded-full bg-green-100 px-2 py-1 text-xs text-green-700">
              <span className="h-2 w-2 rounded-full bg-green-500"></span>
              Atualizado em : {previsoes?.horaConsulta}
            </div>
          </div>
        </div>

        <div className="grid divide- gap-1 p-2">
          {previsoes &&
            previsoes.previsoes.slice(0, 10).map((pr, i) => (
              <div key={i} className="px-2 py-1 shadow-sm rounded-md border transform transition-transform duration-200 hover:scale-105 hover:scale-y-110 hover:border-slate-300 hover:shadow-lg hover:bg-white hover:z-10">
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="flex gap-2 p-2 items-center justify-center rounded-md text-white  font-bold"
                      style={{ backgroundColor: colors[i%5] || '#1616d3ff' }}
                    >
                      <Onibus />
                      {pr.sgLin}
                    </div>
                    <div>
                      <div className="font-semibold text-sm">{pr.apelidoLinha}</div>
                      <div className="flex items-center gap-1 text-xs text-gray-800">
                       {pr.numVeicGestor && <><Onibus className="h-3"/> Veículo {pr.numVeicGestor}</>}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-sm font-bold text-green-600 "}`}>
                      {pr.prev}
                    </div>
                    <div
                      className={`flex items-center gap-1 text-xs ${
                        pr.status === 'delayed'
                          ? 'text-red-600'
                          : pr.status === 'early'
                            ? 'text-amber-600'
                            : 'text-green-600'
                      }`}
                    ></div>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">
                    {pr.prev.startsWith('SAÍDA')
                      ? 'Saindo de '
                      : 'Passando em '}
                  </span>
                  <span className="flex items-center text-blue-600 cursor-pointer hover:text-blue-800 hover:font-medium">
                    View Details{' '}
                    <span>
                      {' '}
                      <Seta />
                    </span>
                  </span>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}
