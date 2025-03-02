import { useLocation } from "react-router-dom"
import Details_traitement from "./Details-traitement"
import './css/traitement.css'

export default function TraiterCommande(){

    const {commande} = useLocation().state

    return(
        <div className="traitement-container">
            <div className="left">
                <h1>traiter commande</h1>
            </div>
   
           <div className="right">
             <Details_traitement commande={commande}/>
            </div>
        </div>
    )
}