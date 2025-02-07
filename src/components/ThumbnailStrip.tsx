import React, { useState, useRef } from "react";
import "../Styles/ThumbnailStrip.css";

interface ThumbnailStripProps {
  images: string[];
  setSelectedImage: (image: string) => void;
}

const MAX_VISIBLE_THUMBNAILS = 40;
const FALLBACK_IMAGE = "/images/marklogo.jpg"; 

const ThumbnailStrip: React.FC<ThumbnailStripProps> = ({ images, setSelectedImage }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const displayedImages = images.slice(0, MAX_VISIBLE_THUMBNAILS);

  const toggleStrip = () => {
    setIsVisible((prev) => !prev);
  };

  const handleImageClick = (image: string) => {
    setSelectedImage(image);
    setIsVisible(true);
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

  return (
    <>
      {/* En enda pilknapp som växlar mellan ↑ och ↓ */}
      <button className="toggle-btn" onClick={toggleStrip}>
        {isVisible ? "↓" : "↑"}
      </button>

      <div className={`thumbnail-strip-container ${isVisible ? "visible" : "hidden"}`}>
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
      </div>
    </>
  );
};

export default ThumbnailStrip;
