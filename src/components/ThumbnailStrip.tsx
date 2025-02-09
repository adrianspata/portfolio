import React, { useState, useRef } from "react";
import "../Styles/ThumbnailStrip.css";

interface ThumbnailStripProps {
  images: string[];
  setSelectedImage: (image: string) => void;
}

const MAX_VISIBLE_THUMBNAILS = 50;
const FALLBACK_IMAGE = "/images/marklogo.jpg";

const ThumbnailStrip: React.FC<ThumbnailStripProps> = ({ images, setSelectedImage }) => {
  const [isVisible, setIsVisible] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  const displayedImages = images.slice(0, MAX_VISIBLE_THUMBNAILS);

  // Växla mellan att visa/dölja stripen
  const toggleStrip = () => {
    setIsVisible(!isVisible);
  };

  const handleImageClick = (image: string) => {
    setSelectedImage(image);
  };

  const handleImageError = (event: React.SyntheticEvent<HTMLImageElement>) => {
    event.currentTarget.src = FALLBACK_IMAGE;
  };

  return (
    <>
      <button className={`toggle-btn ${isVisible ? "above" : "below"}`} onClick={toggleStrip}>
        {isVisible ? "↓" : "↑"}
      </button>

      <div className={`thumbnail-strip-container ${isVisible ? "visible" : "hidden"}`}>
        <div className="thumbnail-strip" ref={scrollContainerRef}>
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
