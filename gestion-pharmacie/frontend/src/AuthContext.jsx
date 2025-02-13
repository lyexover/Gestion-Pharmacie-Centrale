import { useContext, createContext, useState, useEffect } from "react";
import {jwtDecode} from 'jwt-decode';

const AuthContext = createContext();

export const AuthProvider = ({children})=> {
const [token, setToken] = useState(localStorage.getItem('token') || null);
const [user, setUser] = useState(null);


useEffect(() => {
  if(token){
 const decoded = jwtDecode(token);
  if(decoded.exp * 1000 > Date.now()) {
    setUser({
             id: decoded.id,
            userName: decoded.userName,
            role: decoded.role , 
            region: decoded.region
    });

  }
  else {
    logout() ; 
  } }
}, [token])


const login= (newToken)=> {
setToken(newToken);
localStorage.setItem('token', newToken);
}

const logout = ()=> {
setToken(null);
setUser(null);
localStorage.removeItem('token');
}


return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );

}

export const useAuth = () => useContext(AuthContext);
