import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation, Pagination, Autoplay } from "swiper/modules"
import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"
import "./FeaturedSlider.css"

const featuredProjects = [
  {
    id: 1,
    image: "/public/studio.jpg",
  },
  {
    id: 2,
    image: "/public/studie2.jpg",
  },
  {
    id: 3,
    image: "/public/filming.jpg",
  },
]

function FeaturedSlider() {
  return (
    <section className="featured-slider-section">
      <div className="container">
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={30}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
        >
          {featuredProjects.map((project) => (
            <SwiperSlide key={project.id}>
              <div className="featured-slide">
                <img
                  src={project.image || "/placeholder.svg?height=400&width=600"}
                  alt="Udvalgt projekt"
                  className="featured-slide-image"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  )
}

export default FeaturedSlider

