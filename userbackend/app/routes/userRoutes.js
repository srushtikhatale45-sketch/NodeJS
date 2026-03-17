const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Colors for terminal output (optional - can be added to your main server file)
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

// Optional: Route logging middleware
router.use((req, res, next) => {
  const timestamp = new Date().toLocaleTimeString();
  console.log(`${colors.cyan}[${timestamp}]${colors.reset} ${req.method} ${req.originalUrl}`);
  next();
});

// ============ USER ROUTES ============

/**
 * @route   GET /api/users
 * @desc    Get all users
 * @access  Public
 */
router.get('/', userController.getAllUsers);

/**
 * @route   GET /api/users/:id
 * @desc    Get single user by ID
 * @access  Public
 */
router.get('/:id', userController.getUserById);

/**
 * @route   POST /api/users
 * @desc    Create a new user
 * @access  Public
 */
router.post('/', userController.createUser);

/**
 * @route   POST /api/users/login
 * @desc    Login user
 * @access  Public
 */
router.post('/login', userController.loginUser);

/**
 * @route   PUT /api/users/:id
 * @desc    Update a user
 * @access  Public
 */
router.put('/:id', userController.updateUser);

/**
 * @route   DELETE /api/users/:id
 * @desc    Delete a user
 * @access  Public
 */
router.delete('/:id', userController.deleteUser);

module.exports = router;