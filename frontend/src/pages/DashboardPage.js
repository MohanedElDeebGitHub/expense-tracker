import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import expenseService from '../services/expenseService';
import ExpenseForm from '../components/expenses/ExpenseForm';
import ExpenseList from '../components/expenses/ExpenseList';
import ExpenseFilter from '../components/dashboard/ExpenseFilter';
import MonthlyReport from '../components/dashboard/MonthlyReport';
// import LoadingSpinner from '../components/common/LoadingSpinner'; // Already used in ExpenseList

const DashboardPage = () => {
  const { currentUser } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [isLoading, setIsLoading] = useState(false); // Global loading for entire data set
  const [error, setError] = useState(null);

  const [isEditing, setIsEditing] = useState(false);
  const [currentExpense, setCurrentExpense] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const [activeFilters, setActiveFilters] = useState({});

  // Stable function for fetching expenses, memoized with useCallback
  const stableFetchExpenses = useCallback(async (filtersToUse) => {
    setIsLoading(true);
    setError(null); // Clear previous errors before a new fetch
    try {
      const data = await expenseService.getExpenses(filtersToUse);
      setExpenses(data);
    } catch (err) {
      console.error("Fetch expenses error:", err);
      setError(err.message || 'Failed to fetch expenses. Please try again.');
      setExpenses([]); // Clear expenses on error to avoid showing stale data
    } finally {
      setIsLoading(false);
    }
  }, []); // Empty dependency array means this function is created once and is stable

  // Effect to fetch expenses when currentUser or activeFilters change
  useEffect(() => {
    if (currentUser) {
      stableFetchExpenses(activeFilters);
    } else {
      // If user logs out, clear expenses
      setExpenses([]);
    }
  }, [currentUser, activeFilters, stableFetchExpenses]); // stableFetchExpenses is stable, but include for completeness

  // Helper function to handle successful form submissions (add/edit)
  const handleFormSubmitSuccess = () => {
    setShowForm(false);
    setIsEditing(false);
    setCurrentExpense(null);
    // Re-fetch expenses with the current active filters
    // This is important if the add/edit operation could affect the filtered view
    stableFetchExpenses(activeFilters);
  };

  const handleAddExpense = async (expenseData) => {
    // setError(null); // Error state is handled globally by stableFetchExpenses
    // setIsLoading(true); // Handled by stableFetchExpenses
    try {
      await expenseService.addExpense(expenseData);
      handleFormSubmitSuccess();
    } catch (err) {
      // If addExpense service call fails, set an error.
      // The form itself might also have specific error handling.
      setError(err.message || 'Failed to add expense. Please check your input.');
      // setIsLoading(false); // If stableFetchExpenses isn't called on error, ensure loading is false
    }
  };

  const handleUpdateExpense = async (expenseData) => {
    if (!currentExpense || !currentExpense.expenseid) return;
    // setError(null);
    // setIsLoading(true);
    try {
      await expenseService.updateExpense(currentExpense.expenseid, expenseData);
      handleFormSubmitSuccess();
    } catch (err) {
      setError(err.message || 'Failed to update expense. Please check your input.');
      // setIsLoading(false);
    }
  };

  const handleDeleteExpense = async (expenseId) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      // setIsLoading(true); // Handled by stableFetchExpenses
      try {
        await expenseService.deleteExpense(expenseId);
        stableFetchExpenses(activeFilters); // Re-fetch with current filters
      } catch (err) {
        setError(err.message || 'Failed to delete expense.');
        // setIsLoading(false);
      }
    }
  };

  const handleEditClick = (expense) => {
    setIsEditing(true);
    setCurrentExpense(expense);
    setShowForm(true);
    setError(null); // Clear general errors when opening form
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setCurrentExpense(null);
    setShowForm(false);
    setError(null); // Clear general errors
  };

  const handleAddNewClick = () => {
    setIsEditing(false);
    setCurrentExpense(null);
    setShowForm(true);
    setError(null); // Clear general errors
  };

  // This function is called by ExpenseFilter component when filters are applied
  const handleFilterSubmit = (filtersFromForm) => {
    setActiveFilters(filtersFromForm); // This state change will trigger the useEffect to re-fetch
  };

  return (
    <div className="dashboard-container" style={{ padding: "20px" }}>
      <h2>Dashboard</h2>
      {currentUser && (
        <p style={{ marginBottom: "20px" }}>
          Welcome, {currentUser.name || currentUser.accname}!
        </p>
      )}

      {/* Display general errors here, not when form is active (form might have its own errors) */}
      {error && !showForm && <p className="error-message" style={{ marginBottom: "20px"}}>{error}</p>}

      <div className="dashboard-content">
        <div className="dashboard-section card expense-management">
          {!showForm && (
            <button onClick={handleAddNewClick} className="add-new-expense-btn" style={{marginBottom: "20px"}}>
              Add New Expense
            </button>
          )}

          {showForm && (
            <ExpenseForm
              onSubmit={isEditing ? handleUpdateExpense : handleAddExpense}
              onCancel={handleCancelEdit}
              initialData={isEditing ? currentExpense : null}
              isEditMode={isEditing}
            />
          )}
          <ExpenseList
            expenses={expenses}
            onEdit={handleEditClick}
            onDelete={handleDeleteExpense}
            //isLoading for the list is true if global isLoading is true AND form is not shown
            // (as form submission might also set global isLoading)
            isLoading={isLoading && !showForm}
            error={null} // General errors are displayed above; list specific errors could be handled differently if needed
          />
        </div>

        <div className="dashboard-section card filters-and-reports">
          <h3>Filters & Reports</h3>
          <ExpenseFilter onSubmit={handleFilterSubmit} />
          <MonthlyReport
            expenses={expenses} // Pass the current (possibly filtered) list of expenses
            selectedMonth={activeFilters.month}
            selectedYear={activeFilters.year}
          />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;