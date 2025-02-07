import React, { useEffect, useState, useRef } from "react";
import "../Styles/Carousel.css";

interface CarouselProps {
  selectedImage: string | null;
  images: string[];
}

const Carousel: React.FC<CarouselProps> = ({ selectedImage, images }) => {
  const [index, setIndex] = useState(0);
  const [isManualSelection, setIsManualSelection] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [deltaX, setDeltaX] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Om en bild väljs från ThumbnailStrip, uppdatera index och pausa autoplay
  useEffect(() => {
    if (selectedImage) {
      const newIndex = images.indexOf(selectedImage);
      if (newIndex !== -1) {
        setIndex(newIndex);
        setIsManualSelection(true);

        // Återuppta autoplay
        const resumeAutoplay = setTimeout(() => {
          setIsManualSelection(false);
        }, 0);

        return () => clearTimeout(resumeAutoplay);
      }
    }
  }, [selectedImage, images]);

  // Automatisk bildväxling (om användaren inte har interagerat)
  useEffect(() => {
    if (isManualSelection || isDragging) return;

    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 800);

    return () => clearInterval(interval);
  }, [isManualSelection, isDragging, images]);

  // Click & Drag-funktionalitet
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setDeltaX(e.clientX - startX);
  };

  const handleMouseUp = () => {
    setIsDragging(false);

    if (deltaX > 50) {
      // Dra till vänster -> Föregående bild
      setIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
    } else if (deltaX < -50) {
      // Dra till höger -> Nästa bild
      setIndex((prevIndex) => (prevIndex + 1) % images.length);
    }

    setDeltaX(0);

    // Återuppta autoplay efter 4 sekunder
    setIsManualSelection(true);
    setTimeout(() => setIsManualSelection(false), 4000);
  };

  return (
    <div
      className="carousel"
      ref={carouselRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp} // För att hantera om musen dras utanför komponenten
    >
      <img src={images[index]} alt="carousel" className="carousel-image" />
    </div>
  );
};

export default Carousel;
