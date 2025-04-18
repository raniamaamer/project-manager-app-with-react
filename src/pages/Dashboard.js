import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../services/firebaseConfig';
import { signOut } from 'firebase/auth';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import Sidebar from '../components/Sidebar';
import ProjectForm from '../components/ProjectForm';
import clipboard from '../pages/clipboard.png';
import './Dashboard.css';

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        navigate('/login');
      } else {
        setLoading(false);
      }
    });
    return unsubscribe;
  }, [navigate]);

  const fetchProjects = useCallback(async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'projects'));
      const projectList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        tasks: doc.data().tasks || []
      }));
      setProjects(projectList);
    } catch (error) {
      console.error("Erreur de chargement:", error);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleProject = async (projectData, isUpdate) => {
    try {
      const projectToSave = {
        title: projectData.title,
        description: projectData.description,
        dueDate: projectData.dueDate,
        tasks: projectData.tasks || [],
        userId: auth.currentUser.uid
      };

      if (isUpdate) {
        const projectRef = doc(db, 'projects', projectData.id);
        await updateDoc(projectRef, projectToSave);
        setProjects(projects.map(p => p.id === projectData.id ? { ...projectToSave, id: projectData.id } : p));
      } else {
        const docRef = await addDoc(collection(db, 'projects'), projectToSave);
        setProjects([...projects, { ...projectToSave, id: docRef.id }]);
      }
      setShowForm(false);
      setEditingProject(null);
    } catch (error) {
      console.error("Erreur:", error);
    }
  };

  const handleToggleTask = async (projectId, taskId) => {
    try {
      const project = projects.find(p => p.id === projectId);
      if (!project) return;

      const updatedTasks = project.tasks.map(task =>
        task.id === taskId
          ? { ...task, completed: !task.completed }
          : task
      );

      const projectRef = doc(db, 'projects', projectId);
      await updateDoc(projectRef, { tasks: updatedTasks });

      setProjects(projects.map(p =>
        p.id === projectId ? { ...p, tasks: updatedTasks } : p
      ));
    } catch (error) {
      console.error("Erreur de modification de tâche:", error);
    }
  };

  const handleAddTask = async (projectId, taskText) => {
    try {
      const project = projects.find(p => p.id === projectId);
      if (!project) return;

      const newTask = {
        id: Date.now().toString(),
        text: taskText,
        completed: false
      };

      const updatedTasks = [...(project.tasks || []), newTask];
      const projectRef = doc(db, 'projects', projectId);
      await updateDoc(projectRef, { tasks: updatedTasks });

      setProjects(projects.map(p =>
        p.id === projectId ? { ...p, tasks: updatedTasks } : p
      ));
    } catch (error) {
      console.error("Erreur d'ajout de tâche:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error("Erreur de déconnexion:", error);
    }
  };

  if (loading) return <div className="loading">Chargement...</div>;

  return (
    <div className="dashboard">
      <Sidebar
        onAddProject={() => {
          setEditingProject(null);
          setShowForm(true);
        }}
        onLogout={handleLogout}
      />

      <main className="main-content">
        {showForm ? (
          <div className="form-container">
            <ProjectForm
              onSave={(data) => handleProject(data, !!editingProject)}
              onCancel={() => {
                setShowForm(false);
                setEditingProject(null);
              }}
              initialData={editingProject}
            />
          </div>
        ) : projects.length === 0 ? (
          <div className="empty-state">
            <img src={clipboard} alt="Aucun projet" className="empty-state-img" />
            <p>Commencez par créer un nouveau projet</p>
            <button
              className="create-button"
              onClick={() => setShowForm(true)}
            >
              Nouveau Projet
            </button>
          </div>
        ) : (
          <div className="projects-container">
            <h1 className="projects-title">YOUR PROJECTS</h1>

            <div className="projects-buttons">
              <button
                className="btn-brown"
                onClick={() => {
                  setEditingProject(null);
                  setShowForm(true);
                }}
              >
                + Add Project
              </button>
              <button
                className="btn-secondary"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>

            {projects.map(project => (
              <div key={project.id} className="project-card">
                <div className="project-header">
                  <h2>{project.title}</h2>
                </div>

                <p className="project-description">
                  {project.description}
                </p>

                <div className="task-section">
                  <h3>Tasks</h3>
                  <ul className="task-list">
                    {project.tasks.map(task => (
                      <li key={task.id} className="task-item">
                        <input
                          type="checkbox"
                          checked={task.completed}
                          onChange={() => handleToggleTask(project.id, task.id)}
                        />
                        <span className={task.completed ? "completed-task" : ""}>
                          {task.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <button
                    className="add-task-btn"
                    onClick={() => {
                      const taskText = prompt("Entrez une nouvelle tâche");
                      if (taskText) handleAddTask(project.id, taskText);
                    }}
                  >
                    + Add Task
                  </button>
                </div>

                <div className="project-actions">
                  <button
                    className="modify-btn"
                    onClick={() => {
                      setEditingProject(project);
                      setShowForm(true);
                    }}
                  >
                    Modify
                  </button>
                  <button
                    className="delete-btn"
                    onClick={async () => {
                      try {
                        await deleteDoc(doc(db, 'projects', project.id));
                        setProjects(projects.filter(p => p.id !== project.id));
                      } catch (error) {
                        console.error("Erreur de suppression:", error);
                      }
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
