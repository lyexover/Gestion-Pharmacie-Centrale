const jwt = require("jsonwebtoken");
require("dotenv").config();

const SECRET_KEY = process.env.SECRET_KEY;

const verifyRole = (requiredRoles) => {
    return async (req, res, next) => {
        try {
            const token = req.headers.authorization?.split(" ")[1];
            
            if (!token) {
                return res.status(401).json({ message: "Token manquant" });
            }
         
            const decoded = jwt.verify(token, SECRET_KEY);
            if (!requiredRoles.includes(decoded.role)) {
                return res.status(403).json({ message: "Non autorisé" });
            }
            
            req.user = decoded; // Stocke les informations de l'utilisateur si nécessaire
            next();
        } catch(err) {
            res.status(403).json({ message: "Token invalide" });
        }
    }
}

module.exports = verifyRole;