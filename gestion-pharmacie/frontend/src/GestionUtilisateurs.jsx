import { useState } from "react"
import "./css/users.css"

export default function GestionUtilisateurs() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: '',
    email: '',
    region: ''
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }


  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch('http://localhost:5000/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.message)
      }
      console.log('Successfully created user')
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="user-management">
      <h1 className="title">Gestion des utilisateurs</h1>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="label">Nom d'utilisateur</label>
          <input 
            className="input-field"
            name="username"
            type="text"
            required
            value={formData.username}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label className="label">Mot de passe</label>
          <input 
            className="input-field"
            name="password"
            type="password"
            required
            value={formData.password}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label className="label">Email</label>
          <input 
            className="input-field"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        
        <div className="form-group">
          <label className="label">Rôle</label>
          <select 
            className="input-field select-field"
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

        <div className="form-group">
          <label className="label">Région</label>
          <select 
            className="input-field select-field"
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
        <button type="submit">Ajouter</button>
      </form>
    </div>
  )
}