import React from "react";
import Navigation from "../components/Navigation";
import "../Styles/ContactPage.css";

const ContactPage: React.FC = () => {
  return (
    <div className="contact-page">
      <Navigation isVisible={true} />

      <div className="info-content">
        <h1 className="info-statement">
          Adrian Spata is a Stockholm-based digital designer &amp; full-stack developer. Specializing in web development, web design, visual identity, illustration &amp; graphic design. With a foundation in branding, user experience &amp; design, he aims to craft and deliver compelling digital and physical experiences.
        </h1>

        <div className="info-columns">
          <div className="info-col">
            <h2>Contact</h2>
            <ul>
              <li><a href="mailto:adrian.spata@hotmail.com">adrian.spata@hotmail.com</a></li>
              <li><br /></li>
              <li><a href="https://www.linkedin.com/in/adrian-spata-5573901a0/" target="_blank" rel="noopener noreferrer">LinkedIn</a></li>
              <li><a href="https://github.com/adrianspata" target="_blank" rel="noopener noreferrer">GitHub</a></li>
              <li><a href="https://www.instagram.com/adrianspata" target="_blank" rel="noopener noreferrer">Instagram</a></li>
            </ul>
          </div>

          <div className="info-col">
            <h2>Services</h2>
            <ul>
              <li>Web Development</li>
              <li>Web Design</li>
              <li>User Experience</li>
              <li>E-commerce</li>
              <li>Digital Design</li>
              <li>Brand Identity</li>
              <li>Art Direction</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
