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
      <Link to={isProjectsPage ? "/" : "/projects"} className="plus-btn">
        {isProjectsPage ? "{−}" : "{+}"}
      </Link>
    </header>
  );
};

export default Header;

