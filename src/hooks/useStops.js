
import { useEffect, useState } from 'react'
import { useLinhasStore } from '../stores/linhaStore'
import url from '../utils/urls'

export function useStops(cod_stop) {
  const [error, setError] = useState()
  const [loading, setLoading] = useState(true)
  const stops = useLinhasStore(s=> s.paradas)
  const setStops = useLinhasStore((state) => state.setParadas);
  
  useEffect(() => {
    if (stops && Object.keys(stops).length > 0) {
      setLoading(false)
      return;
    }
    fetch(`${url}/paradas/all`)
      .then(async (data) => {
        if (!data.ok) {
          const errorBody = await data.json()
          throw new Error(
            JSON.stringify({
              status: data.status,
              message: errorBody,
            })
          )
        }
        return data.json()
      })
      .then((data) => {
        setStops(data.paradas)
      })
      .finally(() => setLoading(false))
      .catch((e) => setError(JSON.parse(e.message)))
  }, [cod_stop, loading, error, stops])
  if (cod_stop) {
    if (Object.keys(stops).length > 0) {
      return stops[cod_stop]
   
    }
    return undefined
  }

  return {
    loading,
    stops,
    error,
  }
}