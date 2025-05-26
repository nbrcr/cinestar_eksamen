
import { useState, useEffect, useCallback } from "react"

const useReviews = () => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchReviews = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch("http://localhost:3042/reviews")

      if (!response.ok) {
        throw new Error(`Kunne ikke hente anmeldelser: ${response.status}`)
      }

      const result = await response.json()
      setData(result)
      setError(null)
    } catch (err) {
      setError(err.message)
      setData(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchReviews()
  }, [fetchReviews])

  return {
    data,
    loading,
    error,
    refetch: fetchReviews,
  }
}

export default useReviews

