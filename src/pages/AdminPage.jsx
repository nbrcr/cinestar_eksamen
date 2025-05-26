
import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import useBlogs from "../hooks/useBlogs"
import useMessages from "../hooks/useMessages"
import { FileText, MessageSquare, Edit, Trash2, X, Check, Mail, LogOut } from "react-feather"
import "./AdminPage.css"

function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [loginForm, setLoginForm] = useState({ username: "", password: "" })
  const [loginError, setLoginError] = useState("")

  const [activeSection, setActiveSection] = useState("blogs")
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedBlog, setSelectedBlog] = useState(null)
  const [selectedMessage, setSelectedMessage] = useState(null)
  const [notification, setNotification] = useState({
    show: false,
    type: "",
    message: "",
  })

  // Blog form state
  const [blogForm, setBlogForm] = useState({
    title: "",
    teaser: "",
    description: "",
    image: null,
    imagePreview: null,
  })

  // Get blogs data and CRUD functions
  const { data: blogsData, loading: blogsLoading, error: blogsError, createBlog, updateBlog, deleteBlog } = useBlogs()

  // Get Messages data and CRUD functions
  const {
    data: messagesData,
    loading: messagesLoading,
    error: messagesError,
    updateMessage,
    deleteMessage,
  } = useMessages()

  const blogs = extractData(blogsData)
  const messages = extractData(messagesData)

  useEffect(() => {
    const storedLoginState = localStorage.getItem("adminLoggedIn")
    if (storedLoginState === "true") {
      setIsLoggedIn(true)
    }
  }, [])

  function extractData(data) {
    if (!data) return []
    if (Array.isArray(data)) return data
    if (data._id) return [data]

    for (const field of ["data", "blogs", "items", "messages"]) {
      if (data[field] && Array.isArray(data[field])) return data[field]
    }

    for (const key in data) {
      if (Array.isArray(data[key])) return data[key]
    }

    if (typeof data === "object") {
      const values = Object.values(data)
      if (values.length > 0 && typeof values[0] === "object") return values
    }

    return []
  }

  // Show notification
  const showNotification = (type, message) => {
    setNotification({ show: true, type, message })
    setTimeout(() => setNotification({ show: false, type: "", message: "" }), 5000)
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (!file) return

    setBlogForm((prev) => ({
      ...prev,
      image: file,
      imagePreview: URL.createObjectURL(file),
    }))
  }

  // Reset form
  const resetForm = () => {
    setBlogForm({
      title: "",
      teaser: "",
      description: "",
      image: null,
      imagePreview: null,
    })
  }

  const openAddModal = () => {
    resetForm()
    setIsAddModalOpen(true)
  }

  const openEditModal = (blog) => {
    setSelectedBlog(blog)
    setBlogForm({
      title: blog.title || "",
      teaser: blog.teaser || "",
      description: blog.description || "",
      image: null,
      imagePreview: blog.image || null,
    })
    setIsEditModalOpen(true)
  }

  const openDeleteModal = (blog) => {
    setSelectedBlog(blog)
    setSelectedMessage(null)
    setIsDeleteModalOpen(true)
  }

  const openDeleteMessageModal = (message) => {
    setSelectedMessage(message)
    setSelectedBlog(null)
    setIsDeleteModalOpen(true)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setBlogForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleLoginChange = (e) => {
    const { name, value } = e.target
    setLoginForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleLogin = (e) => {
    e.preventDefault()

    if (loginForm.username === "admin" && loginForm.password === "password") {
      setIsLoggedIn(true)
      localStorage.setItem("adminLoggedIn", "true")
      setLoginError("")
    } else {
      setLoginError("Invalid username or password")
    }
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    localStorage.removeItem("adminLoggedIn")
  }

  const handleAddSubmit = async (e) => {
    e.preventDefault()

    try {
      if (!blogForm.title || !blogForm.description) {
        showNotification("error", "Title and description are required")
        return
      }

      const formData = new FormData()
      formData.append("title", blogForm.title)
      formData.append("teaser", blogForm.teaser)
      formData.append("description", blogForm.description)

      if (blogForm.image) {
        formData.append("file", blogForm.image)
      }

      await createBlog(formData)

      setIsAddModalOpen(false)
      showNotification("success", "Blog created successfully")
      resetForm()
    } catch (error) {
      console.error("Error creating blog:", error)
      showNotification("error", `Failed to create blog: ${error.message}`)
    }
  }

  const handleEditSubmit = async (e) => {
    e.preventDefault()

    if (!selectedBlog) return

    try {
      if (!blogForm.title || !blogForm.description) {
        showNotification("error", "Title and description are required")
        return
      }

      const formData = new FormData()
      formData.append("title", blogForm.title)
      formData.append("teaser", blogForm.teaser)
      formData.append("description", blogForm.description)

      if (blogForm.image) {
        formData.append("file", blogForm.image)
      }

      const blogId = selectedBlog._id?.$oid || selectedBlog._id

      await updateBlog(blogId, formData)

      // Close modal and show success notification
      setIsEditModalOpen(false)
      showNotification("success", "Blog updated successfully")
      resetForm()
    } catch (error) {
      console.error("Error updating blog:", error)
      showNotification("error", `Failed to update blog: ${error.message}`)
    }
  }

  const handleDeleteConfirm = async () => {
    if (selectedBlog) {
      try {
        // Get blog ID
        const blogId = selectedBlog._id?.$oid || selectedBlog._id

        // Delete blog
        await deleteBlog(blogId)

        setIsDeleteModalOpen(false)
        showNotification("success", "Blog deleted successfully")
      } catch (error) {
        console.error("Error deleting blog:", error)
        showNotification("error", `Failed to delete blog: ${error.message}`)
      }
    } else if (selectedMessage) {
      try {
        const messageId = selectedMessage._id?.$oid || selectedMessage._id

        await deleteMessage(messageId)

        setIsDeleteModalOpen(false)
        showNotification("success", "Message deleted successfully")
      } catch (error) {
        console.error("Error deleting message:", error)
        showNotification("error", `Failed to delete message: ${error.message}`)
      }
    }
  }

  const toggleMessageStatus = async (message) => {
    try {
      const messageId = message._id?.$oid || message._id

      await updateMessage(messageId, {
        ...message,
        status: !message.status,
      })

      showNotification("success", `Message marked as ${message.status ? "unread" : "read"}`)
    } catch (error) {
      console.error("Error updating message status:", error)
      showNotification("error", `Failed to update message status: ${error.message}`)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return "N/A"

    try {
      const date = dateString.$date ? new Date(dateString.$date) : new Date(dateString)

      return date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    } catch (e) {
      console.error("Error formatting date:", e)
      return "Invalid date"
    }
  }

  if (!isLoggedIn) {
    return (
      <div className="admin-login-container">
        <div className="admin-login-form">
          <h2>Admin Login</h2>
          {loginError && <div className="login-error">{loginError}</div>}
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label htmlFor="username">Brugernavn</label>
              <input
                type="text"
                id="username"
                name="username"
                value={loginForm.username}
                onChange={handleLoginChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Adgangskode</label>
              <input
                type="password"
                id="password"
                name="password"
                value={loginForm.password}
                onChange={handleLoginChange}
                required
              />
            </div>
            <button type="submit" className="login-button">
              Login
            </button>
          </form>
          <div className="login-hint">
            <p>brugernavn: admin</p>
            <p>kodeord: password</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-container">
      {/* Sidebar */}
      <div className="admin-sidebar">
        <div className="admin-sidebar-header">
          <h2>Backoffice</h2>
        </div>
        <nav className="admin-nav">
          <ul>
            <li className={activeSection === "blogs" ? "active" : ""}>
              <button onClick={() => setActiveSection("blogs")}>
                <FileText size={18} />
                <span>Blogs</span>
              </button>
            </li>
            <li className={activeSection === "messages" ? "active" : ""}>
              <button onClick={() => setActiveSection("messages")}>
                <MessageSquare size={18} />
                <span>Bedskeder</span>
              </button>
            </li>
            <li>
              <button onClick={handleLogout} className="logout-nav-button">
                <LogOut size={18} />
                <span>Log ud</span>
              </button>
            </li>
          </ul>
        </nav>
        <div className="admin-sidebar-footer">
          <Link to="/" className="back-to-site">
            Tilbage
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="admin-content">
        {/* Notification */}
        {notification.show && (
          <div className={`admin-notification ${notification.type}`}>
            <p>{notification.message}</p>
            <button onClick={() => setNotification({ show: false, type: "", message: "" })}>
              <X size={16} />
            </button>
          </div>
        )}

        {/* Header */}
        <header className="admin-header">
          <h1>
            {activeSection === "blogs" && "Manage Blogs"}
            {activeSection === "messages" && "Messages"}
          </h1>

          {activeSection === "blogs" && (
            <button className="admin-add-button" onClick={openAddModal}>
              <span>Tilføj</span>
            </button>
          )}
        </header>

        {/* Blogs Section */}
        {activeSection === "blogs" && (
          <div className="admin-blogs">
            {blogsLoading ? (
              <div className="admin-loading">Loading blogs...</div>
            ) : blogsError ? (
              <div className="admin-error">Error: {blogsError}</div>
            ) : blogs.length > 0 ? (
              <div className="admin-blogs-grid">
                {blogs.map((blog, index) => (
                  <div key={blog._id?.$oid || blog._id || index} className="admin-blog-card">
                    <div className="admin-blog-image">
                      {blog.image ? (
                        <img src={blog.image || "/placeholder.svg"} alt={blog.title} />
                      ) : (
                        <div className="admin-blog-placeholder">No Image</div>
                      )}
                    </div>
                    <div className="admin-blog-content">
                      <h3>{blog.title}</h3>
                      <p>
                        {blog.teaser || blog.description?.substring(0, 100) || "No content"}
                        ...
                      </p>
                    </div>
                    <div className="admin-blog-actions">
                      <button className="admin-edit-button" onClick={() => openEditModal(blog)}>
                        <Edit size={16} />
                        <span>Redigerer</span>
                      </button>
                      <button className="admin-delete-button" onClick={() => openDeleteModal(blog)}>
                        <Trash2 size={16} />
                        <span>Slet</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="admin-empty">
                <p>Tom</p>
              </div>
            )}
          </div>
        )}

        {/* Messages Section */}
        {activeSection === "messages" && (
          <div className="admin-messages">
            {messagesLoading ? (
              <div className="admin-loading">Loading messages...</div>
            ) : messagesError ? (
              <div className="admin-error">Error: {messagesError}</div>
            ) : messages.length > 0 ? (
              <div className="admin-messages-list">
                {messages.map((message, index) => (
                  <div
                    key={message._id?.$oid || message._id || index}
                    className={`admin-message-item ${!message.status ? "unread" : ""}`}
                  >
                    <div className="admin-message-icon">
                      <Mail size={20} />
                    </div>
                    <div className="admin-message-content">
                      <div className="admin-message-header">
                        <h3>{message.subject}</h3>
                        <span className="admin-message-date">{formatDate(message.created)}</span>
                      </div>
                      <p className="admin-message-sender">From: {message.name}</p>
                      <p className="admin-message-text">{message.description}</p>
                    </div>
                    <div className="admin-message-actions">
                      <button
                        className={`admin-status-button ${message.status ? "read" : "unread"}`}
                        onClick={() => toggleMessageStatus(message)}
                        title={message.status ? "Mark as unread" : "Mark as read"}
                      >
                        <Check size={16} />
                        <span>{message.status ? "Mark Unread" : "Mark Read"}</span>
                      </button>
                      <button className="admin-delete-button" onClick={() => openDeleteMessageModal(message)}>
                        <Trash2 size={16} />
                        <span>Slet</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="admin-empty">
                <p>Tom</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add Blog Modal */}
      {isAddModalOpen && (
        <div className="admin-modal-overlay">
          <div className="admin-modal">
            <div className="admin-modal-header">
              <h2>Tilføj ny Blog</h2>
              <button className="admin-modal-close" onClick={() => setIsAddModalOpen(false)}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAddSubmit} className="admin-form">
              <div className="admin-form-group">
                <label htmlFor="title">Titel</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={blogForm.title}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="admin-form-group">
                <label htmlFor="teaser">Teaser</label>
                <textarea
                  id="teaser"
                  name="teaser"
                  value={blogForm.teaser}
                  onChange={handleInputChange}
                  rows="3"
                ></textarea>
              </div>

              <div className="admin-form-group">
                <label htmlFor="description">Beskrivelse</label>
                <textarea
                  id="description"
                  name="description"
                  value={blogForm.description}
                  onChange={handleInputChange}
                  rows="6"
                  required
                ></textarea>
              </div>

              <div className="admin-form-group">
                <label htmlFor="image">Billede</label>
                <div className="admin-image-upload">
                  <input type="file" id="image" name="image" accept="image/*" onChange={handleImageChange} />
                  <label htmlFor="image" className="admin-image-upload-label">
                    {blogForm.imagePreview ? "Skift Billede" : "Vælg Billede"}
                  </label>

                  {blogForm.imagePreview && (
                    <div className="admin-image-preview">
                      <img src={blogForm.imagePreview || "/placeholder.svg"} alt="Preview" />
                    </div>
                  )}
                </div>
              </div>

              <div className="admin-form-actions">
                <button type="button" className="admin-button-cancel" onClick={() => setIsAddModalOpen(false)}>
                  Annuller
                </button>
                <button type="submit" className="admin-button-submit">
                  Opret Blog
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Blog Modal */}
      {isEditModalOpen && selectedBlog && (
        <div className="admin-modal-overlay">
          <div className="admin-modal">
            <div className="admin-modal-header">
              <h2>Opdaterer Blog</h2>
              <button className="admin-modal-close" onClick={() => setIsEditModalOpen(false)}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleEditSubmit} className="admin-form">
              <div className="admin-form-group">
                <label htmlFor="edit-title">Titel</label>
                <input
                  type="text"
                  id="edit-title"
                  name="title"
                  value={blogForm.title}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="admin-form-group">
                <label htmlFor="edit-teaser">Teaser</label>
                <textarea
                  id="edit-teaser"
                  name="teaser"
                  value={blogForm.teaser}
                  onChange={handleInputChange}
                  rows="3"
                ></textarea>
              </div>

              <div className="admin-form-group">
                <label htmlFor="edit-description">Beskrivelse</label>
                <textarea
                  id="edit-description"
                  name="description"
                  value={blogForm.description}
                  onChange={handleInputChange}
                  rows="6"
                  required
                ></textarea>
              </div>

              <div className="admin-form-group">
                <label htmlFor="edit-image">Billede</label>
                <div className="admin-image-upload">
                  <input type="file" id="edit-image" name="image" accept="image/*" onChange={handleImageChange} />
                  <label htmlFor="edit-image" className="admin-image-upload-label">
                    {blogForm.imagePreview ? "Change Image" : "Select Image"}
                  </label>

                  {blogForm.imagePreview && (
                    <div className="admin-image-preview">
                      <img src={blogForm.imagePreview || "/placeholder.svg"} alt="Preview" />
                    </div>
                  )}
                </div>
              </div>

              <div className="admin-form-actions">
                <button type="button" className="admin-button-cancel" onClick={() => setIsEditModalOpen(false)}>
                  Annuller
                </button>
                <button type="submit" className="admin-button-submit">
                  Opdater Blog
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (selectedBlog || selectedMessage) && (
        <div className="admin-modal-overlay">
          <div className="admin-modal admin-modal-small">
            <div className="admin-modal-header">
              <h2>Delete {selectedBlog ? "Blog" : "Message"}</h2>
              <button className="admin-modal-close" onClick={() => setIsDeleteModalOpen(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="admin-modal-content">
              <p>Er du sikker på at du vil slette denne {selectedBlog ? "blog" : "bedsked"}?</p>
            </div>
            <div className="admin-modal-actions">
              <button className="admin-button-cancel" onClick={() => setIsDeleteModalOpen(false)}>
                Cancel
              </button>
              <button className="admin-button-delete" onClick={handleDeleteConfirm}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminPage

