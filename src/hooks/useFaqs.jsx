
import { useState, useEffect } from "react"

const useFaqs = () => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        setLoading(true)
        const response = await fetch("http://localhost:3042/faqs")

        if (!response.ok) {
          throw new Error(`Kunne ikke hente FAQs`)
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
    }

    fetchFaqs()
  }, [])

  return { data, loading, error }
}

export default useFaqs

