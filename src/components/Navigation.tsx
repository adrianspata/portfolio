import React from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import "../Styles/Navigation.css";

interface NavigationProps {
  isVisible: boolean;
  showLogo?: boolean;
}

const Navigation: React.FC<NavigationProps> = ({ isVisible, showLogo = false }) => {
  const location = useLocation();

  return (
    <motion.nav
      className="main-nav"
      initial={{ opacity: 0, y: -20 }}
      animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      <Link to="/contact" className="nav-link" aria-label="Contact page">
        CONTACT
      </Link>
      
      {showLogo && (
        <Link to="/" className="nav-logo" aria-label="Home">
          Adrian Spata
        </Link>
      )}
      
      <Link
        to="/projects"
        className={`nav-link ${location.pathname === "/projects" ? "active" : ""}`}
        aria-label="Work/Projects page"
      >
        WORK
      </Link>
    </motion.nav>
  );
};

export default Navigation;
