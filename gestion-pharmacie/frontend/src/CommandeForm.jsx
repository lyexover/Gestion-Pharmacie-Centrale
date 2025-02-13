import { useState } from 'react';
import './css/commande.css';

export default function CommandeForm({ produits }) {
    const [step, setStep] = useState(1);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [delai, setDelai] = useState('');


    const itemsPerPage = 16; // Nombre de produits par page
    const [currentPage, setCurrentPage] = useState(1);
    
    // Calculer les indices de début et fin pour la pagination
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentProduits = produits.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(produits.length / itemsPerPage);



    const handleQuantityChange = (produit, change) => {
        const maxQuantity = produit.total_quantite - 10;
        
        const existingProduct = selectedProducts.find(p => p.code_produit === produit.code_produit);
        if (existingProduct) {
            const newQuantity = Math.max(0, Math.min(maxQuantity, existingProduct.quantite + change));
            if (newQuantity === 0) {
                setSelectedProducts(prev => prev.filter(p => p.code_produit !== produit.code_produit));
            } else {
                setSelectedProducts(prev => prev.map(p => 
                    p.code_produit === produit.code_produit 
                    ? {...p, quantite: newQuantity}
                    : p
                ));
            }
        } else if (change > 0) {
            setSelectedProducts(prev => [...prev, {
                ...produit,
                quantite: 10
            }]);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle submission logic here
        console.log({
            products: selectedProducts,
            delai: parseInt(delai)
        });
    };

    const nextStep = () => {
        if ((step === 1 && selectedProducts.length > 0) || 
            (step === 2 && delai)) {
            setStep(prev => prev + 1);
        }
    };

    const prevStep = () => {
        setStep(prev => prev - 1);
    };

    return (
        <div className="commande-form">
            <div className="steps-indicator">
                {[1, 2, 3].map(num => (
                    <div key={num} className={`step ${step >= num ? 'active' : ''}`}>
                        {num}
                    </div>
                ))}
            </div>

            {step === 1 && (
                <>
                <div className="products-grid">
                    {currentProduits.map(produit => (
                        <div key={produit.code_produit} className="product-card">
                            <h3>{produit.nom}</h3>
                            <p>Code: {produit.code_produit}</p>
                            <p>Type: {produit.nom_type}</p>
                            <p>Quantité disponible: {produit.total_quantite}</p>
                            
                            <div className="quantity-controls">
                                {selectedProducts.find(p => p.code_produit === produit.code_produit) ? (
                                    <>
                                        <button 
                                            type="button"
                                            onClick={() => handleQuantityChange(produit, -10)}
                                        >
                                            -
                                        </button>
                                        <span>
                                            {selectedProducts.find(p => p.code_produit === produit.code_produit)?.quantite || 0}
                                        </span>
                                        <button 
                                            type="button"
                                            onClick={() => handleQuantityChange(produit, 10)}
                                            disabled={ selectedProducts.find(p => p.code_produit === produit.code_produit)?.quantite >= produit.total_quantite - 10}
                                        >
                                            +
                                        </button>
                                    </>
                                ) : (
                                    <button 
                                        type="button" 
                                        className="add-button"
                                        onClick={() => handleQuantityChange(produit, 10)}
                                        disabled ={produit.total_quantite == 0 }
                                    >
                                        +
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="pagination">
            {[...Array(totalPages)].map((_, index) => (
                <button
                    key={index}
                    onClick={() => setCurrentPage(index + 1)}
                    className={currentPage === index + 1 ? 'active' : ''}
                >
                    {index + 1}
                </button>
            ))}
        </div>

                </>
            )}

            {step === 2 && (
                <div className="delai-container">
                    <h2>Définir le délai</h2>
                    <div className="input-group">
                        <label htmlFor="delai">Délai (en jours)</label>
                        <input 
                            type="number" 
                            id="delai"
                            min="1"
                            value={delai}
                            onChange={(e) => setDelai(e.target.value)}
                        />
                    </div>
                </div>
            )}

            {step === 3 && (
                <div className="summary-container">
                    <h2>Résumé de la commande</h2>
                    <div className="selected-products">
                        {selectedProducts.map(product => (
                            <div key={product.code_produit} className="summary-item">
                                <span>{product.nom}</span>
                                <span>{product.quantite} unités</span>
                            </div>
                        ))}
                    </div>
                    <div className="delai-summary">
                        <span>Délai de livraison:</span>
                        <span>{delai} jours</span>
                    </div>
                </div>
            )}

            <div className="form-navigation">
                {step > 1 && (
                    <button type="button" onClick={prevStep} className="prev-button">
                        Précédent
                    </button>
                )}
                {step < 3 ? (
                    <button 
                        type="button" 
                        onClick={nextStep}
                        className="next-button"
                        disabled={(step === 1 && selectedProducts.length === 0) || (step === 2 && !delai)}
                    >
                        Suivant
                    </button>
                ) : (
                    <button type="button" onClick={handleSubmit} className="submit-button">
                        Confirmer la commande
                    </button>
                )}
            </div>
        </div>
    );
}