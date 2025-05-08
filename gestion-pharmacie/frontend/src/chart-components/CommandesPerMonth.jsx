import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function CommandesPerMonth({ commandes }) {
  const monthlyData = useMemo(() => {
    // Initialize data structure for all months
    const months = [
      'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
      'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
    ];
    
    const currentYear = new Date().getFullYear();
    const monthData = months.map((month, index) => ({
      name: month,
      value: 0,
      monthIndex: index
    }));
    
    // Count commandes for each month in the current year
    commandes.forEach(commande => {
      const commandeDate = new Date(commande.date_commande);
      
      // Only count commandes from the current year
      if (commandeDate.getFullYear() === currentYear) {
        const month = commandeDate.getMonth();
        monthData[month].value += 1;
      }
    });
    
    // Return only months with data and current/future months
    return monthData;
  }, [commandes]);

  return (
    <div className="chart-card">
      <h3 className="chart-title">Commandes par mois</h3>
      <div className="chart-container">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={monthlyData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" name="Nombre de commandes" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}