import { useState } from "react"
import { useRouteLoaderData, Link, Outlet } from "react-router-dom"
import { useAuth } from "./AuthContext"
import CommandeForm from './CommandeForm'
import './css/commande.css'


export default function MesCommandes(){

    const [navChoice, setNavChoice] = useState('commandes')
    const {user} = useAuth()
    const {commandes, produits} = useRouteLoaderData('parent')

    console.log(commandes , produits)

    return (
        <div>
            <div className="commandes-header">
                <h1>Gestion des Commandes</h1>

                <div className="commandes-nav">
                    <button className={navChoice==='commandes' ? 'active' : ''} onClick={()=>setNavChoice('commandes')} >
                        Mes commandes
                    </button>
                    <button className={navChoice==='lancer commande' ? 'active' : ''} onClick={()=>setNavChoice('lancer commande')}>
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
                                  <th>ID-Admin</th>
                                  <th>Date</th>
                                  <th>Statut</th>
                                  <th>Actions</th>
                              </tr>
                           </thead>
                           <tbody>
                            {
                                commandes.length === 0 ? (
                                    <tr>
                                        <td colSpan="5">Aucune Commande a afficher</td>
                                    </tr>
                                ) : 
                                (
                                    commandes.map((commande, index) => (
                                        <tr key={index}>
                                             <td>{commande.id_commande}</td>
                                             <td>{commande.id_admin_base}</td>
                                             <td>{commande.date_commande.split('T')[0]}</td>
                                             <td>{commande.statut}</td>
                                             <td className="action-buttons">
                                                <Link to={'details'} className="details-btn" state={{commande}}>Details</Link>
                                                {commande.notes && (
                                                    <Link 
                                                        to={'notes'} 
                                                        className="notes-btn"
                                                        state={{commande}}
                                                    >
                                                        Notes
                                                    </Link>
                                                )}
                                             </td>
                                        </tr>
                                    ))
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

            <Outlet/>
        </div>
    )
}