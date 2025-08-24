import { useNavigate, useSearchParams } from 'react-router-dom'
import CardBuscarRota from '../componentes/card-buscar-rota'
import Navbar from '../componentes/navbar'
import { useState } from 'react'

export function Rotas() {
  const [params] = useSearchParams()
  const navigate = useNavigate()

  const codInit = params.get('codInit')
  const codDest = params.get('codDest')

  const handle_open = (codInit, codDest) => {
    params.set('codInit', codInit)
    params.set('codDest', codDest)
    navigate({ search: params.toString() }, { replace: true })
  }

  const handle_exit = () => {
    params.delete('codInit')
    params.delete('codDest')
    navigate({ search: params.toString() }, { replace: true })
  }

  return (
    <>
      <Navbar page="rotas" />
      <div className="bg-white mx-auto w-full md:w-2/3 rounded-md p-2 max-w-[800px]">
        <div className="py-4 ">
          <div>
            <CardBuscarRota i={{ cod: codInit }} d={{ cod: codDest }} />
          </div>
        </div>
      </div>
    </>
  )
}
