import { useEffect, useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import './TransactionGraph.css';

export default function TransactionGraph() {
    const [data, setData] = useState([]);
    const [groupByField, setGroupByField] = useState('category'); // default grouping
    const [availableFields] = useState(['category', 'txnType', 'paymentMethod', 'actor', 'sourceName']);

    useEffect(() => {
        axios.get('/api/transactions')
             .then(res => setData(res.data))
             .catch(err => console.error(err));
    }, []);

    // Transform data for Recharts
    const chartData = useMemo(() => {
        if (!data.length) return [];

        const aggregated = {};
        const uniqueKeys = new Set();

        data.forEach(txn => {
            if (!txn.txnMonth || !txn.amount) return;
            const monthStr = txn.txnMonth.substring(0, 7); // e.g., 2023-05
            const groupKey = txn[groupByField] || 'Unknown';
            uniqueKeys.add(groupKey);

            if (!aggregated[monthStr]) {
                aggregated[monthStr] = { month: monthStr };
            }
            if (!aggregated[monthStr][groupKey]) {
                aggregated[monthStr][groupKey] = 0;
            }
            aggregated[monthStr][groupKey] += parseFloat(txn.amount);
        });

        // Convert to array and sort by month
        return {
            lines: Array.from(uniqueKeys),
            data: Object.values(aggregated).sort((a, b) => a.month.localeCompare(b.month))
        };
    }, [data, groupByField]);

    // Generate colors for lines
    const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#a4de6c', '#d0ed57'];

    return (
        <div className="graph-container">
            <div className="graph-header">
                <h2>Transaction Trends</h2>
                <div className="control-group">
                    <label>Group By:</label>
                    <select value={groupByField} onChange={(e) => setGroupByField(e.target.value)}>
                        {availableFields.map(field => (
                            <option key={field} value={field}>{field}</option>
                        ))}
                    </select>
                </div>
            </div>
            
            <div className="chart-wrapper">
                {chartData.data && chartData.data.length > 0 ? (
                    <ResponsiveContainer width="100%" height={500}>
                        <LineChart data={chartData.data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                            <XAxis dataKey="month" stroke="#666" />
                            <YAxis stroke="#666" />
                            <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                            <Legend />
                            {chartData.lines.map((key, idx) => (
                                <Line 
                                    key={key}
                                    type="monotone" 
                                    dataKey={key} 
                                    stroke={colors[idx % colors.length]} 
                                    strokeWidth={3}
                                    dot={{ r: 4 }}
                                    activeDot={{ r: 8 }} 
                                />
                            ))}
                        </LineChart>
                    </ResponsiveContainer>
                ) : (
                    <div style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>Loading or No Data Available</div>
                )}
            </div>
        </div>
    );
}
