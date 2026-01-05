import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Login from './components/Login';
import DonorDashboard from './components/DonorDashboard';
import SeekerDashboard from './components/SeekerDashboard';
import DashboardLayout from './components/DashboardLayout';
// --- IMPORT NEW COMPONENT ---
import ForgotPassword from './components/ForgotPassword'; 

import './App.css';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const userType = localStorage.getItem('userType');

  const handleLogin = (newToken, type) => {
    localStorage.setItem('token', newToken);
    localStorage.setItem('userType', type);
    setToken(newToken);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
    setToken(null);
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* LOGIN PAGE */}
        <Route 
          path="/login"
          element={!token ? <Login onLogin={handleLogin} /> : <Navigate to="/" />}
        />

        {/* --- FORGOT PASSWORD ROUTE --- */}
        <Route 
          path="/forgot-password" 
          element={<ForgotPassword />} 
        />

        {/* PROTECTED DASHBOARD ROUTES */}
        <Route 
          path="/"
          element={token ? <DashboardLayout onLogout={handleLogout} /> : <Navigate to="/login" />}
        >
          {/* Redirect home based on userType */}
          <Route 
            index
            element={
              userType === 'donor' ? (
                <Navigate to="/dashboard/donor" />
              ) : userType === 'seeker' ? (
                <Navigate to="/dashboard/seeker" />
              ) : (
                <p>No dashboard found for your user type.</p>
              )
            }
          />

          {/* Donor Dashboard */}
          <Route path="dashboard/donor" element={<DonorDashboard />} />

          {/* Seeker Dashboard */}
          <Route path="dashboard/seeker" element={<SeekerDashboard />} />
        </Route>

        {/* CATCH ALL */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;