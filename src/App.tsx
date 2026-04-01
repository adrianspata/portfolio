import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import IntroAnimation from "./components/IntroAnimation";
import Navigation from "./components/Navigation";
import WorkStrip from "./components/WorkStrip";
import ContactPage from "./pages/ContactPage"; 
import SingleProjectPage from "./pages/SingleProjectPage";
import ProjectsPage from "./pages/ProjectPage";
import Footer from "./components/Footer";
import "./App.css";

const App: React.FC = () => {
  const [introComplete, setIntroComplete] = useState(false);

  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <div className="app">
            {!introComplete && (
              <IntroAnimation onComplete={() => setIntroComplete(true)} />
            )}
            {introComplete && (
              <>
                <Navigation isVisible={introComplete} />
                <WorkStrip isVisible={introComplete} />
              </>
            )}
          </div>
        } />

        <Route path="/about" element={<ContactPage />} />

        <Route path="/work" element={<ProjectsPage />} />

        <Route path="/work/:id" element={<SingleProjectPage />} />

      </Routes>
      <Footer />
    </Router>
  );
};

export default App;
