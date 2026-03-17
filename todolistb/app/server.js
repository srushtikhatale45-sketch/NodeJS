const express = require('express');
const cors = require('cors');
require('dotenv').config();
const sequelize = require('./utils/db');
const morgan = require('morgan');

// Import routes
const todoRoutes = require('./routes/todoRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Colors for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  red: '\x1b[31m'
};

// Helper function for logging
const log = (message, color = colors.blue) => {
  const timestamp = new Date().toLocaleTimeString();
  console.log(`${colors.dim}[${timestamp}]${colors.reset} ${color}${message}${colors.reset}`);
};

// CORS configuration
const corsOptions = {
  origin: ['http://localhost:5173', 'http://localhost:5174'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type'],
  credentials: true
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/todos', todoRoutes);
app.use('/api/users', userRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Todo API Server',
    endpoints: {
      todos: 'http://localhost:' + PORT + '/api/todos',
      users: 'http://localhost:' + PORT + '/api/users'
    }
  });
});

// Database connection and server start
sequelize.authenticate()
  .then(() => {
    log('✅ DATABASE CONNECTED SUCCESSFULLY', colors.green);
    console.log(`   Host: ${process.env.DB_HOST || 'localhost'}:5432`);
    console.log(`   Database: ${process.env.DB_NAME || 'todolist'}`);
    
    return sequelize.sync({ alter: true }); // This will update tables without dropping data
  })
  .then(() => {
    log('✅ DATABASE SYNCED SUCCESSFULLY', colors.green);
    
    // Start server
    app.listen(PORT, () => {
      console.log('\n' + '='.repeat(60));
      log(`🚀 SERVER STARTED`, colors.bright + colors.green);
      console.log('='.repeat(60));
      console.log(`${colors.cyan}📡 Server:${colors.reset} http://localhost:${PORT}`);
      console.log(`${colors.cyan}📋 Todos API:${colors.reset} http://localhost:${PORT}/api/todos`);
      console.log(`${colors.cyan}👥 Users API:${colors.reset} http://localhost:${PORT}/api/users`);
      console.log(`${colors.cyan}🗄️  Database:${colors.reset} PostgreSQL (${process.env.DB_NAME || 'todolist'})`);
      console.log('='.repeat(60) + '\n');
    });
  })
  .catch((err) => {
    log(`❌ DATABASE CONNECTION FAILED: ${err.message}`, colors.red);
    console.error(err);
    process.exit(1);
  });

// Graceful shutdown
process.on('SIGINT', () => {
  log('👋 Shutting down server...', colors.yellow);
  sequelize.close().then(() => {
    log('✅ Database connection closed', colors.green);
    process.exit(0);
  });
});