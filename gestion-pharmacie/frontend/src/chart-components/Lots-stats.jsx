import { useRouteLoaderData } from "react-router-dom";
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

export default function Lots_stats() {
  const { lots } = useRouteLoaderData('parent');

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

  const COLORS = ['#00296b', '#00b2ff'];
  const hasData = chartData.some(item => item.value > 0);

  const renderCustomizedLabel = ({ name, percent }) => {
    return `${name} ${(percent * 100).toFixed(0)}%`;
  };
  

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
      <div className="legend">
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: COLORS[0] }}></div>
          <span className="legend-text">Expired: {chartData[0].value}</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: COLORS[1] }}></div>
          <span className="legend-text">Available: {chartData[1].value}</span>
        </div>
      </div>
    </div>
  );
}