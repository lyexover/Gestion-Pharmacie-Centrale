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
            SELECT p.code_produit, 
                   p.nom, 
                   c.nom_classe, 
                   t.nom_type, 
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

router.post('/lotForm', verifyRole(['superAdmin', 'gestionnaire_stock']), async (req, res) => {
    try {
        const {id_produit, date_fabrication, date_peremption, id_fournisseur, quantite} = req.body;
        
        const query = `
            INSERT INTO lots (quantite_disponible, date_fabrication, date_peremption, id_fournisseur, code_produit)
            VALUES (?, ?, ?, ?, ?)
        `;
        
        const [result] = await db.query(query, [quantite, date_fabrication, date_peremption, id_fournisseur, id_produit]);
        res.json({ message: 'added successfully', id: result.insertId });
    } catch (err) {
        res.status(500).json({ message: 'db error' });
    }
});

router.delete('/lot',verifyRole(['superAdmin','gestionnaire_stock']),async (req, res) => {
    const{id_lot,quantite_disponible,id_utilisateur}= req.body;
    let connection;
    try{
        connection = await db.getConnection();
        await connection.beginTransaction();
        const query = 'DELETE FROM lots WHERE id_lot = ? ';8
        const [result]=await db.query(query,[id_lot])
        const query2 = 'INSERT INTO eliminations(id_lot,id_utilisateur,quantite_eliminee) VALUES (?, ?, ?) ';
        const [result2]=await db.query(query,[id_lot,id_utilisateur,quantite_disponible]);
        await connection.commit();
        return result.json({message:'lot suprimee avec successful'})
    }catch(err){
        if (connection){
            await connection.rollback();
           
        }
    
        console.error('Error rolling back transaction', err.stack);
        res.json({message : 'erreur lors de la connection'})
    }finally{
        if (connection){
            await connection.release();
        }
    }
})

module.exports = router;