// @desc    Get user by email
// @route   GET /api/users/email/:email
// @access  Public
exports.getUserByEmail = async (req, res) => {
  const email = req.params.email;
  log(`🔍 FETCHING USER WITH EMAIL: ${email}`, colors.cyan);
  
  try {
    const user = await User.findOne({ 
      where: { email },
      attributes: { exclude: ['password'] }
    });

    if (!user) {
      log(`❌ User with email ${email} not found`, colors.red);
      return res.status(404).json({ 
        success: false,
        error: 'User not found' 
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    log(`❌ Error fetching user: ${error.message}`, colors.red);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch user' 
    });
  }
};

// @desc    Logout user
// @route   POST /api/users/logout
// @access  Private
exports.logoutUser = async (req, res) => {
  log('🚪 USER LOGOUT', colors.cyan);
  try {
    // Here you would typically invalidate the token/session
    // For now, just return success message
    res.status(200).json({ 
      success: true,
      message: 'Logged out successfully' 
    });
  } catch (error) {
    log(`❌ Error during logout: ${error.message}`, colors.red);
    res.status(500).json({ 
      success: false,
      error: 'Logout failed' 
    });
  }
};

// @desc    Change user password
// @route   PUT /api/users/:id/change-password
// @access  Private
exports.changePassword = async (req, res) => {
  const id = req.params.id;
  log(`🔐 CHANGING PASSWORD FOR USER #${id}`, colors.cyan);
  
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ 
        success: false,
        error: 'User not found' 
      });
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ 
        success: false,
        error: 'Current password is incorrect' 
      });
    }

    // Hash new password
    const saltRounds = 10;
    user.password = await bcrypt.hash(newPassword, saltRounds);
    await user.save();

    log(`✅ PASSWORD CHANGED FOR USER #${id}`, colors.green);
    
    res.status(200).json({ 
      success: true,
      message: 'Password changed successfully' 
    });
  } catch (error) {
    log(`❌ Error changing password: ${error.message}`, colors.red);
    res.status(500).json({ 
      success: false,
      error: 'Failed to change password' 
    });
  }
};

// @desc    Delete all users
// @route   DELETE /api/users
// @access  Private/Admin
exports.deleteAllUsers = async (req, res) => {
  log('🗑️ DELETING ALL USERS', colors.cyan);
  
  try {
    // This is a dangerous operation, so we'll add a safety check
    const { confirm } = req.query;
    
    if (confirm !== 'YES') {
      return res.status(400).json({ 
        success: false,
        error: 'Please confirm deletion with ?confirm=YES' 
      });
    }

    const count = await User.count();
    await User.destroy({ where: {}, truncate: true });
    
    log(`✅ DELETED ${count} USERS SUCCESSFULLY`, colors.green);
    
    res.status(200).json({ 
      success: true,
      message: `Successfully deleted ${count} users` 
    });
  } catch (error) {
    log(`❌ Error deleting all users: ${error.message}`, colors.red);
    res.status(500).json({ 
      success: false,
      error: 'Failed to delete users' 
    });
  }
};

// @desc    Create multiple users
// @route   POST /api/users/bulk
// @access  Private/Admin
exports.bulkCreateUsers = async (req, res) => {
  log('📦 BULK CREATING USERS', colors.cyan);
  
  try {
    const { users } = req.body;
    
    if (!users || !Array.isArray(users) || users.length === 0) {
      return res.status(400).json({ 
        success: false,
        error: 'Please provide an array of users' 
      });
    }

    // Hash passwords for all users
    const usersWithHashedPasswords = await Promise.all(
      users.map(async (user) => {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(user.password, saltRounds);
        return {
          ...user,
          password: hashedPassword,
          email: user.email.toLowerCase().trim()
        };
      })
    );

    const createdUsers = await User.bulkCreate(usersWithHashedPasswords);
    
    // Remove passwords from response
    const usersResponse = createdUsers.map(user => {
      const u = user.toJSON();
      delete u.password;
      return u;
    });

    log(`✅ CREATED ${createdUsers.length} USERS SUCCESSFULLY`, colors.green);
    
    res.status(201).json({ 
      success: true,
      message: `Successfully created ${createdUsers.length} users`,
      data: usersResponse
    });
  } catch (error) {
    log(`❌ Error bulk creating users: ${error.message}`, colors.red);
    res.status(500).json({ 
      success: false,
      error: 'Failed to create users' 
    });
  }
};

// @desc    Get user statistics
// @route   GET /api/users/stats/count
// @access  Private/Admin
exports.getUserStats = async (req, res) => {
  log('📊 FETCHING USER STATISTICS', colors.cyan);
  
  try {
    const totalUsers = await User.count();
    
    // Get users created in the last 7 days
    const last7Days = new Date();
    last7Days.setDate(last7Days.getDate() - 7);
    
    const newUsersLastWeek = await User.count({
      where: {
        createdAt: {
          [Op.gte]: last7Days
        }
      }
    });

    res.status(200).json({ 
      success: true,
      data: {
        totalUsers,
        newUsersLastWeek,
        timestamp: new Date()
      }
    });
  } catch (error) {
    log(`❌ Error fetching stats: ${error.message}`, colors.red);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch statistics' 
    });
  }
};