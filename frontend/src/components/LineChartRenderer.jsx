import { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#f97316', '#14b8a6', '#6366f1'];

export default function LineChartRenderer({ data, config }) {
    const chartData = useMemo(() => {
        if (!data || !data.length) return { lines: [], data: [] };

        const aggregated = {};
        const uniqueLines = new Set();
        
        const hasBreakdown = config.breakdownField && config.breakdownField !== 'none';

        data.forEach(txn => {
            const xValue = txn[config.xAxisField] || 'Unknown';
            const yValue = parseFloat(txn[config.yAxisField] || 0);
            
            const lineKey = hasBreakdown ? (txn[config.breakdownField] || 'Unknown') : 'total';
            uniqueLines.add(lineKey);

            if (!aggregated[xValue]) {
                aggregated[xValue] = { name: xValue };
            }
            if (!aggregated[xValue][lineKey]) {
                aggregated[xValue][lineKey] = 0;
            }
            
            aggregated[xValue][lineKey] += yValue;
        });

        const sortedData = Object.values(aggregated).sort((a, b) => a.name.localeCompare(b.name));
        return {
            lines: Array.from(uniqueLines).sort(),
            data: sortedData
        };
    }, [data, config.xAxisField, config.yAxisField, config.breakdownField]);

    if (!chartData.data || !chartData.data.length) {
        return <div style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>No Data Available in Range</div>;
    }

    return (
        <ResponsiveContainer width="100%" height={500}>
            <LineChart data={chartData.data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                <XAxis dataKey="name" stroke="#666" />
                <YAxis stroke="#666" />
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                <Legend />
                {chartData.lines.map((lineKey, index) => (
                    <Line 
                        key={lineKey}
                        type="monotone" 
                        dataKey={lineKey} 
                        name={lineKey === 'total' ? `Total ${config.yAxisField}` : lineKey}
                        stroke={COLORS[index % COLORS.length]} 
                        strokeWidth={3}
                        dot={{ r: 4 }}
                        activeDot={{ r: 8 }} 
                    />
                ))}
            </LineChart>
        </ResponsiveContainer>
    );
}
