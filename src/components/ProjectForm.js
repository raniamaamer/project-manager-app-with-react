import React, { useState } from 'react';

const ProjectForm = ({ onSave, onCancel, initialData = {} }) => {
  const [title, setTitle] = useState(initialData.title || '');
  const [description, setDescription] = useState(initialData.description || '');
  const [dueDate, setDueDate] = useState(initialData.dueDate || '');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Le titre est requis.");
      return;
    }

    onSave({ title, description, dueDate });
    setTitle('');
    setDescription('');
    setDueDate('');
    setError('');
  };

  return (
    <form onSubmit={handleSubmit} className="project-form">
      <h2>{initialData.title ? "Modifier le projet" : "Créer un nouveau projet"}</h2>

      {error && <p className="form-error">{error}</p>}

      <div className="form-group">
        <label htmlFor="title">Titre</label>
        <input
          id="title"
          type="text"
          placeholder="Entrez le titre du projet"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          placeholder="Décrivez votre projet"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label htmlFor="dueDate">Date limite</label>
        <input
          id="dueDate"
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
      </div>

      <div className="form-buttons">
        <button type="button" className="cancel-button" onClick={onCancel}>
          Annuler
        </button>
        <button type="submit" className="save-button">
          Enregistrer
        </button>
      </div>
    </form>
  );
};

export default ProjectForm;
