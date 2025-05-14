import React from 'react';

const ExpenseItem = ({ expense, onEdit, onDelete }) => {
  const { expenseid, amount, category, date, description } = expense;

  const formattedDate = new Date(date).toLocaleDateString('en-CA'); // YYYY-MM-DD for consistency

  return (
    <li className="expense-item">
      <div className="expense-details">
        <span className="expense-date">{formattedDate}</span>
        <strong className="expense-category">{category}</strong>
        <span className="expense-amount">${parseFloat(amount).toFixed(2)}</span>
        {description && <p className="expense-description">{description}</p>}
      </div>
      <div className="expense-actions">
        <button onClick={() => onEdit(expense)} className="edit-btn">Edit</button>
        <button onClick={() => onDelete(expenseid)} className="delete-btn">Delete</button>
      </div>
    </li>
  );
};

export default ExpenseItem;