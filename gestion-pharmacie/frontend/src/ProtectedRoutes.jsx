import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext";



export const ProtectedRoute = () => {
    const {user} = useAuth();
   
    if(!user){
       return <Navigate to="/login" replace/>
    }

    return <Outlet/>
}

export const RequireRole = ({allowedRoles}) => {
    const {user} = useAuth();

    if(!allowedRoles.includes(user.role)){
        return <Navigate to={`/${user.role}`} replace/>
    }

    return <Outlet/>
}