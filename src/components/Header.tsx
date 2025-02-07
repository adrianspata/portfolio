import React from "react";
import { Link } from "react-router-dom";
import "../Styles/Header.css";

const Header: React.FC = () => {
  return (
    <header className="header">
      <Link to="/projects" className="plus-btn">{"{+}"}</Link>
    </header>
  );
};

export default Header;
