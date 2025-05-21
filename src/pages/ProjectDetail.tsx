// import React from "react";
// import { useParams } from "react-router-dom";
// import { allProjects } from "../data/projects"; 
// import Header from "../components/Header";
// import "../Styles/ProjectDetail.css";

// const ProjectDetail: React.FC = () => {
//   const { id } = useParams();
//   const project = allProjects.find(p => p.id === Number(id));

//   if (!project) return <div>Project not found</div>;

//   return (
//     <div className="project-detail-page">
//       <Header />
//       <div className="project-detail-content">
//         <div className="project-text">
//           <h2>{project.name}</h2>
//           <p>{project.date}</p>
//           <p>{project.description}</p>
//         </div>

//         <div className="project-images">
//           {project.images.map((src, i) => (
//             <img key={i} src={src} alt={`${project.name} ${i}`} className="scatter-img" onClick={() => window.open(src, "_blank")} />
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProjectDetail;