
import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import useBlogs from "../hooks/useBlogs"
import "./BlogPost.css"

function BlogPost() {
  const { id } = useParams()
  const { data: blogsData, loading, error } = useBlogs()
  const [blog, setBlog] = useState(null)

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

  useEffect(() => {
    if (!blogsData || !id) return

    const blogs = extractBlogs(blogsData)
    let foundBlog = null

    foundBlog = blogs.find((b) => b._id?.$oid === id)
    if (foundBlog) {
      setBlog(foundBlog)
      return
    }

    foundBlog = blogs.find((b) => b._id && String(b._id) === id)
    if (foundBlog) {
      setBlog(foundBlog)
      return
    }

    foundBlog = blogs.find((b) => b._id && b._id.toString() === id)
    if (foundBlog) {
      setBlog(foundBlog)
      return
    }

    if (id.startsWith("blog-")) {
      const index = Number.parseInt(id.replace("blog-", ""), 10)
      if (!isNaN(index) && index >= 0 && index < blogs.length) {
        setBlog(blogs[index])
        return
      }
    }

    if (blogs.length === 1 && (!id || id === "undefined")) {
      setBlog(blogs[0])
      return
    }

    setBlog(null)
  }, [blogsData, id])

  return (
    <div className="blog-post">
      <div className="section-header">
        <img src="/studie2.jpg" alt="Blog" />
        <div className="section-header-overlay"></div>
        <div className="section-header-content">
          <h1>BLOG</h1>
          <div className="breadcrumb">
            <Link to="/">Forside</Link> / <Link to="/blog-archive">BLOG ARKIV</Link> / <span>BLOG</span>
          </div>
        </div>
      </div>

      <div className="container">
        {loading && <div className="loading">Loading blog post...</div>}
        {error && <div className="error">Error: {error}</div>}

        {blog ? (
          <div className="post-content">
            <div className="post-header">
              <p className="post-category text-orange">OFFICIEL SERIE</p>
              <h2>{blog.title}</h2>
              <p className="post-author text-gray">Skrevet af: Cinestar</p>
              <p className="post-date text-gray">
                {blog.created?.$date ? new Date(blog.created.$date).toLocaleDateString() : "Dato ikke tilgængelig"}
              </p>
            </div>

            <div className="post-image">
              <img src={blog.image || "/blog-placeholder.jpg"} alt={blog.title} />
            </div>

            <div className="post-body">
              {blog.teaser && (
                <p className="post-teaser">
                  <strong>{blog.teaser}</strong>
                </p>
              )}
              <p>{blog.description || blog.content}</p>
            </div>

            <div className="post-navigation">
              <Link to="/blog-archive" className="btn">
                Back to Blog Archive
              </Link>
            </div>
          </div>
        ) : (
          !loading && (
            <div className="not-found">
              <h2>Blog post not found</h2>
              <p>The blog post you are looking for does not exist.</p>
              <Link to="/blog-archive" className="btn">
                Back to Blog Archive
              </Link>
            </div>
          )
        )}
      </div>
    </div>
  )
}

export default BlogPost

