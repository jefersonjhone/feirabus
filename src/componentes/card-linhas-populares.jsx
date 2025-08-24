import { Link } from 'react-router-dom'
import { Estrela, Onibus, PinoLocalizacao, Relogio, Seta } from './icons'

export default function LinhasPopulares() {
  const linhas = [
    {
      name: 'EXPRESSO UNIVERSITÁRIO',
      sgl: '003',
      sentido: 'sentido UEFS',
      horarios: '6:30 - 20:00',
      paradas: 42,
      popularidade: '5',
    },
    {
      name: 'EXPRESSO UNIVERSITÁRIO',
      sgl: '003',
      sentido: 'sentido UEFS',
      horarios: '5:40 - 21:00',
      paradas: 25,
      popularidade: '4',
    },
    {
      name: 'EXPRESSO UNIVERSITÁRIO',
      sgl: '002',
      sentido: 'sentido TERMINAL NORTE',
      horarios: '4:15 - 22:00',
      paradas: 34,
      popularidade: '3',
    },
  ]
  return (
    <section className="mb-10 max-w-[1200px] mx-auto ">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-indigo-500">
          Rotas Populares
        </h2>
        <button className="flex items-center text-blue-600 hover:text-blue-700">
          Ver todas <Seta />
        </button>
      </div>
      <div className="grid md:grid-cols-3 px-2 gap-4 ">
        {/* linhas */}

        <CardLinhaPopular
          linha={linhas[0]}
          className="bg-gradient-to-r from-red-100 to-red-600"
        />
        <CardLinhaPopular
          linha={linhas[1]}
          className="bg-gradient-to-r from-blue-100 to-blue-600"
        />
        <CardLinhaPopular
          linha={linhas[2]}
          className="bg-gradient-to-r from-green-100 to-green-600"
        />
      </div>
    </section>
  )
}

function CardLinhaPopular({ linha, className }) {
  const { name, sgl, sentido, paradas, horarios, popularidade } = linha
  return (
    <div
      className={` w-full border rounded-md overflow-hidden shadow-md hover:shadow-lg hover:translate-y-[-4px] transition-all duration-300 ease-in-out `}
    >
      <div className={className + ' h-1'}></div>
      <div className="w-full flex flex-row gap-2 items-center mb-1 mt-2 mx-2 p-2">
        <div
          className={
            className +
            ` flex flex-row items-center justify-center gap-1 md:w-16 md:h-14 aspect-square font-bold rounded-md text-white text-center p-1 `
          }
        >
          <Onibus className="w-6 h-6 " />
          <span className="text-lg">{sgl}</span>
        </div>
        <div className="w-full ">
          <h1 className="font-semibold">{name} </h1>
          <div className="flex items-center font-medium gap-1 text-sm text-gray-500">
            <span>
              <Seta className="h-4" />
            </span>
            {sentido}
          </div>
        </div>
      </div>
      <div className="pt-1 gap-1 px-2">
        <div className="flex gap-4 w-full">
          <div className="flex flex-col items-center gap-1 text-sm font-medium bg-slate-50 w-full rounded-lg p-1">
            <h3 className="flex items-center gap-2">
              <span className="text-sky-700">
                <Relogio className=" h-4 " />
              </span>
              Horários
            </h3>
            <span className="font-medium text-gray-500">{horarios}</span>
          </div>

          <div className="flex w-full flex-col items-center gap-1 text-sm font-medium bg-slate-50 rounded-lg p-1">
            <h3 className="flex items-center gap-2">
              <span className="text-purple-600">
                <PinoLocalizacao className="h-4" />
              </span>
              Paradas
            </h3>
            <span className="font-medium text-slate-500">{paradas}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm font-medium mt-4 text-sm font-medium bg-slate-50 rounded-lg p-1 px-2">
          <span>
            <PinoLocalizacao className="h-4" />
          </span>
          Popularidade:{' '}
          <span className="font-bold text-slate-500 flex">
            {Array.from({ length: 5 }).map((_, i) =>
              i < popularidade ? (
                <Estrela className="h-4 fill--500 text-orange-600 font-semibold  " />
              ) : (
                <Estrela className="h-4 fill-gray-400" />
              )
            )}
          </span>
        </div>

        <div className="flex justify-end">
          <Link
            className="text-blue-500 font-semibold p-2 text-end flex items-center"
            to={`/linhas?linha=${sgl}`}
          >
            Detalhes{' '}
            <span>
              <Seta className="h-4" />
            </span>
          </Link>
        </div>
      </div>
    </div>
  )
}
