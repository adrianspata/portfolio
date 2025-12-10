import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "../Styles/Header.css";

const Header: React.FC = () => {
  const location = useLocation(); 
  const [isProjectsPage, setIsProjectsPage] = useState(false);

  useEffect(() => {
    setIsProjectsPage(location.pathname === "/projects");
  }, [location.pathname]);

  return (
    <header className="header">
      <div className="logo">
        <Link to="/" className="logo-link">
          <h2 className="h2">Adrian Spata</h2>
        </Link>
      </div>
    </header>
  );
};

export default Header;