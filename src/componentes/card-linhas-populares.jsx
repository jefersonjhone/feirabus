import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { Bus, MapPin, Clock, ArrowUpRight } from '@phosphor-icons/react'

const linhas = [
  { name: 'CONDER | JARDIM EUROPA | AV. MARIA QUITERIA', sgl: '108A', sentido: 'CONDER', horarios: '7:15 - 17:45', paradas: 42 },
  { name: 'JARDIM BRASIL VIA COND. AZALEIAS', sgl: '07A', sentido: 'JARDIM BRASIL', horarios: '4:40 - 21:50', paradas: 35 },
  { name: 'UEFS DIRETA VIA TERMINAL NORTE | TERMINAL CENTRAL', sgl: '003', sentido: 'TERMINAL CENTRAL', horarios: '6:30 - 19:50', paradas: 24 },
  { name: 'BRT - VIA GETULIO VARGAS', sgl: '300', sentido: 'BRT GETÚLIO VARGAS', horarios: '6:00 - 19:45', paradas: 7 },
]

export default function LinhasPopulares() {
  return (
    <section className="max-w-[1200px] mx-auto">
      <div className="mb-8 md:mb-10 flex items-end justify-between">
        <div>
          <span className="text-[10px] uppercase tracking-[0.15em] font-medium text-purple-500 mb-1.5 block">Destaques</span>
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-slate-900">
            Rotas Populares
          </h2>
        </div>
        <Link
          to="/linhas"
          className="group flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-purple-700 transition-colors duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]"
        >
          Ver todas
          <span className="w-6 h-6 rounded-full bg-purple-50 flex items-center justify-center transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:bg-purple-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
            <ArrowUpRight className="h-3 w-3 text-purple-600" />
          </span>
        </Link>
      </div>
      <div className="grid md:grid-cols-2 gap-4 md:gap-6">
        {linhas.map((linha, i) => (
          <motion.div
            key={linha.sgl}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: i * 0.05 }}
          >
            <LinhaCard linha={linha} />
          </motion.div>
        ))}
      </div>
    </section>
  )
}

function LinhaCard({ linha }) {
  const { name, sgl, sentido, paradas, horarios } = linha
  return (
    <Link
      to={`linhas/${sgl}/?sentido=${sentido}`}
      className="group block"
    >
      <div className="p-[3px] rounded-xl bg-gray-50/40 ring-1 ring-gray-200/30 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:bg-purple-50/50 group-hover:ring-purple-200/40 group-hover:shadow-[0_4px_20px_-6px_rgba(168,85,247,0.08)]">
        <div className="rounded-[calc(0.75rem-3px)] bg-white px-4 py-3.5 md:px-5 md:py-4 shadow-[inset_0_1px_1px_rgba(255,255,255,0.6)]">
          <div className="flex items-start gap-3">
            <div className="flex items-center justify-center gap-1 h-9 md:h-10 px-3 rounded-lg font-bold text-white bg-purple-700 shrink-0">
              <Bus className="w-3.5 h-3.5" />
              <span className="text-sm">{sgl}</span>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm md:text-base font-medium text-slate-900 leading-snug line-clamp-2">{name}</h3>
              <div className="flex items-center gap-1 mt-0.5">
                <ArrowUpRight className="h-3 w-3 text-slate-400" />
                <span className="text-xs text-slate-500">Sentido {sentido}</span>
              </div>
            </div>
            <ArrowUpRight className="h-4 w-4 text-slate-300 shrink-0 transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:text-purple-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </div>
          <div className="flex items-center gap-3 mt-3 pt-3 border-t border-gray-100">
            <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
              <Clock className="h-3.5 w-3.5 text-purple-400" />
              {horarios}
            </div>
            <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
              <MapPin className="h-3.5 w-3.5 text-purple-400" />
              {paradas} paradas
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
