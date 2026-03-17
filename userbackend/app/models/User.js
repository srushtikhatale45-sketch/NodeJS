const { DataTypes } = require('sequelize');
const { sequelize } = require('../utils/db');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  age: {
    type: DataTypes.INTEGER,
    validate: {
      min: 0,
      max: 150
    }
  },
  phone: {
    type: DataTypes.STRING
  },
  address: {
    type: DataTypes.TEXT
  }
}, {
  timestamps: true
});

module.exports = User;