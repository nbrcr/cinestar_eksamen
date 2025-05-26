/* eslint-disable no-unused-vars */
import { Swiper, SwiperSlide } from "swiper/react"
import { Pagination, Autoplay } from "swiper/modules"
import useReviews from "../hooks/useReviews"
import "swiper/css"
import "swiper/css/pagination"
import "./ReviewsSlider.css"

function ReviewsSlider() {
  const { data: reviewsData, loading, error } = useReviews()

  const extractReviews = (data) => {
    if (!data) return []
    if (data.data && Array.isArray(data.data)) return data.data
    if (Array.isArray(data)) return data
    return []
  }

  const reviews = extractReviews(reviewsData)

  const renderStars = (rating) => {
    const stars = []
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={`star ${i <= rating ? "filled" : ""}`}>
          ★
        </span>,
      )
    }
    return stars
  }

  if (loading) {
    return (
      <section className="reviews-slider-section">
        <div className="container">
          <div className="reviews-slider-header">
            <h2>KUNDEANMELDELSER</h2>
          </div>
          <div className="loading">Indlæser anmeldelser...</div>
        </div>
      </section>
    )
  }

  if (reviews.length === 0) {
    return (
      <section className="reviews-slider-section">
        <div className="container">
          <div className="reviews-slider-header">
            <h2>KUNDEANMELDELSER</h2>
          </div>
          <div className="no-reviews">Ingen anmeldelser tilgængelige på nuværende tidspunkt.</div>
        </div>
      </section>
    )
  }

  return (
    <section className="reviews-slider-section">
      <div className="container">
        <div className="reviews-slider-header">
          <h2>KUNDEANMELDELSER</h2>
        </div>

        <Swiper
          modules={[Pagination, Autoplay]}
          spaceBetween={30}
          slidesPerView={1}
          pagination={{ clickable: true }}
          autoplay={{ delay: 6000, disableOnInteraction: false }}
          breakpoints={{
            768: {
              slidesPerView: 2,
            },
            1024: {
              slidesPerView: 3,
            },
          }}
        >
          {reviews.map((review, index) => (
            <SwiperSlide key={review._id || review.id || index}>
              <div className="review-slide">
                <div className="review-header">
                  <div className="review-avatar">
                    {review.avatar ? (
                      <img src={review.avatar || "/placeholder.svg"} alt={review.name} />
                    ) : (
                      review.name?.charAt(0) || "U"
                    )}
                  </div>
                  <div className="review-author">
                    <h3>{review.name}</h3>
                    <div className="review-rating">{renderStars(review.rating)}</div>
                    <div className="review-date">{new Date(review.created).toLocaleDateString()}</div>
                  </div>
                </div>
                <div className="review-content">{review.text}</div>
                {review.position && <div className="review-project">{review.position}</div>}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  )
}

export default ReviewsSlider

