import React from "react";
import { Link } from "react-router-dom";
import "../Styles/ContactInfo.css";

const ContactInfo: React.FC = () => {
  return (
    <div className="contact-info">
      <Link to="/contact" className="contact-link">adrian.spata@hotmail.com</Link> ⎢
      <a href="https://www.instagram.com/adrianspata" target="_blank" rel="noopener noreferrer">@adrianspata</a>
    </div>
  );
};

export default ContactInfo;
