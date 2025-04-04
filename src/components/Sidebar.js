import React from 'react';

const Sidebar = ({ onAddProject }) => (
  <aside className="sidebar">
    <h2>YOUR PROJECTS</h2>
    <button onClick={onAddProject} className="add-project-btn">+ Add Project</button>
  </aside>
);

export default Sidebar;
