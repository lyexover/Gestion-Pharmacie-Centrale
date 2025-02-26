import { Link, useRevalidator, Outlet } from "react-router-dom"
import { useAuth } from "./AuthContext"
import { useAlert } from "./AlertContext"
import { useState, useEffect } from "react"
import { SpaceIcon } from "lucide-react"

export default function Card({data, type}) {
   const {setStockAlert, setPerimeAlert} = useAlert();
   
   // Added variable to check if the product is expired
   const isExpired = type === 'lots' && Date.now() > new Date(data.date_peremption);
   const isLowStock = type === 'produits' && data.total_quantite < 10;
   
   useEffect(() => {
     // Check and set stock alert if necessary
     if (isLowStock) {
       setStockAlert(true);
     }
     
     // Check and set expiration alert if necessary
     if (isExpired) {
       setPerimeAlert(true);
     }
   }, [data, type, setStockAlert, setPerimeAlert, isLowStock, isExpired]);

    return (
        <div className={`stock-card ${isExpired ? 'perime-card' : ''}`}>
            <div className="stock-card-header">
                <div>
                  <h3 className="stock-card-title">{data.nom}</h3>
                  <p className="stock-card-reference">Reference: {data.code_produit}</p>
                </div>
                <div className="right">
                    <Link className="delete-btn" to={'confirmer-suppression'} state={{data, type}} ><i className="fa-solid fa-trash"></i></Link>
                    <Link to={ type === 'produits' ? 'ajouter-produit' : 'ajouter-Lot'} state={{data}} className='edit-btn'><i className="fa-solid fa-pen-to-square"></i></Link>
                </div>
            </div>
            
            <div className="stock-card-content">
                {type === 'produits' ? (
                    <div className="stock-card-product">
                        <p className="stock-card-info">{data.nom_classe}</p>
                        <p className="stock-card-info">{data.nom_type}</p>
                        <div className="quantite-container">
                        <p className="stock-card-quantity">Quantite totale : {data.total_quantite}</p>
                        {isLowStock && <span className="stock-alert" ><i className="fa-solid fa-triangle-exclamation"></i></span>}
                        </div>
                    </div>
                ) : (
                    <div className="stock-card-lot">
                        <p className="stock-card-quantity">Quantite : {data.quantite_disponible}</p>
                        <div className="perime-container">
                          <p className="stock-card-date">Date peremption : {new Date(data.date_peremption).toLocaleDateString()}</p>
                          {isExpired && <span className="perime-alert"><i className="fa-solid fa-xmark"></i></span>}
                        </div>
                    </div>
                )}
            </div>

          <Outlet/>
        </div>
    )
}