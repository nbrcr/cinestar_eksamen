
import { useState } from "react"
import useSubscriptions from "../hooks/useSubscriptions"
import Notification from "./Notification"
import "./NewsletterSignup.css"

function NewsletterSignup() {
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [notification, setNotification] = useState({
    show: false,
    type: "",
    message: "",
  })
  const { createSubscription } = useSubscriptions()

  const showNotification = (type, message) => {
    setNotification({ show: true, type, message })
    setTimeout(() => setNotification({ show: false, type: "", message: "" }), 5000)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Basic email validation
    if (!email || !email.includes("@") || !email.includes(".")) {
      showNotification("error", "Indtast venligst en gyldig e-mailadresse")
      return
    }

    try {
      setIsSubmitting(true)
      await createSubscription(email)
      setEmail("")
      showNotification("success", "Tak for din tilmelding! Du vil nu modtage vores nyhedsbrev.")
    } catch (error) {
      console.error("Fejl ved tilmelding:", error)
      showNotification("error", `Der opstod en fejl: ${error.message}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="newsletter-signup">
      {notification.show && (
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification({ show: false, type: "", message: "" })}
        />
      )}

      <div className="newsletter-content">
        <h2 className="newsletter-title">EN BLOG, DER KAN INSPIRERE OG HJÆLPE DIG</h2>
        <p className="newsletter-description">
          Få de nyeste opdateringer, tips og indsigter direkte i din indbakke. Vores blog deler viden, inspiration og
          historier, der kan hjælpe dig med at tage dine projekter til det næste niveau.
        </p>

        <form onSubmit={handleSubmit} className="newsletter-form">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="newsletter-input"
            required
          />
          <button type="submit" className="newsletter-button" disabled={isSubmitting}>
            {isSubmitting ? "SENDER..." : "TILMELD NU"}
          </button>
        </form>
      </div>
    </div>
  )
}

export default NewsletterSignup

