import { useState } from 'react'
import { AnimatePresence } from 'motion/react'
import Navbar from '../componentes/navbar'
import { Helmet } from 'react-helmet'
import { Clock, MapPin, Bell, Crosshair } from '@phosphor-icons/react'
import { RotaComBandeira } from '../componentes/icons'
import AcessoRapido from '../componentes/card-acesso-rapido'
import LinhasPopulares from '../componentes/card-linhas-populares'
import CardSaidasTerminal from '../componentes/card-saidas-terminal'
import CardRedeTerminais from '../componentes/card-rede-terminais'
import Footer from '../componentes/footer'
import CardBuscarRota from '../componentes/card-buscar-rota'
import CardBuscarParada from '../componentes/card-buscar-parada'
import InstallPrompt from '../componentes/install-prompt'
import { useInstallPrompt } from '../hooks/useInstallPrompt'

export default function Home() {
  const [op_ativa, setOpAtiva] = useState(0)
  const { isInstallable, isIOS, install, dismiss } = useInstallPrompt()

  const opcoes_label = ['Encontrar parada', 'Encontrar rota']

  return (
    <>
      <Helmet>
        <title>FeiraBus | Linhas, Horários, Rotas e Paradas de Ônibus de Feira de Santana</title>
        <meta name="description" content="Consulte linhas de ônibus, horários, itinerários, paradas e localização de veículos em tempo real em Feira de Santana - BA. Planeje rotas, encontre pontos próximos e acompanhe o transporte público da cidade." />
        <meta name="robots" content="index,follow" />
        <link rel="canonical" href="https://feirabus.vercel.app/" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://feirabus.vercel.app/" />
        <meta property="og:title" content="FeiraBus | Guia de Transporte Público de Feira de Santana" />
        <meta property="og:description" content="Consulte linhas, horários, itinerários, paradas e localização de ônibus em tempo real em Feira de Santana." />
        <meta property="og:image" content="https://feirabus.vercel.app/logo_feirabus.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="FeiraBus | Transporte Público de Feira de Santana" />
        <meta name="twitter:description" content="Consulte linhas, horários, rotas, paradas e localização de ônibus em Feira de Santana." />
        <meta name="twitter:image" content="https://feirabus.vercel.app/logo_feirabus.png" />
      </Helmet>
      <div>
        <Navbar page=" " />
        <main className="min-h-[70dvh] md:min-h-[60dvh] relative flex flex-col bg-gradient-to-br from-[#5a7fa8] via-[#6b8fb8] to-[#4a6f98] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-white/5 via-transparent to-black/10 z-10" />
          <div className="absolute top-0 right-0 w-[45rem] h-[45rem] rounded-full bg-[#8ab4d8]/15 blur-[140px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[40rem] h-[40rem] rounded-full bg-[#a0c4e0]/10 blur-[120px] pointer-events-none" />
          <div className="absolute top-1/3 right-1/3 w-[25rem] h-[25rem] rounded-full bg-white/10 blur-[100px] pointer-events-none" />
          <div className="absolute top-0 right-0 h-full w-full sm:w-2/3 md:w-1/2 z-10 pointer-events-none -mt-6 sm:mt-0">
            <div className="absolute inset-0 bg-gradient-to-l from-[#8ab4d8]/8 via-transparent to-transparent" />
            <img
              className="h-full w-full object-contain object-right opacity-20 sm:opacity-15 md:opacity-20 saturate-[0.1]"
              src="./bus-crop-line-art.png"
              alt=""
            />
          </div>
          <div className="flex flex-1 flex-col items-center pt-16 md:pt-24 gap-5 md:gap-6 px-2 md:px-4 max-w-[1200px] mx-auto z-20">
            <div className="flex flex-col justify-center font-bold text-3xl md:text-5xl text-center text-balance md:mb-2 max-w-4xl">
              <h1 className="text-white">
                Seu guia de ônibus da cidade. Simples, organizado e direto.
              </h1>
            </div>
            <h2 className="text-white/80 text-center text-sm md:text-lg font-medium max-w-xl">
              Sem telas escondidas. Procurou, achou. Informação fácil, do jeito certo.
            </h2>
            <div className="relative z-10 p-[2px] rounded-2xl bg-gradient-to-b from-white/30 to-white/10 w-full md:w-2/3 max-w-[840px] mt-16">
              <div className="rounded-[calc(1rem-2px)] bg-white px-4 md:px-6 py-4 md:py-5 shadow-[0_8px_32px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.9)]">
              <div className="flex gap-2 bg-gray-100 rounded-xl h-10 p-1 mb-3">
                {opcoes_label.map((op, i) => (
                  <p
                    key={op}
                    className={`flex items-center justify-center gap-1.5 h-full w-1/2 rounded-lg text-center font-medium text-sm cursor-pointer transition-all duration-200 ease-[cubic-bezier(0.32,0.72,0,1)] ${
                      op_ativa === i
                        ? 'bg-white shadow-sm text-gray-900'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                    onMouseDown={() => setOpAtiva(i)}
                  >
                    {i === 0 ? (
                      <MapPin className="h-4" />
                    ) : (
                      <RotaComBandeira className="h-4" />
                    )}
                    {op}
                  </p>
                ))}
              </div>
              <div className="flex flex-col gap-4">
                {op_ativa === 0 && <CardBuscarParada />}
                {op_ativa === 1 && <CardBuscarRota showMap={false} />}
              </div>
            </div>
            </div>
            <div className="flex flex-row gap-2 flex-wrap justify-center">
              <div className="flex flex-row items-center gap-2 py-1.5 px-3 md:py-2 md:px-4 border border-white/15 rounded-lg font-medium text-white/80 bg-white/8 hover:bg-white/12 transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] text-xs md:text-sm cursor-default">
                <Clock className="h-4" /> Horários
              </div>
              <div className="flex flex-row items-center gap-2 py-1.5 px-3 md:py-2 md:px-4 border border-white/15 rounded-lg font-medium text-white/80 bg-white/8 hover:bg-white/12 transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] text-xs md:text-sm cursor-default">
                <Crosshair className="h-4" /> Veículos
              </div>
              <div className="flex flex-row items-center gap-2 py-1.5 px-3 md:py-2 md:px-4 border border-white/15 rounded-lg font-medium text-white/80 bg-white/8 hover:bg-white/12 transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] text-xs md:text-sm cursor-default">
                <Bell className="h-4" />
                Alertas 
              </div>
            </div>
          </div>
        </main>

        <div className="max-w-[1200px] mx-auto px-4 py-24 space-y-32">
            <AcessoRapido />
            
            <LinhasPopulares />
            <CardSaidasTerminal />
            <CardRedeTerminais />
            <AnimatePresence>
                          {isInstallable && <InstallPrompt onInstall={install} onDismiss={dismiss} isIOS={isIOS} />}
                        </AnimatePresence>
            <Footer />
        </div>
      </div>
    </>
  )
}
