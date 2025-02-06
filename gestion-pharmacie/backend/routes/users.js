const express = require("express");
const router = express.Router();
const db = require("../db"); // Connexion à la base de données
const jwt = require("jsonwebtoken");
const verifyRole = require("../middlewares/verifyRole");



router.get('/users', verifyRole('superAdmin'), (req, res) => {
    const query = ' SELECT * FROM utilisateurs NATURAL JOIN regions WHERE role != "superAdmin" ';
   
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ message: err.message });
        }
        res.json(results);
    });
})


router.delete('/users/:id', verifyRole('superAdmin'), (req, res) => {
    const userId = req.params.id;
    const query = ' DELETE FROM utilisateurs WHERE id_utilisateur = ? ';
    db.query(query, [userId], (err, results) => {
        if (err) {
            return res.status(500).json({ message: err.message });
        }
        res.json({ message: 'Utilisateur supprimé' });
    });
})


module.exports = router;