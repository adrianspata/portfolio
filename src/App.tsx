import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import IntroAnimation from "./components/IntroAnimation";
import Navigation from "./components/Navigation";
import WorkStrip from "./components/WorkStrip";
import Description from "./components/Description";
import ContactPage from "./pages/ContactPage"; 
import SingleProjectPage from "./pages/SingleProjectPage";
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
                <Navigation isVisible={introComplete} showLogo={true} />
                <WorkStrip isVisible={introComplete} />
                <Description />
              </>
            )}
          </div>
        } />

        <Route path="/contact" element={<ContactPage />} />

        <Route path="/projects" element={<ContactPage />} />

        <Route path="/projects/:id" element={<SingleProjectPage />} />

      </Routes>
    </Router>
  );
};

export default App;
