import React from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header"; 
import "../Styles/GlobalStyles.css";
import "../Styles/ProjectPage.css"; 

const projects = [
  { id: 1, image: "/images/SOT Maya - AGRUME side.jpg", name: "Maya Nilsen for SOT", date: "Apr 2024" },
  { id: 2, image: "/images/SOT Mag cover plastic 3.jpg", name: "SOT Magazine", date: "Aug 2024" },
  { id: 3, image: "/images/launch e-invite 30th.jpg", name: "SOT Launch Event", date: "June 2024" },
  { id: 4, image: "public/images/godajf äppel bild.jpg", name: "SOT Godajf", date: "Sep 2024" },
  { id: 5, image: "/images/squarecirc logo(new) .jpg", name: "SQUARE CIRC Logo", date: "Apr 2022" },
  { id: 6, image: "/images/sunsun logo sketch.png", name: "SunSun Logo", date: "Feb 2020" },
  { id: 7, image: "/images/sot mag cover opt4.jpg", name: "SOT Magazine", date: "Aug 2024" },
  { id: 8, image: "/images/SOT Underbron final1.jpg", name: "Underbron x SOT Event", date: "Dec 2023" },
];

const ProjectsPage: React.FC = () => {
  return (
    <div className="projects-page">
      <Header />

      <Link to="/" className="back-arrow">←</Link>

      <div className="top-links">
        <div className="external-links">
          <a href="https://www.linkedin.com/in/adrian-spata-5573901a0/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
          <span>⎢</span>
          <a href="https://github.com/adrianspata" target="_blank" rel="noopener noreferrer">GitHub</a>
        </div>
      </div>

      <div className="projects-grid">
        {projects.map((project) => (
          <div key={project.id} className="project-card">
            <img src={project.image} alt={project.name} />
            <p>{project.name} - {project.date}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectsPage;
