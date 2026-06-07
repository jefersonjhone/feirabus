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
    <section className=" md:h-96  mb-10 max-w-[1200px] mx-auto z-10 flex flex-col justify-center">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-sky-500 to-indigo-500">
          Acesso Rápido
        </h2>
      </div>

      <div className="grid grid-cols-3 gap-2 md:gap-4 sm:grid-cols-5">
        <CardRapido
          name="Linhas"
          href="/linhas"
          desc="Ver todas as linhas de ônibus"
          icon={<Onibus />}
          className="bg-slate-100 text-blue-600  "
        />
        <CardRapido
          name="Horários"
          href="/linhas"
          desc="Ver quadro de horários"
          icon={<Relogio />}
          className="bg-slate-100 text-blue-600  "
        />
        <CardRapido
          name="Planejar rota"
          href="/rotas"
          desc="Planeje sua rota"
          icon={<RotaComBandeira />}
          className="bg-slate-100 text-blue-600  "
        />
        <CardRapido
          name="Mapa em tempo real"
          href="/veiculos"
          desc="Acompanhe os ônibus em tempo real"
          icon={<PinoLocalizacao />}
          className="bg-slate-100 text-blue-600  "
        />
        <CardRapido
          name="Favoritos"
          href="/favoritos"
          desc="Suas paradas, rotas e linhas favoritas"
          icon={<Estrela />}
          className="bg-slate-100 text-blue-600  "
        />
      </div>
    </section>
  )
}

function CardRapido({ name, desc, icon, className, href }) {
  return (
    <div className="group flex flex-col md:gap-4 overflow-hidden transition-all rounded-md shadow-md border cursor-pointer hover:shadow-lg hover:translate-y-[-2px] ">
      <Link
        className="flex flex-col items-center justify-center p-2 md:p-6 text-center"
        to={href}
      >
        <div
          className={
            className +
            'mb-2 rounded-md p-2 md:p-4 transition-all  duration-300 ease-in-out group-hover:text-white group-hover:bg-gradient-to-r group-hover:from-sky-500 group-hover:to-indigo-500'
          }
        >
          {icon}
        </div>
        <h3 className="mb-1 text-sm font-medium md:text-lg  text-slate-800">{name}</h3>
        <p className="text-sm font-base  text-slate-500 hidden lg:flex hover:fle">{desc} </p>
        <div
          className={`
                    lg:mt-6 flex items-center justify-center text-xs font-medium
                    transition-all duration-300 ease-in-out group-hover:opacity-100 group-hover:translate-y-0 opacity-0 translate-y-2
                  `}
        >
          <span className="text-blue-600">Explore</span>
          <Seta className="ml-1 h-3 w-3 text-blue-600" />
        </div>
      </Link>
    </div>
  )
}
