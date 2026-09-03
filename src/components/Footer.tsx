import React, { useState, useEffect } from "react";
import "../Styles/Footer.css";

interface FooterProps {
  isVisible?: boolean;
}

const Footer: React.FC<FooterProps> = ({ isVisible = true }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedTime = time.toLocaleTimeString('sv-SE', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: false
  });

  return (
    <footer
      className="site-footer"
      style={{
        opacity: isVisible ? 1 : 0,
        transition: "opacity 0.6s ease"
      }}
    >
      <span className="footer-time">{formattedTime}</span>
      <span className="footer-copy">© 2026 ADRIAN SPATA</span>
    </footer>
  );
};

export default Footer;
