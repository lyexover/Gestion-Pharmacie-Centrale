import { Link, Outlet } from "react-router-dom"
import './css/home.css'
import Nav from "./Nav"
import { useAuth } from "./AuthContext"


export default function HomeLayout() {
   const {user} = useAuth();

   return (
    <div className="home">
      <Nav/>
      <div className="home-content">
        
        <div className="home-main">
          <Outlet />
        </div>
      </div>
    </div>
  )
}