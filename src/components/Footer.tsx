import React, { useState, useEffect } from "react";
import "../Styles/Footer.css";

const Footer: React.FC = () => {
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
    <footer className="site-footer">
      <span className="footer-time">{formattedTime}</span>
      <span className="footer-copy">© 2026 ADRIAN SPATA</span>
    </footer>
  );
};

export default Footer;
