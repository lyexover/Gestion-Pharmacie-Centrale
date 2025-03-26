import { useLocation, useRouteLoaderData, useNavigate, Outlet } from "react-router-dom";
import Details_traitement from "./Details-traitement";
import './css/traitement.css';
import { useEffect, useMemo, useState } from "react";
import { generateCommandePdf } from "./GenerateCommandePdf";
import { Link } from "react-router-dom";

export default function TraiterCommande() {
    const { commande } = useLocation().state;
    const { commandeProduits, lots } = useRouteLoaderData('parent');
    const navigate = useNavigate();

    console.log(commande)

    const produits = useMemo(() => 
        commandeProduits.filter(produit => produit.id_commande === commande.id_commande),
        [commandeProduits, commande.id_commande]
    );

    console.log(commande, produits)


    // Ajoutez cette fonction dans votre composant
const traiterCommande = async () => {
    try {
        // Préparer les données à envoyer au backend
        const lotsAModifier = Object.entries(lotSelections).map(([id_lot, quantite]) => ({
            id_lot: parseInt(id_lot),
            quantite: quantite
        }));
        
        // Vérifier s'il y a des lots à traiter
        if (lotsAModifier.length === 0) {
            alert("Aucun lot sélectionné pour le traitement.");
            return;
        }
        
        // Envoyer les données au backend
        const response = await fetch('http://localhost:3000/api/traiter-commande', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id_commande: commande.id_commande,
                lots: lotsAModifier
            })
        });
        
        if (!response.ok) {
            throw new Error(`Erreur: ${response.status}`);
        }
        
        const result = await response.json();
        
        // Traiter la réponse
        if (result.success) {
            generateCommandePdf(commande, produits, traitement_data, produits_lots);

            alert("Commande traitée avec succès!");
            navigate('/gestionnaire_stock/commandes-super');
        } else {
            alert(`Erreur lors du traitement: ${result.message}`);
        }
    } catch (error) {
        console.error("Erreur lors du traitement de la commande:", error);
        alert("Une erreur est survenue lors du traitement de la commande.");
    }
};

    const produits_id = useMemo(() => 
        produits.map(produit => produit.code_produit), 
        [produits]
    );
    
    // Lots disponibles pour cette commande
    const produits_lots = useMemo(() => {
        return lots
            .filter(lot => produits_id.includes(lot.code_produit))
            .sort((a, b) => new Date(a.date_peremption) - new Date(b.date_peremption));
    }, [lots, produits_id]);
    
    // État pour suivre les quantités sélectionnées par lot
    const [lotSelections, setLotSelections] = useState({});
    
    // Initialisation automatique des lots et quantités
    useEffect(() => {
        const selections = {};
        
        // Traiter chaque produit commandé
        produits.forEach(produit => {
            let resteATraiter = produit.quantite_commande;
            
            // Filtrer les lots pour ce produit et les parcourir
            produits_lots
                .filter(lot => lot.code_produit === produit.code_produit)
                .forEach(lot => {
                    if (lot.quantite_disponible > 0 && resteATraiter > 0) {
                        // Quantité à prélever de ce lot
                        const quantitePrelevee = Math.min(lot.quantite_disponible, resteATraiter);
                        
                        // Enregistrer la sélection
                        selections[lot.id_lot] = quantitePrelevee;
                        
                        // Réduire la quantité restante à traiter
                        resteATraiter -= quantitePrelevee;
                    }
                });
        });
        
        // Mettre à jour l'état
        setLotSelections(selections);
        console.log("Initialisation automatique:", selections);
    }, [produits, produits_lots]);

    console.log(lotSelections);
    
    // Construire les données de traitement à partir des sélections de lots
    const traitement_data = useMemo(() => {
        return Object.entries(lotSelections).map(([id_lot, quantite]) => {
            const lot = produits_lots.find(l => l.id_lot == id_lot);
            if (!lot || quantite <= 0) return null;
            
            return {
                id_lot: parseInt(id_lot),
                code_produit: lot.code_produit,
                quantite
            };
        }).filter(Boolean); // Filtre les entrées nulles
    }, [lotSelections, produits_lots]);
    

    
    // Fonction pour augmenter la quantité d'un lot
    const augmenterQuantite = (lot) => {
        const quantiteActuelle = lotSelections[lot.id_lot] || 0;
        
        if (quantiteActuelle < lot.quantite_disponible) {
            setLotSelections(prev => ({
                ...prev,
                [lot.id_lot]: quantiteActuelle + 1
            }));
            console.log(`Augmenté lot ${lot.id_lot} à ${quantiteActuelle + 1}`);
        }
    };
    
    // Fonction pour diminuer la quantité d'un lot
    const diminuerQuantite = (lot) => {
        const quantiteActuelle = lotSelections[lot.id_lot] || 0;
        
        if (quantiteActuelle > 0) {
            setLotSelections(prev => ({
                ...prev,
                [lot.id_lot]: quantiteActuelle - 1
            }));
            console.log(`Diminué lot ${lot.id_lot} à ${quantiteActuelle - 1}`);
        }
    };
    
   
    
    return (
        <div className="traitement-container">
            <div className="left">
                <div className="head">
                  <h1>Traiter commande</h1>

                <div className="traitement-actions-container" >
                  <Link  
                      className={`note-btn ${commande.notes ? 'disabledNotes' : ''}`} 
                      state={{commande : commande}} 
                      to={'ajouter-note'}
                      {...(commande.notes ? { 'aria-disabled': 'true' } : {})}
                  >
                      + Note
                  </Link>

                      <button 
                          className="valider-btn" 
                         onClick={traiterCommande}
                          disabled={traitement_data.length === 0}
                      >
                          Valider le traitement
                      </button>
                </div>
  
                </div>
                <div className="lots-commande">
                    <div className="lots">
                        {produits_lots.map((lot, index) => (
                            <div key={lot.id_lot} className="lot">
                                <div className="content">
                                    <p>Produit : {lot.nom}</p>
                                    <p>Quantité Disponible : {lot.quantite_disponible}</p>
                                    <p>Expire le : {lot.date_peremption.split('T')[0]}</p>
                                </div>

                                <div className="qauntite-btns">
                                    <button 
                                        onClick={() => diminuerQuantite(lot)}
                                        disabled={(lotSelections[lot.id_lot] || 0) <= 0}
                                    >
                                        -
                                    </button>
                                    <p>{lotSelections[lot.id_lot] || 0}</p>
                                    <button 
                                        onClick={() => augmenterQuantite(lot)}
                                        disabled={(lotSelections[lot.id_lot] || 0) >= lot.quantite_disponible}
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    
                </div>
            </div>
   
            <div className="right">
                <Details_traitement 
                    commande={commande} 
                    produits={produits} 
                    traitement_data={traitement_data}
                />
            </div>

            <Outlet/>
        </div>
    );






}






