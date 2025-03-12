import { useRouteLoaderData } from "react-router-dom"

export default function Lots_Nombre(){

const {lots} = useRouteLoaderData('parent')

return (
   <div className="card">
       <h5>Nombre de Lots en stock : </h5>
       <p>{lots.length}</p>
   </div>
)
}