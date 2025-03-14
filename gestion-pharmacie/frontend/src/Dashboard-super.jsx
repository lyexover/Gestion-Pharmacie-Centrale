import React from 'react';
import Lots_stats from "./chart-components/Lots-stats";
import Lots_Nombre from "./chart-components/Lots-nombre";
import Produits_Nombre from "./chart-components/Produits-nombre";
import Commandes_stats from "./chart-components/Commandes-stats";
import LastCommandes from './chart-components/Last-commandes';
import './css/dashboard.css';
import { useRevalidator } from 'react-router-dom';

export default function Dashboard_super() {
const revalidator = useRevalidator()

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <div>
          <h1>Tableau de bord</h1>
          <p className="dashboard-subtitle">Vue d'ensemble de vos données</p>
        </div>
        <div className="dashboard-actions">
          <button onClick={()=>revalidator.revalidate()} className="btn-refresh">Actualiser</button>
        </div>
      </header>
      
      <div className="dashboard-container">
        {/* Première rangée - Cartes de statistiques et dernières commandes */}
        <div className="dashboard-top-row">
          <div className= "chart-wrapper lots-chart">
            <Lots_stats />
          </div>
          <LastCommandes />
        </div>
        
        {/* Deuxième rangée - Graphiques */}
        <div className="dashboard-charts-row">
          <div className="stats-summary">
            <Produits_Nombre />
            <Lots_Nombre />
          </div>
          <div className="chart-wrapper commandes-chart">
            <Commandes_stats />
          </div>
        </div>
      </div>
    </div>
  );
}