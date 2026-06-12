
import { useEffect, useState } from 'react'
import { useLinhasStore } from '../stores/linhaStore'
import url from '../utils/urls'

export function useLines(cod_line) {
  const [error, setError] = useState()
  const [loading, setLoading] = useState(true)
  const lines = useLinhasStore(s=>s.linhas)
  const setLinhas = useLinhasStore((state) => state.setLinhas);
  
  useEffect(() => {
    if (lines && Object.keys(lines).length > 0) {
      setLoading(false)
      return;
    }
    fetch(`${url}/linhas/`)
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
        setLinhas(data)
      })
      .finally(() => setLoading(false))
      .catch((e) => setError(JSON.parse(e.message)))
  }, [cod_line, loading, error, lines])
  if (cod_line) {
    if (lines && Object.keys(lines).length > 0) {
      const match_lines = Object.values(lines).filter(l => l.sgl === cod_line)
      if (match_lines.length > 0) {
        return match_lines[0]
      }
    }
    return undefined
  }

  return {
    loading,
    lines,
    error,
  }
}