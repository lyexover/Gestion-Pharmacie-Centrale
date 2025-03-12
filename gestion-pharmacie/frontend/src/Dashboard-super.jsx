import React from 'react';
import Lots_stats from "./chart-components/Lots-stats";
import Lots_Nombre from "./chart-components/Lots-nombre";
import Produits_Nombre from "./chart-components/Produits-nombre";
import Commandes_stats from "./chart-components/Commandes-stats";
import './css/dashboard.css'

export default function Dashboard_super() {
  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <h1>Tableau de bord</h1>
        <p className="dashboard-subtitle">Vue d'ensemble de vos données</p>
      </header>
      
      <div className="dahsboard-container">
        {/* Première rangée - Cartes de statistiques */}
        <div className="stats-cards">
          <Produits_Nombre />
          <Lots_Nombre />
          <Lots_stats />
        </div>
        
        <div className="chart-wrapper commandes-chart">
          <Commandes_stats />
        </div>
      </div>
    </div>
  );
}