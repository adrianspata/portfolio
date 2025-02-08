import React from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header"; 
import "../Styles/GlobalStyles.css";
import "../Styles/ProjectPage.css"; 

const projects = [
  { id: 1, image: "/images/SOTMayaAGRUMEside.jpg", name: "Maya Nilsen for SOT", date: "Apr 2024" },
  { id: 2, image: "/images/SOTMagcoverplastic3.jpg", name: "SOT Magazine", date: "Aug 2024" },
  { id: 3, image: "/images/launcheinvite30th.jpg", name: "SOT Launch Event", date: "June 2024" },
  { id: 4, image: "/images/godajfappelbild.jpg", name: "SOT Godajf", date: "Sep 2024" },
  { id: 5, image: "/images/squarecirclogonew.jpg", name: "SQUARE CIRC Logo", date: "Apr 2022" },
  { id: 6, image: "/images/sunsunlogosketch.png", name: "SunSun Logo", date: "Feb 2020" },
  { id: 7, image: "/images/sotmagcoveropt4.jpg", name: "SOT Magazine", date: "Aug 2024" },
  { id: 8, image: "/images/SOTUnderbronfinal1.jpg", name: "Underbron x SOT Event", date: "Dec 2023" },
  { id: 9, image: "/images/Aluminumziplock1.jpg", name: "Aluminum Ziplock Pouch", date: "Sep 2024" },
  { id: 10, image: "/images/drinkglasincense.jpg", name: "SOT - AI Incense", date: "Mars 2024" },
  { id: 11, image: "/images/IMG1578.PNG", name: "7-Eleven Pyjamas", date: "Feb 2021" },
  { id: 12, image: "/images/loopliblogo.jpg", name: "LoopLib Logo", date: "Nov 2022" },
  { id: 13, image: "/images/louis3sticksb&w.jpg", name: "Louis Wood for SOT", date: "Juli 2024" },
  { id: 14, image: "/images/mastikpacksottext3.jpg", name: "Incense Packaging for SOT", date: "May 2024" },
  { id: 15, image: "/images/nytanincenseblur.jpg", name: "Blurry Incense for SOT", date: "Nov 2024" },
];

const ProjectsPage: React.FC = () => {
  return (
    <div className="projects-page">
      <Header />

      <Link to="/" className="back-arrow">←</Link>

      <h2 className="projects-title">Selected Works</h2>

      <div className="projects-grid">
        {projects.map((project) => (
          <div key={project.id} className="project-card">
            <img src={project.image} alt={project.name} />
            <p>{project.name} - {project.date}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectsPage;
