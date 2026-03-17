const User = require('../models/userModel');
const bcrypt = require('bcrypt'); // You'll need to install this

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
  cyan: '\x1b[36m'
};

const log = (message, color = colors.blue) => {
  const timestamp = new Date().toLocaleTimeString();
  console.log(`${colors.dim}[${timestamp}]${colors.reset} ${color}${message}${colors.reset}`);
};

// @desc    Get all users
// @route   GET /api/users
// @access  Public (consider making this private in production)
exports.getAllUsers = async (req, res) => {
  log('📋 FETCHING ALL USERS', colors.cyan);
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] }, // Don't send passwords
      order: [['createdAt', 'DESC']]
    });
    
    res.json(users);
  } catch (error) {
    log(`❌ Error fetching users: ${error.message}`, colors.red);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Public
exports.getUserById = async (req, res) => {
  const id = req.params.id;
  log(`📋 FETCHING USER #${id}`, colors.cyan);
  
  try {
    const user = await User.findByPk(id, {
      attributes: { exclude: ['password'] }
    });

    if (!user) {
      log(`❌ User #${id} not found`, colors.red);
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    log(`❌ Error fetching user: ${error.message}`, colors.red);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
};

// @desc    Create new user
// @route   POST /api/users
// @access  Public
exports.createUser = async (req, res) => {
  log('➕ CREATING NEW USER', colors.cyan);
  try {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
      log('❌ Invalid input: all fields are required', colors.red);
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    // Check if user exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      log(`❌ User with email ${email} already exists`, colors.red);
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword
    });

    log('✅ USER CREATED SUCCESSFULLY', colors.green);
    
    // Remove password from response
    const userResponse = newUser.toJSON();
    delete userResponse.password;
    
    res.status(201).json(userResponse);
  } catch (error) {
    log(`❌ Error creating user: ${error.message}`, colors.red);
    res.status(500).json({ error: 'Failed to create user' });
  }
};

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Public (consider authentication)
exports.updateUser = async (req, res) => {
  const id = req.params.id;
  log(`✏️ UPDATING USER #${id}`, colors.cyan);
  
  try {
    const { name, email, password } = req.body;
    const user = await User.findByPk(id);

    if (!user) {
      log(`❌ User #${id} not found`, colors.red);
      return res.status(404).json({ error: 'User not found' });
    }

    // Update fields
    if (name) user.name = name;
    if (email) {
      // Check if email is taken
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser && existingUser.id !== parseInt(id)) {
        return res.status(400).json({ error: 'Email already in use' });
      }
      user.email = email;
    }
    if (password) {
      const saltRounds = 10;
      user.password = await bcrypt.hash(password, saltRounds);
    }
    
    await user.save();

    log(`✅ USER #${id} UPDATED SUCCESSFULLY`, colors.green);
    
    const userResponse = user.toJSON();
    delete userResponse.password;
    
    res.json(userResponse);
  } catch (error) {
    log(`❌ Error updating user: ${error.message}`, colors.red);
    res.status(500).json({ error: 'Failed to update user' });
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Public (consider authentication)
exports.deleteUser = async (req, res) => {
  const id = req.params.id;
  log(`🗑️ DELETING USER #${id}`, colors.cyan);
  
  try {
    const user = await User.findByPk(id);

    if (!user) {
      log(`❌ User #${id} not found`, colors.red);
      return res.status(404).json({ error: 'User not found' });
    }

    console.log(`${colors.yellow}Deleting user: ${user.name} (${user.email})${colors.reset}`);
    
    await user.destroy();

    log(`✅ USER #${id} DELETED SUCCESSFULLY`, colors.green);
    res.status(204).send();
  } catch (error) {
    log(`❌ Error deleting user: ${error.message}`, colors.red);
    res.status(500).json({ error: 'Failed to delete user' });
  }
};

// @desc    Login user
// @route   POST /api/users/login
// @access  Public
exports.loginUser = async (req, res) => {
  log('🔐 USER LOGIN ATTEMPT', colors.cyan);
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user
    const user = await User.findOne({ where: { email } });
    if (!user) {
      log(`❌ Login failed: User not found with email ${email}`, colors.red);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      log(`❌ Login failed: Invalid password for ${email}`, colors.red);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    log(`✅ Login successful: ${user.name} (${user.email})`, colors.green);
    
    const userResponse = user.toJSON();
    delete userResponse.password;
    
    res.json({ 
      message: 'Login successful',
      user: userResponse 
    });
  } catch (error) {
    log(`❌ Error during login: ${error.message}`, colors.red);
    res.status(500).json({ error: 'Login failed' });
  }
};