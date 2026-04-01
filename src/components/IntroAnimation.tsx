import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "../Styles/IntroAnimation.css";

interface IntroAnimationProps {
  onComplete: () => void;
}

const IntroAnimation: React.FC<IntroAnimationProps> = ({ onComplete }) => {
  const [isVisible, setIsVisible] = useState(true);
  const letters = ["A", "D", "R", "I", "A", "N", " ", "S", "P", "A", "T", "A"];

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const containerVariants: any = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    },
    exit: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        staggerDirection: -1
      }
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const letterVariants: any = {
    hidden: { opacity: 0, y: 20, scale: 1 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.5, ease: "easeOut" }
    },
    exit: {
      opacity: [1, 1, 1, 0],
      scale: [1, 0.15, 0.15, 0.15],
      transition: {
        duration: 1.8,
        times: [0, 0.4, 0.8, 1],
        ease: "easeInOut"
      }
    }
  };

  return (
    <AnimatePresence onExitComplete={onComplete}>
      {isVisible && (
        <motion.div
          className="intro-animation"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <div className="spata-text">
            {letters.map((char, index) => (
              <motion.span key={index} variants={letterVariants}>
                {char}
              </motion.span>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default IntroAnimation;
