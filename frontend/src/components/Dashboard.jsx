import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import axios from 'axios';
import './Dashboard.css';

export default function Dashboard() {
    const [data, setData] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('/api/graph/data');
                setData(response.data);
            } catch (err) {
                if (err.response && err.response.status === 401) {
                    navigate('/login');
                }
            }
        };
        fetchData();
    }, [navigate]);

    const handleLogout = async () => {
        try {
            await axios.post('/api/auth/logout');
            navigate('/login');
        } catch (err) {
            console.error('Logout failed', err);
        }
    };

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <h2>Finance Dashboard</h2>
                <button onClick={handleLogout} className="logout-button">Logout</button>
            </header>
            <main className="dashboard-content">
                <div className="chart-card">
                    <h3>Monthly Revenue vs. Profit</h3>
                    <div className="chart-wrapper">
                        <ResponsiveContainer width="100%" height={400}>
                            <LineChart
                                data={data}
                                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                                <XAxis dataKey="name" stroke="#666" />
                                <YAxis stroke="#666" />
                                <Tooltip 
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                />
                                <Legend />
                                <Line 
                                    type="monotone" 
                                    dataKey="pv" 
                                    stroke="#8884d8" 
                                    strokeWidth={3}
                                    activeDot={{ r: 8 }} 
                                    name="Revenue" 
                                />
                                <Line 
                                    type="monotone" 
                                    dataKey="uv" 
                                    stroke="#82ca9d" 
                                    strokeWidth={3}
                                    name="Profit" 
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </main>
        </div>
    );
}
