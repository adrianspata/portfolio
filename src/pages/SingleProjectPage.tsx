import React, { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "../components/Header";
import Navigation from "../components/Navigation";
import { allProjects, getMediaUrl, getMediaBackground, getMediaPadding } from "../data/projects";
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
          {project.images.map((mediaItem, idx) => {
            const url = getMediaUrl(mediaItem);
            const bg = getMediaBackground(mediaItem);
            const padding = getMediaPadding(mediaItem);
            const isVideo = url.toLowerCase().endsWith('.mp4') || url.toLowerCase().endsWith('.webm');

            const itemStyle: React.CSSProperties = {
              ...(typeof bg === "string"
                ? ({ backgroundColor: bg, "--bg-light": bg, "--bg-dark": bg } as React.CSSProperties)
                : {}),
              ...(typeof bg === "object" && bg !== null
                ? ({ "--bg-light": bg.light, "--bg-dark": bg.dark } as React.CSSProperties)
                : {}),
              ...(padding ? { padding } : {}),
            };

            return (
              <div
                key={idx}
                className="image-item"
                style={Object.keys(itemStyle).length > 0 ? itemStyle : undefined}
              >
                {isVideo ? (
                  <video
                    src={url}
                    className="project-image"
                    autoPlay
                    loop
                    muted
                    playsInline
                  />
                ) : (
                  <img
                    src={url}
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
