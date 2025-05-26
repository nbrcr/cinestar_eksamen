import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom"
import Header from "./components/Header"
import HomePage from "./pages/HomePage"
import BlogArchive from "./pages/BlogArchive"
import BlogPost from "./pages/BlogPost"
import Faq from "./pages/Faq"
import Contact from "./pages/Contact"
import AdminPage from "./pages/AdminPage"
import Footer from "./components/Footer"
import "./App.css"

function AppContent() {
  const location = useLocation()
  const isAdminPage = location.pathname === "/admin"

  return (
    <div className="app">
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/blog-archive" element={<BlogArchive />} />
          <Route path="/blog/:id" element={<BlogPost />} />
          <Route path="/faq" element={<Faq />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </main>
      {!isAdminPage && <Footer />}
    </div>
  )
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}

export default App

