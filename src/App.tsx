import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import ContactInfo from "./components/ContactInfo";
import ImageGallery from "./components/ImageGallery";
import Description from "./components/Description";
import ContactPage from "./pages/ContactPage"; 
import SingleProjectPage from "./pages/SingleProjectPage";
import "./App.css";

const App: React.FC = () => {

  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <div className="app">
            <Header />
            <ContactInfo />
            <ImageGallery />
            <Description />
          </div>
        } />

        <Route path="/contact" element={<ContactPage />} />

        <Route path="/projects/:id" element={<SingleProjectPage />} />

      </Routes>
    </Router>
  );
};

export default App;
