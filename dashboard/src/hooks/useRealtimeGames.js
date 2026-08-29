import { useEffect, useMemo, useState } from 'react'
import { listenToGames } from '../services/gameService'

export function useRealtimeGames() {
  const [records, setRecords] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    const stop = listenToGames(
      (data) => { setRecords(Array.isArray(data) ? data : []); setError(''); setLoading(false) },
      (err) => { setError(err instanceof Error ? err.message : 'No fue posible leer Firebase.'); setLoading(false) },
    )
    return stop
  }, [])
  return useMemo(() => ({ records, error, loading }), [records, error, loading])
}
