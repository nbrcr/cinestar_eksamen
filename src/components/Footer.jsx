import { Link } from "react-router-dom"
import "./Footer.css"

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-logo">
            <img src="/logo.png" alt="Cinestar" />
          </div>

          <div className="footer-copyright">
            <p>&copy; {new Date().getFullYear()} CINESTAR | DESIGNET AF POSITIVE STUDIO</p>
          </div>

          <div className="footer-social">
            <Link to="#">FACEBOOK</Link>
            <Link to="#">LINKEDIN</Link>
            <Link to="#">INSTAGRAM</Link>
            <Link to="#">YOUTUBE</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer

