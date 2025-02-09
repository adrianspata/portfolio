import React, { useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import ProjectModal from "../components/ProjectModal"; 
import "../Styles/GlobalStyles.css";
import "../Styles/ProjectPage.css";

interface Project {
  id: number;
  images: string[];
  name: string;
  date: string;
  description: string;
}

const projects = [
  { 
    id: 1, 
    images: ["/images/SOTMayaAGRUMEside.jpg", "/images/SOTMayaGODAJFside.jpg", "/images/SOTMayaMASTIKside.jpg"], 
    name: "Maya Nilsen for SOT", 
    date: "Apr 2024", 
    description: "A campaign for the fragrance house SOT, featuring Maya Nilsen."
  },
  { 
    id: 2, 
    images: ["/images/sotmagcoveropt4.jpg", "/images/sotmagcoverlouis.jpg", "/images/SOTMagcoverplastic2.jpg", "/images/SOTMagcoverplastic3.jpg", "/images/sotmagpage2526.jpg"], 
    name: "SOT Magazine", 
    date: "Aug 2024", 
    description: "Magazine layout, visual storytelling & creative direction for SOT."
  },
  { 
    id: 3, 
    images: ["/images/launcheinvite30th.jpg", "/images/launchInvitePack.jpg"], 
    name: "SOT Launch Event", 
    date: "June 2024", 
    description: "Invitation design and branding for the SOT launch event."
  },
  { 
    id: 4, 
    images: ["/images/godajfappelbild.jpg", "/images/agrumeappelbild.jpg", "/images/mastikappelbild.jpg"], 
    name: "SOT Godajf", 
    date: "Sep 2024", 
    description: "Branding & creative direction for SOT incense collection."
  },
  { 
    id: 5, 
    images: ["/images/louis3sticksb&w.jpg", "/images/louisex4.jpg", "/images/louisSmell4.jpg", "/images/louisSmell3.jpg"], 
    name: "Louis Wood for SOT", 
    date: "Juli 2024", 
    description: "A campaign for the fragrance house SOT, featuring Louis Wood."
  },
  { 
    id: 6, 
    images: ["/images/sotWebpage.jpg"], 
    name: "SOT Webdesign", 
    date: "Feb 2024", 
    description: "Website design for SOT, focusing on modern minimalism."
  },
  { 
    id: 7, 
    images: ["/images/sotBagSteps2.jpg", "/images/sotBagLegs.jpg"], 
    name: "Campaign for SOT", 
    date: "Juli 2024", 
    description: "Creative direction and design for SOT."
  },
  { 
    id: 8, 
    images: ["/images/Aluminumziplock1.jpg"], 
    name: "Aluminum Ziplock Pouch", 
    date: "Sep 2024", 
    description: "Packaging design for SOT objects."
  },
  { 
    id: 9, 
    images: ["/images/robP6.jpg", "public/images/robP4.jpg"], 
    name: "Rob P", 
    date: "Mars 2024", 
    description: "Visuals for Rob P."
  },
  { 
    id: 10, 
    images: ["/images/drinkglasincense.jpg"], 
    name: "SOT - AI Incense", 
    date: "Mars 2024", 
    description: "AI-generated design for a incense concept."
  },
  { 
    id: 11, 
    images: ["/images/SOTUnderbronfinal1.jpg"], 
    name: "Underbron x SOT Event", 
    date: "Dec 2023", 
    description: "Event branding for Underbron x SOT collaboration."
  },
  { 
    id: 12, 
    images: ["/images/loopliblogo.jpg", "/images/looplibLogoAlt.jpg"], 
    name: "LoopLib Logo", 
    date: "Nov 2022", 
    description: "Logo design for LoopLib."
  },
  { 
    id: 13, 
    images: ["/images/IMG1578.png", "/images/IMG1577.png", "/images/7elevenSubway.jpg", "/images/7elevenMimmi.jpg"], 
    name: "7-Eleven Pyjamas", 
    date: "Feb 2021", 
    description: "Setdesign for 7-Eleven campaign."
  },
  { 
    id: 14, 
    images: ["/images/squarecirclogonew.jpg"], 
    name: "SQUARE CIRC Logo", 
    date: "Apr 2022", 
    description: "Logodesign for SQUARE CIRC."
  },
  { 
    id: 15, 
    images: ["/images/mastikpacksottext3.jpg"], 
    name: "Incense Packaging for SOT", 
    date: "May 2024", 
    description: "Packaging design for SOT."
  },
];

const ProjectsPage: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);

  const openModal = (project: Project) => {
    setSelectedProject(project);
    setCurrentImageIndex(0);
  };

  const closeModal = () => {
    setSelectedProject(null);
  };

  return (
    <div className="projects-page">
      <Header />
      <Link to="/" className="back-arrow">←</Link>
      <h2 className="projects-title">Selected Work</h2>

      <div className="projects-grid">
        {projects.map((project) => (
          <div key={project.id} className="project-card" onClick={() => openModal(project)}>
            <img src={project.images[0]} alt={project.name} />
            <p>{project.name} - {project.date}</p>
          </div>
        ))}
      </div>

      {/* Kopplar modal till projekten */}
      {selectedProject && (
        <ProjectModal 
          project={selectedProject} 
          currentImageIndex={currentImageIndex} 
          setCurrentImageIndex={setCurrentImageIndex} 
          closeModal={closeModal} 
        />
      )}
    </div>
  );
};

export default ProjectsPage;