import { useLoaderData, useNavigate ,useRevalidator, useLocation } from "react-router-dom";
import { useState } from "react";

export async function loader(){
    try {
        const response = await fetch('http://localhost:3000/api/classes' , 
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}` }
                } )

          const data = await response.json();

            if(!response.ok){
                
                throw new Error();
            }
            
            
            return ({classes : data.classes, types: data.types});
        }
        catch(err){
            console.log(err);
            return { classes: [] , types: [] }; 
        }

}


export default function ProductForm() {

    const {classes, types} = useLoaderData();
    const revalidator = useRevalidator();
    const navigate = useNavigate();
    const location = useLocation()
    const data =location.state?.data || {}
    
    


   const [formData , setFormData] = useState({
         code_produit : data.code_produit || '' , 
         nom : data.nom || '',
         description : data.description ||'',
         classe : data.id_classe ||'',
         type : data.id_type || ''
   })

   

   function handleChange(e){
       setFormData({...formData, [e.target.name]: e.target.value});
   }

   async function handleSubmit(e){
       e.preventDefault();

       const method = Object.keys(data).length > 0 ? 'PUT' : 'POST'
       try{
              const response = await fetch('http://localhost:3000/api/products' , {
                method: method,
                headers: {
                     'Content-Type': 'application/json',
                     'Authorization': `Bearer ${localStorage.getItem('token')}`
       } , 
       body : JSON.stringify(formData)
    
    })
    const data = await response.json();
    if (!response.ok) throw new Error(data.message);

   await revalidator.revalidate() ; 
    navigate(-1);
    console.log(data.message);
}


    catch(err){
        console.log(err);
    }
}

    return (
        <div className="overlay">
      <div className="form-container">
        <h3 className="form-title">Ajouter un Produit</h3>

        <form onSubmit={handleSubmit} className="product-form">
          <div className="form-group">
            <label htmlFor="nom">Nom du produit</label>
            <input 
              id="nom"
              type="text" 
              name="nom" 
              required 
              value={formData.nom} 
              onChange={handleChange}
              placeholder="Entrez le nom du produit"
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <input 
              id="description"
              type="text" 
              name="description" 
              value={formData.description} 
              onChange={handleChange}
              placeholder="Entrez la description"
            />
          </div>

          <div className="form-group">
            <label htmlFor="classe">Classe</label>
            <select 
              id="classe"
              required 
              value={formData.classe} 
              onChange={handleChange} 
              name="classe"
            >
              <option value="">Sélectionner une classe</option>
              {classes.map((classe, index) => (
                <option key={index} value={classe.id_classe}>
                  {classe.nom_classe}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="types">Type</label>
            <select 
              id="types"
              required 
              name="type" 
              value={formData.type} 
              onChange={handleChange}
            >
              <option value="">Sélectionner un type</option>
              {types
                .filter(type => type.id_classe == formData.classe)
                .map((type, index) => (
                  <option key={index} value={type.id_type}>
                    {type.nom_type}
                  </option>
                ))
              }
            </select>
          </div>

          <div className="button-group">
            <button type="button" className="cancel-button" onClick={() => navigate(-1)}>
              Annuler
            </button>
            <button type="submit" className="submit-button">
              Ajouter le produit
            </button>
          </div>
        </form>
      </div>
    </div>
    )
}