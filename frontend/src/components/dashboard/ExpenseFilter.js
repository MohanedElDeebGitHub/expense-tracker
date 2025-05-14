import React, { useState } from 'react';

const ExpenseFilter = ({ onSubmit }) => {
  const [category, setCategory] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [month, setMonth] = useState(''); // For month/year filter
  const [year, setYear] = useState(new Date().getFullYear().toString()); // Default to current year

  const categories = [
    "Groceries", "Rent/Mortgage", "Utilities", "Transportation", "Entertainment",
    "Healthcare", "Dining Out", "Shopping", "Travel", "Education", "Other"
  ];

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    const filters = {};
    if (category) filters.category = category;
    if (startDate) filters.startDate = startDate;
    if (endDate) filters.endDate = endDate;
    if (month && year) { // Only apply month/year if both are set
        filters.month = month;
        filters.year = year;
    }
    onSubmit(filters);
  };

  const handleClearFilters = () => {
    setCategory('');
    setStartDate('');
    setEndDate('');
    setMonth('');
    setYear(new Date().getFullYear().toString());
    onSubmit({}); // Submit empty filters to reset
  };

  // Generate year options (e.g., last 5 years to next 5 years)
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 11 }, (_, i) => (currentYear - 5 + i).toString());
  const monthOptions = [
      { value: "1", label: "January" }, { value: "2", label: "February" },
      { value: "3", label: "March" }, { value: "4", label: "April" },
      { value: "5", label: "May" }, { value: "6", label: "June" },
      { value: "7", label: "July" }, { value: "8", label: "August" },
      { value: "9", label: "September" }, { value: "10", label: "October" },
      { value: "11", label: "November" }, { value: "12", label: "December" }
  ];


  return (
    <form onSubmit={handleFilterSubmit} className="filter-form">
      <div className="filter-group">
        <label htmlFor="filter-category">Category:</label>
        <select
          id="filter-category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">All</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="filter-startDate">Start Date:</label>
        <input
          type="date"
          id="filter-startDate"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
      </div>

      <div className="filter-group">
        <label htmlFor="filter-endDate">End Date:</label>
        <input
          type="date"
          id="filter-endDate"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </div>

      <div className="filter-group filter-group-separator">
        <label>Or Filter by Month/Year:</label>
      </div>

       <div className="filter-group">
        <label htmlFor="filter-month">Month:</label>
        <select
            id="filter-month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
        >
            <option value="">Select Month</option>
            {monthOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="filter-year">Year:</label>
        <select
            id="filter-year"
            value={year}
            onChange={(e) => setYear(e.target.value)}
        >
            {yearOptions.map(y => (
                <option key={y} value={y}>{y}</option>
            ))}
        </select>
      </div>


      <div className="filter-actions">
        <button type="submit">Apply Filters</button>
        <button type="button" onClick={handleClearFilters} className="clear-filters-btn">Clear Filters</button>
      </div>
    </form>
  );
};

export default ExpenseFilter;