// IntroAnimation.tsx (ersätt din component med denna version)

import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import designProjects from "../data/designProjects";
import "../Styles/IntroAnimation.css";

interface IntroAnimationProps {
  onComplete: () => void;
}

type Frame = { img: string; index: number };

const IntroAnimation: React.FC<IntroAnimationProps> = ({ onComplete }) => {
  const [isAnimating, setIsAnimating] = useState(true);
  const [frames, setFrames] = useState<Frame[]>([]);
  const [flashIndex, setFlashIndex] = useState(0);
  const [stackCount, setStackCount] = useState(0);
  const [phase, setPhase] = useState<"flash" | "settle" | "exit">("flash");

  useEffect(() => {
    const picked = designProjects
      .filter((p) => p?.images?.[0])
      .slice(0, 10)
      .map((p, idx) => ({ img: p.images[0], index: idx }));

    setFrames(picked);

    picked.forEach((f) => {
      const im = new Image();
      im.src = f.img;
    });
  }, []);

  useEffect(() => {
    if (!frames.length) return;

    const frameMs = 90;
    const totalTicks = Math.floor(frames.length * 2.4);
    const maxStack = Math.min(frames.length, 10);

    let tick = 0;

    const id = window.setInterval(() => {
      tick += 1;

      setFlashIndex((i) => (i + 1) % frames.length);

      // stapla utan rotation: perfekt center + mikroskopisk diagonal offset
      setStackCount((c) => {
        if (c >= maxStack) return c;
        if (tick <= frames.length) return Math.min(c + 1, maxStack);
        if (tick % 3 === 0) return Math.min(c + 1, maxStack);
        return c;
      });

      if (tick >= totalTicks) {
        window.clearInterval(id);
        setPhase("settle");

        window.setTimeout(() => {
          setPhase("exit");
          setIsAnimating(false);
          window.setTimeout(() => onComplete(), 650);
        }, 220);
      }
    }, frameMs);

    return () => window.clearInterval(id);
  }, [frames, onComplete]);

  const stackFrames = useMemo(() => frames.slice(0, stackCount), [frames, stackCount]);
  const currentFlash = frames[flashIndex]?.img;

  return (
    <AnimatePresence>
      {isAnimating && (
        <motion.div
          className="intro-animation"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.65, ease: "easeOut" }}
        >
          <motion.div
  className="intro-logo"
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.35, ease: "easeOut" }}
>
  <h1>Adrian Spata</h1>
</motion.div>

          <div className="intro-stage">
  {/* Flash – EN bild i taget */}
  <AnimatePresence mode="wait">
    {phase === "flash" && currentFlash && (
      <motion.img
        key={currentFlash}
        src={currentFlash}
        className="flash-frame"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 1 }}
        transition={{ duration: 0.8, ease: "linear" }}
      />
    )}
  </AnimatePresence>

  {/* Stack – alla bilder exakt ovanpå varandra */}
  {stackFrames.map((frame, index) => (
    <motion.img
      key={frame.img}
      src={frame.img}
      className="stack-card"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.12 }}
      style={{
        zIndex: index, // ENDA stack-effekten
      }}
    />
  ))}
</div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default IntroAnimation;
