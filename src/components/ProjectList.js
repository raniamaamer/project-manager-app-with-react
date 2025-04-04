const ProjectList = ({ projects, onEdit }) => (
  <div className="project-list">
    {projects.length > 0 ? (
      projects.map((project) => (
        <div key={project.id} className="project-item">
          <h3>{project.title}</h3>
          <p>{project.description}</p>
          <small>Due: {project.dueDate || 'No deadline'}</small>
          <button className="create-button" onClick={() => onEdit(project)}>Modifier</button>
        </div>
      ))
    ) : (
      <p>Select a project or create a new one</p>
    )}
  </div>
);

export default ProjectList;
