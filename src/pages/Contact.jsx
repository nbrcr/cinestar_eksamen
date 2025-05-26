
import { useState } from "react"
import { Link } from "react-router-dom"
import useMessages from "../hooks/useMessages"
import Notification from "../components/Notification"
import "./Contact.css"

function Contact() {
  const { createMessage } = useMessages()
  const [formData, setFormData] = useState({
    name: "",
    subject: "",
    description: "",
  })
  const [notification, setNotification] = useState({
    show: false,
    type: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Opdaterer formularens data når brugeren skriver
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }

  // Viser en besked i toppen af siden
  const showNotification = (type, message) => {
    setNotification({ show: true, type, message })
    setTimeout(() => setNotification({ show: false, type: "", message: "" }), 5000)
  }

  // Håndterer når brugeren sender formularen
  const handleSubmit = async (e) => {
    e.preventDefault()

    // Tjekker om alle felter er udfyldt
    if (!formData.name || !formData.subject || !formData.description) {
      showNotification("error", "Alle felter skal udfyldes")
      return
    }

    try {
      setIsSubmitting(true) // Viser at beskeden bliver sendt

      // Opretter beskeddata som skal sendes til serveren
      const messageData = {
        name: formData.name,
        subject: formData.subject,
        description: formData.description,
        status: false, // Standard: ulæst besked
      }

      await createMessage(messageData) // Sender beskeden til serveren

      // Nulstiller formularen efter succes
      setFormData({
        name: "",
        subject: "",
        description: "",
      })

      showNotification("success", "Din besked er sendt! Vi vender tilbage hurtigst muligt.")
    } catch (error) {
      console.error("Fejl ved afsendelse af formular:", error)
      showNotification("error", `Der opstod en fejl: ${error.message}`)
    } finally {
      setIsSubmitting(false) // Stopper "sender"-status
    }
  }

  return (
    <div className="contact-page">
      {/* Viser en besked hvis der er en notifikation */}
      {notification.show && (
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification({ show: false, type: "", message: "" })}
        />
      )}

      {/* Header med billede og titel */}
      <div className="section-header">
        <img src="/studie2.jpg" alt="Contact" />
        <div className="section-header-overlay"></div>
        <div className="section-header-content">
          <h1>KONTAKT</h1>
          <div className="breadcrumb">
            <Link to="/">Forside</Link> / <span>KONTAKT</span>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="contact-content">
          {/* Kontaktinformation */}
          <div className="contact-info">
            <div className="contact-intro">
              <p className="text-orange text-uppercase">Hvorfor vælge os?</p>
              <h2 className="text-uppercase">Tøv ikke med at tage kontakt</h2>
              <p>
                Har du spørgsmål? Skriv eller ring til os! Vi er altid klar til at hjælpe dig. Du kan kontakte os på
                telefon, e-mail eller ved at udfylde formularen her på siden.
              </p>
            </div>

            <div className="contact-details">
              <div className="contact-item">
                <div className="contact-icon">
                  <i className="phone-icon"></i>
                </div>
                <p>+45 12 34 56 78</p>
              </div>

              <div className="contact-item">
                <div className="contact-icon">
                  <i className="location-icon"></i>
                </div>
                <p>Filmvej 10, 8000 Aarhus</p>
              </div>

              <div className="contact-item">
                <div className="contact-icon">
                  <i className="email-icon"></i>
                </div>
                <p>kontakt@cinestar.dk</p>
              </div>
            </div>

            <div className="contact-cta">
              <div className="cta-logo">
                <img src="/logo.png" alt="Cinestar" />
              </div>

              <div className="cta-text">
                <h3 className="text-uppercase">Har du en idé? Tanker?</h3>
                <h2 className="text-uppercase">Lad os starte dit</h2>
                <h2 className="text-uppercase text-orange">projekt sammen</h2>
              </div>

              <div className="cta-phone">
                <div className="contact-icon">
                  <i className="phone-icon"></i>
                </div>
                <p>+45 12 34 56 78</p>
              </div>

              <div className="cta-social">
                <Link to="#">FACEBOOK</Link>
                <Link to="#">TWITTER</Link>
                <Link to="#">INSTAGRAM</Link>
                <Link to="#">YOUTUBE</Link>
              </div>
            </div>
          </div>

          {/* Kontaktformular */}
          <div className="contact-form">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Navn</label>
                <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
              </div>

              <div className="form-group">
                <label htmlFor="subject">Emne</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">Besked</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="5"
                  required
                ></textarea>
              </div>

              <button type="submit" className="btn" disabled={isSubmitting}>
                {isSubmitting ? "Sender..." : "Send besked"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Contact

