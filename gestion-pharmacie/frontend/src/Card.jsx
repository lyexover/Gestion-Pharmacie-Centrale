export default function Card({data, type}){

    console.log(data, type)

    return (
        <div className="card">
            <h3>{data.nom}</h3>
            <p>Reference: {data.code_produit}</p>
            {
                type == 'produits' ? 
                (
                    <div>
                      <p>{data.nom_classe}</p>
                      <p>{data.nom_type}</p>
                      <p>{data.quantite_totale}</p>
                    </div>
                ) : 
                (
                    <div>
                      <p>{data.nom_produit}</p>
                      <p>{data.quantite}</p>
                      <p>{data.quantite_disponible}</p>
                      <p>{data.date_peremption}</p>
                    </div>
                )
            }
        </div>
    )
}