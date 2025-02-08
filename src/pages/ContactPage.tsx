import React from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header"; 
import "../Styles/GlobalStyles.css"; 
import "../Styles/ContactPage.css"; 

const ContactPage: React.FC = () => {
  return (
    <div className="contact-page">
      <Header />

      <Link to="/" className="back-arrow">←</Link>

      <div className="contact-content">
        <div className="contact-links">
          <a href="https://www.instagram.com/adrianspata" target="_blank" rel="noopener noreferrer">@adrianspata</a>
          <span className="span">⎢</span>
          <a href="mailto:adrian.spata@hotmail.com">adrian.spata@hotmail.com</a>
          <span className="span">⎢</span>
          <a href="https://www.linkedin.com/in/adrian-spata-5573901a0/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
          <span className="span">⎢</span>
          <a href="https://github.com/adrianspata" target="_blank" rel="noopener noreferrer">GitHub</a>
          <span className="span">⎢</span>
          <Link to="/" className="home-link">Home</Link>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
