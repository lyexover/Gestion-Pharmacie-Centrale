import { Link, Outlet } from "react-router-dom"
import './css/home.css'
import Nav from "./Nav"
export default function HomeLayout() {
    return (
        <div className="home">
            <Nav/>
            <Outlet />
        </div>
        
    )
}