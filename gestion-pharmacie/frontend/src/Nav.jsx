import { useAuth } from "./AuthContext";
import { Link } from "react-router-dom";

export default function Nav() {
const {user, logout} = useAuth();     
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
                        <Link className="link" to={`/${user.role}/${fonctionalite.path}`}>{fonctionalite.label}</Link>
                    </li>
                ))
            }
        </ul>

        <button className="logout-btn" onClick={()=>logout()}><i class="fa-solid fa-right-from-bracket"></i> Se Deconnecter</button>
    </div>
)
}