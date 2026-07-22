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
        <main className="min-h-[70dvh] md:min-h-[60dvh] relative flex flex-col bg-gradient-to-r from-sky-300 to-indigo-500 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-transparent to-black/15 md:from-black/10 md:to-black/30 z-10" />
          <div className="absolute top-0 sm:h-full sm:w-1/2 md:w-1/3 z-10 overflow-hidden opacity-70 blur-[2px] ">
            <img className="h-full w-full" src="./bus-front-line-art.png" alt="" />
          </div>
          <div className="flex flex-1 flex-col items-center justify-center gap-4 md:gap-5 px-2 md:px-4 max-w-[1200px] mx-auto z-20">
            <div className="flex flex-col justify-center text-white font-bold text-3xl md:text-5xl text-center text-balance [text-shadow:0_2px_4px_rgba(0,0,0,0.15)]">
              <h1>
                Seu guia de ônibus da cidade. Simples, organizado e direto.
              </h1>
            </div>
            <h2 className="text-white/85 text-center text-sm md:text-white/90 md:text-lg font-medium [text-shadow:0_1px_4px_rgba(0,0,0,0.12)]">
              Sem telas escondidas. Procurou, achou. Informação fácil, do jeito certo.
            </h2>
            <div className="relative z-10 p-[3px] rounded-xl bg-white/10 ring-1 ring-white/15 w-full md:w-2/3 max-w-[840px]">
              <div className="rounded-[calc(0.75rem-3px)] bg-white/95 px-4 md:px-6 py-4 md:py-5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.6)]">
              <div className="flex gap-2 bg-gray-100/70 rounded-xl h-10 p-1 mb-3">
                {opcoes_label.map((op, i) => (
                  <p
                    key={op}
                    className={`flex items-center justify-center gap-1.5 h-full w-1/2 rounded-lg text-center font-medium text-sm cursor-pointer transition-all duration-200 ${
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
              <div className="flex flex-row items-center gap-2 py-1.5 px-3 md:py-2 md:px-4 border border-white/20 rounded-lg font-medium text-white bg-black/5 hover:bg-black/10 transition-colors duration-200 text-xs md:text-sm">
                <Clock className="h-4" /> Horários
              </div>
              <div className="flex flex-row items-center gap-2 py-1.5 px-3 md:py-2 md:px-4 border border-white/20 rounded-lg font-medium text-white bg-black/5 hover:bg-black/10 transition-colors duration-200 text-xs md:text-sm">
                <Crosshair className="h-4" /> Veículos
              </div>
              <div className="flex flex-row items-center gap-2 py-1.5 px-3 md:py-2 md:px-4 border border-white/20 rounded-lg font-medium text-white bg-black/5 hover:bg-black/10 transition-colors duration-200 text-xs md:text-sm">
                <Bell className="h-4" />
                Alertas 
              </div>
            </div>
          </div>
        </main>

        <div className="max-w-[1200px] mx-auto px-4 py-24 space-y-32">
            <AcessoRapido />
            <AnimatePresence>
              {isInstallable && <InstallPrompt onInstall={install} onDismiss={dismiss} isIOS={isIOS} />}
            </AnimatePresence>
            <LinhasPopulares />
            <CardSaidasTerminal />
            <CardRedeTerminais />
            <Footer />
        </div>
      </div>
    </>
  )
}
