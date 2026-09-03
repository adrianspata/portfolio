import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Navigation from "../components/Navigation";
import "../Styles/ProjectPage.css";

import {
  allProjects,
  Category,
  Project,
  getMediaUrl,
  getMediaBackground,
  getMediaPadding,
} from "../data/projects";

type FilterCategory = "All" | Category;

const CATEGORIES: FilterCategory[] = [
  "All",
  "Development",
  "Design",
  "UX/UI",
  "E-commerce",
  "App",
];

const ProjectsPage: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<FilterCategory>("All");

  const filteredProjects =
    activeFilter === "All"
      ? allProjects
      : allProjects.filter((p: Project) => p.categories.includes(activeFilter));

  const counts: Record<FilterCategory, number> = {
    All: allProjects.length,
    Development: allProjects.filter((p) => p.categories.includes("Development")).length,
    Design: allProjects.filter((p) => p.categories.includes("Design")).length,
    "UX/UI": allProjects.filter((p) => p.categories.includes("UX/UI")).length,
    "E-commerce": allProjects.filter((p) => p.categories.includes("E-commerce")).length,
    App: allProjects.filter((p) => p.categories.includes("App")).length,
  };

  return (
    <div className="projects-page">
      <Navigation isVisible={true} />

      <div className="filters-container">
        {CATEGORIES.map((cat) => (
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
          {filteredProjects.map((project) => {
            const primaryMedia = project.images[0];
            const primaryUrl = getMediaUrl(primaryMedia);
            const primaryBg = getMediaBackground(primaryMedia);
            const primaryPadding = getMediaPadding(primaryMedia);
            const primaryStyle: React.CSSProperties = {
              ...(typeof primaryBg === "string"
                ? ({ backgroundColor: primaryBg, "--bg-light": primaryBg, "--bg-dark": primaryBg } as React.CSSProperties)
                : {}),
              ...(typeof primaryBg === "object" && primaryBg !== null
                ? ({ "--bg-light": primaryBg.light, "--bg-dark": primaryBg.dark } as React.CSSProperties)
                : {}),
              ...(primaryPadding ? { padding: primaryPadding } : {}),
            };

            const secondaryMedia = project.images[1];
            const secondaryUrl = secondaryMedia ? getMediaUrl(secondaryMedia) : null;
            const secondaryBg = secondaryMedia ? getMediaBackground(secondaryMedia) : undefined;
            const secondaryPadding = secondaryMedia ? getMediaPadding(secondaryMedia) : undefined;
            const secondaryStyle: React.CSSProperties = {
              ...(typeof secondaryBg === "string"
                ? ({ backgroundColor: secondaryBg, "--bg-light": secondaryBg, "--bg-dark": secondaryBg } as React.CSSProperties)
                : {}),
              ...(typeof secondaryBg === "object" && secondaryBg !== null
                ? ({ "--bg-light": secondaryBg.light, "--bg-dark": secondaryBg.dark } as React.CSSProperties)
                : {}),
              ...(secondaryPadding ? { padding: secondaryPadding } : {}),
            };

            return (
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
                    <div
                      className="project-image-wrapper"
                      style={Object.keys(primaryStyle).length > 0 ? primaryStyle : undefined}
                    >
                      <img src={primaryUrl} alt={project.name} className="img-primary" />
                    </div>
                    <div className="project-info">
                      <h3>{project.name}</h3>
                      <p>{project.date}</p>
                    </div>
                  </div>
                  {secondaryUrl && (
                    <div className="card-state state-secondary">
                      <div
                        className="project-image-wrapper"
                        style={Object.keys(secondaryStyle).length > 0 ? secondaryStyle : undefined}
                      >
                        <img src={secondaryUrl} alt={`${project.name} hover`} className="img-secondary" />
                      </div>
                      <div className="project-info">
                        <h3>{project.name}</h3>
                        <p>{project.date}</p>
                      </div>
                    </div>
                  )}
                </Link>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default ProjectsPage;
