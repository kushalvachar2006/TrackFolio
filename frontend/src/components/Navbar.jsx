import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Zap } from "lucide-react";
import "./Navbar.css";

export const Navbar = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(window.scrollY > 60);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleScroll = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setIsMenuOpen(false);
    }
  };

  return (
    <nav className={`navbar ${hasScrolled ? "scrolled" : ""}`}>
      <div className="nav-container">
        {/* Logo */}
        <div className="logo" onClick={() => navigate("/")}>
          <span className="logo-icon"><Zap size={16} /></span>
          <div className="logo-text">
            <span className="resume">Track</span>
            <span className="radar">Folio</span>
          </div>
        </div>

        {/* Desktop Navigation */}
        <div className="nav-desktop">
          <button className="nav-link" onClick={() => handleScroll("features")}>
            Features
          </button>
          <button
            className="nav-link"
            onClick={() => handleScroll("how-it-works")}
          >
            How It Works
          </button>
          <button
            className="nav-link"
            onClick={() => handleScroll("for-students")}
          >
            For Students
          </button>

          <div className="nav-auth">
            <button
              className="nav-link auth-link"
              onClick={() => navigate("/login")}
            >
              Login
            </button>
            <button
              className="cta-button"
              onClick={() => navigate("/register")}
            >
              Get Started →
            </button>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="menu-button"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <span className="menu-icon">✕</span> : <span className="menu-icon">☰</span>}
        </button>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="nav-mobile">
            <button
              className="nav-link mobile"
              onClick={() => handleScroll("features")}
            >
              Features
            </button>
            <button
              className="nav-link mobile"
              onClick={() => handleScroll("how-it-works")}
            >
              How It Works
            </button>
            <button
              className="nav-link mobile"
              onClick={() => handleScroll("for-students")}
            >
              For Students
            </button>
            <button
              className="nav-link mobile"
              onClick={() => navigate("/login")}
            >
              Login
            </button>
            <button
              className="cta-button mobile"
              onClick={() => navigate("/register")}
            >
              Get Started →
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};
