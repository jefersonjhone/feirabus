import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { Star, Bus, MapPin, Clock, Crosshair, ArrowUpRight } from '@phosphor-icons/react'

const cards = [
  {
    name: 'Linhas',
    href: '/linhas',
    desc: 'Ver todas as linhas de ônibus',
    icon: <Bus className="h-5 w-5" />,
  },
  {
    name: 'Horários',
    href: '/linhas',
    desc: 'Ver quadro de horários',
    icon: <Clock className="h-5 w-5" />,
  },
  {
    name: 'Paradas',
    href: '/paradas',
    desc: 'Ver todas as paradas de ônibus',
    icon: <MapPin className="h-5 w-5" />,
  },
  {
    name: 'Veículos',
    href: '/veiculos',
    desc: 'Acompanhe a localização dos ônibus',
    icon: <Crosshair className="h-5 w-5" />,
  },
  {
    name: 'Favoritos',
    href: '/favoritos',
    desc: 'Suas paradas, rotas e linhas favoritas',
    icon: <Star className="h-5 w-5" />,
  },
]

export default function AcessoRapido() {
  return (
    <section className="max-w-[1200px] mx-auto relative">
      <div className="mb-10 md:mb-12">
        <div className="flex items-center gap-3">
          <span className="h-0.5 w-8 bg-purple-300 rounded-full shrink-0" />
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-slate-900">
            Acesso Rápido
          </h2>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4 md:gap-5 sm:grid-cols-5">
        {cards.map((card, i) => (
          <motion.div
            key={card.name}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: i * 0.05 }}
          >
            <CardRapido {...card} />
          </motion.div>
        ))}
      </div>
    </section>
  )
}

function CardRapido({ name, desc, icon, href }) {
  return (
    <Link className="group block h-full" to={href}>
      <div className="p-[3px] rounded-xl bg-gray-50/60 ring-1 ring-gray-200/40 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] h-full group-hover:bg-purple-50/60 group-hover:ring-purple-200/60 group-hover:shadow-[0_8px_30px_-8px_rgba(168,85,247,0.12)]">
        <div className="relative rounded-[calc(0.75rem-3px)] bg-white px-3 py-5 md:py-6 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8)] flex flex-col items-center gap-2.5 min-h-[120px] md:min-h-[140px]">
          <div className="absolute top-2.5 right-2.5 w-6 h-6 rounded-full bg-purple-50 flex items-center justify-center md:opacity-0 md:group-hover:opacity-100 opacity-100 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] md:group-hover:translate-x-0.5 md:group-hover:-translate-y-0.5">
            <ArrowUpRight className="h-3 w-3 text-purple-600" />
          </div>
          <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-90 md:group-hover:bg-purple-100 md:group-hover:scale-105">
            {icon}
          </div>
          <h3 className="text-sm font-medium md:text-base text-slate-800 text-center">{name}</h3>
        </div>
      </div>
    </Link>
  )
}
