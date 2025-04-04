import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import ProjectForm from '../components/ProjectForm';
import ProjectList from '../components/ProjectList';
import clipboard from '../pages/clipboard.png';
import { db } from '../firebaseConfig'; 
import { collection, addDoc, getDocs } from 'firebase/firestore';

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const addProject = async (project) => {
    try {
      const docRef = await addDoc(collection(db, "projects"), project);
      const newProject = { id: docRef.id, ...project };
      setProjects([...projects, newProject]);
      setShowForm(false);
      console.log("✅ Projet ajouté :", newProject);
    } catch (error) {
      console.error("❌ Erreur lors de l'ajout du projet :", error);
    }
  };

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "projects"));
        const projectList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProjects(projectList);
        console.log("📦 Projets récupérés :", projectList);
      } catch (error) {
        console.error("❌ Erreur lors de la récupération des projets :", error);
      }
    };

    fetchProjects();
  }, []);

  return (
    <div className="dashboard">
      <Sidebar onAddProject={() => setShowForm(true)} />
      <div className="main-content">
        {showForm ? (
          <ProjectForm onSave={addProject} onCancel={() => setShowForm(false)} />
        ) : (
          <div className="empty-state">
            <img src={clipboard} alt="clipboard" className="empty-image" />
            <p>Start a new project to get going</p>
            <button className="create-button" onClick={() => setShowForm(true)}>
              Create New Project
            </button>
            <ProjectList projects={projects} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
