CREATE TABLE Regions (
    id_region INT PRIMARY KEY AUTO_INCREMENT,
    nom_region VARCHAR(100) NOT NULL  
);

CREATE TABLE Classes (
    id_classe INT PRIMARY KEY AUTO_INCREMENT, 
    nom_classe VARCHAR(200) NOT NULL, 
    categorie INT NOT NULL
);

CREATE TABLE types (
    id_type INT PRIMARY KEY AUTO_INCREMENT, 
    nom_type VARCHAR(200),
    id_classe INT NOT NULL,
    FOREIGN KEY (id_classe) REFERENCES Classes(id_classe)
);

CREATE TABLE Utilisateurs (
    id_utilisateur INT PRIMARY KEY AUTO_INCREMENT,
    userName VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    mot_de_passe VARCHAR(255) NOT NULL,
    role ENUM('superAdmin','gestionnaire_stock', 'admin_base') NOT NULL,
    id_region INT NOT NULL, 
    FOREIGN KEY(id_region) REFERENCES Regions(id_region)
);

CREATE TABLE Produits (
    id_produit INT PRIMARY KEY AUTO_INCREMENT,
    nom VARCHAR(255) NOT NULL,
    description TEXT,
    categorie INT NOT NULL,
    classe INT NOT NULL,
    id_type INT,  -- ajout de la colonne pour la clé étrangère vers types
    FOREIGN KEY (id_type) REFERENCES types(id_type),
    FOREIGN KEY (classe) REFERENCES Classes(id_classe)
);

CREATE TABLE Fournisseurs (
    id_fournisseur INT PRIMARY KEY AUTO_INCREMENT, 
    nom_fournisseur VARCHAR(200)
);

CREATE TABLE Lots (
    id_lot INT PRIMARY KEY AUTO_INCREMENT,
    id_produit INT NOT NULL,
    quantite_disponible INT NOT NULL CHECK (quantite_disponible >= 0),
    date_fabrication DATE NOT NULL,
    date_peremption DATE NOT NULL,
    id_fournisseur INT, 
    FOREIGN KEY (id_produit) REFERENCES Produits(id_produit) ON DELETE CASCADE, 
    FOREIGN KEY (id_fournisseur) REFERENCES Fournisseurs(id_fournisseur)
);

CREATE TABLE Commandes (
    id_commande INT PRIMARY KEY AUTO_INCREMENT,
    id_admin_base INT NOT NULL,
    id_region INT NOT NULL,
    date_commande TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    statut ENUM('en attente', 'en cours de traitement', 'livrée') DEFAULT 'en attente',
    delai INT NOT NULL, 
    FOREIGN KEY (id_admin_base) REFERENCES Utilisateurs(id_utilisateur) ON DELETE CASCADE,
    FOREIGN KEY (id_region) REFERENCES Regions(id_region)
);

CREATE TABLE Commande_Produits (
    id_commande_produit INT PRIMARY KEY AUTO_INCREMENT,
    id_commande INT NOT NULL,
    id_produit INT NOT NULL,
    quantite_commande INT NOT NULL CHECK (quantite_commande > 0),
    FOREIGN KEY (id_commande) REFERENCES Commandes(id_commande) ON DELETE CASCADE,
    FOREIGN KEY (id_produit) REFERENCES Produits(id_produit) ON DELETE CASCADE
);

CREATE TABLE Eliminations (
    id_elimination INT PRIMARY KEY AUTO_INCREMENT,
    id_lot INT NOT NULL,
    id_utilisateur INT NOT NULL,
    date_elimination TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    quantite_eliminee INT NOT NULL CHECK (quantite_eliminee > 0),
    FOREIGN KEY (id_lot) REFERENCES Lots(id_lot) ON DELETE CASCADE,
    FOREIGN KEY (id_utilisateur) REFERENCES Utilisateurs(id_utilisateur) ON DELETE CASCADE
);

CREATE TABLE expedition (
    id_expedition INT PRIMARY KEY AUTO_INCREMENT,
    id_commande INT NOT NULL,
    code_chauffeur VARCHAR(50) NOT NULL,
    moyen_transport ENUM('Camion', 'Fourgon', 'Vehicule de service') NOT NULL, 
    FOREIGN KEY (id_commande) REFERENCES Commandes(id_commande)
);
