import { useState } from "react"
import { useRouteLoaderData } from "react-router-dom"
import { useAuth } from "./AuthContext"
import CommandeForm from './CommandeForm'
import './css/commande.css'


export default function MesCommandes(){

    const [navChoice, setNavChoice] = useState('commandes')
    const {user} = useAuth()
    const {commandes, produits} = useRouteLoaderData('parent')


    return (
        <div>
            <div className="commandes-header">
                <h1>Gestion des Commandes</h1>

                <div className="commandes-nav">
                    <button onClick={()=>setNavChoice('commandes')} >
                        Mes commandes
                    </button>
                    <button onClick={()=>setNavChoice('lancer commande')}>
                        Lancer Commande
                    </button>
                </div>
            </div>


            {
                navChoice === 'commandes' && (
                    <div className="mes-commandes">
                       <table>
                           <thead>
                              <tr>
                                  <th>ID</th>
                                  <th>Date</th>
                                  <th>Statut</th>
                                  <th>Actions</th>
                              </tr>
                           </thead>
                           <tbody>
                            {
                                commandes.length === 0 ? (
                                    <tr>
                                        <td>Aucune Commande a afficher</td>
                                    </tr>
                                ) : 
                                (
                                    commandes.map((commande, index) => {
                                        <tr key={index}>
                                             <td>{commande.id_commande}</td>
                                             <td>{commande.date_commande}</td>
                                             <td>{commande.statut}</td>
                                             <td><button>Details</button></td>
                                        </tr>


                                    })
                                )

                            }
                           </tbody>
                       </table>
                    </div>
                )
            }


            {
                navChoice === 'lancer commande' && (
                    <CommandeForm produits={produits} />
                )
            }


            
        </div>
    )
}