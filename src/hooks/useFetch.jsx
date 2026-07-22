import { useEffect, useState } from 'react'

export function useFetch(uri) {
  const [data, setData] = useState(undefined)
  const [error, setError] = useState()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!uri) return

    const controller = new AbortController()

    setLoading(true)
    setData(undefined)
    setError(undefined)

    fetch(uri, { signal: controller.signal })
      .then(async (res) => {
        if (!res.ok) {
          const body = await res.json()
          throw new Error(
            JSON.stringify({
              status: res.status,
              message: body,
            })
          )
        }
        return res.json()
      })
      .then(setData)
      .finally(() => setLoading(false))
      .catch((e) => {
        if (e.name !== 'AbortError') {
          setError(JSON.parse(e.message))
        }
      })

    return () => controller.abort()
  }, [uri])

  return {
    loading,
    data,
    error,
  }
}
