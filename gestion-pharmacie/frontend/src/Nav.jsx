import { useAuth } from "./AuthContext";
import { useAlert } from "./AlertContext"; // Ajout de l'import
import { Link, useLocation } from "react-router-dom";


export default function Nav() {

const {user, logout} = useAuth();     
const { stockAlert, perimeAlert } = useAlert(); // Récupération des états d'alerte
const pathname = useLocation().pathname.split('/')[2] ; 



const fonctionalites = {
    superAdmin : [
        {
            path : '' , 
            label : 'Dashboard' , 
            icon : <i class="fa-solid fa-chart-pie"></i>
        } , 
        {
            path : 'gestion-stock' , 
            label : 'Gestion Stock' , 
            icon : <i className="fa-solid fa-warehouse"></i>
        } , 
        {
            path : 'commandes-super' , 
            label : 'Mes Commandes' , 
            icon : <i class="fa-solid fa-truck-fast"></i>
        } 
        ,
        {
            path : 'gestion-utilisateurs' , 
            label : 'Gestion Utilisateurs' , 
            icon : <i class="fa-solid fa-users"></i>
        }
        
    ] , 
    gestionnaire_stock : [
        {
            path : '' , 
            label : 'Dashboard' , 
            icon : <i class="fa-solid fa-chart-pie"></i>
        } ,
        {
            path : 'gestion-stock' , 
            label : 'Gestion Stock' , 
            icon : <i className="fa-solid fa-warehouse"></i>
        } , 
        {
            path : 'commandes-super' , 
            label : 'Mes Commandes' , 
            icon : <i class="fa-solid fa-truck-fast"></i>
        } ,
    ] , 
    admin_base : [
        {
            path : 'mes-commandes' , 
            label : 'Mes Commandes' , 
            icon : <i class="fa-solid fa-truck-fast"></i>
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
                         className={`link ${pathname === fonctionalite.path ? 'active' : ''}`}
                          to={`/${user.role}/${fonctionalite.path}`}> 
                            <span className="icon">{fonctionalite.icon}</span> 
                            { fonctionalite.label}
                            {(stockAlert || perimeAlert) && fonctionalite.label === 'Gestion Stock' && (
                                <i className="fa-solid fa-circle alert-indicator"></i>
                            )}
                        </Link>
                    </li>
                ))
            }
        </ul>

        <button className="logout-btn" onClick={()=>logout()}><i class="fa-solid fa-right-from-bracket"></i> Se Deconnecter</button>
    </div>
)
}