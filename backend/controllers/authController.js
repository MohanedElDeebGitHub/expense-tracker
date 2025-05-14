const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config({ path: '../.env' });

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d', // Token expires in 30 days
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  const { name, accname, accpassword } = req.body;

  if (!name || !accname || !accpassword) {
    return res.status(400).json({ message: 'Please add all fields' });
  }

  try {
    // Check if user exists
    const userExists = await User.findOne({ where: { accname } });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create user (password will be hashed by the model hook)
    const user = await User.create({
      name,
      accname,
      accpassword,
    });

    if (user) {
      res.status(201).json({
        _id: user.userid,
        name: user.name,
        accname: user.accname,
        token: generateToken(user.userid),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

// @desc    Authenticate a user (login)
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  const { accname, accpassword } = req.body;

  if (!accname || !accpassword) {
    return res.status(400).json({ message: 'Please provide account name and password' });
  }

  try {
    // Check for user by accname
    const user = await User.findOne({ where: { accname } });

    if (user && (await user.comparePassword(accpassword))) {
      res.json({
        _id: user.userid,
        name: user.name,
        accname: user.accname,
        token: generateToken(user.userid),
      });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

// @desc    Get user data
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
    // req.user is set by the authMiddleware
    if (req.user) {
        res.status(200).json({
            userid: req.user.userid,
            name: req.user.name,
            accname: req.user.accname,
        });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};


module.exports = {
  registerUser,
  loginUser,
  getMe,
};