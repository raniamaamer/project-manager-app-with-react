const ProjectList = ({ projects, onEdit, onDelete }) => (
  <div className="project-list">
    {projects.length > 0 ? (
      projects.map((project) => (
        <div key={project.id} className="project-item">
          <h3>{project.title}</h3>
          <p>{project.description}</p>
          <small>Due: {project.dueDate || 'No deadline'}</small>
          <div className="project-buttons">
            <button className="edit-button" onClick={() => onEdit(project)}>Modify</button>
            <button className="delete-button" onClick={() => onDelete(project.id)}>Delete</button>
          </div>
        </div>
      ))
    ) : (
      <p>Select a project or create a new one</p>
    )}
  </div>
);

export default ProjectList;
