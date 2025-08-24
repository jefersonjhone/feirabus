import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="border-t bg-white">
      <div className="container px-4 py-8 md:py-12">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-2">
              <img
                src="./logo_feirabus.png"
                className="h-6 w-6 text-blue-600"
                alt="feirabus logo"
              />
              <h3 className="text-xl font-bold text-blue-600">FeiraBus</h3>
            </div>
            <p className="mt-4 text-sm text-slate-600">
              Providing reliable public transportation services to connect
              communities and enhance mobility for all.
            </p>
            <div className="mt-4 flex gap-4">
              <a href="#" className="text-slate-400 hover:text-blue-600">
                <span className="sr-only">Facebook</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>
              <a href="#" className="text-slate-400 hover:text-blue-600">
                <span className="sr-only">Twitter</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                </svg>
              </a>
              <a href="#" className="text-slate-400 hover:text-blue-600">
                <span className="sr-only">Instagram</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
              </a>
            </div>
          </div>
          <div>
            <h3 className="mb-4 font-semibold"> Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-slate-600 hover:text-blue-600">
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/rotas"
                  className="text-slate-600 hover:text-blue-600"
                >
                  Rotas & Horários
                </Link>
              </li>
              <li>
                <Link
                  href="/tarifas"
                  className="text-slate-600 hover:text-blue-600"
                >
                  Tarifas
                </Link>
              </li>
              <li>
                <Link
                  href="/explorar"
                  className="text-slate-600 hover:text-blue-600"
                >
                  Explorar
                </Link>
              </li>
              <li>
                <Link
                  href="/favoritos"
                  className="text-slate-600 hover:text-blue-600"
                >
                  Favoritos
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 font-semibold"> Serviços</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/contact"
                  className="text-slate-600 hover:text-blue-600"
                >
                  Entrar em contato
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="text-slate-600 hover:text-blue-600"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/lost-found"
                  className="text-slate-600 hover:text-blue-600"
                >
                  Avisos e Reclamações
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t pt-6 text-center text-sm text-slate-500">
          <p>© {new Date().getUTCFullYear()} FeiraBus. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
