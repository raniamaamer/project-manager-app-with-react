import React, { useState, useEffect } from "react";

const ProjectForm = ({ onSave, onCancel, initialData }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setDescription(initialData.description);
      setDueDate(initialData.dueDate || "");
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title.trim()) {
      onSave({ id: initialData?.id, title, description, dueDate });
      setTitle("");
      setDescription("");
      setDueDate("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="project-form">
      <input type="text" placeholder="Titre" value={title} onChange={(e) => setTitle(e.target.value)} />
      <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
      <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
      <div className="form-buttons">
        <button type="button" onClick={onCancel}>Annuler</button>
        <button type="submit">{initialData ? "Mettre à jour" : "Enregistrer"}</button>
      </div>
    </form>
  );
};

export default ProjectForm;
