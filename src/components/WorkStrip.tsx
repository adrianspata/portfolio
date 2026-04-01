import React, { useRef, useState, useEffect, useCallback } from "react";
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

  // Touch drag state
  const touchStartX = useRef(0);
  const touchScrollLeft = useRef(0);
  const isTouchDragging = useRef(false);

  // Center-item highlight
  const [centerIndex, setCenterIndex] = useState<number | null>(null);
  const thumbRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [cursor, setCursor] = useState({ show: false, text: "", x: 0, y: 0 });

  // Find which thumb is closest to the center of the strip container
  const updateCenterIndex = useCallback(() => {
    if (!stripRef.current) return;
    const containerRect = stripRef.current.getBoundingClientRect();
    const containerCenterX = containerRect.left + containerRect.width / 2;

    let closestIdx: number | null = null;
    let closestDist = Infinity;

    thumbRefs.current.forEach((el, idx) => {
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const thumbCenterX = rect.left + rect.width / 2;
      const dist = Math.abs(thumbCenterX - containerCenterX);
      if (dist < closestDist) {
        closestDist = dist;
        closestIdx = idx;
      }
    });

    setCenterIndex(closestIdx);
  }, []);

  useAnimationFrame((_, delta) => {
    if (!stripRef.current || isPaused || isMouseDown) return;

    // Smooth slow pan (~0.3px per frame)
    stripRef.current.scrollLeft += 0.3 * (delta / 16.6);

    // Seamless wrap
    if (stripRef.current.scrollLeft >= stripRef.current.scrollWidth / 2) {
      stripRef.current.scrollLeft -= stripRef.current.scrollWidth / 2;
    }

    updateCenterIndex();
  });

  // Also update center on scroll (covers manual drag / native scroll)
  useEffect(() => {
    const el = stripRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateCenterIndex, { passive: true });
    return () => el.removeEventListener("scroll", updateCenterIndex);
  }, [updateCenterIndex]);

  // ── Mouse handlers ──────────────────────────────────────────────────────────

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
    setCursor((prev) => ({ ...prev, show: false }));
  };

  const handleMouseUp = () => {
    setIsMouseDown(false);
    if (resumeTimeout.current) clearTimeout(resumeTimeout.current);
    resumeTimeout.current = window.setTimeout(() => setIsPaused(false), 800);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    setCursor((prev) => ({ ...prev, x: e.clientX, y: e.clientY }));
    if (!isMouseDown || !stripRef.current) return;
    e.preventDefault();
    const x = e.pageX - stripRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    stripRef.current.scrollLeft = scrollLeft - walk;
  };

  // ── Touch handlers ──────────────────────────────────────────────────────────

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!stripRef.current) return;
    touchStartX.current = e.touches[0].pageX;
    touchScrollLeft.current = stripRef.current.scrollLeft;
    isTouchDragging.current = true;
    setIsPaused(true);
    if (resumeTimeout.current) clearTimeout(resumeTimeout.current);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isTouchDragging.current || !stripRef.current) return;
    const x = e.touches[0].pageX;
    const walk = (touchStartX.current - x) * 1.5;
    stripRef.current.scrollLeft = touchScrollLeft.current + walk;

    // Seamless wrap during touch drag
    if (stripRef.current.scrollLeft >= stripRef.current.scrollWidth / 2) {
      stripRef.current.scrollLeft -= stripRef.current.scrollWidth / 2;
      touchScrollLeft.current -= stripRef.current.scrollWidth / 2;
    } else if (stripRef.current.scrollLeft < 0) {
      stripRef.current.scrollLeft += stripRef.current.scrollWidth / 2;
      touchScrollLeft.current += stripRef.current.scrollWidth / 2;
    }

    updateCenterIndex();
  };

  const handleTouchEnd = () => {
    isTouchDragging.current = false;
    if (resumeTimeout.current) clearTimeout(resumeTimeout.current);
    resumeTimeout.current = window.setTimeout(() => setIsPaused(false), 800);
  };

  if (!isVisible) return null;

  const totalThumbs = allProjects.length * 2;

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
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="bg-filmstrip" ref={stripRef}>
        {[0, 1].flatMap((setIdx) =>
          allProjects.map((p, i) => {
            const globalIdx = setIdx * allProjects.length + i;
            const isCenter = centerIndex === globalIdx;
            return (
              <div
                key={p.id + `_col${setIdx + 1}_` + i}
                className={`bg-thumb${isCenter ? " bg-thumb--center" : ""}`}
                ref={(el) => {
                  thumbRefs.current[globalIdx] = el;
                }}
                onMouseEnter={() =>
                  setCursor((prev) => ({ ...prev, show: true, text: p.name }))
                }
                onMouseLeave={() =>
                  setCursor((prev) => ({ ...prev, show: false }))
                }
                onClick={(e) => {
                  if (
                    stripRef.current &&
                    Math.abs(
                      e.pageX - stripRef.current.offsetLeft - startX
                    ) < 5
                  ) {
                    navigate(`/work/${p.id}`);
                  }
                }}
              >
                <img src={p.images[0]} alt={p.name} />
              </div>
            );
          })
        )}
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
