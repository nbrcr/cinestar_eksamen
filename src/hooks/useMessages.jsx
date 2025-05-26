/* eslint-disable no-unused-vars */
/* eslint-disable no-useless-catch */

import { useState, useEffect, useCallback } from "react"

const useMessages = () => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchMessages = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch("http://localhost:3042/messages")

      if (!response.ok) {
        throw new Error(`Kunne ikke hente beskeder: ${response.status}`)
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
    fetchMessages()
  }, [fetchMessages])

  const createMessage = async (messageData) => {
    try {
      setLoading(true)
      const response = await fetch("http://localhost:3042/message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(messageData),
      })

      if (!response.ok) {
        throw new Error(`Kunne ikke oprette besked: ${response.status}`)
      }

      const result = await response.json()
      await fetchMessages()
      return result
    } catch (err) {
      throw err
    } finally {
      setLoading(false)
    }
  }

  const updateMessage = async (id, messageData) => {
    if (!id) {
      throw new Error("Besked ID er påkrævet for opdatering")
    }

    try {
      setLoading(true)
      const response = await fetch(`http://localhost:3042/message`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: id,
          ...messageData,
        }),
      })

      if (!response.ok) {
        throw new Error(`Kunne ikke opdatere besked: ${response.status}`)
      }

      const result = await response.json()
      await fetchMessages()
      return result
    } catch (err) {
      throw err
    } finally {
      setLoading(false)
    }
  }

  const deleteMessage = async (id) => {
    if (!id) {
      throw new Error("Besked ID er påkrævet for sletning")
    }

    try {
      setLoading(true)
      const response = await fetch(`http://localhost:3042/message/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error(`Kunne ikke slette besked: ${response.status}`)
      }

      let result
      try {
        result = await response.json()
      } catch (e) {
        result = { success: true }
      }

      await fetchMessages()
      return result
    } catch (err) {
      throw err
    } finally {
      setLoading(false)
    }
  }

  return {
    data,
    loading,
    error,
    refetch: fetchMessages,
    createMessage,
    updateMessage,
    deleteMessage,
  }
}

export default useMessages

