import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './Navbar.css'; // We'll create this CSS file

const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login'); // Redirect to login after logout
    } catch (error) {
      console.error("Failed to logout", error);
      // Handle logout error (e.g., display a message)
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          ExpenseTracker
        </Link>
        <ul className="nav-menu">
          <li className="nav-item">
            <Link to="/" className="nav-links">
              Home
            </Link>
          </li>
          {currentUser ? (
            <>
              <li className="nav-item">
                <Link to="/dashboard" className="nav-links">
                  Dashboard
                </Link>
              </li>
              <li className="nav-item">
                <span className="nav-links-user">Hi, {currentUser.name || currentUser.accname}!</span>
              </li>
              <li className="nav-item">
                <button onClick={handleLogout} className="nav-links nav-button-logout">
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li className="nav-item">
                <Link to="/login" className="nav-links">
                  Login
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/register" className="nav-links">
                  Register
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;