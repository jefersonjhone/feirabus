import { AnimatePresence, motion } from 'motion/react'
import { Link } from 'react-router-dom'
import { CheckCircle, WarningCircle, Star } from '@phosphor-icons/react'
import { useToastStore } from '../stores/toastStore'

export default function Toast() {
  const { message, type, visible, favLink, clear } = useToastStore()

  return (
    <AnimatePresence>
      {visible && message && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="fixed top-16 md:top-24 left-4 right-4 md:left-auto md:right-auto md:left-1/2 md:-translate-x-1/2 z-[99999] md:max-w-sm md:w-auto"
        >
          <div className={`rounded-xl shadow-xl border ${
            type === 'success'
              ? 'bg-purple-800 border-purple-600 text-white'
              : 'bg-amber-50 border-amber-200 text-amber-900'
          }`}>
            <div className="flex items-center gap-2.5 px-4 py-3">
              {type === 'success' ? (
                <CheckCircle className="h-5 w-5 shrink-0 text-purple-300" weight="fill" />
              ) : (
                <WarningCircle className="h-5 w-5 shrink-0 text-amber-600" weight="fill" />
              )}
              <span className="flex-1 text-sm font-medium">{message}</span>
              <button
                onClick={clear}
                className="shrink-0 p-1 rounded-md hover:bg-black/10 transition-colors"
                aria-label="Fechar"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
                </svg>
              </button>
            </div>
            {favLink && (
              <Link
                to="/favoritos"
                onClick={clear}
                className="flex items-center gap-2 px-4 py-2.5 mx-3 mb-3 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-sm"
              >
                <Star className="h-4 w-4 shrink-0 text-yellow-400" weight="fill" />
                <span className="flex-1 font-medium">Ver nos favoritos</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
                </svg>
              </Link>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
