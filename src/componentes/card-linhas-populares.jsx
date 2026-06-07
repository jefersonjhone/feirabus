import { Link } from 'react-router-dom'
import { Estrela, Onibus, PinoLocalizacao, Relogio, Seta } from './icons'

export default function LinhasPopulares() {
  const linhas = [
    {
      name: 'POLO INDUSTRIAL | TERMINAL CENTRAL',
      sgl: '009',
      sentido: ' POLO INDUSTRIAL',
      imagem:"/ROTA_LINHA_009.png",
      horarios: '4:45 - 20:20',
      paradas: 30,
    },    {
      name: 'CONDER | JARDIM EUROPA | AV. MARIA QUITERIA',
      sgl: '108A',
      sentido: ' CONDER',
      imagem:"/ROTA_LINHA_108A.png",
      horarios: '7:15- 17:45',
      paradas: 42,
    },    {
      name: 'JARDIM BRASIL VIA COND. AZALEIAS',
      sgl: '07A',
      sentido: ' JARDIM BRASIL',
      imagem:"/ROTA_LINHA_07A.png",
      horarios: '4:40 - 21:50',
      paradas: 35,
    },
    {
      name: 'UEFS DIRETA VIA TERMINAL NORTE | TERMINAL CENTRAL',
      sgl: '003',
      sentido: ' TERMINAL CENTRAL',
      imagem:"/ROTA_LINHA_003.png",
      horarios: '6:30 - 19:50',
      paradas: 24,
    },    {
      name: 'SUBAÉ | 35 BI - VIA JOMAFA',
      sgl: '025',
      sentido: ' SUBAÉ  ',
      imagem:"/ROTA_LINHA_25.png",
      horarios: '6:30 - 21:50',
      paradas: 28,
    },    {
      name: 'BRT - VIA GETULIO VARGAS',
      sgl: '300',
      sentido: ' BRT GETÚLIO VARGAS',
      imagem:"/ROTA_LINHA_300.png",
      horarios: '6:00 - 19:45',
      paradas: 7,
    },
  ]
  return (
    <section className="mb-10 max-w-[1200px] mx-auto  ">
      <div className="mb-6 flex items-center justify-between md:p-2">
        <h2 className="text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-sky-500 to-indigo-500">
          Rotas Populares
        </h2>
        <button className="flex items-center text-blue-600 hover:text-blue-700">
          Ver todas <Seta />
        </button>
      </div>
      <div className="grid md:grid-cols-1 md:px-2 gap-4 ">
        {/* linhas */}

        
        <CardLinhaPopular
        linha={linhas[1]}
        className="bg-gradient-to-r from-blue-300 to-blue-500"
        className="bg-gradient-to-r from-purple-400 to-purple-600 "
        className="bg-gradient-to-r from-purple-500 to-purple-900 border border-white"
        />
        <CardLinhaPopular
        linha={linhas[2]}
        className="bg-gradient-to-r from-green-300 to-green-500"
        className="bg-gradient-to-r from-purple-400 to-purple-600 "
        className="bg-gradient-to-r from-purple-500 to-purple-900 border border-white"
        text="green-500"
        />
        <CardLinhaPopular
        linha={linhas[3]}
        className="bg-gradient-to-r from-orange-300 to-yellow-500"
        className="bg-gradient-to-r from-purple-500 to-purple-900 border border-white"
        />
        
        <CardLinhaPopular
        linha={linhas[5]}
        className="bg-gradient-to-r from-purple-500 to-purple-900 border border-white"
        />
        
      </div>
    </section>
  )
}

function CardLinhaPopular({ linha, className, text }) {
  const { name, sgl, sentido, imagem, paradas, horarios } = linha
  return (
  <Link
        to={`linhas/${sgl}/?sentido=${sentido}`}
        className={`flex flex-col md:flex-row md:items-center  items-start w-full py-2 border rounded-md overflow-hidden shadow-md  
        hover:shadow-lg hover:translate-y-[-2px] transition-all duration-300 ease-in-out group cursor-pointer`}
        
  >
      
      <div className="md:w-2/3 ">
        <div className="w-full flex flex-row gap-1 items-start mb-1 mt-2 px-1">
          <div
            className={
              className +
              ` flex flex-row items-center justify-center gap-1 md:w-22  h-8 md:h-10 px-2 py-0 aspect-square font-bold rounded-md text-white text-center `
            }
          >
            <Onibus className="w-6 h-6 " />
            <span className="text-lg">{sgl}</span>
          </div>
          <div className="w-full  flex flex-col">
            <h1 className="text-sm md:text-base font-normal  text-slate-950 " >{name}</h1>
            <div className="flex items-center gap-1 text-sm font-light text-gray-500 text-nowrap">
              <span>
                <Seta className="h-4" />
              </span>
              Sentido {sentido}
            </div>
          </div>
        </div>
      </div>
     
      <div className="pt-1 gap-1 px-2 flex">
        <div className="flex gap-2 w-full ">
          <div className="flex items-center gap-1 text-sm font-medium bg-slate-50 w-full rounded-lg p-1">
            <h3 className="flex items-center gap-2">
              <span className="text-sky-700">
                <Relogio className=" h-4 " />
              </span>
              Horários
            </h3>
            <span className="font-medium text-gray-500 flex text-nowrap">{horarios}</span>
          </div>

          <div className="flex w-full items-center gap-1 text-sm font-medium bg-slate-50 rounded-lg p-1">
            <h3 className="flex items-center gap-2">
              <span className="text-purple-600">
                <PinoLocalizacao className="h-4" />
              </span>
              Paradas
            </h3>
            <span className="font-medium text-slate-500">{paradas}</span>
          </div>
        </div>
      </div>
      </Link>
  )
}
