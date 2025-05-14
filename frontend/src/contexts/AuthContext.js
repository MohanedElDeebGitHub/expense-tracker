import React, { createContext, useState, useEffect, useContext } from 'react';
import authService from '../services/authService';
import apiClient from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(authService.getCurrentUser());
  const [loading, setLoading] = useState(false); // For discrete auth operations
  const [authError, setAuthError] = useState(null); // Specific to auth operations

  useEffect(() => {
    // This effect synchronizes the apiClient's auth header with the currentUser state.
    // It runs on mount and whenever currentUser changes.
    if (currentUser && currentUser.token) {
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${currentUser.token}`;
    } else {
      delete apiClient.defaults.headers.common['Authorization'];
    }
  }, [currentUser]);

  const login = async (accname, accpassword) => {
    setLoading(true);
    setAuthError(null);
    try {
      const user = await authService.login({ accname, accpassword });
      setCurrentUser(user); // This will trigger the useEffect above
      setLoading(false);
      return user; // Return user for potential immediate use in component
    } catch (err) {
      const errorMessage = err.message || (err.response && err.response.data && err.response.data.message) || 'Failed to login. Please check your credentials.';
      setAuthError(errorMessage);
      setLoading(false);
      throw new Error(errorMessage); // Re-throw for component to catch
    }
  };

  const register = async (name, accname, accpassword) => {
    setLoading(true);
    setAuthError(null);
    try {
      const user = await authService.register({ name, accname, accpassword });
      setCurrentUser(user); // This will trigger the useEffect above
      setLoading(false);
      return user;
    } catch (err) {
      const errorMessage = err.message || (err.response && err.response.data && err.response.data.message) || 'Failed to register. Please try again.';
      setAuthError(errorMessage);
      setLoading(false);
      throw new Error(errorMessage);
    }
  };

  const logout = () => {
    // No async operation needed for frontend logout typically, unless calling a backend endpoint
    authService.logout(); // Clears localStorage
    setCurrentUser(null); // Clears user state, triggering useEffect for apiClient
    setAuthError(null); // Clear any lingering auth errors
    // Navigation should be handled by the component calling logout
  };

  const value = {
    currentUser,
    login,
    register,
    logout,
    loadingAuth: loading, // Renamed to avoid conflict with other loading states
    authError,
    setAuthError // Allow components to clear auth errors if needed
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};