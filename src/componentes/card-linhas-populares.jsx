import { Link } from 'react-router-dom'
import { Onibus, PinoLocalizacao, Relogio, Seta } from './icons'

const linhas = [
  {
    name: 'POLO INDUSTRIAL | TERMINAL CENTRAL',
    sgl: '009',
    sentido: 'POLO INDUSTRIAL',
    horarios: '4:45 - 20:20',
    paradas: 30,
  },
  {
    name: 'CONDER | JARDIM EUROPA | AV. MARIA QUITERIA',
    sgl: '108A',
    sentido: 'CONDER',
    horarios: '7:15 - 17:45',
    paradas: 42,
  },
  {
    name: 'JARDIM BRASIL VIA COND. AZALEIAS',
    sgl: '07A',
    sentido: 'JARDIM BRASIL',
    horarios: '4:40 - 21:50',
    paradas: 35,
  },
  {
    name: 'UEFS DIRETA VIA TERMINAL NORTE | TERMINAL CENTRAL',
    sgl: '003',
    sentido: 'TERMINAL CENTRAL',
    horarios: '6:30 - 19:50',
    paradas: 24,
  },
  {
    name: 'SUBAÉ | 35 BI - VIA JOMAFA',
    sgl: '025',
    sentido: 'SUBAÉ',
    horarios: '6:30 - 21:50',
    paradas: 28,
  },
  {
    name: 'BRT - VIA GETULIO VARGAS',
    sgl: '300',
    sentido: 'BRT GETÚLIO VARGAS',
    horarios: '6:00 - 19:45',
    paradas: 7,
  },
]

export default function LinhasPopulares() {
  return (
    <section className="max-w-[1200px] mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-purple-600 to-indigo-600">
          Rotas Populares
        </h2>
        <Link
          to="/linhas"
          className="flex items-center gap-1 text-sm font-medium text-purple-700 hover:text-purple-900 transition-colors"
        >
          Ver todas <Seta />
        </Link>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        {linhas.map((linha) => (
          <CardLinhaPopular key={linha.sgl} linha={linha} />
        ))}
      </div>
    </section>
  )
}

function CardLinhaPopular({ linha }) {
  const { name, sgl, sentido, paradas, horarios } = linha
  return (
    <Link
      to={`linhas/${sgl}/?sentido=${sentido}`}
      className="flex flex-col md:flex-row md:items-center w-full py-2 border border-gray-100 rounded-xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 group cursor-pointer"
    >
      <div className="md:w-2/3">
        <div className="w-full flex flex-row gap-2 items-start mb-1 mt-2 px-2">
          <div className="flex flex-row items-center justify-center gap-1 h-9 md:h-10 px-3 rounded-lg font-bold text-white bg-gradient-to-br from-purple-600 to-indigo-600 shrink-0">
            <Onibus className="w-4 h-4" />
            <span className="text-sm">{sgl}</span>
          </div>
          <div className="flex flex-col min-w-0">
            <h3 className="text-sm md:text-base font-medium text-slate-900 leading-tight">{name}</h3>
            <div className="flex items-center gap-1 text-xs text-gray-400">
              <Seta className="h-3" />
              Sentido {sentido}
            </div>
          </div>
        </div>
      </div>

      <div className="pt-1 px-2 flex gap-2 md:w-1/3 md:justify-end md:pr-3">
        <div className="flex items-center gap-1.5 text-xs font-medium bg-slate-50 rounded-lg px-2.5 py-1.5">
          <Relogio className="h-3.5 text-sky-600" />
          <span className="text-gray-500">{horarios}</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs font-medium bg-slate-50 rounded-lg px-2.5 py-1.5">
          <PinoLocalizacao className="h-3.5 text-purple-600" />
          <span className="text-gray-500">{paradas}</span>
        </div>
      </div>
    </Link>
  )
}
