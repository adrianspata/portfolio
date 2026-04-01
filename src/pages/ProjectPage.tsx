import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Navigation from "../components/Navigation";
import "../Styles/ProjectPage.css";

import designProjects from "../data/designProjects";
import codeProjects from "../data/codeProjects";

type Category = "All" | "Design" | "Development";

const ProjectsPage: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<Category>("All");

  const allProjects = [
    ...codeProjects.map(p => ({ ...p, category: "Development" })),
    ...designProjects.map(p => ({ ...p, category: "Design" }))
  ];

  const filteredProjects = activeFilter === "All"
    ? allProjects
    : allProjects.filter(p => p.category === activeFilter);

  const counts = {
    All: allProjects.length,
    Design: designProjects.length,
    Development: codeProjects.length
  };

  return (
    <div className="projects-page">
      <Navigation isVisible={true} />

      <div className="filters-container">
        {(["All", "Development", "Design"] as Category[]).map(cat => (
          <button
            key={cat}
            className={`filter-btn ${activeFilter === cat ? "active" : ""}`}
            onClick={() => setActiveFilter(cat)}
          >
            {cat} <span>({counts[cat]})</span>
          </button>
        ))}
      </div>

      <motion.div layout className="projects-grid">
        <AnimatePresence>
          {filteredProjects.map((project) => (
            <motion.div
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4 }}
              key={project.id}
            >
              <Link to={`/work/${project.id}`} className="project-card">
                <div className="card-state state-primary">
                  <div className="project-image-wrapper">
                    <img src={project.images[0]} alt={project.name} className="img-primary" />
                  </div>
                  <div className="project-info">
                    <h3>{project.name}</h3>
                    <p>{project.date}</p>
                  </div>
                </div>
                {project.images[1] && (
                  <div className="card-state state-secondary">
                    <div className="project-image-wrapper">
                      <img src={project.images[1]} alt={`${project.name} hover`} className="img-secondary" />
                    </div>
                    <div className="project-info">
                      <h3>{project.name}</h3>
                      <p>{project.date}</p>
                    </div>
                  </div>
                )}
              </Link>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default ProjectsPage;
