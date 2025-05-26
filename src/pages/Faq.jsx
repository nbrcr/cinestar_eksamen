
import { useState } from "react"
import { Link } from "react-router-dom"
import useFaqs from "../hooks/useFaqs"
import "./Faq.css"

function Faq() {
  const { data: faqsData, loading, error } = useFaqs()
  const [activeIndex, setActiveIndex] = useState(null)

  const extractFaqs = (data) => {
    if (!data) return []
    if (Array.isArray(data)) return data
    if (data.id || data._id) return [data]

    const possibleFields = ["data", "faqs", "items", "results", "documents"]
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

  const faqs = extractFaqs(faqsData)

  const toggleFaq = (index) => {
    setActiveIndex(activeIndex === index ? null : index)
  }

  return (
    <div className="faq-page">
      <div className="section-header">
        <img src="/studie2.jpg" alt="FAQ" />
        <div className="section-header-overlay"></div>
        <div className="section-header-content">
          <h1>FAQ</h1>
          <div className="breadcrumb">
            <Link to="/">Forside</Link> / <span>FAQ</span>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="faq-intro">
          <p className="text-orange text-uppercase">Ofte stillede spørgsmål</p>
          <h2 className="text-uppercase">De mest almindelige spørgsmål vi får</h2>
          <p>
            Her finder du svar på de spørgsmål, som vi oftest får fra vores kunder. Hvis du ikke finder svar på dit
            spørgsmål, er du velkommen til at kontakte os.
          </p>
        </div>

        {loading && <div className="loading">Henter FAQs...</div>}
        {error && <div className="error">Fejl: {error}</div>}

        {faqs.length > 0 ? (
          <div className="faq-list">
            {faqs.map((faq, index) => (
              <div key={faq.id || faq._id || index} className="faq-item">
                <div
                  className={`faq-question ${activeIndex === index ? "active" : ""}`}
                  onClick={() => toggleFaq(index)}
                >
                  <h3>{faq.question}</h3>
                  <span className="faq-icon">{activeIndex === index ? "-" : "+"}</span>
                </div>
                {activeIndex === index && (
                  <div className="faq-answer">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          !loading && (
            <div className="no-faqs">
              <p>Ingen FAQs fundet.</p>
            </div>
          )
        )}
      </div>
    </div>
  )
}

export default Faq

