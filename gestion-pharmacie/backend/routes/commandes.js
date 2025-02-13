const express = require("express");
const router = express.Router();
const db = require("../db"); // Connexion à la base de données
const verifyRole = require("../middlewares/verifyRole");

router.get('/commandes', verifyRole(['superAdmin', 'admin_base']), (req, res)=> {

    const query = `SELECT * FROM commandes NATURAL JOIN commande_produits`
    db.query(query, (err, results)=> {
        if(err){
            return res.status(500).json({message : 'db error'})
        }

        return res.json(results)
    })
})

router.post('/commandes', verifyRole(['admin_base']), (req, res) => {
    const {id, region, delai, produits} = req.body;

    const query = `INSERT INTO commandes (id_admin_base, id_region, delai) VALUES (?, ?, ?)`;
    
    db.query(query, [id, region, delai], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({message: 'Erreur d\'insertion commande'});
        }

        const idCommande = results.insertId;
        let completed = 0;
        let hasError = false;

        const query2 = `INSERT INTO commande_produits(id_commande, quantite_commande, code_produit) VALUES (?, ?, ?)`;

        produits.forEach(produit => {
            const {quantite, code_produit} = produit;
            
            db.query(query2, [idCommande, quantite, code_produit], (err) => {
                if (err && !hasError) {
                    hasError = true;
                    return res.status(500).json({message: 'Erreur d\'insertion produit'});
                }

                completed++;
                if (completed === produits.length && !hasError) {
                    res.status(200).json({message: 'Commande créée avec succès'});
                }
            });
        });
    });
});

module.exports = router