const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const User = require('./User'); // Import User model for association

const Expense = sequelize.define('Expense', {
  expenseid: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  userid: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'userid',
    },
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  date: {
    type: DataTypes.DATEONLY, // Stores only the date part
    allowNull: false,
  },
}, {
  tableName: 'expenses', // Explicitly tell Sequelize the table name
});

// Define Associations
User.hasMany(Expense, { foreignKey: 'userid', onDelete: 'CASCADE' });
Expense.belongsTo(User, { foreignKey: 'userid' });

module.exports = Expense;