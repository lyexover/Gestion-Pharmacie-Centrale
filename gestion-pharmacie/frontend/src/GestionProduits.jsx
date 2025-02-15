import {Link, useRouteLoaderData, Outlet, useRevalidator} from 'react-router-dom';
import { useState, useEffect } from 'react';
import Card from './Card';
import './css/produits.css'


export default function GestionProduits(){

    
    const [selected, setSelected] = useState('produits');
    const {produits, lots} = useRouteLoaderData('parent');
    const [search, setSearch] = useState('');
    const [filteredProduits, setFilteredProduits] = useState(selected === 'produits' ? produits : lots);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;
    const totlalPages = Math.ceil(filteredProduits.length / itemsPerPage);

    


   
    useEffect(() => {
   
        const filtered = selected === 'produits' ? 
        produits.filter(produit => produit.nom.toLowerCase().includes(search.toLowerCase())) :
        lots.filter(lot => lot.nom.toLowerCase().includes(search.toLowerCase()));
        setFilteredProduits(filtered);

    } , [search, selected, produits, lots]);


    const indexOfLastItem = currentPage * itemsPerPage - 1 ;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage + 1;
    const currentItems = filteredProduits.slice(indexOfFirstItem, indexOfLastItem + 1);


    return (
        <div className='stock-container' >
           <div className="stock-header">
                <h1>Gestion du Stock</h1>
                <div className="actions">
                    <Link to='ajouter-produit'><i class="fa-solid fa-plus"></i> Nouveau Produit</Link>
                    <Link to='ajouter-Lot' ><i class="fa-solid fa-plus"></i> Nouveau Lot</Link>
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
              currentItems.map((produit, index) => <Card key={index} data={produit} type={selected} />) 
           }
           </div>


           <div className="stock-pagination">
                
                {
                    [...Array(totlalPages)].map((_, index) => (
                        <button 
                            key={index}
                            className={currentPage === index + 1 ? 'active' : ''}
                            onClick={() => setCurrentPage(index + 1)}
                        >
                            {index + 1}
                        </button>
                    ))
                }

           </div>

            <Outlet/>
        </div>
    )

}