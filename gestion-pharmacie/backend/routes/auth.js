const express = require('express');
const router = express.Router();
const db = require('../db'); // Connexion à la base de données
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const SECRET_KEY = 'f1a8e12b76c8d0f3e5b4a2c9d8f6e7a4c1b2d3f4e5a6b7c8d9e0f1a2b3c4d5e6';// Remplace par une clé sécurisée

router.post('/login', (req, res) => {
    const { userName, password } = req.body;

 
    const Query = `SELECT * FROM utilisateurs WHERE userName = ?`;

    db.query(Query, [userName], async (err, results) => {
        if (err) {
            return res.status(500).json({ message: err.message });
        }

        if (results.length === 0) {
            return res.status(401).json({ message: 'Utilisateur non trouvé' });
        }

        const user = results[0];

        // Vérifier le mot de passe avec bcrypt
        const isMatch = await bcrypt.compare(password, user.mot_de_passe);
        if (!isMatch) {
            return res.status(401).json({ message: 'Mot de passe incorrect' });
        }

        // Générer un Token JWT
        const token = jwt.sign({ id: user.id, userName: user.userName , role: user.role }, SECRET_KEY, { expiresIn: '7d' });

        res.json({ message: 'Connexion réussie', token });
    });
});

module.exports = router;
