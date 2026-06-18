import { Link } from 'react-router-dom'
import {
  Estrela,
  Onibus,
  PinoLocalizacao,
  Relogio,
  RotaComBandeira,
  Seta,
} from './icons'

export default function AcessoRapido() {
  return (
    <section className="max-w-[1200px] mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-purple-600 to-indigo-600">
          Acesso Rápido
        </h2>
      </div>

      <div className="grid grid-cols-3 gap-3 md:gap-4 sm:grid-cols-5">
        <CardRapido
          name="Linhas"
          href="/linhas"
          desc="Ver todas as linhas de ônibus"
          icon={<Onibus />}
        />
        <CardRapido
          name="Horários"
          href="/linhas"
          desc="Ver quadro de horários"
          icon={<Relogio />}
        />
        <CardRapido
          name="Planejar rota"
          href="/rotas"
          desc="Planeje sua rota"
          icon={<RotaComBandeira />}
        />
        <CardRapido
          name="Mapa em tempo real"
          href="/veiculos"
          desc="Acompanhe os ônibus em tempo real"
          icon={<PinoLocalizacao />}
        />
        <CardRapido
          name="Favoritos"
          href="/favoritos"
          desc="Suas paradas, rotas e linhas favoritas"
          icon={<Estrela />}
        />
      </div>
    </section>
  )
}

function CardRapido({ name, desc, icon, href }) {
  return (
    <div className="group flex flex-col overflow-hidden transition-all rounded-xl shadow-sm border border-gray-100 cursor-pointer hover:shadow-md hover:-translate-y-0.5">
      <Link
        className="flex flex-col items-center justify-center p-3 md:p-5 text-center"
        to={href}
      >
        <div className="mb-2 rounded-lg p-2.5 md:p-3.5 text-purple-600 bg-purple-50 transition-all duration-300 ease-in-out group-hover:text-white group-hover:bg-gradient-to-br group-hover:from-purple-600 group-hover:to-indigo-600">
          {icon}
        </div>
        <h3 className="mb-0.5 text-sm font-medium md:text-base text-slate-800">{name}</h3>
        <p className="text-xs text-slate-400 hidden lg:block">{desc}</p>
        <div className="lg:mt-3 flex items-center justify-center text-xs font-medium transition-all duration-300 ease-in-out group-hover:opacity-100 group-hover:translate-y-0 opacity-0 translate-y-1">
          <span className="text-purple-600">Acessar</span>
          <Seta className="ml-1 h-3 w-3 text-purple-600" />
        </div>
      </Link>
    </div>
  )
}
