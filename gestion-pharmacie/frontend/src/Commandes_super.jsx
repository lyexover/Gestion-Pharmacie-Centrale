import './css/commande.css'

export default function Commandes_super(){



    return (
        <div className='supercommande-container'>
            <div className="supercommandes-header">
               <h1>Commandes reçues</h1>
            
              <select name="statut">
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

                    </tbody>
                 </table>

            </div>
            
        </div>
    )
}