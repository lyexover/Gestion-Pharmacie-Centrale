import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

export default function CommandesStatus({ commandes }) {
  const statusData = useMemo(() => {
    // Count commandes by status
    const statusCounts = {
      'en attente': 0,
      'en cours de traitement': 0,
      'livrée': 0
    };

    commandes.forEach(commande => {
      if (statusCounts.hasOwnProperty(commande.statut)) {
        statusCounts[commande.statut] += 1;
      }
    });

    // Convert to array format for Recharts
    return Object.entries(statusCounts).map(([status, count]) => ({
      name: status,
      value: count
    }));
  }, [commandes]);

  // Colors for different statuses
  const COLORS = ['#FF8042', '#0088FE', '#00C49F'];

  return (
    <div className="chart-card">
      <h3 className="chart-title">Statut des commandes</h3>
      <div className="chart-container">
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={statusData}
              cx="50%"
              cy="50%"
              labelLine={true}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
              nameKey="name"
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            >
              {statusData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => [`${value} commandes`, 'Quantité']} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}