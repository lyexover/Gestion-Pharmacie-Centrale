import { useLocation, useRouteLoaderData } from "react-router-dom"
import Details_traitement from "./Details-traitement"
import './css/traitement.css'
import { useMemo } from "react"

export default function TraiterCommande(){

    const {commande} = useLocation().state
    const {commandeProduits, lots} = useRouteLoaderData('parent')
    const produits = commandeProduits.filter(produit => produit.id_commande === commande.id_commande)

    const produits_id = useMemo(()=> produits.map(produit => produit.code_produit), [produits] ) // liste des id des produits commandés
    const produits_lots = useMemo(()=> 
    {
                return lots
                    .filter(lot => produits_id.includes(lot.code_produit))
                    .sort((a, b)=> new Date(a.date_peremption) - new Date(b.date_peremption))
    } , [lots, produits_id]
    )  // liste des lots des produits commandés

 
        
    return(
        <div className="traitement-container">
            <div className="left">
                <h1>traiter commande</h1>
                <div className="lots-commande">
                    
                    <div className="lots">
                        {
                            produits_lots.map((lot, index) => (
                                <div key={index} className="lot">
                                    
                                    <div className="content">
                                        <p>Produit : {lot.nom}</p>
                                        <p>Quantité : {lot.quantite_disponible}</p>
                                        <p>Expire le : {lot.date_peremption.split('T')[0]}</p>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>
   
           <div className="right">
             <Details_traitement commande={commande} produits={produits}/>
            </div>
        </div>
    )
}