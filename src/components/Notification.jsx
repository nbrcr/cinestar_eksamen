
import { useState, useEffect } from "react"
import "./Notification.css"

function Notification({ type, message, duration = 5000, onClose }) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    if (!message) return

    setVisible(true)

    const timer = setTimeout(() => {
      setVisible(false)
      if (onClose) onClose()
    }, duration)

    return () => clearTimeout(timer)
  }, [message, duration, onClose])

  if (!message || !visible) return null

  return (
    <div className={`notification ${type}`}>
      <div className="notification-content">
        <p>{message}</p>
        <button
          className="notification-close"
          onClick={() => {
            setVisible(false)
            if (onClose) onClose()
          }}
        >
          ×
        </button>
      </div>
    </div>
  )
}

export default Notification

