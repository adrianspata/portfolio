import React, { useEffect, useCallback } from "react";
import "../Styles/ProjectModal.css";

interface Project {
  id: number;
  images: string[];
  name: string;
  date: string;
  description: string;
}

interface ProjectModalProps {
  project: Project;
  currentImageIndex: number;
  setCurrentImageIndex: React.Dispatch<React.SetStateAction<number>>;
  closeModal: () => void;
}

const ProjectModal: React.FC<ProjectModalProps> = ({ project, currentImageIndex, setCurrentImageIndex, closeModal }) => {
  
  const nextImage = useCallback(() => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % project.images.length);
  }, [setCurrentImageIndex, project.images.length]);

  const prevImage = useCallback(() => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === 0 ? project.images.length - 1 : prevIndex - 1
    );
  }, [setCurrentImageIndex, project.images.length]);

  const handleCloseModal = useCallback(() => {
    closeModal();
  }, [closeModal]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") {
        nextImage();
      } else if (event.key === "ArrowLeft") {
        prevImage();
      } else if (event.key === "Escape") {
        handleCloseModal();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [nextImage, prevImage, handleCloseModal]); 

  return (
    <div className="modal-overlay" onClick={handleCloseModal}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={handleCloseModal}>×</button>
        
        <div className="modal-carousel">
          <button className="prev-btn" onClick={prevImage}>‹</button>
          <img src={project.images[currentImageIndex]} alt="Project" className="modal-image" />
          <button className="next-btn" onClick={nextImage}>›</button>
        </div>

        <div className="image-indicator">
          {project.images.map((_, index) => (
            <span
              key={index}
              className={`dot ${index === currentImageIndex ? "active" : ""}`}
            />
          ))}
        </div>

        <p className="modal-description">{project.description}</p>
      </div>
    </div>
  );
};

export default ProjectModal;
