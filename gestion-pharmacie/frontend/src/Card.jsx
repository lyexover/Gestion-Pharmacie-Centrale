import { Link, useRevalidator } from "react-router-dom"
import { useAuth } from "./AuthContext"


export default function Card({data, type}){

    const {user} = useAuth()
    const revalidator = useRevalidator()


   async function handleDelete(){
 
        
        const route = type === 'produits' ? 'http://localhost:3000/api/products/delete' : 'http://localhost:3000/api/lot'
        const toSend = type === 'produits' ? {code_produit : data.code_produit} : {id_lot : data.id_lot , id_utilisateur : user.id ,  quantite_disponible : data.quantite_disponible }

        try {

                if(type === 'produits' && data.total_quantite == 0) throw new Error('Ce produit contient des lots')
                const response = await fetch(route , {
                    method : 'DELETE' , 
                     headers : {
                       'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                     } , 
                     body : JSON.stringify(toSend)
                })

                const responseData = await response.json()
                if(!response.ok){
                    throw new Error(responseData.message)
                }

                revalidator.revalidate()

        }
        catch(err){
            console.error(err)
        }
    }


    return (
        <div className="stock-card">
            <div className="stock-card-header">
                <div>
                  <h3 className="stock-card-title">{data.nom}</h3>
                  <p className="stock-card-reference">Reference: {data.code_produit}</p>
                </div>
                <div className="right">
                    <button className="delete-btn" onClick={()=>handleDelete(data)}><i class="fa-solid fa-trash"></i></button>
                    <Link className='edit-btn'><i class="fa-solid fa-pen-to-square"></i></Link>
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
        </div>
    )
}