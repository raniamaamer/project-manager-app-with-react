import React, { useState, useEffect } from 'react';

const ProjectForm = ({ onSave, onCancel, initialData = null }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setDescription(initialData.description);
      setDueDate(initialData.dueDate);
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title) {
      const project = {
        title,
        description,
        dueDate,
        ...(initialData && { id: initialData.id })
      };
      onSave(project);
      setTitle('');
      setDescription('');
      setDueDate('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="project-form">
      <input type="text" placeholder="TITLE" value={title} onChange={(e) => setTitle(e.target.value)} />
      <textarea placeholder="DESCRIPTION" value={description} onChange={(e) => setDescription(e.target.value)} />
      <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
      <div className="form-buttons">
        <button type="button" className="cancel" onClick={onCancel}>Cancel</button>
        <button type="submit" className="save">Save</button>
      </div>
    </form>
  );
};

export default ProjectForm;
