import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import "../Styles/HomeHeader.css";

interface HomeHeaderProps {
  isIntro: boolean;
}

const HomeHeader: React.FC<HomeHeaderProps> = ({ isIntro }) => {
  return (
    <motion.div
      className="home-header"
      initial={{ opacity: 0 }}
      animate={{
        opacity: 1,
      }}
      transition={{ duration: 0.8, delay: isIntro ? 0 : 0.2 }}
    >
      <Link to="/" className="home-logo">Adrian Spata</Link>
    </motion.div>
  );
};

export default HomeHeader;
