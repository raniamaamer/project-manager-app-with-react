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
  const [selectedProject, setSelectedProject] = useState(null);

  // 🔹 Charger les projets depuis Firebase
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "projects"));
        const projectList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProjects(projectList);
      } catch (error) {
        console.error("❌ Erreur lors de la récupération des projets :", error);
      }
    };
    fetchProjects();
  }, []);

  // 🔹 Ajouter un nouveau projet
  const addProject = async (project) => {
    try {
      if (selectedProject) {
        // Mise à jour d'un projet existant
        const projectRef = doc(db, "projects", selectedProject.id);
        await updateDoc(projectRef, project);
        setProjects(projects.map(p => (p.id === selectedProject.id ? { ...p, ...project } : p)));
        setSelectedProject(null);
      } else {
        // Création d'un nouveau projet
        const docRef = await addDoc(collection(db, "projects"), project);
        setProjects([...projects, { id: docRef.id, ...project }]);
      }
      setShowForm(false);
    } catch (error) {
      console.error("❌ Erreur lors de l'ajout/modification du projet :", error);
    }
  };

  // 🔹 Supprimer un projet
  const deleteProject = async (id) => {
    if (window.confirm("Voulez-vous vraiment supprimer ce projet ?")) {
      try {
        await deleteDoc(doc(db, "projects", id));
        setProjects(projects.filter(project => project.id !== id));
      } catch (error) {
        console.error("❌ Erreur lors de la suppression :", error);
      }
    }
  };

  // 🔹 Modifier un projet
  const editProject = (project) => {
    setSelectedProject(project);
    setShowForm(true);
  };

  return (
    <div className="dashboard">
      <Sidebar onAddProject={() => { setSelectedProject(null); setShowForm(true); }} />
      <div className="main-content">
        {showForm ? (
          <ProjectForm 
            onSave={addProject} 
            onCancel={() => { setShowForm(false); setSelectedProject(null); }} 
            project={selectedProject}
          />
        ) : (
          <div className="empty-state">
            <img src={clipboard} alt="clipboard" className="empty-image" />
            <p>Start a new project to get going</p>
            <button className="create-button" onClick={() => { setSelectedProject(null); setShowForm(true); }}>
              Create New Project
            </button>
            <ProjectList projects={projects} onEdit={editProject} onDelete={deleteProject} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
