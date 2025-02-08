import {Link, useLoaderData, Outlet} from 'react-router-dom';
import { useState } from 'react';
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
             <button className={selected === 'produits' ? 'active' : ''}  onClick={()=> setSelected('produits')}>Vue Produits</button>
             <button className={selected === 'lots' ? 'active' : ''}  onClick={()=> setSelected('lots')} >Vue Lots</button>
           </div>

           <div className="stock-content">
           {
             selected === 'produits' ? produits.map((produit, index) => <Card key={index} data={produit} type="produits" />) :
             lots.map((lot, index) => <Card key={index} data={lot} type="lots" />)
           }
           </div>

            <Outlet/>
        </div>
    )

}