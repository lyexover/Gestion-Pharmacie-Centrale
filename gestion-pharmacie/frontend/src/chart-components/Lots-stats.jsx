import { useRouteLoaderData } from "react-router-dom";
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

export default function Lots_stats() {
  const { lots } = useRouteLoaderData('parent');

  // Make sure we have data
  console.log("Lots data:", lots);

  const chartData = lots.reduce((acc, lot) => {
    if (new Date(lot.date_peremption) < Date.now()) {
      acc[0].value += 1;
    } else {
      acc[1].value += 1;
    }
    return acc;
  }, [
    { name: "expired", value: 0 },
    { name: "available", value: 0 }
  ]);

  // Log the chart data to check if it's being processed correctly
  console.log("Chart data:", chartData);

  const COLORS = ['#FF6B6B', '#4ECB71']; // Red for expired, Green for available
  
  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  // Only render the chart if we have data with non-zero values
  const hasData = chartData.some(item => item.value > 0);


  return (
    <div className="nbr-produits">
      <h3 className="text-lg font-medium mb-4">Lots Status</h3>
      <div className="chart-container">
        {hasData ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">No data available</p>
          </div>
        )}
      </div>
      <div className="flex justify-center mt-4">
        <div className="flex items-center mr-4">
          <div className="w-4 h-4 bg-red-500 mr-2"></div>
          <span>Expired: {chartData[0].value}</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-green-500 mr-2"></div>
          <span>Available: {chartData[1].value}</span>
        </div>
      </div>
    </div>
  );
}