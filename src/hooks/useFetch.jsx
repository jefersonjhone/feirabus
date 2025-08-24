import { useEffect, useState } from 'react'

export function useFetch(uri) {
  const [data, setData] = useState(undefined)
  const [error, setError] = useState()
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    if (!uri) return
    fetch(uri)
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
      .then(setData)
      .finally(() => setLoading(false))
      .catch((e) => setError(JSON.parse(e.message)))
  }, [uri])
  return {
    loading,
    data,
    error,
  }
}
