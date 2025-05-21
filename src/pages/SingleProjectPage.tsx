import React from "react";
import { useParams, Link } from "react-router-dom";
import Header from "../components/Header";
import { allProjects } from "../data/projects";
import "../Styles/SingleProjectPage.css";

const SingleProjectPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  // const navigate = useNavigate();
  const project = allProjects.find((p) => p.id === Number(id));
  // const [selectedImage, setSelectedImage] = useState<string | null>(null);

  if (!project) {
    return (
      <div className="single-project-page">
        <Header />
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

      <Link to="/projects" className="back-arrow">
        <i className="fa-solid fa-arrow-left"></i>
      </Link>

      <div className="project-content">
        <div className="project-info">
          <h2>{project.name}</h2>
          <p className="project-date">{project.date}</p>
          <p className="project-description">{project.description}</p>
        </div>

        <div className="project-images-grid">
  {project.images.map((img, idx) => (
    <div key={idx} className="image-item">
      <img
        src={img}
        alt={`${project.name} ${idx + 1}`}
        className="project-image"
      />
    </div>
  ))}
</div>

      </div>
    </div>
  );
};

export default SingleProjectPage;
