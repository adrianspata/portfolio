import React from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Navigation from "../components/Navigation";
import "../Styles/GlobalStyles.css";
import "../Styles/ProjectPage.css";

import designProjects from "../data/designProjects";
import codeProjects from "../data/codeProjects";

const ProjectsPage: React.FC = () => {
  return (
    <div className="projects-page">
      <Header />
      <Navigation isVisible={true} showLogo={true} />

      <h2 className="projects-title">Code Work</h2>
      <div className="projects-grid">
        {codeProjects.map((project) => (
          <Link to={`/projects/${project.id}`} key={project.id} className="project-card">
            <img src={project.images[0]} alt={project.name} />
            <p>{project.name} - {project.date}</p>
          </Link>
        ))}
      </div>

      <h2 className="projects-title">Design Work</h2>
      <div className="projects-grid">
        {designProjects.map((project) => (
          <Link to={`/projects/${project.id}`} key={project.id} className="project-card">
            <img src={project.images[0]} alt={project.name} />
            <p>{project.name} - {project.date}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ProjectsPage;
