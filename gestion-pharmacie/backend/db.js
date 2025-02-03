const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',      // Adresse du serveur MySQL
    user: 'root',           // Nom d'utilisateur MySQL
    password: '0000',           // Mot de passe MySQL (laisser vide si aucun mot de passe)
    database: 'gtp' // Nom de la base de données
});

// Connexion à la base de données
db.connect((err) => {
    if (err) {
        console.error('Erreur de connexion à la base de données :', err);
        return;
    }
    console.log('Connexion réussie à la base de données MySQL');
});
module.exports = db;
