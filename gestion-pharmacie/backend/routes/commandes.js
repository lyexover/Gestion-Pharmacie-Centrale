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

module.exports = router