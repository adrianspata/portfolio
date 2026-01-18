import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import designProjects from "../data/designProjects";
import codeProjects from "../data/codeProjects";
import "../Styles/WorkStrip.css";

interface WorkStripProps {
  isVisible: boolean;
}

const WorkStrip: React.FC<WorkStripProps> = ({ isVisible }) => {
  const allProjects = [...designProjects, ...codeProjects];
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const handleProjectClick = (projectId: string) => {
    navigate(`/projects/${projectId}`);
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLDivElement>,
    projectId: string
  ) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleProjectClick(projectId);
    }
  };

  return (
    <motion.div
      className="work-strip-container"
      initial={{ opacity: 0, y: 20 }}
      animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      <div className="work-strip" ref={scrollContainerRef}>
        {allProjects.map((project, index) => (
          <motion.div
            key={project.id}
            className="work-thumbnail-wrapper"
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: isVisible ? 0.3 + index * 0.03 : 0 }}
            onMouseEnter={() => setHoveredId(project.id)}
            onMouseLeave={() => setHoveredId(null)}
            onClick={() => handleProjectClick(project.id)}
            onKeyDown={(e) => handleKeyDown(e, project.id)}
            role="button"
            tabIndex={0}
            aria-label={`View ${project.name} project`}
          >
            <motion.div
              className="work-thumbnail"
              whileHover={{ scale: 1.04 }}
              transition={{ duration: 0.3 }}
            >
              <img src={project.images[0]} alt={project.name} />
              {hoveredId === project.id && (
                <motion.div
                  className="thumbnail-overlay"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <p className="thumbnail-label">{project.name}</p>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default WorkStrip;
