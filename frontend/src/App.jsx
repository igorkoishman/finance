import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import axios from 'axios'
import Login from './components/Login'
import Register from './components/Register'
import Layout from './components/Layout'
import TransactionGraph from './components/TransactionGraph'
import TransactionTable from './components/TransactionTable'
import ImportDashboard from './components/ImportDashboard'

// Ensure cookies are sent with every request for session persistence
axios.defaults.withCredentials = true;

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if the user has an active session
    axios.get('/finance/auth/v1/me')
      .then(res => {
        if (res.status === 200) {
          setIsAuthenticated(true);
        }
      })
      .catch(() => {
        setIsAuthenticated(false);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Loading...</div>;
  }

  return (
    <Router>
      <Routes>
        <Route path="/finance/auth/v1/login" element={<Login setAuth={setIsAuthenticated} />} />
        <Route path="/finance/auth/v1/register" element={<Register />} />
        
        {/* Protected Dashboard Routes */}
        <Route 
          path="/finance/dashboard/v1" 
          element={isAuthenticated ? <Layout setAuth={setIsAuthenticated} /> : <Navigate to="/finance/auth/v1/login" />}
        >
          <Route index element={<Navigate to="graph" replace />} />
          <Route path="graph" element={<TransactionGraph />} />
          <Route path="table" element={<TransactionTable />} />
          <Route path="import" element={<ImportDashboard />} />
        </Route>

        <Route path="*" element={<Navigate to={isAuthenticated ? "/finance/dashboard/v1" : "/finance/auth/v1/login"} />} />
      </Routes>
    </Router>
  )
}

export default App
