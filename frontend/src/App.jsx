// frontend/src/App.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import DestinationDetail from './pages/DestinationDetail';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    setIsAuthenticated(!!token);
    setIsAdmin(user.isAdmin || false);
  }, []);

  const handleLogin = (userData) => {
    setIsAuthenticated(true);
    setIsAdmin(userData.isAdmin || false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setIsAdmin(false);
  };

  // Protected Route Component
  const ProtectedRoute = ({ children }) => {
    return isAuthenticated ? children : <Navigate to="/login" />;
  };

  // Admin Route Component
  const AdminRoute = ({ children }) => {
    return isAuthenticated && isAdmin ? children : <Navigate to="/" />;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar 
        isAuthenticated={isAuthenticated} 
        isAdmin={isAdmin}
        onLogout={handleLogout} 
      />
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/register" element={<Register onLogin={handleLogin} />} />
        <Route path="/destination/:id" element={<DestinationDetail />} />
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin" 
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          } 
        />
      </Routes>
    </div>
  );
}

export default App;