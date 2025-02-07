import React, { useState, useRef, useEffect } from "react";
import "../Styles/ThumbnailStrip.css";

interface ThumbnailStripProps {
  images: string[];
  setSelectedImage: (image: string) => void;
}

const MAX_VISIBLE_THUMBNAILS = 40;
const FALLBACK_IMAGE = "public/images/_mark_ logo.jpg";

const ThumbnailStrip: React.FC<ThumbnailStripProps> = ({ images, setSelectedImage }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const displayedImages = images.slice(0, MAX_VISIBLE_THUMBNAILS);

  const toggleStrip = () => {
    setIsVisible((prev) => !prev);

    if (timeoutId) clearTimeout(timeoutId);
    if (!isVisible) {
      const newTimeout = setTimeout(() => {
        setIsVisible(false);
      }, 9000);
      setTimeoutId(newTimeout);
    }
  };

  // Stäng stripen automatiskt
  const handleImageClick = (image: string) => {
    setSelectedImage(image);
    setIsVisible(true);
    if (timeoutId) clearTimeout(timeoutId);

    const newTimeout = setTimeout(() => {
      setIsVisible(false);
    }, 5000);
    setTimeoutId(newTimeout);
  };

  const handleImageError = (event: React.SyntheticEvent<HTMLImageElement>) => {
    event.currentTarget.src = FALLBACK_IMAGE;
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollContainerRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 2; 
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [timeoutId]);

  return (
    <div className="thumbnail-container">
      <button className="toggle-btn" onClick={toggleStrip}>
        {isVisible ? "↓" : "↑"}
      </button>
      {isVisible && (
        <div
          className="thumbnail-strip"
          ref={scrollContainerRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseUp}
          onMouseUp={handleMouseUp}
        >
          {displayedImages.map((img, idx) => (
            <img
              key={idx}
              src={img}
              alt={`thumbnail-${idx}`}
              className="thumbnail"
              onClick={() => handleImageClick(img)}
              onError={handleImageError} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ThumbnailStrip;
