import React, { useState, useEffect } from "react";
import Header from "../components/Header"; 
import "../Styles/GlobalStyles.css"; 
import "../Styles/ContactPage.css"; 

const ContactPage: React.FC = () => {
  const [time, setTime] = useState<string>("");
  const [location, setLocation] = useState<string>("Loading...");

  useEffect(() => {
    const updateTimeAndLocation = () => {
      const now = new Date();
      const formattedTime = new Intl.DateTimeFormat([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        // timeZoneName: "short",
      }).format(now);

      setTime(formattedTime);

      const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const cityName = timeZone.split("/").pop()?.replace("_", " ") || "Unknown";
      setLocation(cityName);
    };

    updateTimeAndLocation(); 
    const interval = setInterval(updateTimeAndLocation, 1000); 

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="contact-page">
      <Header />

      <div className="contact-content">
        <div className="contact-links">
          <a href="https://www.instagram.com/adrianspata" target="_blank" rel="noopener noreferrer">@adrianspata</a>
          <span className="span"></span>
          <a href="mailto:adrian.spata@hotmail.com">adrian.spata@hotmail.com</a>
          <span className="span"></span>
          <a href="https://www.linkedin.com/in/adrian-spata-5573901a0/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
          <span className="span"></span>
          <a href="https://github.com/adrianspata" target="_blank" rel="noopener noreferrer">GitHub</a>
        </div>
      </div>

      <div className="local-time">
        {location} <span></span> {time}
      </div>
    </div>
  );
};

export default ContactPage;
