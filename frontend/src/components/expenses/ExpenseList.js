import React from 'react';
import ExpenseItem from './ExpenseItem';

const ExpenseList = ({ expenses, onEdit, onDelete, isLoading, error }) => {
  if (isLoading) {
    // Reverted to text loading indicator
    return <p style={{ textAlign: 'center', padding: '20px', color: '#555' }}>Loading expenses...</p>;
  }

  // Display error if not loading and error exists
  if (error) {
    const errorMessage = typeof error === 'string' ? error : (error?.message || "An unknown error occurred.");
    return <p className="error-message">Error fetching expenses: {errorMessage}</p>;
  }

  if (!expenses || expenses.length === 0) {
    return <p style={{ textAlign: 'center', padding: '20px', color: '#555' }}>No expenses found. Add one to get started!</p>;
  }

  return (
    <ul className="expense-list">
      {expenses.map((expense) => (
        <ExpenseItem
          key={expense.expenseid}
          expense={expense}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
};

export default ExpenseList;