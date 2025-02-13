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




export async function loader() {
  const token = localStorage.getItem('token');

  try {
      const [productsResponse, commandesResponse] = await Promise.all([
          fetch('http://localhost:3000/api/products', {
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`
              }
          }),
          fetch('http://localhost:3000/api/commandes', {
              headers: {
                  'Authorization': `Bearer ${token}`
              }
          })
      ]);

      if (!productsResponse.ok || !commandesResponse.ok) {
          throw new Error('Échec du chargement des données');
      }

      const [productsData, commandesData] = await Promise.all([
          productsResponse.json(),
          commandesResponse.json()
      ]);

      return {
          produits: productsData.produits || [],
          lots: productsData.lots || [],
          commandes: commandesData || []
      };

  } catch (err) {
      console.error(err);
      return {
          produits: [],
          lots: [],
          commandes: []
      };
  }
}
