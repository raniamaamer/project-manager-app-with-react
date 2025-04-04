const ProjectList = ({ projects, onEdit, onDelete }) => {
  return (
    <div className="project-list">
      {projects.length > 0 ? (
        projects.map((project) => (
          <div key={project.id} className="project-item">
            <h3 onClick={() => onEdit(project)} className="clickable-title">
              {project.title}
            </h3>
            <p>{project.description}</p>
            <small>Due: {project.dueDate || "No deadline"}</small>
            <div className="project-actions">
              <button className="edit-button" onClick={() => onEdit(project)}>✏ Modifier</button>
              <button className="delete-button" onClick={() => onDelete(project.id)}>❌ Supprimer</button>
            </div>
          </div>
        ))
      ) : (
        <p>Aucun projet disponible. Ajoutez-en un !</p>
      )}
    </div>
  );
};

export default ProjectList;
