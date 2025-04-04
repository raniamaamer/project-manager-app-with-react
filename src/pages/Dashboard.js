import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import ProjectForm from "../components/ProjectForm";
import ProjectList from "../components/ProjectList";
import clipboard from "../pages/clipboard.png";
import { db } from "../firebaseConfig";
import { collection, addDoc, getDocs, updateDoc, doc } from "firebase/firestore";

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const fetchProjects = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "projects"));
      const projectList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProjects(projectList);
    } catch (error) {
      console.error("❌ Erreur lors de la récupération des projets :", error);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const addProject = async (project) => {
    try {
      const docRef = await addDoc(collection(db, "projects"), project);
      setProjects([...projects, { id: docRef.id, ...project }]);
      setShowForm(false);
    } catch (error) {
      console.error("❌ Erreur lors de l'ajout du projet :", error);
    }
  };

  const updateProject = async (updatedProject) => {
    try {
      const projectRef = doc(db, "projects", updatedProject.id);
      await updateDoc(projectRef, updatedProject);
      setProjects(
        projects.map((proj) => (proj.id === updatedProject.id ? updatedProject : proj))
      );
      setSelectedProject(null);
      setShowForm(false);
    } catch (error) {
      console.error("❌ Erreur lors de la mise à jour du projet :", error);
    }
  };

  return (
    <div className="dashboard">
      <Sidebar onAddProject={() => setShowForm(true)} />
      <div className="main-content">
        {showForm ? (
          <ProjectForm
            onSave={selectedProject ? updateProject : addProject}
            onCancel={() => {
              setShowForm(false);
              setSelectedProject(null);
            }}
            initialData={selectedProject}
          />
        ) : (
          <div className="empty-state">
            <img src={clipboard} alt="clipboard" className="empty-image" />
            <p>Start a new project to get going</p>
            <button className="create-button" onClick={() => setShowForm(true)}>
              Create New Project
            </button>
            <ProjectList projects={projects} onEdit={(proj) => {
              setSelectedProject(proj);
              setShowForm(true);
            }} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
