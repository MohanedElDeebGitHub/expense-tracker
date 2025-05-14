const { Op } = require('sequelize'); // For advanced querying like date ranges
const Expense = require('../models/Expense');
const User = require('../models/User'); // Though not directly used here for now, good to have if needed

// @desc    Get all expenses for the logged-in user
// @route   GET /api/expenses
// @access  Private
const getExpenses = async (req, res) => {
  try {
    const { category, startDate, endDate, month, year } = req.query;
    const whereClause = { userid: req.user.userid }; // Filter by logged-in user

    if (category) {
      whereClause.category = category;
    }

    if (startDate && endDate) {
      whereClause.date = {
        [Op.between]: [new Date(startDate), new Date(endDate)],
      };
    } else if (startDate) {
      whereClause.date = {
        [Op.gte]: new Date(startDate), // Greater than or equal to
      };
    } else if (endDate) {
      whereClause.date = {
        [Op.lte]: new Date(endDate), // Less than or equal to
      };
    }

    // Monthly report: If month and year are provided
    if (month && year) {
        const numericMonth = parseInt(month, 10); // month is 1-12
        const numericYear = parseInt(year, 10);

        if (isNaN(numericMonth) || numericMonth < 1 || numericMonth > 12 || isNaN(numericYear)) {
            return res.status(400).json({ message: 'Invalid month or year for report' });
        }

        // Calculate the first and last day of the specified month
        const firstDayOfMonth = new Date(numericYear, numericMonth - 1, 1);
        const lastDayOfMonth = new Date(numericYear, numericMonth, 0); // Day 0 of next month is last day of current

        whereClause.date = {
            [Op.between]: [firstDayOfMonth, lastDayOfMonth],
        };
    }


    const expenses = await Expense.findAll({
      where: whereClause,
      order: [['date', 'DESC']], // Default sort by date descending
    });
    res.status(200).json(expenses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching expenses' });
  }
};

// @desc    Add a new expense
// @route   POST /api/expenses
// @access  Private
const addExpense = async (req, res) => {
  const { amount, category, date, description } = req.body;

  if (!amount || !category || !date) {
    return res.status(400).json({ message: 'Please provide amount, category, and date' });
  }

  try {
    const expense = await Expense.create({
      amount,
      category,
      date,
      description: description || null, // Optional field
      userid: req.user.userid, // Associate with logged-in user
    });
    res.status(201).json(expense);
  } catch (error) {
    console.error(error);
    if (error.name === 'SequelizeValidationError') {
        return res.status(400).json({ message: error.errors.map(e => e.message).join(', ') });
    }
    res.status(500).json({ message: 'Server error adding expense' });
  }
};

// @desc    Update an existing expense
// @route   PUT /api/expenses/:id
// @access  Private
const updateExpense = async (req, res) => {
  const { id } = req.params;
  const { amount, category, date, description } = req.body;

  try {
    const expense = await Expense.findOne({
      where: { expenseid: id, userid: req.user.userid }, // Ensure user owns the expense
    });

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found or user not authorized' });
    }

    // Update fields if they are provided
    if (amount !== undefined) expense.amount = amount;
    if (category !== undefined) expense.category = category;
    if (date !== undefined) expense.date = date;
    if (description !== undefined) expense.description = description;

    await expense.save();
    res.status(200).json(expense);
  } catch (error) {
    console.error(error);
     if (error.name === 'SequelizeValidationError') {
        return res.status(400).json({ message: error.errors.map(e => e.message).join(', ') });
    }
    res.status(500).json({ message: 'Server error updating expense' });
  }
};

// @desc    Delete an expense
// @route   DELETE /api/expenses/:id
// @access  Private
const deleteExpense = async (req, res) => {
  const { id } = req.params;

  try {
    const expense = await Expense.findOne({
      where: { expenseid: id, userid: req.user.userid }, // Ensure user owns the expense
    });

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found or user not authorized' });
    }

    await expense.destroy();
    res.status(200).json({ expenseid: id, message: 'Expense deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error deleting expense' });
  }
};

module.exports = {
  getExpenses,
  addExpense,
  updateExpense,
  deleteExpense,
};