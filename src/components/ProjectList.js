import { db } from "../firebaseConfig";
import { doc, deleteDoc } from "firebase/firestore";

const ProjectList = ({ projects, onEdit }) => {
  const deleteProject = async (projectId) => {
    try {
      await deleteDoc(doc(db, "projects", projectId));
      window.location.reload(); // Recharge la page pour afficher la mise à jour
    } catch (error) {
      console.error("❌ Erreur lors de la suppression :", error);
    }
  };

  return (
    <div className="project-list">
      {projects.length > 0 ? (
        projects.map((project) => (
          <div key={project.id} className="project-item">
            <h3>{project.title}</h3>
            <p>{project.description}</p>
            <small>Due: {project.dueDate || "No deadline"}</small>
            <div className="buttons">
              <button onClick={() => onEdit(project)}>✏ Modifier</button>
              <button onClick={() => deleteProject(project.id)}>❌ Supprimer</button>
            </div>
          </div>
        ))
      ) : (
        <p>Aucun projet disponible.</p>
      )}
    </div>
  );
};

export default ProjectList;
