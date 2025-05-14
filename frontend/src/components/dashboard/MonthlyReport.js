import React from 'react';

const MonthlyReport = ({ expenses, selectedMonth, selectedYear }) => {
  if (!expenses || expenses.length === 0) {
    return <p>No expenses to report for the selected period.</p>;
  }

  // Calculate total expenses for the given list (which should be pre-filtered)
  const total = expenses.reduce((sum, expense) => sum + parseFloat(expense.amount), 0);

  // Group by category
  const expensesByCategory = expenses.reduce((acc, expense) => {
    const category = expense.category;
    if (!acc[category]) {
      acc[category] = 0;
    }
    acc[category] += parseFloat(expense.amount);
    return acc;
  }, {});

  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const reportTitle = selectedMonth && selectedYear
    ? `Report for ${monthNames[parseInt(selectedMonth, 10) - 1]} ${selectedYear}`
    : "Overall Expense Summary";


  return (
    <div className="monthly-report">
      <h4>{reportTitle}</h4>
      <p><strong>Total Expenses: ${total.toFixed(2)}</strong></p>
      <h5>Expenses by Category:</h5>
      {Object.keys(expensesByCategory).length > 0 ? (
        <ul>
          {Object.entries(expensesByCategory).map(([category, amount]) => (
            <li key={category}>
              {category}: ${amount.toFixed(2)}
            </li>
          ))}
        </ul>
      ) : (
        <p>No specific category data for this period.</p>
      )}
    </div>
  );
};

export default MonthlyReport;