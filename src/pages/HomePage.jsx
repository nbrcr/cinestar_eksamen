/* eslint-disable no-unused-vars */

import { useState } from "react"
import { Link } from "react-router-dom"
import FeaturedSlider from "../components/FeaturedSlider"
import ReviewsSlider from "../components/ReviewsSlider"
import useMessages from "../hooks/useMessages"
import Notification from "../components/Notification"
import "./HomePage.css"
import { MdOutlineLocalMovies } from "react-icons/md"
import { BiCameraMovie } from "react-icons/bi"
import { BiSolidMoviePlay } from "react-icons/bi"
import { FaMusic } from "react-icons/fa"
import { FaPhone, FaMapMarkerAlt, FaEnvelope } from "react-icons/fa"
import useBlogs from "../hooks/useBlogs"

function HomePage() {
  const { createMessage } = useMessages()
  const { data: blogsData } = useBlogs()
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

  const extractBlogs = (data) => {
    if (!data) return []
    if (Array.isArray(data)) return data
    if (data._id) return [data]

    const possibleFields = ["data", "blogs", "items", "results", "documents"]
    for (const field of possibleFields) {
      if (data[field] && Array.isArray(data[field])) {
        return data[field]
      }
    }

    for (const key in data) {
      if (Array.isArray(data[key])) {
        return data[key]
      }
    }

    if (typeof data === "object" && data !== null) {
      const values = Object.values(data)
      if (values.length > 0 && typeof values[0] === "object") {
        return values
      }
    }

    return []
  }

  const blogs = extractBlogs(blogsData)
  const recentBlog = blogs.length > 0 ? blogs[0] : null

  const formatDate = (dateString) => {
    if (!dateString) return "Ingen dato"

    try {
      const date = dateString.$date ? new Date(dateString.$date) : new Date(dateString)
      return `Oprettet d. ${date.getDate()}. ${
        [
          "januar",
          "februar",
          "marts",
          "april",
          "maj",
          "juni",
          "juli",
          "august",
          "september",
          "oktober",
          "november",
          "december",
        ][date.getMonth()]
      }, ${date.getFullYear()}`
    } catch (e) {
      return "Ingen dato"
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }

  const showNotification = (type, message) => {
    setNotification({ show: true, type, message })
    setTimeout(() => setNotification({ show: false, type: "", message: "" }), 5000)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.name || !formData.subject || !formData.description) {
      showNotification("error", "Alle felter skal udfyldes")
      return
    }

    try {
      setIsSubmitting(true)

      const messageData = {
        name: formData.name,
        subject: formData.subject,
        description: formData.description,
        status: false,
      }

      await createMessage(messageData)

      setFormData({
        name: "",
        subject: "",
        description: "",
      })

      showNotification("success", "Din besked er sendt! Vi vender tilbage hurtigst muligt.")
    } catch (error) {
      console.error("Fejl ved indsendelse af formular:", error)
      showNotification("error", `Der opstod en fejl: ${error.message}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="home-page">
      {notification.show && (
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification({ show: false, type: "", message: "" })}
        />
      )}

      <section className="hero">
        <div className="hero-overlay"></div>
        <div className="container">
          <div className="hero-content">
            <div className="hero-logo">
              <h2>CINESTAR STUDIO</h2>
            </div>
            <h1>
              FILM & TV <span className="text-orange">PRODUKTION</span>
            </h1>
            <p>
              Vi skaber levende fortællinger, der fanger dit publikum. Fra idé til færdigt produkt leverer vi
              professionelle film- og tv-løsninger, der gør din historie
            </p>
            <div className="hero-awards">
              <div className="award">
                <img src="/award1.png" alt="Pris" />
              </div>
              <div className="award">
                <img src="/award2.png" alt="Pris" />
              </div>
              <div className="award">
                <img src="/award3.png" alt="Pris" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="projects">
        <div className="container">
          <div className="projects-header">
            <p className="studio-name">CINESTAR STUDIO</p>
            <h1 className="projects-title">HAR DU EN IDE TIL DIT NÆSTE PROJEKT?</h1>
            <p className="projects-description">
              Lad os omsætte dine visioner til levende billeder, der fænger dit publikum. Hos os får du en professionel,
              kreativ proces fra idéudvikling til færdig produktion.
            </p>
          </div>
          <div className="project-card">
            <div className="project-video">
              <div className="project-video">
                <div className="video-wrapper">
                  <iframe
                    src="https://www.youtube.com/embed/CiEdzvwecFg"
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
            </div>
            <div className="project-content">
              <h3>TØV IKKE MED AT VÆLGE CINESTAR TIL DIT NÆSTE FILM-PROJEKT</h3>
              <p>
                Hos Cinestar kombinerer vi vores passion for historiefortælling med et skarpt øje for detaljen. Med
                moderne udstyr og et erfarent team sikrer vi, at din produktion løfter sig fra skitse til strålende
                slutresultat – hver gang.
              </p>
              <Link to="/blog-archive" className="read-more">
                LÆS MERE
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="section-title">
        <h2>UDVALGTE PROJEKTER</h2>
      </div>
      <FeaturedSlider />
      <div className="container">
        <div className="featured-description">
          <p>Her præsenterer vi et udvalg af de produktioner, vi er stolte af at have skabt.</p>
          <p>
            Hvert projekt fortæller sin unikke historie og illustrerer vores ambition om at levere høj kvalitet,
            originalitet og visuel gennemslagskraft.
          </p>
          <p>Gå på opdagelse, og lad dig inspirere af vores arbejde.</p>
        </div>
      </div>
      <section className="services-section">
        <div className="container">
          <div className="section-title">
            <h2>VORES SERVICES</h2>
          </div>

          <div className="services-grid">
            <div className="service-item">
              <div className="service-icon">
                <MdOutlineLocalMovies />
              </div>
              <h3>FILMPRODUKTION</h3>
              <p>Professionel filmproduktion til alle formål - fra idé til færdigt produkt.</p>
            </div>

            <div className="service-item">
              <div className="service-icon">
                <FaMusic />
              </div>
              <h3>MUSIKVIDEOER</h3>
              <p>Kreative musikvideoer der fanger essensen af din musik og forstærker dit brand.</p>
            </div>

            <div className="service-item">
              <div className="service-icon">
                <BiCameraMovie />
              </div>
              <h3>REKLAMEFILM</h3>
              <p>Effektive reklamefilm der kommunikerer dit budskab og skaber resultater.</p>
            </div>

            <div className="service-item">
              <div className="service-icon">
                <BiSolidMoviePlay />
              </div>
              <h3>DOKUMENTARFILM</h3>
              <p>Autentiske dokumentarfilm der fortæller din historie på en engagerende måde.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="history-section">
        <div className="container">
          <div className="history-content">
            <div className="history-text">
              <h3 className="history-subtitle">HISTORIEN</h3>
              <h2 className="history-title">HISTORIEN BAG CINESTAR</h2>
              <p className="history-description">
                Cinestar blev grundlagt med en passion for at fortælle historier, der fanger og bevæger sit publikum.
                Virksomheden begyndte som en lille uafhængig film- og tv-produktionsenhed med et klart fokus på
                originalt og visuelt engagerende indhold.
              </p>
              <div className="history-ceo">
                <h3 className="ceo-name">DYAS KARDINAL</h3>
                <p className="ceo-title">CEO AF CINESTAR</p>
              </div>
            </div>
            <div className="history-image">
              <img src="/filming.jpg" alt="Dyas Kardinal, CEO af Cinestar" />
            </div>
          </div>
        </div>
      </section>
      <ReviewsSlider />

      <section className="contact-home-section">
        <div className="container">
          <div className="contact-home-content">
            <div className="contact-home-info">
              <h3 className="contact-subtitle">KONTAKT</h3>
              <h2 className="contact-title">BOOK EN SAMTALE MED OS</h2>
              <p className="contact-description">
                Har du spørgsmål eller ønsker du at vide mere om, hvordan vi kan hjælpe med dit næste projekt? Udfyld
                formularen, og vi kontakter dig hurtigst muligt. Vi ser frem til at samarbejde med dig!
              </p>

              <div className="contact-details">
                <div className="contact-item">
                  <div className="contact-icon">
                    <FaPhone />
                  </div>
                  <p>+45 12 34 56 78</p>
                </div>

                <div className="contact-item">
                  <div className="contact-icon">
                    <FaMapMarkerAlt />
                  </div>
                  <p>Fotovej 66, 8456 Cineby</p>
                </div>

                <div className="contact-item">
                  <div className="contact-icon">
                    <FaEnvelope />
                  </div>
                  <p>cinestar@production.dk</p>
                </div>
              </div>
            </div>

            <div className="contact-home-form">
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Navn"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    placeholder="Emne"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <textarea
                    id="description"
                    name="description"
                    placeholder="Besked"
                    value={formData.description}
                    onChange={handleChange}
                    rows="5"
                    required
                  ></textarea>
                </div>

                <button type="submit" className="send-button" disabled={isSubmitting}>
                  {isSubmitting ? "Sender..." : "Send besked"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <section className="recent-blog-section">
        <div className="container">
          <div className="recent-blog-content">
            <div className="recent-blog-header">
              <h3 className="blog-subtitle">BLOG</h3>
              <h2 className="blog-title">VORES SENESTE BLOG</h2>
              <p className="blog-description">
                Hold dig opdateret med de seneste nyheder, indblik og historier fra Cinestar. Vi deler inspiration, tips
                og bag kulisserne fra vores spændende projekter og produktioner.
              </p>
            </div>

            {recentBlog ? (
              <div className="recent-blog-card">
                <div className="recent-blog-image">
                  <img src={recentBlog.image || "/filming-woman.jpg"} alt={recentBlog.title} />
                </div>
                <div className="recent-blog-info">
                  <h3 className="recent-blog-title">{recentBlog.title || "OPTAGELSERNE TIL MUSIKALBUMMET AF RURI"}</h3>
                  <p className="recent-blog-excerpt">
                    {recentBlog.teaser ||
                      "Bag kulisserne på en kreativ proces, hvor hvert øjeblik tæller. Vi samarbejdede tæt med Ruri for at skabe en visuel fortælling, der komplementerer musikkens dybde og stemning."}
                  </p>
                  <p className="recent-blog-date">{formatDate(recentBlog.created) || "Oprettet d. 30. januar, 2025"}</p>
                </div>
              </div>
            ) : (
              <div className="recent-blog-card">
                <div className="recent-blog-image">
                  <img src="/filming-woman.jpg" alt="Optagelsessession" />
                </div>
                <div className="recent-blog-info">
                  <h3 className="recent-blog-title">OPTAGELSERNE TIL MUSIKALBUMMET AF RURI</h3>
                  <p className="recent-blog-excerpt">
                    Bag kulisserne på en kreativ proces, hvor hvert øjeblik tæller. Vi samarbejdede tæt med Ruri for at
                    skabe en visuel fortælling, der komplementerer musikkens dybde og stemning.
                  </p>
                  <p className="recent-blog-date">Oprettet d. 30. januar, 2025</p>
                </div>
              </div>
            )}

            <Link to="/blog-archive" className="view-all-blogs">
              SE ALLE BLOGS
            </Link>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="container">
          <h2 className="cta-title">
            HAR DU EN IDÉ I TANKERNE?
            <br />
            LAD OS STARTE DIT PROJEKT SAMMEN
          </h2>
          <div className="cta-contact">
            <p className="cta-studio">Cinestar Studio</p>
            <p className="cta-phone">+123-456-789</p>
            <p className="cta-email">cinestar@mail.com</p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePage

