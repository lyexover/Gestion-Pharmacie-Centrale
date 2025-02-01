import { useState } from "react";
import './css/auth.css';

export default function Auth() {
  const [role, setRole] = useState('superAdmin');
  const [superAdminData, setSuperAdminData] = useState({ password: '' });
  const [gestionnaireStockData, setGestionnaireStockData] = useState({ email: '', password: '' });
  const [adminBaseData, setAdminBaseData] = useState({ email: '', password: '' });



  async function handleSuperAdminSubmit(e) {
    e.preventDefault();
    
    const formdata = role === 'superAdmin' ? superAdminData : role === 'gestionnaireStock' ? gestionnaireStockData : adminBaseData;

    try{
        const response = await fetch('http://localhost:3000/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formdata)
        })
    }
    catch(err){
        console.error(err)
    }
  }

  const renderForm = () => {
    switch (role) {
      case 'superAdmin':
        return superAdminForm();
      case 'gestionnaireStock':
        return gestionnaireStockForm();
      case 'adminBase':
        return adminBaseForm();
      default:
        return null;
    }
  };

  const superAdminForm = () => {
    return (
      <form onSubmit={handleSuperAdminSubmit} className="auth-form">
        <h3>Connexion Super Admin</h3>
        <div className="input-group">
          <input
            onChange={(e) => setSuperAdminData({ ...superAdminData, password: e.target.value })}
            type="password"
            required
            placeholder="Entrez la clé secrète.."
          />
        </div>
        <button type="submit" className="submit-btn">
          Se Connecter
        </button>
      </form>
    );
  };

  const gestionnaireStockForm = () => {
    return (
      <form onSubmit={handleSuperAdminSubmit} className="auth-form">
        <h3>Connexion Gestionnaire de Stock</h3>
        <div className="input-group">
          <input
            onChange={(e) => setGestionnaireStockData({ ...gestionnaireStockData, email: e.target.value })}
            type="email"
            required
            placeholder="Entrez Votre Email.."
          />
        </div>
        <div className="input-group">
          <input
            onChange={(e) => setGestionnaireStockData({ ...gestionnaireStockData, password: e.target.value })}
            type="password"
            required
            placeholder="Entrez la clé secrète.."
          />
        </div>
        <button type="submit" className="submit-btn">
          Se Connecter
        </button>
      </form>
    );
  };

  const adminBaseForm = () => {
    return (
      <form onSubmit={handleSuperAdminSubmit} className="auth-form">
        <h3>Connexion Admin de Base</h3>
        <div className="input-group">
          <input
            onChange={(e) => setAdminBaseData({ ...adminBaseData, email: e.target.value })}
            type="email"
            required
            placeholder="Entrez Votre Email.."
          />
        </div>
        <div className="input-group">
          <input
            onChange={(e) => setAdminBaseData({ ...adminBaseData, password: e.target.value })}
            type="password"
            required
            placeholder="Entrez la clé secrète.."
          />
        </div>
        <button type="submit" className="submit-btn">
          Se Connecter
        </button>
      </form>
    );
  };

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
        
        <div className="role-nav">
          <button 
            className={`role-btn ${role === 'superAdmin' ? 'active' : ''}`}
            onClick={() => setRole('superAdmin')}
          >
            Super-Admin
          </button>
          <button 
            className={`role-btn ${role === 'gestionnaireStock' ? 'active' : ''}`}
            onClick={() => setRole('gestionnaireStock')}
          >
            Gestionnaire-Stock
          </button>
          <button 
            className={`role-btn ${role === 'adminBase' ? 'active' : ''}`}
            onClick={() => setRole('adminBase')}
          >
            Admin-Base
          </button>
        </div>
        
        <div className="form-container">
          {renderForm()}
        </div>
      </div>
    </div>
  );
}