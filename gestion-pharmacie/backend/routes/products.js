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
    
    db.query('SELECT * FROM produits', (err, products) => {
        if (err) {
            return res.status(500).json({ message: err.message });
        }
        
        db.query('SELECT * FROM lots', (err, lots) => {
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



module.exports = router;