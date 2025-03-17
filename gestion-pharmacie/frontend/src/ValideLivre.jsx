import { useLocation, useRevalidator, useNavigate } from "react-router-dom"

export default function ValideLivre(){

    const {id} = useLocation().state
    const navigate = useNavigate()

    const revalidator = useRevalidator()

    async function handleConfirmer(id){
           try {
            const response = await fetch('http://localhost:3000/api/modifierStatut', {
                method : 'PATCH', 
                headers : {
                    "Content-Type" : "application/json"
                } , 
                body : JSON.stringify({id : id})
            }) 

            const data = await response.json()
            console.log(data.message)
            revalidator.revalidate()
            navigate(-1)

           }

           catch(err){
            console.log(err)
           }
   }



    return (
         <div className="details-overlay">
            <div className="valide-container">
                <h2>Mettre la commande {id} comme Livrée ?</h2>
                <div className="livre-buttons">
                    <button onClick={()=> handleConfirmer(id)} >Confirmer</button>
                    <button onClick={()=>navigate(-1)}>Annuler</button>
                </div>
            </div>
         </div>
    )
}