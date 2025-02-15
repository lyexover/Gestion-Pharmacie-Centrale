const express = require("express");
const router = express.Router();
const db = require("../db");
const jwt = require("jsonwebtoken");
const verifyRole = require("../middlewares/verifyRole");

router.get('/users', verifyRole(['superAdmin']), async (req, res) => {
    try {
        const query = 'SELECT * FROM utilisateurs NATURAL JOIN regions WHERE role != "superAdmin"';
        const [results] = await db.query(query);
        res.json(results);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.delete('/users/:id', verifyRole(['superAdmin']), async (req, res) => {
    try {
        const userId = req.params.id;
        const query = 'DELETE FROM utilisateurs WHERE id_utilisateur = ?';
        await db.query(query, [userId]);
        res.json({ message: 'Utilisateur supprimé' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;