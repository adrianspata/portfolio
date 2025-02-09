import React, { useEffect, useState, useRef } from "react";
import "../Styles/Carousel.css";

interface CarouselProps {
  selectedImage: string | null;
  images: string[];
}

const FALLBACK_IMAGE = "/images/sotmagcoveropt4.jpg"; 

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
        }, 1000);

        return () => clearTimeout(resumeAutoplay);
      }
    }
  }, [selectedImage, images]);

  // Automatisk bildväxling
  useEffect(() => {
    if (isManualSelection || isDragging) return;

    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 1000);

    return () => clearInterval(interval);
  }, [isManualSelection, isDragging, images]);

  // Click & Drag-funktion
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
      setIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
    } else if (deltaX < -50) {
      setIndex((prevIndex) => (prevIndex + 1) % images.length);
    }

    setDeltaX(0);

    // Återuppta autoplay efter x sekunder
    setIsManualSelection(true);
    setTimeout(() => setIsManualSelection(false), 1000);
  };

  const handleImageError = (event: React.SyntheticEvent<HTMLImageElement>) => {
    event.currentTarget.src = FALLBACK_IMAGE;
  };

  return (
    <div
      className="carousel"
      ref={carouselRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <img
        src={images[index]}
        alt="carousel"
        className="carousel-image"
        onError={handleImageError} 
      />
    </div>
  );
};

export default Carousel;
