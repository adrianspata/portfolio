import React from "react";
import { useNavigate } from "react-router-dom";
import designProjects from "../data/designProjects";
import codeProjects from "../data/codeProjects";
import "../Styles/ImageGallery.css";

const ImageGallery: React.FC = () => {
  const allProjects = [...codeProjects, ...designProjects];
  const navigate = useNavigate();

  const handleImageClick = (projectId: string | number) => {
    navigate(`/projects/${projectId}`);
  };

  return (
    <div className="gallery-container">
      <div className="gallery-grid">
        {allProjects.map((project) => (
          <div
            key={project.id}
            className="gallery-item"
            onClick={() => handleImageClick(project.id)}
          >
            <img src={project.images[0]} alt={project.name} />
            <div className="gallery-label">{project.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageGallery;
