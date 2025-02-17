const express = require("express");
const router = express.Router();
const db = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const SECRET_KEY = process.env.SECRET_KEY;

router.post("/login", async (req, res) => {
    try {
        const { userName, password } = req.body;
        const query = `SELECT * FROM utilisateurs WHERE userName = ?`;
        
        // Exécuter la requête et destructurer le résultat
        const [users] = await db.query(query, [userName]);
        
        if (users.length === 0) {
            return res.status(401).json({ message: "Utilisateur non trouvé" });
        }

        const user = users[0];

        // Vérifier le mot de passe
        const isMatch = await bcrypt.compare(password, user.mot_de_passe);
        if (!isMatch) {
            return res.status(401).json({ message: "Mot de passe incorrect" });
        }

        // Générer le token
        const token = jwt.sign(
            { 
                id: user.id_utilisateur, 
                userName: user.userName, 
                role: user.role, 
                region: user.id_region 
            },
            SECRET_KEY,
            { expiresIn: "7d" }
        );

        res.json({ message: "Connexion réussie", token });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post("/signup", async (req, res) => {
    try {
        const { username, password, role, email, region } = req.body;

        // Vérifier si l'utilisateur existe
        const checkQuery = "SELECT * FROM utilisateurs WHERE userName = ?";
        const [existingUsers] = await db.query(checkQuery, [username]);

        if (existingUsers.length > 0) {
            return res.status(400).json({ message: "Utilisateur déjà existant" });
        }

        // Hasher le mot de passe
        const hashedpass = await bcrypt.hash(password, 10);

        // Insérer le nouvel utilisateur
        const insertQuery = `
            INSERT INTO utilisateurs (userName, email, mot_de_passe, role, id_region) 
            VALUES (?, ?, ?, ?, ?)
        `;
        
        await db.query(insertQuery, [username, email, hashedpass, role, region]);
        res.json({ message: "Utilisateur créé avec succès" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});



async function hashPassword(password) {
    const saltRounds = 10; // Nombre de tours de salage
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
}

// Exemple d'utilisation
hashPassword('secretKey').then(console.log);

module.exports = router;
