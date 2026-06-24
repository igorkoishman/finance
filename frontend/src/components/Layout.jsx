import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { LogOut, BarChart2, Table as TableIcon } from 'lucide-react';
import './Layout.css';

export default function Layout({ setAuth }) {
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = async () => {
        try {
            await axios.post('/finance/auth/v1/logout');
            setAuth(false);
            navigate('/finance/auth/v1/login');
        } catch (err) {
            console.error('Logout failed', err);
        }
    };

    return (
        <div className="layout-container">
            <nav className="top-nav">
                <div className="nav-brand">Finance App</div>
                <div className="nav-links">
                    <Link to="/finance/dashboard/v1/graph" className={`nav-link ${location.pathname.includes('/graph') ? 'active' : ''}`}>
                        <BarChart2 size={18} /> Graph
                    </Link>
                    <Link to="/finance/dashboard/v1/table" className={`nav-link ${location.pathname.includes('/table') ? 'active' : ''}`}>
                        <TableIcon size={18} /> Table
                    </Link>
                </div>
                <button className="logout-btn" onClick={handleLogout}>
                    <LogOut size={18} /> Logout
                </button>
            </nav>
            <main className="main-content">
                <Outlet />
            </main>
        </div>
    );
}
