const express = require("express");
const router = express.Router();
const db = require("../db");
const verifyRole = require("../middlewares/verifyRole");

router.post('/products', verifyRole(['superAdmin', 'gestionnaire_stock']), async (req, res) => {
    try {
        const { nom, description, classe, type } = req.body;
        const query = 'INSERT INTO produits (nom, description, classe, id_type) VALUES (?, ?, ?, ?)';
        const [result] = await db.query(query, [nom, description, classe, type]);
        res.json({ message: 'Produit ajouté', id: result.insertId });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/products', verifyRole(['superAdmin', 'gestionnaire_stock', 'admin_base']), async (req, res) => {
    try {
        const query = `
            SELECT
                   p.code_produit, 
                   p.nom, 
                   p.description,
                   c.nom_classe, 
                   t.nom_type, 
                   t.id_type , 
                   c.id_classe,
                   COALESCE(SUM(l.quantite_disponible), 0) AS total_quantite
            FROM Produits p
            LEFT JOIN Lots l ON p.code_produit = l.code_produit 
            JOIN Classes c ON c.id_classe = p.classe 
            JOIN types t ON t.id_type = p.id_type
            GROUP BY p.code_produit, p.nom, c.nom_classe, t.nom_type
        `;
        
        const [products] = await db.query(query);
        const [lots] = await db.query('SELECT * FROM lots NATURAL JOIN produits');
        
        res.json({
            produits: products,
            lots: lots
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/classes', verifyRole(['superAdmin', 'gestionnaire_stock']), async (req, res) => {
    try {
        const [classes] = await db.query('SELECT * FROM classes');
        const [types] = await db.query('SELECT * FROM types');
        
        res.json({
            classes: classes,
            types: types
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/lotForm', verifyRole(['superAdmin', 'gestionnaire_stock']), async (req, res) => {
    try {
        const [produits] = await db.query('SELECT * FROM produits');
        const [fournisseurs] = await db.query('SELECT * FROM fournisseurs');
        
        res.json({
            produits: produits,
            fournisseurs: fournisseurs
        });
    } catch (err) {
        res.status(500).json({ message: 'db error' });
    }
});


router.put('/lotForm', verifyRole(['superAdmin', 'gestionnaire_stock']), async (req, res) => {
    try {
        const { 
            
            id_lot,
            quantite_disponible, 
            date_fabrication, 
            date_peremption, 
            id_fournisseur 
        } = req.body;

        // Vérifier si le lot existe
        const [existing] = await db.query(
            'SELECT * FROM lots WHERE id_lot = ?',
            [id_lot]
        );
        
        if (existing.length === 0) {
            return res.status(404).json({ message: 'Lot non trouvé' });
        }

        // Mettre à jour le lot
        const query = `
            UPDATE lots 
            SET quantite_disponible = ?,
                date_fabrication = ?,
                date_peremption = ?,
                id_fournisseur = ?
            WHERE id_lot = ?
        `;

        await db.query(query, [
            quantite_disponible,
            date_fabrication,
            date_peremption,
            id_fournisseur,
            id_lot
        ]);

        res.json({ 
            message: `Lot ${id_lot} mis à jour avec succès`,
            updatedLot: {
                id_lot,
                quantite_disponible,
                date_fabrication,
                date_peremption,
                id_fournisseur
            }
        });

    } catch (err) {
        console.error('Erreur lors de la mise à jour du lot:', err.stack);
        res.status(500).json({ 
            message: 'Erreur lors de la mise à jour du lot',
            error: err.message 
        });
    }
});

router.post('/lotForm', verifyRole(['superAdmin', 'gestionnaire_stock']), async (req, res) => {
    try {
        const {id_produit, date_fabrication, date_peremption, id_fournisseur, quantite_disponible} = req.body;
        
        const query = `
            INSERT INTO lots (quantite_disponible, date_fabrication, date_peremption, id_fournisseur, code_produit)
            VALUES (?, ?, ?, ?, ?)
        `;
        
        const [result] = await db.query(query, [quantite_disponible, date_fabrication, date_peremption, id_fournisseur, id_produit]);
        res.json({ message: 'added successfully', id: result.insertId });
    } catch (err) {
        res.status(500).json({ message: 'db error' });
    }
});

router.delete('/lot', verifyRole(['superAdmin', 'gestionnaire_stock']), async (req, res) => {
    const { id_lot, quantite_disponible, id_utilisateur } = req.body;
    let connection;
    
    try {
        connection = await db.getConnection();
        await connection.beginTransaction();

        // 1. D'abord, insérer l'enregistrement d'élimination
        const insertQuery = 'INSERT INTO eliminations(id_lot, id_utilisateur, quantite_eliminee) VALUES (?, ?, ?)';
        await db.query(insertQuery, [id_lot, id_utilisateur, quantite_disponible]);

        // 2. Ensuite, supprimer le lot
        const deleteQuery = 'DELETE FROM lots WHERE id_lot = ?';
        await db.query(deleteQuery, [id_lot]);

        // Si tout s'est bien passé, on valide la transaction
        await connection.commit();
        return res.json({ message: 'Lot supprimé avec succès' });

    } catch (err) {
        if (connection) {
            await connection.rollback();
        }
        console.error('Erreur lors de la transaction:', err.stack);
        return res.status(500).json({ message: 'Erreur lors de la suppression du lot' });
    } finally {
        if (connection) {
            await connection.release();
        }
    }
});



router.delete(
    "/products/delete",
    verifyRole(["superAdmin" , 'gestionnaire_stock']),
    async (req, res) => {
      try {
        const { code_produit } = req.body;
  
        const [existing] = await db.query(
          "SELECT * FROM produits WHERE code_produit = ?",
          [code_produit]
        );
        if (existing.length === 0) {
          return res.status(404).json({ message: "Produit non trouvé" });
        }
  
        const query = "DELETE FROM produits WHERE code_produit = ?";
        await db.query(query, [code_produit]);
  
        res.json({ message: `Produit ${code_produit} supprimé avec succès` });
      } catch (err) {
        res.status(500).json({ message: err.message });
      }
    }
  );



  router.put(
    "/products",
    verifyRole(["superAdmin", "gestionnaire_stock"]),
    async (req, res) => {
      try {
        const { code_produit, nom, description, classe, type } = req.body;
  
        const [existing] = await db.query(
          "SELECT * FROM produits WHERE code_produit = ?",
          [code_produit]
        );
        if (existing.length === 0) {
          return res.status(404).json({ message: "Produit non trouvé" });
        }
  
        const query = `UPDATE produits 
                         SET nom = ?, description = ?, classe = ?, id_type = ?
                         WHERE code_produit = ?`;
        await db.query(query, [nom, description, classe, type, code_produit]);
  
        res.json({ message: `Produit ${code_produit} mis à jour avec succès` });
      } catch (err) {
        res.status(500).json({ message: err.message });
      }
    }
  );


module.exports = router;