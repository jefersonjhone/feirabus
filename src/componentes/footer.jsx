import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import { Download, X, ShareFat } from '@phosphor-icons/react'

function getIsIOS() {
  return /iPhone|iPad|iPod/.test(navigator.userAgent) && !window.MSStream
}

export default function Footer() {
  const [canInstall, setCanInstall] = useState(false)
  const [isIOS, setIsIOS] = useState(false)
  const [showIOSGuide, setShowIOSGuide] = useState(false)

  useEffect(() => {
    const ios = getIsIOS()
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches
    const isIOSStandalone = navigator.standalone === true

    setIsIOS(ios)

    if (isStandalone || isIOSStandalone) return

    if (ios) {
      setCanInstall(true)
      return
    }

    const handler = (e) => {
      e.preventDefault()
      window._deferredInstallPrompt = e
      setCanInstall(true)
    }
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const handleInstall = async () => {
    const prompt = window._deferredInstallPrompt
    if (!prompt) return
    prompt.prompt()
    await prompt.userChoice
    window._deferredInstallPrompt = null
    setCanInstall(false)
  }

  return (
    <motion.footer
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="border-t border-gray-100 bg-white"
    >
      <div className="max-w-[1200px] mx-auto px-4 py-10 md:py-14">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-2">
              <img src="./logo_feirabus.png" className="h-6 w-6" alt="FeiraBus" />
              <h3 className="text-lg font-semibold text-slate-900">FeiraBus</h3>
            </div>
            <p className="mt-3 text-sm text-slate-500 leading-relaxed">
              Seu guia completo do transporte público de Feira de Santana. Linhas, horários,
              paradas e localização em tempo real.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-800 mb-3">Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="text-slate-500 hover:text-purple-700 transition-colors duration-200">Home</Link></li>
              <li><Link to="/linhas" className="text-slate-500 hover:text-purple-700 transition-colors duration-200">Linhas</Link></li>
              <li><Link to="/veiculos" className="text-slate-500 hover:text-purple-700 transition-colors duration-200">Veículos</Link></li>
              <li><Link to="/paradas" className="text-slate-500 hover:text-purple-700 transition-colors duration-200">Paradas</Link></li>
              <li><Link to="/favoritos" className="text-slate-500 hover:text-purple-700 transition-colors duration-200">Favoritos</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-800 mb-3">Serviços</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/rotas" className="text-slate-500 hover:text-purple-700 transition-colors duration-200">Planejar rota</Link></li>
              <li><Link to="/paradas-proximas" className="text-slate-500 hover:text-purple-700 transition-colors duration-200">Paradas próximas</Link></li>
              <li><Link to="/favoritos" className="text-slate-500 hover:text-purple-700 transition-colors duration-200">Favoritos</Link></li>
              {canInstall && (
                <li>
                  {isIOS ? (
                    <div className="relative">
                      <button
                        onClick={() => setShowIOSGuide(!showIOSGuide)}
                        className="flex items-center gap-1.5 text-slate-500 hover:text-purple-700 transition-colors duration-200"
                      >
                        <ShareFat className="h-3.5 w-3.5" />
                        Como instalar
                      </button>
                      <AnimatePresence>
                        {showIOSGuide && (
                          <motion.div
                            initial={{ opacity: 0, y: -4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -4 }}
                            transition={{ duration: 0.2 }}
                            className="absolute bottom-full left-0 mb-2 w-64 p-3 bg-white border border-gray-200 rounded-lg shadow-lg z-50"
                          >
                            <button
                              onClick={() => setShowIOSGuide(false)}
                              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                            >
                              <X className="h-3 w-3" />
                            </button>
                            <p className="text-xs text-slate-600 leading-relaxed pr-4">
                              No Safari, toque no ícone de <span className="font-semibold">compartilhar</span> ↓ e selecione <span className="font-semibold">"Adicionar à Tela de Início"</span>.
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <button
                      onClick={handleInstall}
                      className="flex items-center gap-1.5 text-slate-500 hover:text-purple-700 transition-colors duration-200"
                    >
                      <Download className="h-3.5 w-3.5" />
                      Instalar app
                    </button>
                  )}
                </li>
              )}
            </ul>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-gray-100 text-center text-xs text-slate-400">
          <p>© {new Date().getUTCFullYear()} FeiraBus. Todos os direitos reservados.</p>
        </div>
      </div>
    </motion.footer>
  )
}
