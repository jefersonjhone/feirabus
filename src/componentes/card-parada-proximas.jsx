import { useFetch } from '../hooks/useFetch'
import { useGeolocation } from '../hooks/useGeolocation'
import { Editar, PinoLocalizacao } from './icons'

export default function CardParadasProximas() {
  const {
    location,
    error: location_error,
    loading: loading_location,
  } = useGeolocation()
  const url = location
    ? process.env.REACT_APP_API_URL +
      `/paradas/paradas-proximas/@${location.longitude},${location.latitude}`
    : ''
  const {
    loading: loading_paradas,
    data: paradas,
    error: error_paradas,
  } = useFetch(url)

  return (
    <div className="md:col-span-1 rounded-md shadow-md border overflow-hidden">
      <div className="h-2 bg-gradient-to-r from-slate-200 to-slate-400 transition-all duration-300 ease-in-out mb-2 "></div>
      <div className="p-0">
        <div className="border-b p-4">
          <div className="mb-2 ">
            <h3 className="text-lg font-semibold">Paradas Próximas de </h3>
            <div className="flex items-center border rounded-md border-slate-400 ml-2">
              <span className="text-nowrap  p-1 m-1 text-base rounded-sm border-slate-200 text-slate-500 cursor-pointer min-w-12 w-full ">
                {location ? (
                  `Sua posição (${location.latitude} ${location.longitude})`
                ) : (
                  <>nenhuma parada selecionada</>
                )}
              </span>
              <button className="h-8 text-sm text-blue-600 flex items-center font-medium p-1">
                <span className="mx-auto">
                  <Editar className="h-4" />{' '}
                </span>
              </button>
            </div>
          </div>
          <p className="text-sm text-gray-500">
            Algumas paradas podem não aparecer na busca por proximidade
          </p>
        </div>

        <div className="divide-y">
          {paradas &&
            paradas.paradas &&
            paradas.paradas.slice(0, 5).map((stop) => (
              <div key={stop.cod} className="p-4 hover:bg-gray-50">
                <div className="mb-1 flex items-center gap-2">
                  <span>
                    <PinoLocalizacao />
                  </span>
                  <div className="flex flex-col w-4/5">
                    <h4 className="font-medium">{stop.desc}</h4>
                    <div className="flex text-xs font-medium text-slate-500 gap-1">
                      <span>{stop.y}</span>
                      <span>{stop.x}</span>
                    </div>
                  </div>
                  <span className="text-xs text-gray-500">{stop.cod}</span>
                </div>
                <div className="flex gap-1"></div>
              </div>
            ))}

          <div className="p-4 ">
            <a
              variant="outline"
              className="w-full flex items-center justify-center border rounded-md font-medium py-2 gap-2"
              href="/explorar"
            >
              <span>
                <PinoLocalizacao className="h-4  text-blue-600" />
              </span>
              <p
                className="tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-indigo-500"
                href="/explorar"
              >
                Explorar
              </p>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
