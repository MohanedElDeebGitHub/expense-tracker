import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const ProtectedRoute = () => {
  const { currentUser } = useAuth();
  const location = useLocation(); // To redirect back to the attempted page after login

  if (!currentUser) {
    // If not logged in, redirect to login page
    // Pass the current location in state so we can redirect back after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If logged in, render the child route content
  return <Outlet />;
};

export default ProtectedRoute;