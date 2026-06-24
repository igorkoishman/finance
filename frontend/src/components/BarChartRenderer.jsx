import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#a4de6c', '#d0ed57', '#ff7300'];

export default function BarChartRenderer({ data, config }) {
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

        // Convert to array
        let result = Object.keys(aggregated).map(key => ({
            name: key,
            value: aggregated[key]
        }));
        
        result.sort((a, b) => b.value - a.value); // Sort descending

        return result;
    }, [data, config.xAxisField, config.yAxisField, config.multiCheckSelection]);

    if (!chartData || !chartData.length) {
        return <div style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>No Data Available</div>;
    }

    return (
        <ResponsiveContainer width="100%" height={500}>
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                <XAxis dataKey="name" stroke="#666" />
                <YAxis stroke="#666" />
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                <Legend />
                <Bar dataKey="value" name={`Total ${config.yAxisField}`}>
                    {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    );
}
