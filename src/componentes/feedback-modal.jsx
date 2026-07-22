import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { ChatTeardrop, X, Smiley, SmileySad, SmileyMeh, SmileyWink, SmileyXEyes } from '@phosphor-icons/react'
import { useToastStore } from '../stores/toastStore'
import { trackEvent } from '../utils/analytics'

const EMOJIS = [
  { value: 1, icon: SmileySad, label: 'Ruim', color: 'text-red-400' },
  { value: 2, icon: SmileyMeh, label: 'Regular', color: 'text-orange-400' },
  { value: 3, icon: Smiley, label: 'Bom', color: 'text-yellow-400' },
  { value: 4, icon: SmileyWink, label: 'Ótimo', color: 'text-lime-400' },
  { value: 5, icon: SmileyXEyes, label: 'Excelente', color: 'text-green-400' },
]

const FEATURES = [
  'Notificação de horários',
  'Rota entre dois pontos',
  'Poder avaliar linhas',
  'App mobile nativo',
  'Modo escuro',
  'Comparar linhas lado a lado',
]

export default function FeedbackModal() {
  const [sent, setSent] = useState(() => sessionStorage.getItem('feedback_sent') === 'true')
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState(1)
  const [rating, setRating] = useState(null)
  const [comment, setComment] = useState('')
  const [features, setFeatures] = useState([])
  const [other, setOther] = useState('')
  const notify = useToastStore(s => s.notify)

  if (sent) return null

  const handleClose = () => {
    setOpen(false)
    setStep(1)
    setRating(null)
    setComment('')
    setFeatures([])
    setOther('')
  }

  const handleDismiss = () => {
    sessionStorage.setItem('feedback_sent', 'true')
    setSent(true)
    setOpen(false)
  }

  const toggleFeature = (f) => {
    setFeatures(prev => prev.includes(f) ? prev.filter(x => x !== f) : [...prev, f])
  }

  const handleSubmit = () => {
    trackEvent('avaliacao', {
      rating,
      comentario: comment || null,
      page: window.location.pathname,
    })

    if (features.length || other) {
      trackEvent('sugestao_funcionalidade', {
        opcoes: features.length ? features.join('|') : null,
        outro: other || null,
        page: window.location.pathname,
      })
    }

    trackEvent('feedback_completo', {
      rating,
      comentario: comment || null,
      opcoes: features.length ? features.join('|') : null,
      outro: other || null,
      page: window.location.pathname,
    })

    sessionStorage.setItem('feedback_sent', 'true')
    setSent(true)
    handleClose()
    notify('Obrigado pelo feedback! 💜', 'success')
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-4 z-[9999] flex items-center gap-1.5 bg-purple-800 text-white rounded-full px-3.5 py-2.5 shadow-lg hover:bg-purple-700 transition-all duration-200 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.95] text-sm font-medium"
        aria-label="Abrir feedback"
      >
        <ChatTeardrop className="h-4 w-4" />
        Feedback
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[99999] flex items-center justify-center p-4"
          >
            <div className="absolute inset-0 bg-black/40" onClick={handleClose} />

            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.95 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 overflow-hidden"
            >
              <button
                onClick={handleClose}
                className="absolute top-3 right-3 flex items-center justify-center w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 transition-colors"
                aria-label="Fechar"
              >
                <X className="h-3.5 w-3.5" />
              </button>

              <div className="flex flex-col items-center gap-2 mb-5">
                <span className="text-[11px] font-medium text-gray-400 tracking-wide uppercase">
                  {step === 1 ? '1 de 2' : '2 de 2'}
                </span>
                <div className="flex items-center justify-center gap-1.5">
                  <div className={`h-1.5 w-8 rounded-full transition-colors ${step >= 1 ? 'bg-purple-700' : 'bg-gray-200'}`} />
                  <div className={`h-1.5 w-8 rounded-full transition-colors ${step >= 2 ? 'bg-purple-700' : 'bg-gray-200'}`} />
                </div>
              </div>

              {step === 1 && (
                <div>
                  <h2 className="text-lg font-semibold text-slate-900 text-center mb-1">
                    O que achou do FeiraBus?
                  </h2>
                  <p className="text-sm text-gray-500 text-center mb-6">
                    Sua opinião nos ajuda a melhorar
                  </p>

                  <div className="flex justify-center gap-3 mb-6">
                    {EMOJIS.map(e => (
                      <button
                        key={e.value}
                        onClick={() => setRating(e.value)}
                        className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-200 ease-[cubic-bezier(0.32,0.72,0,1)] ${
                          rating === e.value
                            ? 'bg-purple-50 scale-110 ring-2 ring-purple-300'
                            : 'hover:bg-gray-50 hover:scale-105'
                        }`}
                      >
                        <e.icon className={`h-8 w-8 ${e.color} ${rating === e.value ? 'scale-110' : ''}`} weight={rating === e.value ? 'fill' : 'regular'} />
                        <span className={`text-[10px] font-medium ${rating === e.value ? 'text-purple-700' : 'text-gray-400'}`}>{e.label}</span>
                      </button>
                    ))}
                  </div>

                  <textarea
                    value={comment}
                    onChange={e => setComment(e.target.value)}
                    placeholder="O que podemos melhorar? (opcional)"
                    maxLength={300}
                    rows={3}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-purple-400 transition-all"
                    style={{ fontSize: 16 }}
                  />

                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={handleDismiss}
                      className="flex-1 py-2.5 rounded-lg text-sm font-medium text-gray-500 hover:bg-gray-100 transition-colors"
                    >
                      Agora não
                    </button>
                    <button
                      onClick={() => { if (!rating) return; setStep(2) }}
                      disabled={!rating}
                      className={`flex-1 py-2.5 rounded-lg text-sm font-medium text-white transition-all duration-200 ${
                        rating ? 'bg-purple-800 hover:bg-purple-700 active:scale-[0.97]' : 'bg-gray-300 cursor-not-allowed'
                      }`}
                    >
                      {comment ? 'Continuar' : 'Enviar e continuar'}
                    </button>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div>
                  <h2 className="text-lg font-semibold text-slate-900 text-center mb-1">
                    Quais funcionalidades você gostaria de ter?
                  </h2>
                  <p className="text-sm text-gray-500 text-center mb-5">
                    Escolha uma ou mais opções
                  </p>

                  <div className="flex flex-col gap-2 mb-4">
                    {FEATURES.map(f => (
                      <button
                        key={f}
                        onClick={() => toggleFeature(f)}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg border text-sm text-left transition-all duration-200 ${
                          features.includes(f)
                            ? 'border-purple-300 bg-purple-50 text-purple-800 font-medium'
                            : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <div className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${
                          features.includes(f) ? 'border-purple-600 bg-purple-600' : 'border-gray-300'
                        }`}>
                          {features.includes(f) && (
                            <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path d="M5 13l4 4L19 7" /></svg>
                          )}
                        </div>
                        {f}
                      </button>
                    ))}
                  </div>

                  <input
                    value={other}
                    onChange={e => setOther(e.target.value)}
                    placeholder="Outra sugestão... (opcional)"
                    maxLength={200}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-purple-400 transition-all"
                    style={{ fontSize: 16 }}
                  />

                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => setStep(1)}
                      className="flex-1 py-2.5 rounded-lg text-sm font-medium text-gray-500 hover:bg-gray-100 transition-colors"
                    >
                      Voltar
                    </button>
                    <button
                      onClick={handleSubmit}
                      className="flex-1 py-2.5 rounded-lg text-sm font-medium text-white bg-purple-800 hover:bg-purple-700 active:scale-[0.97] transition-all duration-200"
                    >
                      Enviar feedback
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
