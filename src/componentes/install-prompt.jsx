import { motion } from 'motion/react'
import { Download, X, ShareFat } from '@phosphor-icons/react'

export default function InstallPrompt({ onInstall, onDismiss, isIOS }) {
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
          {isIOS ? <ShareFat className="h-5 w-5" /> : <Download className="h-5 w-5" />}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-slate-900">
            Instale o FeiraBus
          </h3>
          {isIOS ? (
            <>
              <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                Toque no ícone de compartilhar do Safari e selecione
                "Adicionar à Tela de Início".
              </p>
              <div className="flex items-center gap-2 mt-3 px-3 py-2 bg-white rounded-lg border border-purple-100">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-50 text-blue-600 shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>
                </div>
                <div className="text-[11px] text-slate-600 leading-tight">
                  <span className="font-medium">Passo 1:</span> Toque em <span className="font-semibold">Compartilhar</span> ↓<br />
                  <span className="font-medium">Passo 2:</span> Escolha <span className="font-semibold">Adicionar à Tela de Início</span>
                </div>
              </div>
            </>
          ) : (
            <>
              <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                Acesse rápido direto da sua tela inicial, sem precisar abrir o navegador.
              </p>
              <div className="flex flex-row gap-2 mt-3">
                <button
                  onClick={onInstall}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-purple-700 rounded-lg hover:bg-purple-800 transition-colors"
                >
                  <Download className="h-3.5 w-3.5" />
                  Instalar
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </motion.div>
  )
}
