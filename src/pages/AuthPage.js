import { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../services/firebaseConfig';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

export default function AuthPage() {
  const [email, setEmail] = useState(); 
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate('/dashboard'); 
    } catch (err) {
      setError(getErrorMessage(err.code));
    }
  };

  
  const getErrorMessage = (code) => {
    const errors = {
      'auth/email-already-in-use': 'Cet email est déjà utilisé',
      'auth/invalid-email': 'Email invalide (vérifiez le @)',
      'auth/weak-password': '6 caractères minimum requis',
      'auth/network-request-failed': 'Problème de connexion Internet',
      'default': `Erreur technique (${code})`
    };
    return errors[code] || errors['default'];
  };

  return (
    <div style={{ maxWidth: '400px', margin: '2rem auto', padding: '1rem' }}>
      <h1>Inscription</h1>
      
      {error && (
        <div style={{ 
          color: 'red', 
          backgroundColor: '#FFEBEE',
          padding: '10px',
          borderRadius: '4px',
          marginBottom: '1rem'
        }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', fontSize: '16px' }}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>Mot de passe</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength="6"
            style={{ width: '100%', padding: '8px', fontSize: '16px' }}
          />
        </div>

        <button 
          type="submit"
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: '#5D4037',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontSize: '16px',
            cursor: 'pointer'
          }}
        >
          S'inscrire
        </button>
      </form>

      <p style={{ marginTop: '1rem', textAlign: 'center' }}>
        Déjà un compte ?{' '}
        <Link to="/login" style={{ color: '#5D4037', textDecoration: 'underline' }}>Se connecter</Link>
      </p>
    </div>
  );
}