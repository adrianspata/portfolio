import React from "react";
import { Link } from "react-router-dom";
import "../Styles/Header.css";

const Header: React.FC = () => {
  return (
    <header className="header">
      <div className="logo">
        {/* <Link to="/" className="logo-link">
          <h2 className="h2">Adrian Spata</h2>
        </Link> */}
      </div>
    </header>
  );
};

export default Header;