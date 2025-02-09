export default function Card({data, type}){

    console.log(data, type)

    return (
        <div className="stock-card">
            <div className="stock-card-header">
                <h3 className="stock-card-title">{data.nom}</h3>
                <p className="stock-card-reference">Reference: {data.code_produit}</p>
            </div>
            
            <div className="stock-card-content">
                {type == 'produits' ? (
                    <div className="stock-card-product">
                        <p className="stock-card-info">{data.nom_classe}</p>
                        <p className="stock-card-info">{data.nom_type}</p>
                        <p className="stock-card-quantity">Quantite totale : {data.total_quantite}</p>
                    </div>
                ) : (
                    <div className="stock-card-lot">
                        <p className="stock-card-info">{data.nom_produit}</p>
                        <p className="stock-card-quantity">{data.quantite}</p>
                        <p className="stock-card-quantity">{data.quantite_disponible}</p>
                        <p className="stock-card-date">{data.date_peremption}</p>
                    </div>
                )}
            </div>
        </div>
    )
}