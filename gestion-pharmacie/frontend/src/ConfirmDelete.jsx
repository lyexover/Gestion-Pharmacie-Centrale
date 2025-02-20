import { Link, useRevalidator, useLocation, useNavigate } from "react-router-dom"
import { useAuth} from "./AuthContext"

export default function ConfirmDelete(){

    const {user} = useAuth()
    const revalidator = useRevalidator()
    const location = useLocation()
    const {data, type} = location.state
    const navigate = useNavigate()
  

   async function handleDelete(){
 
        
        const route = type === 'produits' ? 'http://localhost:3000/api/products/delete' : 'http://localhost:3000/api/lot'
        const toSend = type === 'produits' ? {code_produit : data.code_produit} : {id_lot : data.id_lot , id_utilisateur : user.id ,  quantite_disponible : data.quantite_disponible }

        try {

                if(type === 'produits' && data.total_quantite > 0) throw new Error('Ce produit contient des lots')
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
                navigate(-1)
               

        }
        catch(err){
            console.error(err)
        }
    }



return (
      <div className="delete-modal">

        <div className="delete-container">
            <h2>Supprimer {data.nom}?</h2>
            <div className="delete-modal-buttons">
                <button className="submit-button" onClick={()=>handleDelete()}>Confirmer</button>
                <button className="cancel-button" onClick={()=>navigate(-1)}>Annuler</button>
            </div>
       </div>   
      </div>
)

}