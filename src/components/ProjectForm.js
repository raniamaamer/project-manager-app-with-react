import React, { useState, useEffect, useCallback } from 'react';
import './ProjectForm.css';

const ProjectForm = ({ onSave, onCancel, initialData = null, isProcessing = false }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    tasks: []
  });
  const [newTask, setNewTask] = useState('');
  const [errors, setErrors] = useState({});
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Initialisation du formulaire
  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        description: initialData.description || '',
        dueDate: initialData.dueDate || '',
        tasks: initialData.tasks || []
      });
    }
  }, [initialData]);

  // Validation du formulaire
  const validateForm = useCallback(() => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (formData.tasks.some(task => !task.text.trim())) newErrors.tasks = 'Invalid task content';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  // Gestion des tâches
  const handleAddTask = useCallback(() => {
    if (newTask.trim() && !isProcessing) {
      setFormData(prev => ({
        ...prev,
        tasks: [
          ...prev.tasks,
          {
            id: Date.now().toString(),
            text: newTask.trim(),
            completed: false,
            createdAt: new Date().toISOString()
          }
        ]
      }));
      setNewTask('');
      setHasUnsavedChanges(true);
    }
  }, [newTask, isProcessing]);

  const handleRemoveTask = useCallback((taskId) => {
    if (!isProcessing) {
      setFormData(prev => ({
        ...prev,
        tasks: prev.tasks.filter(task => task.id !== taskId)
      }));
      setHasUnsavedChanges(true);
    }
  }, [isProcessing]);

  const handleToggleTask = useCallback((taskId) => {
    if (!isProcessing) {
      setFormData(prev => ({
        ...prev,
        tasks: prev.tasks.map(task => 
          task.id === taskId ? { ...task, completed: !task.completed } : task
        )
      }));
      setHasUnsavedChanges(true);
    }
  }, [isProcessing]);

  // Soumission du formulaire
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm() && !isProcessing) {
      onSave({
        ...formData,
        ...(initialData?.id && { id: initialData.id })
      });
      setHasUnsavedChanges(false);
    }
  };

  // Gestion des touches
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
      e.preventDefault();
      if (e.target.id === 'task-input') {
        handleAddTask();
      }
    }
  };

  // Gestion des changements
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setHasUnsavedChanges(true);
  };

  return (
    <form onSubmit={handleSubmit} className="project-form" onKeyDown={handleKeyPress}>
      <div className="form-header">
        <h2>{initialData ? 'Edit Project' : 'New Project'}</h2>
      </div>

      <div className="form-group">
        <label htmlFor="title">Project Title *</label>
        <input
          id="title"
          name="title"
          type="text"
          value={formData.title}
          onChange={handleChange}
          required
          placeholder="Enter project title"
          disabled={isProcessing}
          className={errors.title ? 'error' : ''}
        />
        {errors.title && <span className="error-message">{errors.title}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Enter project description"
          rows="4"
          disabled={isProcessing}
        />
      </div>

      <div className="form-group">
        <label htmlFor="dueDate">Due Date</label>
        <input
          id="dueDate"
          name="dueDate"
          type="date"
          value={formData.dueDate}
          onChange={handleChange}
          disabled={isProcessing}
        />
      </div>

      <div className="tasks-section">
        <div className="section-header">
          <label>Tasks</label>
          <span className="task-counter">
            {formData.tasks.filter(t => t.completed).length} / {formData.tasks.length} completed
          </span>
        </div>
        
        <div className="task-input-container">
          <input
            id="task-input"
            type="text"
            placeholder="Enter task description"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            disabled={isProcessing}
          />
          <button
            type="button"
            className="add-task-btn"
            onClick={handleAddTask}
            disabled={!newTask.trim() || isProcessing}
            aria-label="Add task"
          >
            <span>+</span> Add Task
          </button>
        </div>

        {errors.tasks && <span className="error-message">{errors.tasks}</span>}

        {formData.tasks.length > 0 ? (
          <ul className="task-list">
            {formData.tasks.map((task) => (
              <li key={task.id} className="task-item">
                <div className="task-content">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => handleToggleTask(task.id)}
                    disabled={isProcessing}
                    aria-label={`Toggle task: ${task.text}`}
                  />
                  <span className={`task-text ${task.completed ? 'completed' : ''}`}>
                    {task.text}
                  </span>
                </div>
                <button
                  type="button"
                  className="remove-task-btn"
                  onClick={() => handleRemoveTask(task.id)}
                  disabled={isProcessing}
                  aria-label={`Remove task: ${task.text}`}
                >
                  &times;
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="no-tasks">No tasks added yet</p>
        )}
      </div>

      <div className="form-actions">
        <button
          type="button"
          className="cancel-btn"
          onClick={() => {
            if (hasUnsavedChanges && !window.confirm('You have unsaved changes. Are you sure you want to cancel?')) {
              return;
            }
            onCancel();
          }}
          disabled={isProcessing}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="save-btn"
          disabled={isProcessing || !hasUnsavedChanges}
        >
          {isProcessing ? (
            <span className="loading-spinner"></span>
          ) : (
            initialData ? 'Update Project' : 'Create Project'
          )}
        </button>
      </div>
    </form>
  );
};

export default ProjectForm;