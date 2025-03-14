import React from "react";
import { useRouteLoaderData, Link } from "react-router-dom";
import { Calendar, MapPin } from "lucide-react"; // Import icons

export default function LastCommandes() {
  const { commandes } = useRouteLoaderData("parent");

  // Get status color based on status value
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "livrée":
        return "status-delivered";
      case "en cours de traitement":
        return "status-processing";
      case "en attente":
        return "status-pending";
      default:
        return "status-default";
    }
  };

  // Format date to be more readable
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <div className="last-commandes-card">
      <div className="card-header">
        <h3>Dernières Commandes</h3>
        <Link className="view-all" to='../commandes-super'>
          Voir tout
        </Link>
      </div>
      
      {commandes.length === 0 ? (
        <div className="no-data">Aucune commande récente</div>
      ) : (
        <div className="commandes-list">
          {commandes.slice(0, 4).map((commande, index) => (
            <div className="commande-item" key={index}>
              <div className="commande-info">
                <div className="commande-region">
                  <MapPin size={16} />
                  <span>{commande.nom_region}</span>
                </div>
                <div className={`commande-status ${getStatusColor(commande.statut)}`}>
                  {commande.statut}
                </div>
              </div>
              <div className="commande-date">
                <Calendar size={14} />
                <span>{formatDate(commande.date_commande)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}