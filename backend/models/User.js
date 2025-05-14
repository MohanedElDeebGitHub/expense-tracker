const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const bcrypt = require('bcryptjs');

const User = sequelize.define('User', {
  userid: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  accname: { // This will be the username for login
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  accpassword: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName: 'users', // Explicitly tell Sequelize the table name
  hooks: {
    beforeCreate: async (user) => {
      if (user.accpassword) {
        const salt = await bcrypt.genSalt(10);
        user.accpassword = await bcrypt.hash(user.accpassword, salt);
      }
    },
    beforeUpdate: async (user) => {
      if (user.changed('accpassword')) { // Only hash if password is changed
        const salt = await bcrypt.genSalt(10);
        user.accpassword = await bcrypt.hash(user.accpassword, salt);
      }
    }
  }
});

// Method to compare password
User.prototype.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.accpassword);
};

module.exports = User;