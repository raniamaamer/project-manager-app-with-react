const ProjectList = ({ projects }) => (
    <div className="project-list">
      {projects.length > 0 ? (
        projects.map((project, index) => (
          <div key={index} className="project-item">
            <h3>{project.title}</h3>
            <p>{project.description}</p>
            <small>Due: {project.dueDate || 'No deadline'}</small>
          </div>
        ))
      ) : (
        <p>Select a project or create a new one</p>
      )}
    </div>
  );
  
  export default ProjectList;
  