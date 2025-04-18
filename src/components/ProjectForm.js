import React, { useState, useEffect } from 'react';


const ProjectForm = ({ onSave, onCancel, initialData = null }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [tasks, setTasks] = useState([]); // Nouvel état pour les tâches
  const [newTask, setNewTask] = useState(''); // Saisie de nouvelle tâche

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setDescription(initialData.description || '');
      setDueDate(initialData.dueDate || '');
      setTasks(initialData.tasks || []); // Charge les tâches existantes
    }
  }, [initialData]);

  // Ajoute une tâche à la liste
  const handleAddTask = () => {
    if (newTask.trim()) {
      setTasks([...tasks, { id: Date.now().toString(), text: newTask, completed: false }]);
      setNewTask('');
    }
  };

  // Supprime une tâche
  const handleRemoveTask = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  // Toggle l'état d'une tâche
  const handleToggleTask = (taskId) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title) {
      const project = {
        title,
        description,
        dueDate,
        tasks, // Inclut les tâches dans le projet
        ...(initialData && { id: initialData.id }) // Garde l'ID pour les modifications
      };
      onSave(project);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="project-form">
      {/* Champs existants */}
      <input 
        type="text" 
        placeholder="TITLE" 
        value={title} 
        onChange={(e) => setTitle(e.target.value)} 
        required 
      />
      <textarea 
        placeholder="DESCRIPTION" 
        value={description} 
        onChange={(e) => setDescription(e.target.value)} 
      />
      <input 
        type="date" 
        value={dueDate} 
        onChange={(e) => setDueDate(e.target.value)} 
      />

      {/* Section Tâches */}
      <div className="tasks-section">
        <h4>Tasks</h4>
        <div className="task-input">
          <input
            type="text"
            placeholder="Add a task"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
          />
          <button 
            type="button" 
            className="add-task-button"
            onClick={handleAddTask}
          >
            +
          </button>
        </div>
        <ul className="task-list">
          {tasks.map((task) => (
            <li key={task.id}>
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => handleToggleTask(task.id)}
              />
              <span className={task.completed ? "completed-task" : ""}>
                {task.text}
              </span>
              <button 
                type="button" 
                className="remove-task-button"
                onClick={() => handleRemoveTask(task.id)}
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Boutons du formulaire */}
      <div className="form-buttons">
        <button type="button" className="cancel" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="save">
          Save
        </button>
      </div>
    </form>
  );
};

export default ProjectForm;