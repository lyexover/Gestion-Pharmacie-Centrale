const express = require("express");
const router = express.Router();
const db = require("../db"); // Connexion à la base de données
const verifyRole = require("../middlewares/verifyRole");



router.post('/products', verifyRole(['superAdmin', 'gestionnaire_stock']), (req, res) => {

    const { nom, description, classe, type } = req.body;
    const query = 'INSERT INTO produits (nom, description, classe, id_type) VALUES (?, ?, ?, ?)';
    db.query(query, [nom, description, classe, type], (err, results) => {
        if (err) {
            return res.status(500).json({ message: err.message });
        }
        res.json({ message: 'Produit ajouté' });
    });
})


router.get('/products', verifyRole(['superAdmin', 'gestionnaire_stock']), (req, res) => {
    
    const query = `SELECT p.code_produit, 
       p.nom, 
       c.nom_classe, 
       t.nom_type, 
       COALESCE(SUM(l.quantite_disponible), 0) AS total_quantite
FROM Produits p
LEFT JOIN Lots l ON p.code_produit = l.code_produit 
JOIN Classes c ON c.id_classe = p.classe 
JOIN types t ON t.id_type = p.id_type
GROUP BY p.code_produit, p.nom, c.nom_classe, t.nom_type;
`
    db.query(query, (err, products) => {
        if (err) {
            return res.status(500).json({ message: err.message });
        }
        
        db.query('SELECT * FROM lots NATURAL JOIN produits', (err, lots) => {
            if (err) {
                return res.status(500).json({ message: err.message });
            }
            
            res.json({
                produits: products,
                lots: lots
            });
        });
    });

});


   

router.get('/classes', verifyRole(['superAdmin', 'gestionnaire_stock']), (req, res) => {
    db.query('SELECT * FROM classes', (err, classes) => {
        if (err) {
            return res.status(500).json({ message: err.message });
        }
        
        db.query('SELECT * FROM types', (err, types) => {
            if (err) {
                return res.status(500).json({ message: err.message });
            }
            
            res.json({
                classes: classes,
                types: types
            });
        });
    });
});


router.get('/lotForm', verifyRole(['superAdmin', 'gestionnaire_stock']) , (req, res)=>{
    db.query('SELECT * FROM produits', (err, produits) => {
        if(err){
            return res.status(500).json({message : 'db error'})
        }

        db.query('SELECT * FROM fournisseurs' , (err, fournisseurs)=> {
            if(err){
                return res.status(500).json({message : 'db error'})
            }

            return res.json({
                produits : produits , 
                fournisseurs : fournisseurs
            })
        })
    })

})



router.post('/lotForm', verifyRole(['superAdmin', 'gestionnaire_stock']) , (req, res) => {
    const {id_produit, date_fabrication, date_peremption, id_fournisseur, quantite} = req.body

    const query = ` INSERT INTO lots (quantite_disponible, date_fabrication, date_peremption, id_fournisseur, code_produit)
                  VALUES (?, ?, ?, ?, ?)`

    db.query(query, [quantite, date_fabrication, date_peremption, id_fournisseur, id_produit] , (err, results) => {
      if(err){
        return res.status(500).json({message : 'db error'})
      }

      return res.json({message : 'added successfully'})
    })
})


module.exports = router;