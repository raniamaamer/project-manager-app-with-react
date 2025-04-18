import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import LoginPage from './pages/LoginPage';  
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute'; 

function App() {
  return (
    <Router>
      <Routes>
        {/* Route publique - Page d'inscription */}
        <Route path="/signup" element={<AuthPage />} />
        
        {/* Route publique - Page de connexion */}
        <Route path="/login" element={<LoginPage />} />
        
        {/* Route protégée - Tableau de bord */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        
        {/* Redirection par défaut */}
        <Route path="/" element={<LoginPage />} />
      </Routes>
    </Router>
  );
}

export default App;