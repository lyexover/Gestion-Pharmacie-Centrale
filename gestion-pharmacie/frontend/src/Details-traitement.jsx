import { useRouteLoaderData } from "react-router-dom"

export default function Details_traitement({commande}){

    const {commandeProduits} = useRouteLoaderData('parent')
    const produits = commandeProduits.filter(produit => produit.id_commande === commande.id_commande)


    return(
        <div className='details-traitement'>
            <div className="head">
              <h2>Details de la commande #CMD-{commande.id_commande}</h2>
              <p>Date de la commande : {commande.date_commande.split('T')[0]}</p>
              <p>Region : {commande.nom_region}</p>
              <p>Statut : {commande.statut}</p>
           </div>

           <div className="Articles-Commandes">
               <h2>Produits Commandés</h2>
               <div className="articles">
                {
                     produits.map((produit, index) => (
                        <div key={index} className="article">
                            <div className="icone">
                              <i class="fa-solid fa-prescription-bottle-medical"></i>
                            </div>
                            <div className="content">
                                <p>{produit.code_produit}</p>
                                <p>{produit.nom}</p>
                                <p>Quantité : {produit.quantite_commande}</p>
                            </div>
                        </div>
                     ))
                }
               </div>
           </div>

           
        </div>
    )
}