import { Link } from 'react-router-dom'

export default function Navbar({ page }) {
  const opcoes = {
    ' ': 'Home',
    linhas: 'linhas',
    veiculos: 'veiculos',
    map: 'mapa',
  }
  return (
    <div className="z-10 relative container flex flex-col w-full text-center items-center ">
      <div className="h-20 max-w-[1200px] flex flex-row gap-4 justify-between items-center rounded-sm w-5/6 p-2">
        <Link to={'/'} className="flex flex-row w-full ">
          <div className="w-20 rounded-xl overflow-hidden ">
            <img src="./logo_feirabus.png" />
          </div>
        </Link>
        <nav className="w-full hidden md:flex md:flex-row justify-end">
          {Object.keys(opcoes).map((op) => (
            <Link to={`/${op}`}>
              <div
                className={`px-4 py-1 text-lg w-full font-medium ${op === page ? 'text-purple-800 w-full' : 'text-gray-500 hover:text-purple-800'}`}
              >
                {opcoes[op]}
              </div>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  )
}
