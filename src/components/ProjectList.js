import { useState } from 'react';
import PropTypes from 'prop-types';

const ProjectList = ({ projects, onEdit, onDelete, onAddTask, onToggleTask }) => {
  const [taskInputs, setTaskInputs] = useState({});

  const handleAddTask = (projectId) => {
    const taskText = taskInputs[projectId]?.trim();
    if (!taskText) return;
    
    onAddTask(projectId, taskText);
    setTaskInputs(prev => ({ ...prev, [projectId]: "" }));
  };

  const handleKeyPress = (e, projectId) => {
    if (e.key === 'Enter') {
      handleAddTask(projectId);
    }
  };

  return (
    <div className="project-list">
      {projects.length > 0 ? (
        <div className="projects-grid">
          {projects.map((project) => (
            <article key={project.id} className="project-card">
              <header className="project-header">
                <h3>{project.title}</h3>
                <p className="project-description">{project.description}</p>
                <time className="project-due-date">
                  Due: {project.dueDate || 'No deadline'}
                </time>
              </header>

              {/* Tasks Section */}
              <section className="tasks-section">
                <h4>Tasks</h4>
                <div className="task-input-container">
                  <input
                    type="text"
                    placeholder="Add a task..."
                    value={taskInputs[project.id] || ""}
                    onChange={(e) => 
                      setTaskInputs(prev => ({ ...prev, [project.id]: e.target.value }))
                    }
                    onKeyPress={(e) => handleKeyPress(e, project.id)}
                    aria-label="Add new task"
                  />
                  <button 
                    className="add-task-button"
                    onClick={() => handleAddTask(project.id)}
                    aria-label="Add task"
                  >
                    +
                  </button>
                </div>
                
                {project.tasks?.length > 0 ? (
                  <ul className="task-list">
                    {project.tasks.map((task) => (
                      <li key={task.id} className="task-item">
                        <label className="task-label">
                          <input
                            type="checkbox"
                            checked={task.completed || false}
                            onChange={() => onToggleTask?.(project.id, task.id)}
                            className="task-checkbox"
                          />
                          <span className={`task-text ${task.completed ? "completed" : ""}`}>
                            {task.text}
                          </span>
                        </label>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="no-tasks-message">No tasks yet</p>
                )}
              </section>

              <footer className="project-actions">
                <button 
                  className="edit-button"
                  onClick={() => onEdit(project)}
                  aria-label={`Edit project ${project.title}`}
                >
                  Modify
                </button>
                <button 
                  className="delete-button"
                  onClick={() => onDelete(project.id)}
                  aria-label={`Delete project ${project.title}`}
                >
                  Delete
                </button>
              </footer>
            </article>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <p>No projects found. Create a new project to get started.</p>
        </div>
      )}
    </div>
  );
};

ProjectList.propTypes = {
  projects: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      description: PropTypes.string,
      dueDate: PropTypes.string,
      tasks: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string.isRequired,
          text: PropTypes.string.isRequired,
          completed: PropTypes.bool
        })
      )
    })
  ).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onAddTask: PropTypes.func.isRequired,
  onToggleTask: PropTypes.func
};

export default ProjectList;