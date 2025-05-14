const { Sequelize } = require('sequelize');
// Corrected path assuming .env is in the 'backend' directory,
// and this file is in 'backend/config'
require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });


// Add these lines for debugging:
console.log('Attempting to load .env from:', require('path').join(__dirname, '../../.env'));
console.log('DB_HOST from env:', process.env.DB_HOST);
console.log('DB_USER from env:', process.env.DB_USER);
console.log('DB_PASSWORD from env exists:', !!process.env.DB_PASSWORD); // Check if it exists, don't log password
console.log('DB_NAME from env:', process.env.DB_NAME);


const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    logging: false,
  }
);
const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('MySQL Connected...');
  } catch (err) {
    console.error('Unable to connect to the database:', err);
    process.exit(1); // Exit process with failure
  }
};

module.exports = { sequelize, connectDB };