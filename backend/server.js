const express = require('express');
const cors = require('cors');
const path = require('path');

// Load environment variables
// Looks for .env in the same directory as server.js (i.e., backend/.env)
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

// --- Import database configuration ONCE ---
const { connectDB, sequelize } = require('./config/database');
// -----------------------------------------

const authRoutes = require('./routes/authRoutes');
const expenseRoutes = require('./routes/expenseRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to Database
connectDB();

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // To parse JSON bodies
app.use(express.urlencoded({ extended: false })); // To parse URL-encoded bodies

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/expenses', expenseRoutes);

// Basic route for testing
app.get('/', (req, res) => {
  res.send('Expense Tracker API Running');
});

// Sync Sequelize models with the database
// { alter: true } attempts to update tables to match models.
// Use with caution in production; migrations are generally preferred for schema changes.
sequelize.sync({ alter: true })
  .then(() => {
    console.log('Database schema synced with models.');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => {
    console.error('Error syncing database or starting server:', err);
    // If the database connection itself failed in connectDB(), that would have exited the process.
    // This catch is more for issues during sync() or app.listen() if connectDB() was successful.
  });