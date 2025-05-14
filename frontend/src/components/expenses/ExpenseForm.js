import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext'; // To potentially get userid if needed, though backend handles it

const ExpenseForm = ({ onSubmit, onCancel, initialData, isEditMode }) => {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [formError, setFormError] = useState('');
  // const { currentUser } = useAuth(); // Not strictly needed if backend uses req.user.userid

  // Pre-fill form if in edit mode
  useEffect(() => {
    if (isEditMode && initialData) {
      setAmount(initialData.amount || '');
      setCategory(initialData.category || '');
      // Dates from backend might be full ISO strings, ensure yyyy-mm-dd for input type="date"
      setDate(initialData.date ? new Date(initialData.date).toISOString().split('T')[0] : '');
      setDescription(initialData.description || '');
    } else {
      // Default date to today for new expenses
      setDate(new Date().toISOString().split('T')[0]);
      setAmount('');
      setCategory('');
      setDescription('');
    }
  }, [isEditMode, initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError('');
    if (!amount || !category || !date) {
      setFormError('Amount, Category, and Date are required.');
      return;
    }
    if (isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
        setFormError('Please enter a valid positive amount.');
        return;
    }

    onSubmit({
      amount: parseFloat(amount),
      category,
      date,
      description,
    });

    // Optionally clear form if not in edit mode, or let parent handle it
    if (!isEditMode) {
        setAmount('');
        setCategory('');
        setDate(new Date().toISOString().split('T')[0]);
        setDescription('');
    }
  };

  // Define some common expense categories
  const categories = [
    "Groceries", "Rent/Mortgage", "Utilities", "Transportation", "Entertainment",
    "Healthcare", "Dining Out", "Shopping", "Travel", "Education", "Other"
  ];

  return (
    <form onSubmit={handleSubmit} className="expense-form">
      <h3>{isEditMode ? 'Edit Expense' : 'Add New Expense'}</h3>
      {formError && <p className="error-message">{formError}</p>}
      <div>
        <label htmlFor="amount">Amount:</label>
        <input
          type="number"
          id="amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="e.g., 50.00"
          step="0.01"
          required
        />
      </div>
      <div>
        <label htmlFor="category">Category:</label>
        <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
        >
            <option value="" disabled>Select a category</option>
            {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
            ))}
        </select>
      </div>
      <div>
        <label htmlFor="date">Date:</label>
        <input
          type="date"
          id="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="description">Description (Optional):</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows="3"
          placeholder="e.g., Weekly grocery shopping"
        />
      </div>
      <div className="form-actions">
        <button type="submit">{isEditMode ? 'Save Changes' : 'Add Expense'}</button>
        {onCancel && ( // Show cancel button if onCancel prop is provided (useful for edit mode)
          <button type="button" onClick={onCancel} className="cancel-button">
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default ExpenseForm;