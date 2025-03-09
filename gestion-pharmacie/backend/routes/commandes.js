// routes/commandes.js
const express = require("express");
const router = express.Router();
const db = require("../db");
const verifyRole = require("../middlewares/verifyRole");

router.get('/commandes', verifyRole(['superAdmin', 'admin_base', 'gestionnaire_stock']), async (req, res) => {
    try {
        const query = `SELECT * FROM commandes NATURAL JOIN regions`;
        const [results] = await db.query(query);
        
        return res.json(results);
    } catch (err) {
        return res.status(500).json({ message: 'db error' });
    }
});

router.post('/commandes', verifyRole(['admin_base']), async (req, res) => {
    const {id, region, delai, produits} = req.body;
    
    // Utiliser une transaction pour garantir l'intégrité des données
    let connection;
    try {
        connection = await db.getConnection();
        await connection.beginTransaction();

        // Insérer la commande
        const [commandeResult] = await connection.query(
            `INSERT INTO commandes (id_admin_base, id_region, delai) VALUES (?, ?, ?)`,
            [id, region, delai]
        );
        
        const idCommande = commandeResult.insertId;

        // Préparer toutes les insertions de produits
        const insertPromises = produits.map(produit => {
            const {quantite, code_produit} = produit;
            return connection.query(
                `INSERT INTO commande_produits(id_commande, quantite_commande, code_produit) VALUES (?, ?, ?)`,
                [idCommande, quantite, code_produit]
            );
        });

        // Exécuter toutes les insertions
        await Promise.all(insertPromises);

        // Si tout s'est bien passé, valider la transaction
        await connection.commit();
        res.status(200).json({ message: 'Commande créée avec succès' });

    } catch (err) {
        // En cas d'erreur, annuler la transaction
        if (connection) await connection.rollback();
        console.error(err);
        res.status(500).json({ message: 'Erreur lors de la création de la commande' });
    } finally {
        if (connection)  connection.release();
    }
});

router.get('/commandeProduits', verifyRole(['superAdmin', 'gestionnaire_stock', 'admin_base']), async (req, res) => {
    try {
        const [commandeProduits] = await db.query('SELECT * FROM commande_produits NATURAL JOIN produits');
        return res.json(commandeProduits);
    } catch (err) {
        res.status(500).json({ message: "Erreur serveur", err });
    }
});



// Dans votre fichier de routes backend
router.post('/traiter-commande', async (req, res) => {
    try {
        const { id_commande, lots } = req.body;
        
        // Commencer une transaction pour assurer l'intégrité des données
        connection = await db.getConnection();
        await connection.beginTransaction();
        
        // Mettre à jour chaque lot
       const updatePromises = lots.map(lot => {
            return connection.query(
                'UPDATE lots SET quantite_disponible = quantite_disponible - ? WHERE id_lot = ?',
                [lot.quantite, lot.id_lot]
            );
        })
        
        await Promise.all(updatePromises);

        // Mettre à jour le statut de la commande si nécessaire
        await db.query(
            'UPDATE commandes SET statut = ? WHERE id_commande = ?',
            ['en cours de traitement', id_commande]
        );
        
        
        // Valider la transaction
        await connection.commit();
        
        res.json({ success: true, message: "Commande traitée avec succès" });
    } catch (error) {
        // Annuler la transaction en cas d'erreur
        await connection.rollback();
        console.error("Erreur lors du traitement de la commande:", error);
        res.status(500).json({ success: false, message: error.message });
    }
});



module.exports = router;