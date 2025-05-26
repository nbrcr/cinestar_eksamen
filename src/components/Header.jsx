
import { useState } from "react"
import { Link } from "react-router-dom"
import "./Header.css"

function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

  const toggleMenu = () => {
    setMenuOpen(!menuOpen)
  }

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <Link to="/" className="logo">
            <img src="/logo.png" alt="Cinestar" />
          </Link>

          <button className="menu-toggle" onClick={toggleMenu}>
            <span className={menuOpen ? "open" : ""}></span>
          </button>

          <nav className={`nav ${menuOpen ? "open" : ""}`}>
            <ul>
              <li>
                <Link to="/">Forside</Link>
              </li>
              <li>
                <Link to="/blog-archive">Blogs</Link>
              </li>
              <li>
                <Link to="/faq">FAQ</Link>
              </li>
              <li>
                <Link to="/contact">Kontakt</Link>
              </li>
              <li>
                <Link to="/admin">Backoffice</Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  )
}

export default Header

