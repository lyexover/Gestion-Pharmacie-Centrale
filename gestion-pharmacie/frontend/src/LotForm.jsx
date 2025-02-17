import { useLoaderData, useNavigate, useRevalidator, useLocation } from "react-router-dom";
import { useState, useMemo } from "react";
import Select from 'react-select';

export async function loader() {
    try {
        const response = await fetch('http://localhost:3000/api/lotForm', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (!response.ok) {
            throw new Error();
        }

        const data = await response.json();
        return {
            produits: data.produits,
            fournisseurs: data.fournisseurs
        };
    } catch (err) {
        console.log(err);
        return { produits: [], fournisseurs: [] };
    }
}

export default function LotForm() {
    const { produits, fournisseurs } = useLoaderData();
    const revalidator = useRevalidator();
    const navigate = useNavigate();
    const location = useLocation();
    const data = location.state?.data || {};
    console.log(data)

    // Formatage des options
    const produitOptions = useMemo(() => produits.map(produit => ({
        value: produit.code_produit,
        label: produit.nom
    })), [produits]);

    const fournisseurOptions = useMemo(() => fournisseurs.map(fournisseur => ({
        value: fournisseur.id_fournisseur,
        label: fournisseur.nom_fournisseur
    })), [fournisseurs]);

    // Formatage des valeurs initiales pour les Select
    const initialProduit = useMemo(() => {
        if (!data.code_produit) return null;
        return produitOptions.find(option => option.value === data.code_produit) || null;
    }, [data.code_produit, produitOptions]);

    const initialFournisseur = useMemo(() => {
        if (!data.id_fournisseur) return null;
        return fournisseurOptions.find(option => option.value === data.id_fournisseur) || null;
    }, [data.id_fournisseur, fournisseurOptions]);

    // Formatage des dates
    const formatDate = (dateString) => {
        if (!dateString) return '';
        try {
            return new Date(dateString).toISOString().split('T')[0];
        } catch (e) {
            return '';
        }
    };

    const [formData, setFormData] = useState({
        produit: initialProduit,
        date_fabrication: formatDate(data.date_fabrication),
        date_peremption: formatDate(data.date_peremption),
        fournisseur: initialFournisseur,
        quantite: data.quantite_disponible || '' , 
        id_lot : data.id_lot || ''
    });

    console.log(formData)

    // Style personnalisé pour React Select
    const customStyles = {
        control: (provided) => ({
            ...provided,
            padding: '0.25rem',
            border: '1px solid var(--color-gray)',
            borderRadius: '4px',
            boxShadow: 'none',
            '&:hover': {
                borderColor: 'var(--color-secondary)'
            }
        }),
        option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isSelected ? 'var(--color-primary)' : 'white',
            '&:hover': {
                backgroundColor: state.isSelected ? 'var(--color-primary)' : 'var(--color-secondary)',
                color: state.isSelected ? 'white' : 'white'
            }
        })
    };

    function handleChange(e) {
        if (e && e.target) {
            setFormData({ ...formData, [e.target.name]: e.target.value });
        }
    }

    function handleSelectChange(value, action) {
        setFormData({ ...formData, [action.name]: value });
    }

    async function handleSubmit(e) {
        e.preventDefault();
        const method = Object.keys(data).length > 0 ? 'PUT' : 'POST'

        try {
            const dataToSend = {
                id_produit: formData.produit.value,
                date_fabrication: formData.date_fabrication,
                date_peremption: formData.date_peremption,
                id_fournisseur: formData.fournisseur?.value,
                quantite_disponible: parseInt(formData.quantite) , 
                id_lot : formData.id_lot
            };

            const response = await fetch('http://localhost:3000/api/lotForm', {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(dataToSend)
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message);

            await revalidator.revalidate();
            navigate(-1);
            console.log(data.message);
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <div className="overlay">
            <div className="form-container">
                <h3 className="form-title">Ajouter un Lot</h3>

                <form onSubmit={handleSubmit} className="product-form">
                    <div className="form-group">
                        <label htmlFor="produit">Produit</label>
                        <Select
                            id="produit"
                            name="produit"
                            value={formData.produit}
                            onChange={(value, action) => handleSelectChange(value, { name: 'produit' })}
                            options={produitOptions}
                            placeholder="Sélectionner un produit"
                            styles={customStyles}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="date_fabrication">Date de fabrication</label>
                        <input
                            id="date_fabrication"
                            type="date"
                            name="date_fabrication"
                            value={formData.date_fabrication}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="date_peremption">Date de péremption</label>
                        <input
                            id="date_peremption"
                            type="date"
                            name="date_peremption"
                            value={formData.date_peremption}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="fournisseur">Fournisseur</label>
                        <Select
                            id="fournisseur"
                            name="fournisseur"
                            value={formData.fournisseur}
                            onChange={(value, action) => handleSelectChange(value, { name: 'fournisseur' })}
                            options={fournisseurOptions}
                            placeholder="Sélectionner un fournisseur"
                            styles={customStyles}
                            isClearable
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="quantite">Quantité disponible</label>
                        <input
                            id="quantite"
                            type="number"
                            name="quantite"
                            value={formData.quantite}
                            onChange={handleChange}
                            placeholder="Entrez la quantité"
                            min="0"
                            required
                        />
                    </div>

                    <div className="button-group">
                        <button type="button" className="cancel-button" onClick={() => navigate(-1)}>
                            Annuler
                        </button>
                        <button type="submit" className="submit-button">
                            Ajouter le lot
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}