import { useAuth } from "./AuthContext";
import { useAlert } from "./AlertContext";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";

export default function Nav() {
  const { user, logout } = useAuth();
  const { stockAlert, perimeAlert } = useAlert();
  const pathname = useLocation().pathname.split('/')[2];
  
  
  const [showLogoutMenu, setShowLogoutMenu] = useState(false);

  const fonctionalites = {
    superAdmin: [
      {
        path: '',
        label: 'Dashboard',
        icon: <i className="fa-solid fa-chart-pie"></i>
      },
      {
        path: 'gestion-stock',
        label: 'Gestion Stock',
        icon: <i className="fa-solid fa-warehouse"></i>
      },
      {
        path: 'commandes-super',
        label: 'Mes Commandes',
        icon: <i className="fa-solid fa-truck-fast"></i>
      },
      {
        path: 'gestion-utilisateurs',
        label: 'Gestion Utilisateurs',
        icon: <i className="fa-solid fa-users"></i>
      }
    ],
    gestionnaire_stock: [
      {
        path: '',
        label: 'Dashboard',
        icon: <i className="fa-solid fa-chart-pie"></i>
      },
      {
        path: 'gestion-stock',
        label: 'Gestion Stock',
        icon: <i className="fa-solid fa-warehouse"></i>
      },
      {
        path: 'commandes-super',
        label: 'Mes Commandes',
        icon: <i className="fa-solid fa-truck-fast"></i>
      }
    ],
    admin_base: [
      {
        path: "",
        label: 'Dashboard',
        icon: <i className="fa-solid fa-chart-pie"></i>
      },
      {
        path: 'mes-commandes',
        label: 'Mes Commandes',
        icon: <i className="fa-solid fa-truck-fast"></i>
      }
    ]
  };

  // Function to get user initials for avatar
  const getUserInitials = () => {
    if (!user || !user.userName) return "U";
    
    const nameParts = user.userName.split(" ");
    if (nameParts.length >= 2) {
      return `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase();
    }
    return user.userName.slice(0, 2).toUpperCase();
  };

  // Function to get role display name
  const getRoleDisplayName = () => {
    switch (user?.role) {
      case 'superAdmin':
        return 'Super Admin';
      case 'gestionnaire_stock':
        return 'Gestionnaire de Stock';
      case 'admin_base':
        return 'Admin Base';
      default:
        return 'Utilisateur';
    }
  };

  const handleSetClicked = (label) => {
    // If setClicked exists in your code, call it
    if (typeof setClicked === 'function') {
      setClicked(label);
    }
  };

  return (
    <div className="nav">
      <div className="nav-logo">
        <img src="/logo-white.png" alt="logo" />
        <h2>ENGTP</h2>
      </div>

      <ul>
        {fonctionalites[user.role].map((fonctionalite, index) => (
          <li key={index}>
            <Link 
              onClick={() => handleSetClicked(fonctionalite.label)}
              className={`link ${pathname === fonctionalite.path || (fonctionalite.path == '' && pathname == null)  ? 'active' : ''}`}
              to={`/${user.role}/${fonctionalite.path}`}
            >
              <span className="icon">{fonctionalite.icon}</span>
              {fonctionalite.label}
              {(stockAlert || perimeAlert) && fonctionalite.label === 'Gestion Stock' && (
                <i className="fa-solid fa-circle alert-indicator"></i>
              )}
            </Link>
          </li>
        ))}
      </ul>

      <div className="user-profile">
        <div 
          className="user-avatar"
          onClick={() => setShowLogoutMenu(!showLogoutMenu)}
        >
          {getUserInitials()}
        </div>
        <div className="user-info">
          <h4>{user.userName}</h4>
          <p>{getRoleDisplayName()}</p>
        </div>
        <div 
          className="profile-menu-toggle"
          onClick={() => setShowLogoutMenu(!showLogoutMenu)}
        >
          <i className={`fa-solid ${showLogoutMenu ? 'fa-chevron-up' : 'fa-chevron-down'}`}></i>
        </div>

        {showLogoutMenu && (
          <div className="profile-dropdown">
            <div className="dropdown-item">
              <i className="fa-solid fa-user"></i>
              <span>Profil</span>
            </div>
            <div className="dropdown-item">
              <i className="fa-solid fa-gear"></i>
              <span>Paramètres</span>
            </div>
            <div className="dropdown-divider"></div>
            <div className="dropdown-item logout" onClick={() => logout()}>
              <i className="fa-solid fa-right-from-bracket"></i>
              <span>Se Déconnecter</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}