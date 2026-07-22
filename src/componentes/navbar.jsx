import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { X, Bus, Crosshair, MapPin, Star } from '@phosphor-icons/react'

const links = [
  { path: '/', label: 'Home' },
  { path: '/linhas', label: 'Linhas', icon: Bus },
  { path: '/veiculos', label: 'Veículos', icon: Crosshair },
  { path: '/paradas', label: 'Paradas', icon: MapPin },
  { path: '/favoritos', label: 'Favoritos', icon: Star },
]

export default function Navbar({ page }) {
  const [menuOpen, setMenuOpen] = useState(false)

  const isActive = (path) =>
    path === '/' ? page === ' ' : page === path.slice(1)

  return (
    <div className="relative container flex flex-col w-full text-center items-center">
      <div className="h-16 md:h-20 max-w-[1200px] flex flex-row gap-4 justify-between items-center rounded-sm w-5/6 p-2">
        <Link to={'/'} className="flex flex-row items-center gap-3">
          <div className="w-10 h-10 md:w-14 md:h-14 rounded-xl overflow-hidden shadow-sm ring-1 ring-purple-100">
            <img src="/logo_feirabus.png" className="w-full h-full object-cover" />
          </div>
          <span className="hidden sm:flex text-lg font-bold text-purple-800">
            FeiraBus
          </span>
        </Link>

        <nav className="hidden md:flex md:flex-row items-center gap-1">
          {links.map((link) => (
            <Link key={link.path} to={link.path}>
              <div
                className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 ${
                  isActive(link.path)
                    ? 'bg-purple-800 text-white shadow-sm'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                {link.icon && <link.icon className="h-4 w-4" />}
                {link.label}
              </div>
            </Link>
          ))}
        </nav>

        <button
          className={`md:hidden flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-200 active:scale-90 ${
            menuOpen
              ? 'bg-purple-800 text-white'
              : 'bg-gray-100 text-purple-800 hover:bg-gray-200'
          }`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Abrir menu"
        >
          {menuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="4" y1="6" x2="20" y2="6" />
              <line x1="4" y1="12" x2="20" y2="12" />
              <line x1="4" y1="18" x2="20" y2="18" />
            </svg>
          )}
        </button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[10000] bg-black/20 md:hidden"
            onClick={() => setMenuOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="absolute left-0 top-16 md:top-20 w-full bg-white shadow-lg rounded-b-2xl z-[10001]"
              onClick={(e) => e.stopPropagation()}
            >
              <nav className="flex flex-col p-3 gap-1">
                {links.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setMenuOpen(false)}
                  >
                    <div
                      className={`flex items-center gap-2 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                        isActive(link.path)
                          ? 'bg-purple-800 text-white shadow-sm'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      {link.icon && <link.icon className="h-5 w-5" />}
                      {link.label}
                    </div>
                  </Link>
                ))}
              </nav>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
