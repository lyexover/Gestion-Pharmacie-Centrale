const express = require("express");
const db = require("../db"); // Connexion à la base de données
require("dotenv").config();
const jwt = require("jsonwebtoken");

//recuperer la clé secrete
const SECRET_KEY = process.env.SECRET_KEY;


// fonction qui verifie le role de l'utilisateur pour securiser les routes
const verifyRole = (requiredRoles)=> {
   
    return (req, res, next)=> {
        try{
            const token = req.headers.authorization?.split(" ")[1];
            
       if (!token) {
           return res.status(401).json({ message: "Token manquant" });
       }
     
       const decoded = jwt.verify(token, SECRET_KEY);
       console.log(decoded.role)
       if(!requiredRoles.includes(decoded.role)){
           return res.status(403).json({ message: "Non autorisé" });
       }
       next();
        }
       
        catch(err){
            res.status(403).json({ message: "Token invalide" });
        }
    }
}

module.exports = verifyRole;