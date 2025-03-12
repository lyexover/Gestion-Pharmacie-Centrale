import React from 'react';
import { useRouteLoaderData } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function Commandes_stats() {
  const { commandes } = useRouteLoaderData('parent');
  
  // Filtrer les commandes de l'année courante
  const filteredcommandes = commandes.filter(commande => 
    new Date(commande.date_commande).getFullYear() === new Date().getFullYear()
  );
  
  // Préparer les données pour le graphique
  const data = filteredcommandes.reduce((acc, commande) => {
    const mois = new Date(commande.date_commande).getMonth(); // 0 pour janvier, 11 pour décembre
    
    if (commande.statut === 'livrée') {
      acc[mois].livre += 1;
    } else {
      acc[mois].nonLivre += 1;
    }
    
    return acc; // Ne pas oublier de retourner l'accumulateur
  }, 
  // Initialisation d'un tableau de 12 objets pour représenter chaque mois
  Array.from({ length: 12 }, (_, i) => ({
    name: `Mois ${i + 1}`, // Nom affiché sur l'axe X
    mois: i + 1,         // 1 pour janvier, 12 pour décembre
    livre: 0,            // Commandes livrées
    nonLivre: 0          // Commandes non livrées
  })));
  
  // Noms des mois en français
  const nomsDesMois = [
    "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
    "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
  ];
  
  // Mettre à jour les noms des mois dans les données
  const dataAvecNomsDesMois = data.map((item, index) => ({
    ...item,
    name: nomsDesMois[index]
  }));
  
  return (
    <div style={{ width: '100%', height: 400 }}>
      <ResponsiveContainer>
        <BarChart
          data={dataAvecNomsDesMois}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="livre" stackId="a" fill="#82ca9d" name="Commandes livrées" />
          <Bar dataKey="nonLivre" stackId="a" fill="#8884d8" name="Commandes non livrées" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}