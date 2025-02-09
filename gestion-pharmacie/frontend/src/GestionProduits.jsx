import {Link, useLoaderData, Outlet, useRevalidator} from 'react-router-dom';
import { useState, useEffect } from 'react';
import Card from './Card';
import './css/produits.css'


export async function loader(){
    try {
        const response = await fetch('http://localhost:3000/api/products' , 
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            }
        );
        if (!response.ok) {
            
            throw new Error();
        }
        const data = await response.json();
       
        return {produits : data.produits , lots : data.lots}  ; 
    }
    catch(err){
        console.log(err);
        return { produits: [], lots: [] };
    }
}


export default function GestionProduits(){

    
    const [selected, setSelected] = useState('produits');
    const {produits, lots} = useLoaderData();
    const [search, setSearch] = useState('');
    const [filteredProduits, setFilteredProduits] = useState(selected === 'produits' ? produits : lots);

    useEffect(() => {
   
        const filtered = selected === 'produits' ? 
        produits.filter(produit => produit.nom.toLowerCase().includes(search.toLowerCase())) :
        lots.filter(lot => lot.nom_produit.toLowerCase().includes(search.toLowerCase()));
        setFilteredProduits(filtered);

    } , [search, selected, produits, lots]);

    return (
        <div className='stock-container' >
           <div className="stock-header">
                <h1>Gestion du Stock</h1>
                <div className="actions">
                    <Link to='ajouter-produit'><i class="fa-solid fa-plus"></i> Nouveau Produit</Link>
                    <Link><i class="fa-solid fa-plus"></i> Nouveau Lot</Link>
                </div>
           </div>

           <div className="stock-nav">
    <div className="search-container">
        <i className="fa-solid fa-search"></i>
        <input 
            type="text" 
            placeholder="Rechercher un produit..."
            onChange={(e) => setSearch(e.target.value)}
        />
    </div>
    <div className="nav-group">
        <button className={selected === 'produits' ? 'active' : ''} onClick={() => setSelected('produits')}>Vue Produits</button>
        <button className={selected === 'lots' ? 'active' : ''} onClick={() => setSelected('lots')}>Vue Lots</button>
    </div>
</div>

           <div className="stock-content">
           {
             selected === 'produits' ? filteredProduits.map((produit, index) => <Card key={index} data={produit} type="produits" />) :
             lots.map((lot, index) => <Card key={index} data={lot} type="lots" />)
           }
           </div>

            <Outlet/>
        </div>
    )

}