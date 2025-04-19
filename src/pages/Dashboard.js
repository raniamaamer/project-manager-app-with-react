import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../services/firebaseConfig';
import { signOut } from 'firebase/auth';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, where, arrayUnion, arrayRemove } from 'firebase/firestore';
import Sidebar from '../components/Sidebar';
import ProjectForm from '../components/ProjectForm';
import clipboard from '../pages/clipboard.png';
import './Dashboard.css';

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();

  // Gestion de l'authentification
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

  // Récupération des projets
  const fetchProjects = useCallback(async () => {
    try {
      if (!auth.currentUser) return;
  
      const q = query(
        collection(db, 'projects'),
        where('userId', '==', auth.currentUser.uid)
      );
  
      const querySnapshot = await getDocs(q);
      const projectList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        tasks: doc.data().tasks || [],
        dueDate: doc.data().dueDate || null,
        lastUpdated: doc.data().lastUpdated || null
      }));
  
      // Tri par date de modification
      projectList.sort((a, b) => 
        new Date(b.lastUpdated) - new Date(a.lastUpdated)
      );
      
      setProjects(projectList);
    } catch (error) {
      console.error("Erreur de chargement:", error);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  // Sauvegarde d'un projet
  const handleProject = async (projectData, isUpdate) => {
    if (isProcessing) return;
    setIsProcessing(true);

    try {
      const projectToSave = {
        title: projectData.title.trim(),
        description: projectData.description.trim(),
        dueDate: projectData.dueDate,
        tasks: projectData.tasks || [],
        userId: auth.currentUser.uid,
        lastUpdated: new Date().toISOString()
      };

      if (isUpdate) {
        const projectRef = doc(db, 'projects', projectData.id);
        await updateDoc(projectRef, projectToSave);
        
        // Mise à jour optimiste de l'état local
        setProjects(prev => prev.map(p => 
          p.id === projectData.id ? { ...projectToSave, id: projectData.id } : p
        ));
      } else {
        const docRef = await addDoc(collection(db, 'projects'), projectToSave);
        
        // Mise à jour optimiste de l'état local
        setProjects(prev => [{ ...projectToSave, id: docRef.id }, ...prev]);
      }
      
      setShowForm(false);
      setEditingProject(null);
    } catch (error) {
      console.error("Error saving project:", error);
      // Rollback en cas d'erreur
      fetchProjects();
    } finally {
      setIsProcessing(false);
    }
  };

  // Gestion des tâches
  const handleTaskOperation = async (operation, projectId, taskData) => {
    if (isProcessing) return;
    setIsProcessing(true);

    try {
      const projectRef = doc(db, 'projects', projectId);
      
      // eslint-disable-next-line default-case
      switch (operation) {
        case 'TOGGLE':
          await updateDoc(projectRef, {
            tasks: arrayRemove(taskData),
            lastUpdated: new Date().toISOString()
          });
          await updateDoc(projectRef, {
            tasks: arrayUnion({ ...taskData, completed: !taskData.completed }),
            lastUpdated: new Date().toISOString()
          });
          break;
          
        case 'ADD':
          await updateDoc(projectRef, {
            tasks: arrayUnion(taskData),
            lastUpdated: new Date().toISOString()
          });
          break;
          
        case 'DELETE':
          await updateDoc(projectRef, {
            tasks: arrayRemove(taskData),
            lastUpdated: new Date().toISOString()
          });
          break;
      }

      // Mise à jour optimiste
      // eslint-disable-next-line array-callback-return
      setProjects(prev => prev.map(project => {
        if (project.id !== projectId) return project;
        
        // eslint-disable-next-line default-case
        switch (operation) {
          case 'TOGGLE':
            return {
              ...project,
              tasks: project.tasks.map(task => 
                task.id === taskData.id ? { ...task, completed: !task.completed } : task
              ),
              lastUpdated: new Date().toISOString()
            };
            
          case 'ADD':
            return {
              ...project,
              tasks: [...project.tasks, taskData],
              lastUpdated: new Date().toISOString()
            };
            
          case 'DELETE':
            return {
              ...project,
              tasks: project.tasks.filter(t => t.id !== taskData.id),
              lastUpdated: new Date().toISOString()
            };
        }
      }));
    } catch (error) {
      console.error(`Erreur ${operation} tâche:`, error);
      fetchProjects(); // Rollback
    } finally {
      setIsProcessing(false);
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

  if (loading) return <div className="loading">Loading...</div>;

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
              isProcessing={isProcessing}
            />
          </div>
        ) : projects.length === 0 ? (
          <div className="empty-state">
            <img src={clipboard} alt="Aucun projet" className="empty-state-img" />
            <p>Start by creating a new project</p>
            <button
              className="create-button"
              onClick={() => setShowForm(true)}
              disabled={isProcessing}
            >
              New Project
            </button>
          </div>
        ) : (
          <div className="projects-container">
            <div className="projects-header">
              <h1 className="projects-title">YOUR PROJECTS</h1>
              <div className="projects-buttons">
                <button
                  className="btn-brown"
                  onClick={() => {
                    setEditingProject(null);
                    setShowForm(true);
                  }}
                  disabled={isProcessing}
                >
                  + Add Project
                </button>
                <button
                  className="btn-secondary"
                  onClick={handleLogout}
                  disabled={isProcessing}
                >
                  Logout
                </button>
              </div>
            </div>

            {projects.map(project => (
              <div key={project.id} className="project-card">
                <div className="project-header">
                  <h2>{project.title}</h2>
                  {project.dueDate && (
                    <p className="project-date">
                      In {new Date(project.dueDate).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </p>
                  )}
                </div>

                <p className="project-description">
                  {project.description}
                </p>

                <div className="task-section">
                  <div className="task-section-header">
                    <h3>Tasks</h3>
                    <span className="task-count">
                      {project.tasks.filter(t => t.completed).length} / {project.tasks.length} Done
                    </span>
                  </div>
                  
                  {project.tasks.length > 0 ? (
                    <ul className="task-list">
                      {project.tasks.map(task => (
                        <li key={task.id} className="task-item">
                          <input
                            type="checkbox"
                            checked={task.completed}
                            onChange={() => handleTaskOperation('TOGGLE', project.id, task)}
                            disabled={isProcessing}
                          />
                          <span className={task.completed ? "completed-task" : ""}>
                            {task.text}
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="no-tasks">No tasks for this project</p>
                  )}
                  
                  <button
                    className="add-task-btn"
                    onClick={async () => {
                      const taskText = prompt("Entrez une nouvelle tâche");
                      if (taskText) {
                        const newTask = {
                          id: Date.now().toString(),
                          text: taskText,
                          completed: false
                        };
                        await handleTaskOperation('ADD', project.id, newTask);
                      }
                    }}
                    disabled={isProcessing}
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
                    disabled={isProcessing}
                  >
                    Modify
                  </button>
                  <button
                    className="delete-btn"
                    onClick={async () => {
                      if (window.confirm("Supprimer ce projet définitivement ?")) {
                        try {
                          await deleteDoc(doc(db, 'projects', project.id));
                          setProjects(projects.filter(p => p.id !== project.id));
                        } catch (error) {
                          console.error("Erreur de suppression:", error);
                        }
                      }
                    }}
                    disabled={isProcessing}
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