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

module.exports = {
  colors,
  log
};