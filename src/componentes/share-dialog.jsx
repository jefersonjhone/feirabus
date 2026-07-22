import { useState, useEffect, useRef } from 'react'
import { ShareNetwork, WhatsappLogo, TelegramLogo, TwitterLogo, Copy } from '@phosphor-icons/react'
import { motion, AnimatePresence } from 'motion/react'
import { useToastStore } from '../stores/toastStore'
import { trackEvent } from '../utils/analytics'

function addUtm(url, medium) {
  const sep = url.includes('?') ? '&' : '?'
  return `${url}${sep}utm_source=compartilhar&utm_medium=${medium}`
}

const OPTIONS = [
  {
    name: 'WhatsApp', medium: 'whatsapp', icon: WhatsappLogo, color: 'text-green-600', bg: 'hover:bg-green-50',
    url: (t, u) => `https://wa.me/?text=${t}%20${u}`,
  },
  {
    name: 'Telegram', medium: 'telegram', icon: TelegramLogo, color: 'text-blue-500', bg: 'hover:bg-blue-50',
    url: (t, u) => `https://t.me/share/url?url=${u}&text=${t}`,
  },
  {
    name: 'Twitter', medium: 'twitter', icon: TwitterLogo, color: 'text-sky-500', bg: 'hover:bg-sky-50',
    url: (t, u) => `https://twitter.com/intent/tweet?text=${t}%20${u}`,
  },
  {
    name: 'Copiar link', medium: 'link', icon: Copy, color: 'text-gray-600', bg: 'hover:bg-gray-100',
    url: null,
  },
]

export default function ShareDialog({ url, title, text, compact, iconOnly }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const notify = useToastStore(s => s.notify)

  useEffect(() => {
    if (!open) return
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  const currentUrl = url || window.location.href

  const handleTrigger = async (e) => {
    e.stopPropagation()
    if (navigator.share) {
      try {
        await navigator.share({ title, text, url: addUtm(currentUrl, 'nativo') })
        trackEvent('compartilhar', { method: 'nativo', page: window.location.pathname })
        return
      } catch {}
    }
    setOpen(v => !v)
  }

  const handleOption = (opt) => {
    setOpen(false)
    const linkComUtm = addUtm(currentUrl, opt.medium)
    const encUtmUrl = encodeURIComponent(linkComUtm)
    const encText = encodeURIComponent(title || text || '')
    if (opt.url) {
      window.open(opt.url(encText, encUtmUrl), '_blank', 'noopener')
      notify(`Compartilhado via ${opt.name}`, 'success')
    } else {
      navigator.clipboard.writeText(linkComUtm)
      notify('Link copiado!', 'success')
    }
    trackEvent('compartilhar', { method: opt.medium, page: window.location.pathname })
  }

  return (
    <div className="relative p-0" ref={ref}>
      <button
        onClick={handleTrigger}
        className="flex flex-col items-center gap-0.5"
      >
        <div className={`flex items-center justify-center bg-gray-100 rounded-md cursor-pointer hover:bg-gray-200 transition-colors ${compact || iconOnly ? 'p-1.5 w-7 h-7' : 'p-2 w-9 h-9'}`}>
          <ShareNetwork className={`text-gray-500 ${compact || iconOnly ? 'h-3.5 w-3.5' : 'h-4 w-4'}`} />
        </div>
        {!iconOnly && <span className={`text-gray-400 leading-none ${compact ? 'text-[8px]' : 'block text-[10px]'}`}>Compartilhar</span>}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -4 }}
            transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="absolute right-0 top-full mt-1 z-[10000] min-w-[170px] bg-white rounded-lg border border-gray-200 shadow-lg py-1 origin-top-right"
          >
            {OPTIONS.map(opt => (
              <button
                key={opt.name}
                onClick={() => handleOption(opt)}
                className={`flex items-center gap-2.5 w-full px-3 py-2 text-sm text-gray-700 ${opt.bg} transition-colors`}
              >
                <opt.icon className={`h-4 w-4 ${opt.color}`} />
                {opt.name}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
