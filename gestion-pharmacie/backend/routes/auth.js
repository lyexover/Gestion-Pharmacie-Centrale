const express = require("express");
const router = express.Router();
const db = require("../db"); // Connexion à la base de données
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const SECRET_KEY = process.env.SECRET_KEY;

router.post("/login", (req, res) => {
  const { userName, password } = req.body;

  const Query = `SELECT * FROM utilisateurs WHERE userName = ?`;

  db.query(Query, [userName], async (err, results) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }

    if (results.length === 0) {
      return res.status(401).json({ message: "Utilisateur non trouvé" });
    }

    const user = results[0];

    // Vérifier le mot de passe avec bcrypt
    const isMatch = await bcrypt.compare(password, user.mot_de_passe);
    if (!isMatch) {
      return res.status(401).json({ message: "Mot de passe incorrect" });
    }

    // Générer un Token JWT
    const token = jwt.sign(
      { id: user.id_utilisateur, userName: user.userName, role: user.role, region: user.id_region },
      SECRET_KEY,
      { expiresIn: "7d" }
    );

    res.json({ message: "Connexion réussie", token });
  });
});




router.post("/signup", (req, res) => {
  const { username, password, role, email, region } = req.body;

  const checkQuery = " SELECT * FROM utilisateurs WHERE userName = ?";
  db.query(checkQuery, [username], async (err, results) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }
    if (results.length > 0) {
      return res.status(400).json({ message: "Utilisateur déjà existant" });
    }
    const hashedpass = await bcrypt.hash(password, 10);
    const insertQeury =
      " INSERT INTO utilisateurs (userName, email, mot_de_passe, role, id_region) VALUES(?, ?, ?, ?, ?)";

    db.query(insertQeury, [username, email, hashedpass, role, region], (err, result) => {
      if (err) {
        return res.status(500).json({ message: err.message });
      }
      return res.json({ message: "Utilisateur créé avec succès" });
    });
  });
});




module.exports = router;