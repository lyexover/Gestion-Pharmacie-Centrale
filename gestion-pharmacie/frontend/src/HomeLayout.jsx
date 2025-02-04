import { Link, Outlet } from "react-router-dom"
export default function HomeLayout() {
    return (
        <div>
            <h1>Home Layout</h1>
            <Link to='/superAdmin/gestion-utilisateurs'>Link</Link>
            <Outlet/>
        </div>
        
    )
}