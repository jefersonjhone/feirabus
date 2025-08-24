import { useEffect, useState } from 'react'
import url from '../utils/urls.js'
import { useFetch } from '../hooks/useFetch.jsx'
import { BarLoading } from './loading.jsx'
import Error from './error.jsx'
import { useSearchParams, useNavigate, Link } from 'react-router-dom'

const onibus = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    class="lucide lucide-clock h-4 w-4 text-route-purple"
  >
    <circle cx="12" cy="12" r="10"></circle>
    <polyline points="12 6 12 12 16 14"></polyline>
  </svg>
)

const relogio = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    class="lucide lucide-clock h-4 w-4 text-route-purple"
  >
    <circle cx="12" cy="12" r="10"></circle>
    <polyline points="12 6 12 12 16 14"></polyline>
  </svg>
)
export const HorariosDetail = ({ props }) => {
  const [day, setDay] = useState(0)
  const [saida, setSaida] = useState(0)
  const [params] = useSearchParams()
  const navigate = useNavigate()
  //const horarios = ["4:00", "5:00", "6:00", "7:00", "9:00", "9:40", "11:00", "12:00", "15:00", "19:00"]
  const { line, handle_exit } = props

  const {
    loading: loading,
    data: horarios,
    error: error,
  } = useFetch(url + `/linhas/${line.cod}/horarios`)

  const directions = horarios !== undefined ? Object.keys(horarios) : []
  const days =
    horarios !== undefined && horarios[directions[saida]]
      ? Object.keys(horarios[directions[saida]])
      : []
  const quadro_horarios =
    days.length > 0 ? horarios[directions[saida]][days[day]] : []

  //console.log(directions)
  //console.log(days)
  //["Dia útil", "Sábado", "Domingo"]
  //["UEFS DIRETA VIA TERMINAL NORTE", "TERMINAL CENTRAL"]
  return (
    <div
      className=" w-full h-2/3 md:w-1/2 md:h-1/2 overflow-scroll border border-gray-300 m-auto rounded-xl p-4 border-t-8 border-t-purple-800 bg-white opacity-100 z-20"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex flex-row gap-2 items-cente mb-2 sticky -top-5 bg-white py-2">
        <div className="w-12 h-12 aspect-square bg-purple-800 rounded-md text-white font-bold text-center flex items-center justify-center">
          {line.sgl}
        </div>
        <div className="font-semibold text-sm truncate w-full flex-col">
          <h4>{line.nom}</h4>
          <div className="flex flex-row gap-2">
            <div className="flex items-center justify-center bg-gray-300 rounded-md p-2 w-10 h-10 aspect-square cursor-pointer hover:bg-gray-200 hover:border  hover:border-gray-500">
              <svg
                viewBox="0 0 64 64"
                xmlns="http://www.w3.org/2000/svg"
                stroke-width="3"
                stroke="#000000"
                fill="none"
              >
                <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                <g
                  id="SVGRepo_tracerCarrier"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></g>
                <g id="SVGRepo_iconCarrier">
                  <path d="M32.5,10.36l6.84,13.57a.55.55,0,0,0,.42.3L55,26.4a.57.57,0,0,1,.3,1L44.3,37.9a.56.56,0,0,0-.16.51l2.6,14.88a.56.56,0,0,1-.81.6l-13.67-7a.59.59,0,0,0-.52,0l-13.67,7a.56.56,0,0,1-.81-.6l2.6-14.88a.56.56,0,0,0-.16-.51l-11-10.52a.57.57,0,0,1,.3-1l15.26-2.17a.55.55,0,0,0,.42-.3L31.5,10.36A.56.56,0,0,1,32.5,10.36Z"></path>
                </g>
              </svg>
            </div>

            <Link to={`/linhas?linha=${line.sgl}`}>
              <div className="flex items-center justify-center bg-gray-300 rounded-md p-2 w-10 h-10 aspect-square cursor-pointer hover:bg-gray-200 hover:border  hover:border-gray-500">
                <svg
                  width="100px"
                  height="100px"
                  viewBox="0 0 64 64"
                  xmlns="http://www.w3.org/2000/svg"
                  stroke-width="3"
                  stroke="#000000"
                  fill="none"
                >
                  <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                  <g
                    id="SVGRepo_tracerCarrier"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  ></g>
                  <g id="SVGRepo_iconCarrier">
                    <path d="M17.94,54.81a.1.1,0,0,1-.14,0c-1-1.11-11.69-13.23-11.69-21.26,0-9.94,6.5-12.24,11.76-12.24,4.84,0,11.06,2.6,11.06,12.24C28.93,41.84,18.87,53.72,17.94,54.81Z"></path>
                    <circle cx="17.52" cy="31.38" r="4.75"></circle>
                    <path d="M49.58,34.77a.11.11,0,0,1-.15,0c-.87-1-9.19-10.45-9.19-16.74,0-7.84,5.12-9.65,9.27-9.65,3.81,0,8.71,2,8.71,9.65C58.22,24.52,50.4,33.81,49.58,34.77Z"></path>
                    <circle cx="49.23" cy="17.32" r="3.75"></circle>
                    <path d="M17.87,54.89a28.73,28.73,0,0,0,3.9.89"></path>
                    <path
                      d="M24.68,56.07c2.79.12,5.85-.28,7.9-2.08,5.8-5.09,2.89-11.25,6.75-14.71a16.72,16.72,0,0,1,4.93-3"
                      stroke-dasharray="7.8 2.92"
                    ></path>
                    <path d="M45.63,35.8a23,23,0,0,1,3.88-.95"></path>
                  </g>
                </svg>
              </div>
            </Link>

            <div className="flex items-center justify-center bg-gray-300 rounded-md text-white  p-2 w-10 h-10 aspect-square cursor-pointer hover:bg-gray-200 hover:border  hover:border-gray-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                x="0px"
                y="0px"
                width="100"
                height="100"
                viewBox="0 0 50 50"
              >
                <path d="M 4 4 L 4 45 A 1.0001 1.0001 0 0 0 5 46 L 45 46 A 1.0001 1.0001 0 0 0 46 45 L 46 32 L 44 32 L 44 44 L 6 44 L 6 4 L 4 4 z M 37.990234 4.9902344 A 1.0001 1.0001 0 0 0 37.292969 6.7070312 L 41.585938 11 L 35.025391 11 C 24.998681 10.750465 18.501219 13.39498 14.695312 18.398438 C 10.889406 23.401895 9.8315993 30.506951 10 39.019531 A 1.0001907 1.0001907 0 1 0 12 38.980469 C 11.835401 30.660049 12.932016 24.020168 16.287109 19.609375 C 19.642203 15.198582 25.312319 12.759535 34.974609 13 L 34.988281 13 L 41.585938 13 L 37.292969 17.292969 A 1.0001 1.0001 0 1 0 38.707031 18.707031 L 45.414062 12 L 38.707031 5.2929688 A 1.0001 1.0001 0 0 0 37.990234 4.9902344 z"></path>
              </svg>
            </div>
          </div>
        </div>

        <div
          className="bg-gray-300 rounded-full p-2 w-10 h-10 aspect-square cursor-pointer hover:bg-gray-200 hover:border  hover:border-gray-500"
          onClick={handle_exit}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full"
            x="0px"
            y="0px"
            width="100"
            height="100"
            viewBox="0 0 50 50"
          >
            <path d="M 7.71875 6.28125 L 6.28125 7.71875 L 23.5625 25 L 6.28125 42.28125 L 7.71875 43.71875 L 25 26.4375 L 42.28125 43.71875 L 43.71875 42.28125 L 26.4375 25 L 43.71875 7.71875 L 42.28125 6.28125 L 25 23.5625 Z"></path>
          </svg>
        </div>
      </div>
      {loading ? (
        <BarLoading />
      ) : error ? (
        <Error error={error} imagesrc={'./explorar.png'} />
      ) : (
        <div className="flex gap-1 flex-col text-sm leading-4">
          <div className="border border-slate-200 p-2 rounded-lg">
            <h4 className="font-medium">Saída</h4>
            <ul className="w-full bg-slate-100 flex flex-row gap-2 p-1 rounded-lg items-center font-medium text-slate-500 text-sm">
              {directions.map((p, i) =>
                i === saida ? (
                  <li className="bg-purple-800 p-1 rounded-lg w-1/2 text-center text-white font-medium">
                    {p}
                  </li>
                ) : (
                  <li
                    className="p-1 rounded-lg w-1/2 text-center cursor-pointer"
                    onClick={() => {
                      setSaida(i)
                    }}
                  >
                    {p}
                  </li>
                )
              )}
            </ul>
          </div>

          <div className="border border-slate-200 p-2 rounded-lg">
            <h4 className="font-medium">Dia</h4>
            <ul className="w-full bg-slate-100 flex flex-row gap-2 p-1 rounded-lg items-center font-medium text-slate-500">
              {days.map((p, i) =>
                i === day ? (
                  <li className="bg-purple-800 p-1 rounded-lg w-full text-center text-white font-medium">
                    {p}
                  </li>
                ) : (
                  <li
                    className="p-1 rounded-lg w-full text-center cursor-pointer"
                    onClick={() => {
                      setDay(i)
                    }}
                  >
                    {p}
                  </li>
                )
              )}
            </ul>
          </div>
          <div className="h-full border border-1 p-2 rounded-lg">
            <h3 className="font-medium mb-2">Quadro de Horários</h3>
            {horarios !== undefined ? (
              <>
                <p className="text-sm text-gray-500 font-medium">
                  First bus: {quadro_horarios[0]} AM • Last bus:{' '}
                  {quadro_horarios[quadro_horarios.length - 1]} PM
                </p>
                <div className="grid grid-cols-4 flex-wrap gap-2 max-h-full overflow-scroll">
                  {quadro_horarios.map((hor) => (
                    <h3
                      className="min-w-1/5 text-center bg-purple-100 border border-2 border-slate-200
                                gap-2 py-2 px-4 text-base rounded-md font-medium"
                    >
                      {hor}
                    </h3>
                  ))}
                </div>
              </>
            ) : (
              <></>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
