import { useRouteLoaderData, useLocation, useNavigate } from "react-router-dom";
import { X } from "lucide-react";

export default function DetailsCommande() {
    const { commande } = useLocation().state || {};
    const { commandeProduits } = useRouteLoaderData('parent');
    const navigate = useNavigate();

    // Filtrer les produits de la commande
    const produitsCommande = commandeProduits.filter(
        produit => produit.id_commande === commande.id_commande
    );

    return (
        <div className="details-overlay">
            <div className="details-container">
                <button 
                    className="close-button"
                    onClick={() => navigate(-1)}
                >
                    <X size={24} />
                </button>

                <div className="commande-header">
                    <h2>Détails de la Commande</h2>
                    <div className="commande-info">
                        <p>Commande N° : <span>{commande.id_commande}</span></p>
                        <p>Date : <span>{new Date(commande.date_commande).toLocaleDateString()}</span></p>
                        <p>Statut : <span className={`status ${commande.statut.toLowerCase()}`}>
                            {commande.statut}
                        </span></p>
                    </div>
                </div>

                <div className="produits-list">
                    <h3>Produits Commandés</h3>
                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Code Produit</th>
                                    <th>Nom</th>
                                    <th>Quantité</th>
                                </tr>
                            </thead>
                            <tbody>
                                {produitsCommande.map((produit, index) => (
                                    <tr key={index}>
                                        <td>{produit.code_produit}</td>
                                        <td>{produit.nom}</td>
                                        <td>{produit.quantite_commande}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}