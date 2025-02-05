import { useAuth } from "./AuthContext";
import { Link } from "react-router-dom";
import { useState } from "react";

export default function Nav() {
const {user, logout} = useAuth();     
const [clicked, setClicked] = useState('');
console.log(clicked)

const fonctionalites = {
    superAdmin : [
        {
            path : 'gestion-utilisateurs' , 
            label : 'Gestion Utilisateurs'
        }
    ] , 
    gestionnaire_stock : [
        {
            path : 'gestion-stock' , 
            label : 'Gestion Stock'
        }
    ] , 
    admin_base : [
        {
            path : 'mes-commandes' , 
            label : 'Mes Commandes'
        }
    ]
}



return (
    <div className="nav">
        <div className="nav-logo">
            <img src="/logo-white.png" alt="logo" />
            <h2>ENGTP</h2>
        </div>

        <ul>
            {
                fonctionalites[user.role].map((fonctionalite, index) => (
                    <li key={index}>
                        <Link onClick={()=>setClicked(fonctionalite.label)}
                         className={`link ${clicked === fonctionalite.label ? 'active' : ''}`}
                          to={`/${user.role}/${fonctionalite.path}`}>{fonctionalite.label}</Link>
                    </li>
                ))
            }
        </ul>

        <button className="logout-btn" onClick={()=>logout()}><i class="fa-solid fa-right-from-bracket"></i> Se Deconnecter</button>
    </div>
)
}