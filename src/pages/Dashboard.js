import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import ProjectForm from '../components/ProjectForm';
import ProjectList from '../components/ProjectList';
import clipboard from '../pages/clipboard.png';
import { db } from '../firebaseConfig';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore';

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  const fetchProjects = async () => {
    const querySnapshot = await getDocs(collection(db, 'projects'));
    const projectList = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    setProjects(projectList);
  };

  const addProject = async (project) => {
    const docRef = await addDoc(collection(db, 'projects'), project);
    setProjects([...projects, { id: docRef.id, ...project }]);
    setShowForm(false);
  };

  const updateProject = async (updatedProject) => {
    const projectRef = doc(db, 'projects', updatedProject.id);
    await updateDoc(projectRef, updatedProject);
    setProjects(projects.map(p => (p.id === updatedProject.id ? updatedProject : p)));
    setEditingProject(null);
    setShowForm(false);
  };

  const deleteProject = async (id) => {
    await deleteDoc(doc(db, 'projects', id));
    setProjects(projects.filter(project => project.id !== id));
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <div className="dashboard">
      <Sidebar onAddProject={() => { setEditingProject(null); setShowForm(true); }} />
      <div className="main-content">
        {showForm ? (
          <ProjectForm
            onSave={editingProject ? updateProject : addProject}
            onCancel={() => { setShowForm(false); setEditingProject(null); }}
            initialData={editingProject}
          />
        ) : (
          <div className="empty-state">
            <img src={clipboard} alt="clipboard" className="empty-image" />
            <p>Start a new project to get going</p>
            <button className="create-button" onClick={() => setShowForm(true)}>
              Create New Project
            </button>
            <ProjectList
              projects={projects}
              onEdit={(project) => {
                setEditingProject(project);
                setShowForm(true);
              }}
              onDelete={deleteProject}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
