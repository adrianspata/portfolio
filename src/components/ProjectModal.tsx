import React, { useEffect, useCallback, useRef } from "react";
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

const ProjectModal: React.FC<ProjectModalProps> = ({ 
  project, 
  currentImageIndex, 
  setCurrentImageIndex, 
  closeModal 
}) => {

  const touchStartX = useRef<number | null>(null);

  // Byt till nästa bild
  const nextImage = useCallback(() => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % project.images.length);
  }, [setCurrentImageIndex, project.images.length]);

  // Byt till föregående bild
  const prevImage = useCallback(() => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === 0 ? project.images.length - 1 : prevIndex - 1
    );
  }, [setCurrentImageIndex, project.images.length]);

  // Stäng modalen
  const handleCloseModal = useCallback(() => {
    closeModal();
  }, [closeModal]);

  // Hantera tangentbordskontroller
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") nextImage();
      else if (event.key === "ArrowLeft") prevImage();
      else if (event.key === "Escape") handleCloseModal();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [nextImage, prevImage, handleCloseModal]);

  // Hantera klick på bildens sidor
  const handleImageClick = (e: React.MouseEvent<HTMLImageElement>) => {
    const { clientX, currentTarget } = e;
    const middle = currentTarget.getBoundingClientRect().width / 2;
    
    if (clientX < middle) {
      prevImage();
    } else {
      nextImage();
    }
  };

  // Hantera swipe på mobil
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;

    const touchEndX = e.changedTouches[0].clientX;
    const diffX = touchStartX.current - touchEndX;

    if (diffX > 50) {
      nextImage(); 
    } else if (diffX < -50) {
      prevImage(); 
    }

    touchStartX.current = null;
  };

  return (
    <div className="modal-overlay" onClick={handleCloseModal}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={handleCloseModal}>×</button>
        
        <div 
          className="modal-carousel" 
          onTouchStart={handleTouchStart} 
          onTouchEnd={handleTouchEnd}
        >
          <img 
            src={project.images[currentImageIndex]} 
            alt="Project" 
            className="modal-image" 
            onClick={handleImageClick} 
          />
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
