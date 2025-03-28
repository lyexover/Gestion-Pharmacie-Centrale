import { useState } from "react";
import { useNavigate } from "react-router-dom";
import './css/auth.css';
import { useAuth } from "./AuthContext";
import {jwtDecode} from 'jwt-decode';

export default function Auth() {
  
  const [formData, setFormData] = useState({ userName: '', password: '' });
  const {login} = useAuth();
  const navigate = useNavigate();



  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();

      if (response.ok && data.token) {
        console.log(data.message)
        login(data.token);
        const decoded = jwtDecode(data.token);
        navigate(`/${decoded.role}`);
        
      } else {
        // Handle login errors
        console.error(data.message);
      }
    } catch(err) {
      console.error('Login error:', err);
    }
  }

  

  return (
    <div className="auth-container">
      <div className="auth-header">
        <div className="logo-section">
          <img src="/logo-white.png" alt="Logo" className="logo" />
          <h2>ENGTP</h2>
        </div>
        <div className="header-text">
          <span>Entreprise Nationale des Grands Travaux Pétroliers</span>
        </div>
      </div>
      
      <div className="auth-content">
        <h1 className="main-title">Plateforme de gestion de la Pharmacie centrale</h1>
        
        <div className="form-container">
        <form onSubmit={handleSubmit} className="auth-form">
        <h3>Connexion</h3>
        <div className="input-group">
          <input
            onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
            type="text"
            required
            placeholder="Entrez Votre UserName.."
          />
        </div>
        <div className="input-group">
          <input
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            type="password"
            required
            placeholder="Entrez la clé secrète.."
          />
        </div>
        <button type="submit" className="submit-btn">
          Se Connecter
        </button>
      </form>
        </div>
      </div>
    </div>
  );
}