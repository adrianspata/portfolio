import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import "../Styles/Navigation.css";

interface NavigationProps {
  isVisible: boolean;
}

const Navigation: React.FC<NavigationProps> = ({ isVisible }) => {
  const location = useLocation();
  const [time, setTime] = useState(new Date());
  const [theme, setTheme] = useState(
    document.documentElement.getAttribute('data-theme') || 'light'
  );

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const formattedTime = time.toLocaleTimeString('sv-SE', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: false
  });

  return (
    <motion.nav
      className="main-nav"
      initial={{ opacity: 0, y: -20 }}
      animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      <div className="nav-group nav-left">
        <Link to="/" className="nav-logo" aria-label="Home">
          ADRIAN SPATA
        </Link>
      </div>

      <div className="nav-group nav-center">
        <Link to="/work" className={`nav-link ${location.pathname.startsWith("/work") ? "active" : ""}`}>
          Work
        </Link>
        <Link to="/about" className={`nav-link ${location.pathname === "/about" ? "active" : ""}`}>
          About
        </Link>
      </div>

      <div className="nav-group nav-right">
        <span className="nav-time">{formattedTime}</span>
        <button
          className={`theme-toggle ${theme === 'dark' ? 'filled' : ''}`}
          onClick={toggleTheme}
          aria-label="Toggle Theme"
        />
      </div>
    </motion.nav>
  );
};

export default Navigation;
