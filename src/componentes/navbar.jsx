import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Fechar, Onibus, Relogio, PinoLocalizacao, Estrela } from './icons'

const links = [
  { path: '/', label: 'Home' },
  { path: '/linhas', label: 'Linhas', icon: Onibus },
  { path: '/veiculos', label: 'Veículos', icon: Relogio },
  { path: '/paradas', label: 'Paradas', icon: PinoLocalizacao },
  { path: '/favoritos', label: 'Favoritos', icon: Estrela },
]

export default function Navbar({ page }) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="relative container flex flex-col w-full text-center items-center">
      <div className="h-20 max-w-[1200px] flex flex-row gap-4 justify-between items-center rounded-sm w-5/6 p-2">
        <Link to={'/'} className="flex flex-row items-center gap-3">
          <div className="w-10 h-10 md:w-14 md:h-14 rounded-xl overflow-hidden shadow-sm ring-1 ring-purple-100">
            <img src="/logo_feirabus.png" className="w-full h-full object-cover" />
          </div>
          <span className="hidden sm:flex text-lg font-bold text-transparent bg-clip-text bg-gradient-to-b from-purple-700 to-sky-600">
            FeiraBus
          </span>
        </Link>

        <nav className="hidden md:flex md:flex-row items-center gap-1">
          {links.map((link) => (
            <Link key={link.path} to={link.path}>
              <div
                className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 ${
                  (link.path === '/' ? page === ' ' : page === link.path.slice(1))
                    ? 'bg-purple-800 text-white shadow-sm'
                    : 'text-gray-500 hover:bg-purple-50 hover:text-purple-800'
                }`}
              >
                {link.icon && <link.icon className="h-4 w-4" />}
                {link.label}
              </div>
            </Link>
          ))}
        </nav>

        <button
          className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg text-gray-600 hover:bg-purple-50 hover:text-purple-800 transition-colors"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Abrir menu"
        >
          {menuOpen ? (
            <Fechar className="w-6 h-6" />
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="4" y1="6" x2="20" y2="6" />
              <line x1="4" y1="12" x2="20" y2="12" />
              <line x1="4" y1="18" x2="20" y2="18" />
            </svg>
          )}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden w-full bg-white border-t border-gray-100 shadow-lg rounded-b-2xl fixed left-0 top-20 z-[9999]">
          <nav className="flex flex-col p-3 gap-1">
            {links.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMenuOpen(false)}
              >
                <div
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                    (link.path === '/' ? page === ' ' : page === link.path.slice(1))
                      ? 'bg-purple-800 text-white shadow-sm'
                      : 'text-gray-600 hover:bg-purple-50 hover:text-purple-800'
                  }`}
                >
                  {link.icon && <link.icon className="h-5 w-5" />}
                  {link.label}
                </div>
              </Link>
            ))}
          </nav>
        </div>
      )}
    </div>
  )
}
