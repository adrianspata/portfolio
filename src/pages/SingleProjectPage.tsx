import React, { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "../components/Header";
import Navigation from "../components/Navigation";
import { allProjects } from "../data/projects";
import "../Styles/SingleProjectPage.css";

const SingleProjectPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  // const navigate = useNavigate();
  const project = allProjects.find((p) => p.id === id);
  // const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Scrolla högst upp varje gång man går in på ett projekt
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!project) {
    return (
      <div className="single-project-page">
        <Header />
        <Navigation isVisible={true} />
        <p className="error-message">
          COULD NOT BE FOUND.
        </p>
        <Link to="/" className="back-arrow">
          <i className="fa-solid fa-arrow-left"></i>
        </Link>
      </div>
    );
  }

  return (
    <div className="single-project-page">
      <Header />
      <Navigation isVisible={true} />

      <div className="project-content">
        <div className="project-info">
          <h2>{project.name}</h2>
          <p className="project-date">{project.date}</p>
          <p className="project-description">{project.description}</p>
        </div>

        <div className="project-images-grid">
          {project.images.map((mediaUrl, idx) => {
            const isVideo = mediaUrl.toLowerCase().endsWith('.mp4') || mediaUrl.toLowerCase().endsWith('.webm');
            
            return (
              <div key={idx} className="image-item">
                {isVideo ? (
                  <video
                    src={mediaUrl}
                    className="project-image"
                    autoPlay
                    loop
                    muted
                    playsInline
                  />
                ) : (
                  <img
                    src={mediaUrl}
                    alt={`${project.name} ${idx + 1}`}
                    className="project-image"
                  />
                )}
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};

export default SingleProjectPage;
