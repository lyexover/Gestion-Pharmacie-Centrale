import { useRouteLoaderData, useRevalidator } from "react-router-dom";
import { useAuth } from "./AuthContext";
import React, { useMemo } from 'react';
import CommandesPerMonth from "./chart-components/CommandesPerMonth";
import CommandesStatus from "./chart-components/CommandesStatus";
import './css/dashboard.css';

export default function AdminDashboard() {
  const { commandes } = useRouteLoaderData('parent');
  const { user } = useAuth();
  const revalidator = useRevalidator();
  
  // Filter commandes to only keep those matching the user's region
  const filteredCommandes = useMemo(() => {
    return commandes.filter(commande => commande.id_region === user.region);
  }, [commandes, user.region]);
  
  console.log(filteredCommandes);
  
  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <div>
          <h1>Tableau de bord</h1>
          <p className="dashboard-subtitle">Vue d'ensemble de votre région</p>
        </div>
        <div className="dashboard-actions">
          <button onClick={() => revalidator.revalidate()} className="btn-refresh">Actualiser</button>
        </div>
      </header>
      
      <div className="dashboard-container">
        
        
        <div className="dashboard-charts-row">
          <div className="stats-summary">
            <div className="chart-wrapper">
              <CommandesStatus commandes={filteredCommandes} />
            </div>
          </div>
          <div className="chart-wrapper commandes-chart">
            <div className="chart-card">
              <h3 className="chart-title">Dernières commandes</h3>
              <div className="recent-commandes">
                <table className="commandes-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Date</th>
                      <th>Statut</th>
                      <th>Délai (jours)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCommandes.slice(0, 5).map(commande => (
                      <tr key={commande.id_commande}>
                        <td>{commande.id_commande}</td>
                        <td>{new Date(commande.date_commande).toLocaleDateString()}</td>
                        <td>
                          <span className={`status-badge ${commande.statut.replace(/\s+/g, '-')}`}>
                            {commande.statut}
                          </span>
                        </td>
                        <td>{commande.delai}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <div className="dashboard-top-row">
          <div className="chart-wrapper lots-chart">
            <CommandesPerMonth commandes={filteredCommandes} />
          </div>
          
        </div>
      </div>
    </div>
  );
}