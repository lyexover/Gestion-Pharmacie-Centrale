import { useMemo } from 'react'
import './css/commande.css'
import { useRouteLoaderData, Link, Outlet } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from './AuthContext'

export default function Commandes_super(){

const {commandes} = useRouteLoaderData('parent')
const [selectedFilter, setSelectedFilter] = useState('')
const {user} = useAuth();


const filteredCommandes = useMemo(() => {
    return selectedFilter === ''
        ? commandes
        : commandes.filter(commande => commande.statut === selectedFilter);
}, [selectedFilter, commandes]); 


    return (
        <div className='supercommande-container'>
            <div className="supercommandes-header">
               <h1>Commandes reçues</h1>
            
              <select name="statut" onChange={(e)=>setSelectedFilter(e.target.value)} >
                <option value="">Choisir un filtre..</option>
                <option value="en attente">en attente</option>
                <option value="en cours de traitement">en cours de traitement</option>
                <option value="livrée">livrée</option>
              </select>
            </div>

            
                <div className="mes-commandes">
                 <table >
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Region</th>
                            <th>Date</th>
                            <th>Statut</th>
                            <th>Delai</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                       {
                        filteredCommandes.map((commande)=> (
                            <tr key={commande.id_commande} >
                                <td>{commande.id_commande}</td>
                                <td>{commande.nom_region}</td>
                                <td>{commande.date_commande.split('T')[0]}</td>
                                <td className={commande.statut === 'en attente' ? 'en-attente' : commande.statut === 'en cours de traitement' ? 'en-cours' : 'livree'} >
                                    {commande.statut}
                                </td>
                                <td>{commande.delai} jours</td>
                                <td>
                                  <Link to={'details'} className="details-btn" state={{commande}}>Details</Link>
                                  {user.role==='gestionnaire_stock' && <Link to={'../traiter-commande'} className="traiter-btn" state={{commande}}>Traiter</Link>}
                                </td>
                            </tr>
                        ))
                       }
                    </tbody>
                 </table>

            </div>
            
            <Outlet/>
        </div>
    )
}