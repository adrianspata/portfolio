import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import ContactInfo from "./components/ContactInfo";
import Carousel from "./components/Carousel";
import ThumbnailStrip from "./components/ThumbnailStrip";
import Description from "./components/Description";
import ContactPage from "./pages/ContactPage"; 
import ProjectsPage from "./pages/ProjectPage";
import { images, shuffleImages } from "./data/images";
import "./App.css";

const App: React.FC = () => {
  const [shuffledImages, setShuffledImages] = useState<string[]>([]);

  useEffect(() => {
    setShuffledImages(shuffleImages(images));
  }, []);

  const [selectedImage, setSelectedImage] = useState<string | null>(shuffledImages[0]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <div className="app">
            <Header />
            <ContactInfo />
            <Carousel selectedImage={selectedImage} images={shuffledImages} />
            <ThumbnailStrip images={shuffledImages} setSelectedImage={setSelectedImage} />
            <Description />
          </div>
        } />

        <Route path="/contact" element={<ContactPage />} />

        <Route path="/projects" element={<ProjectsPage />} />
      </Routes>
    </Router>
  );
};

export default App;
