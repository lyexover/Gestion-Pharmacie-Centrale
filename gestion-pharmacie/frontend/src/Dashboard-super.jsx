import Lots_stats from "./chart-components/Lots-stats";
import Lots_Nombre from "./chart-components/Lots-nombre";
import Produits_Nombre from "./chart-components/Produits-nombre";
import './css/dashboard.css'

export default function Dashboard_super(){

    return (
        <div className="dahsboard-container">
          <Lots_stats/>
          <Lots_Nombre/>
          <Produits_Nombre/>
        </div>
    )

}