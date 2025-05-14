import apiClient from './api';

// Get all expenses (with optional filters)
// filters: { category, startDate, endDate, month, year }
const getExpenses = async (filters = {}) => {
  try {
    const response = await apiClient.get('/expenses', { params: filters });
    return response.data;
  } catch (error) {
    throw error.response.data || error.message;
  }
};

const addExpense = async (expenseData) => {
  try {
    const response = await apiClient.post('/expenses', expenseData);
    return response.data;
  } catch (error) {
    throw error.response.data || error.message;
  }
};

const updateExpense = async (id, expenseData) => {
  try {
    const response = await apiClient.put(`/expenses/${id}`, expenseData);
    return response.data;
  } catch (error) {
    throw error.response.data || error.message;
  }
};

const deleteExpense = async (id) => {
  try {
    const response = await apiClient.delete(`/expenses/${id}`);
    return response.data;
  } catch (error) {
    throw error.response.data || error.message;
  }
};

const expenseService = {
  getExpenses,
  addExpense,
  updateExpense,
  deleteExpense,
};

export default expenseService;