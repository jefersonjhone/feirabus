import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { Star, X, Bus, MapPin } from '@phosphor-icons/react'

export default function FavPrompt({ onDismiss, type = 'generic', itemName, onFavorite }) {
  const content = {
    linha: {
      title: 'Favorite esta linha',
      desc: `Salve a linha ${itemName || ''} para acessar rápido nas próximas vezes.`,
      action: (
        <button
          onClick={onFavorite}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-purple-700 rounded-lg hover:bg-purple-800 transition-colors"
        >
          <Star className="h-3.5 w-3.5" />
          Favoritar
        </button>
      ),
    },
    parada: {
      title: 'Favorite esta parada',
      desc: `Salve a parada ${itemName || ''} para acessar rápido nas próximas vezes.`,
      action: (
        <button
          onClick={onFavorite}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-purple-700 rounded-lg hover:bg-purple-800 transition-colors"
        >
          <Star className="h-3.5 w-3.5" />
          Favoritar
        </button>
      ),
    },
    generic: {
      title: 'Salve seus favoritos',
      desc: 'Adicione linhas e paradas aos favoritos para acessar rapidamente.',
      action: (
        <div className="flex flex-row gap-2">
          <Link
            to="/linhas"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-purple-700 bg-white border border-purple-200 rounded-lg hover:bg-purple-50 transition-colors"
          >
            <Bus className="h-3.5 w-3.5" />
            Linhas
          </Link>
          <Link
            to="/paradas"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-purple-700 bg-white border border-purple-200 rounded-lg hover:bg-purple-50 transition-colors"
          >
            <MapPin className="h-3.5 w-3.5" />
            Paradas
          </Link>
        </div>
      ),
    },
  }

  const { title, desc, action } = content[type] || content.generic

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="relative border border-purple-200 bg-purple-50/60 rounded-xl p-4 md:p-5"
    >
      <button
        onClick={onDismiss}
        className="absolute top-3 right-3 flex items-center justify-center w-6 h-6 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
        aria-label="Dispensar"
      >
        <X className="h-3.5 w-3.5" />
      </button>

      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600 shrink-0">
          <Star className="h-5 w-5" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-slate-900">
            {title}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
            {desc}
          </p>
          <div className="mt-3">
            {action}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
