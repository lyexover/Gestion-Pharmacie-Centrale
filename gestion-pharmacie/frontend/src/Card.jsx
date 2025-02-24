import { Link, useRevalidator, Outlet } from "react-router-dom"
import { useAuth} from "./AuthContext"

import { useState } from "react"


export default function Card({data, type}){

   

    return (
        <div className="stock-card">
            <div className="stock-card-header">
                <div>
                  <h3 className="stock-card-title">{data.nom}</h3>
                  <p className="stock-card-reference">Reference: {data.code_produit}</p>
                </div>
                <div className="right">
                    <Link className="delete-btn" to={'confirmer-suppression'} state={{data, type}} ><i class="fa-solid fa-trash"></i></Link>
                    <Link to={ type === 'produits' ? 'ajouter-produit' : 'ajouter-Lot'} state={{data}} className='edit-btn'><i class="fa-solid fa-pen-to-square"></i></Link>
                </div>
            </div>
            
            <div className="stock-card-content">
                {type === 'produits' ? (
                    <div className="stock-card-product">
                        <p className="stock-card-info">{data.nom_classe}</p>
                        <p className="stock-card-info">{data.nom_type}</p>
                        <p className="stock-card-quantity">Quantite totale : {data.total_quantite}</p>
                    </div>
                ) : (
                    <div className="stock-card-lot">
    
                        <p className="stock-card-quantity">Quantite : {data.quantite_disponible}</p>
                        <p className="stock-card-date">Date peremption : {new Date(data.date_peremption).toLocaleDateString()}</p>
                    </div>
                )}
            </div>


          <Outlet/>

        </div>
    )
}