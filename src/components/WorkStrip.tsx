import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useAnimationFrame } from "framer-motion";
import designProjects from "../data/designProjects";
import codeProjects from "../data/codeProjects";
import "../Styles/WorkStrip.css";

interface WorkStripProps {
  isVisible: boolean;
}

const WorkStrip: React.FC<WorkStripProps> = ({ isVisible }) => {
  const [allProjects] = useState(() => 
    [...designProjects, ...codeProjects].sort(() => Math.random() - 0.5)
  );
  const stripRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const [isPaused, setIsPaused] = useState(false);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const resumeTimeout = useRef<number | null>(null);

  const [cursor, setCursor] = useState({ show: false, text: "", x: 0, y: 0 });

  useAnimationFrame((_, delta) => {
    if (!stripRef.current || isPaused || isMouseDown) return;
    
    // Smooth slow pan (0.3px per frame approx)
    stripRef.current.scrollLeft += 0.3 * (delta / 16.6);

    // Seamless absolute wrap
    if (stripRef.current.scrollLeft >= stripRef.current.scrollWidth / 2) {
      stripRef.current.scrollLeft -= stripRef.current.scrollWidth / 2;
    }
  });

  const handleWheel = () => {
    setIsPaused(true);
    if (resumeTimeout.current) clearTimeout(resumeTimeout.current);
    resumeTimeout.current = window.setTimeout(() => setIsPaused(false), 800);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!stripRef.current) return;
    setIsMouseDown(true);
    setIsPaused(true);
    setStartX(e.pageX - stripRef.current.offsetLeft);
    setScrollLeft(stripRef.current.scrollLeft);
  };

  const handleMouseLeaveContainer = () => {
    setIsMouseDown(false);
    setIsPaused(false);
    setCursor(prev => ({ ...prev, show: false }));
  };

  const handleMouseUp = () => {
    setIsMouseDown(false);
    if (resumeTimeout.current) clearTimeout(resumeTimeout.current);
    resumeTimeout.current = window.setTimeout(() => setIsPaused(false), 800);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    setCursor(prev => ({ ...prev, x: e.clientX, y: e.clientY }));

    if (!isMouseDown || !stripRef.current) return;
    e.preventDefault();
    const x = e.pageX - stripRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    stripRef.current.scrollLeft = scrollLeft - walk;
  };

  if (!isVisible) return null;

  return (
    <motion.div 
      className="home-container" 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseLeave={handleMouseLeaveContainer}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
    >
      <div className="bg-filmstrip" ref={stripRef}>
        {allProjects.map((p, i) => (
          <div 
            key={p.id + "_col1_" + i} 
            className="bg-thumb"
            onMouseEnter={() => setCursor(prev => ({ ...prev, show: true, text: p.name }))}
            onMouseLeave={() => setCursor(prev => ({ ...prev, show: false }))}
            onClick={(e) => {
              if (stripRef.current && Math.abs((e.pageX - stripRef.current.offsetLeft) - startX) < 5) {
                navigate(`/work/${p.id}`);
              }
            }}
          >
            <img src={p.images[0]} alt={p.name} />
          </div>
        ))}
        {allProjects.map((p, i) => (
          <div 
            key={p.id + "_col2_" + i} 
            className="bg-thumb"
            onMouseEnter={() => setCursor(prev => ({ ...prev, show: true, text: p.name }))}
            onMouseLeave={() => setCursor(prev => ({ ...prev, show: false }))}
            onClick={(e) => {
              if (stripRef.current && Math.abs((e.pageX - stripRef.current.offsetLeft) - startX) < 5) {
                navigate(`/work/${p.id}`);
              }
            }}
          >
            <img src={p.images[0]} alt={p.name} />
          </div>
        ))}
      </div>

      {cursor.show && (
        <div 
          className="cursor-tooltip"
          style={{ left: cursor.x, top: cursor.y }}
        >
          {cursor.text}
        </div>
      )}
    </motion.div>
  );
};

export default WorkStrip;
