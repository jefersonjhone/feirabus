import { Link } from 'react-router-dom'
import { useMemo, useState } from 'react'
import Navbar from '../componentes/navbar'
import { Helmet } from 'react-helmet'
import {
  Seta,
  Relogio,
  PinoLocalizacao,
  Onibus,
  Sino,
  Lupa,
  Estrela,
  Rota,
  Rotag,
  RotaComBandeira,
  Horarios,
} from '../componentes/icons'
import AcessoRapido from '../componentes/card-acesso-rapido'
import LinhasPopulares from '../componentes/card-linhas-populares'
import CardPrevisoes from '../componentes/card-previsoes'
import CardParadasProximas from '../componentes/card-parada-proximas'
import Footer from '../componentes/footer'
import CardBuscarRota from '../componentes/card-buscar-rota'
import CardBuscarParada from '../componentes/card-buscar-parada'

export default function Home() {
  const [pagina, SetPagina] = useState(0)
  const [op_ativa, setOpAtiva] = useState(0)

  const menu = useMemo(() => {
    const opcoes_label = ['Encontrar parada', 'Encontrar rota']
    return (
      <>
        <Helmet>
          <title>FeiraBus - Seu guia de ônibus de Feira de Santana</title>
          <meta
            name="description"
            content="Consulte horários, itinerários, paradas e linhas do transporte coletivo de Feira de Santana - Bahia. Encontre o próximo ônibus em tempo real e planeje sua rota pela cidade com rapidez e praticidade."
          />
        </Helmet>
        <div className="h-screen">
          <Navbar page={' '} />
          <main className="h-full relative md:h-3/5 bg-gradient-to-r from-sky-300 to-indigo-500  overflow-hidden">
            <div className=" absolute top-0 sm:h-full sm:w-1/2 md:w-1/3 z-10 overflow-hidden opacity-60 ">
              <img
                className="h-full w-full"
                src="./bus-front-line-art.png"
                alt=""
                srcset=""
              />
            </div>
            <div className="flex bg-red-00 h-full relative  flex-col items-center  gap-4 p-2 max-w-[1200px] mx-auto overflow-hidden z-20">
              <div className="h-1/2 flex flex-col justify-center text-white font-bold text-4xl md:text-5xl text-center p-2 ">
                <h1>
                  Seu guia de ônibus da cidade.
                  <br />
                  simples, organizado e direto.
                </h1>
              </div>
              <div className="text-gray-200 text-center text-lg text-2xl font-medium">
                Sem telas escondidas. Procurou, achou. Informação fácil, do
                jeito certo.
              </div>
              <div className="bg-white w-full md:w-2/3 rounded-md p-2 max-w-[800px]">
                <div className="flex gap-2 bg-gray-200 rounded-md h-10 p-1 ">
                  {opcoes_label.map((op, i) => (
                    <p
                      className={`flex items-center justify-center h-full w-1/2 rounded-md text-center font-medium text-gray-700 cursor-pointer ${op_ativa === i ? 'bg-white' : ''}`}
                      onMouseDown={() => {
                        setOpAtiva(i)
                      }}
                    >
                      {i === 0 ? (
                        <PinoLocalizacao className="h-4" />
                      ) : (
                        <RotaComBandeira className="h-4" />
                      )}
                      {op}
                    </p>
                  ))}
                </div>
                <div className="py-4 ">
                  <div style={{ display: op_ativa === 0 ? '' : 'none' }}>
                    <CardBuscarParada />
                  </div>
                  <div style={{ display: op_ativa === 1 ? '' : 'none' }}>
                    <CardBuscarRota />
                  </div>
                </div>
              </div>
              {/*cards*/}
              <div className="flex flex-row gap-4 flex-wrap justify-center">
                <div className="flex flex-row items-center gap-2 py-2 px-4 border border-1 border-white rounded-md font-medium text-white bg-white/10 hover:bg-white-20 hover:text-slate-900">
                  <Relogio className="h-4" /> Horários
                </div>
                <div className="flex flex-row items-center gap-2 py-2 px-4 border border-1 border-white rounded-md font-medium text-white bg-white/10 hover:bg-white-20 hover:text-slate-900">
                  <PinoLocalizacao className="h-4" /> Mapa em tempo real
                </div>
                <div className="flex flex-row items-center gap-2 py-2 px-4 border border-1 border-white rounded-md font-medium text-white bg-white/10 hover:bg-white-20 hover:text-slate-900">
                  {<Sino className="h-4" />}
                  Serviços de alerta
                </div>
              </div>
            </div>
          </main>

          <div className="container px-4 py-8">
            <AcessoRapido />

            <LinhasPopulares />

            <section className="mb-10 max-w-[1200px] mx-auto mt-20">
              <div className="my-10 grid gap-6 md:grid-cols-3 rounded-md ">
                <CardParadasProximas />
                <CardPrevisoes />
              </div>
            </section>
          </div>
          {/*Featured destinations*/}
          {/*
        <section className="mb-10 max-w-[1200px] mx-auto ">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-indigo-500">
              Destinos em destaque
            </h2>
            <button
              variant="ghost"
              className="flex items-center text-blue-600 hover:text-blue-700"
            >
              View All {<Seta />}
            </button>
          </div>
        </section>*}
        {/*footer*/}
          <Footer />
        </div>
      </>
    )
  }, [op_ativa])
  return <>{menu}</>
}
