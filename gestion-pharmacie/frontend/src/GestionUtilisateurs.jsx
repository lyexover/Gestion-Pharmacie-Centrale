import { useState } from "react"
import "./css/users.css"
import { useAuth } from "./AuthContext"
import { data, useLoaderData } from "react-router-dom";

export async function loader() {
  const token = localStorage.getItem("token");
  try {
    const response = await fetch("http://localhost:3000/api/users", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message);
    return data;
  } catch (err) {
    console.error(err);
    return [];
  }
}

export default function GestionUtilisateurs() {
  const initialUsers = useLoaderData();
  const [usersList, setUsersList] = useState(initialUsers);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: '',
    email: '',
    region: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      setUsersList([...usersList, data.user]);
      setFormData({ username: '', password: '', role: '', email: '', region: '' });
      setShowForm(false); // Cache le formulaire après l'ajout
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (userId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:3000/api/users/${userId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Échec de la suppression');
      console.log(data.message);
      setUsersList(usersList.filter(user => user.id !== userId));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="user-management">
      <h1 className="title">Gestion des utilisateurs</h1>
      
      <div className="actions-bar">
        <button 
          className="btn-primary add-user-btn" 
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Annuler' : 'Ajouter un utilisateur'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="user-form">
          <div className="form-grid">
            <div className="form-group">
              <label>Nom d'utilisateur</label>
              <input 
                name="username"
                type="text"
                required
                value={formData.username}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Mot de passe</label>
              <input 
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input 
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            
            <div className="form-group">
              <label>Rôle</label>
              <select 
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
              >
                <option value="">Sélectionner un rôle</option>
                <option value="superAdmin">Super Admin</option>
                <option value="gestionnaire_stock">Gestionnaire Stock</option>
                <option value="admin_base">Admin Base</option>
              </select>
            </div>

            <div className="form-group full-width">
              <label>Région</label>
              <select 
                name="region"
                value={formData.region}
                onChange={handleChange}
                required
              >
                <option value="">Sélectionner une région</option>
                <option value="1">Reghaia</option>
                <option value="2">Arzew</option>
                <option value="3">Skikda</option>
                <option value="4">Hassi Messaoud</option>
                <option value="5">Hassi Rmel</option>
              </select>
            </div>
          </div>
          <button type="submit" className="btn-primary">Ajouter un utilisateur</button>
        </form>
      )}

      <div className="users-table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Email</th>
              <th>Rôle</th>
              <th>Région</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {usersList.length === 0 ? (
              <tr>
                <td colSpan="5" className="no-users">Aucun utilisateur trouvé</td>
              </tr>
            ) : (
              usersList.map((user) => (
                <tr key={user.id}>
                  <td>{user.userName}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>{user.nom_region}</td>
                  <td>
                    <button 
                      onClick={() => handleDelete(user.id_utilisateur)}
                      className="btn-danger"
                    >
                      <i className="fa-solid fa-trash"></i> Supprimer
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}