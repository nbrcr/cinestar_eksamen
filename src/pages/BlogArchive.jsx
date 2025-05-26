import { Link } from "react-router-dom"
import useBlogs from "../hooks/useBlogs"
import NewsletterSignup from "../components/NewsletterSignup"
import "./BlogArchive.css"

function BlogArchive() {
  const { data: blogsData, loading, error } = useBlogs()

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

  return (
    <div className="blog-archive">
      <div className="section-header">
        <img src="/studie2.jpg" alt="Blog Archive" />
        <div className="section-header-overlay"></div>
        <div className="section-header-content">
          <h1>BLOG ARKIV</h1>
          <div className="breadcrumb">
            <Link to="/">Forside</Link> / <span>BLOG ARKIV</span>
          </div>
        </div>
      </div>

      <div className="container">
        {loading && <div className="loading">Loading blogs...</div>}
        {error && <div className="error">Error: {error}</div>}

        {blogs.length > 0 ? (
          <div className="blog-grid">
            {blogs.map((blog, index) => {
              const blogId = blog._id?.$oid || (blog._id ? String(blog._id) : `blog-${index}`)

              return (
                <div key={blogId} className="blog-card">
                  <div className="blog-image">
                    <img src={blog.image || "/blog-placeholder.jpg"} alt={blog.title} />
                  </div>
                  <div className="blog-content">
                    <p className="blog-category text-orange">OFFICIEL SERIE</p>
                    <h3>{blog.title}</h3>
                    <p className="blog-author text-gray">Skrevet af: Cinestar</p>
                    <p className="blog-excerpt">
                      {blog.teaser || blog.description?.substring(0, 150) || "No content"}
                      ...
                    </p>
                    <Link to={`/blog/${blogId}`} className="read-more">
                      LÆS MERE
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          !loading && (
            <div className="no-blogs">
              <p>Ingen blogs fundet.</p>
            </div>
          )
        )}

        <NewsletterSignup />
      </div>
    </div>
  )
}

export default BlogArchive

