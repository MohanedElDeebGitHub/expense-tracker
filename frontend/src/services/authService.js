import apiClient from './api';

const register = async (userData) => {
  try {
    const response = await apiClient.post('/auth/register', userData);
    if (response.data && response.data.token) {
      // Store user and token (e.g., in localStorage)
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  } catch (error) {
    throw error.response.data || error.message;
  }
};

const login = async (userData) => {
  try {
    const response = await apiClient.post('/auth/login', userData);
    if (response.data && response.data.token) {
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  } catch (error) {
    throw error.response.data || error.message;
  }
};

const logout = () => {
  localStorage.removeItem('user');
  // Potentially call a backend logout endpoint if you have one
};

const getCurrentUser = () => {
  try {
    return JSON.parse(localStorage.getItem('user'));
  } catch (error) {
    return null; // Or handle error appropriately
  }
};

// Optional: Fetch user profile if needed separately
const getMe = async () => {
    try {
        const response = await apiClient.get('/auth/me');
        return response.data;
    } catch (error) {
        throw error.response.data || error.message;
    }
};

const authService = {
  register,
  login,
  logout,
  getCurrentUser,
  getMe
};

export default authService;