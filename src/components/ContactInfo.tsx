import React from "react";
import { Link } from "react-router-dom";
import "../Styles/ContactInfo.css";

const ContactInfo: React.FC = () => {
  return (
    <div className="contact-info">
      <Link to="/contact" className="contact-link">Contact</Link> 
      <Link to="/projects" className="contact-link">Selected Work</Link>
    </div>
  );
};

export default ContactInfo;
