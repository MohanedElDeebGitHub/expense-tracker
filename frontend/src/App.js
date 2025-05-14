import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link as RouterLink } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import ProtectedRoute from './components/common/ProtectedRoute';

// Import Page Components
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import NotFoundPage from './pages/NotFoundPage'; // Ensure this file exists in pages/

import './App.css';

// Corrected HomePage to use RouterLink from react-router-dom
const HomePage = () => (
  <div style={{ padding: "20px", textAlign: 'center' }}>
    <h2>Home Page</h2>
    <p>Welcome to your Personal Expense Tracker!</p>
    <p>Please <RouterLink to="/login" className="home-link">login</RouterLink> or <RouterLink to="/register" className="home-link">register</RouterLink> to manage your expenses.</p>
  </div>
);

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <main className="container">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<DashboardPage />} />
            </Route>

            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;