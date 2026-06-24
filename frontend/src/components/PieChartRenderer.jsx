import { useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#a4de6c', '#d0ed57', '#ff7300'];

export default function PieChartRenderer({ data, config }) {
    const chartData = useMemo(() => {
        if (!data || !data.length) return [];

        const aggregated = {};
        
        data.forEach(txn => {
            const xValue = txn[config.xAxisField] || 'Unknown';
            
            // Filter by multiCheckSelection if it is not empty
            if (config.multiCheckSelection.length > 0 && !config.multiCheckSelection.includes(xValue)) {
                return;
            }

            const yValue = parseFloat(txn[config.yAxisField] || 0);

            if (!aggregated[xValue]) {
                aggregated[xValue] = 0;
            }
            aggregated[xValue] += yValue;
        });

        // Convert to array and filter out zeros/negatives for pie chart typically
        let result = Object.keys(aggregated).map(key => ({
            name: key,
            value: aggregated[key]
        }));
        
        // Ensure values are positive for pie chart
        result = result.filter(item => item.value > 0);
        result.sort((a, b) => b.value - a.value); // Sort descending

        return result;
    }, [data, config.xAxisField, config.yAxisField, config.multiCheckSelection]);

    if (!chartData || !chartData.length) {
        return <div style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>No Data Available</div>;
    }

    return (
        <ResponsiveContainer width="100%" height={500}>
            <PieChart>
                <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={180}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                    {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                <Legend />
            </PieChart>
        </ResponsiveContainer>
    );
}
