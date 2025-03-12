import { useRouteLoaderData } from "react-router-dom"

export default function Produits_Nombre(){

const {produits} = useRouteLoaderData('parent')

return (
   <div className="nbr-produits">
       <h5>Nombre de produits en stock : </h5>
       <p>{produits.length}</p>
   </div>
)
}